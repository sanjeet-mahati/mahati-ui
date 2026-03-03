"use client";
import React from "react";
import styled from "@emotion/styled";

// Asset helper function
type AssetModule =
  | string
  | { src?: string; default?: string | { src?: string } }
  | { default?: string }
  | { default?: { src?: string } };

const assetSrc = (m: AssetModule): string => {
  if (typeof m === 'string') return m;
  const anyM = m as any;
  if (typeof anyM?.src === 'string') return anyM.src;
  const d = anyM?.default;
  if (typeof d === 'string') return d;
  if (typeof d?.src === 'string') return d.src;
  return '';
};

const arrowDownIcon = require('../assets/icons/down_4.png') as AssetModule;

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

  @media (min-width: 640px) {
    margin-bottom: 24px;
  }
`;

const DropdownWrapper = styled.div`
  position: relative;
`;

const DropdownButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.2s;
  border: none;
  cursor: pointer;

  &:hover {
    background: rgba(249, 250, 251, 1);
  }
`;

const DropdownText = styled.span`
  color: rgba(51, 51, 51, 1);
  font-family: Poppins, sans-serif;
  font-size: 16px;
  font-weight: 600;
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
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: rgba(243, 244, 246, 1);
  }

  @media (min-width: 640px) {
    width: 32px;
    height: 32px;
  }
`;

const MenuDots = styled.div`
  display: flex;
  gap: 2px;

  @media (min-width: 640px) {
    gap: 4px;
  }
`;

const MenuDot = styled.span`
  width: 2px;
  height: 2px;
  background: rgba(107, 114, 128, 1);
  border-radius: 50%;

  @media (min-width: 640px) {
    width: 4px;
    height: 4px;
  }
`;

const DateRangeBox = styled.div`
  width: 74px;
  height: 24px;
  border-radius: 4px;
  background: rgba(225, 237, 241, 1);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DateRangeText = styled.span`
  color: rgba(0, 0, 0, 1);
  font-family: Poppins, sans-serif;
  font-size: 8px;
  font-weight: 600;
`;

const TasksContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 24px;

  @media (min-width: 640px) {
    gap: 24px;
    margin-top: 32px;
  }
`;

const TaskRow = styled.div`
  display: flex;
  align-items: center;
`;

const TaskLabel = styled.div`
  width: 120px;
  flex-shrink: 0;
  padding-right: 8px;
  color: rgba(0, 0, 0, 1);
  font-family: Poppins, sans-serif;
  font-size: 10px;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (min-width: 640px) {
    width: 137px;
    padding-right: 16px;
    font-size: 12px;
  }
`;

const TaskTimeline = styled.div`
  position: relative;
  flex: 1;
  height: 28px;

  @media (min-width: 640px) {
    height: 32px;
  }
`;

