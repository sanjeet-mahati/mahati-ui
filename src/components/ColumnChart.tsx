"use client";
import React from "react";

export interface ColumnItem {
  name: string;
  value: number;
  color?: string;
  gradient?: string;
}

export interface ColumnChartYAxisConfig {
  min: number;
  max: number;
  step: number;
  labels: number[];
}

export interface ColumnChartData {
  title: string;
  yAxis?: Record<string, ColumnChartYAxisConfig>;
  [year: string]: string | Record<string, any> | undefined;
}

export interface ColumnChartProps {
  title: string;
  columns: ColumnItem[];
  selectedYear: string;
  selectedMonth: string;
  selectedType: string;
  yAxisConfig?: {
    min: number;
    max: number;
    step: number;
    labels: number[];
  };
}

const defaultGradient =
  "linear-gradient(180deg, rgba(77, 175, 131, 1) 0%, rgba(23, 97, 163, 1) 100%)";

export const ColumnChart: React.FC<ColumnChartProps> = ({
  title,
  columns,
  yAxisConfig,
}) => {
  const safeColumns = columns || [];
  const maxValue = yAxisConfig?.max || 8000;
  const minValue = yAxisConfig?.min || 0;
  const yAxisLabels = yAxisConfig?.labels || [0, 2000, 4000, 6000, 8000];

  const formatValue = (value: number): string => {
    if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
    return value.toString();
  };

  const calculateHeight = (value: number): number => {
    if (maxValue === minValue) return 0;
    const percentage = ((value - minValue) / (maxValue - minValue)) * 100;
    return Math.max(0, Math.min(100, percentage));
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-[rgba(23,97,163,1)] font-[Poppins,sans-serif] text-sm font-semibold leading-normal sm:text-base">
          {title}
        </div>
        <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-[rgba(243,244,246,1)] bg-transparent border-none cursor-pointer transition-colors sm:w-8 sm:h-8">
          <div className="flex gap-1">
            <span className="w-1 h-1 bg-[rgba(107,114,128,1)] rounded-full" />
            <span className="w-1 h-1 bg-[rgba(107,114,128,1)] rounded-full" />
            <span className="w-1 h-1 bg-[rgba(107,114,128,1)] rounded-full" />
          </div>
        </button>
      </div>

      {/* Chart Wrapper */}
      <div className="flex flex-col flex-1 relative min-h-[300px] w-full">
        {/* Chart Area */}
        <div className="flex flex-row w-full flex-1 relative">
          {/* Y-Axis Labels */}
          <div className="flex flex-col justify-between items-end pr-2 w-10 h-[250px] flex-shrink-0">
            {yAxisLabels
              .slice()
              .reverse()
              .map((label, idx) => (
                <span
                  key={`y-${idx}`}
                  className="text-[rgba(94,94,94,1)] font-[Poppins,sans-serif] text-[10px] font-normal sm:text-xs"
                >
                  {label >= 1000 ? `${label / 1000}k` : label}
                </span>
              ))}
          </div>

          {/* Chart Content Area */}
          <div className="flex-1 relative flex flex-col h-[250px]">
            {/* Grid Lines & Axes */}
            <div className="absolute inset-0 pointer-events-none">
              {yAxisLabels.map((label, idx) => {
                const position =
                  100 -
                  ((label - yAxisLabels[0]) /
                    (yAxisLabels[yAxisLabels.length - 1] - yAxisLabels[0])) *
                    100;
                return (
                  <div
                    key={`grid-${idx}`}
                      data-testid={`column-${idx}`}
                    className="absolute left-0 right-0 h-px bg-[rgba(229,231,235,1)] z-[1]"
                    style={{ top: `${position}%` }}
                  />
                );
              })}
              {/* Y-Axis Line */}
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[rgba(125,125,125,1)] z-[2]" />
              {/* X-Axis Line */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[rgba(125,125,125,1)] z-[2]" />
            </div>

            {/* Columns */}
            <div className="relative flex-1 flex items-end justify-start px-[10px] h-full z-10 gap-0">
              {safeColumns.map((column, index) => {
                const columnHeightPercentage = calculateHeight(column.value);
                const gradient = column.gradient || column.color || defaultGradient;

                return (
                  <div
                    key={`${column.name}-${index}`}
                    className="flex-1 flex flex-col items-center justify-end relative max-w-[100px] h-full px-1"
                  >
                    <div
                      className="w-full max-w-[60px] rounded-t-[4px] rounded-b-none relative transition-all duration-300 min-h-[2px] hover:opacity-85 hover:-translate-y-0.5"
                      style={{
                        height: `${columnHeightPercentage}%`,
                        background: gradient,
                      }}
                    >
                      {/* Value Label */}
                      <div className="absolute top-[-24px] left-1/2 -translate-x-1/2 text-[rgba(94,94,94,1)] font-[Poppins,sans-serif] text-[11px] font-medium whitespace-nowrap sm:text-xs sm:top-[-26px]">
                        {formatValue(column.value)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* X-Axis Labels */}
        <div
          className="flex justify-start px-[10px] mt-3"
          style={{ marginLeft: "40px", width: "calc(100% - 40px)" }}
        >
          {safeColumns.map((column, index) => (
            <div
              key={`label-${index}`}
              className="flex-1 flex justify-center items-start max-w-[100px] px-1 min-w-0"
            >
              <span className="text-[rgba(94,94,94,1)] font-[Poppins,sans-serif] text-[11px] font-normal text-center break-words hyphens-auto leading-[1.3] max-w-full whitespace-normal sm:text-xs">
                {column.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

ColumnChart.displayName = "ColumnChart";