import db from "../../models/index.cjs";
import { INTERNAL_SERVER_ERROR } from "../../utils/httpStatusCodes.js";

export const getMunicipalitiesActive = async (_, res) => {
    try {
        const municipalities = await db.Municipality.findAll({ where: { state: 1 } });
        res.json(municipalities);
    } catch (error) {
        console.log(error);
        res.status(INTERNAL_SERVER_ERROR).json({ message: "Error al obtener los municipios" });
    }
};