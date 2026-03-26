"use client";
import React from "react";

export interface GroupBarLegendItem {
  key: string;
  label: string;
  color: string;
}

export interface GroupBarItem {
  name: string;
  revenue: number;
  profitOrLoss?: number;
  cost: number;
}

export interface GroupBarChartYAxisConfig {
  min: number;
  max: number;
  step: number;
  labels: number[];
}

export interface GroupBarChartData {
  title: string;
  legends?: GroupBarLegendItem[];
  yAxis?: Record<string, GroupBarChartYAxisConfig>;
  [year: string]: string | Record<string, any> | undefined;
}

export interface GroupBarChartProps {
  title: string;
  groups: GroupBarItem[];
  legends?: GroupBarLegendItem[];
  selectedYear: string;
  selectedMonth: string;
  yAxisConfig?: {
    min: number;
    max: number;
    step: number;
    labels: number[];
  };
}

const DEFAULT_BAR_COLORS = {
  revenue: "rgba(23,97,163,1)",
  profit: "rgba(77,175,131,1)",
  loss: "rgba(220,38,38,1)",
  cost: "rgba(47,164,169,1)",
};

export const GroupBarChart: React.FC<GroupBarChartProps> = ({
  title,
  groups,
  legends,
  yAxisConfig,
}) => {
  const safeGroups = groups || [];
  const maxValue = yAxisConfig?.max || 125;
  const minValue = yAxisConfig?.min || 0;
  const yAxisLabels = yAxisConfig?.labels || [0, 25, 50, 75, 100, 125];

  const getColorMap = (): Record<string, string> => {
    if (!legends || legends.length === 0) return DEFAULT_BAR_COLORS;
    const colorMap: Record<string, string> = {};
    legends.forEach((legend) => { colorMap[legend.key] = legend.color; });
    return colorMap;
  };
  const BAR_COLORS = getColorMap();

  const calculateHeight = (value: number): number => {
    if (maxValue === minValue) return 0;
    return Math.max(0, Math.min(100, ((value - minValue) / (maxValue - minValue)) * 100));
  };

  const getProfitOrLoss = (group: GroupBarItem): number => {
    if (group.profitOrLoss !== undefined && group.profitOrLoss !== null) return group.profitOrLoss;
    return group.revenue - group.cost;
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div style={{ color: "rgba(23,97,163,1)", fontFamily: "Poppins, sans-serif", fontSize: "14px", fontWeight: 600 }}
          className="sm:text-base"
        >
          {title}
        </div>
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
          <div className="flex flex-col justify-between items-end pr-2 flex-shrink-0" style={{ width: "40px", height: "250px" }}>
            {yAxisLabels.slice().reverse().map((label, idx) => (
              <span key={idx} style={{ color: "rgba(94,94,94,1)", fontFamily: "Poppins, sans-serif", fontSize: "10px", fontWeight: 400 }}
                className="sm:text-xs"
              >
                {label}
              </span>
            ))}
          </div>

          {/* Chart Content */}
          <div className="flex-1 relative flex flex-col" style={{ height: "250px" }}>
            {/* Grid Lines & Axes */}
            <div className="absolute inset-0 pointer-events-none">
              {yAxisLabels.map((label, idx) => {
                const position = 100 - ((label - yAxisLabels[0]) / (yAxisLabels[yAxisLabels.length - 1] - yAxisLabels[0])) * 100;
                return (
                  <div
                    key={idx}
                    className="absolute left-0 right-0 h-px z-[1]"
                    style={{ top: `${position}%`, backgroundColor: "rgba(229,231,235,1)" }}
                  />
                );
              })}
              {/* Y axis line */}
              <div className="absolute left-0 top-0 bottom-0 w-[2px] z-[2]" style={{ backgroundColor: "rgba(125,125,125,1)" }} />
              {/* X axis line */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] z-[2]" style={{ backgroundColor: "rgba(125,125,125,1)" }} />
            </div>

            {/* Grouped Bars */}
            <div className="relative flex-1 flex items-end justify-start px-[10px] h-full z-10">
              {safeGroups.map((group, index) => {
                const profitOrLossValue = getProfitOrLoss(group);
                const isProfitable = profitOrLossValue >= 0;
                const profitLossColor = isProfitable ? BAR_COLORS.profit : BAR_COLORS.loss;
                const profitLossAbsValue = Math.abs(profitOrLossValue);

                return (
                  <div key={`${group.name}-${index}`} className="flex-1 flex flex-row items-end justify-center relative h-full gap-1 px-2">
                    {[
                      { value: group.revenue, color: BAR_COLORS.revenue },
                      { value: profitLossAbsValue, color: profitLossColor },
                      { value: group.cost, color: BAR_COLORS.cost },
                    ].map(({ value, color }, barIdx) => (
                      <div key={barIdx} className="flex-1 flex flex-col items-center justify-end relative max-w-[30px] h-full">
                        <div
                          className="w-full rounded-t min-h-[2px] relative transition-all hover:opacity-85 hover:-translate-y-[2px]"
                          style={{ height: `${calculateHeight(value)}%`, background: color }}
                        >
                          <div
                            className="absolute whitespace-nowrap left-1/2 -translate-x-1/2"
                            style={{
                              top: "-24px",
                              color: "rgba(94,94,94,1)",
                              fontFamily: "Poppins, sans-serif",
                              fontSize: "10px",
                              fontWeight: 500,
                            }}
                          >
                            {value.toString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* X-Axis Labels */}
        <div className="flex justify-start px-[10px] mt-3" style={{ marginLeft: "40px", width: "calc(100% - 40px)" }}>
          {safeGroups.map((group, index) => (
            <div key={index} className="flex-1 flex justify-center items-start px-2 min-w-0">
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
                {group.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

GroupBarChart.displayName = "GroupBarChart";