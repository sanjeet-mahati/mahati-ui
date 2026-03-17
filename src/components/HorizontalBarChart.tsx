"use client";
import React from "react";

export interface HorizontalBarItem {
  name: string;
  value: number;
  color: string;
}

export interface HorizontalBarXAxisConfig {
  min: number;
  max: number;
  step: number;
  labels: number[];
}

export interface HorizontalBarTopPerformer {
  category: string;
  name: string;
  revenue: string;
  profit: string;
  needsFocus: string;
  change: string;
  isIncrease?: boolean;
}

export interface HorizontalBarProductData {
  title: string;
  xAxis?: Record<string, HorizontalBarXAxisConfig>;
  [year: string]: string | Record<string, any> | undefined;
}

export interface HorizontalBarData {
  title: string;
  xAxis?: Record<string, { min: number; max: number; step: number; labels: number[] }>;
  [year: string]: string | Record<string, any> | undefined;
}

export interface HorizontalBarChartData {
  data: HorizontalBarProductData;
  topPerformer?: HorizontalBarTopPerformer;
}

export interface HorizontalBarChartProps {
  title: string;
  bars: HorizontalBarItem[];
  selectedYear: string;
  selectedMonth: string;
  selectedType: string;
  xAxisConfig?: {
    min: number;
    max: number;
    step: number;
    labels: number[];
  };
  topPerformer?: {
    category: string;
    name: string;
    revenue: string;
    profit: string;
    needsFocus: string;
    change: string;
    isIncrease?: boolean;
  };
  testId?: string;
}

export const HorizontalBarChart: React.FC<HorizontalBarChartProps> = ({
  title,
  bars,
  xAxisConfig,
  topPerformer,
  testId,
}) => {
  const safeBars = bars || [];

  return (
    <div className="w-full h-full flex flex-col" data-testid={testId}>
      {/* Header - menu button aligned right */}
      <div className="flex items-center justify-end mb-[2px]">
        <button
          className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded transition-colors hover:bg-[rgba(243,244,246,1)] bg-transparent border-none cursor-pointer"
          data-testid={testId ? `${testId}-menu-button` : undefined}
        >
          <div className="flex gap-[2px] sm:gap-1">
            {[0, 1, 2].map((i) => (
              <span key={i} className="w-[2px] h-[2px] sm:w-1 sm:h-1 rounded-full" style={{ backgroundColor: "rgba(107,114,128,1)" }} />
            ))}
          </div>
        </button>
      </div>

      {/* Title */}
      <div
        className="mb-6"
        style={{ color: "rgba(23,97,163,1)", fontFamily: "Poppins, sans-serif", fontSize: "14px", fontWeight: 600 }}
        data-testid={testId ? `${testId}-title` : undefined}
      >
        {title}
      </div>

      {/* Chart Content */}
      <div className="flex items-start gap-4">
        {/* Labels Column */}
        <div className="flex flex-col justify-start pt-1" style={{ minHeight: "180px" }}>
          {safeBars.map((bar, index) => (
            <div
              key={bar.name}
              className="flex items-center"
              style={{ height: "45px", marginBottom: index < safeBars.length - 1 ? "10px" : 0 }}
              data-testid={testId ? `${testId}-label-${index}` : undefined}
            >
              <span
                style={{
                  color: "rgba(94,94,94,1)",
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "12px",
                  fontWeight: 400,
                  whiteSpace: "nowrap",
                }}
                className="sm:text-sm"
              >
                {bar.name}
              </span>
            </div>
          ))}
        </div>

        {/* Chart Area */}
        <div className="flex-1 relative">
          {/* Grid */}
          <div className="absolute inset-0 pointer-events-none" style={{ height: "180px" }}>
            {xAxisConfig &&
              xAxisConfig.labels.map((label, idx) => {
                const totalLabels = xAxisConfig.labels.length;
                const position = (idx / (totalLabels - 1)) * 100;
                const approxCharWidth = 7;
                const centerOffset = (String(label).length * approxCharWidth) / 2;
                return (
                  <div
                    key={idx}
                    className="absolute top-0 w-px z-[1]"
                    style={{
                      left: `calc(${position}% - ${centerOffset}px)`,
                      height: "165px",
                      backgroundColor: "rgba(229,231,235,1)",
                    }}
                  />
                );
              })}
            {/* Y axis */}
            <div className="absolute left-0 top-0 w-[2px] z-[2]" style={{ height: "165px", backgroundColor: "rgba(125,125,125,1)" }} />
            {/* X axis */}
            <div className="absolute left-0 right-0 h-[2px] z-[2]" style={{ bottom: "15px", backgroundColor: "rgba(125,125,125,1)" }} />
          </div>

          {/* Bars */}
          <div className="flex flex-col pt-1 relative z-10" style={{ minHeight: "180px" }}>
            {safeBars.map((bar, index) => {
              const maxVal = xAxisConfig?.max || 250;
              const barLengthPercentage = (bar.value / maxVal) * 100;

              return (
                <div
                  key={bar.name}
                  className="flex items-center"
                  style={{ height: "45px", marginBottom: index < safeBars.length - 1 ? "10px" : 0 }}
                  data-testid={testId ? `${testId}-row-${index}` : undefined}
                >
                  <div className="relative h-[30px] w-full">
                    <div
                      className="absolute top-0 left-0 h-[30px] rounded"
                      style={{ width: `${barLengthPercentage}%`, background: bar.color }}
                      data-testid={testId ? `${testId}-bar-${index}` : undefined}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* X Axis Labels */}
          <div className="flex justify-between items-start w-full relative z-10" style={{ marginTop: "-8px" }}>
            {xAxisConfig &&
              xAxisConfig.labels.map((label, idx) => (
                <span
                  key={idx}
                  style={{ color: "rgba(94,94,94,1)", fontFamily: "Poppins, sans-serif", fontSize: "10px", fontWeight: 400 }}
                  className="sm:text-xs"
                >
                  {label}
                </span>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

HorizontalBarChart.displayName = "HorizontalBarChart";