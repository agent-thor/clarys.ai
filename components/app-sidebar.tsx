'use client';

import type { User } from 'next-auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { PlusIcon } from '@/components/icons';
import { SidebarHistory } from '@/components/sidebar-history';
import { ExampleQueries } from '@/components/example-queries';
import { useSection } from '@/components/section-context';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  useSidebar,
} from '@/components/ui/sidebar';
import type { ExampleQuery } from '@/hooks/use-example-queries';

export function AppSidebar({ user }: { user: User | undefined }) {
  const router = useRouter();
  const { setOpenMobile } = useSidebar();
  const { currentSection } = useSection();

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
        <SidebarGroup className="-mx-2">
          <ExampleQueries 
            user={user} 
            currentSection={currentSection}
            onQuerySelect={(section, queries) => {
              // Store conversation data in sessionStorage to avoid URL size limits
              const conversationId = `conversation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
              const conversationData = {
                section,
                queries: queries.map(q => ({
                  query: q.query,
                  response: q.response
                }))
              };
              
              // Store in sessionStorage and ensure it's written before navigation
              if (typeof window !== 'undefined') {
                try {
                  sessionStorage.setItem(conversationId, JSON.stringify(conversationData));
                  console.log('✅ Stored conversation data for ID:', conversationId);
                  
                  // Navigate to a new chat with conversation history using the ID
                  router.push(`/chat/conversation-history?id=${conversationId}`);
                  setOpenMobile(false);
                } catch (error) {
                  console.error('❌ Failed to store conversation data:', error);
                  // Fallback: just navigate to home
                  router.push('/');
                  setOpenMobile(false);
                }
              }
            }}
          />
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
