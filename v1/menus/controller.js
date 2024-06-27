import db from "../../models/index.cjs";
import { validationResult } from 'express-validator';
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../../utils/httpStatusCodes.js";

export const getMenus = async (_, res) => {
    try {
        return res.json(await getMenusData());
    } catch (error) {
        console.log(error);
        res.status(INTERNAL_SERVER_ERROR).json({ message: "Error al extraer los menús (500)" });
    }
};

export const getMenusByRole = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(BAD_REQUEST).json({ errors: errors.array() });
        }

        const roleId = req.params.roleId;
        return res.json(await getMenusData(roleId));
    } catch (error) {
        console.log(error);
        res.status(INTERNAL_SERVER_ERROR).json({ message: "Error al extraer los menús (500)" });
    }
};

export const createMenu = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(BAD_REQUEST).json({ errors: errors.array() });
        }

        if (!Boolean(req.body.hasSubmenus) && !req.body.routeId) {
            return res.status(BAD_REQUEST).json({ message: "En caso de ser menú unico, debe especificar una ruta" });   
        }

        const newMenu = await db.Menu.create({ ...req.body });
        //now creating the menu route association only when the menu has not submenus
        req.body.hasSubmenus || await db.MenuRoute.create({ menuId: newMenu.id, state: 1, routeId: req.body.routeId, submenuId: null });

        // Volver a consultar la instancia creada junto con sus asociaciones
        const menu = await getMenuData(newMenu.id);

        return res.json({ message: "Menú creado con éxito", menu: { ...menu, submenus: null }});
    } catch (error) {
        console.log(error);
        res.status(INTERNAL_SERVER_ERROR).json({ message: "Error al crear nuevo menú" });
    }
};

export const updateMenu = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(BAD_REQUEST).json({ errors: errors.array() });
        }

        if (!Boolean(req.body.hasSubmenus) && !req.body.routeId) {
            return res.status(BAD_REQUEST).json({ message: "En caso de ser menú unico, debe especificar una ruta" });   
        }

        const updateMenu = await db.Menu.findByPk(req.params.id, { include: { model: db.MenuRoute } });
        if (!updateMenu) {
            return res.status(BAD_REQUEST).json({ message: "El menú no existe" });
        }

        await updateMenu.update({ ...req.body });
        // now updating the menu route association only when the menu has not submenus
        if (updateMenu.MenuRoutes.length == 1) {
            if (!Boolean(req.body.hasSubmenus)) {
                const menuRoute = updateMenu.MenuRoutes[0];
                await menuRoute.update({ routeId: req.body.routeId });
            } else {
                await updateMenu.MenuRoutes[0].destroy();
            }
        } else {
            if (!Boolean(req.body.hasSubmenus)) {
                await db.MenuRoute.create({ menuId: updateMenu.id, state: 1, routeId: req.body.routeId, submenuId: null });
            }
        }

        const menu = await getMenuData(updateMenu.id);
        return res.json({ message: "Menú actualizado con éxito", menu});
    } catch (error) {
        console.log(error);
        res.status(INTERNAL_SERVER_ERROR).json({ message: "Error al actualizar el menú" });
    }
};

export const deleteMenu = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(BAD_REQUEST).json({ errors: errors.array() });
        }

        const menu = await db.Menu.findByPk(req.params.id);
        if (!menu) {
            return res.status(BAD_REQUEST).json({ message: "El menú no existe" });
        }

        //deleting submenus where menuId is the menu to delete
        await db.Submenu.destroy({ where: { menuId: menu.id } });
        await menu.destroy();
        return res.json({ message: "Menú eliminado con éxito" });
    } catch (error) {
        console.log(error);
        res.status(INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
};

// function to modify the order of the menus, it receives a source (int) to move to destination (int)
export const modifyOrders = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(BAD_REQUEST).json({ errors: errors.array() });
        }

        const { source, destination } = req.body;
        console.log(source, destination);
        const menus = await db.Menu.findAll({ attributes: ['id', 'name', 'order'], order: [['order', 'ASC']] });
        const [remove] = menus.splice(source - 1, 1);
        menus.splice(destination - 1, 0, remove);

        for (let i = 0; i < menus.length; i++) {
            await menus[i].update({ order: i + 1 });
            console.log(menus[i].name, menus[i].order);
        }

        return res.json({ message: "Orden de los menús actualizado con éxito" });
    } catch (error) {
        console.log(error);
        res.status(INTERNAL_SERVER_ERROR).json({ message: "Error al actualizar el orden de los menús" });
    }
};


