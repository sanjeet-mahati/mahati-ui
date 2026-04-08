"use client";

import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "danger" | "dotted" | "pill";
  size?: "default" | "sm" | "md" | "lg" | "icon";
  name?: string;
  iconButton?: boolean;
  iconButtonHeightClass?: string;
  iconButtonWidthClass?: string;
  iconButtonBgClass?: string;
  iconButtonRadiusClass?: string;
  iconButtonBgPaddingClass?: string;
  iconButtonHoverBgClass?: string;
  iconButtonHoverIntensity?: number;
  testId?: string;
}

export interface IconButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: "row" | "col";
  gapClass?: string;
}

/* =========================================================
   HELPERS (UNCHANGED)
========================================================= */

const parseHeightWidth = (className?: string): string => {
  if (!className) return "36px";
  const match = className.match(/[hw]-(\d+)/);
  if (match) {
    return `${parseInt(match[1]) * 4}px`;
  }
  return "36px";
};

const parseGap = (gapClass?: string): string => {
  if (!gapClass) return "8px";
  const match = gapClass.match(/gap-(\d+)/);
  if (match) {
    return `${parseInt(match[1]) * 4}px`;
  }
  return "8px";
};

const getColorByName = (name?: string): string => {
  const colors: Record<string, string> = {
    blue: "#3b82f6",
    green: "#10b981",
    red: "#ef4444",
    orange: "#f59e0b",
    purple: "#8b5cf6",
    yellow: "#f59e0b",
    pink: "#ec4899",
    teal: "#14b8a6",
    indigo: "#6366f1",
    primary: "linear-gradient(to right, rgba(23, 97, 163, 1), rgba(77, 175, 131, 1))",
    secondary: "#6b7280",
    success: "#10b981",
    danger: "#ef4444",
    warning: "#f59e0b",
    info: "#3b82f6",
  };

  return colors[name?.toLowerCase() as keyof typeof colors] || colors.primary;
};

/* =========================================================
   ICON BUTTON GROUP
========================================================= */

const IconButtonGroup = React.forwardRef<HTMLDivElement, IconButtonGroupProps>(
  ({ className, direction = "row", gapClass, children, ...props }, ref) => {
    const gap = parseGap(gapClass);
    

    return (
      <div
        ref={ref}
        style={{ gap }}
        className={`inline-flex ${
          direction === "col" ? "flex-col items-start" : "flex-row items-center"
        } ${className || ""}`}
        {...props}
      >
        {children as any}
      </div>
    );
  }
);

IconButtonGroup.displayName = "IconButtonGroup";

/* =========================================================
   VARIANT CLASSES
========================================================= */

const variantClasses: Record<string, string> = {
  // ✅ Fixed: was from-[31761A3] — missing #
  default:
    "bg-gradient-to-r from-[#1761A3] to-[#4DAF83] text-white rounded-md hover:opacity-90 active:opacity-95",

  destructive:
    "bg-[#ef4444] text-white rounded-md hover:bg-[#dc2626] active:bg-[#b91c1c]",

  outline:
    "border border-[#e5e7eb] bg-white text-[#374151] rounded-md hover:bg-[#f9fafb] hover:border-[#d1d5db] active:bg-[#f3f4f6]",

  // ✅ Fixed: was bg-gray-200 text-gray-700 — now matches CSS-in-JS blue
  secondary:
    "bg-[#3b82f6] text-white rounded-md hover:bg-[#2563eb] active:bg-[#1d4ed8]",

  ghost:
    "bg-transparent text-[#374151] rounded-md hover:bg-[#f3f4f6] active:bg-[#e5e7eb]",

  link:
    "bg-transparent text-[#2563eb] underline underline-offset-4 p-0 h-auto hover:no-underline hover:text-[#1d4ed8]",

  danger:
    "bg-transparent text-[#ef4444] rounded-md hover:bg-[#ef44441a] active:bg-[#ef444433]",

   dotted:
    "relative [background:linear-gradient(to_right,#1e73be,#28a97d)] text-white rounded-lg border-2 border-dashed border-white/50 hover:opacity-90",
  pill:
    "[background:linear-gradient(to_right,#1761A3,#4DAF83)] text-white rounded-full hover:opacity-90 active:opacity-95",
};

