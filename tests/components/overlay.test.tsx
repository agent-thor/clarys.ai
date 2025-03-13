import { render, screen, fireEvent } from '@testing-library/react';
import { OverlayProvider, useOverlay } from '../../components/overlay';
import { ReactNode } from 'react';

const MockComponent = () => {
  const { openOverlay, closeOverlay, isOpen, content } = useOverlay();

  return (
    <div>
      <button onClick={() => openOverlay(<div data-testid="overlay-content">Overlay Content</div>)}>
        Open Overlay
      </button>
      <button onClick={closeOverlay}>Close Overlay</button>
      {isOpen && content}
    </div>
  );
};

describe('OverlayProvider and useOverlay Hook', () => {
  const renderWithProvider = (ui: ReactNode) =>
    render(<OverlayProvider>{ui}</OverlayProvider>);

  it('renders the OverlayProvider correctly', () => {
    renderWithProvider(<MockComponent />);
    expect(screen.getByText('Open Overlay')).toBeInTheDocument();
    expect(screen.getByText('Close Overlay')).toBeInTheDocument();
  });

  it('throws an error when useOverlay is used outside OverlayProvider', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const BrokenComponent = () => {
      useOverlay(); // This should throw
      return <div>Broken Component</div>;
    };

    expect(() => render(<BrokenComponent />)).toThrow(
      'useOverlay must be used within an OverlayProvider'
    );

    consoleErrorSpy.mockRestore();
  });
});
