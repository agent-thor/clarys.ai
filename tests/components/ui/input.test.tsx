import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Input } from '../../../components/ui/input';

describe('Input Component', () => {
  it('renders the Input component correctly', () => {
    render(<Input placeholder="Enter text" />);

    const inputElement = screen.getByPlaceholderText('Enter text');
    expect(inputElement).toBeInTheDocument();
  });

  it('accepts user input correctly', () => {
    render(<Input placeholder="Type here" />);

    const inputElement = screen.getByPlaceholderText('Type here');
    fireEvent.change(inputElement, { target: { value: 'Test Input' } });

    expect(inputElement).toHaveValue('Test Input');
  });

  it('applies custom class correctly', () => {
    const { container } = render(
      <Input placeholder="Test Class" className="custom-class" />
    );

    const inputElement = container.querySelector('input');
    expect(inputElement).toHaveClass('custom-class');
  });

  it('renders with type="password" when specified', () => {
    render(<Input type="password" placeholder="Password" />);

    const inputElement = screen.getByPlaceholderText('Password');
    expect(inputElement).toHaveAttribute('type', 'password');
  });

  it('renders as disabled when specified', () => {
    render(<Input placeholder="Disabled Input" disabled />);

    const inputElement = screen.getByPlaceholderText('Disabled Input');
    expect(inputElement).toBeDisabled();
  });

  it('triggers onChange correctly', () => {
    const handleChange = jest.fn();
    render(<Input placeholder="Change Test" onChange={handleChange} />);

    const inputElement = screen.getByPlaceholderText('Change Test');
    fireEvent.change(inputElement, { target: { value: 'New Value' } });

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('handles focus state correctly', () => {
    render(<Input placeholder="Focus Test" />);

    const inputElement = screen.getByPlaceholderText('Focus Test');
    inputElement.focus();

    expect(inputElement).toHaveFocus();
  });
});
