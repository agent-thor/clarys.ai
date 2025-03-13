import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChatHeader } from '@/components/chat-header';
import { useRouter } from 'next/navigation';
import Menu from '@/components/menu';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}));

jest.mock('@/components/menu', () => jest.fn(() => <div data-testid="menu-mock">Menu Component</div>));

describe('ChatHeader Component', () => {
  const mockRouter = { push: jest.fn() };
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it('renders correctly', () => {
    render(<ChatHeader userName="JohnDoe" />);
    expect(screen.getByAltText('Image 1')).toBeInTheDocument();
    expect(screen.getByAltText('Sliding Image')).toBeInTheDocument();
    expect(screen.getByTestId('menu-mock')).toBeInTheDocument();
  });

  it('displays the correct logo images', () => {
    render(<ChatHeader userName="JohnDoe" />);
    const logomark = screen.getByAltText('Image 1');
    const logotype = screen.getByAltText('Sliding Image');

    expect(logomark).toBeInTheDocument();
    expect(logotype).toBeInTheDocument();
    expect(logotype).toHaveClass('opacity-0');
  });

  it('renders the Menu component with the correct userName', () => {
    render(<ChatHeader userName="JohnDoe" />);
    expect(Menu).toHaveBeenCalledWith({ userName: 'JohnDoe' }, {});
  });
});
