import { render, screen } from '@testing-library/react';
import { Overview } from '../../components/overview';

describe('Overview Component', () => {

  it('renders the greeting message with username correctly', () => {
    render(<Overview userName="John Doe" />);
    expect(screen.getByText(/Hello,/i)).toBeInTheDocument();
    expect(screen.getByText(/John Doe!/i)).toBeInTheDocument();
  });

  it('renders the prompt message correctly', () => {
    render(<Overview userName="Jane Doe" />);
    expect(screen.getByText(/What can I do for you today?/i)).toBeInTheDocument();
  });

  it('handles empty username gracefully', () => {
    render(<Overview userName="" />);
    expect(screen.getByText(/Hello,/i)).toBeInTheDocument();
    expect(screen.getByText(/!/i)).toBeInTheDocument();
  });

});
