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
  
  // Test inserting a folder with user id '1' (string bigint)
  console.log('=== Testing folder insert with id="1" ===');
  try {
    const res = await client.query("INSERT INTO folders (nama, modul, created_by) VALUES ('test_debug', 'aset', '1') RETURNING id;");
    console.log('SUCCESS - inserted folder id:', res.rows[0].id);
    // Clean up
    await client.query("DELETE FROM folders WHERE nama = 'test_debug'");
    console.log('Cleanup done');
  } catch(e) {
    console.log('FAILED:', e.message);
  }

  // Check attachments table schema
  console.log('\n=== attachments table schema ===');
  const attSchema = await client.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'attachments'");
  console.log(attSchema.rows);

  // Check user id '1' exists
  console.log('\n=== users with id 1 ===');
  const u = await client.query("SELECT id, email FROM users WHERE id::text = '1'");
  console.log(u.rows);

  await client.end();
}
check();
