import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from '../../../components/ui/dropdown-menu';

describe('DropdownMenu Component', () => {
  it('renders DropdownMenuTrigger correctly', () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
      </DropdownMenu>
    );

    expect(screen.getByText('Open Menu')).toBeInTheDocument();
  });

  it('renders DropdownMenuShortcut with correct text', () => {
    render(<DropdownMenuShortcut>Ctrl + P</DropdownMenuShortcut>);

    expect(screen.getByText('Ctrl + P')).toBeInTheDocument();
  });
});
