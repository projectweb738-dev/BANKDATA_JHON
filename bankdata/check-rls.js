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
  
  // Check users table structure
  const usersSchema = await client.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'users'");
  console.log('=== users table schema ===');
  console.log(usersSchema.rows);
  
  // Check if there are any users
  const users = await client.query("SELECT id, email FROM users LIMIT 5");
  console.log('\n=== sample users ===');
  console.log(users.rows);
  
  // Check folders table schema
  const foldersSchema = await client.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'folders'");
  console.log('\n=== folders table schema ===');
  console.log(foldersSchema.rows);

  // Check RLS on folders
  const rls = await client.query("SELECT relname, relrowsecurity FROM pg_class WHERE relname = 'folders'");
  console.log('\n=== folders RLS enabled ===');
  console.log(rls.rows);

  // Check policies
  const policies = await client.query("SELECT tablename, policyname, permissive, roles, cmd, qual, with_check FROM pg_policies WHERE tablename = 'folders'");
  console.log('\n=== folders policies ===');
  console.log(policies.rows);

  await client.end();
}
check();
