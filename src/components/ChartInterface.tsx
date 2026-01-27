'use client';

import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { cva, type VariantProps } from 'class-variance-authority';

Chart.register(...registerables);

/* ---------------------- UTILS ---------------------- */
const cn = (...classes: (string | undefined | null | false)[]) =>
  classes.filter(Boolean).join(' ');

/* ---------------------- VARIANTS ---------------------- */
const chartVariants = cva(
  "rounded-lg transition-all",
  {
    variants: {
      variant: {
        default: "bg-white border border-gray-200 p-4",
        filled: "bg-gray-50 border border-gray-300 p-4",
        elevated: "bg-white shadow-lg p-4",
        flat: "bg-transparent p-0",
        card: "bg-white border border-gray-200 shadow-sm p-6",
      },
      size: {
        sm: "h-48",
        default: "h-64",
        lg: "h-96",
        xl: "h-[500px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface MahatiChartProps extends VariantProps<typeof chartVariants> {
  type?: 'line' | 'bar' | 'pie' | 'doughnut' | 'polarArea' | 'radar';
  data: any;
  options?: any;
  className?: string;
}

/* ---------------------- FIXED CHART COMPONENT ---------------------- */
const ChartInterface = React.forwardRef<HTMLDivElement, MahatiChartProps>(
  ({ type = 'line', data, options = {}, variant, size, className, ...props }, ref) => {

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const chartInstanceRef = useRef<Chart | null>(null);

    useEffect(() => {
      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx) return;

      /** 💥 DESTROY ANY EXISTING INSTANCE BEFORE RECREATING */
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }

      /** 💥 ALWAYS CLONE DATA TO FORCE UPDATE */
      const safeData = JSON.parse(JSON.stringify(data));
      const safeOptions = JSON.parse(JSON.stringify(options));

      /** 💥 CREATE NEW CHART INSTANCE */
      chartInstanceRef.current = new Chart(ctx, {
        type,
        data: safeData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          ...safeOptions,
        },
      });

      return () => {
        if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy();
          chartInstanceRef.current = null;
        }
      };
    }, [
      type,
      JSON.stringify(data),     // Forces re-render on data change
      JSON.stringify(options),  // Forces re-render on options change
    ]);

    return (
      <div
        ref={ref}
        className={cn(chartVariants({ variant, size }), className)}
        {...props}
      >
        <canvas ref={canvasRef} />
      </div>
    );
  }
);

ChartInterface.displayName = "ChartInterface";

export { ChartInterface, chartVariants };
