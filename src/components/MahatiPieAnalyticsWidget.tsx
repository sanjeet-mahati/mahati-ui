"use client";

import React, { useMemo, useState } from "react";
import { ChartInterface } from "./ChartInterface"; // <-- your existing Chart wrapper
import { MoreHorizontal } from "lucide-react";

/* -------------------- Types -------------------- */
export type ChartData = {
  labels: string[];
  datasets: {
    data: number[];
    backgroundColor: string | string[]; // single color for line/bar, or array for pie/bar
    borderColor?: string | string[];
    borderWidth?: number | number[];
  }[];
};

export type DetailItem = {
  id?: string;
  label: string;
  value: string | number;
  description?: string;
  color?: string;
};

export type FilterItem = {
  key: string;
  label: string;
  options: string[];
};

export interface MahatiPieAnalyticsWidgetProps {
  // Header
  title?: string;
  subtitle?: string;

  // Filters row (top)
  filters?: FilterItem[];                 // renders selects in order
  selectedFilters?: Record<string, string>; // controlled selection map: { Relationship: "Partner" }
  onFilterChange?: (key: string, value: string) => void;
  onApply?: (current: Record<string, string>) => void;

  // Chart
  chartData: ChartData;
  chartType?: "pie" | "doughnut" | "line" | "bar";
  chartOptions?: any;
  centerLabel?: string;
  centerValue?: string | number;
  hoverTooltipText?: string;

  // Details on right
  details?: DetailItem[];

  // Top-right dropdown options (global)
  topDropdownOptions?: string[];
  onTopDropdownSelect?: (value: string) => void;

  // Action menu items for 3-dot menu
  actionMenu?: { label: string; onClick: () => void }[];

  // Insights (small cards)
  quickInsights?: { title: string; value: string; subtitle?: string }[];
  totalVolume?: { value: string | number; change?: string };
  transactions?: { value: string | number; subtitle?: string };

  className?: string;
}

/* -------------------- Small internal components -------------------- */

const MahatiDropdown: React.FC<{
  options: string[];
  value?: string;
  onChange?: (val: string) => void;
  size?: "sm" | "md";
  className?: string;
}> = ({ options, value, onChange, size = "sm", className = "" }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange && onChange(e.target.value)}
      className={`px-3 py-${size === "sm" ? "1" : "2"} rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 ${className}`}
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
};

