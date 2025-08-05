import { redirect } from 'next/navigation';
import { getUserSession } from '@/server/features/auth';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getUserSession();

  if (!user) {
    redirect('/login');
  }
  return <>{children}</>;
}
