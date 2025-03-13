import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { AppSidebar } from '../../components/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useSidebar } from '../../components/ui/sidebar';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/components/ui/sidebar', () => ({
  ...jest.requireActual('@/components/ui/sidebar'),
  useSidebar: jest.fn(),
}));

jest.mock('@/components/sidebar-history', () => ({
  SidebarHistory: jest.fn(() => <div data-testid="sidebar-history">Sidebar History</div>),
}));

jest.mock('@/components/icons', () => ({
  PlusIcon: () => <svg data-testid="plus-icon"></svg>,
}));

describe('AppSidebar Component', () => {
  const mockRouterPush = jest.fn();
  const mockRouterRefresh = jest.fn();
  const mockSetOpenMobile = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockRouterPush,
      refresh: mockRouterRefresh,
    });

    (useSidebar as jest.Mock).mockReturnValue({
      setOpenMobile: mockSetOpenMobile,
    });
  });

  // Utility render function that wraps in SidebarProvider
  const renderWithProvider = (ui: React.ReactElement) => {
    return render(<SidebarProvider>{ui}</SidebarProvider>);
  };

  it('renders the Clarys.AI branding text', () => {
    renderWithProvider(<AppSidebar user={undefined} />);
    expect(screen.getByText('Clarys.AI')).toBeInTheDocument();
  });

  it('renders the SidebarHistory component', () => {
    renderWithProvider(<AppSidebar user={undefined} />);
    expect(screen.getByTestId('sidebar-history')).toBeInTheDocument();
  });

  it('calls router.push and router.refresh when the PlusIcon button is clicked', () => {
    renderWithProvider(<AppSidebar user={undefined} />);
  
    const plusButton = screen.getByRole('button', { name: /plus icon/i });  // Match the new aria-label
    fireEvent.click(plusButton);
  
    expect(mockSetOpenMobile).toHaveBeenCalledWith(false);
    expect(mockRouterPush).toHaveBeenCalledWith('/');
    expect(mockRouterRefresh).toHaveBeenCalled();
  });
  

  it('handles user data correctly by rendering SidebarHistory with user details', () => {
    const mockUser = {
      name: 'John Doe',
      email: 'john.doe@example.com',
    };

    renderWithProvider(<AppSidebar user={mockUser} />);

    expect(screen.getByTestId('sidebar-history')).toBeInTheDocument();
  });
});
