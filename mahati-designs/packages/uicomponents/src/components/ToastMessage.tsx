'use client';

import React, { useEffect, useMemo, useState } from 'react';
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

export interface ToastAction {
  label: string;
  onClick?: () => void;
}

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  duration?: number;
  actions?: ToastAction[];

  // Custom styling (white background + strip)
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

  // Background gradient (priority)
  backgroundGradientStart?: string;
  backgroundGradientEnd?: string;
  textColor?: string;
  messageColor?: string;

  // Strip on gradient background
  showColorStripOnGradient?: boolean;
  colorStripOnGradientStart?: string;
  colorStripOnGradientEnd?: string;
  colorStripOnGradientPosition?: 'left' | 'right';
  colorStripOnGradientSpacing?: number;
}

export interface ToastMessageProps {
  toasts: Toast[];
  position?: ToastPosition;
  onClose: (id: string) => void;
}

// ===============================
// Helpers (Tailwind-only mapping)
// ===============================

// Only the spacings used in your demos (0, 5, 10).
const SPACING_CLASS: Record<number, string> = {
  0: '0',
  5: '[5px]',
  10: '[10px]',
};

function edgeWithSpacing(side: 'left' | 'right', spacing?: number) {
  const s = typeof spacing === 'number' ? spacing : 0;
  const token = SPACING_CLASS[s] ?? SPACING_CLASS[0];
  return side === 'left' ? `left-${token}` : `right-${token}`;
}

function colorTextClass(color?: string, fallback: string) {
  if (!color) return fallback;
  // Tailwind arbitrary value text color
  return `text-[${color.replace(/\s+/g, '')}]`;
}

function gradientBgClass(start?: string, end?: string) {
  if (!start || !end) return '';
  return `bg-[linear-gradient(90deg,${start.replace(/\s+/g, '')}_0%,${end.replace(/\s+/g, '')}_100%)]`;
}

function stripGradientClass(start?: string, end?: string) {
  const a = (start ?? 'rgba(245,158,11,1)').replace(/\s+/g, '');
  const b = (end ?? 'rgba(255,191,92,1)').replace(/\s+/g, '');
  return `bg-[linear-gradient(90deg,${a}_22.5%,${b}_130%)]`;
}

