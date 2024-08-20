import db from "../../models/index.cjs";
import { INTERNAL_SERVER_ERROR } from "../../utils/httpStatusCodes.js";

export const getDocumentTypesActive = async (_, res) => {
    try {
        const docTypes = await db.DocumentType.findAll({ where: { state: 1 } });
        res.json(docTypes);
    } catch (error) {
        console.log(error);
        res.status(INTERNAL_SERVER_ERROR).json({ message: "Error al obtener los tipos de documentos" });
    }
};