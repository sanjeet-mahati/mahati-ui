"use client";

import React, { useState } from "react";

export interface TooltipProps {
  text?: string | React.ReactNode;
  testId?: string;
  position?: "top" | "right" | "bottom" | "left";
  children: React.ReactNode;
  variant?: "default" | "transparent";
  className?: string;
  textColor?: string;
  backgroundColor?: string;
  image?: {
    src: string;
    alt?: string;
    width?: number;
    height?: number;
  };
  animation?: {
    component: React.ComponentType<any>;
    props?: any;
    triggerDelay?: number;
  };
}

const Tooltip = ({
  text,
  position = "top",
  children,
  variant = "default",
  className = "",
  textColor,
  backgroundColor,
  image,
  testId,
  animation
}: TooltipProps): any => {

  const [visible, setVisible] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [adjustedPosition, setAdjustedPosition] = useState(position);

  const triggerRef = React.useRef<HTMLDivElement>(null);
  const tooltipRef = React.useRef<HTMLDivElement>(null);

  const hasContent = !!(text || image);

  const calculatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();

    const scrollY = window.scrollY;
    const scrollX = window.scrollX;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let top = 0;
    let left = 0;
    let finalPosition = position;

    const offset = 12;
    const padding = 10;

    switch (position) {
      case "top":
        top = rect.top + scrollY - tooltipRect.height - offset;
        left = rect.left + scrollX + rect.width / 2 - tooltipRect.width / 2;

        if (rect.top < tooltipRect.height + offset + padding) {
          finalPosition = "bottom";
          top = rect.bottom + scrollY + offset;
        }
        break;

      case "right":
        top = rect.top + scrollY + rect.height / 2 - tooltipRect.height / 2;
        left = rect.right + scrollX + offset;

        if (rect.right + tooltipRect.width + offset + padding > viewportWidth) {
          finalPosition = "left";
          left = rect.left + scrollX - tooltipRect.width - offset;
        }
        break;

      case "bottom":
        top = rect.bottom + scrollY + offset;
        left = rect.left + scrollX + rect.width / 2 - tooltipRect.width / 2;

        if (rect.bottom + tooltipRect.height + offset + padding > viewportHeight) {
          finalPosition = "top";
          top = rect.top + scrollY - tooltipRect.height - offset;
        }
        break;

      case "left":
        top = rect.top + scrollY + rect.height / 2 - tooltipRect.height / 2;
        left = rect.left + scrollX - tooltipRect.width - offset;

        if (rect.left < tooltipRect.width + offset + padding) {
          finalPosition = "right";
          left = rect.right + scrollX + offset;
        }
        break;
    }

    if (left < padding) left = padding;
    else if (left + tooltipRect.width > viewportWidth - padding)
      left = viewportWidth - tooltipRect.width - padding;

    if (top < scrollY + padding) top = scrollY + padding;
    else if (top + tooltipRect.height > scrollY + viewportHeight - padding)
      top = scrollY + viewportHeight - tooltipRect.height - padding;

    setTooltipPosition({ top, left });
    setAdjustedPosition(finalPosition);
    setIsReady(true);
  };

  const showTooltip = () => {
    if (!hasContent) return;

    setIsReady(false);
    setVisible(true);

    requestAnimationFrame(() => calculatePosition());

    if (animation) {
      const delay = animation.triggerDelay || 100;
      setTimeout(() => setShowAnimation(true), delay);
    }
  };

  const hideTooltip = () => {
    setVisible(false);
    setIsReady(false);
    setShowAnimation(false);
    setAdjustedPosition(position);
  };

  React.useEffect(() => {
    if (visible) {

      const handleUpdate = () => {
        requestAnimationFrame(calculatePosition);
      };

      window.addEventListener("scroll", handleUpdate, { passive: true });
      window.addEventListener("resize", handleUpdate);

      return () => {
        window.removeEventListener("scroll", handleUpdate);
        window.removeEventListener("resize", handleUpdate);
      };
    }
  }, [visible]);

  const renderTooltipContent = () => {
    if (image) {
      return (
        <img
          src={image.src}
          alt={image.alt || "Tooltip image"}
          width={image.width || 200}
          height={image.height || 150}
          loading="lazy"
          className="max-w-full h-auto rounded object-cover block"
        />
      );
    }
    return text;
  };

  const renderAnimation = () => {
    if (!animation || !showAnimation) return null;

    const AnimationComponent = animation.component;

    return (
      <AnimationComponent
        isActive={showAnimation}
        {...animation.props}
      />
    );
  };

  if (!hasContent) return <>{children}</>;

  const variantStyle =
    variant === "default"
      ? "bg-gradient-to-r from-[#1761A3] to-[#4DAF83] text-white text-[11px]"
      : "bg-white/95 text-gray-700 border border-gray-200 text-[13px]";

  return (
    <div
      data-testid={testId}
      ref={triggerRef}
      className={`relative inline-block ${className}`}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}

      {renderAnimation()}

      <div
        ref={tooltipRef}
        role="tooltip"
        style={{
          top: tooltipPosition.top,
          left: tooltipPosition.left,
          color: textColor,
          background: backgroundColor
        }}
        className={`
fixed z-[99999]
max-w-[calc(100vw-16px)]
min-w-0
box-border
font-[Poppins]
font-medium
rounded-[6px]
whitespace-normal
break-words [overflow-wrap:anywhere]
flex flex-wrap
transition-all duration-200
${variantStyle}
${visible && isReady
  ? "opacity-100 visible scale-100"
  : "opacity-0 invisible scale-95 pointer-events-none"}
${image ? "p-1" : "px-3 py-2"}
`}
      >
        {renderTooltipContent()}

        {variant === "default" && !image && (
          <div
            className="absolute w-0 h-0 border-solid"
            style={{
              ...(adjustedPosition === "top" && {
                bottom: -6,
                left: "50%",
                transform: "translateX(-50%)",
                borderWidth: "6px 6px 0 6px",
                borderColor: "#1761A3 transparent transparent transparent"
              }),
              ...(adjustedPosition === "bottom" && {
                top: -6,
                left: "50%",
                transform: "translateX(-50%)",
                borderWidth: "0 6px 6px 6px",
                borderColor: "transparent transparent #1761A3 transparent"
              }),
              ...(adjustedPosition === "left" && {
                right: -6,
                top: "50%",
                transform: "translateY(-50%)",
                borderWidth: "6px 0 6px 6px",
                borderColor: "transparent transparent transparent #1761A3"
              }),
              ...(adjustedPosition === "right" && {
                left: -6,
                top: "50%",
                transform: "translateY(-50%)",
                borderWidth: "6px 6px 6px 0",
                borderColor: "transparent #1761A3 transparent transparent"
              })
            }}
          />
        )}
      </div>
    </div>
  );
};

Tooltip.displayName = "Tooltip";

export default Tooltip;
export { Tooltip };