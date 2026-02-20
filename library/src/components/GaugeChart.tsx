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
  font-size: 18px;
  font-weight: 600;
  line-height: normal;
  margin-bottom: 24px;
`;

const GaugesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

const GaugeItem = styled.div`
  width: 100%;
`;

const GaugeContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (min-width: 1024px) {
    flex-direction: row;
    gap: 32px;
  }
`;

const GaugeVisualContainer = styled.div`
  position: relative;
  width: 100%;
  height: 220px;
  flex-shrink: 0;

  @media (min-width: 1024px) {
    width: 340px;
  }
`;

const GaugeSVG = styled.svg`
  width: 100%;
  height: 100%;
`;

const GaugeText = styled.text<{ $fontSize?: number; $fontWeight?: string; $fill?: string }>`
  font-family: Poppins, sans-serif;
  font-size: ${(props) => props.$fontSize || 14}px;
  font-weight: ${(props) => props.$fontWeight || "500"};
  fill: ${(props) => props.$fill || "rgba(94, 94, 94, 1)"};
`;

const GaugePath = styled.path<{ $dasharray?: string }>`
  transition: all 0.7s ease-in-out;
  stroke-dasharray: ${(props) => props.$dasharray || "none"};
`;

const NeedleGroup = styled.g<{ $angle: number }>`
  transition: all 0.7s ease-in-out;
  transform: rotate(${(props) => props.$angle}deg);
  transform-origin: 0 0;
`;

const CompletionText = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
  color: rgba(100, 100, 100, 1);
  font-family: Poppins, sans-serif;
  font-size: 11px;
  font-weight: 400;
`;

const StatsContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const StatsRow = styled.div<{ $marginBottom?: string }>`
  display: flex;
  gap: 144px;
  margin-bottom: ${(props) => props.$marginBottom || "0"};
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const StatLabel = styled.div`
  color: rgba(109, 109, 109, 1);
  font-family: Poppins, sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: normal;
  margin-bottom: 6px;
`;

const StatValue = styled.div`
  color: rgba(0, 0, 0, 1);
  font-family: Poppins, sans-serif;
  font-size: 16px;
  font-weight: 600;
  line-height: normal;
`;

const Separator = styled.div`
  margin-top: 40px;
  height: 1px;
  background: rgba(220, 220, 220, 1);
`;

export interface GaugeItem {
  name: string;
  value: number;
  max: number;
}

export interface GaugeData {
  title: string;
  gauges: GaugeItem[];
  [year: string]: any; // Allow year-month indexing
}

export interface GaugeChartData {
  data: GaugeData;
}

export interface GaugeChartProps {
  title: string;
  gauges: GaugeItem[];
  testId?:string;
}

export const GaugeChart: React.FC<GaugeChartProps> = ({ title, gauges,testId}) => {
  return (
    <Container data-testid={testId}>
      <Title>{title}</Title>

      <GaugesContainer>
        {gauges.map((gauge, index) => {
          const percentage = Math.min((gauge.value / gauge.max) * 100, 100);
          const angle = (percentage / 100) * 180 - 90;
          const remaining = gauge.max - gauge.value;
          const dailyAvg = Math.round(gauge.value / 30);

          return (
            <GaugeItem key={index}>
              <GaugeContent>
                <GaugeVisualContainer>
                  <GaugeSVG viewBox="0 0 340 220">
                    <defs>
                      <linearGradient
                        id={`gaugeGradient${index}`}
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop offset="0%" stopColor="rgba(23, 97, 163, 1)" />
                        <stop offset="100%" stopColor="rgba(77, 175, 131, 1)" />
                      </linearGradient>
                    </defs>

                    {/* Background arc */}
                    <path
                      d="M 40 170 A 130 130 0 0 1 300 170"
                      fill="none"
                      stroke="rgba(230, 230, 230, 1)"
                      strokeWidth="16"
                      strokeLinecap="round"
                    />

                    {/* Progress arc */}
                    <GaugePath
                      d="M 40 170 A 130 130 0 0 1 300 170"
                      fill="none"
                      stroke={`url(#gaugeGradient${index})`}
                      strokeWidth="16"
                      strokeLinecap="round"
                      $dasharray={`${(percentage / 100) * 408.4} 408.4`}
                    />

                    {/* Scale labels */}
                    <GaugeText x="36" y="198">0</GaugeText>
                    <GaugeText x="42" y="75">25</GaugeText>
                    <GaugeText x="162" y="25">50</GaugeText>
                    <GaugeText x="282" y="75">75</GaugeText>
                    <GaugeText x="290" y="198">100</GaugeText>

                    {/* Center gradient background */}
                    <g transform="translate(90, 100)">
                      <defs>
                        <linearGradient
                          id={`centerGradient${index}`}
                          x1="80"
                          y1="0"
                          x2="80"
                          y2="160"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop offset="0%" stopColor="rgba(23, 97, 163, 1)" stopOpacity="0.1" />
                          <stop offset="100%" stopColor="rgba(77, 175, 131, 1)" stopOpacity="0.1" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M160 80C160 58.7827 151.571 38.4344 136.569 23.4315C121.566 8.42855 101.217 1.60186e-06 80 0C58.7827 -1.60186e-06 38.4344 8.42854 23.4315 23.4315C8.42855 38.4344 3.20373e-06 58.7827 0 80L80 80H160Z"
                        fill={`url(#centerGradient${index})`}
                      />
                    </g>

                    {/* Score label */}
                    <GaugeText
                      x="170"
                      y="125"
                      textAnchor="middle"
                      $fontSize={12}
                      $fontWeight="400"
                      $fill="rgba(120, 120, 120, 1)"
                    >
                      score
                    </GaugeText>

                    {/* Percentage value */}
                    <GaugeText
                      x="175"
                      y="165"
                      textAnchor="middle"
                      $fontSize={42}
                      $fontWeight="700"
                      $fill="rgba(0, 0, 0, 1)"
                    >
                      {Math.round(percentage)}%
                    </GaugeText>

                    {/* Needle */}
                    <g transform="translate(170, 170)">
                      <NeedleGroup $angle={angle}>
                        <path
                          d="M 0 -115 L -3.4 -80 L 3.4 -80 Z"
                          fill="rgba(76, 76, 76, 1)"
                        />
                      </NeedleGroup>
                    </g>
                  </GaugeSVG>

                  <CompletionText>
                    You've completed {Math.round(percentage)}% of the total target
                  </CompletionText>
                </GaugeVisualContainer>

                <StatsContainer>
                  <StatsRow $marginBottom="98px">
                    <StatItem>
                      <StatLabel>Target</StatLabel>
                      <StatValue>{gauge.max.toLocaleString()}</StatValue>
                    </StatItem>

                    <StatItem>
                      <StatLabel>Achieved</StatLabel>
                      <StatValue>{gauge.value.toLocaleString()}</StatValue>
                    </StatItem>
                  </StatsRow>

                  <StatsRow>
                    <StatItem>
                      <StatLabel>Remaining</StatLabel>
                      <StatValue>{remaining.toLocaleString()}</StatValue>
                    </StatItem>

                    <StatItem>
                      <StatLabel>Daily Avg Needed</StatLabel>
                      <StatValue>{dailyAvg.toLocaleString()} / day</StatValue>
                    </StatItem>
                  </StatsRow>
                </StatsContainer>
              </GaugeContent>

              {index < gauges.length - 1 && <Separator />}
            </GaugeItem>
          );
        })}
      </GaugesContainer>
    </Container>
  );
};

GaugeChart.displayName = "GaugeChart";