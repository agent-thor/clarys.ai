import { render, screen, fireEvent } from "@testing-library/react";
import Menu from "../../components/menu";
import { signOut } from "next-auth/react";
import { useSidebar } from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";

jest.mock("next-auth/react", () => ({ signOut: jest.fn() }));
jest.mock("@/components/ui/sidebar", () => ({ useSidebar: jest.fn() }));
jest.mock("next/navigation", () => ({ useRouter: jest.fn() }));

const mockRouterPush = jest.fn();
const mockRouterRefresh = jest.fn();
const mockToggleSidebar = jest.fn();

beforeEach(() => {
  useRouter.mockReturnValue({ push: mockRouterPush, refresh: mockRouterRefresh });
  useSidebar.mockReturnValue({ toggleSidebar: mockToggleSidebar });
  jest.clearAllMocks();
});

describe("Menu Component", () => {
  it("renders the component with the username", () => {
    render(<Menu userName="Test User" />);
    expect(screen.getByText("Test User")).toBeInTheDocument();
  });

  it("opens and closes the first menu on click", () => {
    render(<Menu userName="Test User" />);

    const userButton = screen.getByText("Test User");
    fireEvent.click(userButton);

    expect(screen.getByText("Logout")).toBeInTheDocument();

    fireEvent.click(userButton);
    expect(screen.queryByText("Logout")).not.toBeInTheDocument();
  });

  it("opens and closes the second menu on click", () => {
    render(<Menu userName="Test User" />);

    const menuButton = screen.getByText("Menu");
    fireEvent.click(menuButton);

    expect(screen.getByText("Why Clarys.AI")).toBeInTheDocument();

    fireEvent.click(menuButton);
    expect(screen.queryByText("Why Clarys.AI")).not.toBeInTheDocument();
  });

  it("calls signOut on Logout click", () => {
    render(<Menu userName="Test User" />);

    fireEvent.click(screen.getByText("Test User"));
    fireEvent.click(screen.getByText("Logout"));

    expect(signOut).toHaveBeenCalledWith({ redirectTo: "/" });
  });

  it("calls toggleSidebar on 'See Last Queries' click", () => {
    render(<Menu userName="Test User" />);

    fireEvent.click(screen.getByText("Test User"));
    fireEvent.click(screen.getByText("See Last Queries"));

    expect(mockToggleSidebar).toHaveBeenCalled();
  });

  it("closes menu when clicking outside", () => {
    const { container } = render(<Menu userName="Test User" />);

    const userButton = screen.getByText("Test User");
    fireEvent.click(userButton);
    expect(screen.getByText("Logout")).toBeInTheDocument();

    fireEvent.click(container); // Simulates clicking outside
    expect(screen.queryByText("Logout")).not.toBeInTheDocument();
  });
});
