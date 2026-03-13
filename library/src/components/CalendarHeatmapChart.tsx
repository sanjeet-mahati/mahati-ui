"use client";
import React from "react";
import styled from "@emotion/styled";

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const DropdownWrapper = styled.div`
  position: relative;
`;

const DropdownButton = styled.button<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  padding: 6px 12px;
  border-radius: 4px;
  transition: background-color 0.2s;
  border: none;
  cursor: pointer;

  &:hover {
    background: rgba(249, 250, 251, 1);
  }
`;

const DropdownLabel = styled.span`
  color: rgba(51, 51, 51, 1);
  font-family: Poppins, sans-serif;
  font-size: 14px;
  font-weight: 600;

  @media (min-width: 640px) {
    font-size: 16px;
  }
`;

const DropdownArrow = styled.svg<{ $isOpen: boolean }>`
  width: 12px;
  height: 12px;
  transition: transform 0.2s;
  transform: ${(props) => (props.$isOpen ? "rotate(180deg)" : "rotate(0deg)")};
`;

const DropdownMenu = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 4px;
  background: white;
  border: 1px solid rgba(229, 231, 235, 1);
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  z-index: 50;
  min-width: 150px;
  display: ${(props) => (props.$isOpen ? "block" : "none")};
`;

const DropdownItem = styled.button`
  width: 100%;
  text-align: left;
  padding: 8px 16px;
  background: white;
  border: none;
  transition: background-color 0.2s;
  cursor: pointer;

  &:first-of-type {
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }

  &:last-of-type {
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
  }

  &:hover {
    background: rgba(249, 250, 251, 1);
  }
`;

const MenuButton = styled.button`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  background: rgba(224, 242, 229, 1);
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: rgba(243, 244, 246, 1);
  }
`;

const MenuDots = styled.div`
  display: flex;
  gap: 4px;
`;

const MenuDot = styled.span`
  width: 4px;
  height: 4px;
  background: rgba(107, 114, 128, 1);
  border-radius: 50%;
`;

const LegendRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  margin-bottom: 24px;
  padding-right: 8px;
`;

const LegendLabel = styled.span`
  color: rgba(100, 100, 100, 1);
  font-family: Poppins, sans-serif;
  font-size: 10px;
  font-weight: 500;
  margin: 0 4px;
`;

const LegendBox = styled.div<{ $color: string }>`
  width: 14px;
  height: 14px;
  border-radius: 2px;
  background-color: ${(props) => props.$color};
`;

const HeatmapContainer = styled.div`
  flex: 1;
  display: flex;
`;

const DayLabelsColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding-right: 8px;
  padding-top: 20px;
  flex-shrink: 0;
`;

const DayLabel = styled.div`
  height: 14px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  color: rgba(100, 100, 100, 1);
  font-family: Poppins, sans-serif;
  font-size: 9px;
  font-weight: 500;
  margin-bottom: 2px;
`;

const GridContainer = styled.div`
  flex: 1;
`;

const GridWrapper = styled.div`
  min-width: max-content;
`;

const MonthHeaderRow = styled.div`
  display: flex;
  gap: 2px;
  margin-bottom: 4px;
  height: 18px;
`;

const MonthLabel = styled.div`
  width: 14px;
  text-align: center;
`;

const MonthText = styled.span`
  color: rgba(100, 100, 100, 1);
  font-family: Poppins, sans-serif;
  font-size: 8px;
  font-weight: 500;
`;

const DayRow = styled.div`
  display: flex;
  gap: 2px;
  margin-bottom: 2px;
`;

const DayCell = styled.div<{ $color: string; $opacity: number; $isCurrentYear: boolean }>`
  width: 14px;
  height: 14px;
  border-radius: 2px;
  background-color: ${(props) => props.$color};
  opacity: ${(props) => props.$opacity};
  position: relative;
  cursor: ${(props) => (props.$isCurrentYear ? "pointer" : "default")};
  transition: all 0.1s;

  &:hover {
    ${(props) =>
      props.$isCurrentYear &&
      `
      transform: scale(1.05);
    `}
  }
`;

const DayNumber = styled.div<{ $isHovered: boolean }>`
  position: absolute;
  inset: 0;
  opacity: ${(props) => (props.$isHovered ? 1 : 0)};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s;
  pointer-events: none;
`;

const DayNumberText = styled.span`
  font-size: 6px;
  font-weight: 700;
  color: white;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.8);
`;

