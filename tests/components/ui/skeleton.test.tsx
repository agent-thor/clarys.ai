import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Skeleton } from '../../../components/ui/skeleton';

describe('Skeleton Component', () => {
  it('renders the Skeleton component correctly', () => {
    render(<Skeleton data-testid="skeleton" />);

    const skeletonElement = screen.getByTestId('skeleton');
    expect(skeletonElement).toBeInTheDocument();
    expect(skeletonElement).toHaveClass('animate-pulse rounded-md bg-muted');
  });

  it('applies custom class correctly', () => {
    render(<Skeleton className="custom-class" data-testid="skeleton" />);

    const skeletonElement = screen.getByTestId('skeleton');
    expect(skeletonElement).toHaveClass('custom-class');
  });

  it('renders additional props correctly', () => {
    render(
      <Skeleton data-testid="skeleton" style={{ width: '100px', height: '50px' }} />
    );

    const skeletonElement = screen.getByTestId('skeleton');
    expect(skeletonElement).toHaveStyle({ width: '100px', height: '50px' });
  });
});
