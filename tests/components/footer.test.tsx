import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Footer from '../../components/footer';
import { useOverlay } from '@/components/overlay';

jest.mock('@/components/overlay', () => ({
  useOverlay: jest.fn(),
}));

describe('Footer Component', () => {
  const mockOpenOverlay = jest.fn();

  beforeEach(() => {
    (useOverlay as jest.Mock).mockReturnValue({
      openOverlay: mockOpenOverlay,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly in singleRow mode', () => {
    render(<Footer singleRow={true} />);

    expect(screen.getByText(/Terms & Conditions/i)).toBeInTheDocument();
    expect(screen.getByText(/Privacy Policy/i)).toBeInTheDocument();
    expect(screen.getByText(/Copyright ©2025 Clarys.AI/i)).toBeInTheDocument();
  });

  it('renders correctly in non-singleRow mode', () => {
    render(<Footer singleRow={false} />);

    expect(screen.getByText(/Terms & Conditions/i)).toBeInTheDocument();
    expect(screen.getByText(/Privacy Policy/i)).toBeInTheDocument();
    expect(screen.getByText(/Copyright ©2025 Clarys.AI/i)).toBeInTheDocument();
  });

  it('opens the Terms & Conditions overlay when clicked', async () => {
    render(<Footer />);
    const termsButton = screen.getByText(/Terms & Conditions/i);

    await userEvent.click(termsButton);
    expect(mockOpenOverlay).toHaveBeenCalledWith(expect.anything());
  });

  it('opens the Privacy Policy overlay when clicked', async () => {
    render(<Footer />);
    const privacyButton = screen.getByText(/Privacy Policy/i);

    await userEvent.click(privacyButton);
    expect(mockOpenOverlay).toHaveBeenCalledWith(expect.anything());
  });

  it('displays the correct copyright year', () => {
    const currentYear = new Date().getFullYear();
    render(<Footer />);
    expect(screen.getByText(`Copyright ©${currentYear} Clarys.AI. All rights reserved.`)).toBeInTheDocument();
  });

  it('renders both Terms & Conditions and Privacy Policy links', () => {
    render(<Footer />);
    expect(screen.getByText(/Terms & Conditions/i)).toBeInTheDocument();
    expect(screen.getByText(/Privacy Policy/i)).toBeInTheDocument();
  });
});
