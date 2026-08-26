const { Client } = require('pg');

async function deleteUsers() {
  const client = new Client({
    connectionString: 'postgres://postgres.mgmfcxpjweljmyfvjupg:Ideal%20for%20agent-first%20workflows%3A%20update%20your%20schema%20in%20code%2C%20push%20it%20to%20GitHub%2C%20and%20Supa@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres'
  });

  try {
    await client.connect();
    
    // Delete the 4 operator users created via SQL
    const res = await client.query(`
      DELETE FROM auth.users 
      WHERE email IN (
        'keuangan@sulteng.go.id', 
        'pegawai@sulteng.go.id', 
        'aset@sulteng.go.id', 
        'program@sulteng.go.id'
      )
      RETURNING email;
    `);
    
    console.log('Deleted users:', res.rows);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

deleteUsers();
