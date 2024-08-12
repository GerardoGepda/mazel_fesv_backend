import db from '../models/index.cjs'
import dayjs from 'dayjs';
import { getCorrelativeForCodeMH } from './correlatives.js';
import numberAsString from './numberAsString.js';

//function to get the emisor data
const dteEmisor = async (tipoDocumento = "01") => {
    const biller = await db.Biller.findOne({
        include: [{ 
            model: db.Municipality,
            attributes: ['id', 'name', 'codeMH'],
            include: { model: db.Department, attributes: ['id', 'name', 'codeMH'] }
        }]
    });
    if (!biller) {
        throw 'No se encontro información de facturador';
    }
    
    const emisor = {
        "nit": biller.nit,
        "nrc": biller.nrc,
        "descActividad": biller.activity,
        "codActividad": biller.activityCode,
        "nombre": biller.name,
        "direccion": {
            "departamento": biller.Municipality.Department.codeMH,
            "municipio": biller.Municipality.codeMH,
            "complemento": biller.address
        },
        "telefono": biller.phone,
        "correo": biller.email,
    }

    if(!["14"].includes(tipoDocumento)){
        emisor.nombreComercial = biller.comercialName;
        emisor.tipoEstablecimiento = biller.establishmentType;
    }

    if (["01", "03", "14"].includes(tipoDocumento)) {
        emisor.codEstableMH = biller.establishmentCode;
        emisor.codEstable = null;
        emisor.codPuntoVentaMH = biller.posCode;
        emisor.codPuntoVenta = null;
    }

    if (["07"].includes(tipoDocumento)) {
        emisor.codigoMH = null;
        emisor.codigo = null;
        emisor.puntoVentaMH = null;
        emisor.puntoVenta = null;
    }

    if (tipoDocumento == "anulacion") {
        emisor.nomEstablecimiento = biller.comercialName;
        emisor.codEstable = biller.establishmentCode;
        emisor.codPuntoVenta = biller.posCode;
        delete emisor.descActividad;
        delete emisor.codActividad;
        delete emisor.direccion;
        delete emisor.nombreComercial;
        delete emisor.nrc;
    }

    return emisor;
}

