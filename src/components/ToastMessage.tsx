import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import styled from '@emotion/styled';


type AssetModule =
  | string
  | { src?: string; default?: string | { src?: string } }
  | { default?: string }
  | { default?: { src?: string } };

const assetSrc = (m: AssetModule): string => {
  if (typeof m === 'string') return m;
  const anyM = m as any
  if (typeof anyM?.src === 'string') return anyM.src;
  const d = anyM?.default;
  if (typeof d === 'string') return d;
  if (typeof d?.src === 'string') return d.src;
  return '';
};

let checkMarkIcon: AssetModule = '';
let dangerIcon: AssetModule = '';
let notificationIcon: AssetModule = '';
let closeIcon: AssetModule = '';
let checkMarkIcon2: AssetModule = '';
let dangerIcon2: AssetModule = '';
let dangerIcon1_1: AssetModule = '';
let notificationIcon2: AssetModule = '';
let closeIconCopy: AssetModule = '';

try {
  checkMarkIcon = require('../assets/icons/check-mark_1.png') as AssetModule;
  dangerIcon = require('../assets/icons/danger_1.png') as AssetModule;
  notificationIcon = require('../assets/icons/notification_1.png') as AssetModule;
  closeIcon = require('../assets/icons/close.png') as AssetModule;
  checkMarkIcon2 = require('../assets/icons/check-mark_2.png') as AssetModule;
  dangerIcon2 = require('../assets/icons/danger_2.png') as AssetModule;
  dangerIcon1_1 = require('../assets/icons/danger_1_1.png') as AssetModule;
  notificationIcon2 = require('../assets/icons/notification_2.png') as AssetModule;
  closeIconCopy = require('../assets/icons/close_copy_1.png') as AssetModule;
} catch (e) {
}

const FALLBACK_ICONS = {
  checkMarkIcon: '/toast-icons/check-mark_1.png',
  dangerIcon: '/toast-icons/danger_1.png',
  notificationIcon: '/toast-icons/notification_1.png',
  closeIcon: '/toast-icons/close.png',
  checkMarkIcon2: '/toast-icons/check-mark_2.png',
  dangerIcon2: '/toast-icons/danger_2.png',
  dangerIcon1_1: '/toast-icons/danger_1_1.png',
  notificationIcon2: '/toast-icons/notification_2.png',
  closeIconCopy: '/toast-icons/close_copy_1.png',
};

const getIconSrc = (imported: AssetModule, fallback: string): string => {
  const src = assetSrc(imported);
  return src || fallback;
};

export type ToastType = "success" | "error" | "warning" | "notification";
export type BackgroundType = "solid" | "transparent";

export interface CustomToastStyles {
  containerBackground?: string;
  containerBorderRadius?: string;
  containerBoxShadow?: string;
  containerWidth?: string;
  containerHeight?: string;
  containerPaddingLeft?: string;
  
  stripBackground?: string;
  stripWidth?: string;
  stripLeft?: string;
  stripBorderRadius?: string;
  
  titleColor?: string;
  titleFontFamily?: string;
  titleFontSize?: string;
  titleFontWeight?: string;
  titleFontStyle?: string;
  titleLineHeight?: string;
  
  messageColor?: string;
  messageFontFamily?: string;
  messageFontSize?: string;
  messageFontWeight?: string;
  messageFontStyle?: string;
  messageLineHeight?: string;
  messageOpacity?: string;
  messageMarginTop?: string;
  
  iconSrc?: string;
  iconWidth?: string;
  iconHeight?: string;
  iconMarginRight?: string;
  
  closeIconSrc?: string;
  closeIconWidth?: string;
  closeIconHeight?: string;
  closeButtonOpacity?: string;
  closeButtonMarginLeft?: string;
}

export interface ActionButton {
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

export interface ToastMessageProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: ToastType;
  title?: string;
  message?: string;
  onClose?: () => void;
  showClose?: boolean;
  duration?: number;
  background?: BackgroundType;
  custom?: CustomToastStyles;
  action?: ActionButton[];
  testId?:string;
}

