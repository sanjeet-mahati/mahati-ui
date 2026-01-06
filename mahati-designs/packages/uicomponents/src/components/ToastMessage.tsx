'use client';

import React, { useEffect, useMemo, useState } from 'react';

// === ICON IMPORTS ===
// packages/uicomponents/src/components/ToastMessage.tsx
// → ../assets/icons/...
import checkMarkSolid from '../assets/icons/check-mark_1.png';
import checkMarkTransparent from '../assets/icons/check-mark_2.png';

import dangerSolid from '../assets/icons/danger_1.png';
import dangerTransparent from '../assets/icons/danger_2.png';

import warningTransparent from '../assets/icons/danger_1_1.png';

import notificationSolid from '../assets/icons/notification_1.png';
import notificationTransparent from '../assets/icons/notification_2.png';

import closeSolid from '../assets/icons/close.png';
import closeTransparent from '../assets/icons/close_copy_1.png';

type ClassValue = string | false | null | undefined;
const cn = (...values: ClassValue[]) => values.filter(Boolean).join(' ');
const cnArr = (values: ClassValue[]) => values.filter(Boolean).join(' ');

export type ToastType = 'Success' | 'Error' | 'Warning' | 'Notification' | 'Action' | 'LiquidUI';
export type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export type ToastBackground = 'solid' | 'transparent';

export interface ToastAction {
  label: string;
  onClick?: () => void;
}

export type ToastSlots =
  | 'base'
  | 'strip'
  | 'icon'
  | 'title'
  | 'message'
  | 'close'
  | 'actions'
  | 'primaryAction'
  | 'secondaryAction';

export type ToastClassNames = Partial<Record<ToastSlots, string>>;

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  actions?: ToastAction[];
  background?: ToastBackground;
  classNames?: ToastClassNames;
}

export type AlertArgs = {
  type: ToastType;
  message?: string;
  background?: ToastBackground;
  duration?: number;
  actions?: ToastAction[];
  classNames?: ToastClassNames;
};

export interface ToastContainerProps {
  toasts: Toast[];
  position: ToastPosition;
  onClose: (id: string) => void;
}

type LayoutPreset = {
  container: string;
  bgSolid: string;
  stripBg: string;
  stripTitleColor: string;
};

const presetFor = (type: ToastType): LayoutPreset => {
  const commonContainer =
    'w-[min(92vw,420px)] md:w-[325px] rounded-[12px] shadow-[0_4px_12px_0_rgba(0,0,0,0.08)]';

  switch (type) {
    case 'Success':
      return {
        container: `${commonContainer} h-[70px]`,
        bgSolid: 'bg-[linear-gradient(90deg,rgba(40,167,69,1)_0%,rgba(58,208,125,1)_100%)]',
        stripBg: 'bg-[linear-gradient(90deg,rgba(40,167,69,1)_22.5%,rgba(58,208,125,1)_130%)]',
        stripTitleColor: 'text-[rgba(40,167,69,1)]',
      };

    case 'Error':
      return {
        container: `${commonContainer} h-[70px]`,
        bgSolid: 'bg-[linear-gradient(90deg,rgba(220,53,69,1)_0%,rgba(183,28,28,1)_100%)]',
        stripBg: 'bg-[linear-gradient(90deg,rgba(220,53,69,1)_22.5%,rgba(183,28,28,1)_130%)]',
        stripTitleColor: 'text-[rgba(220,53,69,1)]',
      };

    case 'Warning':
      return {
        container: `${commonContainer} h-[70px]`,
        bgSolid: 'bg-[linear-gradient(90deg,rgba(245,158,11,1)_0%,rgba(255,191,92,1)_100%)]',
        stripBg: 'bg-[linear-gradient(90deg,rgba(245,158,11,1)_22.5%,rgba(255,191,92,1)_130%)]',
        stripTitleColor: 'text-[rgba(245,158,11,1)]',
      };

    case 'Notification':
      return {
        container: `${commonContainer} h-[70px]`,
        bgSolid: 'bg-[linear-gradient(90deg,rgba(23,97,163,1)_0%,rgba(77,175,131,1)_100%)]',
        stripBg: 'bg-[linear-gradient(90deg,rgba(23,97,163,1)_22.5%,rgba(77,175,131,1)_130%)]',
        stripTitleColor: 'text-[rgba(23,97,163,1)]',
      };

    case 'LiquidUI':
      return {
        container: `${commonContainer} h-[70px]`,
        bgSolid: 'bg-[linear-gradient(90deg,rgba(16,185,129,1)_0%,rgba(59,130,246,1)_100%)]',
        stripBg: 'bg-[linear-gradient(90deg,rgba(16,185,129,1)_22.5%,rgba(59,130,246,1)_130%)]',
        stripTitleColor: 'text-[rgba(16,185,129,1)]',
      };

    case 'Action':
      return {
        container: `${commonContainer} h-[110px]`,
        bgSolid: 'bg-[linear-gradient(90deg,rgba(139,92,246,1)_0%,rgba(168,85,247,1)_100%)]',
        stripBg: 'bg-[linear-gradient(90deg,rgba(139,92,246,1)_22.5%,rgba(168,85,247,1)_130%)]',
        stripTitleColor: 'text-[rgba(139,92,246,1)]',
      };

    default:
      return {
        container: `${commonContainer} h-[70px]`,
        bgSolid: 'bg-[linear-gradient(90deg,rgba(245,158,11,1)_0%,rgba(255,191,92,1)_100%)]',
        stripBg: 'bg-[linear-gradient(90deg,rgba(245,158,11,1)_22.5%,rgba(255,191,92,1)_130%)]',
        stripTitleColor: 'text-[rgba(245,158,11,1)]',
      };
  }
};

