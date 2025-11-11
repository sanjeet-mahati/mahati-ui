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

// ===============================
// Types
// ===============================
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
  duration?: number;
  actions?: ToastAction[];
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

  const getToastStyles = () => {
    switch (toast.type) {
      case 'success':
        return {
          borderColor: 'rgba(34,197,94,1)',
          backgroundColor: 'rgba(240,253,244,1)',
          iconColor: 'rgba(34,197,94,1)',
          Icon: CheckCircleIcon,
        };
      case 'error':
        return {
          borderColor: 'rgba(239,68,68,1)',
          backgroundColor: 'rgba(254,242,242,1)',
          iconColor: 'rgba(239,68,68,1)',
          Icon: XCircleIcon,
        };
      case 'warning':
        return {
          borderColor: 'rgba(234,179,8,1)',
          backgroundColor: 'rgba(254,252,232,1)',
          iconColor: 'rgba(234,179,8,1)',
          Icon: ExclamationTriangleIcon,
        };
      case 'info':
        return {
          borderColor: 'rgba(59,130,246,1)',
          backgroundColor: 'rgba(239,246,255,1)',
          iconColor: 'rgba(59,130,246,1)',
          Icon: InformationCircleIcon,
        };
      case 'action':
        return {
          borderColor: 'rgba(139,92,246,1)',
          backgroundColor: 'rgba(245,243,255,1)',
          iconColor: 'rgba(139,92,246,1)',
          Icon: QuestionMarkCircleIcon,
        };
      case 'liquidUI':
        return {
          borderColor: 'rgba(178,185,182,0.4)',
          backgroundColor: 'rgba(240,253,244,1)',
          iconColor: 'rgba(178,185,182,0.4)',
          Icon: CheckCircleIcon,
        };
      default:
        return {
          borderColor: 'rgba(209,213,219,1)',
          backgroundColor: 'rgba(255,255,255,1)',
          iconColor: 'rgba(71,85,105,1)',
          Icon: InformationCircleIcon,
        };
    }
  };

  const styles = getToastStyles();
  const Icon = styles.Icon;
  const progressPct =
    toast.duration && toast.duration > 0 ? Math.min(100, (elapsed / toast.duration) * 100) : 0;
  const hasActions = !!(toast.actions && toast.actions.length > 0);

  const toastContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    borderRadius: '8px',
    border: `1px solid ${styles.borderColor}`,
    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
    transition: 'all 0.3s ease',
    backgroundColor: styles.backgroundColor,
    minWidth: '320px',
    maxWidth: '420px',
    opacity: isExiting ? 0 : 1,
    transform: isExiting ? 'translateX(100%)' : 'translateX(0)',
  };

  const contentStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '16px',
  };

  const iconWrapperStyle: React.CSSProperties = {
    display: 'flex',
    height: '32px',
    width: '32px',
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    backgroundColor: 'white',
    color: styles.iconColor,
  };

  const textWrapperStyle: React.CSSProperties = {
    minWidth: 0,
    flex: 1,
  };

  const titleStyle: React.CSSProperties = {
    marginBottom: '4px',
    fontSize: '14px',
    fontWeight: 600,
    color: 'rgba(17,24,39,1)',
  };

  const messageStyle: React.CSSProperties = {
    fontSize: '14px',
    color: 'rgba(107,114,128,1)',
  };

  const closeButtonStyle: React.CSSProperties = {
    flexShrink: 0,
    borderRadius: '4px',
    padding: '4px',
    color: 'rgba(107,114,128,1)',
    transition: 'background-color 0.2s',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
  };

  const actionsWrapperStyle: React.CSSProperties = {
    display: 'flex',
    gap: '8px',
    padding: '0 16px 16px',
  };

  const primaryButtonStyle: React.CSSProperties = {
    flex: 1,
    borderRadius: '8px',
    backgroundColor: 'rgba(17,24,39,1)',
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: 500,
    color: 'white',
    transition: 'background-color 0.2s',
    border: 'none',
    cursor: 'pointer',
  };

  const secondaryButtonStyle: React.CSSProperties = {
    flex: 1,
    borderRadius: '8px',
    border: '1px solid rgba(209,213,219,1)',
    backgroundColor: 'white',
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: 500,
    color: 'rgba(71,85,105,1)',
    transition: 'background-color 0.2s',
    cursor: 'pointer',
  };

  const progressBarContainerStyle: React.CSSProperties = {
    height: '4px',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.05)',
  };

  const progressBarStyle: React.CSSProperties = {
    height: '100%',
    transition: 'width 0.1s',
    width: `${progressPct}%`,
    backgroundColor: styles.iconColor,
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={toastContainerStyle}
      role="status"
      aria-live="polite"
    >
      <div style={contentStyle}>
        <div style={iconWrapperStyle}>
          <Icon style={{ height: '20px', width: '20px' }} />
        </div>

        <div style={textWrapperStyle}>
          <h4 style={titleStyle}>{toast.title}</h4>
          <p style={messageStyle}>{toast.message}</p>
        </div>

        {!hasActions && (
          <button
            onClick={handleClose}
            style={closeButtonStyle}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            aria-label="Close"
          >
            <XMarkIcon style={{ height: '16px', width: '16px' }} />
          </button>
        )}
      </div>

      {hasActions && (
        <div style={actionsWrapperStyle}>
          {toast.actions![0] && (
            <button
              onClick={() => handleAction(toast.actions![0].onClick)}
              style={primaryButtonStyle}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(31,41,55,1)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(17,24,39,1)')}
            >
              {toast.actions![0].label}
            </button>
          )}
          {toast.actions![1] && (
            <button
              onClick={() => handleAction(toast.actions![1].onClick)}
              style={secondaryButtonStyle}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(249,250,251,1)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'white')}
            >
              {toast.actions![1].label}
            </button>
          )}
        </div>
      )}

      {(toast.duration ?? 0) > 0 && !hasActions && (
        <div style={progressBarContainerStyle}>
          <div style={progressBarStyle} aria-hidden />
        </div>
      )}
    </div>
  );
};

