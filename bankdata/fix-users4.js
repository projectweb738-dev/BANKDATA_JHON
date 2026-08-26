const { Client } = require('pg');

async function fixUsers() {
  const client = new Client({
    connectionString: 'postgres://postgres.mgmfcxpjweljmyfvjupg:Ideal%20for%20agent-first%20workflows%3A%20update%20your%20schema%20in%20code%2C%20push%20it%20to%20GitHub%2C%20and%20Supa@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres'
  });

  try {
    await client.connect();
    console.log('Connected to DB');

    const res = await client.query(`
      UPDATE auth.users 
      SET 
        encrypted_password = crypt('GantiSegera!2026', gen_salt('bf')),
        email_confirmed_at = COALESCE(email_confirmed_at, now())
      WHERE email IN (
        'keuangan@sulteng.go.id', 
        'pegawai@sulteng.go.id', 
        'aset@sulteng.go.id', 
        'program@sulteng.go.id', 
        'admin@sulteng.go.id'
      )
      RETURNING email;
    `);

    console.log('Updated users:', res.rows);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

fixUsers();
