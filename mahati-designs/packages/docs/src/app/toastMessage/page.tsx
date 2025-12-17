'use client';

import React, { useEffect, useState } from 'react';
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  QuestionMarkCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';


type ToastType = 'success' | 'error' | 'warning' | 'info' | 'action' | 'liquidUI';
type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

interface ToastAction {
  label: string;
  onClick?: () => void;
}

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  duration?: number; // ms; 0 = persistent
  actions?: ToastAction[]; // presence of actions disables autoclose
}

// ===============================
// Toast Item
// ===============================
interface ToastItemProps {
  toast: Toast;
  onClose: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onClose }) => {
  const [isExiting, setIsExiting] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (toast.duration && toast.duration > 0 && !hovered && !(toast.actions?.length)) {
      const interval = setInterval(() => {
        setElapsed((prev) => {
          if (prev >= toast.duration!) {
            handleClose();
            return prev;
          }
          return prev + 100;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [toast.duration, hovered, toast.actions]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => onClose(toast.id), 300);
  };

  const handleAction = (action?: () => void) => {
    action?.();
    handleClose();
  };

  const styles = (() => {
    switch (toast.type) {
      case 'success':
        return {
          border: 'border-[rgba(34,197,94,1)]',
          bg: 'bg-[rgba(240,253,244,1)]',
          icon: 'text-[rgba(34,197,94,1)]',
          Icon: CheckCircleIcon,
        };
      case 'error':
        return {
          border: 'border-[rgba(239,68,68,1)]',
          bg: 'bg-[rgba(254,242,242,1)]',
          icon: 'text-[rgba(239,68,68,1)]',
          Icon: XCircleIcon,
        };
      case 'warning':
        return {
          border: 'border-[rgba(234,179,8,1)]',
          bg: 'bg-[rgba(254,252,232,1)]',
          icon: 'text-[rgba(234,179,8,1)]',
          Icon: ExclamationTriangleIcon,
        };
      case 'info':
        return {
          border: 'border-[rgba(59,130,246,1)]',
          bg: 'bg-[rgba(239,246,255,1)]',
          icon: 'text-[rgba(59,130,246,1)]',
          Icon: InformationCircleIcon,
        };
      case 'action':
        return {
          border: 'border-[rgba(139,92,246,1)]',
          bg: 'bg-[rgba(245,243,255,1)]',
          icon: 'text-[rgba(139,92,246,1)]',
          Icon: QuestionMarkCircleIcon,
        };
      case 'liquidUI':
        return {
          border: 'border-[rgba(178,185,182,0.4)]',
          bg: 'bg-[rgba(240,253,244,1)]',
          icon: 'text-[rgba(178,185,182,0.4)]',
          Icon: CheckCircleIcon,
        };
      default:
        return {
          border: 'border-gray-300',
          bg: 'bg-white',
          icon: 'text-slate-600',
          Icon: InformationCircleIcon,
        };
    }
  })();

  const Icon = styles.Icon;
  const progressPct =
    toast.duration && toast.duration > 0 ? Math.min(100, (elapsed / toast.duration) * 100) : 0;
  const hasActions = !!(toast.actions && toast.actions.length > 0);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={[
        'flex flex-col overflow-hidden rounded-lg border shadow-lg transition-all duration-300',
        styles.bg,
        styles.border,
        isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0',
        'min-w-[320px] max-w-[420px]',
      ].join(' ')}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start gap-3 p-4">
        <div className={['flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white', styles.icon].join(' ')}>
          <Icon className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <h4 className="mb-1 text-sm font-semibold text-[rgba(17,24,39,1)]">{toast.title}</h4>
          <p className="text-sm text-[rgba(107,114,128,1)]">{toast.message}</p>
        </div>

        {!hasActions && (
          <button
            onClick={handleClose}
            className="shrink-0 rounded p-1 text-[rgba(107,114,128,1)] transition-colors hover:bg-black/5"
            aria-label="Close"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        )}
      </div>

      {hasActions && (
        <div className="flex gap-2 px-4 pb-4">
          {toast.actions![0] && (
            <button
              onClick={() => handleAction(toast.actions![0].onClick)}
              className="flex-1 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
            >
              {toast.actions![0].label}
            </button>
          )}
          {toast.actions![1] && (
            <button
              onClick={() => handleAction(toast.actions![1].onClick)}
              className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-gray-50"
            >
              {toast.actions![1].label}
            </button>
          )}
        </div>
      )}

      {(toast.duration ?? 0) > 0 && !hasActions && (
        <div className="h-1 w-full bg-black/5">
          <div
            className={[
              'h-full transition-all duration-100',
              styles.icon,
              `w-[${progressPct}%]`,
            ].join(' ')}
            aria-hidden
          />
        </div>
      )}
    </div>
  );
};


interface ToastContainerProps {
  toasts: Toast[];
  position: ToastPosition;
  onClose: (id: string) => void;
}

const posClass = (p: ToastPosition) => {
  switch (p) {
    case 'top-left':
      return 'top-5 left-5';
    case 'top-center':
      return 'top-5 left-1/2 -translate-x-1/2';
    case 'top-right':
      return 'top-5 right-5';
    case 'bottom-left':
      return 'bottom-5 left-5';
    case 'bottom-center':
      return 'bottom-5 left-1/2 -translate-x-1/2';
    case 'bottom-right':
      return 'bottom-5 right-5';
    default:
      return 'top-5 right-5';
  }
};

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, position, onClose }) => {
  return (
    <div
      className={[
        'fixed z-[9999] flex flex-col gap-3 pointer-events-none',
        posClass(position),
      ].join(' ')}
    >
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <ToastItem toast={t} onClose={onClose} />
        </div>
      ))}
    </div>
  );
};


