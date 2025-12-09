// lib/src/components/button.tsx
import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-blue-600 text-white hover:bg-blue-700 rounded-md",
        primary: "bg-blue-600 text-white hover:bg-blue-700 rounded-md",
        destructive: "bg-red-600 text-white hover:bg-red-700 rounded-md",
        outline: "border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 rounded-md",
        secondary: "bg-slate-100 text-slate-800 hover:bg-slate-200 rounded-md",
        ghost: "hover:bg-slate-100 hover:text-slate-900 rounded-md",
        link: "text-blue-600 underline-offset-4 hover:underline",
        
        // Fixed dotted variant - more visible dashed border
        dotted: "border-2 border-dashed border-slate-400 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-500 rounded-md",
        
        // Fixed pill variant - always rounded-full
        pill: "rounded-full bg-blue-600 text-white hover:bg-blue-700",
      },
      size: {
        default: "h-10 px-6 py-2",
        sm: "h-8 px-4 py-1 text-xs",
        lg: "h-12 px-8 py-3 text-base",
        icon: "h-10 w-10 rounded-full",
      },
    },
    compoundVariants: [
      // Ensure pill variant has proper sizing
      {
        variant: "pill",
        size: "default",
        className: "px-6 py-2",
      },
      {
        variant: "pill",
        size: "sm",
        className: "px-4 py-1 text-xs",
      },
      {
        variant: "pill",
        size: "lg",
        className: "px-8 py-3 text-base",
      },
      // Ensure icon pill is properly rounded
      {
        variant: "pill",
        size: "icon",
        className: "rounded-full",
      },
    ],
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
} 

const MahatiButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    // If asChild is true, you might want to handle child component merging here
    // For now, we'll keep it simple with a regular button
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

MahatiButton.displayName = "MahatiButton";

export { MahatiButton, buttonVariants };

