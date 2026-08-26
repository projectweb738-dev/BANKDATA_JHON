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
  
  // Check users table RLS
  const rls = await client.query("SELECT relname, relrowsecurity FROM pg_class WHERE relname = 'users' AND relkind = 'r'");
  console.log('=== users RLS ===', rls.rows);

  // Check users table policies
  const policies = await client.query("SELECT tablename, policyname, permissive, roles, cmd FROM pg_policies WHERE tablename = 'users'");
  console.log('=== users policies ===', policies.rows);

  // Check if jhon user exists in public.users
  const jhonUser = await client.query("SELECT id, email FROM users WHERE email LIKE '%jhon%' OR email LIKE '%admin%'");
  console.log('=== admin users ===', jhonUser.rows);

  // Try simulate what getCurrentUser does - insert a new user
  console.log('\n=== Simulating user sync insert ===');
  try {
    const res = await client.query("INSERT INTO users (name, email, password, is_active) VALUES ('Test User', 'test_debug_delete@test.com', 'sync-from-supabase', true) RETURNING id;");
    console.log('SUCCESS, inserted id:', res.rows[0].id);
    await client.query("DELETE FROM users WHERE email = 'test_debug_delete@test.com'");
    console.log('Cleanup done');
  } catch(e) {
    console.log('FAILED:', e.message);
  }

  await client.end();
}
check();
