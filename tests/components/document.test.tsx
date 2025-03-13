import { render, screen, fireEvent } from '@testing-library/react';
import { DocumentToolResult, DocumentToolCall } from '../../components/document';

const mockSetBlock = jest.fn();

describe('DocumentToolResult', () => {
  it('renders correctly with create type', () => {
    render(
      <DocumentToolResult
        type="create"
        result={{ id: '1', title: 'Test Document' }}
        block={{}}
        setBlock={mockSetBlock}
      />
    );

    expect(screen.getByText('Created "Test Document"')).toBeInTheDocument();
  });

  it('calls setBlock with correct data on click', () => {
    render(
      <DocumentToolResult
        type="update"
        result={{ id: '2', title: 'Updated Doc' }}
        block={{}}
        setBlock={mockSetBlock}
      />
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockSetBlock).toHaveBeenCalledWith(
      expect.objectContaining({
        documentId: '2',
        title: 'Updated Doc',
        content: '',
        isVisible: true,
        status: 'idle',
      })
    );
  });
});

describe('DocumentToolCall', () => {
  it('renders correctly with request-suggestions type', () => {
    render(
      <DocumentToolCall
        type="request-suggestions"
        args={{ title: 'New Suggestions' }}
        setBlock={mockSetBlock}
      />
    );

    expect(screen.getByText('Adding suggestions "New Suggestions"')).toBeInTheDocument();
  });

  it('calls setBlock with updated boundingBox on click', () => {
    render(
      <DocumentToolCall
        type="create"
        args={{ title: 'New Document' }}
        setBlock={mockSetBlock}
      />
    );
  
    const button = screen.getByRole('button');
    fireEvent.click(button);
  
    // Assert that `mockSetBlock` was called with a function
    expect(mockSetBlock).toHaveBeenCalledWith(expect.any(Function));
  
    // Simulate calling the function itself with mock data
    const setBlockCallback = mockSetBlock.mock.calls[0][0];
    const newBlock = typeof setBlockCallback === 'function'
      ? setBlockCallback({ isVisible: false }) // Ensure we're calling a function
      : setBlockCallback;
  
    expect(newBlock).toMatchObject({
      isVisible: true,
      boundingBox: expect.any(Object),
    });
  });
  
});
