import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function dbExp(text, params) {
  const result = await pool.query(text, params);
  return result;
}

export default dbExp;
