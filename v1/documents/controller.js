import db from "../../models/index.cjs";
import { Op } from "sequelize";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../../utils/httpStatusCodes.js";
import { dteInvalidate } from "../../helpers/jsonBuilder.js";
import { dteSign, generatePdf, loginMHApi, sendEmail } from "../../helpers/feApis.js";
import axios from "axios";
import dayjs from "dayjs";
import { executeHanaSelectQuery } from "../../database/connectionHana.js";

export const getDocumentsByRangeDate = async (req, res) => {
    try {
        const { initialDate, finalDate } = req.params;

        if (!initialDate || !finalDate) {
            return res.status(BAD_REQUEST).json({ message: 'Fechas de inicio y fin son requeridas.' });
        }

        // validate dates format
        const datePattern = /^\d{4}-\d{2}-\d{2}$/;
        if (!datePattern.test(initialDate) || !datePattern.test(finalDate)) {
            return res.status(BAD_REQUEST).json({ message: 'Formato de fecha inválido.' });
        }

        // validate initial date is less than final date
        if (initialDate > finalDate) {
            return res.status(BAD_REQUEST).json({ message: 'La fecha de inicio debe ser menor a la fecha fin.' });
        }

        const documents = await db.Document.findAll({
            attributes: {
                include: [
                    [db.sequelize.fn('FORMAT', db.sequelize.col('dateEmitted'), 'yyyy-MM-d'), 'dateEmitted'],
                    [db.sequelize.fn('FORMAT', db.sequelize.col('dateProcessed'), 'yyyy-MM-d'), 'dateProcessed']
                ]
            },
            where: {
                dateEmitted: { [Op.between]: [initialDate, finalDate] }
            }
        });

        return res.status(200).json(documents);
    } catch (error) {
        console.log(error);
        return res.status(INTERNAL_SERVER_ERROR).json({ message: typeof error === 'string' ? error : 'Error al consultar documentos electrónicos.' });
    }
};

export const getHanaDocumentsByRangeDate = async (req, res) => {
    try {
        const { initialDate, finalDate } = req.params;

        if (!initialDate || !finalDate) {
            return res.status(BAD_REQUEST).json({ message: 'Fechas de inicio y fin son requeridas.' });
        }

        // validate dates format
        const datePattern = /^\d{4}-\d{2}-\d{2}$/;
        if (!datePattern.test(initialDate) || !datePattern.test(finalDate)) {
            return res.status(BAD_REQUEST).json({ message: 'Formato de fecha inválido.' });
        }

        // validate initial date is less than final date
        if (initialDate > finalDate) {
            return res.status(BAD_REQUEST).json({ message: 'La fecha de inicio debe ser menor a la fecha fin.' });
        }

        // getting data from hana connection
        const result = await executeHanaSelectQuery(`SELECT * FROM "REAL_MAZEL"."B1View_FeJson" WHERE "FECHA" >= '${initialDate}' AND "FECHA" <= '${finalDate}' ORDER BY "DocNum" ASC`);
        
        const finalData = [];
        // append Json.parse value of the "Json" property of each row
        for (let i = 0; i < result.length; i++) {
            finalData.push({
                DocNum: result[i].DocNum,
                Json: result[i].JSON || null,
                Correo: result[i].CORREO || null,
                Fecha: result[i].FECHA,
            });

            let tempJson = null;
            try {
                tempJson = JSON.parse(finalData[i].Json || '{}');    
            } catch (error) {
                tempJson = null;
            }
            const document = await db.Document.findOne({ where: { generationCode: tempJson?.identificacion?.codigoGeneracion || '' } });

            if (document) {
                finalData[i].timesSent = document.timesSent;
            } else {
                finalData[i].timesSent = 0;
            }

            finalData[i].detail = tempJson?.identificacion || null;
            if (finalData[i].detail) {
                finalData[i].detail.selloRecibido = tempJson?.selloRecibido || null;
            }
        }

        return res.status(200).json(finalData);
    } catch (error) {
        console.log(error);
        return res.status(INTERNAL_SERVER_ERROR).json({ message: typeof error === 'string' ? error : 'Error al consultar documentos electrónicos.' });
    }
};

