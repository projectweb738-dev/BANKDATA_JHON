const { Client } = require('pg');
const client = new Client({
  host: 'aws-0-ap-southeast-1.pooler.supabase.com',
  port: 6543,
  database: 'postgres',
  user: 'postgres.mgmfcxpjweljmyfvjupg',
  password: 'Ideal for agent-first workflows: update your schema in code, push it to GitHub, and Supa',
  ssl: { rejectUnauthorized: false }
});
async function fix() {
  await client.connect();
  const tables = ['pegawai', 'program', 'aset', 'folders', 'keuangan'];
  const columns = ['created_by', 'updated_by'];
  for (const t of tables) {
    for (const c of columns) {
      try {
        await client.query(`ALTER TABLE ${t} DROP CONSTRAINT IF EXISTS ${t}_${c}_foreign;`);
        await client.query(`ALTER TABLE ${t} ALTER COLUMN ${c} TYPE varchar(36);`);
        console.log('Success:', t, c);
      } catch (e) {
        console.error('Failed:', t, c, e.message);
      }
    }
  }
  await client.end();
}
fix();
