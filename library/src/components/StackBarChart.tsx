"use client";
import React, { useState } from "react";
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
  margin-bottom: 24px;
`;

const Title = styled.div`
  color: rgba(23, 97, 163, 1);
  font-family: Poppins, sans-serif;
  font-size: 14px;
  font-weight: 600;
  line-height: normal;

  @media (min-width: 640px) {
    font-size: 16px;
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
    background-color: rgba(243, 244, 246, 1);
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

const Dot = styled.span`
  width: 2px;
  height: 2px;
  background-color: rgba(107, 114, 128, 1);
  border-radius: 50%;

  @media (min-width: 640px) {
    width: 4px;
    height: 4px;
  }
`;

const ChartWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  min-height: 300px;
  width: 100%;
`;

const ChartArea = styled.div`
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: row;
  width: 100%;
`;

const YAxisContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  padding-right: 8px;
  width: 40px;
  height: 250px;
  flex-shrink: 0;
`;

const YAxisLabel = styled.span`
  color: rgba(94, 94, 94, 1);
  font-family: Poppins, sans-serif;
  font-size: 10px;
  font-weight: 400;

  @media (min-width: 640px) {
    font-size: 12px;
  }
`;

const ChartContentArea = styled.div`
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  height: 250px;
`;

const GridAndAxisContainer = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
`;

const GridLine = styled.div<{ $top: string }>`
  position: absolute;
  top: ${(props) => props.$top};
  left: 0;
  right: 0;
  height: 1px;
  background-color: rgba(229, 231, 235, 1);
  z-index: 1;
`;

const XAxisLine = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background-color: rgba(125, 125, 125, 1);
  z-index: 2;
`;

const YAxisLine = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: rgba(125, 125, 125, 1);
  z-index: 2;
`;

const BarsContainer = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  padding: 0 10px;
  height: 100%;
  z-index: 10;
  gap: 0;
`;

const BarWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  position: relative;
  max-width: 100px;
  height: 100%;
  padding: 0 8px;
`;

const StackedBar = styled.div<{ $height: number }>`
  width: 100%;
  max-width: 60px;
  height: ${(props) => props.$height}%;
  position: relative;
  display: flex;
  flex-direction: column-reverse;
  border-radius: 4px 4px 0 0;
  overflow: hidden;
  transition: all 0.3s ease;
`;

const BarSegment = styled.div<{ $percentage: number; $color: string }>`
  height: ${(props) => props.$percentage}%;
  background-color: ${(props) => props.$color};
  position: relative;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    opacity: 0.85;
    filter: brightness(1.1);
  }
`;

const TotalLabel = styled.div`
  position: absolute;
  top: -24px;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(94, 94, 94, 1);
  font-family: Poppins, sans-serif;
  font-size: 11px;
  font-weight: 500;
  white-space: nowrap;

  @media (min-width: 640px) {
    font-size: 12px;
    top: -26px;
  }
`;

const Tooltip = styled.div<{ $x: number; $y: number; $visible: boolean }>`
  position: fixed;
  left: ${(props) => props.$x}px;
  top: ${(props) => props.$y}px;
  background-color: rgba(158, 153, 153, 0.75);
  backdrop-filter: blur(10px);
  color: rgba(0, 0, 0, 1);
  padding: 10px 14px;
  border-radius: 8px;
  font-family: Poppins, sans-serif;
  font-size: 12px;
  font-weight: 500;
  pointer-events: none;
  z-index: 9999;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06), 0 1px 4px rgba(0, 0, 0, 0.04);
  white-space: nowrap;
  opacity: ${(props) => (props.$visible ? 1 : 0)};
  visibility: ${(props) => (props.$visible ? 'visible' : 'hidden')};
  transition: opacity 0.25s ease, visibility 0.25s ease;
  transform: translate(-50%, -100%) translateY(-10px);
  border: 1px solid rgba(209, 213, 219, 0.94);

  @media (min-width: 640px) {
    font-size: 13px;
    padding: 12px 16px;
  }
