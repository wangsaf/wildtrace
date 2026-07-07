import { Pool } from 'pg';

const pool = new Pool({
  host: '100.111.6.13',
  port: 5432,
  database: 'wildtrace',
  user: 'postgres',
  password: 'postgres',
});

export default pool;
