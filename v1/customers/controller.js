import db from "../../models/index.cjs";
import { getOdbcConnection } from "../../database/connectionOdbc.js";
import { validationResult } from 'express-validator';
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../../utils/httpStatusCodes.js";

export const getCustomers = async (_, res) => {
    try {
        const customers = await db.Customer.findAll({
            include: [
                { model: db.DocumentType, attributes: ['id', 'name'] },
                { 
                    model: db.Municipality, 
                    attributes: ['id', 'name'],
                    include: { model: db.Department, attributes: ['id', 'name'] }
                },
            ]
        });
        return res.json(customers);
    } catch (error) {
        console.log(error);
        return res.status(INTERNAL_SERVER_ERROR).json({ message: "Error al obtener clientes (Internal Error)" });
    }
};

export const getCustomerOdbcByDocument = async (req, res) => {
    try {
        // wating 5 seconds
        const connection = await getOdbcConnection();
        const result = await connection.query(`SELECT CustomerID as id, Customer_Bill_Name as name, eMail_Address as email FROM customers WHERE CustomerID = '${req.params.id}'`);
        const data = result.map(row => {
            delete row.columns;
            return row;
        });
        // Cierra la conexión
        await connection.close();
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

        if (await db.Customer.findOne({ where: { documentNumber:  req.body.documentNumber} })) {
            return res.status(BAD_REQUEST).json({ message: 'Ya existe un usuario con este documento.' });
        }

        const newCustomer = await db.Customer.create({ ...req.body });

        // Volver a consultar la instancia creada junto con sus asociaciones
        const customer = await db.Customer.findByPk(newCustomer.id, {
            include: [
                { model: db.DocumentType, attributes: ['id', 'name'] },
                { 
                    model: db.Municipality, 
                    attributes: ['id', 'name'],
                    include: { model: db.Department, attributes: ['id', 'name'] }
                },
            ]
        });

        return res.json({ message: "Cliente creado con éxito", customer });
    } catch (error) {
        console.log(error);
        res.status(INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
};

export const updateCustomer = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(BAD_REQUEST).json({ errors: errors.array() });
        }
        
        const updateCustomer = await db.Customer.findByPk(req.params.id);
        if (!updateCustomer) {
            return res.status(BAD_REQUEST).json({ message: 'No existe el registro del cliente a actualizar.' });
        }

        await updateCustomer.update({ ...req.body });

        // consultando nuevamente el registro para incluir sus asociaciones
        const customer = await db.Customer.findByPk(req.params.id, {
            include: [
                { model: db.DocumentType, attributes: ['id', 'name'] },
                { 
                    model: db.Municipality, 
                    attributes: ['id', 'name'],
                    include: { model: db.Department, attributes: ['id', 'name'] }
                },
            ]
        });
        await new Promise(resolve => setTimeout(resolve, 5000));
        return res.json({ message: '¡Cliente actualizado con éxito!', customer });
    } catch (error) {
        console.log(error);
        res.status(INTERNAL_SERVER_ERROR).json({ message: "Error al actualizar el cliente (500)" });
    }
}

export const deleteCustomer = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(BAD_REQUEST).json({ errors: errors.array() });
        }
        
        const customer = await db.Customer.findByPk(req.params.id);
        if (!customer) {
            return res.status(BAD_REQUEST).json({ message: 'No existe el registro del cliente a eliminar.' });
        }

        //destroy customer
        await customer.destroy();
        return res.json({ message: "Submenú eliminado con éxito" });
    } catch (error) {
        console.log(error);
        res.status(INTERNAL_SERVER_ERROR).json({ message: "Error al eliminar el cliente (500)" });
    }
}