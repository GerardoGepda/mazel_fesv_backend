import db from "../../models/index.cjs";
import { validationResult } from 'express-validator';
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../../utils/httpStatusCodes.js";

export const createSubmenu = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(BAD_REQUEST).json({ errors: errors.array() });
        }

        const newSubmenu = await db.Submenu.create({ ...req.body });
        //now creating the submenu route association
        await db.MenuRoute.create({ menuId: req.body.menuId, state: 1, routeId: req.body.routeId, submenuId: newSubmenu.id });

        // Volver a consultar la instancia creada junto con sus asociaciones
        const submenu = await getSubmenuData(newSubmenu.id);
        
        return res.json({ message: "Submenú creado con éxito", submenu});
    } catch (error) {
        console.log(error);
        res.status(INTERNAL_SERVER_ERROR).json({ message: "Error al crear nuevo Submenú" });
    }
};

export const updateSubmenu = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(BAD_REQUEST).json({ errors: errors.array() });
        }

        const updateSubmenu = await db.Submenu.findByPk(req.params.id, { include: { model: db.MenuRoute } });
        if (!updateSubmenu) {
            return res.status(BAD_REQUEST).json({ message: "El submenú no existe" });
        }

        await updateSubmenu.update({ ...req.body });
        // now updating the menu route association only when the menu has not submenus
        const menuRoute = updateSubmenu.MenuRoutes[0];
        await menuRoute.update({ menuId: req.body.menuId, routeId: req.body.routeId });

        const submenu = await getSubmenuData(req.params.id);
        return res.json({ message: "Submenú actualizado con éxito", submenu});
    } catch (error) {
        console.log(error);
        res.status(INTERNAL_SERVER_ERROR).json({ message: "Error al actualizar el Submenú" });
    }
};

export const deletesubmenu = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(BAD_REQUEST).json({ errors: errors.array() });
        }

        const submenu = await db.Submenu.findByPk(req.params.id);
        if (!submenu) {
            return res.status(BAD_REQUEST).json({ message: "El submenú no existe" });
        }
        //destroy menuroute where submenuId is equal to the submenu id
        await db.MenuRoute.destroy({ where: { submenuId: req.params.id } });
        await submenu.destroy();
        return res.json({ message: "Submenú eliminado con éxito" });
    } catch (error) {
        console.log(error);
        res.status(INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
};


const getSubmenuData = async(submenuId) => {
    const submenu = await db.Submenu.findByPk(submenuId, {
        attributes: ['id', 'name', 'icon', 'order', 'menuId', 'state'],
        include: [
            {
                model: db.MenuRoute,
                attributes: ['id', 'menuId', 'submenuId', 'routeId'],
                include: [
                    {
                        model: db.Route, attributes: ['id', 'name', 'path'], where: { state: 1 },
                        required: true,
                        include: [
                            { model: db.Permission, required: true, attributes: ['id', 'actions'], where: { state: 1 } }
                        ]
                    }
                ]
            }
        ],
        where: { state: 1}
    });
    return {
        id: submenu.id,
        name: submenu.name,
        icon: submenu.icon,
        order: submenu.order,
        state: submenu.state,
        menuId: submenu.menuId,
        route: submenu.MenuRoutes.length == 1 ? submenu.MenuRoutes[0].Route.path : null,
        routeId: submenu.MenuRoutes.length == 1 ? submenu.MenuRoutes[0].Route.id : null,
        permissions: submenu.MenuRoutes.length == 1 ? submenu.MenuRoutes[0].Route.Permissions[0].actions : null
    };
};