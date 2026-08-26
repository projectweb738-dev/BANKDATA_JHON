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
  
  const tables = ['sessions', 'login_otps'];
  for (const t of tables) {
    const fkRes = await client.query(`SELECT constraint_name FROM information_schema.table_constraints WHERE table_name='${t}' AND constraint_type='FOREIGN KEY';`);
    for (const row of fkRes.rows) {
      await client.query(`ALTER TABLE ${t} DROP CONSTRAINT IF EXISTS "${row.constraint_name}";`);
      console.log(`Dropped FK: ${row.constraint_name}`);
    }
    try {
      await client.query(`ALTER TABLE ${t} ALTER COLUMN user_id TYPE varchar(36);`);
      console.log(`SUCCESS: ${t}.user_id changed to varchar(36)`);
    } catch(e) {
      console.log(`FAILED ${t}:`, e.message);
    }
  }

  // Also fix activity_log.subject_id if it's bigint
  const subjectCheck = await client.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'activity_log' AND column_name = 'subject_id'");
  console.log('\nactivity_log.subject_id type:', subjectCheck.rows);

  console.log('\n=== Final check - all bigint user-ref columns ===');
  const res = await client.query("SELECT table_name, column_name, data_type FROM information_schema.columns WHERE table_schema = 'public' AND column_name IN ('created_by', 'updated_by', 'user_id', 'causer_id', 'uploaded_by') AND data_type IN ('bigint', 'integer');");
  console.log(res.rows);

  await client.end();
}
fix();
