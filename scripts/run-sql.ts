import * as fs from 'fs';
import * as path from 'path';
import { Client } from 'pg';

const client = new Client({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
});

async function run() {
  try {
    const args = process.argv.slice(2);
    await client.connect();

    if (args.includes('--rm')) {
      console.log('Removing tables...');
      const sql = fs.readFileSync(
        path.join(__dirname, '/fixtures/delete_all.sql'),
        'utf8',
      );
      await client.query(sql);
      console.log('Tables removed successfully');
    } else {
      console.log('Running default SQL script...');
    }
  } catch (err) {
    console.error('Error executing SQL script:', err);
  } finally {
    await client.end();
  }
}

run();
