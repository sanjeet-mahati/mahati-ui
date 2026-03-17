import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

const user = userEvent.setup();

jest.mock('@/lib', () => {
  const React = require('react') as typeof import('react');

  type ToastType = 'success' | 'error' | 'warning' | 'notification';
  type BackgroundType = 'solid' | 'transparent';

  interface ActionButton {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
    hoverBackgroundColor?: string;
    fontSize?: string;
    fontWeight?: string;
    padding?: string;
    borderRadius?: string;
  }

  interface Props {
    type?: ToastType;
    title?: string;
    message?: string;
    onClose?: () => void;
    showClose?: boolean;
    duration?: number;
    background?: BackgroundType;
    action?: ActionButton[];
    custom?: any;
    className?: string;
  }

  const MahatiToastMessage: React.FC<Props> = ({
    type = 'notification',
    title,
    message,
    onClose,
    showClose = true,
    action,
  }) => {
    const displayTitle = title ?? (type.charAt(0).toUpperCase() + type.slice(1));

    return (
      <div role="alert" aria-live="assertive">
        <div>{displayTitle}</div>
        {message ? <div>{message}</div> : null}

        {showClose && onClose ? (
          <button aria-label="Close toast" onClick={onClose}>
            Close
          </button>
        ) : null}

        {action?.length ? (
          <div>
            {action.map((a, idx) => (
              <button key={idx} onClick={a.onClick}>
                {a.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    );
  };

  return { MahatiToastMessage };
}, { virtual: true });

import MahatiToastMessagePage from '../../../app/toast/page';

describe('ToastMessageDemo (testbed)', () => {
  const clickFirstButtonByName = async (nameRegex: RegExp) => {
    const buttons = screen.getAllByRole('button');
    const target = buttons.find(btn => 
      btn.textContent?.match(nameRegex)
    );
    if (target) {
      await user.click(target);
      return waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument());
    }
    throw new Error(`Button "${nameRegex}" not found`);
  };

  it('renders the demo page header and primary buttons', () => {
    render(<MahatiToastMessagePage />);

    expect(screen.getByText('Toast Notification')).toBeInTheDocument();

    expect(screen.getAllByRole('button', { name: /show success toast/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /show error toast/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /show warning toast/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /show notification toast/i }).length).toBeGreaterThan(0);
  });

  it('shows a success toast when "Show Success Toast" is clicked', async () => {
    render(<MahatiToastMessagePage />);
    await clickFirstButtonByName(/show success toast/i);

    expect(screen.getByText('Success')).toBeInTheDocument();
    expect(screen.queryByText(/success message description/i)).not.toBeInTheDocument();
    expect(screen.getByLabelText('Close toast')).toBeInTheDocument();
  });

  it('shows an error toast with message when "Show Error Toast" is clicked', async () => {
    render(<MahatiToastMessagePage />);
    await clickFirstButtonByName(/show error toast/i);

    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('Error message description')).toBeInTheDocument();
  });

  it('closes the toast when close button is clicked', async () => {
    render(<MahatiToastMessagePage />);
    await clickFirstButtonByName(/show error toast/i);
    
    expect(screen.getByText('Error')).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('Close toast'));

    await waitFor(() => {
      expect(screen.queryByText('Error')).not.toBeInTheDocument();
      expect(screen.queryByText('Error message description')).not.toBeInTheDocument();
    });
  });

  it('renders the "Multiple Actions" toast and action buttons are clickable', async () => {
    render(<MahatiToastMessagePage />);

    // Mock alert for action buttons
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    
    await clickFirstButtonByName(/multiple actions/i);

    expect(screen.getByText('New Message')).toBeInTheDocument();
    expect(screen.getByText('You have 3 unread messages')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'View' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Mark as Read' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Ignore' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'View' }));
    expect(alertSpy).toHaveBeenCalled();
    alertSpy.mockRestore();
  });
});
