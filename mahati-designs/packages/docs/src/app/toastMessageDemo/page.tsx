'use client';

import React, { useState } from 'react';
import {
  CheckCircleIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/solid';

import { CodePreview } from '../CodePreview';
import { MahatiToastMessage } from '@/components';

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
  colorStripGradientStart?: string;
  colorStripGradientEnd?: string;
  titleColor?: string;
  subtitleColor?: string;
  colorStripPosition?: 'left' | 'right';
  colorStripSpacing?: number;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>> | string;
  iconColor?: string;
  showCloseIcon?: boolean;
  closeIconColor?: string;
  closeIconImage?: string;
  closeIconBackgroundColor?: string;
  backgroundGradientStart?: string;
  backgroundGradientEnd?: string;
  textColor?: string;
  messageColor?: string;
  showColorStripOnGradient?: boolean;
  colorStripOnGradientStart?: string;
  colorStripOnGradientEnd?: string;
  colorStripOnGradientPosition?: 'left' | 'right';
  colorStripOnGradientSpacing?: number;
}

interface CustomToastButtonProps {
  title: string;
  subtitle: string;
  colorStripGradientStart?: string;
  colorStripGradientEnd?: string;
  titleColor?: string;
  subtitleColor?: string;
  colorStripPosition?: 'left' | 'right';
  colorStripSpacing?: number;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>> | string;
  iconColor?: string;
  showCloseIcon?: boolean;
  closeIconColor?: string;
  closeIconImage?: string;
  closeIconBackgroundColor?: string;
  onClose?: () => void;
  onClick: () => void;
}

const CustomToastButton: React.FC<CustomToastButtonProps> = ({
  title,
  subtitle,
  colorStripGradientStart = 'rgba(245, 158, 11, 1)',
  colorStripGradientEnd = 'rgba(255, 191, 92, 1)',
  titleColor = 'rgba(245, 158, 11, 1)',
  subtitleColor = 'rgba(85, 85, 85, 1)',
  colorStripPosition = 'left',
  colorStripSpacing = 0,
  icon,
  iconColor,
  showCloseIcon = false,
  closeIconColor = 'rgba(107, 114, 128, 1)',
  closeIconImage,
  closeIconBackgroundColor,
  onClose,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="relative overflow-hidden cursor-pointer w-[325px] h-[70px] rounded-[12px] bg-white shadow-[0px_4px_12px_0px_rgba(0,0,0,0.08)] transition-all duration-200 hover:shadow-[0px_6px_16px_0px_rgba(0,0,0,0.12)] hover:scale-[0.98] flex items-center"
    >
      <div
        className={`absolute top-0 w-[5px] h-[70px] ${
          colorStripPosition === 'left' ? 'rounded-l-[12px]' : 'rounded-r-[12px]'
        }`}
        style={{
          background: `linear-gradient(90deg, ${colorStripGradientStart} 22.5%, ${colorStripGradientEnd} 130%)`,
          [colorStripPosition === 'left' ? 'left' : 'right']: `${colorStripSpacing}px`,
        }}
      />

      {icon && (
        <div className="absolute left-[33px] top-1/2 -translate-y-1/2 w-[32px] h-[32px] flex items-center justify-center">
          {typeof icon === 'string' ? (
            <img src={icon} alt="icon" className="w-[32px] h-[32px] object-contain block" />
          ) : (
            React.createElement(icon, {
              className: 'w-[32px] h-[32px]',
              style: { color: iconColor || titleColor },
            })
          )}
        </div>
      )}

      <div
        className={`absolute top-1/2 -translate-y-1/2 flex flex-col gap-[2px] ${
          icon ? 'left-[80px]' : 'left-[24px]'
        } ${showCloseIcon ? 'right-[60px]' : 'right-[24px]'}`}
      >
        <h3
          className="font-[Poppins] text-[16px] font-semibold leading-normal m-0 p-0"
          style={{ color: titleColor }}
        >
          {title}
        </h3>
        <p
          className="font-[Poppins] text-[10px] font-normal leading-normal m-0 p-0"
          style={{ color: subtitleColor }}
        >
          {subtitle}
        </p>
      </div>

      {showCloseIcon && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose?.();
          }}
          className="absolute right-[33px] top-1/2 -translate-y-1/2 w-[20px] h-[20px] p-0 border-0 rounded-full flex items-center justify-center transition-opacity duration-200 hover:opacity-70"
          style={{
            backgroundColor: closeIconBackgroundColor || 'transparent',
          }}
          aria-label="Close"
        >
          {closeIconImage ? (
            <img 
              src={closeIconImage} 
              alt="close" 
              className="w-[7px] h-[7px] object-contain block" 
              style={{
                filter: closeIconColor && closeIconColor !== 'rgba(107, 114, 128, 1)' 
                  ? `brightness(0) saturate(100%) invert(${closeIconColor === 'rgba(255, 255, 255, 1)' || closeIconColor === 'white' ? '1' : '0'})` 
                  : undefined
              }}
            />
          ) : (
            <svg className="w-[7px] h-[7px]" fill="none" viewBox="0 0 24 24" stroke={closeIconColor}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </button>
      )}
    </div>
  );
};

