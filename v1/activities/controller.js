import db from "../../models/index.cjs";
import { INTERNAL_SERVER_ERROR } from "../../utils/httpStatusCodes.js";

export const getActivitiesActive = async (_, res) => {
    try {
        const activities = await db.Activity.findAll({ where: { state: 1 } });
        res.json(activities);
    } catch (error) {
        console.log(error);
        res.status(INTERNAL_SERVER_ERROR).json({ message: "Error al obtener las actividades" });
    }
}