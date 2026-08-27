const { Client } = require('pg');

async function run() {
  const client = new Client({ connectionString: 'postgres://postgres.mgmfcxpjweljmyfvjupg:Ideal%20for%20agent-first%20workflows%3A%20update%20your%20schema%20in%20code%2C%20push%20it%20to%20GitHub%2C%20and%20Supa@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres' });
  
  try {
    await client.connect();
    
    const res = await client.query('SELECT id, email, raw_user_meta_data FROM auth.users');
    
    const roleCount = {};

    for (const user of res.rows) {
      const role = user.raw_user_meta_data?.role || 'user';
      let prefix = role.replace('operator-', ''); // operator-keuangan -> keuangan, admin -> admin
      
      // Handle special cases
      if (prefix === 'pegawai') prefix = 'kepegawaian';
      
      roleCount[prefix] = (roleCount[prefix] || 0) + 1;
      
      let newEmail = `${prefix}@bpkad`;
      if (roleCount[prefix] > 1) {
        newEmail = `${prefix}${roleCount[prefix]}@bpkad`;
      }

      await client.query(`
        UPDATE auth.users 
        SET 
          email = $1,
          encrypted_password = crypt('bpkad2026', gen_salt('bf'))
        WHERE id = $2
      `, [newEmail, user.id]);
      
      console.log(`Updated user ${user.id}: email changed from ${user.email} to ${newEmail}`);
    }

  } catch (e) {
    console.error('Error:', e);
  } finally {
    await client.end();
  }
}

run();
