import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Textarea } from '../../../components/ui/textarea';

describe('Textarea Component', () => {
  it('renders the Textarea component correctly', () => {
    render(<Textarea placeholder="Enter text here" />);

    const textareaElement = screen.getByPlaceholderText('Enter text here');
    expect(textareaElement).toBeInTheDocument();
    expect(textareaElement).toHaveClass('flex w-full bg-background placeholder:text-muted-foreground');
  });

  it('accepts user input correctly', () => {
    render(<Textarea placeholder="Type here" />);

    const textareaElement = screen.getByPlaceholderText('Type here');
    fireEvent.change(textareaElement, { target: { value: 'Test Input' } });

    expect(textareaElement).toHaveValue('Test Input');
  });

  it('applies custom class correctly', () => {
    render(<Textarea className="custom-class" placeholder="Class Test" />);

    const textareaElement = screen.getByPlaceholderText('Class Test');
    expect(textareaElement).toHaveClass('custom-class');
  });

  it('renders with disabled attribute when specified', () => {
    render(<Textarea placeholder="Disabled Textarea" disabled />);

    const textareaElement = screen.getByPlaceholderText('Disabled Textarea');
    expect(textareaElement).toBeDisabled();
  });

  it('handles focus state correctly', () => {
    render(<Textarea placeholder="Focus Test" />);

    const textareaElement = screen.getByPlaceholderText('Focus Test');
    textareaElement.focus();

    expect(textareaElement).toHaveFocus();
  });

  it('renders additional props correctly', () => {
    render(<Textarea data-testid="textarea-test" aria-label="Custom Label" />);

    const textareaElement = screen.getByTestId('textarea-test');
    expect(textareaElement).toHaveAttribute('aria-label', 'Custom Label');
  });
});
