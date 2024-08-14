import db from "../../models/index.cjs";
import axios from "axios";
import { getOdbcConnection } from "../../database/connectionOdbc.js";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../../utils/httpStatusCodes.js";
import { dteSe } from "../../helpers/jsonBuilder.js";
import { dteSign, loginMHApi, sendEmail } from "../../helpers/feApis.js";
import { incrementCorrelative } from "../../helpers/correlatives.js";
import dayjs from "dayjs";

export const getSeDocsOdbcByDateRange = async (req, res) => {
    try {
        const seDocs = await getSeOdbData(req.params.initialDate, req.params.finalDate);
        return res.json({ message: '¡Busqueda completada!', seDocs: seDocs.map(docs => docs[0]) || null });
    } catch (error) {
        console.log(error);
        return res.status(INTERNAL_SERVER_ERROR).json({ message: "Error interno del servidor" });
    }
};

export const sendSeToMh = async (req, res) => {
    try {
        if (!req.params.initialDate || !req.params.finalDate || !req.body.documents || req.body.documents.length == 0) {
            return res.status(BAD_REQUEST).json({ message: "Los datos enviados son incorrectos" });
        }

        // to save results
        const mhResultError = [];
        const mhResultSuccess = [];

        const documents = req.body.documents;
        const seDocs = await getSeOdbData(req.params.initialDate, req.params.finalDate); // getting documents
        const api = await db.ApiCredential.findOne({ where: { code: 'MH_FE_API' } }); // api info

        if (!api) {
            throw "No se encontró registro de api del MH para FE.";
        }

        //creating the dtes json, and filtering the ones that are going to be sent
        for (const doc of seDocs.filter((d) => documents.includes(d[0].PostOrder))) {
            //creating the dte json depending on the document type
            const dte = await dteSe(doc, req.params.emissionDate);
            const dteSigned = await dteSign(dte);

            // getting mh api token
            const token = await loginMHApi();

            let result = null;
            try {
                //sending the dte to MH
                result = await axios.post(api.url.concat('/fesv/recepciondte'), {
                    "ambiente": api.sandbox ? '00' : '01',
                    "idEnvio": Date.now(),
                    "version": 1,
                    "tipoDte": dte.identificacion.tipoDte,
                    "documento": dteSigned,
                }, {
                    headers: {
                        "content-type": "application/json",
                        'Authorization': token
                    }
                });
            } catch (error) {
                if (error.hasOwnProperty('response'))
                    mhResultError.push({ doc, response: error.response.data });
                else
                    mhResultError.push({ doc, response: "Error desconocido." });

                continue;
            }

            //in case of error, the document is not going to be saved
            if (result.data.estado != "PROCESADO") {
                mhResultError.push({ doc, response: result.data });
                continue;
            }

            //incrementing the correlative
            await incrementCorrelative(dte.identificacion.tipoDte);

            // adding stamp to dteJson
            dte.identificacion.selloRecibido = result.data.selloRecibido;

            const customer = await db.Customer.findOne({ where: { oldId: doc[0].ProviderId } });

            //saving the document
            await db.Document.create({
                generationCode: dte.identificacion.codigoGeneracion,
                controlNumber: dte.identificacion.numeroControl,
                receivedStamp: result.data.selloRecibido,
                dteType: dte.identificacion.tipoDte,
                dateEmitted: dte.identificacion.fecEmi,
                dateProcessed: dayjs().format("YYYY-MM-DD"),
                dteJson: JSON.stringify(dte),
                mhResponse: JSON.stringify(result.data),
                state: 1,
                referenceId: doc[0].PostOrder,
                customerId: customer.id
            });

            //saving the result of the transaction
            mhResultSuccess.push({ doc, response: { ...result.data, numeroControl: dte.identificacion.numeroControl } });
            //sending email
            try {
                sendEmail(dte);
            } catch (error) {
                console.log(error);
            }
        }
        
        return res.status(200).json({ message: "Transacción exitosa.", result: { success: mhResultSuccess, error: mhResultError } });
    } catch (error) {
        console.log(error);
        return res.status(INTERNAL_SERVER_ERROR).json({ message: typeof error === 'string' ? error : 'Error al enviar documentos al MH.' });
    }
};

