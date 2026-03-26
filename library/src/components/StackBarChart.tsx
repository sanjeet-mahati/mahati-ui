"use client";
import React, { useState } from "react";

export interface StackBarLegendItem {
  key: string;
  label: string;
  color: string;
}

export interface StackBarDayData {
  day: string;
  aggregating: number;
  outstanding: number;
  writeOff: number;
}

export interface StackBarChartYAxisConfig {
  min: number;
  max: number;
  step: number;
  labels: number[];
}

export interface StackBarChartData {
  title: string;
  legends?: StackBarLegendItem[];
  yAxis?: Record<string, StackBarChartYAxisConfig>;
  [year: string]: string | Record<string, any> | undefined;
}

export interface StackBarChartProps {
  title: string;
  data: StackBarDayData[];
  legends?: StackBarLegendItem[];
  selectedYear: string;
  selectedMonth: string;
  selectedWeek: string;
  selectedType: string;
  yAxisConfig?: {
    min: number;
    max: number;
    step: number;
    labels: number[];
  };
  allData?: StackBarChartData;
}

interface TooltipData {
  day: string;
  type: "aggregating" | "outstanding" | "writeOff";
  value: number;
  label: string;
  x: number;
  y: number;
}

const DEFAULT_COLORS = {
  aggregating: "rgba(37,99,235,1)",
  outstanding: "rgba(34,197,94,1)",
  writeOff: "rgba(239,68,68,1)",
};