`;

const TooltipLabel = styled.div`
  color: rgba(0, 0, 0, 0.7);
  font-size: 11px;
  font-weight: 400;
  margin-bottom: 4px;

  @media (min-width: 640px) {
    font-size: 12px;
  }
`;

const TooltipValue = styled.div`
  color: rgba(0, 0, 0, 1);
  font-size: 14px;
  font-weight: 600;

  @media (min-width: 640px) {
    font-size: 15px;
  }
`;

const XAxisLabelsContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  padding: 0 10px;
  margin-top: 12px;
  margin-left: 40px;
  width: calc(100% - 40px);
`;

const XAxisLabelWrapper = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  max-width: 100px;
  padding: 0 8px;
  min-width: 0;
`;

const XAxisLabel = styled.span`
  color: rgba(94, 94, 94, 1);
  font-family: Poppins, sans-serif;
  font-size: 11px;
  font-weight: 400;
  text-align: center;
  word-break: break-word;
  word-wrap: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
  line-height: 1.3;
  max-width: 100%;
  white-space: normal;

  @media (min-width: 640px) {
    font-size: 12px;
  }
`;

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
  type: 'aggregating' | 'outstanding' | 'writeOff';
  value: number;
  label: string;
  x: number;
  y: number;
}

const DEFAULT_COLORS = {
  aggregating: 'rgba(37, 99, 235, 1)',
  outstanding: 'rgba(34, 197, 94, 1)',
  writeOff: 'rgba(239, 68, 68, 1)',
};

export const StackBarChart: React.FC<StackBarChartProps> = ({
  title,
  data,
  legends,
  selectedYear,
  selectedMonth,
  selectedWeek,
  selectedType,
  yAxisConfig,
  allData,
}) => {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  const safeData = data || [];
  
  const maxValue = yAxisConfig?.max || 125;
  const minValue = yAxisConfig?.min || 0;

  const yAxisLabels = yAxisConfig?.labels || [0, 25, 50, 75, 100, 125];

  // Build color map from legends or use defaults
  const getColorMap = (): Record<string, string> => {
    if (!legends || legends.length === 0) {
      return DEFAULT_COLORS;
    }
    
    const colorMap: Record<string, string> = {};
    legends.forEach(legend => {
      colorMap[legend.key] = legend.color;
    });
    
    return colorMap;
  };
  
  const COLORS = getColorMap();

  // Get label from legends or use default
  const getLabel = (key: string): string => {
    if (legends && legends.length > 0) {
      const legend = legends.find(l => l.key === key);
      if (legend) return legend.label;
    }
    
    // Default labels
    const defaultLabels: Record<string, string> = {
      aggregating: 'Aggregating Amount',
      outstanding: 'Outstanding Amount',
      writeOff: 'Write-Off Amount',
    };
    
    return defaultLabels[key] || key;
  };

  const formatValue = (value: number): string => {
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}k`;
    }
    return `$${value}`;
  };

  const calculateHeight = (value: number): number => {
    if (maxValue === minValue) return 0;
    const percentage = ((value - minValue) / (maxValue - minValue)) * 100;
    return Math.max(0, Math.min(100, percentage));
  };

  const handleSegmentMouseEnter = (
    event: React.MouseEvent<HTMLDivElement>,
    dayData: StackBarDayData,
    type: 'aggregating' | 'outstanding' | 'writeOff'
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top;

    setTooltip({
      day: dayData.day,
      type,
      value: dayData[type],
      label: getLabel(type),
      x,
      y,
    });
  };

  const handleSegmentMouseLeave = () => {
    setTooltip(null);
  };

  return (
    <Container>
      <HeaderRow>
        <Title>{title}</Title>
        <MenuButton>
          <MenuDots>
            <Dot />
            <Dot />
            <Dot />
          </MenuDots>
        </MenuButton>
      </HeaderRow>

      <ChartWrapper>
        <ChartArea>
          {/* Y-Axis Labels */}
          <YAxisContainer>
            {yAxisLabels.slice().reverse().map((label, idx) => (
              <YAxisLabel key={`y-${idx}`}>
                ${label}
              </YAxisLabel>
            ))}
          </YAxisContainer>

          {/* Chart Content */}
          <ChartContentArea>
            {/* Grid Lines & Axes */}
            <GridAndAxisContainer>
              {yAxisLabels.map((label, idx) => {
                const position = 100 - ((label - yAxisLabels[0]) / (yAxisLabels[yAxisLabels.length - 1] - yAxisLabels[0]) * 100);
                return (
                  <GridLine
                    key={`grid-${idx}`}
                    $top={`${position}%`}
                  />
                );
              })}
              <YAxisLine />
              <XAxisLine />
            </GridAndAxisContainer>

            {/* Stacked Bars */}
            <BarsContainer>
              {safeData.map((dayData, index) => {
                const total = dayData.aggregating + dayData.outstanding + dayData.writeOff;
                const totalHeight = calculateHeight(total);
                
                // Calculate percentage of each segment within the bar
                const aggregatingPercent = total > 0 ? (dayData.aggregating / total) * 100 : 0;
                const outstandingPercent = total > 0 ? (dayData.outstanding / total) * 100 : 0;
                const writeOffPercent = total > 0 ? (dayData.writeOff / total) * 100 : 0;

                return (
                  <BarWrapper key={`${dayData.day}-${index}`}>
                    <StackedBar $height={totalHeight}>
                      <TotalLabel>{formatValue(total)}</TotalLabel>
                      
                      {/* Write-Off (Red) - Bottom */}
                      {dayData.writeOff > 0 && (
                        <BarSegment 
                          $percentage={writeOffPercent} 
                          $color={COLORS.writeOff || DEFAULT_COLORS.writeOff}
                          onMouseEnter={(e) => handleSegmentMouseEnter(e, dayData, 'writeOff')}
                          onMouseLeave={handleSegmentMouseLeave}
                        />
                      )}
                      
                      {/* Outstanding (Green) - Middle */}
                      {dayData.outstanding > 0 && (
                        <BarSegment 
                          $percentage={outstandingPercent} 
                          $color={COLORS.outstanding || DEFAULT_COLORS.outstanding}
                          onMouseEnter={(e) => handleSegmentMouseEnter(e, dayData, 'outstanding')}
                          onMouseLeave={handleSegmentMouseLeave}
                        />
                      )}
                      
                      {/* Aggregating (Blue) - Top */}
                      {dayData.aggregating > 0 && (
                        <BarSegment 
                          $percentage={aggregatingPercent} 
                          $color={COLORS.aggregating || DEFAULT_COLORS.aggregating}
                          onMouseEnter={(e) => handleSegmentMouseEnter(e, dayData, 'aggregating')}
                          onMouseLeave={handleSegmentMouseLeave}
                        />
                      )}
                    </StackedBar>
                  </BarWrapper>
                );
              })}
            </BarsContainer>
          </ChartContentArea>
        </ChartArea>

        {/* X-Axis Labels */}
        <XAxisLabelsContainer>
          {safeData.map((dayData, index) => (
            <XAxisLabelWrapper key={`label-${index}`}>
              <XAxisLabel>{dayData.day}</XAxisLabel>
            </XAxisLabelWrapper>
          ))}
        </XAxisLabelsContainer>
      </ChartWrapper>

      {/* Tooltip */}
      {tooltip && (
        <Tooltip
          $x={tooltip.x}
          $y={tooltip.y}
          $visible={true}
        >
          <TooltipLabel>{tooltip.day} - {tooltip.label}</TooltipLabel>
          <TooltipValue>${tooltip.value}</TooltipValue>
        </Tooltip>
      )}
    </Container>
  );
};

StackBarChart.displayName = "StackBarChart";