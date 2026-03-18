"use client";
import React from "react";

export interface HeatmapDayData {
  date: string;
  value: number;
  label?: string;
}

export interface HeatmapData {
  year: number;
  month: string;
  data: HeatmapDayData[];
  project?: string;
}

export interface CalendarHeatmapChartData {
  data: HeatmapData;
}

export interface CalendarHeatmapChartProps {
  data: HeatmapData;
  testId?: string;
  selectedProject: string;
  selectedYear: string;
  selectedType: string;
  onProjectChange: (project: string) => void;
  calendarheatmapData?: any;
}

const LEGEND_COLORS = [
  "rgba(224, 242, 254, 1)",
  "rgba(154, 219, 255, 1)",
  "rgba(102, 194, 241, 1)",
  "rgba(43, 160, 209, 1)",
  "rgba(23, 97, 163, 1)",
];

function getActivityColor(value: number): string {
  if (value === 0) return "rgba(224, 242, 254, 1)";
  if (value < 1000) return "rgba(154, 219, 255, 1)";
  if (value < 3000) return "rgba(102, 194, 241, 1)";
  if (value < 5000) return "rgba(43, 160, 209, 1)";
  return "rgba(23, 97, 163, 1)";
}

function getYearWeeks(
  year: number,
  calendarheatmapData: any,
  project: string,
  type: string
) {
  const weeks: { days: { date: Date; value: number }[]; monthLabel?: string }[] = [];
  const startDate = new Date(year, 0, 1);
  const firstDayOfWeek = startDate.getDay();
  const daysToMonday = firstDayOfWeek === 0 ? -6 : 1 - firstDayOfWeek;
  const firstMonday = new Date(year, 0, 1 + daysToMonday);
  const currentDate = new Date(firstMonday);
  let lastMonth = -1;
  let weekIndex = 0;
  const maxWeeks = 54;

  const MONTH_NAMES_FULL = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];
  const MONTH_NAMES_SHORT = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec",
  ];

  while (weekIndex < maxWeeks) {
    const weekDays: { date: Date; value: number }[] = [];
    let hasCurrentYearDate = false;

    for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
      const date = new Date(currentDate);
      if (date.getFullYear() === year) hasCurrentYearDate = true;

      let value = 0;
      if (date.getFullYear() === year) {
        const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
        const monthName = MONTH_NAMES_FULL[date.getMonth()];
        if (
          calendarheatmapData?.[project]?.[String(year)]?.[type]?.[monthName]
        ) {
          const dayData = calendarheatmapData[project][String(year)][type][monthName].data.find(
            (d: any) => d.date === dateStr
          );
          if (dayData) value = dayData.value;
        }
      }

      weekDays.push({ date, value });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    if (hasCurrentYearDate) {
      const thursday = weekDays[3].date;
      const weekMonth = thursday.getMonth();
      let monthLabel: string | undefined;
      if (weekMonth !== lastMonth && thursday.getFullYear() === year) {
        monthLabel = MONTH_NAMES_SHORT[weekMonth];
        lastMonth = weekMonth;
      }
      weeks.push({ days: weekDays, monthLabel });
    }

    if (currentDate.getFullYear() > year && currentDate.getMonth() > 0) break;
    weekIndex++;
  }

  return weeks;
}

