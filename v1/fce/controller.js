import db from "../../models/index.cjs";
import axios from "axios";
import { getOdbcConnection } from "../../database/connectionOdbc.js";
import { validationResult } from 'express-validator';
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../../utils/httpStatusCodes.js";
import { dteFc } from "../../helpers/jsonBuilder.js";
import { dteSign, loginMHApi } from "../../helpers/feApis.js";
import { incrementCorrelative } from "../../helpers/correlatives.js";

export const getInvoicesOdbcByDateRange = async (req, res) => {
    try {
        const fcDocs = await getInvoicesOdbData(req.params.initialDate, req.params.finalDate);
        return res.json({message: '¡Busqueda completada!', invoices: fcDocs.map(docs => docs[0]) || null});
    } catch (error) {
        console.log(error);
        return res.status(INTERNAL_SERVER_ERROR).json({ message: "Error interno del servidor" });
    }
};

export const sendFceToMh = async (req, res) => {
    try {
        if (!req.params.initialDate || !req.params.finalDate || !req.body.documents || req.body.documents.length == 0) {
            return res.status(BAD_REQUEST).json({ message: "Los datos enviados son incorrectos" });
        }

        // to save resuñts
        const mhResultError = [];
        const mhResultSuccess = [];

        const documents = req.body.documents;
        const fcDocs = await getInvoicesOdbData(req.params.initialDate, req.params.finalDate); // getting documents
        const api = await db.ApiCredential.findOne({ where: { code: 'MH_FE_API' } }); // api info

        if (!api) {
            throw "No se encontró registro de api del MH para FE.";
        }

        //creating the dtes json, and filtering the ones that are going to be sent
        for (const doc of fcDocs.filter((d) => documents.includes(d[0].PostOrder))) {
            //creating the dte json depending on the document type
            const dte = await dteFc(doc, req.params.emissionDate);
            const dteSigned = await dteSign(dte);

            // getting mh api token
            const token = await loginMHApi();

            let result = null;
            try {
                //sending the dte to MH
                result = await axios.post(api.url.concat('/fesv/recepciondte'), {
                    "ambiente": api.sandbox ? '00' : '01',
                    "idEnvio": Date.now(),
                    "version": dte.identificacion.tipoDte == "01" ? 1 : 3,
                    "tipoDte": dte.identificacion.tipoDte,
                    "documento": dteSigned,
                }, {  
                    headers: {
                        "content-type": "application/json",
                        'Authorization': token
                    }
                });
            } catch (error) {
                console.log(error);
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

            //saving the document

            //saving the result of the transaction
            mhResultSuccess.push({ doc, response: {...result.data, numeroControl: dte.identificacion.numeroControl} });
            //sending email
        }

        return res.status(200).json({ message: "Transacción exitosa.", result: { success: mhResultSuccess, error: mhResultError } });
    } catch (error) {
        return res.status(INTERNAL_SERVER_ERROR).json({ message: typeof error === 'string' ? error :  'Error al enviar documentos al MH.'});
    }
};


// --- GENERAL FUNCTIONS ---
const fcCcfQuery = (initialDate, finalDate) => {
    return `SELECT
        JrnlHdr.PostOrder,
        Customers.CustomerID,
        Customers.CustomField1 as NIT,
        Customers.Customer_Bill_Name as CustomerName,
        Customers.eMail_Address as Correo,
        Case
            when JrnlHdr.SalesTaxCode = 'IVAFin' and JrnlHdr.CustomerInvoiceNo = ''  then '01'
            when JrnlHdr.SalesTaxCode = 'ExeFin' and JrnlHdr.CustomerInvoiceNo = '' then '01'
            when JrnlHdr.SalesTaxCode = 'ExeCon' and JrnlHdr.CustomerInvoiceNo = ''then '03'
            when JrnlHdr.SalesTaxCode = 'IVACon' and JrnlHdr.CustomerInvoiceNo = '' then '03'
            when JrnlHdr.SalesTaxCode = 'IVAGran' and JrnlHdr.CustomerInvoiceNo = '' then '03'
            when JrnlHdr.SalesTaxCode = 'Export' and JrnlHdr.CustomerInvoiceNo = '' then '11'
            when JrnlHdr.SalesTaxCode = '' and JrnlHdr.CustomerInvoiceNo = 'FSE' then '14'
        End as TipoDocumento,	
        Case 
            when LineItem.ItemClass = '1' then '1'
            when LineItem.ItemClass = '4' then '2'
        End as TipoItem,
        LineItem.ItemID,
        LineItem.ItemDescription,
        JrnlRow.Quantity,
        JrnlRow.UnitCost as PrecioUnitario,
        Case
            when JrnlHdr.SalesTaxCode = 'ExeFin' and JrnlHdr.CustomerInvoiceNo = '' then '0.00'
            when JrnlHdr.SalesTaxCode = 'ExeCon' and JrnlHdr.CustomerInvoiceNo = ''then '0.00'
            when JrnlHdr.SalesTaxCode = 'Export' and JrnlHdr.CustomerInvoiceNo = '' then '0.00'
            when JrnlHdr.SalesTaxCode = '' and JrnlHdr.CustomerInvoiceNo = 'FSE' then '0.00'
        else
            (JrnlRow.UnitCost * JrnlRow.Quantity) * 0.13 
        End as IVAUnitario,
        Case
            when JrnlHdr.SalesTaxCode = 'ExeFin' and JrnlHdr.CustomerInvoiceNo = '' then '0.00'
            when JrnlHdr.SalesTaxCode = 'ExeCon' and JrnlHdr.CustomerInvoiceNo = ''then '0.00'
            when JrnlHdr.SalesTaxCode = 'Export' and JrnlHdr.CustomerInvoiceNo = '' then '0.00'
            when JrnlHdr.SalesTaxCode = '' and JrnlHdr.CustomerInvoiceNo = 'FSE' then '0.00'
        else
            JrnlHdr.MainAmount - ( JrnlHdr.MainAmount / 1.13)
        End as IVATotal,
        JrnlHdr.MainAmount as DocTotal
    FROM 
        JrnlHdr 
    INNER JOIN 
        JrnlRow ON JrnlHdr.PostOrder = JrnlRow.PostOrder 
    LEFT OUTER JOIN 
        Employee ON JrnlHdr.EmpRecordNumber = Employee.EmpRecordNumber 
    LEFT OUTER JOIN 
        Customers ON JrnlRow.CustomerRecordNumber = Customers.CustomerRecordNumber 
    LEFT OUTER JOIN 
        LineItem ON JrnlRow.ItemRecordNumber = LineItem.ItemRecordNumber 
    LEFT OUTER JOIN 
        Address ON JrnlRow.CustomerRecordNumber = Address.CustomerRecordNumber 
    WHERE                 
        JrnlRow.RowNumber >= 2
        and JrnlRow.RowType = 0
        and JrnlRow.Quantity <> 0
        and JrnlHdr.SalesTaxCode IN ('IVAFin', 'ExeFin', 'ExeCon', 'IVACon', 'IVAGran')
        and JrnlHdr.TransactionDate >= '${initialDate}'
        and JrnlHdr.TransactionDate <= '${finalDate}'
    `;
};

const getInvoicesOdbData = async (initialDate, finalDate) => {
    const connection = await getOdbcConnection();
    const fcDocs = await connection.query(fcCcfQuery(initialDate, finalDate));
    // Cierra la conexión
    await connection.close();

    if (fcDocs.length == 0) {
        return []
    }

    // getting info about customers in data base
    const customers = await db.Customer.findAll({ attributes: ['id', 'oldId'] });
    const customerIds = customers.map(customer => customer.oldId); // creating an array to improve the indexing

    //merging lines with the same PostOrder
    const dataMerged = [];
    for (const doc of fcDocs) {
        const index = dataMerged.findIndex((d) => d.findIndex((l) => l.PostOrder == doc.PostOrder) != -1);
        if (index == -1) {
            dataMerged.push([{...doc, hasCustomerRecord: customerIds.includes(doc.CustomerID)}]);
        } else {
            dataMerged[index].push({...doc, hasCustomerRecord: customerIds.includes(doc.CustomerID)});
        }
    }

    return dataMerged;
};