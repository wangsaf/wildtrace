import { Pool } from 'pg';

const pool = new Pool({
  host: '100.111.6.13',
  port: 5434,
  database: 'wildtrace',
  user: 'wildtrace',
  password: 'wild2026secure',
});

export default pool;
