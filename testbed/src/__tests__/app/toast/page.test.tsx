import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

/**
 * Jest in testbed doesn't resolve Next.js alias "@/lib" unless moduleNameMapper is configured.
 * We create a VIRTUAL mock module for "@/lib" so the page can import it without config changes.
 */
jest.mock(
  '@/lib',
  () => {
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
  },
  { virtual: true }
);

// Import AFTER the mock so page.tsx uses the mocked "@/lib"
// import MahatiToastMessagePage from '../app/toast/page';
import MahatiToastMessagePage from '../../../app/toast/page';


describe('ToastMessageDemo (testbed)', () => {
  const clickFirstButtonByName = (nameRegex: RegExp) => {
    const buttons = screen.getAllByRole('button', { name: nameRegex });
    // Because the demo repeats buttons (solid + transparent), click the first match
    fireEvent.click(buttons[0]);
  };

  it('renders the demo page header and primary buttons (duplicates allowed)', () => {
    render(<MahatiToastMessagePage />);

    expect(screen.getByText('Toast Notification')).toBeInTheDocument();

    // These exist multiple times (solid + transparent), so use getAllByRole
    expect(screen.getAllByRole('button', { name: /show success toast/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /show error toast/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /show warning toast/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /show notification toast/i }).length).toBeGreaterThan(0);
  });

  it('shows a success toast when "Show Success Toast" is clicked', () => {
    render(<MahatiToastMessagePage />);

    clickFirstButtonByName(/show success toast/i);

    // type="success" with no title -> default "Success"
    expect(screen.getByText('Success')).toBeInTheDocument();

    // In demo, solid success toast message is commented out
    expect(screen.queryByText(/success message description/i)).not.toBeInTheDocument();

    // Demo provides onClose
    expect(screen.getByLabelText('Close toast')).toBeInTheDocument();
  });

  it('shows an error toast with message when "Show Error Toast" is clicked', () => {
    render(<MahatiToastMessagePage />);

    clickFirstButtonByName(/show error toast/i);

    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('Error message description')).toBeInTheDocument();
  });

  it('closes the toast when close button is clicked', () => {
    render(<MahatiToastMessagePage />);

    clickFirstButtonByName(/show error toast/i);
    expect(screen.getByText('Error')).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('Close toast'));

    expect(screen.queryByText('Error')).not.toBeInTheDocument();
    expect(screen.queryByText('Error message description')).not.toBeInTheDocument();
  });

  it('renders the "Multiple Actions" toast and action buttons are clickable', () => {
    render(<MahatiToastMessagePage />);

    // "Multiple Actions" button exists once in your demo
    fireEvent.click(screen.getByRole('button', { name: /multiple actions/i }));

    expect(screen.getByText('New Message')).toBeInTheDocument();
    expect(screen.getByText('You have 3 unread messages')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'View' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Mark as Read' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Ignore' })).toBeInTheDocument();

    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    fireEvent.click(screen.getByRole('button', { name: 'View' }));
    expect(alertSpy).toHaveBeenCalled();
    alertSpy.mockRestore();
  });
});
