import jwt from 'jsonwebtoken';
import { FORBIDDEN, UNAUTHORIZED } from '../utils/httpStatusCodes.js';

export const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    const apiToken = token ? token.split(" ")[1] : null;

    if (!apiToken) return res.status(UNAUTHORIZED).json({ message: "No autorizado" });
    jwt.verify(apiToken, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(FORBIDDEN).json({ message: "Prohibido" });
        req.user = user;
        next();
    });
};