"use client";

import React, { useState, useMemo } from "react";
import { ChartInterface } from "./ChartInterface"; // Assuming Chart component exists
import { Dropdown as MahatiDropdown } from "./Dropdown";
import { MoreHorizontal } from "lucide-react";

export interface DetailItem {
  id?: string;
  label: string;
  value: string | number;
  description?: string;
  color: string;
}

interface MahatiPieAnalyticsWidgetProps {
  title?: string;
  chartType?: "pie" | "doughnut";
  data: { labels: string[]; datasets: { data: number[]; backgroundColor: string[]; borderColor?: string | string[]; borderWidth?: number | number[]; }[] };
  options?: any;      // Chart.js options
  details: DetailItem[];
  dropdownOptions?: string[];
  onDropdownSelect?: (value: string) => void;
  hoverTooltipText?: string;
  className?: string;
}

const MahatiPieAnalyticsWidget: React.FC<MahatiPieAnalyticsWidgetProps> = ({
  title = "Analytics",
  chartType = "doughnut",
  data,
  options = {},
  details,
  dropdownOptions = [],
  onDropdownSelect,
  hoverTooltipText = "",
  className = "",
}) => {
  const [hover, setHover] = useState(false);
  const donutOptions = useMemo(() => {
    return {
      cutout: "60%",
      plugins: {
        legend: { display: false },
        tooltip: { /* your tooltip config */ },
      },
      ...options,
    };
  }, [options]);

  return (
    <div className={`w-full bg-white border border-gray-200 rounded-lg shadow-sm p-6 ${className}`}>
      {/* Title */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        {dropdownOptions.length > 0 && (
          <MahatiDropdown
            options={dropdownOptions}
            onSelect={onDropdownSelect!}
            variant="outline"
            className="w-[130px] h-[30px] rounded border [background:linear-gradient(90deg,rgba(23,97,163,0.07)_0%,rgba(77,175,131,0.07)_100%)] border-solid border-[#D2D2D2]"
          />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart */}
        <div
          className="relative bg-gray-50 rounded-lg p-4 hover:shadow-lg"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          {/* Optional hover tooltip */}
          {hover && hoverTooltipText && (
            <div className="absolute top-2 left-2 bg-white text-xs text-gray-700 px-2 py-1 rounded shadow-sm border border-gray-200">
              {hoverTooltipText}
            </div>
          )}

          <div className="h-64">
            <ChartInterface type={chartType} data={data} options={donutOptions} />
          </div>

          {/* Optional small action menu icon */}
          <div className="absolute top-3 right-3">
            <button className="p-1 rounded hover:bg-gray-100">
              <MoreHorizontal size={16} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Details / Legend */}
        <div className="space-y-4">
          {details.map((d) => (
            <div key={d.id ?? d.label} className="flex items-start gap-3">
              <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: d.color }} />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-800">{d.label}</span>
                  <span className="text-sm font-semibold text-gray-900">{d.value}</span>
                </div>
                {d.description && <p className="text-xs text-gray-500">{d.description}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


MahatiPieAnalyticsWidget.displayName = "MahatiPieAnalyticsWidget";

export { MahatiPieAnalyticsWidget };