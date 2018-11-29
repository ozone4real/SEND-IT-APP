import 'babel-polyfill';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const db = async (text, params) => {
  const result = await pool.query(text, params);
  return result;
};

export default db;
