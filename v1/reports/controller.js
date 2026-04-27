import { executeHanaSelectQuery } from "../../database/connectionHana.js";
import { generateWarehouseReportPdf } from "./services.js";

export const warehouseReport = async (req, res) => {
    const { docNum } = req.params;
    try {
        if (!docNum) {
            return res.status(400).json({ message: 'El número de documento es requerido.' });
        }

        const result = await executeHanaSelectQuery(`SELECT * FROM "REAL_MAZEL"."B1View_FacturasBodega" WHERE "DocNum" = '${docNum}'`);
        if (!result || result.length === 0) {
            return res.status(404).json({ message: 'No se encontraron datos para el número de documento proporcionado.' });
        }
        const pdf = await generateWarehouseReportPdf(result);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="reporte-bodega-${docNum}.pdf"`);
        res.setHeader('Content-Length', pdf.length);
        res.status(200).end(pdf);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};