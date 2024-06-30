import odbc from "odbc";

export async function getOdbcConnection() {
    try {
        const connectionString = process.env.NODE_ODBC_CONNECTION;
        const connection = await odbc.connect(connectionString);
        
        return connection;
    } catch (err) {
        console.error('Error conectándose a la base de datos odbc:', err);
        return null;
    }
}