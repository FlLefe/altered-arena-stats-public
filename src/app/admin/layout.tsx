import { getUserSession } from '@/server/features';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await getUserSession({ adminOnly: true });

  return <>{children}</>;
}
