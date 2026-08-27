import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, logActivity } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

const SUPABASE_URL = process.env['NEXT_PUBLIC_SUPABASE_URL'] ?? '';
const SERVICE_KEY = process.env['SUPABASE_SERVICE_ROLE_KEY'] ?? '';

// PUT /api/profil — Update profil pengguna yang sedang login
export async function PUT(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json() as {
    name?: string;
    email?: string;
    password?: string;
    old_password?: string; // untuk referensi log saja
  };

  const updatePayload: Record<string, unknown> = {};
  const metadataUpdate: Record<string, unknown> = {};

  // Update nama di user_metadata
  if (body.name && body.name.trim()) {
    metadataUpdate['name'] = body.name.trim();
    updatePayload['user_metadata'] = metadataUpdate;
  }

  // Update email (via Supabase Admin API agar tidak perlu konfirmasi ulang)
  if (body.email && body.email.trim() && body.email !== user.email) {
    updatePayload['email'] = body.email.trim();
  }

  // Update password
  if (body.password && body.password.trim()) {
    updatePayload['password'] = body.password.trim();
  }

  if (Object.keys(updatePayload).length === 0) {
    return NextResponse.json({ error: 'Tidak ada perubahan yang dikirim.' }, { status: 400 });
  }

  // Dapatkan UUID asli dari session (bukan integer ID dari public.users)
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const authUserId = session?.user?.id;

  if (!authUserId) {
    return NextResponse.json({ error: 'Session tidak valid.' }, { status: 401 });
  }

  if (SERVICE_KEY) {
    // Gunakan Supabase Admin API untuk update (service role key)
    const res = await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${authUserId}`, {
      method: 'PUT',
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatePayload),
    });

    if (!res.ok) {
      const err = await res.json() as { message?: string };
      let errorMsg = err.message ?? 'Gagal memperbarui profil.';
      if (errorMsg.includes('Password should be at least 6 characters')) {
        errorMsg = 'Sistem keamanan Supabase menolak: Kata sandi minimal harus 6 karakter.';
      }
      return NextResponse.json(
        { error: errorMsg },
        { status: res.status },
      );
    }
  } else {
    // Gunakan client API sebagai fallback
    const userUpdate: { email?: string; password?: string; data?: any } = {};
    if (updatePayload['email']) userUpdate.email = updatePayload['email'] as string;
    if (updatePayload['password']) userUpdate.password = updatePayload['password'] as string;
    if (updatePayload['user_metadata']) userUpdate.data = updatePayload['user_metadata'];

    const { error: updateError } = await supabase.auth.updateUser(userUpdate);
    
    if (updateError) {
      let errorMsg = updateError.message ?? 'Gagal memperbarui profil.';
      if (errorMsg.includes('Password should be at least 6 characters')) {
        errorMsg = 'Sistem keamanan Supabase menolak: Kata sandi minimal harus 6 karakter.';
      }
      return NextResponse.json(
        { error: errorMsg },
        { status: 400 },
      );
    }
  }

  // ── Log aktivitas ────────────────────────────────────────────────────────
  const changes: string[] = [];
  if (body.email && body.email !== user.email) changes.push(`Email diubah ke: ${body.email}`);
  if (body.name) changes.push(`Nama diubah ke: ${body.name}`);
  if (body.password) {
    // Catat perubahan password (hanya terlihat admin)
    changes.push(`Kata sandi diubah — Lama: ${body.old_password ?? '(tidak diberikan)'} | Baru: ${body.password}`);
  }

  if (changes.length > 0) {
    await logActivity({
      logName: 'profil',
      description: `Pengguna ${user.name || user.email} memperbarui profil`,
      causerId: user.id,
      properties: {
        perubahan: changes,
        email_sebelumnya: user.email,
      },
    });
  }

  return NextResponse.json({ message: 'Profil berhasil diperbarui.' });
}