/* =========================================================
   SIZE CLASSES
========================================================= */

const sizeClasses: Record<string, string> = {
  sm: "h-[36px] px-3 text-[13px]",
  md: "h-[40px] px-4 text-[14px]",
  lg: "h-[44px] px-6 text-[15px]",
  icon: "h-[40px] w-[40px]",
  default: "h-[40px] px-4",
};

/* =========================================================
   BUTTON COMPONENT
========================================================= */

const ButtonBase = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      name,
      iconButton = false,
      iconButtonHeightClass,
      iconButtonWidthClass,
      iconButtonBgClass,
      iconButtonRadiusClass,
      iconButtonBgPaddingClass,
      iconButtonHoverBgClass,
      iconButtonHoverIntensity,
      children,
      testId,
      style,
      ...props
    },
    ref
  ) => {
    const color = getColorByName(name);
    const getHoverStyles = () => {
  if (iconButtonHoverBgClass) return {};

  if (iconButtonHoverIntensity) {
    const opacity = iconButtonHoverIntensity / 100;

    return {
      "--hover-bg": `rgba(0,0,0,${opacity})`,
      "--active-bg": `rgba(0,0,0,${Math.min(opacity + 0.2, 1)})`,
    } as React.CSSProperties;
  }

  return {};
};

    /* ================= ICON BUTTON ================= */

    if (iconButton) {
      const height = parseHeightWidth(iconButtonHeightClass);
      const width = parseHeightWidth(iconButtonWidthClass);

      return (
        <button
          ref={ref}
          style={{
            height,
            width,
            minHeight: height,
            minWidth: width,
            color: color.startsWith("linear") ? "white" : color,
            ...(iconButtonHoverIntensity && {
    "--hover-bg": `rgba(0,0,0,${iconButtonHoverIntensity / 100})`,
    "--active-bg": `rgba(0,0,0,${Math.min(
      iconButtonHoverIntensity / 100 + 0.2,
      1
    )})`,
  }),
            ...style,
          }}
         className={`
  inline-flex items-center justify-center
  transition-all duration-200
  ${iconButtonRadiusClass || "rounded-md"}
  ${iconButtonBgPaddingClass || "p-[2px]"}
  ${iconButtonBgClass || "bg-white/10"}

  ${
  iconButtonHoverBgClass
    ? iconButtonHoverBgClass
    : iconButtonHoverIntensity
    ? "hover:bg-[var(--hover-bg)] active:bg-[var(--active-bg)]"
    : "hover:opacity-85 active:opacity-70"
}

  ${className || ""}
`}
          {...props}
        >
          {children as any}
        </button>
      );
    }

    /* ================= NORMAL BUTTON ================= */

    return (
      <button
        ref={ref}
        data-testid={testId}
        style={
          name
            ? {
                background: color,
                color: "white",
                borderRadius: variant === "pill" ? "9999px" : "6px",
                ...style,
              }
            : style
        }
        className={`
          inline-flex items-center justify-center
          whitespace-nowrap
          font-medium
          text-[14px]
          transition-all duration-200
          cursor-pointer
          focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400
          disabled:pointer-events-none disabled:opacity-50
          ${!name ? variantClasses[variant] : ""}
          ${sizeClasses[size]}
          ${className || ""}
        `}
        {...props}
      >
        <span 
        className={`${ iconButtonBgPaddingClass || "p-[2px]"} flex items-center justify-center`}>
        {children as any}
        </span>
      </button>
    );
  }
) as any;

ButtonBase.displayName = "Button";

/* =========================================================
   EXPORT WITH GROUP
========================================================= */

type ButtonWithGroup = typeof ButtonBase & {
  IconButtonGroup: typeof IconButtonGroup;
};

const Button = ButtonBase as ButtonWithGroup;
Button.IconButtonGroup = IconButtonGroup;

export { Button };