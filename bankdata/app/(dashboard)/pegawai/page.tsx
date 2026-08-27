import { requireAuth } from '@/lib/auth';
import Header from '@/components/layout/Header';
import type { Metadata } from 'next';
import FolderExplorer from '@/components/ui/FolderExplorer';

export const metadata: Metadata = { title: 'Data Kepegawaian' };

export default async function PegawaiPage() {
  const user = await requireAuth();
  const bisaKelola = ['admin', 'operator-kepegawaian'].includes(user.role);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header
        title="Data Kepegawaian"
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Data Kepegawaian' }]}
      />
      <div className="p-4 sm:p-6 flex-1 overflow-hidden flex flex-col">
        <FolderExplorer modul="kepegawaian" canManage={bisaKelola} />
      </div>
    </div>
  );
}
