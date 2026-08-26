const { Client } = require('pg');
const client = new Client({
  host: 'aws-0-ap-southeast-1.pooler.supabase.com',
  port: 6543,
  database: 'postgres',
  user: 'postgres.mgmfcxpjweljmyfvjupg',
  password: 'Ideal for agent-first workflows: update your schema in code, push it to GitHub, and Supa',
  ssl: { rejectUnauthorized: false }
});

async function check() {
  await client.connect();
  
  // Check constraints on program table
  const constraints = await client.query(`
    SELECT conname, pg_get_constraintdef(c.oid) as definition
    FROM pg_constraint c
    JOIN pg_class t ON t.oid = c.conrelid
    WHERE t.relname = 'program' AND contype = 'c'
  `);
  console.log('program constraints:', constraints.rows);

  const asetCons = await client.query(`
    SELECT conname, pg_get_constraintdef(c.oid) as definition
    FROM pg_constraint c
    JOIN pg_class t ON t.oid = c.conrelid
    WHERE t.relname = 'aset' AND contype = 'c'
  `);
  console.log('aset constraints:', asetCons.rows);

  const keuanganCons = await client.query(`
    SELECT conname, pg_get_constraintdef(c.oid) as definition
    FROM pg_constraint c
    JOIN pg_class t ON t.oid = c.conrelid
    WHERE t.relname = 'keuangan' AND contype = 'c'
  `);
  console.log('keuangan constraints:', keuanganCons.rows);

  const pegawaiCons = await client.query(`
    SELECT conname, pg_get_constraintdef(c.oid) as definition
    FROM pg_constraint c
    JOIN pg_class t ON t.oid = c.conrelid
    WHERE t.relname = 'pegawai' AND contype = 'c'
  `);
  console.log('pegawai constraints:', pegawaiCons.rows);

  await client.end();
}
check();
