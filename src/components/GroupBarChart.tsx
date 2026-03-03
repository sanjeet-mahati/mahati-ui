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

const GroupsContainer = styled.div`
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

const GroupWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: center;
  position: relative;
  height: 100%;
  gap: 4px;
  padding: 0 8px;
`;

const BarWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  position: relative;
  max-width: 30px;
  height: 100%;
`;

const Bar = styled.div<{ $height: number; $color: string }>`
  width: 100%;
  height: ${(props) => props.$height}%;
  border-radius: 4px 4px 0 0;
  background: ${(props) => props.$color};
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
  font-size: 10px;
  font-weight: 500;
  white-space: nowrap;

  @media (min-width: 640px) {
    font-size: 11px;
    top: -26px;
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

export interface GroupBarLegendItem {
  key: string;           // e.g., "revenue", "profit", "loss", "cost"
  label: string;         // e.g., "Revenue", "Profit", "Loss"
  color: string;         // e.g., "rgba(23, 97, 163, 1)"
}

export interface GroupBarItem {
  name: string;
  revenue: number;
  profitOrLoss?: number;  // ✅ OPTIONAL: If not provided, will be calculated as revenue - cost
  cost: number;
}

export interface GroupBarChartYAxisConfig {
  min: number;
  max: number;
  step: number;
  labels: number[];
}

export interface GroupBarChartData {
  title: string;
  legends?: GroupBarLegendItem[];  // ✅ NEW: Legend configuration from JSON
  yAxis?: Record<string, GroupBarChartYAxisConfig>;
  [year: string]: string | Record<string, any> | undefined;
}

export interface GroupBarChartProps {
  title: string;
  groups: GroupBarItem[];
  legends?: GroupBarLegendItem[];  // ✅ NEW: Pass legends to component
  selectedYear: string;
  selectedMonth: string;
  yAxisConfig?: {
    min: number;
    max: number;
    step: number;
    labels: number[];
  };
}

// ✅ DEFAULT COLORS (fallback if not provided in JSON)
const DEFAULT_BAR_COLORS = {
  revenue: 'rgba(23, 97, 163, 1)',
  profit: 'rgba(77, 175, 131, 1)',
  loss: 'rgba(220, 38, 38, 1)',
  cost: 'rgba(47, 164, 169, 1)',
};

export const GroupBarChart: React.FC<GroupBarChartProps> = ({
  title,
  groups,
  legends,
  selectedYear,
  selectedMonth,
  yAxisConfig,
}) => {
  const safeGroups = groups || [];
  
  const maxValue = yAxisConfig?.max || 125;
  const minValue = yAxisConfig?.min || 0;

  const yAxisLabels = yAxisConfig?.labels || [0, 25, 50, 75, 100, 125];

  // ✅ Build color map from legends or use defaults
  const getColorMap = (): Record<string, string> => {
    if (!legends || legends.length === 0) {
      return DEFAULT_BAR_COLORS;
    }
    
    const colorMap: Record<string, string> = {};
    legends.forEach(legend => {
      colorMap[legend.key] = legend.color;
    });
    
    return colorMap;
  };
  
  const BAR_COLORS = getColorMap();

  const formatValue = (value: number): string => {
    return value.toString();
  };

  const calculateHeight = (value: number): number => {
    if (maxValue === minValue) return 0;
    const percentage = ((value - minValue) / (maxValue - minValue)) * 100;
    return Math.max(0, Math.min(100, percentage));
  };

  // ✅ Helper function to get profit/loss (auto-calculate if not provided)
  const getProfitOrLoss = (group: GroupBarItem): number => {
    // If profitOrLoss is explicitly provided in data, use it
    if (group.profitOrLoss !== undefined && group.profitOrLoss !== null) {
      return group.profitOrLoss;
    }
    // Otherwise, calculate: profit/loss = revenue - cost
    return group.revenue - group.cost;
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
              <YAxisLabel key={`y-${idx}`}>{label}</YAxisLabel>
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

            {/* Grouped Bars */}
            <GroupsContainer>
              {safeGroups.map((group, index) => {
                // ✅ Get profit/loss (auto-calculated if not in data)
                const profitOrLossValue = getProfitOrLoss(group);
                const isProfitable = profitOrLossValue >= 0;
                const profitLossColor = isProfitable ? BAR_COLORS.profit : BAR_COLORS.loss;
                const profitLossAbsValue = Math.abs(profitOrLossValue);
                
                return (
                  <GroupWrapper key={`${group.name}-${index}`}>
                    {/* Revenue Bar */}
                    <BarWrapper>
                      <Bar 
                        $height={calculateHeight(group.revenue)} 
                        $color={BAR_COLORS.revenue}
                      >
                        <ValueLabel>{formatValue(group.revenue)}</ValueLabel>
                      </Bar>
                    </BarWrapper>

                    {/* Profit/Loss Bar */}
                    <BarWrapper>
                      <Bar 
                        $height={calculateHeight(profitLossAbsValue)} 
                        $color={profitLossColor}
                      >
                        <ValueLabel>{formatValue(profitLossAbsValue)}</ValueLabel>
                      </Bar>
                    </BarWrapper>

                    {/* Cost Bar */}
                    <BarWrapper>
                      <Bar 
                        $height={calculateHeight(group.cost)} 
                        $color={BAR_COLORS.cost}
                      >
                        <ValueLabel>{formatValue(group.cost)}</ValueLabel>
                      </Bar>
                    </BarWrapper>
                  </GroupWrapper>
                );
              })}
            </GroupsContainer>
          </ChartContentArea>
        </ChartArea>

        {/* X-Axis Labels */}
        <XAxisLabelsContainer>
          {safeGroups.map((group, index) => (
            <XAxisLabelWrapper key={`label-${index}`}>
              <XAxisLabel>{group.name}</XAxisLabel>
            </XAxisLabelWrapper>
          ))}
        </XAxisLabelsContainer>
      </ChartWrapper>
    </Container>
  );
};

GroupBarChart.displayName = "GroupBarChart";