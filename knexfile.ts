import type { Knex } from 'knex';
import * as dotenv from 'dotenv';

dotenv.config();

export const config: Knex.Config = {
  client: 'pg',
  connection: {
    host: process.env.PGHOST,
    port: +process.env.PGPORT,
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: '_migrations',
    extension: 'ts',
    disableTransactions: true,
    directory: './migrations',
  },
  seeds: {
    directory: './seeds',
    extension: 'ts',
  },
};

export default config;