const getStripGradient = (type: ToastType): string => {
  switch (type) {
    case "success":     return "linear-gradient(90deg, rgba(40, 167, 69, 1) 22.5%, rgba(58, 208, 125, 1) 130%)";
    case "error":       return "linear-gradient(90deg, rgba(220, 53, 69, 1) 22.5%, rgba(183, 28, 28, 1) 130%)";
    case "warning":     return "linear-gradient(90deg, rgba(245, 158, 11, 1) 22.5%, rgba(255, 191, 92, 1) 130%)";
    case "notification":
    default:            return "linear-gradient(90deg, rgba(23, 97, 163, 1) 22.5%, rgba(77, 175, 131, 1) 130%)";
  }
};

const getGradient = (type: ToastType): string => {
  switch (type) {
    case "success":     return "linear-gradient(90deg, rgba(40, 167, 69, 1) 0%, rgba(58, 208, 125, 1) 100%)";
    case "error":       return "linear-gradient(90deg, rgba(220, 53, 69, 1) 0%, rgba(183, 28, 28, 1) 100%)";
    case "warning":     return "linear-gradient(90deg, rgba(245, 158, 11, 1) 0%, rgba(255, 191, 92, 1) 100%)";
    case "notification":
    default:            return "linear-gradient(90deg, rgba(23, 97, 163, 1) 0%, rgba(77, 175, 131, 1) 100%)";
  }
};

const getTitleColor = (type: ToastType): string => {
  switch (type) {
    case "success":     return "rgba(40, 167, 69, 1)";
    case "error":       return "rgba(220, 53, 69, 1)";
    case "warning":     return "rgba(245, 158, 11, 1)";
    case "notification":
    default:            return "rgba(23, 97, 163, 1)";
  }
};

const getIcon = (type: ToastType, background: BackgroundType) => {
  const style = { width: '28px', height: '28px', objectFit: 'contain' as const };

  if (background === "transparent") {
    switch (type) {
      case "success":     return <img src={getIconSrc(checkMarkIcon2, FALLBACK_ICONS.checkMarkIcon2)}    alt="Success"      style={style} />;
      case "error":       return <img src={getIconSrc(dangerIcon2, FALLBACK_ICONS.dangerIcon2)}       alt="Error"        style={style} />;
      case "warning":     return <img src={getIconSrc(dangerIcon1_1, FALLBACK_ICONS.dangerIcon1_1)}     alt="Warning"      style={style} />;
      case "notification":
      default:            return <img src={getIconSrc(notificationIcon2, FALLBACK_ICONS.notificationIcon2)} alt="Notification" style={style} />;
    }
  } else {
    switch (type) {
      case "success":     return <img src={getIconSrc(checkMarkIcon, FALLBACK_ICONS.checkMarkIcon)}    alt="Success"      style={style} />;
      case "error":       return <img src={getIconSrc(dangerIcon, FALLBACK_ICONS.dangerIcon)}       alt="Error"        style={style} />;
      case "warning":     return <img src={getIconSrc(dangerIcon, FALLBACK_ICONS.dangerIcon)}       alt="Warning"      style={style} />;
      case "notification":
      default:            return <img src={getIconSrc(notificationIcon, FALLBACK_ICONS.notificationIcon)} alt="Notification" style={style} />;
    }
  }
};

const ToastContainer = styled.div<{ 
  $type: ToastType; 
  $background: BackgroundType;
  $custom?: CustomToastStyles;
  $hasActions?: boolean;
}>`
  position: fixed;
  top: 20px;
  right: 20px;
  width: ${p => p.$custom?.containerWidth || '325px'};
  height: ${p => p.$custom?.containerHeight || (p.$hasActions ? 'auto' : '70px')};
  min-height: ${p => p.$hasActions ? '70px' : 'auto'};
  border-radius: ${p => p.$custom?.containerBorderRadius || '12px'};
  background: ${p => 
    p.$custom?.containerBackground || 
    (p.$background === "transparent" ? "rgba(255, 255, 255, 1)" : getGradient(p.$type))
  };
  box-shadow: ${p => p.$custom?.containerBoxShadow || '0 4px 12px 0 rgba(0, 0, 0, 0.08)'};
  display: flex;
  flex-direction: ${p => p.$hasActions ? 'column' : 'row'};
  align-items: ${p => p.$hasActions ? 'stretch' : 'center'};
  color: ${p => p.$background === "transparent" ? "rgba(85, 85, 85, 1)" : "rgba(255, 255, 255, 1)"};
  z-index: 9999;
  overflow: hidden;
  padding-left: ${p => 
    p.$custom?.containerPaddingLeft || 
    (p.$background === "transparent" ? "33px" : "10px")
  };
  padding-top: ${p => p.$hasActions ? '10px' : '0'};
  padding-bottom: ${p => p.$hasActions ? '10px' : '0'};
  padding-right: ${p => p.$hasActions ? '10px' : '0'};
`;

