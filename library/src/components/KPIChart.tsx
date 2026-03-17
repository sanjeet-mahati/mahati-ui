"use client";
import React, { useMemo, useState, useRef, useEffect } from "react";

/* ============================================================================
   INTERFACES
   ============================================================================ */

export interface KPIChartData {
  title: string;
  value: string;
  change?: number;
  timeLabel: string;
  timePeriod: string;
  data: number[];
  labels?: string[];
  timePeriods?: string[];
  timestamps?: string[];
}

export interface KPIChartProps {
  data: KPIChartData;
}

export interface KPIWidgetProps {
  kpiData: Record<string, KPIChartData>;
  defaultSelected?: string[];
}

/* ============================================================================
   HELPER FUNCTIONS
   ============================================================================ */

const createLinearPath = (points: { x: number; y: number }[]): string => {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x},${points[0].y}`;
  let path = `M ${points[0].x},${points[0].y}`;
  for (let i = 1; i < points.length; i++) path += ` L ${points[i].x},${points[i].y}`;
  return path;
};

const createAreaPath = (points: { x: number; y: number }[], height: number): string => {
  if (points.length === 0) return "";
  const linePath = createLinearPath(points);
  const lastPoint = points[points.length - 1];
  const firstPoint = points[0];
  return `${linePath} L ${lastPoint.x},${height} L ${firstPoint.x},${height} Z`;
};

const calculatePercentageChange = (data: number[]): number => {
  if (!data || data.length < 2) return 0;
  const firstValue = data[0];
  const lastValue = data[data.length - 1];
  if (firstValue === 0) return lastValue > 0 ? 100 : lastValue < 0 ? -100 : 0;
  return Math.round(((lastValue - firstValue) / Math.abs(firstValue)) * 1000) / 10;
};

const getTimeLabel = (period: string, dataLength: number, timestamps?: string[]): string => {
  switch (period) {
    case "1D": return "Last 1 Day";
    case "1W": return "Last 1 Week";
    case "1M": return "Last 1 Month";
    case "6M": return "Last 6 Months";
    case "1Y": return "Last 1 Year";
    case "MAX":
      if (timestamps && timestamps.length >= 2) {
        const startDate = new Date(timestamps[0]);
        const endDate = new Date(timestamps[timestamps.length - 1]);
        const monthsDiff =
          (endDate.getFullYear() - startDate.getFullYear()) * 12 +
          (endDate.getMonth() - startDate.getMonth());
        if (monthsDiff === 0) {
          const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / 86400000);
          return `Last ${daysDiff} Day${daysDiff > 1 ? "s" : ""}`;
        } else if (monthsDiff < 12) {
          return `Last ${monthsDiff} Month${monthsDiff > 1 ? "s" : ""}`;
        } else {
          const years = Math.floor(monthsDiff / 12);
          const months = monthsDiff % 12;
          return months === 0 ? `Last ${years} Year${years > 1 ? "s" : ""}` : `Last ${years}y ${months}m`;
        }
      }
      return `All Data (${dataLength} points)`;
    default: return "All Data";
  }
};

const getDateRange = (period: string, filteredTimestamps: string[], allTimestamps?: string[]): string => {
  if (period === "MAX" && allTimestamps && allTimestamps.length >= 2) {
    return formatDateRange(new Date(allTimestamps[0]), new Date(allTimestamps[allTimestamps.length - 1]));
  }
  if (filteredTimestamps && filteredTimestamps.length >= 2) {
    return formatDateRange(new Date(filteredTimestamps[0]), new Date(filteredTimestamps[filteredTimestamps.length - 1]));
  } else if (filteredTimestamps && filteredTimestamps.length === 1) {
    return formatSingleDate(new Date(filteredTimestamps[0]));
  }
  return "No Date Range";
};

const formatDateRange = (startDate: Date, endDate: Date): string => {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const sameYear = startDate.getFullYear() === endDate.getFullYear();
  const sm = monthNames[startDate.getMonth()];
  const sd = String(startDate.getDate()).padStart(2, "0");
  const sy = startDate.getFullYear();
  const em = monthNames[endDate.getMonth()];
  const ed = String(endDate.getDate()).padStart(2, "0");
  const ey = endDate.getFullYear();
  return sameYear
    ? `${sm} ${sd} - ${em} ${ed}`
    : `${sm} ${sd} ${sy} - ${em} ${ed} ${ey}`;
};

const formatSingleDate = (date: Date): string => {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${monthNames[date.getMonth()]} ${String(date.getDate()).padStart(2, "0")}, ${date.getFullYear()}`;
};