const TaskName = styled.span`
  color: white;
  font-family: Poppins, sans-serif;
  font-size: 10px;
  font-weight: 600;
  margin-left: 20px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

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
  testId?:string;
  selectedProject: string;
  onProjectChange: (project: string) => void;
}

export const GanttChart: React.FC<GanttChartProps> = ({
  data,
  selectedYear,
  selectedMonth,
  selectedProject,
  onProjectChange,
  testId
}) => {
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = React.useState(false);

  const projects = ["Project 1", "Project 2"];
  const projectData = data;

  const getMonthNames = (monthRange: string): string[] => {
    const monthMap: Record<string, string> = {
      'Jan': 'January', 'Feb': 'February', 'Mar': 'March', 'Apr': 'April',
      'May': 'May', 'Jun': 'June', 'Jul': 'July', 'Aug': 'August',
      'Sep': 'September', 'Oct': 'October', 'Nov': 'November', 'Dec': 'December'
    };
    
    const [month1, month2] = monthRange.split(' - ').map(m => m.trim());
    return [monthMap[month1], monthMap[month2]];
  };

  const getMonthNumber = (monthRange: string): [string, string] => {
    const monthNumberMap: Record<string, string> = {
      'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04',
      'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08',
      'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
    };
    
    const [month1, month2] = monthRange.split(' - ').map(m => m.trim());
    return [monthNumberMap[month1], monthNumberMap[month2]];
  };

  const getTodayPosition = () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;
    const currentDay = today.getDate();

    const [month1, month2] = selectedMonth.split(' - ').map(m => m.trim());
    const monthToNumber: Record<string, number> = {
      'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6,
      'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12
    };
    
    const selectedMonth1 = monthToNumber[month1];
    const selectedMonth2 = monthToNumber[month2];
    const selectedYearNum = parseInt(selectedYear);

    if (currentYear !== selectedYearNum) {
      return null;
    }

    let monthIndex = -1;

    if (currentMonth === selectedMonth1) {
      monthIndex = 0;
    } else if (currentMonth === selectedMonth2) {
      monthIndex = 1;
    } else {
      return null;
    }

    const daysInMonth = 31;
    const dayPercent = (currentDay - 1) / daysInMonth;
    const positionInMonth = dayPercent * 320;

    const mobileLeft = monthIndex === 0 
      ? 120 + positionInMonth 
      : 450 + positionInMonth;
    
    const desktopLeft = monthIndex === 0 
      ? 137 + positionInMonth 
      : 467 + positionInMonth;

    return {
      show: true,
      mobileLeft: Math.round(mobileLeft * 100) / 100,
      desktopLeft: Math.round(desktopLeft * 100) / 100,
    };
  };

  const todayPosition = getTodayPosition();

  const months = getMonthNames(selectedMonth);
  const displayMonths = months.map(m => `${m} ${selectedYear}`);
  const [month1Num, month2Num] = getMonthNumber(selectedMonth);

  const getTaskPosition = (startDate: string, endDate: string) => {
    const [startDay, startMonth] = startDate.split('/').map(Number);
    const [endDay, endMonth] = endDate.split('/').map(Number);
    
    const [month1, month2] = selectedMonth.split(' - ').map(m => m.trim());
    const monthToNumber: Record<string, number> = {
      'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6,
      'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12
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
      const endPercent = (endDay / daysInMonth) * 100;
      width = endPercent - startPercent;
    } else if (startMonth === selectedMonth2Num && endMonth === selectedMonth2Num) {
      monthIndex = 1;
      isInSecondMonth = true;
      startPercent = ((startDay - 1) / daysInMonth) * 100;
      const endPercent = (endDay / daysInMonth) * 100;
      width = endPercent - startPercent;
    } else if (startMonth === selectedMonth1Num && endMonth === selectedMonth2Num) {
      monthIndex = 2;
      startPercent = ((startDay - 1) / daysInMonth) * 100;
      const endPercent = 100 + (endDay / daysInMonth) * 100;
      width = endPercent - startPercent;
    }
    
    return { startPercent, width, monthIndex, isInSecondMonth };
  };

  const lineHeight = React.useMemo(() => {
    const baseHeight = 30;
    const taskHeight = 32;
    const taskSpacing = 24;
    const totalHeight = baseHeight + (projectData.tasks.length * (taskHeight + taskSpacing));
    return totalHeight;
  }, [projectData.tasks.length]);

  const DateRangeBoxes: React.FC<{ monthNum: string }> = ({ monthNum }) => (
    <div style={{ display: 'flex', gap: '8px' }}>
      <DateRangeBox>
        <DateRangeText>01/{monthNum} - 10/{monthNum}</DateRangeText>
      </DateRangeBox>
      <DateRangeBox>
        <DateRangeText>11/{monthNum} - 20/{monthNum}</DateRangeText>
      </DateRangeBox>
      <DateRangeBox>
        <DateRangeText>21/{monthNum} - 25/{monthNum}</DateRangeText>
      </DateRangeBox>
      <DateRangeBox>
        <DateRangeText>26/{monthNum} - 31/{monthNum}</DateRangeText>
      </DateRangeBox>
    </div>
  );

  return (
    <Container data-testid={testId}>
      <HeaderRow>
        <DropdownWrapper>
          <DropdownButton onClick={() => setIsProjectDropdownOpen(!isProjectDropdownOpen)}>
            <DropdownText>{selectedProject}</DropdownText>
            <div
              style={{
                width: '12px',
                height: '12px',
                background: `url(${assetSrc(arrowDownIcon)}) transparent 50% / cover no-repeat`,
                aspectRatio: '1/1',
                transform: isProjectDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s',
              }}
            />
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
                <DropdownText>{project}</DropdownText>
              </DropdownItem>
            ))}
          </DropdownMenu>
        </DropdownWrapper>

        <MenuButton>
          <MenuDots>
            <MenuDot />
            <MenuDot />
            <MenuDot />
          </MenuDots>
        </MenuButton>
      </HeaderRow>

      {/* Month Headers */}
      <div style={{ position: 'relative', height: '32px', marginBottom: '16px' }}>
        <div style={{ position: 'absolute', left: '0', width: '120px', height: '32px' }} className="sm:w-[137px]"></div>
        
        <div 
          style={{
            position: 'absolute',
            left: '120px',
            top: '0',
            width: '320px',
            height: '32px',
            borderRadius: '4px',
            background: 'linear-gradient(90deg, rgba(23,97,163,1) 0%, rgba(77,175,131,1) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          className="sm:left-[137px] sm:w-[320px]"
        >
          <span style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: '10px',
            fontWeight: 600,
            color: 'white',
          }} className="sm:text-[12px]">
            {displayMonths[0]}
          </span>
        </div>

        <div 
          style={{
            position: 'absolute',
            left: '450px',
            top: '0',
            width: '320px',
            height: '32px',
            borderRadius: '4px',
            background: 'linear-gradient(90deg, rgba(23,97,163,1) 0%, rgba(77,175,131,1) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          className="sm:left-[467px] sm:w-[320px]"
        >
          <span style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: '10px',
            fontWeight: 600,
            color: 'white',
          }} className="sm:text-[12px]">
            {displayMonths[1]}
          </span>
        </div>
      </div>

      {/* Date Range Boxes */}
      <div style={{ position: 'relative', height: '24px', marginBottom: '24px' }}>
        <div style={{ position: 'absolute', left: '120px' }} className="sm:left-[137px]">
          <DateRangeBoxes monthNum={month1Num} />
        </div>

        <div style={{ position: 'absolute', left: '450px' }} className="sm:left-[467px]">
          <DateRangeBoxes monthNum={month2Num} />
        </div>
      </div>

      {/* Grid Lines and Tasks */}
      <div style={{ position: 'relative' }}>
        {/* Month 1 Grid Lines - Mobile */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((section) => (
          <div
            key={`month1-line-mobile-${section}`}
            className="sm:hidden"
            style={{
              position: 'absolute',
              width: '1px',
              backgroundColor: 'rgba(234,234,234,1)',
              left: `${120 + (section * 40)}px`,
              top: '-30px',
              height: `${lineHeight}px`,
            }}
          />
        ))}
        <div
          key="month1-line-mobile-extra"
          className="sm:hidden"
          style={{
            position: 'absolute',
            width: '1px',
            backgroundColor: 'rgba(234,234,234,1)',
            left: `${120 + (8 * 40) + 20}px`,
            top: '-30px',
            height: `${lineHeight}px`,
          }}
        />

        {/* Month 1 Grid Lines - Desktop */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((section) => (
          <div
            key={`month1-line-desktop-${section}`}
            className="hidden sm:block"
            style={{
              position: 'absolute',
              width: '1px',
              backgroundColor: 'rgba(234,234,234,1)',
              left: `${137 + (section * 40)}px`,
              top: '-30px',
              height: `${lineHeight}px`,
            }}
          />
        ))}
        <div
          key="month1-line-desktop-extra"
          className="hidden sm:block"
          style={{
            position: 'absolute',
            width: '1px',
            backgroundColor: 'rgba(234,234,234,1)',
            left: `${137 + (8 * 40) + 20}px`,
            top: '-30px',
            height: `${lineHeight}px`,
          }}
        />

        {/* Month 2 Grid Lines - Mobile */}
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((section) => (
          <div
            key={`month2-line-mobile-${section}`}
            className="sm:hidden"
            style={{
              position: 'absolute',
              width: '1px',
              backgroundColor: 'rgba(234,234,234,1)',
              left: `${450 + (section * 40) - 40}px`,
              top: '-30px',
              height: `${lineHeight}px`,
            }}
          />
        ))}

        {/* Month 2 Grid Lines - Desktop */}
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((section) => (
          <div
            key={`month2-line-desktop-${section}`}
            className="hidden sm:block"
            style={{
              position: 'absolute',
              width: '1px',
              backgroundColor: 'rgba(234,234,234,1)',
              left: `${467 + (section * 40) - 40}px`,
              top: '-30px',
              height: `${lineHeight}px`,
            }}
          />
        ))}

        {/* Today Indicator */}
        {todayPosition && todayPosition.show && (
          <>
            {/* Mobile Today Line */}
            <div 
              className="sm:hidden"
              style={{
                position: 'absolute',
                width: '2px',
                background: 'rgba(32,148,243,1)',
                zIndex: 0,
                left: `${todayPosition.mobileLeft}px`,
                top: '-24px',
                height: `${lineHeight - 30}px`,
              }}
            >
              <div 
                style={{
                  position: 'absolute',
                  width: '40px',
                  height: '18px',
                  background: 'rgba(32,148,243,1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  top: '10px',
                  left: '0px',
                  borderRadius: '0 4px 4px 0',
                }}
              >
                <span style={{
                  color: 'white',
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '8px',
                  fontWeight: 500,
                }}>
                  Today
                </span>
              </div>
            </div>

            {/* Desktop Today Line */}
            <div 
              className="hidden sm:block"
              style={{
                position: 'absolute',
                width: '2px',
                background: 'rgba(32,148,243,1)',
                zIndex: 0,
                left: `${todayPosition.desktopLeft}px`,
                top: '-24px',
                height: `${lineHeight - 30}px`,
              }}
            >
              <div 
                style={{
                  position: 'absolute',
                  width: '40px',
                  height: '18px',
                  background: 'rgba(32,148,243,1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  top: '10px',
                  left: '0px',
                  borderRadius: '0 4px 4px 0',
                }}
              >
                <span style={{
                  color: 'white',
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '8px',
                  fontWeight: 500,
                }}>
                  Today
                </span>
              </div>
            </div>
          </>
        )}

        {/* Task Rows */}
        <TasksContainer>
          {projectData.tasks.map((task) => {
            const { startPercent, width, monthIndex, isInSecondMonth } = getTaskPosition(task.startDate, task.endDate);
            
            if (monthIndex === -1) return null;
            
            const taskColor = GANTT_COLORS[task.color] || GANTT_COLORS.blue;
            
            return (
              <TaskRow key={task.id}>
                <TaskLabel>{task.name}</TaskLabel>

                <TaskTimeline>
                  {!isInSecondMonth ? (
                    <div style={{ position: 'absolute', left: '0', width: '320px', height: '100%' }} className="sm:w-[320px]">
                      <div 
                        style={{
                          position: 'absolute',
                          height: '100%',
                          borderRadius: '9999px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0 8px',
                          left: `${startPercent}%`,
                          width: `${width}%`,
                          backgroundColor: taskColor,
                        }}
                        className="sm:px-3"
                      >
                        <TaskName>{task.name}</TaskName>
                        
                        <div 
                          style={{
                            borderRadius: '9999px',
                            padding: '2px 8px',
                            fontSize: '8px',
                            fontFamily: 'Poppins, sans-serif',
                            fontWeight: 600,
                            whiteSpace: 'nowrap',
                            backgroundColor: 'rgba(255, 255, 255, 1)',
                            color: taskColor,
                          }}
                          className="sm:px-3 sm:py-1"
                        >
                          {task.status}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ position: 'absolute', left: '330px', width: '320px', height: '100%' }} className="sm:left-[330px] sm:w-[320px]">
                      <div 
                        style={{
                          position: 'absolute',
                          height: '100%',
                          borderRadius: '9999px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0 8px',
                          left: `${startPercent}%`,
                          width: `${width}%`,
                          backgroundColor: taskColor,
                        }}
                        className="sm:px-3"
                      >
                        <TaskName>{task.name}</TaskName>
                        
                        <div 
                          style={{
                            borderRadius: '9999px',
                            padding: '2px 8px',
                            fontSize: '8px',
                            fontFamily: 'Poppins, sans-serif',
                            fontWeight: 600,
                            whiteSpace: 'nowrap',
                            backgroundColor: 'rgba(255, 255, 255, 1)',
                            color: taskColor,
                          }}
                          className="sm:px-3 sm:py-1"
                        >
                          {task.status}
                        </div>
                      </div>
                    </div>
                  )}
                </TaskTimeline>
              </TaskRow>
            );
          })}
        </TasksContainer>
      </div>
    </Container>
  );
};

GanttChart.displayName = "GanttChart";