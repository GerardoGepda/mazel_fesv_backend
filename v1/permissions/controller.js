import db from "../../models/index.cjs";
import { validationResult } from 'express-validator';
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../../utils/httpStatusCodes.js";

export const createPermission = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(BAD_REQUEST).json({ errors: errors.array() });
        }

        const newPermission = await db.Permission.create({ ...req.body });

        // Volver a consultar la instancia creada junto con sus asociaciones
        const permission = await db.Permission.findOne({
            where: { id: newPermission.id },
            include: [
                { model: db.Route },
                { model: db.Role }
            ]
        });
        return res.json({ message: "Permiso creado con éxito", permission });
    } catch (error) {
        console.log(error);
        res.status(INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
};

export const updatePermission = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(BAD_REQUEST).json({ errors: errors.array() });
        }

        const udaptePermission = await db.Permission.findByPk(req.params.id);

        if (!udaptePermission) {
            return res.status(BAD_REQUEST).json({ message: "El permiso no existe" });
        }

        await udaptePermission.update({ ...req.body });
        const permission = await db.Permission.findByPk(req.params.id, { include: [{ model: db.Route }, { model: db.Role }] });
        return res.json({ message: "Permiso actualizado con éxito", permission});
    } catch (error) {
        console.log(error);
        res.status(INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
};

export const changePermissionState = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(BAD_REQUEST).json({ errors: errors.array() });
        }

        const permission = await db.Permission.findByPk(req.params.id, { include: [{ model: db.Route }, { model: db.Role }] });

        if (!permission) {
            return res.status(BAD_REQUEST).json({ message: "El permiso no existe" });
        }

        await permission.update({ state: req.body.state });
        return res.json({ message: "Estado del permiso actualizado con éxito", permission });
    } catch (error) {
        console.log(error);
        res.status(INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
};