export default function ToastMessageDemo() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [position, setPosition] = useState<ToastPosition>('top-right');

  const addToast = (
    type: ToastType,
    title: string,
    message: string,
    duration?: number,
    actions?: ToastAction[],
    customOptions?: Partial<Toast>
  ) => {
    const newToast: Toast = {
      id: `${Date.now()}-${Math.random()}`,
      type,
      title,
      message,
      duration,
      actions,
      ...customOptions,
    };
    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));
  const clearAllToasts = () => setToasts([]);

  const showConfirmationToast = () => {
    addToast('action', 'Accept Invite?', "You've been invited to the project workspace.", undefined, [
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
        <h1 className="mb-2 text-4xl font-bold text-[rgba(17,24,39,1)]">Toast Message Demo</h1>

        <div className="grid gap-8">
          <CodePreview
            title="Toast Position"
            preview={
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
            }
            code={`const [position, setPosition] = useState<ToastPosition>('top-right');

<ToastMessage toasts={toasts} position={position} onClose={removeToast} />`}
          />

          {/* Custom Styled Toasts */}
          <CodePreview
            title="Custom Styled Toast Notifications"
            preview={
              <div className="flex flex-col gap-6">
                <div className="flex justify-center">
                  <CustomToastButton
                    title="Warning"
                    subtitle="Warning message description"
                    icon="/icons/danger (1) 1.png"
                    colorStripGradientStart="rgba(245, 158, 11, 1)"
                    colorStripGradientEnd="rgba(255, 191, 92, 1)"
                    titleColor="rgba(245, 158, 11, 1)"
                    colorStripPosition="left"
                    colorStripSpacing={5}
                    showCloseIcon={true}
                    closeIconImage="/icons/close copy 1.png"
                    // closeIconColor="rgba(17, 1, 1, 1)"
                    onClick={() =>
                      addToast('warning', 'Warning', 'Warning message description', undefined, undefined, {
                        backgroundGradientStart: 'rgba(245, 158, 11, 1)',
                        backgroundGradientEnd: 'rgba(255, 191, 92, 1)',
                        textColor: 'rgba(255, 255, 255, 1)',
                        messageColor: 'rgba(255, 255, 255, 1)',
                        icon: '/icons/danger 1.png',
                        showColorStripOnGradient: true,
                        colorStripOnGradientStart: 'rgba(245, 158, 11, 1)',
                        colorStripOnGradientEnd: 'rgba(255, 191, 92, 1)',
                        colorStripOnGradientPosition: 'left',
                        colorStripOnGradientSpacing: 10,
                        showCloseIcon: true,
                        closeIconImage: '/icons/close copy 1.png',
                        closeIconColor: 'rgba(255, 255, 255, 1)',
                      })
                    }
                  />
                </div>

                <div className="flex justify-center">
                  <CustomToastButton
                    title="Success"
                    subtitle=" "
                    icon="/icons/check-mark 2.png"
                    colorStripGradientStart="rgba(34, 197, 94, 1)"
                    colorStripGradientEnd="rgba(74, 222, 128, 1)"
                    titleColor="rgba(34, 197, 94, 1)"
                    colorStripPosition="left"
                    colorStripSpacing={5}
                    showCloseIcon={true}
                    closeIconImage="/icons/close copy 1.png"
                    onClick={() =>
                      addToast('success', 'Success!', ' ', undefined, undefined, {
                        backgroundGradientStart: 'rgba(34, 197, 94, 1)',
                        backgroundGradientEnd: 'rgba(74, 222, 128, 1)',
                        textColor: 'rgba(255, 255, 255, 1)',
                        messageColor: 'rgba(255, 255, 255, 1)',
                        icon: '/icons/check-mark 1.png',
                        showColorStripOnGradient: true,
                        colorStripOnGradientStart: 'rgba(40, 167, 69, 1)',
                        colorStripOnGradientEnd: 'rgba(58, 208, 125, 1)',
                        colorStripOnGradientPosition: 'left',
                        colorStripOnGradientSpacing: 10,
                        showCloseIcon: true,
                        closeIconImage: '/icons/close copy 1.png',
                        closeIconColor: 'rgba(255, 255, 255, 1)',
                      })
                    }
                  />
                </div>

                <div className="flex justify-center">
                  <CustomToastButton
                    title="Error"
                    subtitle="Error message description"
                    icon="/icons/danger 2.png"
                    colorStripGradientStart="rgba(220, 53, 69, 1)"
                    colorStripGradientEnd="rgba(183, 28, 28, 1)"
                    titleColor="rgba(239, 68, 68, 1)"
                    colorStripPosition="left"
                    colorStripSpacing={5}
                    showCloseIcon={true}
                    closeIconImage="/icons/close copy 1.png"
                    onClick={() =>
                      addToast('error', 'Error', 'Error message description', undefined, undefined, {
                        backgroundGradientStart: 'rgba(220, 53, 69, 1)',
                        backgroundGradientEnd: 'rgba(183, 28, 28, 1)',
                        textColor: 'rgba(255, 255, 255, 1)',
                        messageColor: 'rgba(255, 255, 255, 1)',
                        icon: '/icons/danger 1.png',
                        showColorStripOnGradient: true,
                        colorStripOnGradientStart: 'rgba(220, 53, 69, 1)',
                        colorStripOnGradientEnd: 'rgba(183, 28, 28, 1)',
                        titleColor: 'rgba(239, 68, 68, 1)',
                        colorStripOnGradientPosition: 'left',
                        colorStripOnGradientSpacing: 10,
                        showCloseIcon: true,
                        closeIconImage: '/icons/close copy 1.png',
                        closeIconColor: 'rgba(255, 255, 255, 1)',

                      })
                    }
                  />
                </div>

                <div className="flex justify-center">
                  <CustomToastButton
                    title="Notification"
                    subtitle=" "
                    icon="/icons/notification 2.png"
                    colorStripGradientStart="rgba(23, 97, 163, 1)"
                    colorStripGradientEnd="rgba(77, 175, 131, 1)"
                    titleColor="rgba(59, 130, 246, 1)"
                    colorStripPosition="left"
                    colorStripSpacing={5}
                    showCloseIcon={true}
                    closeIconImage="/icons/close copy 1.png"
                    onClick={() =>
                      addToast('info', 'Notification', ' ', undefined, undefined, {
                        backgroundGradientStart: 'rgba(23, 97, 163, 1)',
                        backgroundGradientEnd: 'rgba(77, 175, 131, 1)',
                        textColor: 'rgba(255, 255, 255, 1)',
                        messageColor: 'rgba(255, 255, 255, 1)',
                        icon: '/icons/notification 1.png',
                        showColorStripOnGradient: true,
                        colorStripOnGradientStart: 'rgba(23, 97, 163, 1)',
                        colorStripOnGradientEnd: 'rgba(77, 175, 131, 1)',
                        colorStripOnGradientPosition: 'left',
                        colorStripOnGradientSpacing: 10,
                        showCloseIcon: true,
                        closeIconImage: '/icons/close copy 1.png',
                        closeIconColor: 'rgba(255, 255, 255, 1)',

                      })
                    }
                  />
                </div>

                <div className="flex justify-center">
                  <CustomToastButton
                    title="Button with Icon"
                    subtitle="Sample button with icon and color strip at right edge"
                    icon={XCircleIcon}
                    colorStripGradientStart="rgba(239, 68, 68, 1)"
                    colorStripGradientEnd="rgba(248, 113, 113, 1)"
                    titleColor="rgba(239, 68, 68, 1)"
                    subtitleColor="rgba(85, 85, 85, 1)"
                    colorStripPosition="right"
                    colorStripSpacing={5}
                    showCloseIcon={true}
                    onClick={() =>
                      addToast('error', 'Error', 'Something went wrong. Please try again.', undefined, undefined, {
                        colorStripGradientStart: 'rgba(239, 68, 68, 1)',
                        colorStripGradientEnd: 'rgba(248, 113, 113, 1)',
                        titleColor: 'rgba(239, 68, 68, 1)',
                        subtitleColor: 'rgba(85, 85, 85, 1)',
                        colorStripPosition: 'left',
                        colorStripSpacing: 5,
                        // icon: XCircleIcon,
                        showCloseIcon: true,
                        closeIconColor: 'rgba(239, 68, 68, 1)',
                        closeIconImage: '/icons/close copy 1.png',
                      })
                    }
                  />
                </div>

                <div className="flex justify-center">
                  <CustomToastButton
                    title="Custom Button"
                    subtitle="With custom image icon and custom colors and no space between color strip and edge"
                    icon="/icons/check-mark 2.png"
                    colorStripGradientStart="rgba(59, 130, 246, 1)"
                    colorStripGradientEnd="rgba(96, 165, 250, 1)"
                    titleColor="rgba(59, 130, 246, 1)"
                    colorStripPosition="left"
                    // colorStripSpacing={5}
                    showCloseIcon={true}
                    closeIconImage="/icons/close copy 1.png"
                    onClick={() =>
                      addToast('info', 'Notification', 'You have a new message!', undefined, undefined, {
                        colorStripGradientStart: 'rgba(59, 130, 246, 1)',
                        colorStripGradientEnd: 'rgba(96, 165, 250, 1)',
                        titleColor: 'rgba(59, 130, 246, 1)',
                        subtitleColor: 'rgba(85, 85, 85, 1)',
                        colorStripPosition: 'left',
                        colorStripSpacing: 5,
                        // icon: '/icons/check-mark 2.png',
                        showCloseIcon: true,
                        closeIconImage: '/icons/close copy 1.png',
                      })
                    }
                  />
                </div>
              </div>
            }
            code={`addToast('info','Notification','Message!', undefined, undefined, {
  icon: '/icons/check-mark 2.png',
  showCloseIcon: true,
  closeIconImage: '/icons/close copy 1.png',
  colorStripSpacing: 5,
});`}
          />

          {/* Default Toast Types */}
          <CodePreview
            title="Original Toast Types"
            preview={
              <div className="grid gap-3 max-w-md">
                <button
                  onClick={() => addToast('success', 'Success!', 'Your changes have been saved successfully.')}
                  className="px-6 py-3 text-left transition-colors bg-[rgba(22,163,74,1)] text-white hover:opacity-90 rounded"
                >
                  Show Success Toast (No Timer)
                </button>

                <button
                  onClick={() => addToast('error', 'Error!', 'Something went wrong. Please try again.')}
                  className="px-6 py-3 text-left transition-colors rounded-sm bg-[rgba(239,68,68,1)] text-white hover:opacity-90"
                >
                  Show Error Toast (No Timer)
                </button>

                <button
                  onClick={() => addToast('warning', 'Warning!', 'Please review your information before proceeding.')}
                  className="px-6 py-3 text-left transition-colors rounded-md bg-[rgba(234,179,8,1)] text-white hover:opacity-90"
                >
                  Show Warning Toast (No Timer)
                </button>

                <button
                  onClick={() => addToast('info', 'Information', 'Here is some helpful information for you.')}
                  className="px-6 py-3 text-left transition-colors rounded-lg bg-[rgba(59,130,246,1)] text-white hover:opacity-90"
                >
                  Show Info Toast (No Timer)
                </button>

                <button
                  onClick={() => addToast('liquidUI', 'Liquid UI!', 'You are seeing sample Liquid UI toast.')}
                  className="px-6 py-3 text-center transition-colors rounded-xl bg-[rgba(178,185,182,0.4)] text-black hover:opacity-90"
                >
                  Show Liquid UI Toast (No Timer)
                </button>
              </div>
            }
            code={`addToast('success','Success!','Your changes have been saved.');
addToast('error','Error!','Something went wrong.');
addToast('warning','Warning!','Please review your information.');
addToast('info','Information','Here is some info.');
addToast('liquidUI','Liquid UI!','Sample toast.');`}
          />

          {/* Confirmation Toast */}
          <CodePreview
            title='Confirmation Toast ("Accept / Decline")'
            preview={
              <button
                onClick={showConfirmationToast}
                className="w-full max-w-md rounded-lg px-6 py-3 text-left font-medium transition-colors bg-[rgba(139,92,246,1)] text-white hover:opacity-90"
              >
                Show "Accept / Decline" Toast (No Timer)
              </button>
            }
            code={`addToast('action','Accept Invite?', "You've been invited...", undefined, [
  { label: 'Accept', onClick: () => addToast('success','Accepted','Joined.', 3000) },
  { label: 'Decline', onClick: () => addToast('error','Declined','Declined.', 3000) },
]);`}
          />

          {/* Duration Options */}
          <CodePreview
            title="Duration Options"
            preview={
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
                  5 seconds
                </button>
                <button
                  onClick={() => addToast('info', 'Persistent Toast', 'This will stay until manually closed.')}
                  className="rounded-lg bg-[rgba(243,244,246,1)] px-6 py-3 font-medium text-[rgba(55,65,81,1)] transition-colors hover:bg-gray-200"
                >
                  No Timer (Default)
                </button>
              </div>
            }
            code={`addToast('info','Quick Toast','Auto-dismiss 2s', 2000);
addToast('info','Normal Toast','Auto-dismiss 5s', 5000);
addToast('info','Persistent','No duration = persistent');`}
          />

          {/* Actions */}
          <CodePreview
            title="Actions"
            preview={
              <div className="flex flex-wrap gap-4 items-center">
                <button
                  onClick={() => {
                    addToast('warning', 'Warning', 'Warning message description', undefined, undefined, {
                        backgroundGradientStart: 'rgba(245, 158, 11, 1)',
                        backgroundGradientEnd: 'rgba(255, 191, 92, 1)',
                        textColor: 'rgba(255, 255, 255, 1)',
                        messageColor: 'rgba(255, 255, 255, 1)',
                        icon: '/icons/danger 1.png',
                        showColorStripOnGradient: true,
                        colorStripOnGradientStart: 'rgba(245, 158, 11, 1)',
                        colorStripOnGradientEnd: 'rgba(255, 191, 92, 1)',
                        colorStripOnGradientPosition: 'left',
                        colorStripOnGradientSpacing: 10,
                        showCloseIcon: true,
                        closeIconImage: '/icons/close copy 1.png',
                        closeIconColor: 'rgba(255, 255, 255, 1)',
                      })

                    addToast('success', 'Success!', ' ', undefined, undefined, {
                        backgroundGradientStart: 'rgba(34, 197, 94, 1)',
                        backgroundGradientEnd: 'rgba(74, 222, 128, 1)',
                        textColor: 'rgba(255, 255, 255, 1)',
                        messageColor: 'rgba(255, 255, 255, 1)',
                        icon: '/icons/check-mark 1.png',
                        showColorStripOnGradient: true,
                        colorStripOnGradientStart: 'rgba(40, 167, 69, 1)',
                        colorStripOnGradientEnd: 'rgba(58, 208, 125, 1)',
                        colorStripOnGradientPosition: 'left',
                        colorStripOnGradientSpacing: 10,
                        showCloseIcon: true,
                        closeIconImage: '/icons/close copy 1.png',
                        closeIconColor: 'rgba(255, 255, 255, 1)',
                      })
                    addToast('error', 'Error', 'Error message description', undefined, undefined, {
                        backgroundGradientStart: 'rgba(220, 53, 69, 1)',
                        backgroundGradientEnd: 'rgba(183, 28, 28, 1)',
                        textColor: 'rgba(255, 255, 255, 1)',
                        messageColor: 'rgba(255, 255, 255, 1)',
                        icon: '/icons/danger 1.png',
                        showColorStripOnGradient: true,
                        colorStripOnGradientStart: 'rgba(220, 53, 69, 1)',
                        colorStripOnGradientEnd: 'rgba(183, 28, 28, 1)',
                        titleColor: 'rgba(239, 68, 68, 1)',
                        colorStripOnGradientPosition: 'left',
                        colorStripOnGradientSpacing: 10,
                        showCloseIcon: true,
                        closeIconImage: '/icons/close copy 1.png',
                        closeIconColor: 'rgba(255, 255, 255, 1)',
                      })

                    addToast('info', 'Notification', ' ', undefined, undefined, {
                        backgroundGradientStart: 'rgba(23, 97, 163, 1)',
                        backgroundGradientEnd: 'rgba(77, 175, 131, 1)',
                        textColor: 'rgba(255, 255, 255, 1)',
                        messageColor: 'rgba(255, 255, 255, 1)',
                        icon: '/icons/notification 1.png',
                        showColorStripOnGradient: true,
                        colorStripOnGradientStart: 'rgba(23, 97, 163, 1)',
                        colorStripOnGradientEnd: 'rgba(77, 175, 131, 1)',
                        colorStripOnGradientPosition: 'left',
                        colorStripOnGradientSpacing: 10,
                        showCloseIcon: true,
                        closeIconImage: '/icons/close copy 1.png',
                        closeIconColor: 'rgba(255, 255, 255, 1)',
                      })



                    addToast('success', 'Toast 1', 'First notification', 3000);
                    setTimeout(() => addToast('info', 'Toast 2', 'Second notification', 4000), 500);
                    setTimeout(() => addToast('warning', 'Toast 3', 'Third notification (persistent)'), 1000);
                  }}
                  className="rounded-lg bg-[rgba(59,130,246,1)] px-6 py-3 font-medium text-white transition-colors hover:opacity-90"
                >
                  Show Multiple Toasts
                </button>

                <button
                  onClick={clearAllToasts}
                  className="rounded-lg bg-[rgba(239,68,68,1)] px-6 py-3 font-medium text-white transition-colors hover:opacity-90"
                >
                  Clear All Toasts
                </button>

                <div className="rounded-lg bg-[rgba(243,244,246,1)] px-4 py-3 text-[rgba(107,114,128,1)]">
                  Active Toasts: {toasts.length}
                </div>
              </div>
            }
            code={`addToast('success','Toast 1','First notification', 3000);
setTimeout(() => addToast('info','Toast 2','Second', 4000), 500);
setTimeout(() => addToast('warning','Toast 3','Third'), 1000);

clearAllToasts();`}
          />
        </div>
      </div>

      {/* Global toast renderer */}
      <MahatiToastMessage toasts={toasts} position={position} onClose={removeToast} />
    </div>
  );
}