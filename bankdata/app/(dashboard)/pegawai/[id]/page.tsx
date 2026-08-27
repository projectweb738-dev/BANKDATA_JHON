import { requireAuth } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import Header from '@/components/layout/Header';
import { notFound } from 'next/navigation';
import { formatTanggal } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import { labelStatusPegawai, warnaBadgePegawai } from '@/lib/utils';
import Button from '@/components/ui/button';

export default async function DetailPegawaiPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAuth();
  const supabase = await createClient();
  const id = (await params).id;

  const { data: pegawai } = await supabase
    .from('pegawai')
    .select('*')
    .eq('id', id)
    .single();

  if (!pegawai) notFound();

  return (
    <div>
      <Header
        title="Detail Pegawai"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Data Kepegawaian', href: '/pegawai' },
          { label: pegawai.nama },
        ]}
      />
      <div className="p-6 max-w-3xl">
        <div className="card p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-800">{pegawai.nama}</h2>
              <p className="text-slate-500 font-mono mt-1">{pegawai.nip}</p>
            </div>
            <Badge className={warnaBadgePegawai(pegawai.status)}>
              {labelStatusPegawai(pegawai.status)}
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-slate-500 mb-1">Jabatan</p>
              <p className="font-medium text-slate-800">{pegawai.jabatan}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">Golongan</p>
              <p className="font-medium text-slate-800">{pegawai.golongan || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">Unit Kerja</p>
              <p className="font-medium text-slate-800">{pegawai.unit_kerja}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">Pendidikan Terakhir</p>
              <p className="font-medium text-slate-800">{pegawai.pendidikan_terakhir || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">TMT Jabatan</p>
              <p className="font-medium text-slate-800">{formatTanggal(pegawai.tmt_jabatan)}</p>
            </div>
          </div>
          
          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <Button href="/pegawai" variant="secondary">Kembali</Button>
            <Button href={`/pegawai/${id}/edit`}>Edit Data</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
