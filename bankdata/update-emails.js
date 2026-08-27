const { Client } = require('pg');
async function run() {
  const client = new Client({ connectionString: 'postgres://postgres.mgmfcxpjweljmyfvjupg:Ideal%20for%20agent-first%20workflows%3A%20update%20your%20schema%20in%20code%2C%20push%20it%20to%20GitHub%2C%20and%20Supa@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres' });
  await client.connect();
  
  // Update auth.users
  const res = await client.query(`
    UPDATE auth.users 
    SET email = REPLACE(email, '.go.id', '') 
    WHERE email LIKE '%.go.id'
    RETURNING id, email;
  `);
  console.log('Updated auth.users:', res.rows);

  await client.end();
}
run();
