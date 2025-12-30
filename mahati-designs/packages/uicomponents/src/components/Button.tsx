import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "purple",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        danger: "hover:text-white hover:bg-primary/90",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        md: "rounded-md px-2",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;

  iconButton?: boolean;

  iconButtonHeightClass?: string;
  iconButtonWidthClass?: string;

  iconButtonBgClass?: string;
  iconButtonRadiusClass?: string;

  iconButtonBgPaddingClass?: string;

  iconButtonHoverBgClass?: string;

  iconButtonHoverIntensity?: number;
}

export interface IconButtonGroupProps
  extends React.HTMLAttributes<HTMLDivElement> {
  direction?: "row" | "col";
  gapClass?: string;
}

const IconButtonGroup = React.forwardRef<HTMLDivElement, IconButtonGroupProps>(
  ({ className, direction = "row", gapClass = "gap-2", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex",
          direction === "row" ? "flex-row items-center" : "flex-col items-start",
          gapClass,
          className
        )}
        {...props}
      />
    );
  }
);

IconButtonGroup.displayName = "IconButtonGroup";

function getHoverIntensityClasses(intensity?: number): string {
  if (intensity == null) return "";
  const v = Math.max(0, Math.min(100, intensity));

  if (v === 0) return "";

  if (v <= 10) return "hover:opacity-95 active:opacity-90";
  if (v <= 25) return "hover:opacity-90 active:opacity-80";
  if (v <= 40) return "hover:opacity-85 active:opacity-75";
  if (v <= 55) return "hover:opacity-80 active:opacity-70";
  if (v <= 70) return "hover:opacity-75 active:opacity-65";
  if (v <= 85) return "hover:opacity-70 active:opacity-60";
  return "hover:opacity-60 active:opacity-50"; 
}

const ButtonBase = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      iconButton = false,
      iconButtonHeightClass,
      iconButtonWidthClass,
      iconButtonBgClass,
      iconButtonRadiusClass,
      iconButtonBgPaddingClass,
      iconButtonHoverBgClass,
      iconButtonHoverIntensity,
      children,
      ...props
    },
    ref
  ) => {
    const hasCustomIconBg = Boolean(iconButtonBgClass);

    if (iconButton) {
      const defaultHoverOverlay = hasCustomIconBg
        ? "hover:bg-white/10 active:bg-white/15"
        : "hover:bg-white/10 active:bg-white/15";

      const intensityClasses = getHoverIntensityClasses(iconButtonHoverIntensity);

      return (
        <button
          className={cn(
            buttonVariants({ variant, size, className }),
            "!bg-transparent hover:!bg-transparent active:!bg-transparent",
            "p-0 inline-flex items-center justify-center",
            "text-white/90 hover:text-white",
            "focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
            iconButtonHeightClass ?? "h-9",
            iconButtonWidthClass ?? "w-9"
          )}
          ref={ref}
          {...props}
        >
          <span
            className={cn(
              "inline-flex items-center justify-center overflow-hidden transition-colors",
              iconButtonRadiusClass ?? "rounded-md",
              iconButtonBgPaddingClass ?? "p-[2px]",
              hasCustomIconBg ? iconButtonBgClass : "bg-transparent",
              iconButtonHoverBgClass ?? defaultHoverOverlay,
              intensityClasses 
            )}
          >
            {children}
          </span>
        </button>
      );
    }

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

ButtonBase.displayName = "Button";

type ButtonWithGroup = typeof ButtonBase & {
  IconButtonGroup: typeof IconButtonGroup;
};

const Button = ButtonBase as ButtonWithGroup;
Button.IconButtonGroup = IconButtonGroup;

export { Button };
