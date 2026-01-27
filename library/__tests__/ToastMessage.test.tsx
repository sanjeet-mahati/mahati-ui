import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ToastMessage, type Toast, type ToastPosition } from '../src/components/ToastMessage';

// Mock image assets
jest.mock('../src/assets/icons/check-mark_1.png', () => 'mock-check-solid.png');
jest.mock('../src/assets/icons/check-mark_2.png', () => 'mock-check-transparent.png');
jest.mock('../src/assets/icons/danger_1.png', () => 'mock-danger-solid.png');
jest.mock('../src/assets/icons/danger_2.png', () => 'mock-danger-transparent.png');
jest.mock('../src/assets/icons/danger_1_1.png', () => 'mock-warning.png');
jest.mock('../src/assets/icons/notification_1.png', () => 'mock-notification-solid.png');
jest.mock('../src/assets/icons/notification_2.png', () => 'mock-notification-transparent.png');
jest.mock('../src/assets/icons/close.png', () => 'mock-close-solid.png');
jest.mock('../src/assets/icons/close_copy_1.png', () => 'mock-close-transparent.png');

const mockToast: Omit<Toast, 'id'> = {
  type: 'Success' as const,
  title: 'Test Title',
  message: 'Test message',
};

const renderToast = (
  overrides: Partial<Omit<Toast, 'id'>> = {},
  position: ToastPosition = 'top-right',
  onClose = jest.fn()
) => {
  const toast: Toast = {
    id: 'test-toast',
    ...mockToast,
    ...overrides,
  };
  return render(<ToastMessage toasts={[toast]} position={position} onClose={onClose} />);
};

describe('ToastMessage', () => {
  it('should render toast message', () => {
    renderToast();
    expect(screen.getByText('Test message')).toBeInTheDocument();
    expect(screen.getByText('Test Title')).toBeInTheDocument(); // title
  });

  it('should render with all types', () => {
    const types: Toast['type'][] = ['Success', 'Error', 'Warning', 'Notification', 'Action', 'LiquidUI'];
    types.forEach((type) => {
      const { unmount } = renderToast({ type, title: type });
      expect(screen.getByText(type)).toBeInTheDocument();
      unmount();
    });
  });

  it('should render at all positions', () => {
    const positions: ToastPosition[] = [
      'top-left', 'top-center', 'top-right',
      'bottom-left', 'bottom-center', 'bottom-right'
    ];
    positions.forEach((position) => {
      const { container, unmount } = renderToast({}, position);
      expect(container).toBeInTheDocument(); // Container renders regardless of position
      expect(screen.getByText('Test message')).toBeInTheDocument();
      unmount();
    });
  });

  it('should call onClose when close button clicked', async () => {
    const handleClose = jest.fn();
    renderToast({}, 'top-right', handleClose);

    const closeButton = screen.getByRole('button', { name: /close/i });
    
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(handleClose).toHaveBeenCalledWith('test-toast');
    });
  });

  it('should auto-dismiss after duration', () => {
    jest.useFakeTimers();
    const handleClose = jest.fn();
    renderToast({ duration: 3000 }, 'top-right', handleClose);

    act(() => {
      jest.advanceTimersByTime(3500);
    });

    expect(handleClose).toHaveBeenCalledWith('test-toast');
    jest.useRealTimers();
  });

  it('should not auto-dismiss when hovered', () => {
    jest.useFakeTimers();
    const handleClose = jest.fn();
    const { container } = renderToast({ duration: 1000 }, 'top-right', handleClose);

    act(() => {
      fireEvent.mouseEnter(container.firstChild!);
      jest.advanceTimersByTime(1000);
    });

    expect(handleClose).not.toHaveBeenCalled();
    jest.useRealTimers();
  });

  it('should render with actions', async () => {
    const handleAction = jest.fn();
    renderToast({
      actions: [{ label: 'Undo', onClick: handleAction }],
    });

    const actionButton = screen.getByRole('button', { name: /undo/i });
    expect(actionButton).toBeInTheDocument();

    fireEvent.click(actionButton);
    
    await waitFor(() => {
      expect(handleAction).toHaveBeenCalled();
    });
  });

  it('should render multiple actions', () => {
    const handlePrimary = jest.fn();
    const handleSecondary = jest.fn();
    renderToast({
      actions: [
        { label: 'Primary', onClick: handlePrimary },
        { label: 'Secondary', onClick: handleSecondary },
      ],
    });

    expect(screen.getByText('Primary')).toBeInTheDocument();
    expect(screen.getByText('Secondary')).toBeInTheDocument();
  });

it('should render without message', () => {
  renderToast({ message: undefined });
  
  // 1. Fix: Expect 'Test Title' based on the error log output, not 'Success'
  expect(screen.getByText('Test Title')).toBeInTheDocument();
  expect(screen.queryByText('Test message')).not.toBeInTheDocument();

  // 2. Fix: Verify the Close button exists (addressing "button" check)
  expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
});

it('should apply correct styles for different types', () => {
  renderToast({ type: 'Error', title: 'Error' });
  const container = screen.getByRole('status');
  
  // 3. Fix: Check for the Tailwind class instead of computed style
  // JSDOM doesn't compute Tailwind classes into styles like 'height: 70px'
  expect(container).toHaveClass('h-[70px]'); 
});
});