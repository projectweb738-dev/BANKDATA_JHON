require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function check() {
  const modul = 'kepegawaian';
  const q = 'scdv';
  
  let allFoldersQuery = supabase
      .from('folders')
      .select('*')
      .is('deleted_at', null)
      .order('nama', { ascending: true });
  allFoldersQuery = allFoldersQuery.eq('modul', modul);
  
  const { data: allFolders, error: err } = await allFoldersQuery;
  
  console.log('allFolders:', allFolders);
  console.log('err:', err);
  
  const matchedFolders = (allFolders ?? [])
      .filter(f => f.nama.toLowerCase().includes(q))
      .map(f => ({
        ...f,
      }));
  console.log('matchedFolders:', matchedFolders);
}
check();
