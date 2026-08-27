require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function check() {
  const modul = 'kepegawaian';
  let allFilesQuery = supabase
      .from('attachments')
      .select('*')
      .order('original_name', { ascending: true });
  allFilesQuery = allFilesQuery.or(`attachable_type.eq.${modul},attachable_type.eq.App\\Models\\Folder`);
  
  const { data, error } = await allFilesQuery;
  console.log('Error:', error);
}
check();