export const invalidateDocument = async (req, res) => {
    try {
        if (!req.body.id || !req.body.applicantName || !req.body.documentType || !req.body.documentNumber) {
            return res.status(BAD_REQUEST).json({ message: 'El nombre del solicitante, tipo y número de documento son requeridos.' });
        }

        const dte = await dteInvalidate(req.body, req.user.id);
        const dteSigned = await dteSign(dte);

        // getting mh api token
        const token = await loginMHApi();
        const api = await db.ApiCredential.findOne({ where: { code: 'MH_FE_API' } }); // api info

        let result = null;
        try {
            //sending the dte to MH
            result = await axios.post(api.url.concat('/fesv/anulardte'), {
                "ambiente": api.sandbox ? '00' : '01',
                "idEnvio": Date.now(),
                "version": 2,
                "documento": dteSigned,
            }, {
                headers: {
                    "content-type": "application/json",
                    'Authorization': token
                }
            });
            console.log("OKA", result.data);
            if (result?.data?.estado != "PROCESADO") {
                throw result?.data?.descripcionMsg || "Error al invalidar el documento.";
            }
        } catch (error) {
            console.log("NO OKA", error?.response?.data);
            if (error.hasOwnProperty('response'))
                return res.status(INTERNAL_SERVER_ERROR).json({ message: error.response?.data?.descripcionMsg || "Error al invalidar." });
            else
                return res.status(INTERNAL_SERVER_ERROR).json({ message: "Error desconocido al invalidar." });
        }

        // update document data
        await db.Document.update({
            state: 0,
            generationCodeInvl: result.data.codigoGeneracion,
            receivedStampInvl: result.data.selloRecibido,
            invalidationDate: dayjs().format('YYYY-MM-DD'),
            invalidationResponse: JSON.stringify(result.data)
        }, { where: { id: req.body.id } });

        return res.status(200).json({ message: 'Documento invalidado correctamente.', result: result.data });
    } catch (error) {
        console.log(error);
        return res.status(INTERNAL_SERVER_ERROR).json({ message: typeof error === 'string' ? error : 'Error al invalidar el documento.' });
    }
};

export const forwardEmail = async (req, res) => {
    let countSent = 0;
    try {
        if (!req.params.id) {
            throw 'El id del documento es requerido.';
        }

        const result = await executeHanaSelectQuery(`SELECT "JSON" AS "Json", "CORREO" AS "Correo" FROM "REAL_MAZEL"."B1View_FeJson" WHERE "DocNum" = '${req.params.id}'`);

        if (result.length === 0) {
            throw 'Documento no encontrado.';
        }
        const dte = JSON.parse(result[0].Json);
        if (!dte?.identificacion?.numeroControl) {
            throw 'Documento no cumple el esquema.';
        }
        dte.identificacion.selloRecibido = dte.selloRecibido;

        try {
            const resultEmail = await sendEmail(dte, result[0].Correo || null);
            if (!resultEmail?.ok) {
                throw 'Error al enviar el correo.';
            }

            // looking for document in db
            const document = await db.Document.findOne({ where: { generationCode: dte?.identificacion?.codigoGeneracion || '' } });
            if (!document) {
                // save document in db
                await db.Document.create({
                    generationCode: dte.identificacion.codigoGeneracion,
                    controlNumber: dte.identificacion.numeroControl,
                    receivedStamp: dte.selloRecibido,
                    referenceId: req.params.id,
                    timesSent: 1
                });
                countSent = 1;
            } else {
                // update times sent
                await db.Document.update({ timesSent: parseInt(document.timesSent || 0) + 1 }, { where: { generationCode: dte?.identificacion?.codigoGeneracion || '' } });
                countSent = parseInt(document.timesSent || 0) + 1;
            }
        } catch (error) {
            console.log(error);
            throw 'Error al enviar el correo.';
        }

        return res.status(200).json({ message: 'Correo reenviado correctamente.', result: { DocNum: req.params.id,  timesSent: countSent} });
    } catch (error) {
        console.log(error);
        return res.status(INTERNAL_SERVER_ERROR).json({ message: typeof error === 'string' ? error : 'Error al reenviar el correo.' });
    }
};

export const getPdf = async (req, res) => {
    try {
        if (!req.params.id) {
            throw 'El id del documento es requerido.';
        }

        const result = await executeHanaSelectQuery(`SELECT "JSON" AS "Json" FROM "REAL_MAZEL"."B1View_FeJson" WHERE "DocNum" = '${req.params.id}'`);

        if (result.length === 0) {
            throw 'Documento no encontrado.';
        }
        const dte = JSON.parse(result[0].Json);
        if (!dte?.identificacion?.numeroControl) {
            throw 'Documento no cumple el esquema.';
        }
        dte.identificacion.selloRecibido = dte.selloRecibido;
        
        // stream the pdf
        const pdf = await generatePdf(dte);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${dte.identificacion.codigoGeneracion || 'fesv'}.pdf""`);
        
        // Transmitir el stream del PDF directamente al cliente
        pdf.pipe(res);

        // Manejo de errores durante la transmisión
        pdf.on('error', (err) => {
            console.error('Error durante la transmisión del PDF:', err);
            res.status(500).send('Error al transmitir el PDF.');
        });

    } catch (error) {
        console.log(error);
        return res.status(INTERNAL_SERVER_ERROR).json({ message: typeof error === 'string' ? error : 'Error al generar el PDF.' });
    }
};