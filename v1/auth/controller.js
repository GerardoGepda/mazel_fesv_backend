import db from "../../models/index.cjs";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import { BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND, UNAUTHORIZED } from "../../utils/httpStatusCodes.js";
import { getMenusData } from "../menus/controller.js";

export const authenticate = async (req, res) => {
    try {
        if (Object.keys(req.body).length === 0) {
            return res.status(BAD_REQUEST).json({ message: "Petición inválida" });
        }

        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(BAD_REQUEST).json({ message: "Email y contraseña son requeridos" });
        }

        const user = await db.User.findOne({ where: { email }, include: { model: db.Role } });
        if (!user) {
            return res.status(NOT_FOUND).json({ message: "Usuario no encontrado" });
        }

        const isValidPassword = bcrypt.compareSync(password, user.password);
        if (!isValidPassword) {
            return res.status(UNAUTHORIZED).json({ message: "Contraseña incorrecta" });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        // update state codes for user
        await db.ResetPassword.update({ state: 0 }, { where: { userId: user.id } });

        //getting the app's menu data for the authenticated user role id
        const menu = await getMenusData(user.roleId);

        return res.json({ message: "Autenticación exitosa", token, menu, user });
    } catch (error) {
        console.log(error);
        res.status(INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
};
