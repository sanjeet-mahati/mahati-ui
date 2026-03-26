import React, { useEffect } from "react";
import ReactDOM from "react-dom";

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
  iconPaths?: {
    success?: string;
    error?: string;
    warning?: string;
    notifications?: string;
  };
  type?: ToastType;
  title?: string;
  message?: string;
  onClose?: () => void;
  showClose?: boolean;
  duration?: number;
  background?: BackgroundType;
  custom?: CustomToastStyles;
  action?: ActionButton[];
  testId?: string;
}

const getStripGradient = (type: ToastType): string => {
  switch (type) {
    case "success": return "linear-gradient(90deg, rgba(40, 167, 69, 1) 22.5%, rgba(58, 208, 125, 1) 130%)";
    case "error": return "linear-gradient(90deg, rgba(220, 53, 69, 1) 22.5%, rgba(183, 28, 28, 1) 130%)";
    case "warning": return "linear-gradient(90deg, rgba(245, 158, 11, 1) 22.5%, rgba(255, 191, 92, 1) 130%)";
    case "notification":
    default: return "linear-gradient(90deg, rgba(23, 97, 163, 1) 22.5%, rgba(77, 175, 131, 1) 130%)";
  }
};

const getGradient = (type: ToastType): string => {
  switch (type) {
    case "success": return "linear-gradient(90deg, rgba(40, 167, 69, 1) 0%, rgba(58, 208, 125, 1) 100%)";
    case "error": return "linear-gradient(90deg, rgba(220, 53, 69, 1) 0%, rgba(183, 28, 28, 1) 100%)";
    case "warning": return "linear-gradient(90deg, rgba(245, 158, 11, 1) 0%, rgba(255, 191, 92, 1) 100%)";
    case "notification":
    default: return "linear-gradient(90deg, rgba(23, 97, 163, 1) 0%, rgba(77, 175, 131, 1) 100%)";
  }
};

const getTitleColor = (type: ToastType): string => {
  switch (type) {
    case "success": return "rgba(40, 167, 69, 1)";
    case "error": return "rgba(220, 53, 69, 1)";
    case "warning": return "rgba(245, 158, 11, 1)";
    case "notification":
    default: return "rgba(23, 97, 163, 1)";
  }
};

const getIcon = (type: ToastType, background: BackgroundType) => {
  const style = { width: '28px', height: '28px', objectFit: 'contain' as const };

  const altText = type.charAt(0).toUpperCase() + type.slice(1);

  if (background === "transparent") {
    switch (type) {
      case "success": return <img src="/icons/check-mark_2.png" alt={altText} style={style} />;
      case "error": return <img src="/icons/danger_2.png" alt={altText} style={style} />;
      case "warning": return <img src="/icons/danger_1_1.png" alt={altText} style={style} />;
      default: return <img src="/icons/notification_2.png" alt={altText} style={style} />;
    }
  } else {
    switch (type) {
      case "success": return <img src="/icons/check-mark_1.png" alt={altText} style={style} />;
      case "error": return <img src="/icons/danger_1.png" alt={altText} style={style} />;
      case "warning": return <img src="/icons/danger_1.png" alt={altText} style={style} />;
      default: return <img src="/icons/notification_1.png" alt={altText} style={style} />;
    }
  }
};


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
  

    const backgroundClass =
  background === "transparent" ? "bg-white" : "";



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
        ? "icons/close_copy_1.png"
        : "/icons/close.png"
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

      <div
        ref={ref}
        data-testid={testId}
        style={{
          background:
            background === "transparent"
              ? "#ffffff"
              : getGradient(type),
        }}
       className={`fixed top-[20px] right-[20px] w-[325px] rounded-[12px] shadow-md z-[9999] overflow-hidden flex 
${hasActions ? "flex-col p-[10px]" : "flex-row items-center pl-[10px]"} 
${backgroundClass}
${className || ""}`}
        role="alert"
        aria-live="assertive"
        {...rest}
      >

        <div
          className="absolute left-[5px] top-0 w-[5px] h-full rounded-[20px_0_0_20px]"
          style={{ background: getStripGradient(type) }}
        />

        <div className="flex items-center flex-1 min-h-[50px]">
          <div className="flex items-center justify-center w-[40px] h-[40px] mr-[12px] flex-shrink-0 z-[1]">
            {iconElement}
          </div>

          <div className="flex-1 min-w-0 z-[1]">
            <div
              className="font-semibold text-[16px] truncate"
              style={{
                fontFamily: custom?.titleFontFamily || "Poppins",
                color:
                  custom?.titleColor ||
                  (background === "transparent"
                    ? getTitleColor(type)
                    : "white"),
              }}
            >
              {displayTitle}
            </div>
            {message && (
              <div
                className="text-[10px] mt-[2px] truncate"
                style={{
                  fontFamily: custom?.messageFontFamily || "Poppins",
                  color:
                    custom?.messageColor ||
                    (background === "transparent" ? "#555" : "white"),
                }}
              >
                {message}
              </div>
            )}
          </div>

          {showClose && onClose && (
            <button
              onClick={onClose}
              aria-label="Close toast"
              className="ml-[8px] p-[4px] opacity-80 hover:opacity-100 flex-shrink-0"
            >
              <img
                src={closeIconSrc}
                alt="Close"
                style={{
                  width: custom?.closeIconWidth || '20px',
                  height: custom?.closeIconHeight || '20px',
                  objectFit: 'contain'
                }}
              />
            </button>
          )}
        </div>

        {hasActions && (
          <div className="flex gap-[8px] mt-[10px] pl-[5px] justify-end">
            {action?.map((btn, index) => (
              <button
                key={index}
                onClick={btn.onClick}
                className="text-[12px] font-semibold px-[16px] py-[6px] rounded-[6px] transition-all active:scale-95"
               
              >
                {btn.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );

    return ReactDOM.createPortal(content, document.body);
  }
);

ToastMessage.displayName = "ToastMessage";

export { ToastMessage };