const TooltipContainer = styled.div<{ $visible: boolean; $x: number; $y: number }>`
  position: fixed;
  left: ${(props) => props.$x}px;
  top: ${(props) => props.$y}px;
  transform: translate(-50%, -120%);
  pointer-events: none;
  z-index: 9999;
  display: ${(props) => (props.$visible ? "block" : "none")};
`;

const TooltipBox = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 127px;
  max-width: 200px;
  width: max-content;
  border-radius: 6px;
  border: 1px solid rgba(77, 175, 131, 0.72);
  background: white;
  box-shadow: 0 4px 14px 0 rgba(77, 175, 131, 0.3);
  padding: 8px 48px 11px 10px;
`;

const TooltipDate = styled.div`
  color: rgba(0, 0, 0, 1);
  font-family: Poppins, sans-serif;
  font-size: 12px;
  font-weight: 600;
  line-height: normal;
  margin-bottom: 6px;
  white-space: nowrap;
`;

const TooltipDivider = styled.div`
  height: 1px;
  background-color: rgba(234, 234, 234, 1);
  margin-bottom: 6px;
  margin-left: -2px;
  margin-right: -40px;
  width: calc(100% + 42px);
`;

const TooltipValue = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const TooltipColorBox = styled.div<{ $color: string }>`
  flex-shrink: 0;
  width: 12px;
  height: 12px;
  border-radius: 2px;
  background-color: ${(props) => props.$color};
`;

const TooltipText = styled.span`
  color: rgba(129, 129, 129, 1);
  font-family: Poppins, sans-serif;
  font-size: 11px;
  font-weight: 500;
  line-height: normal;
  white-space: nowrap;
