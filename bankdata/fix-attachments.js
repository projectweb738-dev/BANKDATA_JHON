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

  // Fix attachments.uploaded_by - bigint to varchar
  console.log('=== Fixing attachments.uploaded_by ===');
  try {
    // Check if there's a FK constraint
    const fkRes = await client.query("SELECT constraint_name FROM information_schema.table_constraints WHERE table_name='attachments' AND constraint_type='FOREIGN KEY';");
    console.log('FK constraints on attachments:', fkRes.rows);
    
    for (const row of fkRes.rows) {
      await client.query(`ALTER TABLE attachments DROP CONSTRAINT IF EXISTS "${row.constraint_name}";`);
      console.log('Dropped constraint:', row.constraint_name);
    }
    
    await client.query("ALTER TABLE attachments ALTER COLUMN uploaded_by TYPE varchar(36);");
    console.log('SUCCESS: attachments.uploaded_by changed to varchar(36)');
  } catch(e) {
    console.log('FAILED:', e.message);
  }

  // Verify all tables now
  console.log('\n=== All user-ref columns (bigint) remaining ===');
  const res = await client.query("SELECT table_name, column_name, data_type FROM information_schema.columns WHERE table_schema = 'public' AND column_name IN ('created_by', 'updated_by', 'user_id', 'causer_id', 'uploaded_by') AND data_type IN ('bigint', 'integer');");
  console.log(res.rows);

  await client.end();
}
fix();
