import { connectToDatabase } from "./db.service";
import sql from "mssql";
import { User } from "ezpzos.core";
import { LogHandler, LogLevel } from "ezpzos.core";

const logger = new LogHandler("user.ts");

const getUserByMobile = async (mobile: string): Promise<User | null> => {
	try {
	  const pool = await connectToDatabase();

	  logger.Log('getUserByMobile', `Executing query for mobile: ${mobile}`, LogLevel.INFO);
  
	  const res = await pool.request()
		.input('mobile', sql.NVarChar, mobile)
		.query<User[]>('SELECT * FROM [User] WHERE Mobile = @mobile');
  
	  if (res.recordset.length > 0) {
		logger.Log('getUserByMobile', `User found: ${JSON.stringify(res.recordset[0])}`, LogLevel.INFO);
		return res.recordset[0];
	  } else {
		logger.Log('getUserByMobile', 'User not found', LogLevel.WARN);
		return null;
	  }
	} catch (err) {
	  if (err instanceof Error) {
		logger.Log('getUserByMobile', `Error querying the database: ${err.stack}`, LogLevel.ERROR);
	  } else {
		logger.Log('getUserByMobile', 'Unknown error querying the database', LogLevel.ERROR);
	  }
	  throw err;
	}
  };
  
  export { getUserByMobile };