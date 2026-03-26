"use client";
import React, { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

// ============================================================================
// TYPES
// ============================================================================

export interface MahatiChartProps {
  type?: "line" | "bar" | "pie" | "doughnut" | "polarArea" | "radar";
  data: any;
  options?: any;
  variant?: "default" | "filled" | "elevated" | "flat" | "card";
  size?: "sm" | "default" | "lg" | "xl";
  className?: string;
  testId?: string;
}

// ============================================================================
// HELPERS
// ============================================================================

const getVariantClasses = (variant: string): string => {
  switch (variant) {
    case "filled":
      return "bg-[rgba(249,250,251,1)] border border-[rgba(209,213,219,1)] p-4 rounded-lg";
    case "elevated":
      return "bg-white shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)] p-4 rounded-lg";
    case "flat":
      return "bg-transparent p-0 rounded-lg";
    case "card":
      return "bg-white border border-[rgba(229,231,235,1)] shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] p-6 rounded-lg";
    default:
      return "bg-white border border-[rgba(229,231,235,1)] p-4 rounded-lg";
  }
};

const getSizeClasses = (size: string): string => {
  switch (size) {
    case "sm":   return "h-48";
    case "lg":   return "h-96";
    case "xl":   return "h-[500px]";
    default:     return "h-64";
  }
};

// ============================================================================
// COMPONENT
// ============================================================================

export const ChartInterface = React.forwardRef<HTMLDivElement, MahatiChartProps>(
  (
    {
      testId,
      type = "line",
      data,
      options = {},
      variant = "default",
      size = "default",
      className,
      ...props
    },
    ref
  ) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const chartInstanceRef = useRef<Chart | null>(null);

    useEffect(() => {
      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx) return;

      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }

      const safeData = JSON.parse(JSON.stringify(data));
      const safeOptions = JSON.parse(JSON.stringify(options));

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
      JSON.stringify(data),
      JSON.stringify(options),
    ]);

    return (
      <div
        data-testid={testId}
        ref={ref}
        className={`transition-all duration-200 ${getVariantClasses(variant)} ${getSizeClasses(size)} ${className || ""}`}
        {...props}
      >
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>
    );
  }
);

ChartInterface.displayName = "ChartInterface";

export const chartVariants = {
  default: "default",
  filled: "filled",
  elevated: "elevated",
  flat: "flat",
  card: "card",
};