const TopSection = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  min-height: 50px;
`;

const LeftStrip = styled.div<{ 
  $type: ToastType;
  $custom?: CustomToastStyles;
}>`
  position: absolute;
  left: ${p => p.$custom?.stripLeft || '5px'};
  top: 0;
  width: ${p => p.$custom?.stripWidth || '5px'};
  height: 100%;
  border-radius: ${p => p.$custom?.stripBorderRadius || '20px 0 0 20px'};
  background: ${p => p.$custom?.stripBackground || getStripGradient(p.$type)};
`;

const IconWrapper = styled.div<{ $custom?: CustomToastStyles }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  margin-right: ${p => p.$custom?.iconMarginRight || '12px'};
  flex-shrink: 0;
  z-index: 1;
`;

const Content = styled.div`
  flex: 1;
  min-width: 0;
  z-index: 1;
`;

const Title = styled.div<{ 
  $type: ToastType; 
  $background: BackgroundType;
  $custom?: CustomToastStyles;
}>`
  font-family: ${p => p.$custom?.titleFontFamily || 'Poppins'};
  font-size: ${p => p.$custom?.titleFontSize || '16px'};
  font-style: ${p => p.$custom?.titleFontStyle || 'normal'};
  font-weight: ${p => 
    p.$custom?.titleFontWeight || 
    (p.$background === "transparent" ? "600" : "700")
  };
  line-height: ${p => p.$custom?.titleLineHeight || 'normal'};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${p => 
    p.$custom?.titleColor || 
    (p.$background === "transparent" ? getTitleColor(p.$type) : "rgba(255, 255, 255, 1)")
  };
`;

const MessageText = styled.div<{ 
  $background: BackgroundType;
  $custom?: CustomToastStyles;
}>`
  font-family: ${p => p.$custom?.messageFontFamily || 'Poppins'};
  font-size: ${p => p.$custom?.messageFontSize || '10px'};
  font-style: ${p => p.$custom?.messageFontStyle || 'normal'};
  font-weight: ${p => p.$custom?.messageFontWeight || '400'};
  line-height: ${p => p.$custom?.messageLineHeight || 'normal'};
  margin-top: ${p => p.$custom?.messageMarginTop || '2px'};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  opacity: ${p => p.$custom?.messageOpacity || undefined};
  color: ${p => 
    p.$custom?.messageColor || 
    (p.$background === "transparent" ? "rgba(85, 85, 85, 1)" : "rgba(255, 255, 255, 1)")
  };
`;

const CloseButton = styled.button<{ 
  $background: BackgroundType;
  $custom?: CustomToastStyles;
}>`
  background: none;
  border: none;
  cursor: pointer;
  opacity: ${p => 
    p.$custom?.closeButtonOpacity || 
    (p.$background === "transparent" ? "0.6" : "0.8")
  };
  padding: 4px;
  margin-left: ${p => p.$custom?.closeButtonMarginLeft || '8px'};
  flex-shrink: 0;
  z-index: 1;

  &:hover { opacity: 1; }
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 10px;
  padding-left: 5px;
  justify-content: flex-end;
`;