`;

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
  testId?:string;
  selectedProject: string;
  selectedYear: string;
  selectedType: string;
  onProjectChange: (project: string) => void;
  calendarheatmapData?: any;
}

export const CalendarHeatmapChart: React.FC<CalendarHeatmapChartProps> = ({
  data,
  selectedProject,
  selectedYear,
  selectedType,
  onProjectChange,
  calendarheatmapData,
  testId
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

  const getYearWeeks = (
    year: number,
    calendarheatmapData: any,
    project: string,
    type: string
  ) => {
    const weeks: { days: { date: Date; value: number }[]; monthLabel?: string }[] = [];

    const startDate = new Date(year, 0, 1);

    const firstDayOfWeek = startDate.getDay();
    const daysToMonday = firstDayOfWeek === 0 ? -6 : 1 - firstDayOfWeek;
    const firstMonday = new Date(year, 0, 1 + daysToMonday);

    const currentDate = new Date(firstMonday);
    let lastMonth = -1;

    let weekIndex = 0;
    const maxWeeks = 54;

    while (weekIndex < maxWeeks) {
      const weekDays: { date: Date; value: number }[] = [];
      let hasCurrentYearDate = false;

      for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
        const date = new Date(currentDate);

        if (date.getFullYear() === year) {
          hasCurrentYearDate = true;
        }

        let value = 0;
        if (date.getFullYear() === year) {
          const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
          const monthNames = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ];
          const monthName = monthNames[date.getMonth()];

          if (
            calendarheatmapData &&
            calendarheatmapData[project] &&
            calendarheatmapData[project][String(year)] &&
            calendarheatmapData[project][String(year)][type] &&
            calendarheatmapData[project][String(year)][type][monthName]
          ) {
            const monthData = calendarheatmapData[project][String(year)][type][monthName].data;
            const dayData = monthData.find((d: any) => d.date === dateStr);
            if (dayData) {
              value = dayData.value;
            }
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
          const monthNames = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ];
          monthLabel = monthNames[weekMonth];
          lastMonth = weekMonth;
        }

        weeks.push({ days: weekDays, monthLabel });
      }

      if (currentDate.getFullYear() > year && currentDate.getMonth() > 0) {
        break;
      }

      weekIndex++;
    }

    return weeks;
  };

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

  const getActivityColor = (value: number): string => {
    if (value === 0) return "rgba(224, 242, 254, 1)";
    if (value < 1000) return "rgba(154, 219, 255, 1)";
    if (value < 3000) return "rgba(102, 194, 241, 1)";
    if (value < 5000) return "rgba(43, 160, 209, 1)";
    return "rgba(23, 97, 163, 1)";
  };

  return (
    <Container data-testid={testId}>
      <HeaderRow>
        <LeftSection>
          <DropdownWrapper>
            <DropdownButton
              $isOpen={isProjectDropdownOpen}
              onClick={() => setIsProjectDropdownOpen(!isProjectDropdownOpen)}
            >
              <DropdownLabel>{selectedProject}</DropdownLabel>
              <DropdownArrow
                $isOpen={isProjectDropdownOpen}
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
              >
                <path
                  d="M2.5 4.5L6 8L9.5 4.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </DropdownArrow>
            </DropdownButton>

            <DropdownMenu $isOpen={isProjectDropdownOpen}>
              {projects.map((project) => (
                <DropdownItem
                  key={project}
                  onClick={() => {
                    onProjectChange(project);
                    setIsProjectDropdownOpen(false);
                  }}
                >
                  <DropdownLabel>{project}</DropdownLabel>
                </DropdownItem>
              ))}
            </DropdownMenu>
          </DropdownWrapper>
        </LeftSection>

        <MenuButton>
          <MenuDots>
            <MenuDot />
            <MenuDot />
            <MenuDot />
          </MenuDots>
        </MenuButton>
      </HeaderRow>

      <LegendRow>
        <LegendLabel>Less</LegendLabel>
        <LegendBox $color="rgba(224, 242, 254, 1)" />
        <LegendBox $color="rgba(154, 219, 255, 1)" />
        <LegendBox $color="rgba(102, 194, 241, 1)" />
        <LegendBox $color="rgba(43, 160, 209, 1)" />
        <LegendBox $color="rgba(23, 97, 163, 1)" />
        <LegendLabel>More</LegendLabel>
      </LegendRow>

      <HeatmapContainer>
        <DayLabelsColumn>
          {["M", "T", "W", "T", "F", "S", "S"].map((day, idx) => (
            <DayLabel key={idx}>{day}</DayLabel>
          ))}
        </DayLabelsColumn>

        <GridContainer>
          <GridWrapper>
            <MonthHeaderRow>
              {yearWeeks.map((week, idx) => (
                <MonthLabel key={idx}>
                  {week.monthLabel && <MonthText>{week.monthLabel}</MonthText>}
                </MonthLabel>
              ))}
            </MonthHeaderRow>

            {dayRows.map((row, rowIdx) => (
              <DayRow key={rowIdx}>
                {row.map((cell, colIdx) => {
                  const { date, value } = cell;
                  const color = getActivityColor(value);
                  const isCurrentYear = date.getFullYear() === year;
                  const cellKey = `${rowIdx}-${colIdx}`;

                  return (
                    <DayCell
                      key={colIdx}
                      $color={isCurrentYear ? color : "rgba(240, 240, 240, 1)"}
                      $opacity={isCurrentYear ? 1 : 0.3}
                      $isCurrentYear={isCurrentYear}
                      onMouseEnter={(e) => {
                        if (isCurrentYear) {
                          setHoveredCell(cellKey);
                          const rect = e.currentTarget.getBoundingClientRect();
                          const monthName = date.toLocaleDateString("en-US", { month: "long" });
                          setTooltipData({
                            visible: true,
                            month: `${monthName} ${date.getFullYear()}`,
                            day: date.getDate(),
                            value: value,
                            cellColor: color,
                            position: {
                              x: rect.left + rect.width / 2,
                              y: rect.top,
                            },
                          });
                        }
                      }}
                      onMouseLeave={() => {
                        setHoveredCell(null);
                        setTooltipData((prev) => ({ ...prev, visible: false }));
                      }}
                    >
                      {isCurrentYear && value > 0 && (
                        <DayNumber $isHovered={hoveredCell === cellKey}>
                          <DayNumberText>{date.getDate()}</DayNumberText>
                        </DayNumber>
                      )}
                    </DayCell>
                  );
                })}
              </DayRow>
            ))}
          </GridWrapper>
        </GridContainer>
      </HeatmapContainer>

      <TooltipContainer
        $visible={tooltipData.visible}
        $x={tooltipData.position.x}
        $y={tooltipData.position.y}
      >
        <TooltipBox>
          <TooltipDate>
            {tooltipData.month.split(" ")[0]} {tooltipData.day}
          </TooltipDate>
          <TooltipDivider />
          <TooltipValue>
            <TooltipColorBox $color={tooltipData.cellColor} />
            <TooltipText>Total {tooltipData.value.toLocaleString()} activity</TooltipText>
          </TooltipValue>
        </TooltipBox>
      </TooltipContainer>
    </Container>
  );
};

CalendarHeatmapChart.displayName = "CalendarHeatmapChart";