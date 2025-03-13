import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Label } from '../../../components/ui/label';

describe('Label Component', () => {
  it('renders the Label component with text', () => {
    render(<Label htmlFor="test-input">Test Label</Label>);

    const labelElement = screen.getByText('Test Label');
    expect(labelElement).toBeInTheDocument();
    expect(labelElement).toHaveAttribute('for', 'test-input');
  });

  it('applies custom class correctly', () => {
    const { container } = render(
      <Label className="custom-class">Custom Class Label</Label>
    );

    const labelElement = container.querySelector('label');
    expect(labelElement).toHaveClass('custom-class');
  });

  it('renders with disabled class when used with a disabled input', () => {
    render(
      <div>
        <Label htmlFor="disabled-input">Disabled Label</Label>
        <input id="disabled-input" disabled />
      </div>
    );

    const labelElement = screen.getByText('Disabled Label');
    const inputElement = screen.getByLabelText('Disabled Label');

    expect(inputElement).toBeDisabled();
    expect(labelElement).toHaveClass('peer-disabled:cursor-not-allowed');
  });

  it('renders additional props correctly', () => {
    render(<Label data-testid="custom-label">Additional Props Label</Label>);

    const labelElement = screen.getByTestId('custom-label');
    expect(labelElement).toBeInTheDocument();
  });
});
