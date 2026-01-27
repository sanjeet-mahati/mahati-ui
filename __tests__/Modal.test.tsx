import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Modal from '../src/components/Modal';

describe('Modal', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  it('should not render when isOpen is false', () => {
    render(<Modal isOpen={false} onClose={mockOnClose}>Content</Modal>);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should render when isOpen is true', () => {
    render(<Modal isOpen={true} onClose={mockOnClose}>Content</Modal>);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('should render with title', () => {
    render(<Modal isOpen={true} onClose={mockOnClose} title="Test Title">Content</Modal>);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('should render with subtitle', () => {
    render(<Modal isOpen={true} onClose={mockOnClose} subtitle="Test Subtitle">Content</Modal>);
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
  });

  it('should render children', () => {
    render(<Modal isOpen={true} onClose={mockOnClose}><div>Modal Content</div></Modal>);
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('should call onClose when close button clicked', () => {
    render(<Modal isOpen={true} onClose={mockOnClose}>Content</Modal>);
    
    fireEvent.click(screen.getByLabelText('Close dialog'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should call onClose when overlay clicked', () => {
    const { container } = render(<Modal isOpen={true} onClose={mockOnClose}>Content</Modal>);
    
    const overlay = container.querySelector('[aria-hidden="true"]');
    fireEvent.click(overlay!);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should render with all sizes', () => {
    const sizes: Array<'sm' | 'default' | 'md' | 'lg' | 'xl'> = ['sm', 'default', 'md', 'lg', 'xl'];
    
    sizes.forEach(size => {
      const { unmount } = render(<Modal isOpen={true} onClose={mockOnClose} size={size}>Content</Modal>);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      unmount();
    });
  });

  it('should render with all positions', () => {
    const positions = ['center', 'top-left', 'top-right', 'bottom-left', 'bottom-right'];
    
    positions.forEach(position => {
      const { unmount } = render(
        <Modal isOpen={true} onClose={mockOnClose} position={position as any}>Content</Modal>
      );
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      unmount();
    });
  });

  it('should render primary action button', () => {
    render(
      <Modal 
        isOpen={true} 
        onClose={mockOnClose}
        primaryAction={{ label: 'Save', onClick: jest.fn() }}
      >
        Content
      </Modal>
    );
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('should render secondary action button', () => {
    render(
      <Modal 
        isOpen={true} 
        onClose={mockOnClose}
        secondaryAction={{ label: 'Cancel', onClick: jest.fn() }}
      >
        Content
      </Modal>
    );
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('should call action onClick handlers', () => {
    const handlePrimary = jest.fn();
    const handleSecondary = jest.fn();
    
    render(
      <Modal 
        isOpen={true} 
        onClose={mockOnClose}
        primaryAction={{ onClick: handlePrimary }}
        secondaryAction={{ onClick: handleSecondary }}
      >
        Content
      </Modal>
    );
    
    fireEvent.click(screen.getByText('Save'));
    expect(handlePrimary).toHaveBeenCalled();
    
    fireEvent.click(screen.getByText('Cancel'));
    expect(handleSecondary).toHaveBeenCalled();
  });

  it('should render headerIcon', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} headerIcon={<span data-testid="icon">★</span>}>
        Content
      </Modal>
    );
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('should have displayName', () => {
    expect(Modal.displayName).toBe('Modal');
  });

  it('should accept custom width', () => {
    render(<Modal isOpen={true} onClose={mockOnClose} width={800}>Content</Modal>);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('should accept custom height', () => {
    render(<Modal isOpen={true} onClose={mockOnClose} height={600}>Content</Modal>);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('should have aria-modal attribute', () => {
    render(<Modal isOpen={true} onClose={mockOnClose}>Content</Modal>);
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
  });
});
