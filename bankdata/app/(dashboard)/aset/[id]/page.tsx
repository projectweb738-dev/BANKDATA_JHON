import { requireAuth } from '@/lib/auth';
import Header from '@/components/layout/Header';
import Button from '@/components/ui/button';

export default async function DetailAsetPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAuth();
  const id = (await params).id;

  return (
    <div>
      <Header
        title="Detail Aset"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Data Aset', href: '/aset' },
          { label: 'Detail' },
        ]}
      />
      <div className="p-6 max-w-3xl">
        <div className="card p-6 text-center space-y-4">
          <h2 className="text-xl font-medium text-slate-800">Detail Aset #{id}</h2>
          <p className="text-slate-500">Halaman detail aset sedang dalam pengembangan.</p>
          <div className="pt-4 flex justify-center gap-3">
            <Button href="/aset" variant="secondary">Kembali</Button>
            <Button href={`/aset/${id}/edit`}>Edit Data</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
