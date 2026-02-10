import React from 'react';
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

import { ToastMessage } from '../src/components/ToastMessage';

describe('ToastMessage', () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('renders into a portal (document.body) with role="alert"', () => {
    render(<ToastMessage />);
    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(document.body).toContainElement(alert);
  });

  it('uses default type "notification" and default title "Notification" when title is not provided', () => {
    render(<ToastMessage />);
    expect(screen.getByText('Notification')).toBeInTheDocument();
  });

  it('renders provided title and message', () => {
    render(
      <ToastMessage
        type="success"
        title="Accepted"
        message="You have accepted the request"
      />
    );

    expect(screen.getByText('Accepted')).toBeInTheDocument();
    expect(screen.getByText('You have accepted the request')).toBeInTheDocument();
  });

  it('does not render message node when message is undefined/empty', () => {
    render(<ToastMessage type="success" title="Accepted" />);
    expect(screen.getByText('Accepted')).toBeInTheDocument();
    expect(screen.queryByText(/accepted the request/i)).not.toBeInTheDocument();
  });

  it('renders close button only when onClose is provided (and showClose is true)', () => {
    const onClose = jest.fn();

    const { rerender } = render(<ToastMessage />);
    expect(screen.queryByLabelText('Close toast')).not.toBeInTheDocument();

    rerender(<ToastMessage onClose={onClose} />);
    expect(screen.getByLabelText('Close toast')).toBeInTheDocument();
  });

  it('does not render close button when showClose is false (even if onClose is provided)', () => {
    const onClose = jest.fn();
    render(<ToastMessage onClose={onClose} showClose={false} />);
    expect(screen.queryByLabelText('Close toast')).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = jest.fn();
    render(<ToastMessage onClose={onClose} message="Test message" />);

    const closeBtn = screen.getByLabelText('Close toast');
    fireEvent.click(closeBtn);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('auto-dismisses after duration when onClose is provided and duration > 0', () => {
    jest.useFakeTimers();
    const onClose = jest.fn();

    render(<ToastMessage onClose={onClose} duration={500} />);

    act(() => {
      jest.advanceTimersByTime(499);
    });
    expect(onClose).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not auto-dismiss when duration is 0', () => {
    jest.useFakeTimers();
    const onClose = jest.fn();

    render(<ToastMessage onClose={onClose} duration={0} />);

    act(() => {
      jest.advanceTimersByTime(10_000);
    });
    expect(onClose).not.toHaveBeenCalled();
  });

  it('renders correct default titles for each type when title is not provided', () => {
    const cases: Array<{ type: 'success' | 'error' | 'warning' | 'notification'; expected: string }> = [
      { type: 'success', expected: 'Success' },
      { type: 'error', expected: 'Error' },
      { type: 'warning', expected: 'Warning' },
      { type: 'notification', expected: 'Notification' },
    ];

    for (const c of cases) {
      const { unmount } = render(<ToastMessage type={c.type} />);
      expect(screen.getByText(c.expected)).toBeInTheDocument();
      unmount();
    }
  });

  it('renders action buttons when action[] is provided and calls onClick handlers', () => {
    const onConfirm = jest.fn();
    const onCancel = jest.fn();

    render(
      <ToastMessage
        type="success"
        title="Confirmation Required"
        message="Do you want to proceed with this action?"
        duration={0}
        onClose={() => {}}
        action={[
          { label: 'Confirm', onClick: onConfirm, variant: 'primary' },
          { label: 'Cancel', onClick: onCancel, variant: 'secondary' },
        ]}
      />
    );

    const confirmBtn = screen.getByRole('button', { name: 'Confirm' });
    const cancelBtn = screen.getByRole('button', { name: 'Cancel' });

    fireEvent.click(confirmBtn);
    fireEvent.click(cancelBtn);

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('uses custom icon src when custom.iconSrc is provided (img alt should match type)', () => {
    render(
      <ToastMessage
        type="warning"
        custom={{ iconSrc: 'https://example.com/custom-icon.png' }}
      />
    );

    const img = screen.getByAltText('warning') as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toContain('https://example.com/custom-icon.png');
  });
});