// --- GENERAL FUNCTIONS ---
const seQuery = (initialDate, finalDate) => {
    return `
        SELECT 
            JrnlRow.PostOrder,
            Vendors.VendorID as ProviderId,
            Vendors.VendorID as Dui_Nrc,
            Vendors.CustomField0 as NIT,
            Vendors.Name as ProviderName,
            Vendors.Email as Correo,
            Vendors.PhoneNumber as Telefono,
            Case when JrnlHdr.CustomerInvoiceNo = 'FSE' then '14' End as TipoDocumento,
            Case 
                when LineItem.ItemClass = '1' then '1'
                when LineItem.ItemClass = '4' then '2'
            Else 
                '3'
            End as TipoItem,
            LineItem.ItemID,
            jrnlrow.RowDescription,
            JrnlRow.Quantity as Quantity,
            '99' as UnidadMedida,
            Case 
                when LineItem.ItemID = 'ISR 10%' then 0.00 
            Else 
                JrnlRow.UnitCost 
            End as PrecioUnitario,
            Case 
                when LineItem.ItemID = 'ISR 10%' then JrnlRow.Amount * -1 
            Else 
                0.00 
            End as RentaRete,
            Case 
                when LineItem.ItemID = 'ISR 10%' then 1
            Else 
                0
            End As Deduccion,
            Case 
                when JrnlHdr.MainAmount < 0 then JrnlHdr.MainAmount * -1 
            Else 
                JrnlHdr.MainAmount 
            End as DocTotal
        FROM   
            {oj (((JrnlHdr JrnlHdr 
        INNER JOIN 
            JrnlRow JrnlRow ON JrnlHdr.PostOrder=JrnlRow.PostOrder) 
        INNER JOIN 
            Vendors Vendors ON JrnlRow.VendorRecordNumber=Vendors.VendorRecordNumber) 
        LEFT OUTER JOIN 
            LineItem LineItem ON JrnlRow.ItemRecordNumber=LineItem.ItemRecordNumber) 
        INNER JOIN 
            Address Address ON Vendors.VendorRecordNumber=Address.VendorRecordNumber}
        WHERE  
            JrnlHdr.CustomerInvoiceNo='FSE' 
            AND JrnlRow.Journal = 4 
            AND JrnlRow.RowNumber <> 0 
            AND JrnlHdr.Reference not like '%V%'
            AND JrnlHdr.TransactionDate >= '${initialDate}'
            AND JrnlHdr.TransactionDate <= '${finalDate}'
    `;
}

const getSeOdbData = async (initialDate, finalDate) => {
    const connection = await getOdbcConnection();
    const seDocs = await connection.query(seQuery(initialDate, finalDate));
    // Cierra la conexión
    await connection.close();

    if (seDocs.length == 0) {
        return []
    }

    // getting info about customers in data base
    const customers = await db.Customer.findAll({ attributes: ['id', 'oldId'] });
    const customerIds = customers.map(customer => customer.oldId); // creating an array to improve the indexing

    //merging lines with the same PostOrder
    const dataMerged = [];
    for (const doc of seDocs) {
        const index = dataMerged.findIndex((d) => d.findIndex((l) => l.PostOrder == doc.PostOrder) != -1);
        if (index == -1) {
            dataMerged.push([{ ...doc, hasCustomerRecord: customerIds.includes(doc.ProviderId) }]);
        } else {
            dataMerged[index].push({ ...doc, hasCustomerRecord: customerIds.includes(doc.ProviderId) });
        }
    }

    // now, cleaning rows with ISR id an adding as a field
    const dataCleaned = []
    for (const doc of dataMerged) {
        const renta = doc.find(line => (line.ItemID || '').includes('ISR'))?.RentaRete || 0;
        dataCleaned.push(doc.filter(line => !(line.ItemID || '').includes('ISR')).map(line => ({...line, RentaRete: renta})))
    }

    // filtering documents already sent to mh
    const dataFiltered = [];
    for (const doc of dataCleaned) {
        if (await db.Document.count({ where: { referenceId: doc[0].PostOrder } }) < 1) {
            dataFiltered.push(doc);
        }
    }

    return dataFiltered;
};