const InsightCard: React.FC<{ title: string; value: string | number; subtitle?: string }> = ({ title, value, subtitle }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-4">
    <div className="flex items-center justify-between">
      <p className="text-xs text-gray-500">{title}</p>
      <p className="text-sm font-semibold text-gray-900">{value}</p>
    </div>
    {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
  </div>
);

/* -------------------- Main component -------------------- */
const MahatiAnalyticsWidget: React.FC<MahatiPieAnalyticsWidgetProps> = ({
  title = "Collection Status",
  subtitle,
  filters = [],
  selectedFilters = {},
  onFilterChange,
  onApply,
  chartData,
  chartType = "doughnut",
  chartOptions = {},
  centerLabel = "Total",
  centerValue = "",
  hoverTooltipText = "Click here for more details",
  details = [],
  topDropdownOptions = [],
  onTopDropdownSelect,
  actionMenu = [],
  quickInsights = [],
  totalVolume,
  transactions,
  className = "",
}) => {
  const [hover, setHover] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<Record<string, string>>(() => {
    // initialize with provided selectedFilters or first option of each filter
    const initial: Record<string, string> = {};
    filters.forEach((f) => {
      initial[f.key] = selectedFilters[f.key] ?? f.options[0] ?? "";
    });
    return { ...initial, ...selectedFilters };
  });

  // keep chart options tuned for exact donut look
  const internalOptions = useMemo(() => {
    return {
      cutout: "60%",
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "white",
          titleColor: "#111827",
          bodyColor: "#111827",
          borderColor: "#E5E7EB",
          borderWidth: 1,
          padding: 8,
        },
      },
      maintainAspectRatio: false,
      ...chartOptions,
    };
  }, [chartOptions]);

  // Apply button handler
  const handleApply = () => {
    onApply && onApply(localFilters);
  };

  return (
    <div className={`w-full max-w-6xl mx-auto p-6 bg-transparent ${className}`}>
      {/* Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Top header: title + global dropdowns + filter row */}
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
              {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
            </div>

            {/* top-right global dropdown */}
            {topDropdownOptions.length > 0 && (
              <div>
                <MahatiDropdown
                  options={topDropdownOptions}
                  onChange={(v) => onTopDropdownSelect && onTopDropdownSelect(v)}
                />
              </div>
            )}
          </div>

          {/* Filters row */}
          {filters.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {filters.map((f) => (
                <div key={f.key} className="flex items-center gap-2">
                  <label className="text-xs text-gray-600 font-medium">{f.label}</label>
                  <MahatiDropdown
                    options={f.options}
                    value={localFilters[f.key]}
                    onChange={(v) => {
                      const next = { ...localFilters, [f.key]: v };
                      setLocalFilters(next);
                      onFilterChange && onFilterChange(f.key, v);
                      className=`w-[130px] h-[30px] rounder border-1 [background:linear-gradient(90deg,rgba(23,97,163,0.07)_0%,rgba(77,175,131,0.07)_100%)] border-solid border-[#D2D2D2]`
                    }}
                  />
                </div>
              ))}

              <button
                onClick={handleApply}
                className="w-[77px] h-[30px] rounded border [background:linear-gradient(90deg,#1761A3_0%,#4DAF83_100%)] border-solid border-[#1761A3]"
              >
                Apply
              </button>
            </div>
          )}
        </div>

        {/* Main content: chart left, right column (details + insights) */}
        {/* The grid layout changes based on chart type */}
        <div className="p-6">
          <div className={`grid grid-cols-1 ${chartType === 'doughnut' || chartType === 'pie' ? 'lg:grid-cols-3' : ''} gap-6`}>
            {/* Chart area (left: spans 2 cols on lg) */}
            {/* For line/bar, it spans the full width. For pie/doughnut, it spans 2/3. */}
            <div className={`${chartType === 'doughnut' || chartType === 'pie' ? 'lg:col-span-2' : 'col-span-1'}`}>
              <div
                className="relative bg-gray-50 rounded-lg p-4 h-[450px] flex flex-col"
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
              >
                {/* hover tooltip */}
                {hover && hoverTooltipText && (
                  <div className="absolute top-3 left-3 bg-white text-xs text-slate-600 px-3 py-1 rounded shadow-sm border border-gray-100 z-20">
                    {hoverTooltipText}
                  </div>
                )}

                {/* small action 3-dot menu on top-right of chart container */}
                {actionMenu.length > 0 && (
                  <div className="absolute top-3 right-3 z-20">
                    <button
                      aria-label="menu"
                      className="p-1 rounded-md hover:bg-gray-100"
                      onClick={() => setMenuOpen((s) => !s)}
                    >
                      <MoreHorizontal size={18} className="text-gray-600" />
                    </button>

                    {menuOpen && (
                      <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-sm py-1 z-30">
                        {actionMenu.map((m, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              setMenuOpen(false);
                              m.onClick();
                            }}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                          >
                            {m.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Chart (use ChartInterface) */}
                <div className="w-[357px] h-[460px] border [background:linear-gradient(180deg,rgba(23,97,163,0.07)_0%,rgba(77,175,131,0.07)_100%)] rounded-2xl border-solid border-[red]">
                  <div className="h-full">
                    <ChartInterface type={chartType} data={chartData} options={internalOptions} variant="flat" />
                  </div>

                  {/* Legend BELOW the chart (exact as requested) */}
                  <div className="mt-4 flex flex-wrap gap-4">
                    {(chartData?.labels || []).map((label: string, idx: number) => {
                      const color = chartData?.datasets?.[0]?.backgroundColor?.[idx] ?? "#CBD5E1";
                      const value = chartData?.datasets?.[0]?.data?.[idx];
                      return (
                        <div key={label} className="flex items-center gap-3 text-sm text-slate-700">
                          <span className="w-3 h-3 rounded-sm" style={{ background: color }} />
                          <div>
                            <div className="font-medium">{label}</div>
                            <div className="text-xs text-gray-500">{value}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Right column: Details + quick insights */}
         {(details.length > 0 || quickInsights.length > 0 || totalVolume || transactions)&&(
              <div className="space-y-4">
              {/* Details card */}
              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-slate-700">Details</h4>
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreHorizontal size={16} />
                  </button>
                </div>

                <div className="space-y-3">
                  {details.length > 0 ? (
                    details.map((d, i) => (
                      <div key={d.id ?? `${d.label}-${i}`} className="flex items-start gap-3">
                        <div className="mt-0.5">
                          <div className="w-4 h-4 rounded-sm" style={{ background: d.color ?? "#E5E7EB" }} />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-slate-800">{d.label}</p>
                            <p className="text-sm font-semibold text-slate-800">{d.value}</p>
                          </div>
                          {d.description && <p className="text-xs text-slate-500">{d.description}</p>}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500">No details provided.</p>
                  )}
                </div>
              </div>

              {/* Quick Insights */}
              {quickInsights.length > 0 && (
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <h5 className="text-sm font-semibold text-slate-700 mb-3">Quick Insights</h5>
                  <div className="space-y-3">
                    {quickInsights.map((q, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-800">{q.title}</p>
                          {q.subtitle && <p className="text-xs text-slate-500">{q.subtitle}</p>}
                        </div>
                        <div className="text-sm font-semibold text-slate-900">{q.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Container for side-by-side cards */}
              <div className="grid grid-cols-2 gap-4">
                {/* Total Volume card */}
                {totalVolume && (
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-semibold text-slate-700">Total Volume</p>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreHorizontal size={14} />
                      </button>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{totalVolume.value}</p>
                    {totalVolume.change && <p className="text-xs text-green-600 mt-1">{totalVolume.change}</p>}
                  </div>
                )}

                {/* Transactions card */}
                {transactions && (
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-semibold text-slate-700">Transactions</p>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreHorizontal size={14} />
                      </button>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{transactions.value}</p>
                    {transactions.subtitle && <p className="text-xs text-gray-500 mt-1">{transactions.subtitle}</p>}
                  </div>
                )}
              </div>
            </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


MahatiAnalyticsWidget.displayName = "MahatiPieAnalyticsWidget";


export { MahatiAnalyticsWidget }; // Keep alias for backward compatibility