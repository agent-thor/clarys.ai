"use client";

import { usePathname } from "next/navigation";
import type { User } from "next-auth";
import { MessageSquareIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useExampleQueries, type ExampleQuery } from "@/hooks/use-example-queries";

// Function to determine current section based on pathname or context
const getCurrentSection = (pathname: string): 'accountability-check' | 'extract-with-proposals' | 'general-chat' => {
  // Since we can't easily determine the section from the pathname alone,
  // we'll need to get this from the current active section context
  // For now, we'll default to general-chat and update this logic later
  return 'general-chat';
};

const ConversationHistoryItem = ({ 
  sectionTitle,
  queriesCount,
  onClick 
}: { 
  sectionTitle: string;
  queriesCount: number;
  onClick: () => void;
}) => {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton 
        onClick={onClick}
        className="group flex items-start gap-2 px-2 py-2 text-left hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md cursor-pointer"
      >
        <MessageSquareIcon className="h-4 w-4 mt-0.5 shrink-0 text-sidebar-foreground/70" />
        <div className="flex-1 min-w-0">
          <p className="text-[13px] text-sidebar-foreground/90 font-medium">
            {sectionTitle}
          </p>
          <p className="text-[11px] text-sidebar-foreground/60">
            {queriesCount} conversation{queriesCount !== 1 ? 's' : ''}
          </p>
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export function ExampleQueries({ 
  user,
  currentSection = 'general-chat',
  onQuerySelect 
}: { 
  user: User | undefined;
  currentSection?: 'accountability-check' | 'extract-with-proposals' | 'general-chat';
  onQuerySelect?: (section: 'accountability-check' | 'extract-with-proposals' | 'general-chat', queries: ExampleQuery[]) => void;
}) {
  const { exampleQueries, loading, error, getQueriesForSection } = useExampleQueries();

  const handleConversationClick = (section: 'accountability-check' | 'extract-with-proposals' | 'general-chat') => {
    const queries = getQueriesForSection(section);
    if (onQuerySelect && queries.length > 0) {
      onQuerySelect(section, queries);
    }
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <SidebarGroup>
        <div className="px-2 py-1 text-[14px] text-sidebar-foreground/50">
          Example Queries
        </div>
        <SidebarGroupContent>
          <div className="flex flex-col gap-2">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="rounded-md h-12 flex gap-2 px-2 items-center"
              >
                <div className="h-4 w-4 bg-sidebar-accent-foreground/10 rounded" />
                <div className="flex-1 space-y-1">
                  <div className="h-3 bg-sidebar-accent-foreground/10 rounded w-3/4" />
                  <div className="h-3 bg-sidebar-accent-foreground/10 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  if (error) {
    return (
      <SidebarGroup>
        <div className="px-2 py-1 text-[14px] text-sidebar-foreground/50">
          Example Queries
        </div>
        <SidebarGroupContent>
          <div className="text-[13px] text-sidebar-foreground/70 px-2 py-2">
            Failed to load example queries
          </div>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  if (!exampleQueries) {
    return (
      <SidebarGroup>
        <div className="px-2 py-1 text-[14px] text-sidebar-foreground/50">
          Conversation History
        </div>
        <SidebarGroupContent>
          <div className="text-[13px] text-sidebar-foreground/70 px-2 py-2">
            No conversation history available
          </div>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  const getSectionDisplayName = (section: string) => {
    switch (section) {
      case 'accountability-check':
        return 'Accountability Check History';
      case 'extract-with-proposals':
        return 'Proposal Comparison History';
      case 'general-chat':
        return 'General Chat History';
      default:
        return 'Conversation History';
    }
  };

  // Get queries for the current section only
  const queries = getQueriesForSection(currentSection);

  if (!queries || queries.length === 0) {
    return (
      <SidebarGroup>
        <div className="px-2 py-1 text-[14px] text-sidebar-foreground/50">
          Example Queries
        </div>
        <SidebarGroupContent>
          <div className="text-[13px] text-sidebar-foreground/70 px-2 py-2">
            No example queries available for this section
          </div>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  return (
    <SidebarGroup>
      <div className="px-2 py-1 text-[14px] text-sidebar-foreground/50">
        Example Queries
      </div>
      <SidebarGroupContent>
        <SidebarMenu>
          <ConversationHistoryItem
            sectionTitle={getSectionDisplayName(currentSection)}
            queriesCount={queries.length}
            onClick={() => handleConversationClick(currentSection)}
          />
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
