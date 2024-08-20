import db from "../../models/index.cjs";
import { Op } from "sequelize";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../../utils/httpStatusCodes.js";
import { dteInvalidate } from "../../helpers/jsonBuilder.js";
import { dteSign, loginMHApi } from "../../helpers/feApis.js";
import axios from "axios";

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

export const invalidateDocument = async (req, res) => {
    try {
        if (!req.body.id || !req.body.applicantName || !req.body.documentType || !req.body.documentNumber) {
            return res.status(BAD_REQUEST).json({ message: 'El nombre del solicitante, tipo y número de documento son requeridos.' });
        }

        const dte = await dteInvalidate(req.body);
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
        } catch (error) {
            console.log("NO OKA", error?.response?.data);
            if (error.hasOwnProperty('response'))
                return res.status(INTERNAL_SERVER_ERROR).json({ message: error.response?.data?.descripcionMsg || "Error al invalidar." });
            else
                return res.status(INTERNAL_SERVER_ERROR).json({ message: "Error desconocido al invalidar." });
        }

        // update document state
        await db.Document.update({ state: 0 }, { where: { id: req.body.id } });

        return res.status(200).json({ message: 'Documento invalidado correctamente.', result: result.data });
    } catch (error) {
        console.log(error);
        return res.status(INTERNAL_SERVER_ERROR).json({ message: typeof error === 'string' ? error : 'Error al invalidar el documento.' });
    }
};