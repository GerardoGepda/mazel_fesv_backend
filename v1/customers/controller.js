import db from "../../models/index.cjs";
import { getOdbcConnection } from "../../database/connectionOdbc.js";
import { validationResult } from 'express-validator';
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../../utils/httpStatusCodes.js";

export const getCustomers = async (_, res) => {
    try {
        const customers = await db.Customer.findAll();
        return res.json(customers);
    } catch (error) {
        console.log(error);
        return res.status(INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
};

export const getCustomerOdbcByDocument = async (req, res) => {
    try {
        // wating 5 seconds
        await new Promise(resolve => setTimeout(resolve, 5000));
        const connection = await getOdbcConnection();
        const result = await connection.query(`SELECT CustomerID as id, Customer_Bill_Name as name, eMail_Address as email FROM customers WHERE CustomerID = '${req.params.id}'`);
        const data = result.map(row => {
            delete row.columns;
            return row;
        });
        // Cierra la conexión
        await connection.close();
        console.log(typeof result[0]);
        return res.json({message: '¡Busqueda completada!', customer: result[0] || null});
    } catch (error) {
        console.log(error);
        return res.status(INTERNAL_SERVER_ERROR).json({ message: "Error interno del servidor" });
    }
};

export const createCustomer = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(BAD_REQUEST).json({ errors: errors.array() });
        }

        const customer = await db.Customer.create({ ...req.body });
        return res.json({ message: "Cliente creado con éxito", customer });
    } catch (error) {
        console.log(error);
        res.status(INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
};