export const StackBarChart: React.FC<StackBarChartProps> = ({
  title,
  data,
  legends,
  yAxisConfig,
}) => {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  const safeData = data || [];
  const maxValue = yAxisConfig?.max || 125;
  const minValue = yAxisConfig?.min || 0;
  const yAxisLabels = yAxisConfig?.labels || [0, 25, 50, 75, 100, 125];

  const getColorMap = (): Record<string, string> => {
    if (!legends || legends.length === 0) return DEFAULT_COLORS;
    const colorMap: Record<string, string> = {};
    legends.forEach((legend) => { colorMap[legend.key] = legend.color; });
    return colorMap;
  };
  const COLORS = getColorMap();

  const getLabel = (key: string): string => {
    if (legends && legends.length > 0) {
      const legend = legends.find((l) => l.key === key);
      if (legend) return legend.label;
    }
    const defaultLabels: Record<string, string> = {
      aggregating: "Aggregating Amount",
      outstanding: "Outstanding Amount",
      writeOff: "Write-Off Amount",
    };
    return defaultLabels[key] || key;
  };

  const formatValue = (value: number): string => {
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`;
    return `$${value}`;
  };

  const calculateHeight = (value: number): number => {
    if (maxValue === minValue) return 0;
    return Math.max(0, Math.min(100, ((value - minValue) / (maxValue - minValue)) * 100));
  };

  const handleSegmentMouseEnter = (
    event: React.MouseEvent<HTMLDivElement>,
    dayData: StackBarDayData,
    type: "aggregating" | "outstanding" | "writeOff"
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltip({ day: dayData.day, type, value: dayData[type], label: getLabel(type), x: rect.left + rect.width / 2, y: rect.top });
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div style={{ color: "rgba(23,97,163,1)", fontFamily: "Poppins, sans-serif", fontSize: "14px", fontWeight: 600 }} className="sm:text-base">{title}</div>
        <button className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded bg-transparent border-none cursor-pointer transition-colors hover:bg-[rgba(243,244,246,1)]">
          <div className="flex gap-[2px] sm:gap-1">
            {[0, 1, 2].map((i) => (
              <span key={i} className="w-[2px] h-[2px] sm:w-1 sm:h-1 rounded-full" style={{ backgroundColor: "rgba(107,114,128,1)" }} />
            ))}
          </div>
        </button>
      </div>

      {/* Chart */}
      <div className="flex-1 flex flex-col relative min-h-[300px] w-full">
        <div className="flex-1 relative flex flex-row w-full">
          {/* Y-Axis */}
          <div className="flex flex-col justify-between items-start pr-2 flex-shrink-0" style={{ width: "40px", height: "250px" }}>
            {yAxisLabels.slice().reverse().map((label, idx) => (
              <span key={idx} style={{ color: "rgba(94,94,94,1)", fontFamily: "Poppins, sans-serif", fontSize: "10px", fontWeight: 400 }} className="sm:text-xs">
                ${label}
              </span>
            ))}
          </div>

          {/* Chart Content */}
          <div className="flex-1 relative flex flex-col" style={{ height: "250px" }}>
            {/* Grid & Axes */}
            <div className="absolute inset-0 pointer-events-none">
              {yAxisLabels.map((label, idx) => {
                const position = 100 - ((label - yAxisLabels[0]) / (yAxisLabels[yAxisLabels.length - 1] - yAxisLabels[0])) * 100;
                return (
                  <div key={idx} className="absolute left-0 right-0 h-px z-[1]" style={{ top: `${position}%`, backgroundColor: "rgba(229,231,235,1)" }} />
                );
              })}
              <div className="absolute left-0 top-0 bottom-0 w-[2px] z-[2]" style={{ backgroundColor: "rgba(125,125,125,1)" }} />
              <div className="absolute bottom-0 left-0 right-0 h-[2px] z-[2]" style={{ backgroundColor: "rgba(125,125,125,1)" }} />
            </div>

            {/* Stacked Bars */}
            <div className="relative flex-1 flex items-end justify-start px-[10px] h-full z-10">
              {safeData.map((dayData, index) => {
                const total = dayData.aggregating + dayData.outstanding + dayData.writeOff;
                const totalHeight = calculateHeight(total);
                const aggregatingPercent = total > 0 ? (dayData.aggregating / total) * 100 : 0;
                const outstandingPercent = total > 0 ? (dayData.outstanding / total) * 100 : 0;
                const writeOffPercent = total > 0 ? (dayData.writeOff / total) * 100 : 0;

                return (
                  <div key={`${dayData.day}-${index}`} className="flex-1 flex flex-col items-center justify-end relative max-w-[100px] h-full px-2">
                    {/* Stacked bar */}
                    <div
                      className="w-full max-w-[60px] relative flex flex-col-reverse rounded-t overflow-hidden transition-all"
                      style={{ height: `${totalHeight}%` }}
                    >
                      {/* Total label */}
                      <div
                        className="absolute whitespace-nowrap left-1/2 -translate-x-1/2 text-[11px] sm:text-xs font-medium"
                        style={{ top: "-24px", color: "rgba(94,94,94,1)", fontFamily: "Poppins, sans-serif" }}
                      >
                        {formatValue(total)}
                      </div>

                      {/* WriteOff (Red) - Bottom */}
                      {dayData.writeOff > 0 && (
                        <div
                          className="cursor-pointer transition-all hover:opacity-85 hover:brightness-110"
                          style={{ height: `${writeOffPercent}%`, backgroundColor: COLORS.writeOff || DEFAULT_COLORS.writeOff }}
                          onMouseEnter={(e) => handleSegmentMouseEnter(e, dayData, "writeOff")}
                          onMouseLeave={() => setTooltip(null)}
                        />
                      )}
                      {/* Outstanding (Green) - Middle */}
                      {dayData.outstanding > 0 && (
                        <div
                          className="cursor-pointer transition-all hover:opacity-85 hover:brightness-110"
                          style={{ height: `${outstandingPercent}%`, backgroundColor: COLORS.outstanding || DEFAULT_COLORS.outstanding }}
                          onMouseEnter={(e) => handleSegmentMouseEnter(e, dayData, "outstanding")}
                          onMouseLeave={() => setTooltip(null)}
                        />
                      )}
                      {/* Aggregating (Blue) - Top */}
                      {dayData.aggregating > 0 && (
                        <div
                          className="cursor-pointer transition-all hover:opacity-85 hover:brightness-110"
                          style={{ height: `${aggregatingPercent}%`, backgroundColor: COLORS.aggregating || DEFAULT_COLORS.aggregating }}
                          onMouseEnter={(e) => handleSegmentMouseEnter(e, dayData, "aggregating")}
                          onMouseLeave={() => setTooltip(null)}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* X-Axis Labels */}
        <div className="flex justify-start px-[10px] mt-3" style={{ marginLeft: "40px", width: "calc(100% - 40px)" }}>
          {safeData.map((dayData, index) => (
            <div key={index} className="flex-1 flex justify-center items-start max-w-[100px] px-2 min-w-0">
              <span
                style={{
                  color: "rgba(94,94,94,1)",
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "11px",
                  fontWeight: 400,
                  textAlign: "center",
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                  lineHeight: 1.3,
                  whiteSpace: "normal",
                }}
                className="sm:text-xs"
              >
                {dayData.day}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed pointer-events-none z-[9999] rounded-lg text-xs sm:text-[13px] font-medium px-[14px] py-[10px] sm:px-4 sm:py-3 whitespace-nowrap"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            backgroundColor: "rgba(158,153,153,0.75)",
            backdropFilter: "blur(10px)",
            color: "rgba(0,0,0,1)",
            fontFamily: "Poppins, sans-serif",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)",
            border: "1px solid rgba(209,213,219,0.94)",
            transform: "translate(-50%, -100%) translateY(-10px)",
            opacity: 1,
          }}
        >
          <div className="text-[11px] sm:text-xs font-normal mb-1" style={{ color: "rgba(0,0,0,0.7)" }}>
            {tooltip.day} - {tooltip.label}
          </div>
          <div className="text-sm sm:text-[15px] font-semibold" style={{ color: "rgba(0,0,0,1)" }}>
            ${tooltip.value}
          </div>
        </div>
      )}
    </div>
  );
};

StackBarChart.displayName = "StackBarChart";