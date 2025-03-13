'use client';

import type { User } from 'next-auth';
import { useRouter } from 'next/navigation';

import { PlusIcon } from '@/components/icons';
import { SidebarHistory } from '@/components/sidebar-history';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  useSidebar,
} from '@/components/ui/sidebar';

export function AppSidebar({ user }: { user: User | undefined }) {
  const router = useRouter();
  const { setOpenMobile } = useSidebar();

  return (
    <Sidebar className="group-data-[side=left]:border-r-0 chatShadow">
      <SidebarHeader>
        <SidebarMenu>
          <div className="flex flex-row justify-between items-center ">
              <span className="text-[16px] font-bold px-2 rounded-md font-clarys ">
                Clarys.AI
              </span>
              <Button
                type="button"
                className="rounded-xl p-2 h-fit border"
                 aria-label="Plus Icon"
                onClick={() => {
                  setOpenMobile(false);
                  router.push('/');
                  router.refresh();
                }}
              >
                <PlusIcon />
              </Button>
          </div>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="-mx-2">
          <SidebarHistory user={user} />
        </SidebarGroup>
      </SidebarContent>
      {/*<SidebarFooter className="gap-0 -mx-2">*/}
      {/*  {user && (*/}
      {/*    <SidebarGroup>*/}
      {/*      <SidebarGroupContent>*/}
      {/*        <SidebarUserNav user={user} />*/}
      {/*      </SidebarGroupContent>*/}
      {/*    </SidebarGroup>*/}
      {/*  )}*/}
      {/*</SidebarFooter>*/}
    </Sidebar>
  );
}
