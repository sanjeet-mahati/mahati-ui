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
  align-items: flex-end;
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

const ColumnsContainer = styled.div`
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

const ColumnWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  position: relative;
  max-width: 100px;
  height: 100%;
  padding: 0 4px;
`;

const Column = styled.div<{ $height: number; $gradient: string }>`
  width: 100%;
  max-width: 60px;
  height: ${(props) => props.$height}%;
  border-radius: 4px 4px 0 0;
  background: ${(props) => props.$gradient};
  position: relative;
  transition: all 0.3s ease;
  min-height: 2px;

  &:hover {
    opacity: 0.85;
    transform: translateY(-2px);
  }
`;

const ValueLabel = styled.div`
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

const XAxisLabelsContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  padding: 0 10px;
  margin-top: 12px;
  margin-left: 40px;  /* Match Y-axis width */
  width: calc(100% - 40px);
`;

const XAxisLabelWrapper = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  max-width: 100px;
  padding: 0 4px;
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

export interface ColumnItem {
  name: string;
  value: number;
  color?: string;
  gradient?: string;
}

export interface ColumnChartYAxisConfig {
  min: number;
  max: number;
  step: number;
  labels: number[];
}

export interface ColumnChartData {
  title: string;
  yAxis?: Record<string, ColumnChartYAxisConfig>;
  [year: string]: string | Record<string, any> | undefined;
}

export interface ColumnChartProps {
  title: string;
  columns: ColumnItem[];
  selectedYear: string;
  selectedMonth: string;
  selectedType: string;
  yAxisConfig?: {
    min: number;
    max: number;
    step: number;
    labels: number[];
  };
}

const defaultGradient = "linear-gradient(180deg, rgba(77, 175, 131, 1) 0%, rgba(23, 97, 163, 1) 100%)";

export const ColumnChart: React.FC<ColumnChartProps> = ({
  title,
  columns,
  selectedYear,
  selectedMonth,
  selectedType,
  yAxisConfig,
}) => {
  // Safety check for columns
  const safeColumns = columns || [];
  
  // Determine max value for height calculation
  const maxValue = yAxisConfig?.max || 8000;
  const minValue = yAxisConfig?.min || 0;

  // Generate Y-axis labels if not provided
  const yAxisLabels = yAxisConfig?.labels || [0, 2000, 4000, 6000, 8000];

  // Format value for display
  const formatValue = (value: number): string => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}k`;
    }
    return value.toString();
  };

  // Calculate column height percentage based on value
  const calculateHeight = (value: number): number => {
    if (maxValue === minValue) return 0;
    const percentage = ((value - minValue) / (maxValue - minValue)) * 100;
    return Math.max(0, Math.min(100, percentage)); // Clamp between 0-100
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
                {label >= 1000 ? `${label / 1000}k` : label}
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

            {/* Columns */}
            <ColumnsContainer>
              {safeColumns.map((column, index) => {
                const columnHeightPercentage = calculateHeight(column.value);
                const gradient = column.gradient || column.color || defaultGradient;

                return (
                  <ColumnWrapper key={`${column.name}-${index}`}>
                    <Column 
                      $height={columnHeightPercentage} 
                      $gradient={gradient}
                    >
                      <ValueLabel>{formatValue(column.value)}</ValueLabel>
                    </Column>
                  </ColumnWrapper>
                );
              })}
            </ColumnsContainer>
          </ChartContentArea>
        </ChartArea>

        {/* X-Axis Labels */}
        <XAxisLabelsContainer>
          {safeColumns.map((column, index) => (
            <XAxisLabelWrapper key={`label-${index}`}>
              <XAxisLabel>{column.name}</XAxisLabel>
            </XAxisLabelWrapper>
          ))}
        </XAxisLabelsContainer>
      </ChartWrapper>
    </Container>
  );
};

ColumnChart.displayName = "ColumnChart";