const TailwindSafelist = () => (
  <div className="hidden">
    <div className="bg-[linear-gradient(90deg,rgba(34,197,94,1)_0%,rgba(74,222,128,1)_100%)]" />
    <div className="bg-[linear-gradient(90deg,rgba(245,158,11,1)_0%,rgba(255,191,92,1)_100%)]" />
    <div className="bg-[linear-gradient(90deg,rgba(59,130,246,1)_0%,rgba(96,165,250,1)_100%)]" />
    <div className="bg-[linear-gradient(90deg,rgba(220,53,69,1)_0%,rgba(183,28,28,1)_100%)]" />
    <div className="bg-[linear-gradient(90deg,rgba(23,97,163,1)_0%,rgba(77,175,131,1)_100%)]" />

    <div className="bg-[linear-gradient(90deg,rgba(34,197,94,1)_22.5%,rgba(74,222,128,1)_130%)]" />
    <div className="bg-[linear-gradient(90deg,rgba(245,158,11,1)_22.5%,rgba(255,191,92,1)_130%)]" />
    <div className="bg-[linear-gradient(90deg,rgba(59,130,246,1)_22.5%,rgba(96,165,250,1)_130%)]" />
    <div className="bg-[linear-gradient(90deg,rgba(58,208,125,1)_22.5%,rgba(40,167,69,1)_130%)]" />
    <div className="bg-[linear-gradient(90deg,rgba(40,167,69,1)_22.5%,rgba(58,208,125,1)_130%)]" />
    <div className="bg-[linear-gradient(90deg,rgba(220,53,69,1)_22.5%,rgba(183,28,28,1)_130%)]" />
    <div className="bg-[linear-gradient(90deg,rgba(239,68,68,1)_22.5%,rgba(248,113,113,1)_130%)]" />
    <div className="bg-[linear-gradient(90deg,rgba(23,97,163,1)_22.5%,rgba(77,175,131,1)_130%)]" />

    <div className="text-[rgba(34,197,94,1)] text-[rgba(74,222,128,1)] text-[rgba(245,158,11,1)] text-[rgba(255,191,92,1)] text-[rgba(59,130,246,1)] text-[rgba(96,165,250,1)] text-[rgba(239,68,68,1)] text-[rgba(248,113,113,1)] text-[rgba(17,24,39,1)] text-[rgba(55,65,81,1)] text-[rgba(85,85,85,1)] text-[rgba(107,114,128,1)] text-[rgba(178,185,182,0.4)] text-[rgba(255,255,255,1)] text-[rgba(220,53,69,1)] text-[rgba(183,28,28,1)]" />

    <div className="left-0 right-0 left-[5px] right-[5px] left-[10px] right-[10px]" />

    <div className="w-0 w-1/4 w-1/2 w-3/4 w-full" />
  </div>
);

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
  const finalIconColor = iconColor || titleColor;
  const showIcon = icon !== null && icon !== undefined;
  const isIconImage = typeof icon === 'string';

  const stripCls = stripGradientClass(colorStripGradientStart, colorStripGradientEnd);

  const titleCls = colorTextClass(titleColor, 'text-[rgba(245,158,11,1)]');
  const subCls = colorTextClass(subtitleColor, 'text-[rgba(85,85,85,1)]');
  const iconCls = colorTextClass(finalIconColor, titleCls);
  const closeCls = colorTextClass(closeIconColor, 'text-[rgba(107,114,128,1)]');

  const stripPos =
    colorStripPosition === 'left'
      ? ['left-0', edgeWithSpacing('left', colorStripSpacing), 'rounded-l-[12px]'].join(' ')
      : ['right-0', edgeWithSpacing('right', colorStripSpacing), 'rounded-r-[12px]'].join(' ');

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose?.();
  };

  return (
    <div
      onClick={onClick}
      className={[
        'relative overflow-hidden cursor-pointer',
        'w-[325px] h-[70px] rounded-[12px] bg-white',
        'shadow-[0px_4px_12px_0px_rgba(0,0,0,0.08)]',
        'transition-all duration-200',
        'hover:shadow-[0px_6px_16px_0px_rgba(0,0,0,0.12)]',
        'hover:scale-[0.98]',
        'flex items-center',
      ].join(' ')}
    >
      <div className={['absolute top-0 w-[5px] h-[70px]', stripCls, stripPos].join(' ')} />

      {showIcon && (
        <div className="absolute left-[33px] top-1/2 -translate-y-1/2 w-[32px] h-[32px] flex items-center justify-center">
          {isIconImage ? (
            <img src={icon as string} alt="icon" className="w-[32px] h-[32px] object-contain block" />
          ) : (
            React.createElement(icon as React.ComponentType<React.SVGProps<SVGSVGElement>>, {
              className: ['w-[32px] h-[32px]', iconCls].join(' '),
            })
          )}
        </div>
      )}

      <div
        className={[
          'absolute top-1/2 -translate-y-1/2 flex flex-col gap-[2px]',
          showIcon ? 'left-[80px]' : 'left-[24px]',
          showCloseIcon ? 'right-[60px]' : 'right-[24px]',
        ].join(' ')}
      >
        <h3 className={['font-[Poppins] text-[16px] font-semibold leading-normal m-0 p-0', titleCls].join(' ')}>
          {title}
        </h3>
        <p className={['font-[Poppins] text-[10px] font-normal leading-normal m-0 p-0', subCls].join(' ')}>
          {subtitle}
        </p>
      </div>

      {showCloseIcon && (
        <button
          onClick={handleClose}
          className={[
            'absolute right-[33px] top-1/2 -translate-y-1/2',
            'w-[20px] h-[20px] p-0 border-0 rounded-full',
            'flex items-center justify-center',
            'transition-all duration-200 hover:opacity-70',
          ].join(' ')}
          style={{
            backgroundColor: closeIconBackgroundColor || 'transparent',
          }}
          aria-label="Close"
        >
          {closeIconImage ? (
            <img src={closeIconImage} alt="close" className="w-[7px] h-[7px] object-contain block" />
          ) : (
            <XMarkIcon className={['w-[7px] h-[7px]', closeCls].join(' ')} />
          )}
        </button>
      )}

      <TailwindSafelist />
    </div>
  );
};