// ===============================
// Toast Container
// ===============================
interface ToastContainerProps {
  toasts: Toast[];
  position: ToastPosition;
  onClose: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, position, onClose }) => {
  const getPositionStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      position: 'fixed',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      pointerEvents: 'none',
    };

    switch (position) {
      case 'top-left':
        return { ...baseStyle, top: '20px', left: '20px' };
      case 'top-center':
        return { ...baseStyle, top: '20px', left: '50%', transform: 'translateX(-50%)' };
      case 'top-right':
        return { ...baseStyle, top: '20px', right: '20px' };
      case 'bottom-left':
        return { ...baseStyle, bottom: '20px', left: '20px' };
      case 'bottom-center':
        return { ...baseStyle, bottom: '20px', left: '50%', transform: 'translateX(-50%)' };
      case 'bottom-right':
        return { ...baseStyle, bottom: '20px', right: '20px' };
      default:
        return { ...baseStyle, top: '20px', right: '20px' };
    }
  };

  return (
    <div style={getPositionStyle()}>
      {toasts.map((t) => (
        <div key={t.id} style={{ pointerEvents: 'auto' }}>
          <ToastItem toast={t} onClose={onClose} />
        </div>
      ))}
    </div>
  );
};

// ===============================
// Demo
// ===============================
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
      { label: 'Accept', onClick: () => addToast('success', 'Invitation Accepted', 'You have joined the workspace.', 3000) },
      { label: 'Decline', onClick: () => addToast('error', 'Invitation Declined', 'You have declined the invitation.', 3000) },
    ]);
  };

  const pageStyle: React.CSSProperties = {
    minHeight: '100vh',
    padding: '32px',
    background: 'linear-gradient(to bottom right, rgba(249,250,251,1), rgba(243,244,246,1))',
  };

  const containerStyle: React.CSSProperties = {
    margin: '0 auto',
    maxWidth: '1152px',
  };

  const headingStyle: React.CSSProperties = {
    marginBottom: '8px',
    fontSize: '36px',
    fontWeight: 'bold',
    color: 'rgba(17,24,39,1)',
  };

  const subtitleStyle: React.CSSProperties = {
    marginBottom: '48px',
    color: 'rgba(107,114,128,1)',
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gap: '32px',
  };

  const sectionStyle: React.CSSProperties = {
    borderRadius: '12px',
    border: '1px solid rgba(229,231,235,1)',
    backgroundColor: 'white',
    padding: '24px',
    boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)',
  };

  const sectionTitleStyle: React.CSSProperties = {
    marginBottom: '24px',
    fontSize: '24px',
    fontWeight: 600,
    color: 'rgba(17,24,39,1)',
  };

  const positionGridStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
  };

  const getPositionButtonStyle = (isActive: boolean): React.CSSProperties => ({
    borderRadius: '8px',
    padding: '8px 16px',
    fontWeight: 500,
    transition: 'all 0.2s',
    backgroundColor: isActive ? 'rgba(34, 78, 150, 1)' : 'rgba(243,244,246,1)',
    color: isActive ? 'white' : 'rgba(55,65,81,1)',
    border: 'none',
    cursor: 'pointer',
  });

  const toastTypeColumnStyle: React.CSSProperties = {
    display: 'flex',
    maxWidth: '448px',
    flexDirection: 'column',
    gap: '12px',
  };

  const getToastButtonStyle = (bgColor: string, textColor: string = 'white'): React.CSSProperties => ({
    padding: '12px 24px',
    textAlign: 'left',
    transition: 'opacity 0.2s',
    borderRadius: '8px',
    backgroundColor: bgColor,
    color: textColor,
    border: 'none',
    cursor: 'pointer',
  });

  const durationGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
  };

  const durationButtonStyle: React.CSSProperties = {
    borderRadius: '8px',
    backgroundColor: 'rgba(243,244,246,1)',
    padding: '12px 24px',
    fontWeight: 500,
    color: 'rgba(55,65,81,1)',
    transition: 'background-color 0.2s',
    border: 'none',
    cursor: 'pointer',
  };

  const actionsWrapperStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
  };

  const actionButtonStyle = (bgColor: string): React.CSSProperties => ({
    borderRadius: '8px',
    backgroundColor: bgColor,
    padding: '12px 24px',
    fontWeight: 500,
    color: 'white',
    transition: 'opacity 0.2s',
    border: 'none',
    cursor: 'pointer',
  });

  const toastCountStyle: React.CSSProperties = {
    borderRadius: '8px',
    backgroundColor: 'rgba(243,244,246,1)',
    padding: '12px 16px',
    color: 'rgba(107,114,128,1)',
  };

  return (
    <></>
    // <div style={pageStyle}>
    //   <div style={containerStyle}>
    //     <h1 style={headingStyle}>Toast Notification Demo</h1>
    //     <p style={subtitleStyle}>
    //       Customizable toast notifications with TypeScript and inline CSS
    //     </p>

    //     <div style={gridStyle}>
    //       {/* Position control */}
    //       <section style={sectionStyle}>
    //         <h2 style={sectionTitleStyle}>Toast Position</h2>
    //         <div style={positionGridStyle}>
    //           {(['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'] as ToastPosition[]).map(
    //             (pos) => (
    //               <button
    //                 key={pos}
    //                 onClick={() => setPosition(pos)}
    //                 style={getPositionButtonStyle(position === pos)}
    //               >
    //                 {pos.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
    //               </button>
    //             )
    //           )}
    //         </div>
    //       </section>

    //       {/* Toast Type Examples */}
    //       <section style={sectionStyle}>
    //         <h2 style={sectionTitleStyle}>Toast Types</h2>
    //         <div style={toastTypeColumnStyle}>
    //           <button
    //             onClick={() => addToast('success', 'Success!', 'Your changes have been saved successfully.')}
    //             style={getToastButtonStyle('rgba(22,163,74,1)')}
    //           >
    //             Show Success Toast
    //           </button>
    //           <button
    //             onClick={() => addToast('error', 'Error!', 'Something went wrong. Please try again.')}
    //             style={getToastButtonStyle('rgba(239,68,68,1)')}
    //           >
    //             Show Error Toast
    //           </button>
    //           <button
    //             onClick={() => addToast('warning', 'Warning!', 'Please review your information before proceeding.')}
    //             style={getToastButtonStyle('rgba(234,179,8,1)')}
    //           >
    //             Show Warning Toast
    //           </button>
    //           <button
    //             onClick={() => addToast('info', 'Information', 'Here is some helpful information for you.')}
    //             style={getToastButtonStyle('rgba(59,130,246,1)')}
    //           >
    //             Show Info Toast
    //           </button>
    //           <button
    //             onClick={() => addToast('liquidUI', 'Liquid UI!', 'You are seeing sample Liquid UI toast.')}
    //             style={getToastButtonStyle('rgba(178,185,182,0.4)', 'black')}
    //           >
    //             Show Liquid UI Toast
    //           </button>
    //         </div>
    //       </section>

    //       {/* Confirmation Toast (2-Action) */}
    //       <section style={sectionStyle}>
    //         <h2 style={sectionTitleStyle}>Confirmation Toast (2-Action)</h2>
    //         <button
    //           onClick={showConfirmationToast}
    //           style={actionButtonStyle('rgba(139,92,246,1)')}
    //         >
    //           Show "Accept / Decline" Toast
    //         </button>
    //       </section>

    //       {/* Duration Options */}
    //       <section style={sectionStyle}>
    //         <h2 style={sectionTitleStyle}>Duration Options</h2>
    //         <div style={durationGridStyle}>
    //           <button
    //             onClick={() => addToast('info', 'Quick Toast', 'This will disappear in 2 seconds.', 2000)}
    //             style={durationButtonStyle}
    //           >
    //             2 seconds
    //           </button>
    //           <button
    //             onClick={() => addToast('info', 'Normal Toast', 'This will disappear in 5 seconds.', 5000)}
    //             style={durationButtonStyle}
    //           >
    //             5 seconds (default)
    //           </button>
    //           <button
    //             onClick={() => addToast('info', 'Persistent Toast', 'This will stay until manually closed.', 0)}
    //             style={durationButtonStyle}
    //           >
    //             Persistent (no auto-close)
    //           </button>
    //         </div>
    //       </section>

    //       {/* Actions */}
    //       <section style={sectionStyle}>
    //         <h2 style={sectionTitleStyle}>Actions</h2>
    //         <div style={actionsWrapperStyle}>
    //           <button
    //             onClick={() => {
    //               addToast('success', 'Toast 1', 'First notification');
    //               setTimeout(() => addToast('info', 'Toast 2', 'Second notification'), 500);
    //               setTimeout(() => addToast('warning', 'Toast 3', 'Third notification'), 1000);
    //             }}
    //             style={actionButtonStyle('rgba(59,130,246,1)')}
    //           >
    //             Show Multiple Toasts
    //           </button>
    //           <button
    //             onClick={() => clearAllToasts()}
    //             style={actionButtonStyle('rgba(239,68,68,1)')}
    //           >
    //             Clear All Toasts
    //           </button>
    //           <div style={toastCountStyle}>
    //             Active Toasts: {toasts.length}
    //           </div>
    //         </div>
    //       </section>
    //     </div>
    //   </div>

    //   <ToastContainer toasts={toasts} position={position} onClose={removeToast} />
    // </div>
  );
}