//--- general functions for all controllers ---//

// function to get the app's menu data for the authenticated user role id
export const getMenusData = async (roleId = null) => {
    let whereRole = {};
    if (roleId) {
        whereRole = { roleId: roleId };
    }

    //getting menus, permissions and roles
    const menus = await db.Menu.findAll({
        attributes: ['id', 'name', 'icon', 'order', 'state'],
        include: [
            {
                model: db.MenuRoute,
                required: true,
                attributes: ['id', 'menuId', 'submenuId', 'routeId'],
                include: [
                    {
                        model: db.Route, attributes: ['id', 'name', 'path'], where: { state: 1 },
                        required: true,
                        include: [
                            { model: db.Permission, required: true, attributes: ['id', 'actions'], where: { state: 1, ...whereRole } }
                        ]
                    }
                ]
            }
        ],
        where: { state: 1 },
        order: [['order', 'ASC']]
    });


    //finding the submenus
    const menuIds = menus.map(m => m.id);
    const submenus = await db.Submenu.findAll({
        attributes: ['id', 'name', 'icon', 'order', 'menuId', 'state'],
        include: [
            {
                model: db.MenuRoute,
                required: true,
                attributes: ['id', 'menuId', 'submenuId', 'routeId'],
                include: [
                    {
                        model: db.Route, attributes: ['id', 'name', 'path'], where: { state: 1 },
                        required: true,
                        include: [
                            { model: db.Permission, required: true, attributes: ['id', 'actions'], where: { state: 1, ...whereRole } }
                        ]
                    }
                ]
            }
        ],
        where: { menuId: menuIds, state: 1},
        order: [['order', 'ASC']]
    });

    //filtering the menus and submenus data
    const menusData = [];
    for (const menu of menus) {

        const submenuData = submenus.filter(s => s.menuId == menu.id).map(s => {
            return {
                id: s.id,
                name: s.name,
                icon: s.icon,
                order: s.order,
                state: s.state,
                menuId: s.menuId,
                route: s.MenuRoutes.length == 1 ? s.MenuRoutes[0].Route.path : null,
                routeId: s.MenuRoutes.length == 1 ? s.MenuRoutes[0].Route.id : null,
                permissions: s.MenuRoutes.length == 1 ? s.MenuRoutes[0].Route.Permissions[0].actions : null,
            };
        });

        menusData.push({
            id: menu.id,
            name: menu.name,
            icon: menu.icon,
            order: menu.order,
            state: menu.state,
            route: menu.MenuRoutes.length == 1 ? menu.MenuRoutes[0].Route.path : null,
            routeId: menu.MenuRoutes.length == 1 ? menu.MenuRoutes[0].Route.id : null,
            permissions: menu.MenuRoutes.length == 1 ? menu.MenuRoutes[0].Route.Permissions[0].actions : null,
            submenus: submenuData.length > 0 ? submenuData : null
        });
    }

    return menusData;
};

const getMenuData = async (menuId) => {
    const menu = await db.Menu.findByPk(menuId, {
        attributes: ['id', 'name', 'icon', 'order', 'state'],
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
        where: { state: 1 },
    });

    return {
        id: menu.id,
        name: menu.name,
        icon: menu.icon,
        order: menu.order,
        state: menu.state,
        route: menu.MenuRoutes.length == 1 ? menu.MenuRoutes[0].Route.path : null,
        routeId: menu.MenuRoutes.length == 1 ? menu.MenuRoutes[0].Route.id : null,
        permissions: menu.MenuRoutes.length == 1 ? menu.MenuRoutes[0].Route.Permissions[0].actions : null
    };
};