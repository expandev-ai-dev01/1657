import sql, { IRecordSet, ConnectionPool, Transaction, PreparedStatement } from 'mssql';
import { config } from '@/config';

let pool: ConnectionPool;

const dbConfig = {
  server: config.database.server,
  port: config.database.port,
  user: config.database.user,
  password: config.database.password,
  database: config.database.database,
  options: {
    encrypt: config.database.options.encrypt,
    trustServerCertificate: config.database.options.trustServerCertificate,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

/**
 * @summary Gets the singleton connection pool, creating it if it doesn't exist.
 * @returns {Promise<ConnectionPool>} The database connection pool.
 */
export async function getPool(): Promise<ConnectionPool> {
  if (!pool) {
    try {
      pool = await new sql.ConnectionPool(dbConfig).connect();
      console.log('Database connection pool established.');
    } catch (err) {
      console.error('Database connection failed:', err);
      throw new Error('Failed to establish database connection pool.');
    }
  }
  return pool;
}

/**
 * @summary Executes a stored procedure with the given parameters.
 * @param {string} procedureName - The name of the stored procedure (e.g., '[schema].[spName]').
 * @param {object} params - An object containing the input parameters for the procedure.
 * @returns {Promise<IRecordSet<any>[]>} The result sets from the stored procedure.
 */
export async function executeProcedure(
  procedureName: string,
  params: Record<string, any> = {}
): Promise<IRecordSet<any>[]> {
  const pool = await getPool();
  const request = pool.request();

  for (const key in params) {
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      request.input(key, params[key]);
    }
  }

  const result = await request.execute(procedureName);

  if (Array.isArray(result.recordsets)) {
    return result.recordsets;
  }
  return Object.values(result.recordsets);
}

// Add transaction management functions as needed
export async function beginTransaction(): Promise<Transaction> {
  const pool = await getPool();
  return new sql.Transaction(pool);
}
