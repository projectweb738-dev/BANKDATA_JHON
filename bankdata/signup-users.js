const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mgmfcxpjweljmyfvjupg.supabase.co';
const supabaseKey = 'sb_publishable_hhABksjKjMkkx1BCaEpzEA_kTVOr2tw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function registerUsers() {
  const usersToCreate = [
    { email: 'keuangan@sulteng.go.id', role: 'operator-keuangan', name: 'Bagian Keuangan' },
    { email: 'pegawai@sulteng.go.id', role: 'operator-kepegawaian', name: 'Bagian Kepegawaian' },
    { email: 'program@sulteng.go.id', role: 'operator-program', name: 'Bagian Program' },
    { email: 'aset@sulteng.go.id', role: 'operator-aset', name: 'Bagian Aset' },
  ];

  for (const u of usersToCreate) {
    const { data, error } = await supabase.auth.signUp({
      email: u.email,
      password: 'GantiSegera!2026',
      options: {
        data: {
          role: u.role,
          name: u.name,
          is_active: true
        }
      }
    });

    if (error) {
      console.error(`Failed to register ${u.email}:`, error.message);
    } else {
      console.log(`Successfully registered ${u.email}:`, data.user.id);
    }
  }
}

registerUsers();
