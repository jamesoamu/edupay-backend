import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../db/schema.ts';

declare global {
  var _backendPostgresPool: Pool | undefined;
}

export const createPool = () => {
  if (!global._backendPostgresPool) {
    // Connect via Cloud SQL environment variables or standard DB config
    global._backendPostgresPool = new Pool({
      host: process.env.SQL_HOST || process.env.DB_HOST || 'localhost',
      user: process.env.SQL_USER || process.env.DB_USER,
      password: process.env.SQL_PASSWORD || process.env.DB_PASSWORD,
      database: process.env.SQL_DB_NAME || process.env.DB_NAME,
      max: 10,
      connectionTimeoutMillis: 15000,
    });

    global._backendPostgresPool.on('error', (err) => {
      console.error('Unexpected error on idle SQL pool client:', err);
    });
  }
  return global._backendPostgresPool;
};

export const pool = createPool();
export const db = drizzle(pool, { schema });
