// lib/db.ts
import { Pool } from 'pg';

// Singleton pattern for serverless environments
let pool: Pool;

function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });
  }
  return pool;
}

export const query = (text: string, params?: unknown[]) =>
  getPool().query(text, params);
