import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SidebarHistory } from '../../components/sidebar-history';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useRouter, useParams } from 'next/navigation';
import useSWR from 'swr';

jest.mock('swr');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
  usePathname: jest.fn(() => '/chat/1'),
}));

describe('SidebarHistory Component', () => {
  const mockMutate = jest.fn();
  const mockRouterPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useParams as jest.Mock).mockReturnValue({ id: '1' });

    (useRouter as jest.Mock).mockReturnValue({
      push: mockRouterPush,
    });

    (useSWR as jest.Mock).mockReturnValue({
      data: [
        { id: '1', title: 'Chat 1', createdAt: new Date().toISOString() },
        { id: '2', title: 'Chat 2', createdAt: new Date().toISOString() }
      ],
      isLoading: false,
      mutate: mockMutate,
    });
  });

  const renderWithProvider = (ui: React.ReactElement) => {
    return render(
      <SidebarProvider>
        {ui}
      </SidebarProvider>
    );
  };

  it('renders chat history correctly', () => {
    renderWithProvider(<SidebarHistory user={{ id: 'user123' }} />);
    
    expect(screen.getByText('Chat 1')).toBeInTheDocument();
    expect(screen.getByText('Chat 2')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    (useSWR as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
      mutate: mockMutate,
    });

    renderWithProvider(<SidebarHistory user={{ id: 'user123' }} />);
    expect(screen.getByText('Today')).toBeInTheDocument();
  });

  it('shows no chats when history is empty', () => {
    (useSWR as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      mutate: mockMutate,
    });

    renderWithProvider(<SidebarHistory user={{ id: 'user123' }} />);
    expect(screen.getByText('Your conversations will appear here once you start chatting!')).toBeInTheDocument();
  });

});