export default function ToastDemo() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [position, setPosition] = useState<ToastPosition>('top-right');

  const addToast = (
    type: ToastType,
    title: string,
    message: string,
    duration: number = 5000,
    actions?: ToastAction[]
  ) => {
    const newToast: Toast = {
      id: `${Date.now()}-${Math.random()}`,
      type,
      title,
      message,
      duration,
      actions,
    };
    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));
  const clearAllToasts = () => setToasts([]);

  const showConfirmationToast = () => {
    addToast('action', 'Accept Invite?', "You've been invited to the project workspace.", 0, [
      {
        label: 'Accept',
        onClick: () => addToast('success', 'Invitation Accepted', 'You have joined the workspace.', 3000),
      },
      {
        label: 'Decline',
        onClick: () => addToast('error', 'Invitation Declined', 'You have declined the invitation.', 3000),
      },
    ]);
  };

  return (
    <div className="min-h-screen p-8 bg-[linear-gradient(to_bottom_right,rgba(249,250,251,1),rgba(243,244,246,1))]">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-2 text-4xl font-bold text-[rgba(17,24,39,1)]">Toast Notification Demo</h1>
        {/* <p className="mb-12 text-[rgba(107,114,128,1)]">
          Customizable toast notifications with TypeScript and Tailwind CSS
        </p> */}

        <div className="grid gap-8">
          {/* Position control */}
          <section className="rounded-xl border border-[rgba(229,231,235,1)] bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-2xl font-semibold text-[rgba(17,24,39,1)]">Toast Position</h2>
            <div className="flex flex-wrap gap-3">
              {(['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'] as ToastPosition[]).map(
                (pos) => (
                  <button
                    key={pos}
                    onClick={() => setPosition(pos)}
                    className={[
                      'rounded-lg px-4 py-2 font-medium transition-colors',
                      position === pos
                        ? 'bg-[rgba(59,130,246,1)] text-white'
                        : 'bg-[rgba(243,244,246,1)] text-[rgba(55,65,81,1)]',
                    ].join(' ')}
                  >
                    {pos.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                  </button>
                )
              )}
            </div>
          </section>

  


          <section className="rounded-xl border border-[rgba(229,231,235,1)] bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-2xl text-[rgba(17,24,39,1)]">Success Toast Type</h2>
            <div className="flex max-w-md flex-col gap-3">
              <button
                onClick={() => addToast('success', 'Success!', 'Your changes have been saved successfully.')}
                className="px-6 py-3 text-left transition-colors  bg-[rgba(22,163,74,1)] text-white hover:opacity-90"
              >
                Show Success Toast
              </button>
            </div>
          </section>

          <section className="rounded-xl border border-[rgba(229,231,235,1)] bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-2xl text-[rgba(17,24,39,1)]">Erro Toast Type</h2>
            <div className="flex max-w-md flex-col gap-3">
              <button
                onClick={() => addToast('error', 'Error!', 'Something went wrong. Please try again.')}
                className="px-6 py-3 text-left transition-colors rounded-sm bg-[rgba(239,68,68,1)] text-white hover:opacity-90"
              >
                Show Error Toast
              </button>
            </div>
          </section>

        
          <section className="rounded-xl border border-[rgba(229,231,235,1)] bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-2xl text-[rgba(17,24,39,1)]">Warning Toast Type</h2>
            <div className="flex max-w-md flex-col gap-3">
              <button
                onClick={() => addToast('warning', 'Warning!', 'Please review your information before proceeding.')}
                className="px-6 py-3 text-left transition-colors rounded-md bg-[rgba(234,179,8,1)] text-white hover:opacity-90"
              >
                Show Warning Toast
              </button>
            </div>
          </section>

          
          <section className="rounded-xl border border-[rgba(229,231,235,1)] bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-2xl text-[rgba(17,24,39,1)]">Information Toast Type</h2>
            <div className="flex max-w-md flex-col gap-3">
              <button
                onClick={() => addToast('info', 'Information', 'Here is some helpful information for you.')}
                className="px-6 py-3 text-left transition-colors rounded-lg bg-[rgba(59,130,246,1)] text-white hover:opacity-90"
              >
                Show Info Toast
              </button>
            </div>
          </section>

          <section className="rounded-xl border border-[rgba(229,231,235,1)] bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-2xl text-[rgba(17,24,39,1)]">Liquid UI Toast Type</h2>
            <div className="flex max-w-md flex-col gap-3">
              <button
                onClick={() => addToast('liquidUI', 'Liquid UI!', 'You are seeing sample Liquid UI toast.')}
                className="px-6 py-3 text-center transition-colors rounded-xl bg-[rgba(178,185,182,0.4)] text-black hover:opacity-90"
              >
                Show Liquid UI Toast
              </button>
            </div>
          </section>

          <section className="rounded-xl border border-[rgba(229,231,235,1)] bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-2xl font-semibold text-[rgba(17,24,39,1)]">
              Confirmation Toast (2-Action)
            </h2>
            <button
              onClick={showConfirmationToast}
              className="w-full max-w-md rounded-lg px-6 py-3 text-left font-medium transition-colors bg-[rgba(139,92,246,1)] text-white hover:opacity-90"
            >
              Show "Accept / Decline" Toast
            </button>
          </section>

          <section className="rounded-xl border border-[rgba(229,231,235,1)] bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-2xl font-semibold text-[rgba(17,24,39,1)]">Duration Options</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <button
                onClick={() => addToast('info', 'Quick Toast', 'This will disappear in 2 seconds.', 2000)}
                className="rounded-lg bg-[rgba(243,244,246,1)] px-6 py-3 font-medium text-[rgba(55,65,81,1)] transition-colors hover:bg-gray-200"
              >
                2 seconds
              </button>
              <button
                onClick={() => addToast('info', 'Normal Toast', 'This will disappear in 5 seconds.', 5000)}
                className="rounded-lg bg-[rgba(243,244,246,1)] px-6 py-3 font-medium text-[rgba(55,65,81,1)] transition-colors hover:bg-gray-200"
              >
                5 seconds (default)
              </button>
              <button
                onClick={() => addToast('info', 'Persistent Toast', 'This will stay until manually closed.', 0)}
                className="rounded-lg bg-[rgba(243,244,246,1)] px-6 py-3 font-medium text-[rgba(55,65,81,1)] transition-colors hover:bg-gray-200"
              >
                Persistent (no auto-close)
              </button>
            </div>
          </section>

          <section className="rounded-xl border border-[rgba(229,231,235,1)] bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-2xl font-semibold text-[rgba(17,24,39,1)]">Actions</h2>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => {
                  addToast('success', 'Toast 1', 'First notification');
                  setTimeout(() => addToast('info', 'Toast 2', 'Second notification'), 500);
                  setTimeout(() => addToast('warning', 'Toast 3', 'Third notification'), 1000);
                }}
                className="rounded-lg bg-[rgba(59,130,246,1)] px-6 py-3 font-medium text-white transition-colors hover:opacity-90"
              >
                Show Multiple Toasts
              </button>
              <button
                onClick={() => clearAllToasts()}
                className="rounded-lg bg-[rgba(239,68,68,1)] px-6 py-3 font-medium text-white transition-colors hover:opacity-90"
              >
                Clear All Toasts
              </button>
              <div className="rounded-lg bg-[rgba(243,244,246,1)] px-4 py-3 text-[rgba(107,114,128,1)]">
                Active Toasts: {toasts.length}
              </div>
            </div>
          </section>
        </div>
      </div>

      <ToastContainer toasts={toasts} position={position} onClose={removeToast} />
    </div>
  );
}
