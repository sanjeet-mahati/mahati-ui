"use client";
import React from "react";
import styled from "@emotion/styled";

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
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

const BulletsContainer = styled.div`
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 35px;

  @media (min-width: 640px) {
    gap: 45px;
  }
`;

const BulletItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 9px;
`;

const BulletName = styled.div`
  color: rgba(23, 97, 163, 1);
  font-family: Poppins, sans-serif;
  font-size: 12px;
  font-weight: 600;
  line-height: normal;

  @media (min-width: 640px) {
    font-size: 14px;
  }
`;

const BulletContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (min-width: 640px) {
    flex-direction: row;
    align-items: center;
    gap: 16px;
  }
`;

const BarContainer = styled.div`
  position: relative;
  width: 100%;

  @media (min-width: 640px) {
    width: 500px;
  }
`;

const BarBackground = styled.div`
  position: relative;
  width: 100%;
  height: 20px;
  border-radius: 20px;
  background: rgba(183, 232, 214, 0.9);
  overflow: hidden;
`;

const BarFill = styled.div<{ $width: number }>`
  height: 20px;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  background: linear-gradient(
    90deg,
    rgba(23, 97, 163, 1) 0%,
    rgba(77, 175, 131, 1) 100%
  );
  width: ${(props) => props.$width}%;
`;

const Marker = styled.div<{ $position: number }>`
  position: absolute;
  top: 0;
  height: 20px;
  width: 4px;
  border-radius: 2px;
  background: rgba(15, 74, 122, 1);
  left: ${(props) => props.$position}%;
  transform: translateX(-50%);
`;

const ValueLabel = styled.div`
  position: absolute;
  top: -29px;
  right: 0;
  color: rgba(0, 0, 0, 1);
  font-family: Poppins, sans-serif;
  font-size: 12px;
  font-weight: 600;
  line-height: normal;
  white-space: nowrap;

  @media (min-width: 640px) {
    font-size: 14px;
  }
`;

const AxisLabels = styled.div`
  position: absolute;
  top: 29px;
  left: 0;
  width: 100%;
`;

const AxisLabelsRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const AxisLabel = styled.span<{ $offset?: number }>`
  color: rgba(94, 94, 94, 1);
  font-family: Poppins, sans-serif;
  font-size: 10px;
  font-weight: 500;
  line-height: normal;
  margin-left: ${(props) => (props.$offset ? `${props.$offset * -4}px` : '0')};

  @media (min-width: 640px) {
    font-size: 12px;
  }
`;

const PercentageText = styled.div`
  color: rgba(115, 115, 115, 1);
  font-family: Poppins, sans-serif;
  font-size: 9px;
  font-weight: 600;
  line-height: normal;
  white-space: nowrap;

  @media (min-width: 640px) {
    margin-left: 27px;
    font-size: 10px;
  }
`;

export interface BulletItem {
  name: string;
  achieved: number;
  target: number;
  marker: number;
}

export interface BulletData {
  title: string;
  bullets: BulletItem[];
}

export interface BulletChartData {
  data: BulletData;
}

export interface BulletChartProps {
  title: string;
  bullets: BulletItem[];
}

export const BulletChart: React.FC<BulletChartProps> = ({ title, bullets }) => {
  return (
    <Container>
      <Title>{title}</Title>

      <BulletsContainer>
        {bullets.map((b) => {
          const percentageAchieved = Math.round((b.achieved / b.target) * 100);
          const achievedWidth = Math.min((b.achieved / b.target) * 100, 100);
          const markerPosition = Math.min((b.marker / b.target) * 100, 100);

          return (
            <BulletItem key={b.name}>
              <BulletName>{b.name}</BulletName>

              <BulletContent>
                <BarContainer>
                  <BarBackground>
                    <BarFill $width={achievedWidth} />
                    <Marker $position={markerPosition} />
                  </BarBackground>

                  <ValueLabel>
                    ${b.achieved.toLocaleString()}/${b.target.toLocaleString()}
                  </ValueLabel>

                  <AxisLabels>
                    <AxisLabelsRow>
                      <AxisLabel>0</AxisLabel>
                      <AxisLabel $offset={1}>2k</AxisLabel>
                      <AxisLabel $offset={1}>4k</AxisLabel>
                      <AxisLabel $offset={1}>6k</AxisLabel>
                      <AxisLabel $offset={1}>8k</AxisLabel>
                      <AxisLabel $offset={2}>10k</AxisLabel>
                    </AxisLabelsRow>
                  </AxisLabels>
                </BarContainer>

                <PercentageText>
                  {percentageAchieved}% of target achieved
                </PercentageText>
              </BulletContent>
            </BulletItem>
          );
        })}
      </BulletsContainer>
    </Container>
  );
};

BulletChart.displayName = "BulletChart";