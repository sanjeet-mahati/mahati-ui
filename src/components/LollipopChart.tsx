"use client";
import React from "react";

export interface LollipopItem {
  label: string;
  value: number;
  color?: string;
}

export interface LollipopData {
  title: string;
  [year: string]: any;
}

export interface LollipopChartProps {
  title: string;
  items: LollipopItem[];
  selectedYear: string;
  selectedMonth: string;
  selectedCategory: string;
  orientation?: "horizontal" | "vertical";
}

const DEFAULT_COLORS = [
  "rgba(37,99,235,1)",
  "rgba(16,185,129,1)",
  "rgba(245,158,11,1)",
  "rgba(239,68,68,1)",
  "rgba(147,51,234,1)",
  "rgba(236,72,153,1)",
];

export const LollipopChart: React.FC<LollipopChartProps> = ({
  title,
  items,
  orientation = "horizontal",
}) => {
  if (!items || items.length === 0) {
    return (
      <div className="w-full h-full flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div style={{ color: "rgba(23,97,163,1)", fontFamily: "Poppins, sans-serif", fontSize: "14px", fontWeight: 600 }} className="sm:text-base">{title}</div>
          <MenuButtonDots />
        </div>
        <div className="flex-1 flex items-center justify-center" style={{ color: "rgba(107,114,128,1)", fontSize: "14px" }}>
          No data available
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...items.map((item) => item.value), 1);
  const gridPositions = [0, 25, 50, 75, 100];
  const axisLabels = gridPositions.map((pos) => Math.round((pos / 100) * maxValue));

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div style={{ color: "rgba(23,97,163,1)", fontFamily: "Poppins, sans-serif", fontSize: "14px", fontWeight: 600 }} className="sm:text-base">{title}</div>
        <MenuButtonDots />
      </div>

      {/* Chart Area */}
      <div className="flex-1 flex flex-col gap-4 py-4 min-h-[300px] relative overflow-visible">
        {/* Scrollable Wrapper */}
        <div className="w-full overflow-x-visible lg:overflow-x-auto">
          {orientation === "horizontal" ? (
            <>
              {/* Horizontal Chart */}
              <div className="flex flex-col gap-4 relative pl-[140px] w-full min-w-[800px] lg:min-w-0">
                {/* Grid Lines */}
                <div className="absolute left-[140px] right-0 top-0 bottom-0 pointer-events-none">
                  {/* Y axis */}
                  <div className="absolute left-0 top-0 bottom-0 w-px" style={{ background: "rgba(209,213,219,1)" }} />
                  {gridPositions.slice(1).map((pos, idx) => (
                    <div key={idx} className="absolute top-0 bottom-0 w-px" style={{ left: `${pos}%`, background: "rgba(229,231,235,0.8)" }} />
                  ))}
                </div>
                {/* Bottom axis */}
                <div className="absolute left-[140px] right-0 bottom-0 h-px" style={{ background: "rgba(209,213,219,1)" }} />

                {items.map((item, index) => {
                  const percentage = (item.value / maxValue) * 100;
                  const color = item.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length];
                  return (
                    <div key={`${item.label}-${index}`} className="flex items-center gap-4 relative">
                      {/* Label */}
                      <div className="absolute text-right pr-4" style={{ width: "120px", left: "-140px" }}>
                        <span style={{ color: "rgba(55,65,81,1)", fontFamily: "Poppins, sans-serif", fontSize: "12px", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }} className="sm:text-sm">
                          {item.label}
                        </span>
                      </div>
                      {/* Bar */}
                      <div className="flex-1 relative h-10 flex items-center">
                        <div
                          className="relative rounded-[2px] transition-all"
                          style={{ width: `${percentage}%`, height: "4px", background: color }}
                        >
                          {/* Circle */}
                          <div
                            className="absolute right-[-10px] top-1/2 w-5 h-5 rounded-full border-[3px] border-white transition-all hover:scale-110"
                            style={{
                              transform: "translateY(-50%)",
                              background: color,
                              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                            }}
                          />
                        </div>
                        {/* Value */}
                        <span
                          className="ml-4 min-w-[50px] text-sm sm:text-base font-semibold"
                          style={{ color: "rgba(17,24,39,1)", fontFamily: "Poppins, sans-serif" }}
                        >
                          {item.value}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* X Axis Labels */}
              <div className="flex justify-between mt-2 pl-[140px]" style={{ fontFamily: "Poppins, sans-serif", fontSize: "10px", color: "rgba(107,114,128,1)" }}>
                {axisLabels.map((label, idx) => <span key={idx}>{label}</span>)}
              </div>
            </>
          ) : (
            /* Vertical Chart */
            <div
              className="flex flex-col h-full w-full relative pb-[60px] pl-[50px] min-w-[800px] lg:min-w-0"
              style={{ minHeight: "350px" }}
            >
              {/* Grid */}
              <div className="absolute left-[50px] right-0 top-0 bottom-[60px] pointer-events-none">
                {/* Bottom axis */}
                <div className="absolute left-0 right-0 bottom-0 h-px" style={{ background: "rgba(209,213,219,1)" }} />
                {/* Left axis */}
                <div className="absolute left-0 top-0 bottom-0 w-px" style={{ background: "rgba(209,213,219,1)" }} />
                {gridPositions.slice(1).map((pos, idx) => (
                  <div key={idx} className="absolute left-0 right-0 h-px" style={{ top: `${100 - pos}%`, background: "rgba(229,231,235,0.8)" }} />
                ))}
              </div>

              {/* Y Axis Labels */}
              <div
                className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-right pr-[5px] w-[45px]"
                style={{ fontFamily: "Poppins, sans-serif", fontSize: "10px", color: "rgba(107,114,128,1)" }}
              >
                {[...axisLabels].reverse().map((label, idx) => <span key={idx}>{label}</span>)}
              </div>

              {/* Bars */}
              <div className="flex justify-around items-end w-full flex-1 gap-4 px-4 relative">
                {items.map((item, index) => {
                  const percentage = (item.value / maxValue) * 100;
                  const color = item.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length];
                  return (
                    <div key={`${item.label}-${index}`} className="flex flex-col items-center gap-2 flex-1 min-w-[60px] max-w-[100px] h-full relative">
                      {/* Bar container */}
                      <div className="flex-1 relative w-10 flex flex-col justify-end items-center h-full">
                        <div
                          className="relative w-1 rounded-[2px] transition-all"
                          style={{
                            height: `${percentage}%`,
                            background: color,
                            minHeight: percentage > 0 ? "8px" : "0px",
                          }}
                        >
                          {/* Circle */}
                          <div
                            className="absolute left-1/2 w-5 h-5 rounded-full border-[3px] border-white transition-all hover:scale-110"
                            style={{
                              top: "-10px",
                              transform: "translateX(-50%)",
                              background: color,
                              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                            }}
                          />
                          {/* Value */}
                          <span
                            className="absolute left-1/2 whitespace-nowrap text-sm sm:text-base font-semibold text-center"
                            style={{
                              top: "-30px",
                              transform: "translateX(-50%)",
                              color: "rgba(17,24,39,1)",
                              fontFamily: "Poppins, sans-serif",
                            }}
                          >
                            {item.value}
                          </span>
                        </div>
                      </div>
                      {/* Label */}
                      <div
                        className="absolute text-center"
                        style={{ bottom: "-50px", left: "50%", transform: "translateX(-50%)", maxWidth: "100px" }}
                      >
                        <span style={{ color: "rgba(55,65,81,1)", fontFamily: "Poppins, sans-serif", fontSize: "12px", fontWeight: 500 }} className="sm:text-sm">
                          {item.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Shared menu button dots helper
const MenuButtonDots: React.FC = () => (
  <button className="w-8 h-8 flex items-center justify-center rounded bg-transparent border-none cursor-pointer transition-colors hover:bg-[rgba(243,244,246,1)]">
    <div className="flex gap-1">
      {[0, 1, 2].map((i) => (
        <span key={i} className="w-1 h-1 rounded-full" style={{ background: "rgba(107,114,128,1)" }} />
      ))}
    </div>
  </button>
);

LollipopChart.displayName = "LollipopChart";