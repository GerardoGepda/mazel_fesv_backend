import db from "../../models/index.cjs";
import { validationResult } from 'express-validator';
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../../utils/httpStatusCodes.js";

export const getRoles = async (req, res) => {
    try {
        const roles = await db.Role.findAll();
        return res.json(roles);
    } catch (error) {
        console.log(error);
        res.status(INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
};

export const getRolePermissions = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(BAD_REQUEST).json({ errors: errors.array() });
        }
        
        const role = await db.Role.findByPk(req.params.id, {
            include: {
                model: db.Permission,
                include: {
                    model: db.Route
                }
            }
        });

        if (!role) {
            return res.status(BAD_REQUEST).json({ message: "El rol no existe" });
        }

        return res.json(role);
    } catch (error) {
        console.log(error);
        res.status(INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
};

export const createRole = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(BAD_REQUEST).json({ errors: errors.array() });
        }

        const role = await db.Role.create({ ...req.body });
        return res.json({ message: "Rol creado con éxito", role });
    } catch (error) {
        console.log(error);
        res.status(INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
};

export const updateRole = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(BAD_REQUEST).json({ errors: errors.array() });
        }

        const role = await db.Role.findByPk(req.params.id);

        if (!role) {
            return res.status(BAD_REQUEST).json({ message: "El rol no existe" });
        }

        await role.update({ ...req.body });
        return res.json({ message: "Rol actualizado con éxito", role });
    } catch (error) {
        console.log(error);
        res.status(INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
};

export const changeRoleState = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(BAD_REQUEST).json({ errors: errors.array() });
        }

        //search role by id
        const role = await db.Role.findByPk(req.params.id);

        if (!role) {
            return res.status(BAD_REQUEST).json({ message: "El rol no existe" });
        }

        await role.update({ state: req.body.state });
        return res.json({ message: "Estado del rol actualizado con éxito", role });
    } catch (error) {
        console.log(error);
        res.status(INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
};