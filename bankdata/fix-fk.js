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
  const queries = [
    "ALTER TABLE pegawai ALTER COLUMN created_by TYPE varchar(36);",
    "ALTER TABLE pegawai ALTER COLUMN updated_by TYPE varchar(36);",
    "ALTER TABLE program ALTER COLUMN created_by TYPE varchar(36);",
    "ALTER TABLE program ALTER COLUMN updated_by TYPE varchar(36);",
    "ALTER TABLE aset ALTER COLUMN created_by TYPE varchar(36);",
    "ALTER TABLE aset ALTER COLUMN updated_by TYPE varchar(36);",
    "ALTER TABLE folders ALTER COLUMN created_by TYPE varchar(36);",
    "ALTER TABLE folders ALTER COLUMN updated_by TYPE varchar(36);",
    "ALTER TABLE keuangan ALTER COLUMN created_by TYPE varchar(36);",
    "ALTER TABLE keuangan ALTER COLUMN updated_by TYPE varchar(36);",
    "ALTER TABLE activity_log ALTER COLUMN causer_id TYPE varchar(36);"
  ];
  for (const q of queries) {
    try {
      await client.query(q);
      console.log('Success:', q);
    } catch (e) {
      console.error('Failed:', q, e.message);
    }
  }
  await client.end();
}
fix();
