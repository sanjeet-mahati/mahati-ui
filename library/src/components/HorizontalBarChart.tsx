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
  justify-content: flex-end;
  margin-bottom: 2px;
`;

const MenuButton = styled.button`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
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

const Title = styled.div`
  color: rgba(23, 97, 163, 1);
  font-family: Poppins, sans-serif;
  font-size: 14px;
  font-weight: 600;
  line-height: normal;
  margin-bottom: 24px;

  @media (min-width: 640px) {
    font-size: 16px;
  }
`;

const ChartContent = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
`;

const LabelsColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding-top: 4px;
  min-height: 180px;
`;

const LabelRow = styled.div<{ $height: string; $marginBottom: string }>`
  display: flex;
  align-items: center;
  height: ${(props) => props.$height};
  margin-bottom: ${(props) => props.$marginBottom};
`;

const Label = styled.span`
  color: rgba(94, 94, 94, 1);
  font-family: Poppins, sans-serif;
  font-size: 12px;
  font-weight: 400;
  white-space: nowrap;

  @media (min-width: 640px) {
    font-size: 14px;
  }
`;

const ChartArea = styled.div`
  flex: 1;
  position: relative;
`;

const GridContainer = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  height: 180px;
`;

const GridLine = styled.div<{ $left: string; $centerOffset: number }>`
  position: absolute;
  left: calc(${(props) => props.$left}% - ${(props) => props.$centerOffset}px);
  top: 0;
  width: 1px;
  height: 165px;
  background-color: rgba(229, 231, 235, 1);
  z-index: 1;
`;

const YAxisLine = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  height: 165px;
  background-color: rgba(125, 125, 125, 1);
  z-index: 2;
`;

const XAxisLine = styled.div`
  position: absolute;
  left: 0;
  bottom: 15px;
  width: 100%;
  height: 2px;
  background-color: rgba(125, 125, 125, 1);
  z-index: 2;
`;

const BarsContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 4px;
  position: relative;
  z-index: 10;
  min-height: 180px;
`;

const BarRow = styled.div<{ $height: string; $marginBottom: string }>`
  display: flex;
  align-items: center;
  height: ${(props) => props.$height};
  margin-bottom: ${(props) => props.$marginBottom};
`;

const BarWrapper = styled.div`
  position: relative;
  height: 30px;
  width: 100%;
`;

const Bar = styled.div<{ $width: number; $color: string }>`
  width: ${(props) => props.$width}%;
  height: 30px;
  transform: rotate(0deg);
  transform-origin: top left;
  border-radius: 4px;
  background: ${(props) => props.$color};
  position: absolute;
  top: 0;
  left: 0;
`;

const XAxisLabels = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-top: -8px;
  width: 100%;
  position: relative;
  z-index: 10;
`;

const XAxisLabel = styled.span`
  color: rgba(94, 94, 94, 1);
  font-family: Poppins, sans-serif;
  font-size: 10px;
  font-weight: 400;

  @media (min-width: 640px) {
    font-size: 12px;
  }
`;


export interface HorizontalBarItem {
  name: string;
  value: number;
  color: string;
}

export interface HorizontalBarXAxisConfig {
  min: number;
  max: number;
  step: number;
  labels: number[];
}

export interface HorizontalBarTopPerformer {
  category: string;
  name: string;
  revenue: string;
  profit: string;
  needsFocus: string;
  change: string;
  isIncrease?: boolean;
}

export interface HorizontalBarProductData {
  title: string;
  xAxis?: Record<string, HorizontalBarXAxisConfig>;
  [year: string]: string | Record<string, any>;
}

export interface HorizontalBarData {
  title: string;
  xAxis?: Record<string, {
    min: number;
    max: number;
    step: number;
    labels: number[];
  }>;
  [year: string]: string | Record<string, any>;
}

export interface HorizontalBarChartData {
  data: HorizontalBarProductData;
  topPerformer?: HorizontalBarTopPerformer;
}

export interface HorizontalBarChartProps {
  title: string;
  bars: HorizontalBarItem[];
  selectedYear: string;
  selectedMonth: string;
  selectedType: string;
  xAxisConfig?: {
    min: number;
    max: number;
    step: number;
    labels: number[];
  };
  topPerformer?: {
    category: string;
    name: string;
    revenue: string;
    profit: string;
    needsFocus: string;
    change: string;
    isIncrease?: boolean;
  };
}

export const HorizontalBarChart: React.FC<HorizontalBarChartProps> = ({
  title,
  bars,
  selectedYear,
  selectedMonth,
  selectedType,
  xAxisConfig,
  topPerformer,
}) => {
  // Safety check for bars
  const safeBars = bars || [];
  const maxValue = safeBars.length > 0 ? Math.max(...safeBars.map((b) => b.value)) : 0;

  return (
    <Container>
      <HeaderRow>
        <MenuButton>
          <MenuDots>
            <Dot />
            <Dot />
            <Dot />
          </MenuDots>
        </MenuButton>
      </HeaderRow>

      <Title>{title}</Title>

      <ChartContent>
        <LabelsColumn>
          {safeBars.map((bar, index) => (
            <LabelRow
              key={bar.name}
              $height="45px"
              $marginBottom={index < safeBars.length - 1 ? "10px" : "0"}
            >
              <Label>{bar.name}</Label>
            </LabelRow>
          ))}
        </LabelsColumn>

        <ChartArea>
          <GridContainer>
            {xAxisConfig &&
              xAxisConfig.labels.map((label, idx) => {
                const totalLabels = xAxisConfig.labels.length;
                const position = (idx / (totalLabels - 1)) * 100;

                const labelText = String(label);
                const approxCharWidth = 7;
                const labelWidth = labelText.length * approxCharWidth;
                const centerOffset = labelWidth / 2;

                return (
                  <GridLine
                    key={`grid-${idx}`}
                    $left={position.toString()}
                    $centerOffset={centerOffset}
                  />
                );
              })}

            <YAxisLine />
            <XAxisLine />
          </GridContainer>

          <BarsContainer>
            {safeBars.map((bar, index) => {
              const maxValue = xAxisConfig?.max || 250;
              const barLengthPercentage = (bar.value / maxValue) * 100;

              return (
                <BarRow
                  key={bar.name}
                  $height="45px"
                  $marginBottom={index < safeBars.length - 1 ? "10px" : "0"}
                >
                  <BarWrapper>
                    <Bar $width={barLengthPercentage} $color={bar.color} />
                  </BarWrapper>
                </BarRow>
              );
            })}
          </BarsContainer>

          <XAxisLabels>
            {xAxisConfig &&
              xAxisConfig.labels.map((label, idx) => (
                <XAxisLabel key={idx}>{label}</XAxisLabel>
              ))}
          </XAxisLabels>
        </ChartArea>
      </ChartContent>
    </Container>
  );
};

HorizontalBarChart.displayName = "HorizontalBarChart";