const { Client } = require('pg');
const crypto = require('crypto');

async function insertUsers() {
  const client = new Client({
    connectionString: 'postgres://postgres.mgmfcxpjweljmyfvjupg:Ideal%20for%20agent-first%20workflows%3A%20update%20your%20schema%20in%20code%2C%20push%20it%20to%20GitHub%2C%20and%20Supa@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres'
  });

  // Since keuangan was already inserted, we'll delete it first to ensure we don't duplicate
  const users = [
    { email: 'keuangan@sulteng.go.id', role: 'operator-keuangan' },
    { email: 'pegawai@sulteng.go.id', role: 'operator-kepegawaian' },
    { email: 'aset@sulteng.go.id', role: 'operator-aset' },
    { email: 'program@sulteng.go.id', role: 'operator-program' }
  ];

  try {
    await client.connect();
    console.log('Connected to DB');
    
    await client.query(`
      DELETE FROM auth.users 
      WHERE email IN (
        'keuangan@sulteng.go.id', 
        'pegawai@sulteng.go.id', 
        'aset@sulteng.go.id', 
        'program@sulteng.go.id'
      );
    `);

    for (const u of users) {
      const userId = crypto.randomUUID();
      
      await client.query(`
        INSERT INTO auth.users (
          id, instance_id, aud, role, email, encrypted_password, 
          email_confirmed_at, raw_app_meta_data, raw_user_meta_data, 
          created_at, updated_at, confirmation_token, email_change_token_new, recovery_token,
          email_change, phone_change, phone_change_token, email_change_token_current, reauthentication_token
        )
        VALUES (
          $1, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', $2, 
          crypt('GantiSegera!2026', gen_salt('bf')),
          now(), '{"provider":"email","providers":["email"]}', $3,
          now(), now(), '', '', '',
          '', '', '', '', ''
        )
        RETURNING id;
      `, [userId, u.email, { role: u.role, is_active: true }]);

      console.log('Inserted user ' + u.email + ' into auth.users');

      await client.query(`
        INSERT INTO auth.identities (
          id, provider_id, user_id, identity_data, provider, created_at, updated_at
        )
        VALUES (
          gen_random_uuid(), $1, $2, $3, 'email', now(), now()
        );
      `, [userId, userId, { sub: userId, email: u.email, email_verified: true }]);

      console.log('Inserted identity for ' + u.email);
    }

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

insertUsers();
