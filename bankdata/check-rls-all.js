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

  const tables = ['pegawai', 'program', 'aset', 'keuangan', 'folders', 'attachments', 'users', 'activity_log'];

  for (const t of tables) {
    // Check row count
    const count = await client.query(`SELECT COUNT(*) FROM "${t}"`);
    // Check RLS
    const rls = await client.query(`SELECT relrowsecurity FROM pg_class WHERE relname = '${t}' AND relkind = 'r'`);
    // Check policies
    const policies = await client.query(`SELECT policyname, cmd, roles FROM pg_policies WHERE tablename = '${t}'`);
    console.log(`\n=== ${t} ===`);
    console.log(`  Rows: ${count.rows[0].count}`);
    console.log(`  RLS enabled: ${rls.rows[0]?.relrowsecurity ?? 'N/A'}`);
    console.log(`  Policies: ${policies.rows.length > 0 ? JSON.stringify(policies.rows) : 'none'}`);
  }

  await client.end();
}
check();
