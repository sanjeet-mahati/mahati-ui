"use client";
import React from "react";

// Asset helper function
type AssetModule =
  | string
  | { src?: string; default?: string | { src?: string } }
  | { default?: string }
  | { default?: { src?: string } };

const assetSrc = (m: AssetModule): string => {
  if (typeof m === "string") return m;
  const anyM = m as any;
  if (typeof anyM?.src === "string") return anyM.src;
  const d = anyM?.default;
  if (typeof d === "string") return d;
  if (typeof d?.src === "string") return d.src;
  return "";
};

const arrowDownIcon = require("../assets/icons/down_4.png") as AssetModule;

export const GANTT_COLORS = {
  green: "rgba(44, 160, 44, 1)",
  blue: "rgba(37, 99, 235, 1)",
  orange: "rgba(255, 127, 14, 1)",
  red: "rgba(239, 68, 68, 1)",
  purple: "rgba(147, 51, 234, 1)",
  teal: "rgba(20, 184, 166, 1)",
  pink: "rgba(236, 72, 153, 1)",
  yellow: "rgba(234, 179, 8, 1)",
  indigo: "rgba(99, 102, 241, 1)",
  emerald: "rgba(16, 185, 129, 1)",
} as const;

export interface GanttTask {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  progress: number;
  status: "In Progress" | "On Target" | "Overdue" | "Completed";
  color: keyof typeof GANTT_COLORS;
}

export interface GanttData {
  title: string;
  projectName: string;
  tasks: GanttTask[];
}

export interface GanttChartData {
  data: GanttData;
}

export interface GanttChartProps {
  data: GanttData;
  selectedYear: string;
  selectedMonth: string;
  testId?: string;
  selectedProject: string;
  onProjectChange: (project: string) => void;
}

