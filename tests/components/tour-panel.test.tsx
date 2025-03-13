import { render, screen, fireEvent } from "@testing-library/react";
import TourPanel, { handleTourComplete, handleTourNeeded } from "../../components/tour-panel";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn().mockReturnValue({ push: jest.fn() }),
}));

describe("TourPanel Component", () => {
  const mockRouter = useRouter();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the first step on initial load", () => {
    render(<TourPanel tourNeeded={true} />);
    expect(screen.getByText(/Why use Clarys.AI/i)).toBeInTheDocument();
  });

  it("navigates to the next step when 'Next' button is clicked", () => {
    render(<TourPanel tourNeeded={true} />);
    const nextButton = screen.getByText(/See What/i);
    fireEvent.click(nextButton);

    expect(screen.getByText(/What Clarys.AI can do for you/i)).toBeInTheDocument();
  });

  it("navigates back to the previous step when 'Previous' button is clicked", () => {
    render(<TourPanel tourNeeded={true} />);

    const nextButton = screen.getByText(/See What/i);
    fireEvent.click(nextButton);

    const prevButton = screen.getByText(/Why Clarys/i);
    fireEvent.click(prevButton);

    expect(screen.getByText(/Why use Clarys.AI/i)).toBeInTheDocument();
  });

  it("calls handleTourComplete correctly", () => {
    document.cookie = "tourCompleted=false";
    handleTourComplete(true);
    expect(document.cookie).toContain("tourCompleted=true");
  });

  it("calls handleTourNeeded correctly", () => {
    document.cookie = "tourNeeded=false";
    handleTourNeeded(true);
    expect(document.cookie).toContain("tourNeeded=true");
  });
});