//function to create the dte FC json
export const dteFc = async (data, emissionDate = '') => {
    try {
        // getting emisor data
        const emisor = await dteEmisor("01");
        const biller = await db.Biller.findOne();
        if (!biller) {
            throw 'No se encontro información de facturador';
        }

        let receptor = null;
        if (data[0].CustomerID !== 'CONSUMIDOR FINAL') {
            // retriving customer info from db
            const customer = await db.Customer.findOne({
                include: [
                    { model: db.DocumentType, attributes: ['id', 'name', 'codeMH'] },
                    { 
                        model: db.Municipality,
                        include: { model: db.Department, attributes: ['id', 'name', 'codeMH'] }
                    },
                    { model: db.Activity, required: false }
                ],
                where: { oldId: data[0].CustomerID }
            });

            if (!customer) {
                throw "No se encontró regsitro de cliente para el documento.";
            }

            receptor = {
                "tipoDocumento": customer.DocumentType.codeMH,
                "numDocumento": customer.DocumentType.codeMH == '36' ? customer.documentNumber.replace(/-/g, '') : customer.documentNumber,
                "nrc": customer.nrc || null,
                "nombre": customer.name,
                "codActividad": customer.Activity ? customer.Activity.codeMH : null,
                "descActividad": customer.Activity ? customer.Activity.name : null,
                "direccion": {
                    "departamento": customer.Municipality.Department.codeMH,
                    "municipio": customer.Municipality.codeMH,
                    "complemento": customer.address
                },
                "telefono": customer.phone || null,
                "correo": customer.email
            };   
        }

        const docBody = data.map((line, i) => {
            return {
                "numItem": i + 1,
                "tipoItem": parseInt(line.TipoItem),
                "cantidad": parseFloat((line.Quantity).toFixed(2)),
                "codigo": line.ItemID,
                "codTributo": null,
                "uniMedida": 59,
                "descripcion": line.ItemDescription,
                "precioUni": parseFloat((line.PrecioUnitario * (parseFloat(line.IVALinea) ? 1.13 : 1)).toFixed(4)),
                "montoDescu": 0, //preguntar
                "ventaNoSuj": 0.00,
                "ventaExenta": parseFloat(line.IVALinea) ? 0 : parseFloat(((line.PrecioUnitario * line.Quantity) + line.IVALinea).toFixed(4)), //preguntar
                "ventaGravada": parseFloat(line.IVALinea) ? parseFloat(((line.PrecioUnitario * line.Quantity) + line.IVALinea).toFixed(4)) : 0,
                "ivaItem": parseFloat((line.IVALinea).toFixed(4)),
                "tributos": null,
                "psv": 0.00,
                "noGravado": 0.00,
                "numeroDocumento": null
            }
        });

        //getting correlative
        const correlative = await getCorrelativeForCodeMH("01");

        if (!correlative) {
            throw 'No se encontró registro de correaltivo (tipo: 01)';
        }

        if (correlative.final == correlative.actual) {
            throw 'Se ha alcanzado el limite de correlativos';
        }

        const api = await db.ApiCredential.findOne({ where: { code: 'MH_FE_API' } }); // api info

        if (!api) {
            throw "No se encontró registro de api del MH para FE.";
        }

        return {
            "identificacion": {
                "version": 1,
                "ambiente": api.sandbox ? '00' : '01',
                "tipoDte": "01",
                "numeroControl": `DTE-01-${biller.establishmentCode}${biller.posCode}-${(correlative.actual + 1).toString().padStart(15, '0')}`,
                "codigoGeneracion": crypto.randomUUID().toUpperCase(),
                // modelo previo
                "tipoModelo": 1,
                // 1:normal - 2:contingencia
                "tipoOperacion": 1,
                "tipoContingencia": null,
                "motivoContin": null,
                "fecEmi": emissionDate,
                "horEmi": dayjs().format("HH:mm:ss"),
                "tipoMoneda": "USD"
            },
            "emisor": emisor,
            "receptor": receptor,
            "documentoRelacionado":null,
            "otrosDocumentos":null,
            "ventaTercero": null,
            "cuerpoDocumento": docBody,
            "resumen":{
                "totalNoSuj": 0,
                "totalExenta": parseFloat(data[0].IVATotal) ? 0 : parseFloat((data[0].DocTotal).toFixed(2)),
                "totalGravada": parseFloat(data[0].IVATotal) ? parseFloat((data[0].DocTotal).toFixed(2)) : 0,
                "subTotalVentas": parseFloat((data[0].DocTotal).toFixed(2)),
                "descuNoSuj": 0,
                "descuExenta": 0,
                "descuGravada": 0, // preguntar
                "porcentajeDescuento": 0,
                "totalDescu": 0, // preguntar,
                "tributos": null,
                "subTotal": parseFloat((data[0].DocTotal).toFixed(2)),
                "ivaRete1": 0.00,
                "reteRenta":0.00,
                "montoTotalOperacion": parseFloat((data[0].DocTotal).toFixed(2)),
                "totalNoGravado": 0.00,
                "totalPagar": parseFloat((data[0].DocTotal).toFixed(2)),
                "totalLetras": numberAsString(parseFloat((data[0].DocTotal).toFixed(2)), true),
                "totalIva": parseFloat((data[0].IVATotal).toFixed(2)),
                "saldoFavor": 0.00,
                "condicionOperacion": 1,
                "pagos": [
                    {
                        "montoPago": parseFloat((data[0].DocTotal).toFixed(2)),
                        "codigo": "01",
                        "referencia": 'Efectivo',
                        "plazo": null,
                        "periodo": null
                    }
                ],
                "numPagoElectronico": null
            },
            "extension": {   
                "nombEntrega": null,    
                "docuEntrega": null,    
                "nombRecibe": null,    
                "docuRecibe": null,    
                "observaciones": null,    
                "placaVehiculo": null   
            },
            "apendice": null
        };
    } catch (error) {
        throw typeof error === "string" ? error : "Error al generar el JSON del documento.";
    }
}

