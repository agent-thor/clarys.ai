import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectGroup, // Added this import
} from '../../../components/ui/select';

describe('Select Component', () => {
  it('renders SelectTrigger correctly', () => {
    render(
      <Select>
        <SelectTrigger>Select an option</SelectTrigger>
      </Select>
    );

    expect(screen.getByText('Select an option')).toBeInTheDocument();
  });

  it('renders SelectContent when SelectTrigger is clicked', () => {
    render(
      <Select>
        <SelectTrigger>Select an option</SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
        </SelectContent>
      </Select>
    );

    fireEvent.click(screen.getByText('Select an option'));
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  it('renders SelectLabel correctly', () => {
    render(
      <Select>
        <SelectTrigger>Select an option</SelectTrigger>
        <SelectContent>
          <SelectGroup> {/* Added SelectGroup here */}
            <SelectLabel>Group Label</SelectLabel>
            <SelectItem value="option1">Option 1</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    );

    fireEvent.click(screen.getByText('Select an option'));
    expect(screen.getByText('Group Label')).toBeInTheDocument();
  });

  it('renders SelectSeparator correctly', () => {
    render(
      <Select>
        <SelectTrigger>Select an option</SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectSeparator data-testid="separator" />
          <SelectItem value="option2">Option 2</SelectItem>
        </SelectContent>
      </Select>
    );

    fireEvent.click(screen.getByText('Select an option'));
    expect(screen.getByTestId('separator')).toBeInTheDocument();
  });
});