const ActionButtonStyled = styled.button<{
  $variant?: 'primary' | 'secondary';
  $backgroundColor?: string;
  $textColor?: string;
  $borderColor?: string;
  $hoverBackgroundColor?: string;
  $fontSize?: string;
  $fontWeight?: string;
  $padding?: string;
  $borderRadius?: string;
}>`
  font-family: Poppins;
  font-size: ${p => p.$fontSize || '12px'};
  font-weight: ${p => p.$fontWeight || '600'};
  padding: ${p => p.$padding || '6px 16px'};
  border-radius: ${p => p.$borderRadius || '6px'};
  border: ${p => p.$borderColor ? `1px solid ${p.$borderColor}` : 'none'};
  background: ${p => {
    if (p.$backgroundColor) return p.$backgroundColor;
    return p.$variant === 'secondary' ? 'transparent' : 'rgba(255, 255, 255, 0.9)';
  }};
  color: ${p => {
    if (p.$textColor) return p.$textColor;
    return p.$variant === 'secondary' ? 'rgba(255, 255, 255, 1)' : 'rgba(0, 0, 0, 0.8)';
  }};
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background: ${p => {
      if (p.$hoverBackgroundColor) return p.$hoverBackgroundColor;
      return p.$variant === 'secondary' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 1)';
    }};
    opacity: 0.9;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const ToastMessage = React.forwardRef<HTMLDivElement, ToastMessageProps>(
  (
    {
      type = "notification",
      title: customTitle,
      message,
      onClose,
      showClose = true,
      duration = 5000,
      background = "solid",
      custom,
      action,
      className,
      testId,
      ...rest
    },
    ref
  ) => {
    const displayTitle = customTitle ?? type.charAt(0).toUpperCase() + type.slice(1);
    const hasActions = action && action.length > 0;

    useEffect(() => {
      if (!onClose) return;
      if (duration <= 0) return;

      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }, [duration, onClose]);

    const closeIconSrc = custom?.closeIconSrc || 
      (background === "transparent" 
        ? getIconSrc(closeIconCopy, FALLBACK_ICONS.closeIconCopy)
        : getIconSrc(closeIcon, FALLBACK_ICONS.closeIcon)
      );

    const iconElement = custom?.iconSrc ? (
      <img 
        src={custom.iconSrc} 
        alt={type}
        style={{ 
          width: custom.iconWidth || '28px', 
          height: custom.iconHeight || '28px', 
          objectFit: 'contain' 
        }} 
      />
    ) : (
      getIcon(type, background)
    );

    const content = (
      <ToastContainer
      data-testId={testId}
        ref={ref}
        $type={type}
        $background={background}
        $custom={custom}
        $hasActions={hasActions}
        className={className}
        role="alert"
        aria-live="assertive"
        {...rest}
      >
        <LeftStrip $type={type} $custom={custom} />

        <TopSection>
          <IconWrapper $custom={custom}>{iconElement}</IconWrapper>

          <Content>
            <Title $type={type} $background={background} $custom={custom}>
              {displayTitle}
            </Title>
            {message && (
              <MessageText $background={background} $custom={custom}>
                {message}
              </MessageText>
            )}
          </Content>

          {showClose && onClose && (
            <CloseButton onClick={onClose} $background={background} $custom={custom} aria-label="Close toast">
              <img
                src={closeIconSrc}
                alt="Close"
                style={{ 
                  width: custom?.closeIconWidth || '20px', 
                  height: custom?.closeIconHeight || '20px', 
                  objectFit: 'contain' 
                }}
              />
            </CloseButton>
          )}
        </TopSection>

        {hasActions && (
          <ActionsContainer>
            {action?.map((btn, index) => (
              <ActionButtonStyled
                key={index}
                onClick={btn.onClick}
                $variant={btn.variant}
                $backgroundColor={btn.backgroundColor}
                $textColor={btn.textColor}
                $borderColor={btn.borderColor}
                $hoverBackgroundColor={btn.hoverBackgroundColor}
                $fontSize={btn.fontSize}
                $fontWeight={btn.fontWeight}
                $padding={btn.padding}
                $borderRadius={btn.borderRadius}
              >
                {btn.label}
              </ActionButtonStyled>
            ))}
          </ActionsContainer>
        )}
      </ToastContainer>
    );

    return ReactDOM.createPortal(content, document.body);
  }
);

ToastMessage.displayName = "ToastMessage";

export { ToastMessage };