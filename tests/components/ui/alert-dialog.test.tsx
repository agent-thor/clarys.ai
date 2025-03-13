import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from '../../../components/ui/alert-dialog';

describe('AlertDialog Component', () => {
  it('renders the AlertDialog trigger correctly', () => {
    render(
      <AlertDialog>
        <AlertDialogTrigger>Open Dialog</AlertDialogTrigger>
      </AlertDialog>
    );

    expect(screen.getByText('Open Dialog')).toBeInTheDocument();
  });

  it('opens the AlertDialog content when the trigger is clicked', async () => {
    render(
      <AlertDialog>
        <AlertDialogTrigger>Open Dialog</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Test Title</AlertDialogTitle>
            <AlertDialogDescription>Test Description</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogAction>Confirm</AlertDialogAction>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialog>
    );

    fireEvent.click(screen.getByText('Open Dialog'));

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('Confirm')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('closes the AlertDialog content when the Cancel button is clicked', () => {
    render(
      <AlertDialog>
        <AlertDialogTrigger>Open Dialog</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Test Title</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogAction>Confirm</AlertDialogAction>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialog>
    );

    fireEvent.click(screen.getByText('Open Dialog'));
    expect(screen.getByText('Test Title')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Cancel'));
    expect(screen.queryByText('Test Title')).not.toBeInTheDocument();
  });

  it('confirms action when Confirm button is clicked', () => {
    const mockOnConfirm = jest.fn();

    render(
      <AlertDialog>
        <AlertDialogTrigger>Open Dialog</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Test Title</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogAction onClick={mockOnConfirm}>Confirm</AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    );

    fireEvent.click(screen.getByText('Open Dialog'));
    fireEvent.click(screen.getByText('Confirm'));

    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });
});
