import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Separator } from '../../../components/ui/separator';

describe('Separator Component', () => {
  it('renders the Separator component correctly with default props', () => {
    const { container } = render(<Separator data-testid="separator" />);

    const separator = screen.getByTestId('separator');
    expect(separator).toBeInTheDocument();
    expect(separator).toHaveClass('h-[1px] w-full'); // Default to horizontal
  });

  it('renders the Separator as vertical when orientation is specified', () => {
    const { container } = render(
      <Separator orientation="vertical" data-testid="separator" />
    );

    const separator = screen.getByTestId('separator');
    expect(separator).toHaveClass('h-full w-[1px]');
  });

  it('applies custom class correctly', () => {
    const { container } = render(
      <Separator className="custom-class" data-testid="separator" />
    );

    const separator = screen.getByTestId('separator');
    expect(separator).toHaveClass('custom-class');
  });

  it('renders as decorative by default', () => {
    render(<Separator data-testid="separator" />);
  
    const separator = screen.getByTestId('separator');

    expect(separator).toHaveAttribute('role', 'none');
  });
  
  

  it('renders non-decorative when decorative is set to false', () => {
    render(<Separator decorative={false} data-testid="separator" />);
    
    const separator = screen.getByTestId('separator');
    
    // Non-decorative separators should have `role="separator"` for accessibility
    expect(separator).toHaveAttribute('role', 'separator');
  });
  
});
