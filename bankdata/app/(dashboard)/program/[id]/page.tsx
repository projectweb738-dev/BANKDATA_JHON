import { requireAuth } from '@/lib/auth';
import Header from '@/components/layout/Header';
import Button from '@/components/ui/button';

export default async function DetailProgramPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAuth();
  const id = (await params).id;

  return (
    <div>
      <Header
        title="Detail Program"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Data Program', href: '/program' },
          { label: 'Detail' },
        ]}
      />
      <div className="p-6 max-w-3xl">
        <div className="card p-6 text-center space-y-4">
          <h2 className="text-xl font-medium text-slate-800">Detail Program #{id}</h2>
          <p className="text-slate-500">Halaman detail program sedang dalam pengembangan.</p>
          <div className="pt-4 flex justify-center gap-3">
            <Button href="/program" variant="secondary">Kembali</Button>
            <Button href={`/program/${id}/edit`}>Edit Data</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
