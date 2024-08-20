import db from "../../models/index.cjs";
import { INTERNAL_SERVER_ERROR } from "../../utils/httpStatusCodes.js";

export const getDepartmentsActive = async (_, res) => {
    try {
        const departments = await db.Department.findAll({ where: { state: 1 } });
        res.json(departments);
    } catch (error) {
        console.log(error);
        res.status(INTERNAL_SERVER_ERROR).json({ message: "Error al obtener los departamentos" });
    }
};