export const GanttChart: React.FC<GanttChartProps> = ({
  data,
  selectedYear,
  selectedMonth,
  selectedProject,
  onProjectChange,
  testId,
}) => {
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = React.useState(false);

  const projects = ["Project 1", "Project 2"];
  const projectData = data;

  const getMonthNames = (monthRange: string): string[] => {
    const monthMap: Record<string, string> = {
      Jan: "January", Feb: "February", Mar: "March", Apr: "April",
      May: "May", Jun: "June", Jul: "July", Aug: "August",
      Sep: "September", Oct: "October", Nov: "November", Dec: "December",
    };
    const [month1, month2] = monthRange.split(" - ").map((m) => m.trim());
    return [monthMap[month1], monthMap[month2]];
  };

  const getMonthNumber = (monthRange: string): [string, string] => {
    const monthNumberMap: Record<string, string> = {
      Jan: "01", Feb: "02", Mar: "03", Apr: "04",
      May: "05", Jun: "06", Jul: "07", Aug: "08",
      Sep: "09", Oct: "10", Nov: "11", Dec: "12",
    };
    const [month1, month2] = monthRange.split(" - ").map((m) => m.trim());
    return [monthNumberMap[month1], monthNumberMap[month2]];
  };

  const getTodayPosition = () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;
    const currentDay = today.getDate();

    const [month1, month2] = selectedMonth.split(" - ").map((m) => m.trim());
    const monthToNumber: Record<string, number> = {
      Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6,
      Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12,
    };

    const selectedMonth1 = monthToNumber[month1];
    const selectedMonth2 = monthToNumber[month2];
    const selectedYearNum = parseInt(selectedYear);

    if (currentYear !== selectedYearNum) return null;

    let monthIndex = -1;
    if (currentMonth === selectedMonth1) monthIndex = 0;
    else if (currentMonth === selectedMonth2) monthIndex = 1;
    else return null;

    const daysInMonth = 31;
    const dayPercent = (currentDay - 1) / daysInMonth;
    const positionInMonth = dayPercent * 320;

    const mobileLeft = monthIndex === 0 ? 120 + positionInMonth : 450 + positionInMonth;
    const desktopLeft = monthIndex === 0 ? 137 + positionInMonth : 467 + positionInMonth;

    return {
      show: true,
      mobileLeft: Math.round(mobileLeft * 100) / 100,
      desktopLeft: Math.round(desktopLeft * 100) / 100,
    };
  };

  const todayPosition = getTodayPosition();
  const months = getMonthNames(selectedMonth);
  const displayMonths = months.map((m) => `${m} ${selectedYear}`);
  const [month1Num, month2Num] = getMonthNumber(selectedMonth);

  const getTaskPosition = (startDate: string, endDate: string) => {
    const [startDay, startMonth] = startDate.split("/").map(Number);
    const [endDay, endMonth] = endDate.split("/").map(Number);

    const [month1, month2] = selectedMonth.split(" - ").map((m) => m.trim());
    const monthToNumber: Record<string, number> = {
      Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6,
      Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12,
    };
    const selectedMonth1Num = monthToNumber[month1];
    const selectedMonth2Num = monthToNumber[month2];
    const daysInMonth = 31;

    let monthIndex = -1;
    let startPercent = 0;
    let width = 0;
    let isInSecondMonth = false;

    if (startMonth === selectedMonth1Num && endMonth === selectedMonth1Num) {
      monthIndex = 0;
      startPercent = ((startDay - 1) / daysInMonth) * 100;
      width = (endDay / daysInMonth) * 100 - startPercent;
    } else if (startMonth === selectedMonth2Num && endMonth === selectedMonth2Num) {
      monthIndex = 1;
      isInSecondMonth = true;
      startPercent = ((startDay - 1) / daysInMonth) * 100;
      width = (endDay / daysInMonth) * 100 - startPercent;
    } else if (startMonth === selectedMonth1Num && endMonth === selectedMonth2Num) {
      monthIndex = 2;
      startPercent = ((startDay - 1) / daysInMonth) * 100;
      width = 100 + (endDay / daysInMonth) * 100 - startPercent;
    }

    return { startPercent, width, monthIndex, isInSecondMonth };
  };

  const lineHeight = React.useMemo(() => {
    const baseHeight = 30;
    const taskHeight = 32;
    const taskSpacing = 24;
    return baseHeight + projectData.tasks.length * (taskHeight + taskSpacing);
  }, [projectData.tasks.length]);

  const DateRangeBoxes: React.FC<{ monthNum: string }> = ({ monthNum }) => (
    <div className="flex gap-2">
      {[
        `01/${monthNum} - 10/${monthNum}`,
        `11/${monthNum} - 20/${monthNum}`,
        `21/${monthNum} - 25/${monthNum}`,
        `26/${monthNum} - 31/${monthNum}`,
      ].map((range) => (
        <div
          key={range}
          className="w-[74px] h-6 rounded"
          style={{ background: "rgba(225, 237, 241, 1)", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <span
            style={{
              color: "rgba(0,0,0,1)",
              fontFamily: "Poppins, sans-serif",
              fontSize: "8px",
              fontWeight: 600,
            }}
          >
            {range}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col" data-testid={testId}>
      {/* Header Row */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        {/* Project Dropdown */}
        <div className="relative">
          <button
            className="flex items-center gap-2 bg-transparent px-2 py-1 rounded cursor-pointer border-none transition-colors hover:bg-[rgba(249,250,251,1)]"
            onClick={() => setIsProjectDropdownOpen(!isProjectDropdownOpen)}
          >
            <span
              style={{
                color: "rgba(51,51,51,1)",
                fontFamily: "Poppins, sans-serif",
                fontSize: "16px",
                fontWeight: 600,
              }}
            >
              {selectedProject}
            </span>
            <div
              style={{
                width: "12px",
                height: "12px",
                background: `url(${assetSrc(arrowDownIcon)}) transparent 50% / cover no-repeat`,
                aspectRatio: "1/1",
                transform: isProjectDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s",
              }}
            />
          </button>

          {isProjectDropdownOpen && (
            <div
              className="absolute top-full left-0 mt-1 bg-white border rounded-lg z-50 min-w-[150px]"
              style={{
                border: "1px solid rgba(229,231,235,1)",
                boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
              }}
            >
              {projects.map((project, idx) => (
                <button
                  key={project}
                  className={`w-full text-left px-4 py-2 bg-white border-none cursor-pointer transition-colors hover:bg-[rgba(249,250,251,1)] ${
                    idx === 0 ? "rounded-tl-lg rounded-tr-lg" : ""
                  } ${idx === projects.length - 1 ? "rounded-bl-lg rounded-br-lg" : ""}`}
                  onClick={() => {
                    onProjectChange(project);
                    setIsProjectDropdownOpen(false);
                  }}
                >
                  <span
                    style={{
                      color: "rgba(51,51,51,1)",
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "16px",
                      fontWeight: 600,
                    }}
                  >
                    {project}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Menu Button */}
        <button
          className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded bg-transparent border-none cursor-pointer transition-colors hover:bg-[rgba(243,244,246,1)]"
        >
          <div className="flex gap-[2px] sm:gap-1">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-[2px] h-[2px] sm:w-1 sm:h-1 rounded-full"
                style={{ background: "rgba(107,114,128,1)" }}
              />
            ))}
          </div>
        </button>
      </div>

      {/* Month Headers */}
      <div className="relative h-8 mb-4">
        <div className="absolute left-0 w-[120px] sm:w-[137px] h-8" />
        {[
          { left: "120px", smLeft: "137px", label: displayMonths[0] },
          { left: "450px", smLeft: "467px", label: displayMonths[1] },
        ].map(({ left, smLeft, label }) => (
          <div
            key={label}
            className="absolute top-0 w-[320px] h-8 rounded flex items-center justify-center"
            style={{
              left,
              background: "linear-gradient(90deg, rgba(23,97,163,1) 0%, rgba(77,175,131,1) 100%)",
            }}
          >
            <span
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: "10px",
                fontWeight: 600,
                color: "white",
              }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Date Range Boxes */}
      <div className="relative h-6 mb-6">
        <div className="absolute" style={{ left: "120px" }}>
          <DateRangeBoxes monthNum={month1Num} />
        </div>
        <div className="absolute" style={{ left: "450px" }}>
          <DateRangeBoxes monthNum={month2Num} />
        </div>
      </div>

      {/* Grid Lines and Tasks */}
      <div className="relative">
        {/* Month 1 Grid Lines */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((section) => (
          <div
            key={`m1-${section}`}
            className="absolute w-px"
            style={{
              backgroundColor: "rgba(234,234,234,1)",
              left: `${120 + section * 40}px`,
              top: "-30px",
              height: `${lineHeight}px`,
            }}
          />
        ))}
        <div
          className="absolute w-px"
          style={{
            backgroundColor: "rgba(234,234,234,1)",
            left: `${120 + 8 * 40 + 20}px`,
            top: "-30px",
            height: `${lineHeight}px`,
          }}
        />

        {/* Month 2 Grid Lines */}
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((section) => (
          <div
            key={`m2-${section}`}
            className="absolute w-px"
            style={{
              backgroundColor: "rgba(234,234,234,1)",
              left: `${450 + section * 40 - 40}px`,
              top: "-30px",
              height: `${lineHeight}px`,
            }}
          />
        ))}

        {/* Today Indicator */}
        {todayPosition?.show && (
          <div
            className="absolute w-[2px] z-0"
            style={{
              background: "rgba(32,148,243,1)",
              left: `${todayPosition.mobileLeft}px`,
              top: "-24px",
              height: `${lineHeight - 30}px`,
            }}
          >
            <div
              className="absolute w-10 h-[18px] flex items-center justify-center rounded-r"
              style={{
                background: "rgba(32,148,243,1)",
                top: "10px",
                left: "0px",
              }}
            >
              <span
                style={{
                  color: "white",
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "8px",
                  fontWeight: 500,
                }}
              >
                Today
              </span>
            </div>
          </div>
        )}

        {/* Task Rows */}
        <div className="flex flex-col gap-4 sm:gap-6 mt-6 sm:mt-8">
          {projectData.tasks.map((task) => {
            const { startPercent, width, monthIndex, isInSecondMonth } = getTaskPosition(
              task.startDate,
              task.endDate
            );
            if (monthIndex === -1) return null;
            const taskColor = GANTT_COLORS[task.color] || GANTT_COLORS.blue;

            return (
              <div key={task.id} className="flex items-center">
                {/* Label */}
                <div
                  className="flex-shrink-0 pr-2 sm:pr-4 overflow-hidden text-ellipsis whitespace-nowrap"
                  style={{
                    width: "120px",
                    color: "rgba(0,0,0,1)",
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "10px",
                    fontWeight: 500,
                  }}
                >
                  {task.name}
                </div>

                {/* Timeline */}
                <div className="relative flex-1 h-7 sm:h-8">
                  <div
                    className="absolute h-full"
                    style={{
                      left: isInSecondMonth ? "330px" : "0",
                      width: "320px",
                    }}
                  >
                    <div
                      className="absolute h-full rounded-full flex items-center justify-between px-2 sm:px-3"
                       data-testid={`gantt-task-${task.id}`}
                      style={{
                        left: `${startPercent}%`,
                        width: `${width}%`,
                        backgroundColor: taskColor,
                      }}
                    >
                      <span
                        className="text-white overflow-hidden text-ellipsis whitespace-nowrap ml-5"
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontSize: "10px",
                          fontWeight: 600,
                        }}
                      >
                        {task.name}
                      </span>
                      <div
                        className="rounded-full py-[2px] px-2 sm:px-3 sm:py-1 whitespace-nowrap"
                        style={{
                          fontSize: "8px",
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 600,
                          backgroundColor: "rgba(255,255,255,1)",
                          color: taskColor,
                        }}
                      >
                        {task.status}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

GanttChart.displayName = "GanttChart";