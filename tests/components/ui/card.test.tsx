import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '../../../components/ui/card';

describe('Card Component', () => {
  it('renders the Card component with children', () => {
    render(
      <Card>
        <p>Test Card Content</p>
      </Card>
    );

    expect(screen.getByText('Test Card Content')).toBeInTheDocument();
  });

  it('renders CardHeader with custom class and children', () => {
    const { container } = render(
      <CardHeader className="custom-header">
        <h1>Header Content</h1>
      </CardHeader>
    );

    expect(screen.getByText('Header Content')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('custom-header');
  });

  it('renders CardTitle with proper content and class', () => {
    const { container } = render(
      <CardTitle className="custom-title">Test Title</CardTitle>
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('custom-title');
  });

  it('renders CardDescription with correct content and class', () => {
    const { container } = render(
      <CardDescription className="custom-description">
        Description Test
      </CardDescription>
    );

    expect(screen.getByText('Description Test')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('custom-description');
  });

  it('renders CardContent with proper content and class', () => {
    const { container } = render(
      <CardContent className="custom-content">
        Content Test
      </CardContent>
    );

    expect(screen.getByText('Content Test')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('custom-content');
  });

  it('renders CardFooter with proper content and class', () => {
    const { container } = render(
      <CardFooter className="custom-footer">
        Footer Test
      </CardFooter>
    );

    expect(screen.getByText('Footer Test')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('custom-footer');
  });
});
