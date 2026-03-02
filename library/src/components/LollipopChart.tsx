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
  font-size: 16px;
  font-weight: 600;
  line-height: normal;

  @media (min-width: 640px) {
    font-size: 18px;
  }
`;

const MenuButton = styled.button`
  width: 32px;
  height: 32px;
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

const ChartArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px 0;
  min-height: 300px;
  position: relative;
  overflow: visible;
`;

// Horizontal orientation styles
const HorizontalChartWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: relative;
  padding-left: 140px;
  width: 100%;

  @media (max-width: 1024px) {
    min-width: 800px;
  }
`;

const HorizontalGridContainer = styled.div`
  position: absolute;
  left: 140px;
  right: 0;
  top: 0;
  bottom: 0;
  pointer-events: none;
`;

const HorizontalGridLine = styled.div<{ $position: number }>`
  position: absolute;
  left: ${props => props.$position}%;
  top: 0;
  bottom: 0;
  width: 1px;
  background: rgba(229, 231, 235, 0.8);
`;

const HorizontalAxis = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 1px;
  background: rgba(209, 213, 219, 1);
`;

const HorizontalBottomAxis = styled.div`
  position: absolute;
  left: 140px;
  right: 0;
  bottom: 0;
  height: 1px;
  background: rgba(209, 213, 219, 1);
`;

const HorizontalAxisLabels = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  padding-left: 140px;
  font-size: 10px;
  color: rgba(107, 114, 128, 1);
  font-family: Poppins, sans-serif;
`;

const LollipopRowHorizontal = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
`;

const LabelWrapperHorizontal = styled.div`
  width: 120px;
  flex-shrink: 0;
  text-align: right;
  padding-right: 16px;
  position: absolute;
  left: -140px;
`;

const Label = styled.span`
  color: rgba(55, 65, 81, 1);
  font-family: Poppins, sans-serif;
  font-size: 12px;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (min-width: 640px) {
    font-size: 14px;
  }
`;

const BarContainerHorizontal = styled.div`
  flex: 1;
  position: relative;
  height: 40px;
  display: flex;
  align-items: center;
`;

const LineHorizontal = styled.div<{ $width: number; $color: string }>`
  width: ${props => props.$width}%;
  height: 4px;
  background: ${props => props.$color};
  border-radius: 2px;
  position: relative;
  transition: width 0.3s ease;
`;

const CircleHorizontal = styled.div<{ $color: string }>`
  position: absolute;
  right: -10px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${props => props.$color};
  border: 3px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-50%) scale(1.2);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;

const ValueLabelHorizontal = styled.span`
  margin-left: 16px;
  color: rgba(17, 24, 39, 1);
  font-family: Poppins, sans-serif;
  font-size: 14px;
  font-weight: 600;
  min-width: 50px;

  @media (min-width: 640px) {
    font-size: 16px;
  }
`;

// Vertical orientation styles
const VerticalChartWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  position: relative;
  padding-bottom: 60px;
  padding-left: 50px;
  min-height: 350px;

  @media (max-width: 1024px) {
    min-width: 800px;
  }
`;

const VerticalGridContainer = styled.div`
  position: absolute;
  left: 50px;
  right: 0;
  top: 0;
  bottom: 60px;
  pointer-events: none;
`;

const VerticalGridLine = styled.div<{ $position: number }>`
  position: absolute;
  left: 0;
  right: 0;
  top: ${props => 100 - props.$position}%;
  height: 1px;
  background: rgba(229, 231, 235, 0.8);
`;

const VerticalAxis = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  background: rgba(209, 213, 219, 1);
`;

const VerticalLeftAxis = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 1px;
  background: rgba(209, 213, 219, 1);
`;

const VerticalAxisLabels = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 10px;
  color: rgba(107, 114, 128, 1);
  font-family: Poppins, sans-serif;
  width: 45px;
  text-align: right;
  padding-right: 5px;
`;

const VerticalBarsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  width: 100%;
  flex: 1;
  gap: 16px;
  padding: 0 16px;
  position: relative;
`;

const LollipopColumnVertical = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 60px;
  max-width: 100px;
  height: 100%;
  position: relative;
`;

const BarContainerVertical = styled.div`
  flex: 1;
  position: relative;
  width: 40px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  height: 100%;
`;

const LineVertical = styled.div<{ $height: number; $color: string }>`
  height: ${props => props.$height}%;
  width: 4px;
  background: ${props => props.$color};
  border-radius: 2px;
  position: relative;
  transition: height 0.3s ease;
  min-height: ${props => props.$height > 0 ? '8px' : '0px'};
`;

const CircleVertical = styled.div<{ $color: string }>`
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${props => props.$color};
  border: 3px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateX(-50%) scale(1.2);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;

const ValueLabelVertical = styled.span`
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(17, 24, 39, 1);
  font-family: Poppins, sans-serif;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  white-space: nowrap;

  @media (min-width: 640px) {
    font-size: 16px;
  }
`;

const LabelWrapperVertical = styled.div`
  position: absolute;
  bottom: -50px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  max-width: 100px;
  width: max-content;