const calculateSum = (data: number[]): number => data?.reduce((s, v) => s + v, 0) ?? 0;

const formatCurrencyValue = (value: number): string => {
  if (value === 0) return "$0";
  const abs = Math.abs(value);
  const prefix = value < 0 ? "-" : "";
  if (abs >= 1_000_000_000) return `${prefix}$${(abs / 1_000_000_000).toFixed(1)}B`;
  if (abs >= 1_000_000) return `${prefix}$${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${prefix}$${(abs / 1_000).toFixed(1)}K`;
  return `${prefix}$${abs.toFixed(0)}`;
};

/* ============================================================================
   MAIN KPI CHART COMPONENT
   ============================================================================ */

export const KPIChart: React.FC<KPIChartProps> = ({ data }) => {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = React.useState({ x: 0, y: 0 });
  const [selectedPeriod, setSelectedPeriod] = React.useState<string>(
    data.timePeriods && data.timePeriods.length > 0
      ? data.timePeriods[data.timePeriods.length - 1]
      : "MAX"
  );
  const containerRef = React.useRef<HTMLDivElement>(null);

  const { filteredData, filteredTimestamps } = useMemo(() => {
    if (!data.timePeriods || !data.timestamps || selectedPeriod === "MAX") {
      return { filteredData: data.data, filteredTimestamps: data.timestamps || [] };
    }
    const now = new Date();
    let cutoffDate = new Date();
    switch (selectedPeriod) {
      case "1D": cutoffDate.setDate(now.getDate() - 1); break;
      case "1W": cutoffDate.setDate(now.getDate() - 7); break;
      case "1M": cutoffDate.setMonth(now.getMonth() - 1); break;
      case "6M": cutoffDate.setMonth(now.getMonth() - 6); break;
      case "1Y": cutoffDate.setFullYear(now.getFullYear() - 1); break;
      default:
        return { filteredData: data.data, filteredTimestamps: data.timestamps || [] };
    }
    const filtered: number[] = [];
    const filteredTS: string[] = [];
    data.timestamps.forEach((timestamp, index) => {
      const dataDate = new Date(timestamp);
      if (dataDate >= cutoffDate && dataDate <= now && index < data.data.length) {
        filtered.push(data.data[index]);
        filteredTS.push(timestamp);
      }
    });
    return {
      filteredData: filtered.length > 0 ? filtered : data.data,
      filteredTimestamps: filteredTS.length > 0 ? filteredTS : data.timestamps || [],
    };
  }, [data.data, data.timestamps, data.timePeriods, selectedPeriod]);

  const percentageChange = useMemo(() => calculatePercentageChange(filteredData), [filteredData]);
  const isPositive = percentageChange >= 0;
  const dynamicTimeLabel = useMemo(() => getTimeLabel(selectedPeriod, filteredData.length, data.timestamps), [selectedPeriod, filteredData.length, data.timestamps]);
  const dynamicDateRange = useMemo(() => getDateRange(selectedPeriod, filteredTimestamps, data.timestamps), [selectedPeriod, filteredTimestamps, data.timestamps]);
  const dynamicValue = useMemo(() => formatCurrencyValue(calculateSum(filteredData)), [filteredData]);

  const { points, chartWidth, chartHeight } = useMemo(() => {
    const width = 400;
    const height = 100;
    const padding = 5;
    if (!filteredData || filteredData.length === 0) return { points: [], minValue: 0, maxValue: 0, chartWidth: width, chartHeight: height };
    const min = Math.min(...filteredData);
    const max = Math.max(...filteredData);
    const range = max - min || 1;
    const calculatedPoints = filteredData.map((value, index) => ({
      x: padding + (index / (filteredData.length - 1)) * (width - padding * 2),
      y: height - padding - ((value - min) / range) * (height - padding * 2),
      value,
    }));
    return { points: calculatedPoints, minValue: min, maxValue: max, chartWidth: width, chartHeight: height };
  }, [filteredData]);

  const linearPath = useMemo(() => createLinearPath(points), [points]);
  const areaPath = useMemo(() => createAreaPath(points, chartHeight), [points, chartHeight]);
  const gradientId = useMemo(
    () => `kpi-gradient-${isPositive ? "positive" : "negative"}-${Math.random().toString(36).substr(2, 9)}`,
    [isPositive]
  );

  const handleMouseMove = (event: React.MouseEvent<SVGRectElement>) => {
    if (!containerRef.current || points.length === 0) return;
    const svg = event.currentTarget.ownerSVGElement;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * chartWidth;
    let nearestIndex = 0;
    let minDistance = Math.abs(points[0].x - x);
    points.forEach((point, index) => {
      const distance = Math.abs(point.x - x);
      if (distance < minDistance) { minDistance = distance; nearestIndex = index; }
    });
    setHoveredIndex(nearestIndex);
    setTooltipPos({
      x: (points[nearestIndex].x / chartWidth) * rect.width,
      y: (points[nearestIndex].y / chartHeight) * rect.height,
    });
  };

  const positiveGradientStop = isPositive
    ? [
        { offset: "0%", color: "rgba(34,197,94,0.2)" },
        { offset: "50%", color: "rgba(34,197,94,0.1)" },
        { offset: "100%", color: "rgba(34,197,94,0.02)" },
      ]
    : [
        { offset: "0%", color: "rgba(239,68,68,0.2)" },
        { offset: "50%", color: "rgba(239,68,68,0.1)" },
        { offset: "100%", color: "rgba(239,68,68,0.02)" },
      ];

  const trendColor = isPositive ? "rgba(34,197,94,1)" : "rgba(239,68,68,1)";
  const changeIndicatorBg = isPositive ? "rgba(209,250,229,1)" : "rgba(254,226,226,1)";

  return (
    <div
      ref={containerRef}
      className="w-full flex flex-col overflow-hidden rounded-[10px] p-4 sm:px-6 sm:pb-6 sm:pt-5"
      style={{
        height: "350px",
        border: "1px solid rgba(23,97,163,1)",
        background: "rgba(241,247,248,1)",
        boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)",
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3 sm:mb-[14px] lg:mb-4">
        <div className="relative flex-1">
          <h3
            className="text-[13px] sm:text-sm lg:text-[15px] font-medium leading-[1.4]"
            style={{ color: "rgba(148,163,184,1)", fontFamily: "'Inter', 'Poppins', sans-serif", letterSpacing: "-0.01em" }}
          >
            {data.title}
          </h3>
        </div>

        {data.timePeriods && data.timePeriods.length > 0 && (
          <div className="absolute left-1/2 -translate-x-1/2 flex gap-[6px] sm:gap-2 items-center">
            {data.timePeriods.map((period) => (
              <button
                key={period}
                type="button"
                onClick={() => setSelectedPeriod(period)}
                className="px-3 py-1 sm:px-[14px] sm:py-[5px] lg:px-4 lg:py-[6px] rounded-[20px] text-[11px] sm:text-xs lg:text-[13px] font-medium whitespace-nowrap border-none cursor-pointer transition-all"
                style={{
                  fontFamily: "'Inter', 'Poppins', sans-serif",
                  backgroundColor: selectedPeriod === period ? "rgba(23,97,163,1)" : "transparent",
                  color: selectedPeriod === period ? "white" : "rgba(148,163,184,1)",
                }}
              >
                {period}
              </button>
            ))}
          </div>
        )}

        <div className="flex-shrink-0">
          <div
            className="flex items-center gap-[3px] sm:gap-1 px-2 sm:px-[10px] py-[3px] sm:py-1 rounded-[6px]"
            style={{ backgroundColor: changeIndicatorBg, transition: "background-color 0.3s ease-in-out" }}
          >
            <svg
              className="w-[11px] h-[11px] sm:w-3 sm:h-3 lg:w-[13px] lg:h-[13px]"
              viewBox="0 0 12 12"
              style={{ fill: trendColor, transition: "fill 0.3s ease-in-out" }}
            >
              {isPositive
                ? <path d="M6 2L10 6H8V10H4V6H2L6 2Z" />
                : <path d="M6 10L2 6H4V2H8V6H10L6 10Z" />}
            </svg>
            <span
              className="text-[11px] sm:text-xs lg:text-[13px] font-semibold"
              style={{ color: trendColor, fontFamily: "'Inter', 'Poppins', sans-serif", transition: "color 0.3s ease-in-out" }}
            >
              {Math.abs(percentageChange)}%
            </span>
          </div>
        </div>
      </div>

      {/* Value */}
      <div className="mb-[14px] sm:mb-4 lg:mb-[18px]">
        <div
          className="text-[28px] sm:text-[36px] md:text-[40px] lg:text-[42px] xl:text-[44px] font-bold leading-[1.1]"
          style={{ color: "rgba(15,23,42,1)", fontFamily: "'Inter', 'Poppins', sans-serif", letterSpacing: "-0.02em", transition: "opacity 0.3s ease-in-out" }}
        >
          {dynamicValue}
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 relative min-h-[100px] sm:min-h-[110px] lg:min-h-[120px] mb-3 sm:mb-[14px] lg:mb-4">
        <svg
          className="w-full h-full overflow-visible"
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
              {positiveGradientStop.map((s) => (
                <stop key={s.offset} offset={s.offset} stopColor={s.color} />
              ))}
            </linearGradient>
          </defs>
          <path d={areaPath} fill={`url(#${gradientId})`} stroke="none" style={{ transition: "d 0.4s ease-in-out, fill 0.3s ease-in-out" }} />
          <path
            d={linearPath}
            fill="none"
            stroke={trendColor}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ transition: "d 0.4s ease-in-out, stroke 0.3s ease-in-out" }}
          />
          {hoveredIndex !== null && points[hoveredIndex] && !isNaN(points[hoveredIndex].x) && (
            <>
              <line
                x1={points[hoveredIndex].x} y1="0"
                x2={points[hoveredIndex].x} y2={chartHeight}
                stroke="rgba(148,163,184,0.3)" strokeWidth="1" strokeDasharray="4 4"
                style={{ opacity: 1, transition: "opacity 0.2s" }}
              />
              <circle
                cx={points[hoveredIndex].x} cy={points[hoveredIndex].y}
                r="3.5"
                fill={trendColor} stroke="white" strokeWidth="1"
                style={{ opacity: 1, transition: "opacity 0.2s" }}
              />
            </>
          )}
          <rect
            x="0" y="0" width={chartWidth} height={chartHeight}
            fill="transparent" style={{ cursor: "crosshair" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoveredIndex(null)}
          />
        </svg>

        {hoveredIndex !== null && points[hoveredIndex] && (
          <div
            className="absolute pointer-events-none z-10 rounded-[6px] text-xs sm:text-[13px] lg:text-sm font-semibold whitespace-nowrap px-[10px] py-[6px] sm:px-3 sm:py-2 lg:px-[14px] lg:py-[10px]"
            style={{
              left: tooltipPos.x,
              top: tooltipPos.y,
              backgroundColor: "rgba(220,235,238,1)",
              color: "rgba(0,0,0,1)",
              fontFamily: "'Inter', 'Poppins', sans-serif",
              transform: "translate(-50%, -100%) translateY(-8px)",
              boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
              border: "1px solid rgba(23,97,163,0.2)",
              opacity: 1,
              transition: "opacity 0.2s",
            }}
          >
            {points[hoveredIndex].value.toLocaleString()}
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        className="flex items-center justify-between pt-[10px] sm:pt-3 lg:pt-[14px] flex-shrink-0"
        style={{ borderTop: "1px solid rgba(226,232,240,0.6)" }}
      >
        {[dynamicTimeLabel, dynamicDateRange].map((text, i) => (
          <span
            key={i}
            className="text-[11px] sm:text-xs lg:text-[13px] font-medium"
            style={{ color: "rgba(148,163,184,1)", fontFamily: "'Inter', 'Poppins', sans-serif", transition: "opacity 0.3s ease-in-out" }}
          >
            {text}
          </span>
        ))}
      </div>
    </div>
  );
};

/* ============================================================================
   MULTI-SELECT DROPDOWN
   ============================================================================ */

interface MultiSelectDropdownProps {
  options: string[];
  selectedValues: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  options,
  selectedValues,
  onChange,
  placeholder = "Select options",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCheckboxChange = (option: string) => {
    if (selectedValues.includes(option)) {
      if (selectedValues.length > 1) onChange(selectedValues.filter((v) => v !== option));
    } else {
      onChange([...selectedValues, option]);
    }
  };

  return (
    <div className="relative w-full max-w-[400px]" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center px-4 py-3 sm:px-[18px] sm:py-[14px] bg-white rounded-lg cursor-pointer transition-all text-sm sm:text-[15px]"
        style={{
          border: "2px solid rgba(23,97,163,1)",
          fontFamily: "'Inter', 'Poppins', sans-serif",
        }}
      >
        <span className="text-[rgba(15,23,42,1)] font-medium text-left overflow-hidden text-ellipsis whitespace-nowrap">
          {selectedValues.length === 0
            ? placeholder
            : selectedValues.length === 1
            ? selectedValues[0]
            : `${selectedValues.length} KPIs selected`}
        </span>
        <span
          className="ml-3 flex-shrink-0 transition-transform"
          style={{
            color: "rgba(23,97,163,1)",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          ▼
        </span>
      </button>

      {isOpen && (
        <div
          className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white rounded-lg overflow-y-auto z-[1000]"
          style={{
            border: "2px solid rgba(23,97,163,1)",
            boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
            maxHeight: "320px",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {options.map((option) => (
            <div
              key={option}
              className="flex items-center px-4 py-3 sm:px-[18px] sm:py-[14px] cursor-pointer transition-colors hover:bg-[rgba(241,247,248,1)]"
              style={{ borderBottom: "1px solid rgba(226,232,240,0.6)" }}
              onClick={(e) => { e.stopPropagation(); handleCheckboxChange(option); }}
            >
              <input
                type="checkbox"
                checked={selectedValues.includes(option)}
                onChange={(e) => { e.stopPropagation(); handleCheckboxChange(option); }}
                onClick={(e) => e.stopPropagation()}
                className="w-[18px] h-[18px] sm:w-5 sm:h-5 mr-3 cursor-pointer flex-shrink-0"
                style={{ accentColor: "rgba(23,97,163,1)" }}
              />
              <label
                className="flex-1 text-sm sm:text-[15px] cursor-pointer select-none"
                style={{ color: "rgba(15,23,42,1)", fontFamily: "'Inter', 'Poppins', sans-serif" }}
                onClick={(e) => e.stopPropagation()}
              >
                {option}
              </label>
            </div>
          ))}
          <div
            className="flex justify-between items-center px-4 py-3 sm:px-[18px] sm:py-[14px]"
            style={{ background: "rgba(241,247,248,0.5)", borderTop: "1px solid rgba(226,232,240,1)" }}
          >
            <span className="text-xs sm:text-[13px] font-medium" style={{ color: "rgba(148,163,184,1)", fontFamily: "'Inter', 'Poppins', sans-serif" }}>
              {selectedValues.length} of {options.length} selected
            </span>
            {selectedValues.length > 1 && (
              <button
                className="text-xs sm:text-[13px] font-semibold px-2 py-1 rounded transition-colors hover:bg-[rgba(23,97,163,0.1)] bg-transparent border-none cursor-pointer"
                style={{ color: "rgba(23,97,163,1)", fontFamily: "'Inter', 'Poppins', sans-serif" }}
                onClick={(e) => { e.stopPropagation(); onChange([selectedValues[0]]); }}
              >
                Clear All
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/* ============================================================================
   KPI WIDGET
   ============================================================================ */

export const KPIWidget: React.FC<KPIWidgetProps> = ({ kpiData, defaultSelected }) => {
  const kpiOptions = Object.keys(kpiData);
  const [selectedKPIs, setSelectedKPIs] = useState<string[]>(
    defaultSelected && defaultSelected.length > 0
      ? defaultSelected
      : kpiOptions.length > 0
      ? [kpiOptions[0]]
      : []
  );

  const getGridCols = (count: number) => {
    if (count === 1) return "grid-cols-1";
    if (count === 2) return "md:grid-cols-2";
    return "md:grid-cols-2 lg:grid-cols-3";
  };

  return (
    <div className="w-full min-h-screen p-4 sm:p-6 lg:p-8 xl:p-10" style={{ background: "rgba(248,250,252,1)" }}>
      {/* Widget Header */}
      <div
        className="flex flex-col gap-5 mb-6 bg-white rounded-xl p-5 md:flex-row md:justify-between md:items-center md:p-6 lg:px-8 lg:py-7 lg:mb-8"
        style={{ boxShadow: "0 1px 3px 0 rgba(0,0,0,0.1)" }}
      >
        <div className="flex flex-col gap-1">
          <h1
            className="text-2xl sm:text-[28px] lg:text-[32px] font-bold m-0"
            style={{ color: "rgba(15,23,42,1)", fontFamily: "'Inter', 'Poppins', sans-serif" }}
          >
            KPI Dashboard
          </h1>
          <p
            className="text-sm sm:text-[15px] m-0"
            style={{ color: "rgba(148,163,184,1)", fontFamily: "'Inter', 'Poppins', sans-serif" }}
          >
            Compare multiple KPIs side-by-side
          </p>
        </div>
        <MultiSelectDropdown
          options={kpiOptions}
          selectedValues={selectedKPIs}
          onChange={setSelectedKPIs}
          placeholder="Select KPIs to compare"
        />
      </div>

      {/* Charts Grid */}
      <div className={`grid gap-4 sm:gap-[18px] lg:gap-5 xl:gap-6 w-full ${getGridCols(selectedKPIs.length)}`}>
        {selectedKPIs.map((kpiName) => {
          const chartData = kpiData[kpiName];
          if (!chartData) return null;
          return (
            <div key={kpiName} className="w-full" style={{ animation: "fadeIn 0.3s ease-in-out" }}>
              <KPIChart data={chartData} />
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default KPIWidget;

KPIChart.displayName = "KPIChart";