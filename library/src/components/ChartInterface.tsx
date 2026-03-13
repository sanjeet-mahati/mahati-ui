"use client";
import React, { useEffect, useRef } from "react";
import styled from "@emotion/styled";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

// ============================================================================
// STYLED COMPONENTS
// ============================================================================

const ChartContainer = styled.div<{
  $variant: string;
  $size: string;
}>`
  border-radius: 8px;
  transition: all 0.2s;

  /* Variant Styles */
  ${(props) => {
    switch (props.$variant) {
      case "filled":
        return `
          background: rgba(249, 250, 251, 1);
          border: 1px solid rgba(209, 213, 219, 1);
          padding: 16px;
        `;
      case "elevated":
        return `
          background: white;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          padding: 16px;
        `;
      case "flat":
        return `
          background: transparent;
          padding: 0;
        `;
      case "card":
        return `
          background: white;
          border: 1px solid rgba(229, 231, 235, 1);
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
          padding: 24px;
        `;
      default: // default variant
        return `
          background: white;
          border: 1px solid rgba(229, 231, 235, 1);
          padding: 16px;
        `;
    }
  }}

  /* Size Styles */
  ${(props) => {
    switch (props.$size) {
      case "sm":
        return `height: 192px;`;
      case "lg":
        return `height: 384px;`;
      case "xl":
        return `height: 500px;`;
      default: // default size
        return `height: 256px;`;
    }
  }}
`;

const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
`;

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
  testId?:string;
}

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
      JSON.stringify(data), // Forces re-render on data change
      JSON.stringify(options), // Forces re-render on options change
    ]);

    return (
      <ChartContainer
       data-testid={testId}
        ref={ref}
        $variant={variant}
        $size={size}
        className={className}
        {...props}
      >
        <Canvas ref={canvasRef} />
      </ChartContainer>
    );
  }
);

ChartInterface.displayName = "ChartInterface";

// Export for backward compatibility
export const chartVariants = {
  default: "default",
  filled: "filled",
  elevated: "elevated",
  flat: "flat",
  card: "card",
};