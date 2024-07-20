import { ConnectionPool, config as SqlConfig } from "mssql";
import { LogHandler, LogLevel } from "ezpzos.core";

const dbConfig: SqlConfig = {
	user: process.env.DB_USER || "",
	password: process.env.DB_PASSWORD || "",
	server: process.env.DB_SERVER || "",
	database: process.env.DB_NAME || "",
	options: {
		encrypt: true,
		trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === "true",
		enableArithAbort: true
	}
};

const logger = new LogHandler("auth.ts");

let pool = new ConnectionPool(dbConfig);

const connectToDatabase = async (): Promise<ConnectionPool> => {
	try {
		await pool.connect();
		logger.Log("pool.connect", "Database connected", LogLevel.INFO);
		return pool;
	} catch (err) {
		logger.Log("pool.connect", `Database connection failed: ${err}`, LogLevel.ERROR);
		throw err;
	}
};

export { connectToDatabase };