export const CalendarHeatmapChart: React.FC<CalendarHeatmapChartProps> = ({
  data,
  selectedProject,
  selectedYear,
  selectedType,
  onProjectChange,
  calendarheatmapData,
  testId,
}) => {
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = React.useState(false);
  const [hoveredCell, setHoveredCell] = React.useState<string | null>(null);
  const [tooltipData, setTooltipData] = React.useState<{
    visible: boolean;
    month: string;
    day: number;
    value: number;
    position: { x: number; y: number };
    cellColor: string;
  }>({
    visible: false,
    month: "",
    day: 0,
    value: 0,
    position: { x: 0, y: 0 },
    cellColor: "rgba(77, 175, 131, 1)",
  });

  const projects = ["Project 1", "Project 2"];
  const year = parseInt(selectedYear);
  const yearWeeks = getYearWeeks(year, calendarheatmapData || {}, selectedProject, selectedType);

  const dayRows = [[], [], [], [], [], [], []] as {
    date: Date;
    value: number;
    weekIdx: number;
  }[][];

  yearWeeks.forEach((week, weekIdx) => {
    week.days.forEach((day, dayIdx) => {
      dayRows[dayIdx].push({ ...day, weekIdx });
    });
  });

  return (
    <div className="w-full h-full flex flex-col" data-testid={testId}>

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Dropdown */}
          <div className="relative">
            <button
              className="flex items-center gap-2 bg-transparent px-3 py-1.5 rounded hover:bg-gray-50 transition-colors border-none cursor-pointer"
              onClick={() => setIsProjectDropdownOpen(!isProjectDropdownOpen)}
            >
              <span className="text-[rgba(51,51,51,1)] font-[Poppins,sans-serif] text-sm sm:text-base font-semibold">
                {selectedProject}
              </span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                className="transition-transform duration-200"
                style={{ transform: isProjectDropdownOpen ? "rotate(180deg)" : "rotate(0deg)" }}
              >
                <path
                  d="M2.5 4.5L6 8L9.5 4.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {isProjectDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[150px]">
                {projects.map((project, idx) => (
                  <button
                    key={project}
                    className={[
                      "w-full text-left px-4 py-2 bg-white border-none hover:bg-gray-50 transition-colors cursor-pointer",
                      idx === 0 ? "rounded-tl-lg rounded-tr-lg" : "",
                      idx === projects.length - 1 ? "rounded-bl-lg rounded-br-lg" : "",
                    ].join(" ")}
                    onClick={() => {
                      onProjectChange(project);
                      setIsProjectDropdownOpen(false);
                    }}
                  >
                    <span className="text-[rgba(51,51,51,1)] font-[Poppins,sans-serif] text-sm sm:text-base font-semibold">
                      {project}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Menu button */}
        <button className="w-8 h-8 flex items-center justify-center rounded bg-[rgba(224,242,229,1)] border-none cursor-pointer hover:bg-gray-100 transition-colors">
          <div className="flex gap-1">
            <span className="w-1 h-1 bg-gray-500 rounded-full" />
            <span className="w-1 h-1 bg-gray-500 rounded-full" />
            <span className="w-1 h-1 bg-gray-500 rounded-full" />
          </div>
        </button>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-2 mb-6 pr-2">
        <span className="text-[rgba(100,100,100,1)] font-[Poppins,sans-serif] text-[10px] font-medium mx-1">
          Less
        </span>
        {LEGEND_COLORS.map((color) => (
          <div
            key={color}
            className="w-3.5 h-3.5 rounded-[2px]"
            style={{ backgroundColor: color }}
          />
        ))}
        <span className="text-[rgba(100,100,100,1)] font-[Poppins,sans-serif] text-[10px] font-medium mx-1">
          More
        </span>
      </div>

      {/* Heatmap */}
      <div className="flex-1 flex">
        {/* Day labels */}
        <div className="flex flex-col justify-start pr-2 pt-5 shrink-0">
          {["M", "T", "W", "T", "F", "S", "S"].map((day, idx) => (
            <div
              key={idx}
              className="h-3.5 flex items-center justify-end text-[rgba(100,100,100,1)] font-[Poppins,sans-serif] text-[9px] font-medium mb-0.5"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="flex-1">
          <div className="min-w-max">
            {/* Month headers */}
            <div className="flex gap-0.5 mb-1 h-[18px]">
              {yearWeeks.map((week, idx) => (
                <div key={idx} className="w-3.5 text-center">
                  {week.monthLabel && (
                    <span className="text-[rgba(100,100,100,1)] font-[Poppins,sans-serif] text-[8px] font-medium">
                      {week.monthLabel}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Day rows */}
            {dayRows.map((row, rowIdx) => (
              <div key={rowIdx} className="flex gap-0.5 mb-0.5">
                {row.map((cell, colIdx) => {
                  const { date, value } = cell;
                  const color = getActivityColor(value);
                  const isCurrentYear = date.getFullYear() === year;
                  const cellKey = `${rowIdx}-${colIdx}`;
                  const isHovered = hoveredCell === cellKey;

                  return (
                    <div
                      key={colIdx}
                      className="w-3.5 h-3.5 rounded-[2px] relative transition-all duration-100"
                      style={{
                        backgroundColor: isCurrentYear ? color : "rgba(240,240,240,1)",
                        opacity: isCurrentYear ? 1 : 0.3,
                        cursor: isCurrentYear ? "pointer" : "default",
                        transform: isHovered && isCurrentYear ? "scale(1.05)" : "scale(1)",
                      }}
                      onMouseEnter={(e) => {
                        if (isCurrentYear) {
                          setHoveredCell(cellKey);
                          const rect = e.currentTarget.getBoundingClientRect();
                          const monthName = date.toLocaleDateString("en-US", { month: "long" });
                          setTooltipData({
                            visible: true,
                            month: `${monthName} ${date.getFullYear()}`,
                            day: date.getDate(),
                            value,
                            cellColor: color,
                            position: { x: rect.left + rect.width / 2, y: rect.top },
                          });
                        }
                      }}
                      onMouseLeave={() => {
                        setHoveredCell(null);
                        setTooltipData((prev) => ({ ...prev, visible: false }));
                      }}
                    >
                      {isCurrentYear && value > 0 && (
                        <div
                          className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-200"
                          style={{ opacity: isHovered ? 1 : 0 }}
                        >
                          <span className="text-[6px] font-bold text-white [text-shadow:0_1px_1px_rgba(0,0,0,0.8)]">
                            {date.getDate()}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {tooltipData.visible && (
        <div
          className="fixed pointer-events-none z-[9999]"
          style={{
            left: tooltipData.position.x,
            top: tooltipData.position.y,
            transform: "translate(-50%, -120%)",
          }}
        >
          <div
            className="flex flex-col min-w-[127px] max-w-[200px] w-max rounded-md bg-white"
            style={{
              border: "1px solid rgba(77, 175, 131, 0.72)",
              boxShadow: "0 4px 14px 0 rgba(77, 175, 131, 0.3)",
              padding: "8px 48px 11px 10px",
            }}
          >
            <div className="text-black font-[Poppins,sans-serif] text-xs font-semibold leading-normal mb-1.5 whitespace-nowrap">
              {tooltipData.month.split(" ")[0]} {tooltipData.day}
            </div>
            <div
              className="h-px bg-[rgba(234,234,234,1)] mb-1.5"
              style={{ marginLeft: "-2px", marginRight: "-40px", width: "calc(100% + 42px)" }}
            />
            <div className="flex items-center gap-1">
              <div
                className="shrink-0 w-3 h-3 rounded-[2px]"
                style={{ backgroundColor: tooltipData.cellColor }}
              />
              <span className="text-[rgba(129,129,129,1)] font-[Poppins,sans-serif] text-[11px] font-medium leading-normal whitespace-nowrap">
                Total {tooltipData.value.toLocaleString()} activity
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

CalendarHeatmapChart.displayName = "CalendarHeatmapChart";