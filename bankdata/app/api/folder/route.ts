import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser, logActivity } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const modul = searchParams.get('modul');
  const parentId = searchParams.get('parent_id'); // can be "null" string or number
  const q = (searchParams.get('q') ?? '').trim().toLowerCase();
  const globalSearch = searchParams.get('global') === 'true';

  const supabase = await createClient();

  // ── MODE PENCARIAN GLOBAL ─────────────────────────────────────────────────
  // Ketika ada kata kunci, cari di semua folder & file tanpa filter parent_id
  if (globalSearch && q) {
    // Ambil semua folder di modul ini (tanpa filter parent_id)
    let allFoldersQuery = supabase
      .from('folders')
      .select('*')
      .is('deleted_at', null)
      .order('nama', { ascending: true });
    if (modul) allFoldersQuery = allFoldersQuery.eq('modul', modul);
    const { data: allFolders } = await allFoldersQuery;

    // Ambil semua attachment di modul ini
    let allFilesQuery = supabase
      .from('attachments')
      .select('*')
      .order('original_name', { ascending: true });
    if (modul) allFilesQuery = allFilesQuery.or(`attachable_type.eq.${modul},attachable_type.eq.App\\Models\\Folder`);
    const { data: allFiles } = await allFilesQuery;

    // Buat map id -> folder untuk resolusi path
    const folderMap = new Map<number, { id: number; nama: string; parent_id: number | null }>(
      (allFolders ?? []).map(f => [f.id, f])
    );

    // Fungsi bantu: resolusi path folder ke array nama
    function buildPath(folderId: number | null): string[] {
      if (!folderId) return [];
      const path: string[] = [];
      let current = folderMap.get(folderId);
      while (current) {
        path.unshift(current.nama);
        current = current.parent_id ? folderMap.get(current.parent_id) : undefined;
      }
      return path;
    }

    // Filter folder yang cocok dengan kata kunci
    const matchedFolders = (allFolders ?? [])
      .filter(f => f.nama.toLowerCase().includes(q))
      .map(f => ({
        ...f,
        _path: buildPath(f.parent_id), // path parent sebelum folder ini
      }));

    // Filter file yang cocok dengan kata kunci
    const matchedFiles = (allFiles ?? [])
      .filter(f => f.original_name.toLowerCase().includes(q))
      .map(f => ({
        ...f,
        _path: f.attachable_type === 'App\\Models\\Folder'
          ? buildPath(f.attachable_id)
          : [], // file di root modul
      }));

    return NextResponse.json({ data: matchedFolders, files: matchedFiles, globalSearch: true });
  }

  // ── MODE NORMAL: tampilkan konten folder saat ini ─────────────────────────
  let query = supabase.from('folders').select('*').is('deleted_at', null).order('nama', { ascending: true });

  if (modul) query = query.eq('modul', modul);
  
  if (parentId === 'null' || !parentId) {
    query = query.is('parent_id', null);
  } else {
    query = query.eq('parent_id', Number(parentId));
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ message: error.message }, { status: 500 });

  // Fetch attachments
  const attachableType = (parentId === 'null' || !parentId) ? modul : 'App\\Models\\Folder';
  const attachableId = (parentId === 'null' || !parentId) ? 0 : Number(parentId);

  let attachQuery = supabase
    .from('attachments')
    .select('*')
    .eq('attachable_type', attachableType)
    .eq('attachable_id', attachableId)
    .order('original_name', { ascending: true });

  const { data: filesData, error: attachError } = await attachQuery;

  return NextResponse.json({ 
    data, // folders
    files: attachError ? [] : filesData 
  });
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const body = await request.json() as Record<string, unknown>;
  const errors: Record<string, string> = {};

  if (!body['nama']) errors['nama'] = 'Nama folder wajib diisi.';
  if (!body['modul']) errors['modul'] = 'Modul folder wajib diisi.';

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ message: 'Validasi gagal.', errors }, { status: 422 });
  }

  // Log user info for debugging
  console.log('[POST /api/folder] user.id:', user.id, 'email:', user.email);
  console.log('[POST /api/folder] SERVICE_ROLE_KEY present:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);

  let supabase;
  try {
    const { createServiceClient, createClient } = await import('@/lib/supabase/server');
    supabase = process.env.SUPABASE_SERVICE_ROLE_KEY
      ? await createServiceClient()
      : await createClient();
  } catch (clientErr: any) {
    console.error('[POST /api/folder] Failed to create supabase client:', clientErr);
    return NextResponse.json({ message: `Gagal membuat koneksi DB: ${clientErr.message}` }, { status: 500 });
  }

  const insertPayload = {
    nama: body['nama'],
    modul: body['modul'],
    parent_id: body['parent_id'] ? Number(body['parent_id']) : null,
    created_by: user.id,
  };
  console.log('[POST /api/folder] insert payload:', insertPayload);

  const { data, error } = await supabase.from('folders').insert(insertPayload).select().single();

  if (error) {
    console.error('[POST /api/folder] DB error:', error);
    return NextResponse.json({ message: `DB Error: ${error.message} (code: ${error.code})` }, { status: 500 });
  }

  await logActivity({ logName: 'folder', description: `Membuat folder ${data.nama}`, causerId: user.id, subjectType: 'folder', subjectId: data.id });
  return NextResponse.json({ data, message: 'Folder berhasil dibuat.' }, { status: 201 });
}
