import db from "../../models/index.cjs";
import { validationResult } from 'express-validator';
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../../utils/httpStatusCodes.js";

export const getRoutes = async (req, res) => {
    try {
        const routes = await db.Route.findAll();
        return res.json(routes);
    } catch (error) {
        console.log(error);
        res.status(INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
};

export const createRoute = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(BAD_REQUEST).json({ errors: errors.array() });
        }

        const route = await db.Route.create({ ...req.body });
        return res.json({ message: "Ruta creada con éxito", route });
    } catch (error) {
        console.log(error);
        res.status(INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
};

export const updateRoute = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(BAD_REQUEST).json({ errors: errors.array() });
        }

        const route = await db.Route.findByPk(req.params.id);

        if (!route) {
            return res.status(BAD_REQUEST).json({ message: "La ruta no existe" });
        }

        await route.update({ ...req.body });
        return res.json({ message: "Ruta actualizada con éxito", route });
    } catch (error) {
        console.log(error);
        res.status(INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
};

export const changeState = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) return res.status(BAD_REQUEST).json({ errors: errors.array() });

        //search route by id
        const route = await db.Route.findByPk(req.params.id);

        if (!route) return res.status(BAD_REQUEST).json({ message: "La ruta no existe" }); //if route not exist

        await route.update({ state: req.body.state }); //update state
        return res.json({ message: "Estado de la ruta actualizado con éxito", route });
    } catch (error) {
        console.log(error);
        res.status(INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
}; 