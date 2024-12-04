import hana from '@sap/hana-client';

// GENERAL FUNCTIONS
const executeQuery = async (query, connParams) => {
    return new Promise((resolve, reject) => {
        const connection = hana.createConnection();

        connection.connect(connParams, (err) => {
            if (err) {
                console.error(err);
                return reject('Error conectando a la base de datos Hana');
            }

            connection.exec(query, (err, result) => {
                if (err) {
                    console.error(err);
                    return reject('Error ejecutando query en la base de datos Hana');
                }

                connection.disconnect((err) => {
                    if (err) {
                        console.error(err);
                        return reject('Error desconectando de la base de datos Hana');
                    }
                    resolve(result); // Devolver los datos
                });
            });
        });
    });
};

export const executeHanaSelectQuery = async (query = "") => {
    try {

        if (!query) {
            throw 'Query no puede ser vacía.';
        }

        const connParams = {
            serverNode: process.env.SAP_HANA_HOST,
            uid: process.env.SAP_HANA_USER,
            pwd: process.env.SAP_HANA_PASSWORD,
        };

        const result = await executeQuery(query, connParams);

        return result;
    } catch (err) {
        console.log(err);
        throw typeof err == "string" ? err : "Error al conectar a la base de datos Hana.";
    }
};
