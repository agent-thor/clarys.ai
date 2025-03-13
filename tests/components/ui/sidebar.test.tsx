import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SidebarProvider, Sidebar, SidebarTrigger, SidebarContent, SidebarMenu, SidebarMenuItem } from '../../../components/ui/sidebar';

describe('Sidebar Component', () => {
  it('renders Sidebar and its children correctly', () => {
    render(
      <SidebarProvider>
        <Sidebar>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>Menu Item 1</SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    );

    expect(screen.getByText('Menu Item 1')).toBeInTheDocument();
  });

  it('renders Sidebar in expanded state by default', () => {
    render(
      <SidebarProvider defaultOpen>
        <Sidebar>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>Expanded Item</SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    );

    expect(screen.getByText('Expanded Item')).toBeVisible();
  });

  it('renders sidebar with correct mobile behavior', () => {
    const mockUseIsMobile = jest.fn().mockReturnValue(true);
    jest.mock('@/hooks/use-mobile', () => ({ useIsMobile: mockUseIsMobile }));

    render(
      <SidebarProvider>
        <Sidebar>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>Mobile Item</SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    );

    expect(screen.getByText('Mobile Item')).toBeInTheDocument();
  });
});
