"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

type CardVariant = "default" | "elevated" | "outlined" | "subtle" | "figma";
type CardSize = "default" | "sm" | "lg" | "figma";

interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "content"> {
  title?: string;
  cardContent?: React.ReactNode;
  cardBackContent?: React.ReactNode;
  collapsible?: boolean;
  flippable?: boolean;
  backgroundColor?: string;
  borderRadius?: string;
  defaultOpen?: boolean;
  onFlip?: (isFlipped: boolean) => void;
  variant?: CardVariant;
  size?: CardSize;
  className?: string;
  children?: React.ReactNode;
  testId?: string;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      title,
      cardContent,
      cardBackContent,
      collapsible = false,
      flippable = false,
      backgroundColor,
      borderRadius,
      variant = "default",
      size = "default",
      className = "",
      children,
      defaultOpen = true,
      onFlip,
      style,
      testId,
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = useState(defaultOpen);
    const [isFlipped, setIsFlipped] = useState(false);
    const contentId = React.useId();

    const handleFlip = () => {
      if (!flippable) return;
      const newState = !isFlipped;
      setIsFlipped(newState);
      onFlip?.(newState);
    };

    const mainContent = cardContent || children;

    /* ================= VARIANT STYLES ================= */

    const variantStyles: Record<CardVariant, string> = {
      default:
        "bg-white text-slate-800 border border-slate-200 hover:shadow-xl",
      elevated:
        "bg-white border border-transparent shadow-md",
      outlined:
        "bg-slate-50 border border-slate-200",
      subtle:
        "bg-slate-50 border border-transparent",
      figma:
        "border border-[#1761A3] shadow-[0_4px_4px_rgba(0,0,0,0.25)]",
    };

    /* ================= SIZE STYLES ================= */

    const sizeStyles: Record<CardSize, string> = {
      sm: "p-4",
      default: "p-6",
      lg: "p-8",
      figma: "w-full max-w-full p-5 box-border",
    };

    return (
      <div
        className={flippable ? "perspective-[1000px]" : ""}
        onClick={flippable ? handleFlip : undefined}
      >
        <div
          ref={ref}
          data-testid={testId}
          className={`
            rounded-[14px]
            transition-all duration-300 ease-in-out
            shadow-[0_4px_4px_rgba(0,0,0,0.25)]
            ${variantStyles[variant]}
            ${sizeStyles[size]}
            ${flippable ? "relative cursor-pointer transform-style-preserve-3d transition-transform duration-700 ease-in-out" : ""}
            ${isFlipped ? "rotate-y-180" : ""}
            ${className}
          `}
          style={{
            backgroundColor:
              variant !== "figma" && backgroundColor
                ? backgroundColor
                : variant === "figma"
                ? backgroundColor || "rgba(77,175,131,0.10)"
                : undefined,
            borderRadius: borderRadius || "14px",
            ...style,
          }}
          {...props}
        >
          {/* FRONT FACE */}

          <div className={flippable ? "backface-hidden" : ""}>
            {title && (
              <div
                className={`flex items-center justify-between ${
                  open && mainContent ? "mb-4" : ""
                }`}
              >
                <h4 className="text-xl font-semibold text-slate-800 leading-7">
                  {title}
                </h4>

                {collapsible && (
                  <button
                    type="button"
                    onClick={(e) => {
                      if (flippable) e.stopPropagation();
                      setOpen((p) => !p);
                    }}
                    aria-label={open ? "Hide content" : "Show content"}
                    aria-expanded={open}
                    aria-controls={contentId}
                    className="
                      z-10 flex items-center justify-center
                      w-8 h-8 rounded-full
                      bg-[#1761A3]
                      hover:opacity-80
                      focus:outline-none
                      focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-[#1761A3]
                    "
                  >
                    {open ? (
                      <ChevronUp className="w-5 h-5 text-white" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-white" />
                    )}
                  </button>
                )}
              </div>
            )}

            {mainContent && (
              <div
                id={contentId}
                className={`
                  grid overflow-hidden
                  transition-[grid-template-rows,opacity]duration-500 ease-in-out
                  ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}
                `}
              >
                <div className="overflow-hidden">
                  {mainContent as any}
                </div>
              </div>
            )}
          </div>

          {/* BACK FACE */}

          {flippable && cardBackContent && (
            <div
              className="
                absolute inset-0
                w-full h-full
                p-6
                rotate-y-180
                backface-hidden
              "
            >
              {cardBackContent as any}
            </div>
          )}
        </div>
      </div>
    );
  }
) as any;

Card.displayName = "Card";

export { Card };
export type { CardProps, CardVariant, CardSize };