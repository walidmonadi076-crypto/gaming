import { Pool } from "pg";

const DATABASE_URL = process.env.DATABASE_URL;

// التصريح بالنوع Pool أو null
let pool: Pool | null = null;

export function getPool(): Pool {
  if (!DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  if (!pool) {
    pool = new Pool({
      connectionString: DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: 5,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
  }

  return pool;
}

export async function query(text: string, params?: any[]) {
  const pool = getPool();
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    if (duration > 100) {
      console.log("Slow query detected:", { text, duration, rows: res.rowCount });
    }
    return res;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
}

export async function getDbClient() {
  const pool = getPool();
  return pool.connect();
}

export async function testConnection() {
  const pool = getPool();

  try {
    const res = await pool.query("SELECT NOW()");
    return res.rows[0];
  } catch (err) {
    throw err;
  }
}
