import { render, screen } from '@testing-library/react';
import { BotIcon, UserIcon, AttachmentIcon, VercelIcon, GitIcon } from '@/components/icons';

describe('Icon Components', () => {

  it('renders the BotIcon correctly', () => {
    render(<BotIcon />);
    const svgElement = screen.getByTestId('bot-icon');
    expect(svgElement).toBeInTheDocument();
    expect(svgElement).toHaveAttribute('viewBox', '0 0 16 16');
  });

  it('renders the UserIcon correctly', () => {
    render(<UserIcon />);
    const svgElement = screen.getByTestId('geist-icon');
    expect(svgElement).toBeInTheDocument();
    expect(svgElement).toHaveAttribute('viewBox', '0 0 16 16');
  });

  it('renders the AttachmentIcon correctly', () => {
    render(<AttachmentIcon />);
    const svgElement = screen.getByTestId('att-icon');
    expect(svgElement).toBeInTheDocument();
    expect(svgElement).toHaveAttribute('viewBox', '0 0 16 16');
  });

  it('renders the VercelIcon with custom size', () => {
    render(<VercelIcon size={20} />);
    const svgElement = screen.getByTestId('vc-icon');
    expect(svgElement).toBeInTheDocument();
    expect(svgElement).toHaveAttribute('width', '20');
    expect(svgElement).toHaveAttribute('height', '20');
  });

  it('renders the GitIcon correctly', () => {
    render(<GitIcon />);
    const svgElement = screen.getByTestId('git-icon');
    expect(svgElement).toBeInTheDocument();
    expect(svgElement).toHaveAttribute('viewBox', '0 0 16 16');
  });
  
});
