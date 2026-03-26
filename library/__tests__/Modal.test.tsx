import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Modal from '../src/components/Modal';

describe('Modal', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => mockOnClose.mockClear());

  // ─── Visibility ───────────────────────────────────────────────────────────

  describe('Visibility', () => {
    it('should not render when isOpen=false', () => {
      render(<Modal isOpen={false} onClose={mockOnClose}>Content</Modal>);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should render when isOpen=true', () => {
      render(<Modal isOpen={true} onClose={mockOnClose}>Content</Modal>);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should not render overlay when isOpen=false', () => {
      render(<Modal isOpen={false} onClose={mockOnClose} testId="m">Content</Modal>);
      expect(screen.queryByTestId('m-overlay')).not.toBeInTheDocument();
    });

    it('should render overlay when isOpen=true', () => {
      render(<Modal isOpen={true} onClose={mockOnClose} testId="m">Content</Modal>);
      expect(screen.getByTestId('m-overlay')).toBeInTheDocument();
    });

    it('should have correct displayName', () => {
      expect(Modal.displayName).toBe('Modal');
    });
  });

  // ─── testId ───────────────────────────────────────────────────────────────

  describe('testId', () => {
    it('should apply testId to dialog', () => {
      render(<Modal isOpen={true} onClose={mockOnClose} testId="m">Content</Modal>);
      expect(screen.getByTestId('m')).toBeInTheDocument();
    });

    it('should apply testId-overlay to overlay', () => {
      render(<Modal isOpen={true} onClose={mockOnClose} testId="m">Content</Modal>);
      expect(screen.getByTestId('m-overlay')).toBeInTheDocument();
    });

    it('should apply testId-header to header', () => {
      render(<Modal isOpen={true} onClose={mockOnClose} testId="m">Content</Modal>);
      expect(screen.getByTestId('m-header')).toBeInTheDocument();
    });

    it('should apply testId-title when title provided', () => {
      render(<Modal isOpen={true} onClose={mockOnClose} testId="m" title="T">Content</Modal>);
      expect(screen.getByTestId('m-title')).toBeInTheDocument();
    });

    it('should not apply testId-title when no title', () => {
      render(<Modal isOpen={true} onClose={mockOnClose} testId="m">Content</Modal>);
      expect(screen.queryByTestId('m-title')).not.toBeInTheDocument();
    });

    it('should apply testId-subtitle when subtitle provided', () => {
      render(<Modal isOpen={true} onClose={mockOnClose} testId="m" subtitle="S">Content</Modal>);
      expect(screen.getByTestId('m-subtitle')).toBeInTheDocument();
    });

    it('should not apply testId-subtitle when no subtitle', () => {
      render(<Modal isOpen={true} onClose={mockOnClose} testId="m">Content</Modal>);
      expect(screen.queryByTestId('m-subtitle')).not.toBeInTheDocument();
    });

    it('should apply testId-close-btn', () => {
      render(<Modal isOpen={true} onClose={mockOnClose} testId="m">Content</Modal>);
      expect(screen.getByTestId('m-close-btn')).toBeInTheDocument();
    });

    it('should apply testId-body', () => {
      render(<Modal isOpen={true} onClose={mockOnClose} testId="m">Content</Modal>);
      expect(screen.getByTestId('m-body')).toBeInTheDocument();
    });

    it('should apply testId-footer when actions present', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} testId="m"
          primaryAction={{ label: 'OK' }}>Content</Modal>
      );
      expect(screen.getByTestId('m-footer')).toBeInTheDocument();
    });

    it('should not apply testId-footer when no actions', () => {
      render(<Modal isOpen={true} onClose={mockOnClose} testId="m">Content</Modal>);
      expect(screen.queryByTestId('m-footer')).not.toBeInTheDocument();
    });

    it('should apply testId-primary-btn', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} testId="m"
          primaryAction={{ label: 'Save' }}>Content</Modal>
      );
      expect(screen.getByTestId('m-primary-btn')).toBeInTheDocument();
    });

    it('should apply testId-secondary-btn', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} testId="m"
          secondaryAction={{ label: 'Cancel' }}>Content</Modal>
      );
      expect(screen.getByTestId('m-secondary-btn')).toBeInTheDocument();
    });

    it('should not apply testId when testId not provided', () => {
      const { container } = render(<Modal isOpen={true} onClose={mockOnClose}>Content</Modal>);
      expect(container.querySelector('[data-testid]')).toBeNull();
    });
  });

  // ─── Content ──────────────────────────────────────────────────────────────

  describe('Content', () => {
    it('should render title', () => {
      render(<Modal isOpen={true} onClose={mockOnClose} title="Test Title">Content</Modal>);
      expect(screen.getByText('Test Title')).toBeInTheDocument();
    });

    it('should render subtitle', () => {
      render(<Modal isOpen={true} onClose={mockOnClose} subtitle="Test Subtitle">Content</Modal>);
      expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
    });

    it('should render children', () => {
      render(<Modal isOpen={true} onClose={mockOnClose}><div>Modal Content</div></Modal>);
      expect(screen.getByText('Modal Content')).toBeInTheDocument();
    });

    it('should render complex children', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <form>
            <input data-testid="modal-input" />
            <button>Submit</button>
          </form>
        </Modal>
      );
      expect(screen.getByTestId('modal-input')).toBeInTheDocument();
    });

    it('should render headerIcon', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose}
          headerIcon={<span data-testid="icon">★</span>}>
          Content
        </Modal>
      );
      expect(screen.getByTestId('icon')).toBeInTheDocument();
    });
  });

  // ─── Close Behaviour ──────────────────────────────────────────────────────

  describe('Close Behaviour', () => {
    it('should call onClose when close button clicked', () => {
      render(<Modal isOpen={true} onClose={mockOnClose}>Content</Modal>);
      fireEvent.click(screen.getByLabelText('Close dialog'));
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when overlay clicked', () => {
      render(<Modal isOpen={true} onClose={mockOnClose} testId="m">Content</Modal>);
      fireEvent.click(screen.getByTestId('m-overlay'));
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should NOT call onClose when modal body clicked', () => {
      render(<Modal isOpen={true} onClose={mockOnClose} testId="m">Content</Modal>);
      fireEvent.click(screen.getByTestId('m'));
      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('should call onClose when Escape key pressed', () => {
      render(<Modal isOpen={true} onClose={mockOnClose}>Content</Modal>);
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should not call onClose on non-Escape key', () => {
      render(<Modal isOpen={true} onClose={mockOnClose}>Content</Modal>);
      fireEvent.keyDown(document, { key: 'Enter' });
      fireEvent.keyDown(document, { key: 'Tab' });
      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('should set body overflow hidden when open', () => {
      render(<Modal isOpen={true} onClose={mockOnClose}>Content</Modal>);
      expect(document.body.style.overflow).toBe('hidden');
    });

    it('should restore body overflow when closed', () => {
      const { rerender } = render(<Modal isOpen={true} onClose={mockOnClose}>Content</Modal>);
      rerender(<Modal isOpen={false} onClose={mockOnClose}>Content</Modal>);
      expect(document.body.style.overflow).toBe('unset');
    });
  });

  // ─── Actions ─────────────────────────────────────────────────────────────

  describe('Actions', () => {
    it('should render primary action with label', () => {
      render(<Modal isOpen={true} onClose={mockOnClose} primaryAction={{ label: 'Save' }}>Content</Modal>);
      expect(screen.getByText('Save')).toBeInTheDocument();
    });

    it('should render secondary action with label', () => {
      render(<Modal isOpen={true} onClose={mockOnClose} secondaryAction={{ label: 'Cancel' }}>Content</Modal>);
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    it('should use default "Save" label for primary', () => {
      render(<Modal isOpen={true} onClose={mockOnClose} primaryAction={{ onClick: jest.fn() }}>Content</Modal>);
      expect(screen.getByText('Save')).toBeInTheDocument();
    });

    it('should use default "Cancel" label for secondary', () => {
      render(<Modal isOpen={true} onClose={mockOnClose} secondaryAction={{ onClick: jest.fn() }}>Content</Modal>);
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    it('should call primary onClick when clicked', () => {
      const handlePrimary = jest.fn();
      render(<Modal isOpen={true} onClose={mockOnClose} primaryAction={{ onClick: handlePrimary }}>Content</Modal>);
      fireEvent.click(screen.getByText('Save'));
      expect(handlePrimary).toHaveBeenCalledTimes(1);
    });

    it('should call secondary onClick when clicked', () => {
      const handleSecondary = jest.fn();
      render(<Modal isOpen={true} onClose={mockOnClose} secondaryAction={{ onClick: handleSecondary }}>Content</Modal>);
      fireEvent.click(screen.getByText('Cancel'));
      expect(handleSecondary).toHaveBeenCalledTimes(1);
    });

    it('should call both action handlers independently', () => {
      const handlePrimary = jest.fn();
      const handleSecondary = jest.fn();
      render(
        <Modal isOpen={true} onClose={mockOnClose}
          primaryAction={{ onClick: handlePrimary }}
          secondaryAction={{ onClick: handleSecondary }}>
          Content
        </Modal>
      );
      fireEvent.click(screen.getByText('Save'));
      expect(handlePrimary).toHaveBeenCalled();
      fireEvent.click(screen.getByText('Cancel'));
      expect(handleSecondary).toHaveBeenCalled();
    });

    it('should disable primary button when disabled=true', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose}
          primaryAction={{ label: 'Save', disabled: true }}>Content</Modal>
      );
      expect(screen.getByText('Save')).toBeDisabled();
    });

    it('should not call primary onClick when disabled', () => {
      const handlePrimary = jest.fn();
      render(
        <Modal isOpen={true} onClose={mockOnClose}
          primaryAction={{ onClick: handlePrimary, disabled: true }}>Content</Modal>
      );
      fireEvent.click(screen.getByText('Save'));
      expect(handlePrimary).not.toHaveBeenCalled();
    });

    it('should not render footer when no actions provided', () => {
      render(<Modal isOpen={true} onClose={mockOnClose} testId="m">Content</Modal>);
      expect(screen.queryByTestId('m-footer')).not.toBeInTheDocument();
    });

    it('should render footer with only primary action', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} testId="m"
          primaryAction={{ label: 'Confirm' }}>Content</Modal>
      );
      expect(screen.getByTestId('m-footer')).toBeInTheDocument();
      expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
    });

    it('should render footer with only secondary action', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} testId="m"
          secondaryAction={{ label: 'Back' }}>Content</Modal>
      );
      expect(screen.getByTestId('m-footer')).toBeInTheDocument();
      expect(screen.queryByText('Save')).not.toBeInTheDocument();
    });
  });

  // ─── Sizes ────────────────────────────────────────────────────────────────

  describe('Sizes', () => {
    const sizes = ['sm', 'default', 'md', 'lg', 'xl'] as const;

    sizes.forEach(size => {
      it(`should render ${size} size`, () => {
        const { unmount } = render(
          <Modal isOpen={true} onClose={mockOnClose} size={size} testId="m">Content</Modal>
        );
        expect(screen.getByTestId('m')).toBeInTheDocument();
        unmount();
      });
    });

    it('should apply sm width 360px', () => {
      render(<Modal isOpen={true} onClose={mockOnClose} size="sm" testId="m">Content</Modal>);
      expect(screen.getByTestId('m')).toHaveStyle({ width: '360px' });
    });

    it('should apply default width 562px', () => {
      render(<Modal isOpen={true} onClose={mockOnClose} size="default" testId="m">Content</Modal>);
      expect(screen.getByTestId('m')).toHaveStyle({ width: '562px' });
    });

    it('should apply xl width 800px', () => {
      render(<Modal isOpen={true} onClose={mockOnClose} size="xl" testId="m">Content</Modal>);
      expect(screen.getByTestId('m')).toHaveStyle({ width: '800px' });
    });

    it('should apply custom numeric width', () => {
      render(<Modal isOpen={true} onClose={mockOnClose} width={900} testId="m">Content</Modal>);
      expect(screen.getByTestId('m')).toHaveStyle({ width: '900px' });
    });

    it('should apply custom string width', () => {
      render(<Modal isOpen={true} onClose={mockOnClose} width="50vw" testId="m">Content</Modal>);
      expect(screen.getByTestId('m')).toHaveStyle({ width: '50vw' });
    });

    it('should apply numeric height', () => {
      render(<Modal isOpen={true} onClose={mockOnClose} height={600} testId="m">Content</Modal>);
      expect(screen.getByTestId('m')).toHaveStyle({ height: '600px' });
    });

    it('should apply string height', () => {
      render(<Modal isOpen={true} onClose={mockOnClose} height="80vh" testId="m">Content</Modal>);
      expect(screen.getByTestId('m')).toHaveStyle({ height: '80vh' });
    });
  });

  // ─── Positions ────────────────────────────────────────────────────────────

  describe('Positions', () => {
    const positions = [
      'center', 'top-left', 'top-right', 'top-center',
      'bottom-left', 'bottom-right', 'bottom-center',
      'center-left', 'center-right',
    ] as const;

    positions.forEach(position => {
      it(`should render at position ${position}`, () => {
        const { unmount } = render(
          <Modal isOpen={true} onClose={mockOnClose} position={position}>Content</Modal>
        );
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        unmount();
      });
    });
  });

  // ─── Accessibility ────────────────────────────────────────────────────────

  describe('Accessibility', () => {
    it('should have role="dialog"', () => {
      render(<Modal isOpen={true} onClose={mockOnClose}>Content</Modal>);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should have aria-modal="true"', () => {
      render(<Modal isOpen={true} onClose={mockOnClose}>Content</Modal>);
      expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
    });

    it('should have accessible close button with aria-label', () => {
      render(<Modal isOpen={true} onClose={mockOnClose}>Content</Modal>);
      expect(screen.getByLabelText('Close dialog')).toBeInTheDocument();
    });
  });

  // ─── className ────────────────────────────────────────────────────────────

  describe('className', () => {
    it('should apply custom className to dialog', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} className="custom-modal" testId="m">
          Content
        </Modal>
      );
      expect(screen.getByTestId('m')).toHaveClass('custom-modal');
    });

    it('should keep default classes with custom className', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} className="custom-modal" testId="m">
          Content
        </Modal>
      );
      const dialog = screen.getByTestId('m');
      expect(dialog).toHaveClass('custom-modal');
      expect(dialog.className).toMatch(/bg-white/);
    });
  });
});