import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CardPanel from '../../../components/ui/card-panel';
import Footer from '@/components/footer';

jest.mock('@/components/footer', () => jest.fn(() => <div data-testid="footer">Mocked Footer</div>));

describe('CardPanel Component', () => {
  it('renders children correctly', () => {
    render(
      <CardPanel>
        <p>Test Content</p>
      </CardPanel>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies default classes when fullWidth is false', () => {
    const { container } = render(
      <CardPanel>
        <p>Test Content</p>
      </CardPanel>
    );

    expect(container.firstChild).toHaveClass('w-card');
  });

  it('applies fullWidth class when fullWidth is true', () => {
    const { container } = render(
      <CardPanel fullWidth>
        <p>Full Width Content</p>
      </CardPanel>
    );

    expect(container.firstChild).toHaveClass('w-fullCard');
  });

  it('applies the correct blur value', () => {
    const { container } = render(
      <CardPanel blur="20px">
        <p>Blur Test</p>
      </CardPanel>
    );

    expect(container.firstChild).toHaveClass('backdrop-blur-[20px]');
  });

  it('renders the Footer component with the correct props', () => {
    render(<CardPanel fullWidth >
        <p>Test Content</p>
    </CardPanel>);

    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });
});