interface ToastItemProps {
  toast: Toast;
  onClose: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onClose }) => {
  const [isExiting, setIsExiting] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  const hasActions = !!(toast.actions && toast.actions.length > 0);

  useEffect(() => {
    if (toast.duration !== undefined && toast.duration > 0 && !hovered && !hasActions) {
      const interval = setInterval(() => {
        setElapsed((prev) => {
          if (prev >= toast.duration!) {
            setIsExiting(true);
            setTimeout(() => onClose(toast.id), 300);
            return prev;
          }
          return prev + 100;
        });
      }, 100);
      return () => clearInterval(interval);
    }
    return undefined;
  }, [toast.duration, hovered, hasActions, onClose, toast.id]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => onClose(toast.id), 300);
  };

  const handleCloseClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleClose();
  };

  const handleAction = (action?: () => void) => {
    action?.();
    handleClose();
  };

  const defaultStyles = useMemo(() => {
    switch (toast.type) {
      case 'success':
        return {
          border: 'border-[rgba(34,197,94,1)]',
          bg: 'bg-[rgba(240,253,244,1)]',
          icon: 'text-[rgba(34,197,94,1)]',
          progressBg: 'bg-[rgba(34,197,94,1)]',
          Icon: CheckCircleIcon,
          textColor: 'text-[rgba(17,24,39,1)]',
          subtitleColor: 'text-[rgba(107,114,128,1)]',
        };
      case 'error':
        return {
          border: 'border-[rgba(239,68,68,1)]',
          bg: 'bg-[rgba(254,242,242,1)]',
          icon: 'text-[rgba(239,68,68,1)]',
          progressBg: 'bg-[rgba(239,68,68,1)]',
          Icon: XCircleIcon,
          textColor: 'text-[rgba(17,24,39,1)]',
          subtitleColor: 'text-[rgba(107,114,128,1)]',
        };
      case 'warning':
        return {
          border: 'border-[rgba(234,179,8,1)]',
          bg: 'bg-[rgba(254,252,232,1)]',
          icon: 'text-[rgba(234,179,8,1)]',
          progressBg: 'bg-[rgba(234,179,8,1)]',
          Icon: ExclamationTriangleIcon,
          textColor: 'text-[rgba(17,24,39,1)]',
          subtitleColor: 'text-[rgba(107,114,128,1)]',
        };
      case 'info':
        return {
          border: 'border-[rgba(59,130,246,1)]',
          bg: 'bg-[rgba(239,246,255,1)]',
          icon: 'text-[rgba(59,130,246,1)]',
          progressBg: 'bg-[rgba(59,130,246,1)]',
          Icon: InformationCircleIcon,
          textColor: 'text-[rgba(17,24,39,1)]',
          subtitleColor: 'text-[rgba(107,114,128,1)]',
        };
      case 'action':
        return {
          border: 'border-[rgba(139,92,246,1)]',
          bg: 'bg-[rgba(245,243,255,1)]',
          icon: 'text-[rgba(139,92,246,1)]',
          progressBg: 'bg-[rgba(139,92,246,1)]',
          Icon: QuestionMarkCircleIcon,
          textColor: 'text-[rgba(17,24,39,1)]',
          subtitleColor: 'text-[rgba(107,114,128,1)]',
        };
      case 'liquidUI':
        return {
          border: 'border-[rgba(178,185,182,0.4)]',
          bg: 'bg-[rgba(240,253,244,1)]',
          icon: 'text-[rgba(178,185,182,0.4)]',
          progressBg: 'bg-[rgba(178,185,182,0.4)]',
          Icon: CheckCircleIcon,
          textColor: 'text-[rgba(17,24,39,1)]',
          subtitleColor: 'text-[rgba(107,114,128,1)]',
        };
      default:
        return {
          border: 'border-gray-300',
          bg: 'bg-white',
          icon: 'text-slate-600',
          progressBg: 'bg-slate-600',
          Icon: InformationCircleIcon,
          textColor: 'text-[rgba(17,24,39,1)]',
          subtitleColor: 'text-[rgba(107,114,128,1)]',
        };
    }
  }, [toast.type]);

  const progressPct =
    toast.duration !== undefined && toast.duration > 0 ? Math.min(100, (elapsed / toast.duration) * 100) : 0;

  const progressWidthClass =
    progressPct >= 100 ? 'w-full' : progressPct >= 75 ? 'w-3/4' : progressPct >= 50 ? 'w-1/2' : progressPct >= 25 ? 'w-1/4' : 'w-0';

  const hasBackgroundGradient = !!(toast.backgroundGradientStart || toast.backgroundGradientEnd);

  if (hasBackgroundGradient) {
    const start = toast.backgroundGradientStart || 'rgba(34, 197, 94, 1)';
    const end = toast.backgroundGradientEnd || 'rgba(74, 222, 128, 1)';
    const bgGradient = gradientBgClass(start, end);

    const finalTextCls = colorTextClass(toast.textColor || 'rgba(255, 255, 255, 1)', 'text-white');
    const finalMsgCls = colorTextClass(toast.messageColor || 'rgba(255, 255, 255, 1)', 'text-white');
    const iconClrCls = colorTextClass(toast.iconColor || 'rgba(255, 255, 255, 1)', 'text-white');

    const showStrip = toast.showColorStripOnGradient || false;
    const stripStart = toast.colorStripOnGradientStart || 'rgba(245, 158, 11, 1)';
    const stripEnd = toast.colorStripOnGradientEnd || 'rgba(255, 191, 92, 1)';
    const stripPos = toast.colorStripOnGradientPosition || 'left';
    const stripSpacing = toast.colorStripOnGradientSpacing ?? 0;

    const stripCls = stripGradientClass(stripStart, stripEnd);
    const stripPosCls =
      stripPos === 'left'
        ? ['left-0', edgeWithSpacing('left', stripSpacing), 'rounded-l-[12px]'].join(' ')
        : ['right-0', edgeWithSpacing('right', stripSpacing), 'rounded-r-[12px]'].join(' ');

    const IconComponent = toast.icon;
    const hasIconToShow = IconComponent !== null && IconComponent !== undefined;
    const isIconImage = typeof IconComponent === 'string';

    return (
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={[
          'relative overflow-hidden transition-all duration-300',
          'w-[325px] h-[70px] rounded-[12px]',
          'shadow-[0px_4px_12px_0px_rgba(0,0,0,0.08)]',
          bgGradient,
          isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0',
        ].join(' ')}
        role="status"
        aria-live="polite"
      >
        {showStrip && <div className={['absolute top-0 z-10 w-[5px] h-[70px]', stripCls, stripPosCls].join(' ')} />}

        {hasIconToShow && (
          <div className="absolute left-[36px] top-1/2 -translate-y-1/2 w-[26px] h-[26px] flex items-center justify-center">
            {isIconImage ? (
              <img src={IconComponent as string} alt="icon" className="w-[26px] h-[26px] object-contain block" />
            ) : (
              React.createElement(IconComponent as React.ComponentType<React.SVGProps<SVGSVGElement>>, {
                className: ['w-[26px] h-[26px]', iconClrCls].join(' '),
              })
            )}
          </div>
        )}

        <div
          className={[
            'absolute top-1/2 -translate-y-1/2 flex flex-col gap-[2px]',
            hasIconToShow ? 'left-[80px]' : 'left-[24px]',
            hasActions ? 'right-[24px]' : 'right-[60px]',
          ].join(' ')}
        >
          <h4 className={['font-[Poppins] text-[16px] font-bold leading-normal m-0 p-0', finalTextCls].join(' ')}>
            {toast.title}
          </h4>
          <p className={['font-[Poppins] text-[10px] font-normal leading-normal m-0 p-0', finalMsgCls].join(' ')}>
            {toast.message}
          </p>
        </div>

        {!hasActions && (
          <button
            onClick={handleClose}
            className={[
              'absolute right-[22px] top-1/2 -translate-y-1/2',
              'w-[24px] h-[24px] p-0 border-0 rounded-full',
              'flex items-center justify-center',
              'transition-all duration-200 hover:opacity-70',
            ].join(' ')}
            style={{
              backgroundColor: toast.closeIconBackgroundColor || 'transparent',
            }}
            aria-label="Close"
          >
            {toast.closeIconImage ? (
              <img 
                src={toast.closeIconImage} 
                alt="close" 
                className="w-[14px] h-[14px] object-contain block"
                style={{
                  filter: toast.closeIconColor === 'rgba(255, 255, 255, 1)' || toast.closeIconColor === 'white'
                    ? 'brightness(0) invert(1)'
                    : undefined
                }}
              />
            ) : (
              <XMarkIcon className={['w-[14px] h-[14px]', finalTextCls].join(' ')} />
            )}
          </button>
        )}

        {hasActions && (
          <div className="absolute left-[24px] right-[24px] bottom-[16px] flex gap-2">
            {toast.actions?.[0] && (
              <button
                onClick={() => handleAction(toast.actions?.[0].onClick)}
                className={['flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors', 'bg-white/20 hover:bg-white/30', finalTextCls].join(' ')}
              >
                {toast.actions[0].label}
              </button>
            )}
            {toast.actions?.[1] && (
              <button
                onClick={() => handleAction(toast.actions?.[1].onClick)}
                className={['flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors', 'bg-white/10 hover:bg-white/20 border border-white/30', finalTextCls].join(' ')}
              >
                {toast.actions[1].label}
              </button>
            )}
          </div>
        )}

        {toast.duration !== undefined && toast.duration > 0 && !hasActions && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
            <div className={['h-full bg-white transition-[width] duration-100', progressWidthClass].join(' ')} aria-hidden />
          </div>
        )}

        <TailwindSafelist />
      </div>
    );
  }

  const hasCustomStyling =
    !!(
      toast.colorStripGradientStart ||
      toast.colorStripGradientEnd ||
      toast.titleColor ||
      toast.icon ||
      toast.colorStripPosition ||
      toast.showCloseIcon
    );

  if (hasCustomStyling) {
    const stripStart = toast.colorStripGradientStart || 'rgba(245, 158, 11, 1)';
    const stripEnd = toast.colorStripGradientEnd || 'rgba(255, 191, 92, 1)';
    const stripCls = stripGradientClass(stripStart, stripEnd);

    const titleCls = colorTextClass(toast.titleColor || 'rgba(17,24,39,1)', 'text-[rgba(17,24,39,1)]');
    const subCls = colorTextClass(toast.subtitleColor || 'rgba(107,114,128,1)', 'text-[rgba(107,114,128,1)]');

    const stripPos = toast.colorStripPosition || 'left';
    const stripSpacing = toast.colorStripSpacing ?? 0;
    const stripPosCls =
      stripPos === 'left'
        ? ['left-0', edgeWithSpacing('left', stripSpacing), 'rounded-l-[12px]'].join(' ')
        : ['right-0', edgeWithSpacing('right', stripSpacing), 'rounded-r-[12px]'].join(' ');

    const showIcon = toast.icon !== null && toast.icon !== undefined;
    const isIconImage = typeof toast.icon === 'string';
    const iconCls = colorTextClass(toast.iconColor || toast.titleColor || 'rgba(17,24,39,1)', titleCls);

    const showCloseIcon = toast.showCloseIcon || false;
    const closeCls = colorTextClass(toast.closeIconColor || 'rgba(107,114,128,1)', 'text-[rgba(107,114,128,1)]');

    return (
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={[
          'relative overflow-hidden rounded-[12px] bg-white',
          'shadow-[0px_4px_12px_0px_rgba(0,0,0,0.08)] transition-all duration-300',
          isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0',
          'min-w-[320px] max-w-[420px]',
        ].join(' ')}
        role="status"
        aria-live="polite"
      >
        <div className={['absolute top-0 w-[5px] h-full', stripCls, stripPosCls].join(' ')} />

        {showIcon && toast.icon && (
          <div className="absolute z-10 left-[36px] top-[22px] w-[26px] h-[26px] flex items-center justify-center">
            {isIconImage ? (
              <img src={toast.icon as string} alt="icon" className="w-[26px] h-[26px] object-contain block" />
            ) : (
              React.createElement(toast.icon as React.ComponentType<React.SVGProps<SVGSVGElement>>, {
                className: ['w-[26px] h-[26px]', iconCls].join(' '),
              })
            )}
          </div>
        )}

        {showCloseIcon && (
          <button
            onClick={handleCloseClick}
            className={[
              'absolute z-10 top-[27px]',
              stripPos === 'left' ? 'right-[22px]' : 'left-[289px]',
              'w-[24px] h-[24px] p-0 border-0 rounded-full',
              'flex items-center justify-center',
              'transition-all duration-200 hover:opacity-70',
            ].join(' ')}
            style={{
              backgroundColor: toast.closeIconBackgroundColor || 'transparent',
            }}
            aria-label="Close"
          >
            {toast.closeIconImage ? (
              <img 
                src={toast.closeIconImage} 
                alt="close" 
                className="w-[14px] h-[14px] object-contain block"
                style={{
                  filter: toast.closeIconColor && toast.closeIconColor !== 'rgba(107, 114, 128, 1)'
                    ? toast.closeIconColor === 'rgba(255, 255, 255, 1)' || toast.closeIconColor === 'white'
                      ? 'brightness(0) invert(1)'
                      : 'brightness(0) saturate(100%)'
                    : undefined
                }}
              />
            ) : (
              <XMarkIcon className={['w-[14px] h-[14px]', closeCls].join(' ')} />
            )}
          </button>
        )}

        <div className={['flex flex-col pt-[13px] pb-[16px]', showIcon ? 'pl-[57px]' : 'pl-[24px]', 'pr-[24px]'].join(' ')}>
          <h3 className={['font-[Poppins] text-[16px] font-semibold leading-normal mb-[2px]', titleCls].join(' ')}>
            {toast.title}
          </h3>
          <p className={['font-[Poppins] text-[10px] font-normal leading-normal', subCls].join(' ')}>
            {toast.message}
          </p>
        </div>

        {toast.duration !== undefined && toast.duration > 0 && !hasActions && (
          <div className="h-1 w-full bg-black/5">
            <div className={['h-full transition-[width] duration-100', stripCls, progressWidthClass].join(' ')} aria-hidden />
          </div>
        )}

        <TailwindSafelist />
      </div>
    );
  }

  const DefaultIcon = defaultStyles.Icon;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={[
        'flex flex-col overflow-hidden rounded-lg border shadow-lg transition-all duration-300',
        defaultStyles.bg,
        defaultStyles.border,
        isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0',
        'min-w-[320px] max-w-[420px]',
      ].join(' ')}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start gap-3 p-4">
        <div className={['flex shrink-0 items-center justify-center', defaultStyles.icon, 'w-[26px] h-[26px]'].join(' ')}>
          <DefaultIcon className="w-[26px] h-[26px]" />
        </div>

        <div className="min-w-0 flex-1">
          <h4 className={['mb-1 text-sm font-semibold', defaultStyles.textColor].join(' ')}>
            {toast.title}
          </h4>
          <p className={['text-sm', defaultStyles.subtitleColor].join(' ')}>
            {toast.message}
          </p>
        </div>

        {!hasActions && (
          <button
            onClick={handleClose}
            className="shrink-0 rounded p-1 text-[rgba(107,114,128,1)] transition-colors hover:bg-black/5 w-[14px] h-[14px] flex items-center justify-center"
            aria-label="Close"
          >
            <XMarkIcon className="w-[14px] h-[14px]" />
          </button>
        )}
      </div>

      {hasActions && (
        <div className="flex gap-2 px-4 pb-4">
          {toast.actions?.[0] && (
            <button
              onClick={() => handleAction(toast.actions?.[0].onClick)}
              className="flex-1 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
            >
              {toast.actions[0].label}
            </button>
          )}
          {toast.actions?.[1] && (
            <button
              onClick={() => handleAction(toast.actions?.[1].onClick)}
              className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-gray-50"
            >
              {toast.actions[1].label}
            </button>
          )}
        </div>
      )}

      {toast.duration !== undefined && toast.duration > 0 && !hasActions && (
        <div className="h-1 w-full bg-black/5">
          <div className={['h-full transition-[width] duration-100', defaultStyles.progressBg, progressWidthClass].join(' ')} aria-hidden />
        </div>
      )}

      <TailwindSafelist />
    </div>
  );
};

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

const ToastMessage: React.FC<ToastMessageProps> = ({ toasts, position = 'top-right', onClose }) => {
  return (
    <div className={['fixed z-[9999] flex flex-col gap-3 pointer-events-none', posClass(position)].join(' ')}>
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <ToastItem toast={t} onClose={onClose} />
        </div>
      ))}
    </div>
  );
};

ToastMessage.displayName = 'ToastMessage';
export { ToastMessage };