const titleForType = (type: ToastType) => {
  switch (type) {
    case 'LiquidUI':
      return 'Liquid UI';
    case 'Action':
      return 'Confirmation';
    default:
      return type;
  }
};

type StaticImportLike = { src: string } | string;

// Next image imports usually return {src, height, width...} in Next apps.
// In other bundlers it might be string. This helper supports both.
const toSrc = (v: StaticImportLike) => (typeof v === 'string' ? v : v.src);

const iconFor = (type: ToastType, background: ToastBackground): string => {
  const solid = background === 'solid';

  switch (type) {
    case 'Success':
      return toSrc(solid ? checkMarkSolid : checkMarkTransparent);
    case 'Error':
      return toSrc(solid ? dangerSolid : dangerTransparent);
    case 'Warning':
      return toSrc(solid ? dangerSolid : warningTransparent);
    case 'Notification':
      return toSrc(solid ? notificationSolid : notificationTransparent);
    case 'LiquidUI':
      return toSrc(checkMarkSolid);
    case 'Action':
      return toSrc(checkMarkSolid);
    default:
      return toSrc(checkMarkSolid);
  }
};

const closeIconFor = (background: ToastBackground): string =>
  toSrc(background === 'solid' ? closeSolid : closeTransparent);

interface ToastItemProps {
  toast: Toast;
  onClose: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onClose }) => {
  const [isExiting, setIsExiting] = useState(false);
  const [hovered, setHovered] = useState(false);

  const hasActions = !!(toast.actions && toast.actions.length > 0);
  const preset = useMemo(() => presetFor(toast.type), [toast.type]);
  const background: ToastBackground = toast.background ?? 'solid';

  const rawMessage = toast.message ?? '';
  const hasMessage = rawMessage.trim().length > 0;

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => onClose(toast.id), 300);
  };

  const handleAction = (action?: () => void) => {
    action?.();
    handleClose();
  };

  useEffect(() => {
    if (toast.duration && toast.duration > 0 && !hovered && !hasActions) {
      const t = setTimeout(() => handleClose(), toast.duration);
      return () => clearTimeout(t);
    }
    return;
  }, [toast.duration, hovered, hasActions]);

  const titleBottomClass = hasActions ? 'bottom-[78px]' : 'bottom-[33px]';
  const messageBottomClass = hasActions ? 'bottom-[52px]' : 'bottom-[16px]';

  const containerBgClass = background === 'solid' ? preset.bgSolid : 'bg-[rgba(255,255,255,1)]';

  const titleTextClass =
    background === 'transparent' ? preset.stripTitleColor : 'text-[rgba(255,255,255,1)]';

  const messageTextClass =
    background === 'transparent' ? 'text-[rgba(0,0,0,1)]' : 'text-[rgba(255,255,255,1)]';

  const slots = toast.classNames ?? {};

  const titleRight = 'right-[80px] md:right-[140px]';
  const messageRight = 'right-[70px] md:right-[94px]';
  const closeLeft = 'left-[calc(100%-36px)] md:left-[289px]';

  const baseClass = cnArr([
    'relative flex overflow-hidden border border-transparent transition-all duration-300',
    preset.container,
    containerBgClass,
    isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0',
    slots.base,
  ]);

  const stripClass = cnArr([
    'absolute top-0 left-[5px] w-[5px] h-full rounded-[20px_0_0_20px]',
    preset.stripBg,
    slots.strip,
  ]);

  // We keep the SAME slot ("icon") so your demo overrides still work.
  // But now it's applied to the <img> instead of background-image div.
  const iconClass = cnArr([
    'absolute left-[36px] top-[22px] h-[26px] w-[26px] object-contain',
    slots.icon,
  ]);

  const isTitleCentered = !hasActions && !hasMessage;
  const titleTopClass = isTitleCentered ? 'top-1/2 -translate-y-1/2' : 'top-[13px]';

  const titleClass = cnArr([
    'absolute left-[80px]',
    titleTopClass,
    titleRight,
    !isTitleCentered && titleBottomClass,
    'font-["Poppins"] text-[16px] font-[700] leading-none overflow-hidden text-ellipsis whitespace-nowrap',
    titleTextClass,
    slots.title,
  ]);

  const messageClass = cnArr([
    'absolute left-[80px] top-[39px]',
    messageRight,
    messageBottomClass,
    'font-["Poppins"] text-[10px] font-[400] leading-none truncate',
    messageTextClass,
    slots.message,
  ]);

  const closeBtnClass = cnArr([
    'absolute top-[27px] h-[14px] w-[14px]',
    closeLeft,
    slots.close,
  ]);

  const actionsWrapClass = cnArr([
    'absolute left-[80px] right-[12px] md:right-[22px] bottom-[10px] flex flex-wrap gap-2',
    slots.actions,
  ]);

  const primaryActionClass = cnArr([
    'inline-flex w-fit whitespace-nowrap items-center justify-center rounded-lg',
    'bg-[rgba(17,24,39,1)] px-3 py-2 text-[12px] font-[600] text-[rgba(255,255,255,1)] transition-colors hover:bg-[rgba(31,41,55,1)]',
    slots.primaryAction,
  ]);

  const secondaryActionClass = cnArr([
    'inline-flex w-fit whitespace-nowrap items-center justify-center rounded-lg',
    'border border-[rgba(255,255,255,0.6)] bg-[rgba(255,255,255,0.15)] px-3 py-2 text-[12px] font-[600] text-[rgba(255,255,255,1)] transition-colors hover:bg-[rgba(255,255,255,0.22)]',
    slots.secondaryAction,
  ]);

  const iconSrc = iconFor(toast.type, background);
  const closeSrc = closeIconFor(background);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={baseClass}
      role="status"
      aria-live="polite"
    >
      <div className={stripClass} aria-hidden="true" />

      <img src={iconSrc} alt={`${toast.type} icon`} className={iconClass} />

      <h4 className={titleClass}>{toast.title}</h4>

      {hasMessage && <p className={messageClass}>{rawMessage}</p>}

      {!hasActions && (
        <button onClick={handleClose} className={closeBtnClass} aria-label="Close">
          <img
            src={closeSrc}
            alt=""
            className="block h-[14px] w-[14px] object-contain"
            aria-hidden="true"
          />
        </button>
      )}

      {hasActions && (
        <div className={actionsWrapClass}>
          {toast.actions?.[0] && (
            <button onClick={() => handleAction(toast.actions?.[0]?.onClick)} className={primaryActionClass}>
              {toast.actions[0].label}
            </button>
          )}
          {toast.actions?.[1] && (
            <button onClick={() => handleAction(toast.actions?.[1]?.onClick)} className={secondaryActionClass}>
              {toast.actions[1].label}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

ToastItem.displayName = 'ToastItem';

const posClass = (p: ToastPosition) => {
  switch (p) {
    case 'top-left':
      return 'top-4 left-4';
    case 'top-center':
      return 'top-4 left-1/2 -translate-x-1/2';
    case 'top-right':
      return 'top-4 right-4';
    case 'bottom-left':
      return 'bottom-4 left-4';
    case 'bottom-center':
      return 'bottom-4 left-1/2 -translate-x-1/2';
    case 'bottom-right':
      return 'bottom-4 right-4';
    default:
      return 'top-4 right-4';
  }
};

const ToastMessageBase: React.FC<ToastContainerProps> = ({ toasts, position, onClose }) => (
  <div className={cn('fixed z-[9999] flex flex-col gap-3 pointer-events-none', posClass(position))}>
    {toasts.map((t) => (
      <div key={t.id} className="pointer-events-auto">
        <ToastItem toast={t} onClose={onClose} />
      </div>
    ))}
  </div>
);

ToastMessageBase.displayName = 'ToastMessage';

type ToastMessageWithUtils = typeof ToastMessageBase & {
  cn: typeof cn;
  titleForType: typeof titleForType;
};

const ToastMessage = ToastMessageBase as ToastMessageWithUtils;
ToastMessage.cn = cn;
ToastMessage.titleForType = titleForType;
ToastMessage.displayName = 'ToastMessage';

export { ToastMessage };
