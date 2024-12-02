'use client';

import {useRouter} from 'next/navigation';
import {useWindowSize} from 'usehooks-ts';

import {ModelSelector} from '@/components/model-selector';
import {SidebarToggle} from '@/components/sidebar-toggle';
import {Button} from '@/components/ui/button';
import {BetterTooltip} from '@/components/ui/tooltip';
import {PlusIcon} from './icons';
import {useSidebar} from './ui/sidebar';


export function ChatHeader({ selectedModelId }: { selectedModelId: string }) {
  const router = useRouter();
  const { open } = useSidebar();

  const { width: windowWidth } = useWindowSize();

  return (
    <header className="flex sticky top-0 bg-background items-center gap-2 justify-between">

      <SidebarToggle />
      {/*{(!open || windowWidth < 768) && (
        <BetterTooltip content="New Chat">
          <Button
            variant="outline"
            className="order-2 md:order-1 md:px-2 px-2 md:h-fit ml-auto md:ml-0"
            onClick={() => {
              router.push('/');
              router.refresh();
            }}
          >
            <PlusIcon />
            <span className="md:sr-only">New Chat</span>
          </Button>
        </BetterTooltip>
      )}*/}
      {/*<ModelSelector
        selectedModelId={selectedModelId}
        className="order-1 md:order-2"
      />*/}

      <div>menu</div>

        {/*<DropdownMenu>
            <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="data-[state=open]:bg-sidebar-accent bg-background data-[state=open]:text-sidebar-accent-foreground h-10">
                    <Image
                        src={`https://avatar.vercel.sh/${user.email}`}
                        alt={user.email ?? 'User Avatar'}
                        width={24}
                        height={24}
                        className="rounded-full"
                    />
                    <span className="truncate">{ 'user mail'}</span> user?.email
                    <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
            >
                <DropdownMenuItem
                  className="cursor-pointer"
                  onSelect={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                >
                  {`Toggle ${theme === 'light' ? 'dark' : 'light'} mode`}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <button
                        type="button"
                        className="w-full cursor-pointer"
                        onClick={() => {
                            signOut({
                                redirectTo: '/',
                            });
                        }}
                    >
                        Sign out
                    </button>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>*/}
    </header>
  );
}
