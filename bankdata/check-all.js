const { Client } = require('pg');

async function checkAll() {
  const client = new Client({
    connectionString: 'postgres://postgres.mgmfcxpjweljmyfvjupg:Ideal%20for%20agent-first%20workflows%3A%20update%20your%20schema%20in%20code%2C%20push%20it%20to%20GitHub%2C%20and%20Supa@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres'
  });

  try {
    await client.connect();
    const res = await client.query(`
      SELECT * 
      FROM auth.users 
      WHERE email IN ('admin@sulteng.go.id', 'keuangan@sulteng.go.id');
    `);
    console.log(res.rows);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

checkAll();
