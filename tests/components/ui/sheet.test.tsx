import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from '../../../components/ui/sheet';

describe('Sheet Component', () => {
  it('renders SheetTrigger correctly', () => {
    render(
      <Sheet>
        <SheetTrigger>Open Sheet</SheetTrigger>
      </Sheet>
    );

    expect(screen.getByText('Open Sheet')).toBeInTheDocument();
  });

  it('renders SheetContent when SheetTrigger is clicked', () => {
    render(
      <Sheet>
        <SheetTrigger>Open Sheet</SheetTrigger>
        <SheetContent>
          <SheetTitle>Sheet Title</SheetTitle>
          <SheetDescription>Sheet Description</SheetDescription>
        </SheetContent>
      </Sheet>
    );

    fireEvent.click(screen.getByText('Open Sheet'));

    expect(screen.getByText('Sheet Title')).toBeInTheDocument();
    expect(screen.getByText('Sheet Description')).toBeInTheDocument();
  });

  it('closes the Sheet when SheetClose is clicked', () => {
    render(
      <Sheet>
        <SheetTrigger>Open Sheet</SheetTrigger>
        <SheetContent>
          <SheetTitle>Sheet Title</SheetTitle>
          <SheetClose data-testid="sheet-close-button">Close</SheetClose>
        </SheetContent>
      </Sheet>
    );
  
    fireEvent.click(screen.getByText('Open Sheet'));
    expect(screen.getByText('Sheet Title')).toBeInTheDocument();
  
    fireEvent.click(screen.getByTestId('sheet-close-button'));
    expect(screen.queryByText('Sheet Title')).not.toBeInTheDocument();
  });

  it('renders SheetHeader and SheetFooter correctly', () => {
    render(
      <Sheet>
        <SheetTrigger>Open Sheet</SheetTrigger>
        <SheetContent>
          <SheetHeader>Header Content</SheetHeader>
          <SheetFooter>Footer Content</SheetFooter>
        </SheetContent>
      </Sheet>
    );

    fireEvent.click(screen.getByText('Open Sheet'));
    expect(screen.getByText('Header Content')).toBeInTheDocument();
    expect(screen.getByText('Footer Content')).toBeInTheDocument();
  });
});
