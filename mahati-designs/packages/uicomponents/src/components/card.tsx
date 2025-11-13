"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// const cardVariants = cva(
//   "rounded-lg transition-colors transition-shadow",
//   {
//     variants: {
//       variant: {
//         default: "bg-primary text-primary-foreground hover:bg-primary/90",
//         elevated: "bg-white shadow-md",
//         outline: "bg-slate-50 border border-slate-200",
//         subtle: "bg-slate-50",
//       },
//       size: {
//         default: "p-6",
//         sm: "p-4",
//         lg: "p-8",
//       },
//     },
//     defaultVariants: {
//       variant: "default",
//       size: "default",
//     },
//   }
// );

const cardVariants = cva(
  "rounded-lg transition-colors transition-shadow",
  {
    variants: {
      variant: {
        // Use a light background with dark text so headers are readable
        default: "bg-white text-slate-800 border border-slate-200 shadow-sm hover:shadow-md",
        elevated: "bg-white shadow-md",
        outline: "bg-slate-50 border border-slate-200",
        subtle: "bg-slate-50",
      },
      size: {
        default: "p-6",
        sm: "p-4",
        lg: "p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  asChild?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (
      <Comp
        ref={ref}
        className={cn(cardVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";

export { Card, cardVariants };
export default Card;