export const dteCcf = async (data, emissionDate = '') => {
    try {
        // getting emisor data
        const emisor = await dteEmisor("03");
        const biller = await db.Biller.findOne();
        if (!biller) {
            throw 'No se encontro información de facturador';
        }

        let receptor = null;
        if (data[0].CustomerID !== 'CONSUMIDOR FINAL') {
            // retriving customer info from db
            const customer = await db.Customer.findOne({
                include: [
                    { model: db.DocumentType, attributes: ['id', 'name', 'codeMH'] },
                    { 
                        model: db.Municipality,
                        include: { model: db.Department, attributes: ['id', 'name', 'codeMH'] }
                    },
                    { model: db.Activity, required: false }
                ],
                where: { oldId: data[0].CustomerID }
            });

            if (!customer) {
                throw "No se encontró regsitro de cliente para el documento.";
            }

            receptor = {
                "nit": customer.documentNumber.replace(/-/g, ''),
                "nrc": customer.nrc || null,
                "nombre": customer.name,
                "codActividad": customer.Activity ? customer.Activity.codeMH : null,
                "descActividad": customer.Activity ? customer.Activity.name : null,
                "nombreComercial": null,
                "direccion": {
                    "departamento": customer.Municipality.Department.codeMH,
                    "municipio": customer.Municipality.codeMH,
                    "complemento": customer.address
                },
                "telefono": customer.phone || null,
                "correo": customer.email
            };
        }

        // body of de document
        const docBody = data.map((line, i) => {
            return {
                "numItem": i + 1,
                "tipoItem": parseInt(line.TipoItem),
                "numeroDocumento": null,
                "codigo": line.ItemID,
                "codTributo": null,
                "descripcion": line.ItemDescription,
                "cantidad": parseFloat((line.Quantity).toFixed(2)),
                "uniMedida": 59,
                "precioUni": parseFloat((line.PrecioUnitario).toFixed(4)),
                "montoDescu": 0, //preguntar
                "ventaNoSuj": 0.00,
                "ventaExenta": parseFloat(line.IVALinea) ? 0 : parseFloat((line.PrecioUnitario * line.Quantity).toFixed(4)), //preguntar
                "ventaGravada": parseFloat(line.IVALinea) ? parseFloat((line.PrecioUnitario * line.Quantity).toFixed(4)) : 0,
                "tributos": parseFloat(line.IVALinea) > 0 ? ["20"] : null,
                "psv": 0.00,
                "noGravado": 0.00,
            }
        });

        //getting correlative
        const correlative = await getCorrelativeForCodeMH("03");

        if (!correlative) {
            throw 'No se encontró registro de correaltivo (tipo: 03)';
        }

        if (correlative.final == correlative.actual) {
            throw 'Se ha alcanzado el limite de correlativos';
        }

        const api = await db.ApiCredential.findOne({ where: { code: 'MH_FE_API' } }); // api info

        if (!api) {
            throw "No se encontró registro de api del MH para FE.";
        }

        return {
            "identificacion": {
                "version": 3,
                "ambiente": api.sandbox ? '00' : '01',
                "tipoDte": "03",
                "numeroControl": `DTE-03-${biller.establishmentCode}${biller.posCode}-${(correlative.actual + 1).toString().padStart(15, '0')}`,
                "codigoGeneracion": crypto.randomUUID().toUpperCase(),
                "tipoModelo": 1,
                "tipoOperacion": 1,
                "tipoContingencia": null,
                "motivoContin": null,
                "fecEmi": emissionDate,
                "horEmi": dayjs().format("HH:mm:ss"),
                "tipoMoneda": "USD"
            },
            "emisor": emisor,
            "receptor": receptor,
            "documentoRelacionado":null,
            "otrosDocumentos":null,
            "ventaTercero": null,
            "cuerpoDocumento": docBody,
            "resumen":{
                "totalNoSuj": 0,
                "totalExenta": parseFloat(data[0].IVATotal) ? 0 : parseFloat((data[0].DocTotal).toFixed(2)),
                "totalGravada": parseFloat(data[0].IVATotal) ? parseFloat((data[0].DocTotal - data[0].IVATotal).toFixed(2)) : 0,
                "subTotalVentas": parseFloat((data[0].DocTotal - data[0].IVATotal).toFixed(2)),
                "descuNoSuj": 0,
                "descuExenta": 0,
                "descuGravada":0 , //preguntar
                "porcentajeDescuento": 0,
                "totalDescu": 0 , //preguntar
                "tributos": parseFloat(data[0].IVATotal) ? [{
                    "codigo": "20",
                    "descripcion": "Impuesto al Valor Agregado 13%",
                    "valor": parseFloat((data[0].IVATotal).toFixed(2)),
                
                }] : null,
                "subTotal": parseFloat((data[0].DocTotal - data[0].IVATotal).toFixed(2)),
                "ivaPerci1": 0,
                "ivaRete1": 0,
                "reteRenta": 0,
                "montoTotalOperacion": parseFloat((data[0].DocTotal).toFixed(2)),
                "totalNoGravado": 0,
                "totalPagar": parseFloat((data[0].DocTotal).toFixed(2)),
                "totalLetras": numberAsString(parseFloat((data[0].DocTotal).toFixed(2))),
                "saldoFavor": 0.00,
                "condicionOperacion": 2,
                "pagos": [
                    {
                        "codigo": "05",
                        "montoPago": parseFloat((data[0].DocTotal).toFixed(2)),
                        "referencia": "Transferencia Bancaria",
                        "plazo": "01",
                        "periodo": 14
                    }
                ],
                "numPagoElectronico": null
            },
            "extension": null,
            "apendice": null
        };
    } catch (error) {
        throw typeof error === "string" ? error : "Error al generar el JSON del documento.";
    }
}