`;

const ScrollableWrapper = styled.div`
  width: 100%;
  overflow-x: visible;
  overflow-y: visible;
  
  @media (max-width: 1024px) {
    overflow-x: auto;
    overflow-y: visible;
    
    &::-webkit-scrollbar {
      height: 8px;
    }
    
    &::-webkit-scrollbar-track {
      background: rgba(243, 244, 246, 1);
      border-radius: 4px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: rgba(209, 213, 219, 1);
      border-radius: 4px;
    }
    
    &::-webkit-scrollbar-thumb:hover {
      background: rgba(156, 163, 175, 1);
    }
  }
`;

export interface LollipopItem {
  label: string;
  value: number;
  color?: string;
}

export interface LollipopData {
  title: string;
  [year: string]: any;
}

export interface LollipopChartProps {
  title: string;
  items: LollipopItem[];
  selectedYear: string;
  selectedMonth: string;
  selectedCategory: string;
  orientation?: "horizontal" | "vertical";
}

const DEFAULT_COLORS = [
  'rgba(37, 99, 235, 1)',
  'rgba(16, 185, 129, 1)',
  'rgba(245, 158, 11, 1)',
  'rgba(239, 68, 68, 1)',
  'rgba(147, 51, 234, 1)',
  'rgba(236, 72, 153, 1)',
];

export const LollipopChart: React.FC<LollipopChartProps> = ({
  title,
  items,
  selectedYear,
  selectedMonth,
  selectedCategory,
  orientation = "horizontal",
}) => {
  if (!items || items.length === 0) {
    return (
      <Container>
        <HeaderRow>
          <Title>{title}</Title>
          <MenuButton>
            <MenuDots>
              <MenuDot />
              <MenuDot />
              <MenuDot />
            </MenuDots>
          </MenuButton>
        </HeaderRow>
        <ChartArea>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            height: '100%',
            color: 'rgba(107, 114, 128, 1)',
            fontSize: '14px'
          }}>
            No data available
          </div>
        </ChartArea>
      </Container>
    );
  }

  const maxValue = Math.max(...items.map(item => item.value), 1);
  
  // Generate grid lines (0%, 25%, 50%, 75%, 100%)
  const gridPositions = [0, 25, 50, 75, 100];
  
  // Generate axis labels
  const axisLabels = gridPositions.map(pos => {
    const value = Math.round((pos / 100) * maxValue);
    return value;
  });

  return (
    <Container>
      <HeaderRow>
        <Title>{title}</Title>
        <MenuButton>
          <MenuDots>
            <MenuDot />
            <MenuDot />
            <MenuDot />
          </MenuDots>
        </MenuButton>
      </HeaderRow>

      <ChartArea>
        <ScrollableWrapper>
          {orientation === "horizontal" ? (
            // Horizontal orientation
            <>
              <HorizontalChartWrapper>
                <HorizontalGridContainer>
                  <HorizontalAxis />
                  {gridPositions.slice(1).map((pos, idx) => (
                    <HorizontalGridLine key={idx} $position={pos} />
                  ))}
                </HorizontalGridContainer>
                <HorizontalBottomAxis />
                
                {items.map((item, index) => {
                  const percentage = (item.value / maxValue) * 100;
                  const color = item.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length];

                  return (
                    <LollipopRowHorizontal key={`${item.label}-${index}`}>
                      <LabelWrapperHorizontal>
                        <Label>{item.label}</Label>
                      </LabelWrapperHorizontal>
                      <BarContainerHorizontal>
                        <LineHorizontal $width={percentage} $color={color}>
                          <CircleHorizontal $color={color} />
                        </LineHorizontal>
                        <ValueLabelHorizontal>{item.value}</ValueLabelHorizontal>
                      </BarContainerHorizontal>
                    </LollipopRowHorizontal>
                  );
                })}
              </HorizontalChartWrapper>
              
              <HorizontalAxisLabels>
                {axisLabels.map((label, idx) => (
                  <span key={idx}>{label}</span>
                ))}
              </HorizontalAxisLabels>
            </>
          ) : (
            // Vertical orientation
            <VerticalChartWrapper>
              <VerticalGridContainer>
                <VerticalAxis />
                <VerticalLeftAxis />
                {gridPositions.slice(1).map((pos, idx) => (
                  <VerticalGridLine key={idx} $position={pos} />
                ))}
              </VerticalGridContainer>
              
              <VerticalAxisLabels>
                {[...axisLabels].reverse().map((label, idx) => (
                  <span key={idx}>{label}</span>
                ))}
              </VerticalAxisLabels>
              
              <VerticalBarsContainer>
                {items.map((item, index) => {
                  const percentage = (item.value / maxValue) * 100;
                  const color = item.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length];

                  return (
                    <LollipopColumnVertical key={`${item.label}-${index}`}>
                      <BarContainerVertical>
                        <LineVertical $height={percentage} $color={color}>
                          <CircleVertical $color={color} />
                          <ValueLabelVertical>{item.value}</ValueLabelVertical>
                        </LineVertical>
                      </BarContainerVertical>
                      <LabelWrapperVertical>
                        <Label>{item.label}</Label>
                      </LabelWrapperVertical>
                    </LollipopColumnVertical>
                  );
                })}
              </VerticalBarsContainer>
            </VerticalChartWrapper>
          )}
        </ScrollableWrapper>
      </ChartArea>
    </Container>
  );
};

LollipopChart.displayName = "LollipopChart";