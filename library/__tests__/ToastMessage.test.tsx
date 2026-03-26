import React from 'react';
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ToastMessage } from '../src/components/ToastMessage';

// ─── Mock createPortal so toast renders into the document body ────────────────
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: (node: React.ReactNode, container: Element) => node,
}));

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
  jest.useRealTimers();
});

describe('ToastMessage', () => {

  // ─── Render ───────────────────────────────────────────────────────────────

  describe('Render', () => {
    it('should render with role="alert"', () => {
      render(<ToastMessage />);
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('should render into document.body via portal', () => {
      render(<ToastMessage />);
      expect(document.body).toContainElement(screen.getByRole('alert'));
    });

    it('should have aria-live="assertive"', () => {
      render(<ToastMessage />);
      expect(screen.getByRole('alert')).toHaveAttribute('aria-live', 'assertive');
    });

    it('should apply testId', () => {
      render(<ToastMessage testId="toast" />);
      expect(screen.getByTestId('toast')).toBeInTheDocument();
    });

    it('should have correct displayName', () => {
      expect(ToastMessage.displayName).toBe('ToastMessage');
    });
  });

  // ─── Default Titles per Type ──────────────────────────────────────────────

  describe('Default Titles', () => {
    it('should default to type "notification" with title "Notification"', () => {
      render(<ToastMessage />);
      expect(screen.getByText('Notification')).toBeInTheDocument();
    });

    const cases = [
      { type: 'success',      expected: 'Success'      },
      { type: 'error',        expected: 'Error'        },
      { type: 'warning',      expected: 'Warning'      },
      { type: 'notification', expected: 'Notification' },
    ] as const;

    cases.forEach(({ type, expected }) => {
      it(`should show default title "${expected}" for type="${type}"`, () => {
        const { unmount } = render(<ToastMessage type={type} />);
        expect(screen.getByText(expected)).toBeInTheDocument();
        unmount();
      });
    });

    it('should use custom title over default', () => {
      render(<ToastMessage type="success" title="Accepted" />);
      expect(screen.getByText('Accepted')).toBeInTheDocument();
      expect(screen.queryByText('Success')).not.toBeInTheDocument();
    });
  });

  // ─── Message ─────────────────────────────────────────────────────────────

  describe('Message', () => {
    it('should render provided message', () => {
      render(<ToastMessage title="T" message="You have accepted the request" />);
      expect(screen.getByText('You have accepted the request')).toBeInTheDocument();
    });

    it('should not render message element when message is undefined', () => {
      render(<ToastMessage type="success" title="Accepted" />);
      // Only the title should be present, no extra text
      expect(screen.queryByText(/accepted the request/i)).not.toBeInTheDocument();
    });

it('should not render message element when message is empty string', () => {
  render(<ToastMessage type="success" title="Accepted" message="" />);
  // The alert should only contain the title text, no separate message element
  const alert = screen.getByRole('alert');
  expect(alert.textContent?.trim()).toBe('Accepted');
});

    it('should render both title and message together', () => {
      render(<ToastMessage type="success" title="Done" message="All saved" />);
      expect(screen.getByText('Done')).toBeInTheDocument();
      expect(screen.getByText('All saved')).toBeInTheDocument();
    });
  });

  // ─── Close Button ─────────────────────────────────────────────────────────

  describe('Close Button', () => {
    it('should not render close button when onClose is not provided', () => {
      render(<ToastMessage />);
      expect(screen.queryByLabelText('Close toast')).not.toBeInTheDocument();
    });

    it('should render close button when onClose is provided and showClose=true', () => {
      render(<ToastMessage onClose={jest.fn()} />);
      expect(screen.getByLabelText('Close toast')).toBeInTheDocument();
    });

    it('should not render close button when showClose=false even with onClose', () => {
      render(<ToastMessage onClose={jest.fn()} showClose={false} />);
      expect(screen.queryByLabelText('Close toast')).not.toBeInTheDocument();
    });

    it('should call onClose when close button clicked', () => {
      const onClose = jest.fn();
      render(<ToastMessage onClose={onClose} message="Test" />);
      fireEvent.click(screen.getByLabelText('Close toast'));
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should call onClose exactly once per click', () => {
      const onClose = jest.fn();
      render(<ToastMessage onClose={onClose} />);
      const btn = screen.getByLabelText('Close toast');
      fireEvent.click(btn);
      fireEvent.click(btn);
      expect(onClose).toHaveBeenCalledTimes(2);
    });
  });

  // ─── Auto-dismiss ─────────────────────────────────────────────────────────

  describe('Auto-dismiss', () => {
    it('should auto-dismiss after duration when onClose provided', () => {
      jest.useFakeTimers();
      const onClose = jest.fn();
      render(<ToastMessage onClose={onClose} duration={500} />);

      act(() => { jest.advanceTimersByTime(499); });
      expect(onClose).not.toHaveBeenCalled();

      act(() => { jest.advanceTimersByTime(1); });
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should not auto-dismiss when duration=0', () => {
      jest.useFakeTimers();
      const onClose = jest.fn();
      render(<ToastMessage onClose={onClose} duration={0} />);

      act(() => { jest.advanceTimersByTime(10_000); });
      expect(onClose).not.toHaveBeenCalled();
    });

    it('should not auto-dismiss when onClose is not provided', () => {
      jest.useFakeTimers();
      render(<ToastMessage duration={500} />);
      act(() => { jest.advanceTimersByTime(1000); });
      // No error thrown — component is still mounted
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('should use default duration of 5000ms', () => {
      jest.useFakeTimers();
      const onClose = jest.fn();
      render(<ToastMessage onClose={onClose} />);

      act(() => { jest.advanceTimersByTime(4999); });
      expect(onClose).not.toHaveBeenCalled();

      act(() => { jest.advanceTimersByTime(1); });
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should clear timer on unmount', () => {
      jest.useFakeTimers();
      const onClose = jest.fn();
      const { unmount } = render(<ToastMessage onClose={onClose} duration={1000} />);
      unmount();
      act(() => { jest.advanceTimersByTime(2000); });
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  // ─── Action Buttons ───────────────────────────────────────────────────────

  describe('Action Buttons', () => {
    const actions = [
      { label: 'Confirm', onClick: jest.fn(), variant: 'primary'   as const },
      { label: 'Cancel',  onClick: jest.fn(), variant: 'secondary' as const },
    ];

    beforeEach(() => actions.forEach(a => a.onClick.mockClear()));

    it('should render action buttons when action[] provided', () => {
      render(<ToastMessage action={actions} duration={0} onClose={() => {}} />);
      expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    });

    it('should call primary action onClick when clicked', () => {
      render(<ToastMessage action={actions} duration={0} onClose={() => {}} />);
      fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));
      expect(actions[0].onClick).toHaveBeenCalledTimes(1);
    });

    it('should call secondary action onClick when clicked', () => {
      render(<ToastMessage action={actions} duration={0} onClose={() => {}} />);
      fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
      expect(actions[1].onClick).toHaveBeenCalledTimes(1);
    });

    it('should render single action button', () => {
      render(<ToastMessage action={[{ label: 'OK', onClick: jest.fn() }]} />);
      expect(screen.getByRole('button', { name: 'OK' })).toBeInTheDocument();
    });

    it('should not render action area when action is empty array', () => {
      render(<ToastMessage action={[]} />);
      // no extra buttons other than possible close
      expect(screen.queryByRole('button', { name: 'Confirm' })).not.toBeInTheDocument();
    });

    it('should not render action area when action is not provided', () => {
      render(<ToastMessage onClose={jest.fn()} />);
      // only the close button
      expect(screen.getAllByRole('button').length).toBe(1);
    });
  });

  // ─── Icons ────────────────────────────────────────────────────────────────

  describe('Icons', () => {
    it('should render type icon for success', () => {
      render(<ToastMessage type="success" />);
      expect(screen.getByAltText('Success')).toBeInTheDocument();
    });

    it('should render type icon for error', () => {
      render(<ToastMessage type="error" />);
      expect(screen.getByAltText('Error')).toBeInTheDocument();
    });

    it('should render type icon for warning', () => {
      render(<ToastMessage type="warning" />);
      expect(screen.getByAltText('Warning')).toBeInTheDocument();
    });

    it('should render type icon for notification', () => {
      render(<ToastMessage type="notification" />);
      expect(screen.getByAltText('Notification')).toBeInTheDocument();
    });

    it('should use custom iconSrc when custom.iconSrc provided', () => {
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

    it('should override type icon with custom iconSrc', () => {
      render(
        <ToastMessage
          type="success"
          custom={{ iconSrc: 'https://example.com/my-icon.png' }}
        />
      );
      // custom renders with alt = type, not "Success"
      expect(screen.queryByAltText('Success')).not.toBeInTheDocument();
      expect(screen.getByAltText('success')).toBeInTheDocument();
    });
  });

  // ─── Background Variants ──────────────────────────────────────────────────

  describe('Background Variants', () => {
    it('should render with solid background by default', () => {
      render(<ToastMessage type="success" testId="t" />);
      // no extra text-[#555] class for solid
      expect(screen.getByTestId('t').className).not.toMatch(/text-\[#555\]/);
    });

    it('should render with transparent background variant', () => {
      render(<ToastMessage type="success" background="transparent" testId="t" />);
      expect(screen.getByTestId('t').className).toMatch(/bg-white/);
    });

    it('should apply transparent icon alt for success when transparent', () => {
      render(<ToastMessage type="success" background="transparent" />);
      expect(screen.getByAltText('Success')).toBeInTheDocument();
    });
  });

  // ─── Custom Styles ────────────────────────────────────────────────────────

  describe('Custom Styles', () => {
    it('should apply custom titleColor', () => {
      const { container } = render(
        <ToastMessage title="T" custom={{ titleColor: '#ff0000' }} />
      );
      const titleEl = container.querySelector('[style*="rgb(255, 0, 0)"]') as HTMLElement;
      expect(titleEl).not.toBeNull();
    });

    it('should apply custom titleFontFamily', () => {
      const { container } = render(
        <ToastMessage title="T" custom={{ titleFontFamily: 'Georgia' }} />
      );
      const titleEl = container.querySelector('[style*="Georgia"]') as HTMLElement;
      expect(titleEl).not.toBeNull();
    });

    it('should apply custom iconWidth and iconHeight', () => {
      render(
        <ToastMessage
          type="success"
          custom={{ iconSrc: 'https://example.com/icon.png', iconWidth: '40px', iconHeight: '40px' }}
        />
      );
      const img = screen.getByAltText('success') as HTMLImageElement;
      expect(img.style.width).toBe('40px');
      expect(img.style.height).toBe('40px');
    });
  });

  // ─── className passthrough ────────────────────────────────────────────────

  describe('className', () => {
    it('should apply custom className to alert container', () => {
      render(<ToastMessage className="extra-class" />);
      expect(screen.getByRole('alert')).toHaveClass('extra-class');
    });
  });
});