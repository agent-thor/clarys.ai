import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "../../../components/ui/button";

describe("Button Component", () => {
  test("renders correctly with default props", () => {
    render(<Button>Click Me</Button>);
    const buttonElement = screen.getByRole("button", { name: /click me/i });
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveClass("bg-primary");
  });

  test("applies correct variant styles", () => {
    const { rerender } = render(<Button variant="destructive">Delete</Button>);
    expect(screen.getByText(/delete/i)).toHaveClass("bg-destructive");

    rerender(<Button variant="outline">Outline</Button>);
    expect(screen.getByText(/outline/i)).toHaveClass("border border-input bg-background");

    rerender(<Button variant="link">Link</Button>);
    expect(screen.getByText(/link/i)).toHaveClass("text-primary underline-offset-4");
  });

  test("applies correct size styles", () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    expect(screen.getByText(/small/i)).toHaveClass("h-9 rounded-md px-3");

    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByText(/large/i)).toHaveClass("h-11 rounded-md px-8");

    rerender(<Button size="icon">Icon</Button>);
    expect(screen.getByText(/icon/i)).toHaveClass("h-10 w-10");
  });

  test("applies custom class names", () => {
    render(<Button className="custom-class">Custom Class</Button>);
    expect(screen.getByText(/custom class/i)).toHaveClass("custom-class");
  });

  test("renders as child component (Slot)", () => {
    render(
      <Button asChild>
        <a href="#">Link Button</a>
      </Button>
    );
    expect(screen.getByText(/link button/i).tagName).toBe("A");
  });

  test("renders as disabled", () => {
    render(<Button disabled>Disabled</Button>);
    const buttonElement = screen.getByRole("button", { name: /disabled/i });
    expect(buttonElement).toBeDisabled();
    expect(buttonElement).toHaveClass("opacity-40");
  });

  test("handles click events", async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);

    await userEvent.click(screen.getByRole("button", { name: /click me/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test("does not trigger click events when disabled", async () => {
    const handleClick = jest.fn();
    render(
      <Button onClick={handleClick} disabled>
        Disabled Button
      </Button>
    );

    await userEvent.click(screen.getByRole("button", { name: /disabled button/i }));
    expect(handleClick).not.toHaveBeenCalled();
  });
});
