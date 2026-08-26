const { Client } = require('pg');

async function checkAppMetaData() {
  const client = new Client({
    connectionString: 'postgres://postgres.mgmfcxpjweljmyfvjupg:Ideal%20for%20agent-first%20workflows%3A%20update%20your%20schema%20in%20code%2C%20push%20it%20to%20GitHub%2C%20and%20Supa@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres'
  });

  try {
    await client.connect();
    const res = await client.query(`
      SELECT email, raw_app_meta_data, instance_id, id 
      FROM auth.users 
      WHERE email IN (
        'keuangan@sulteng.go.id', 
        'admin@sulteng.go.id'
      );
    `);
    console.log('MetaData:', res.rows);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

checkAppMetaData();
