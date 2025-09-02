import { cookies } from 'next/headers';

import { AppSidebar } from '@/components/app-sidebar';
import { SectionProvider } from '@/components/section-context';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { UsageGuideWrapper } from '@/components/usage-guide-wrapper';

import { auth } from '../(auth)/auth';

export const experimental_ppr = true;
export const dynamic = 'force-dynamic'
export const maxDuration = 60;

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, cookieStore] = await Promise.all([auth(), cookies()]);
  const isCollapsed = cookieStore.get('sidebar:state')?.value === 'false';

  return (
    <SectionProvider>
      <SidebarProvider defaultOpen={!isCollapsed}>
        <AppSidebar user={session?.user} />
        <SidebarInset>
          <UsageGuideWrapper>
            {children}
          </UsageGuideWrapper>
        </SidebarInset>
      </SidebarProvider>
    </SectionProvider>
  );
}
