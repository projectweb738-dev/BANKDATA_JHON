'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import Alert from '@/components/ui/Alert';

interface ProfileData {
  name: string;
  email: string;
  role: string;
  unit_kerja: string;
}

export default function ProfilPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/me');
        if (res.ok) {
          const data = await res.json() as { user: ProfileData };
          setProfile(data.user);
        }
      } catch {
        // ignore
      } finally {
        setLoadingData(false);
      }
    }
    fetchProfile();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const form = new FormData(e.currentTarget);
    const name = form.get('name') as string;
    const email = form.get('email') as string;
    const password = form.get('password') as string;
    const old_password = form.get('old_password') as string;
    const confirmPassword = form.get('confirm_password') as string;

    // Validasi password
    if (password && password !== confirmPassword) {
      setError('Kata sandi baru dan konfirmasi tidak cocok.');
      setLoading(false);
      return;
    }


    const payload: Record<string, string> = { name };
    if (email && email !== profile?.email) payload['email'] = email;
    if (password) {
      payload['password'] = password;
      payload['old_password'] = old_password;
    }

    const res = await fetch('/api/profil', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json() as { message?: string; error?: string };

    if (!res.ok) {
      setError(data.error ?? 'Gagal memperbarui profil.');
      setLoading(false);
      return;
    }

    setSuccess('Profil berhasil diperbarui! Jika Anda mengubah email atau kata sandi, silakan login kembali.');
    setLoading(false);

    // Reset field password
    (e.target as HTMLFormElement).reset();
    if (profile) {
      setProfile({ ...profile, name, email: payload['email'] ?? profile.email });
    }
  }

  const roleLabel: Record<string, string> = {
    admin: 'Administrator',
    'operator-kepegawaian': 'Operator Kepegawaian',
    'operator-keuangan': 'Operator Keuangan',
    'operator-program': 'Operator Program',
    'operator-aset': 'Operator Aset',
    viewer: 'Viewer',
  };

  if (loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <Header
        title="Profil Akun"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Profil Akun' },
        ]}
      />

      <div className="p-6 max-w-2xl space-y-6">
        {/* Info akun */}
        {profile && (
          <div className="card p-5 flex items-center gap-4">
            <div className="w-14 h-14 bg-emerald-600/20 border-2 border-emerald-500/40 rounded-full flex items-center justify-center shrink-0">
              <span className="text-emerald-500 text-xl font-bold">
                {profile.name?.charAt(0).toUpperCase() ?? '?'}
              </span>
            </div>
            <div>
              <p className="font-semibold text-slate-800 text-lg">{profile.name}</p>
              <p className="text-slate-500 text-sm">{profile.email}</p>
              <span className="inline-block mt-1 text-xs bg-purple-100 text-purple-700 rounded-full px-2 py-0.5 font-medium">
                {roleLabel[profile.role] ?? profile.role}
              </span>
              {profile.unit_kerja && (
                <span className="inline-block mt-1 ml-2 text-xs bg-slate-100 text-slate-600 rounded-full px-2 py-0.5">
                  {profile.unit_kerja}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Form edit */}
        <div className="card p-6">
          <h3 className="font-semibold text-slate-800 mb-5 pb-3 border-b border-slate-100">Edit Profil</h3>

          {success && <Alert type="success" className="mb-5">{success}</Alert>}
          {error && <Alert type="error" className="mb-5">{error}</Alert>}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nama */}
            <Input
              label="Nama Lengkap"
              name="name"
              required
              defaultValue={profile?.name ?? ''}
              placeholder="Nama lengkap Anda"
            />

            {/* Email */}
            <Input
              label="Alamat Email"
              name="email"
              type="email"
              required
              defaultValue={profile?.email ?? ''}
              placeholder="email@contoh.com"
              hint="Jika email diubah, Anda perlu login ulang dengan email baru."
            />

            {/* Divider */}
            <div className="pt-2 pb-1 border-t border-slate-100">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Ubah Kata Sandi</p>
              <p className="text-xs text-slate-400 mt-1">Kosongkan semua field kata sandi jika tidak ingin mengubah.</p>
            </div>

            {/* Password lama */}
            <Input
              label="Kata Sandi Lama"
              name="old_password"
              type="password"
              placeholder="Kata sandi saat ini (untuk referensi log)"
              hint="Digunakan untuk keperluan log aktivitas."
            />

            {/* Password baru */}
            <Input
              label="Kata Sandi Baru"
              name="password"
              type="password"
              placeholder="Minimal 6 karakter"
            />

            {/* Konfirmasi password */}
            <Input
              label="Konfirmasi Kata Sandi Baru"
              name="confirm_password"
              type="password"
              placeholder="Ulangi kata sandi baru"
            />

            <div className="flex gap-3 pt-2 border-t border-slate-100">
              <Button type="submit" loading={loading} disabled={loading}>
                Simpan Perubahan
              </Button>
              <Button type="button" variant="secondary" onClick={() => router.back()}>
                Batal
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
