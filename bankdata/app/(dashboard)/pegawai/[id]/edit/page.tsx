import { requireAuth } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import Header from '@/components/layout/Header';
import { notFound } from 'next/navigation';
import EditForm from './EditForm';

export default async function EditPegawaiPage({ params }: { params: Promise<{ id: string }> }) {
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
        title="Edit Pegawai"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Data Kepegawaian', href: '/pegawai' },
          { label: pegawai.nama, href: `/pegawai/${id}` },
          { label: 'Edit' }
        ]}
      />
      <div className="p-6 max-w-3xl">
        <EditForm pegawai={pegawai} />
      </div>
    </div>
  );
}
