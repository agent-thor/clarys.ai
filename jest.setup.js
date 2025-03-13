import '@testing-library/jest-dom';

// Mock window.matchMedia for tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false, // Simulate default as non-mobile screen size
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated but some libraries may still use it
    removeListener: jest.fn(), // Deprecated but some libraries may still use it
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
