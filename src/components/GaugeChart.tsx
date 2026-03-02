"use client";
import React from "react";
import styled from "@emotion/styled";

/* ============================================================================
   FILE OVERVIEW
   
   This file contains TWO gauge chart components:
   1. GaugeChart - Progress gauge (ORIGINAL - PRODUCTION CODE)
   2. RiskGaugeChart - Risk assessment gauge (NEW)
   
   Both are completely independent with separate interfaces and exports.
   ============================================================================ */

/* ============================================================================
   GAUGE CHART - ORIGINAL (PRODUCTION CODE)
   
   ⚠️  DO NOT MODIFY THIS SECTION - PRODUCTION CODE IN USE
   
   This is the original gauge chart used in production dashboards.
   For new gauge features, use RiskGaugeChart section below.
   ============================================================================ */

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
  [key: string]: any;
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


/* ============================================================================
   RISK GAUGE CHART - NEW COMPONENT
   
   ✨ NEW FEATURE - Risk Assessment Gauge with Color-Coded Bands
   
   Created: 2025
   Purpose: Display risk/health metrics with segmented colored arcs
   Related to: GaugeChart (shares file but completely independent logic)
   ============================================================================ */

// NEW styled components for RiskGaugeChart
const RiskContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const RiskTitle = styled.div`
  color: rgba(23, 97, 163, 1);
  font-family: Poppins, sans-serif;
  font-size: 18px;
  font-weight: 600;
  line-height: normal;
  margin-bottom: 24px;
`;

const RiskGaugesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

const RiskGaugeItem = styled.div`
  width: 100%;
`;

const RiskGaugeContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (min-width: 1024px) {
    flex-direction: row;
    gap: 32px;
  }
`;

const RiskGaugeVisualContainer = styled.div`
  position: relative;
  width: 100%;
  height: 220px;
  flex-shrink: 0;

  @media (min-width: 1024px) {
    width: 340px;
  }
`;

const RiskGaugeSVG = styled.svg`
  width: 100%;
  height: 100%;
`;

const RiskGaugeText = styled.text<{ $fontSize?: number; $fontWeight?: string; $fill?: string }>`
  font-family: Poppins, sans-serif;
  font-size: ${(props) => props.$fontSize || 14}px;
  font-weight: ${(props) => props.$fontWeight || "500"};
  fill: ${(props) => props.$fill || "rgba(94, 94, 94, 1)"};
`;

const RiskBandPath = styled.path`
  transition: all 0.7s ease-in-out;
`;

const RiskNeedleGroup = styled.g<{ $angle: number }>`
  transition: all 0.7s ease-in-out;
  transform: rotate(${(props) => props.$angle}deg);
  transform-origin: 0 0;
`;

const RiskStatusText = styled.div`
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

const RiskStatsContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const RiskStatsRow = styled.div<{ $marginBottom?: string }>`
  display: flex;
  gap: 144px;
  margin-bottom: ${(props) => props.$marginBottom || "0"};
`;

const RiskStatItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const RiskStatLabel = styled.div`
  color: rgba(109, 109, 109, 1);
  font-family: Poppins, sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: normal;
  margin-bottom: 6px;
`;

const RiskStatValue = styled.div`
  color: rgba(0, 0, 0, 1);
  font-family: Poppins, sans-serif;
  font-size: 16px;
  font-weight: 600;
  line-height: normal;
`;

const RiskSeparator = styled.div`
  margin-top: 40px;
  height: 1px;
  background: rgba(220, 220, 220, 1);
`;

const RiskLegendContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  margin-top: 30px;
  justify-content: center;
`;

const RiskLegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const RiskLegendColor = styled.div<{ $color: string }>`
  width: 20px;
  height: 12px;
  border-radius: 2px;
  background-color: ${props => props.$color};
`;

const RiskLegendLabel = styled.span`
  font-family: Poppins, sans-serif;
  font-size: 11px;
  color: rgba(75, 85, 99, 1);
  font-weight: 500;
`;

// NEW interfaces for RiskGaugeChart
export interface RiskBand {
  label: string;
  color: string;
  rangeStart: number;
  rangeEnd: number;
}

export interface RiskGaugeItem {
  name: string;
  score: number;
  max?: number;
  bands?: RiskBand[];
}

export interface RiskGaugeData {
  title: string;
  gauges: RiskGaugeItem[];
  [key: string]: any;
}

export interface RiskGaugeChartData {
  data: RiskGaugeData;
}

export interface RiskGaugeChartProps {
  title: string;
  gauges: RiskGaugeItem[];
}

// Default risk bands configuration
const DEFAULT_RISK_BANDS: RiskBand[] = [
  { label: "Critical Risk", color: "#DC2626", rangeStart: 0, rangeEnd: 20 },
  { label: "High Risk", color: "#F97316", rangeStart: 20, rangeEnd: 40 },
  { label: "Stable", color: "#FBBF24", rangeStart: 40, rangeEnd: 60 },
  { label: "Strong", color: "#4ADE80", rangeStart: 60, rangeEnd: 80 },
  { label: "Top Performer", color: "#059669", rangeStart: 80, rangeEnd: 100 }
];

// Helper function to create arc path for risk bands
const createRiskArcPath = (
  centerX: number,
  centerY: number,
  radius: number,
  startAngle: number,
  endAngle: number
): string => {
  // Convert angles to radians
  // Subtract 180 to start from left side (0 degrees = -90 in our coordinate system)
  const startRad = ((startAngle - 180) * Math.PI) / 180;
  const endRad = ((endAngle - 180) * Math.PI) / 180;
  
  const x1 = centerX + radius * Math.cos(startRad);
  const y1 = centerY + radius * Math.sin(startRad);
  const x2 = centerX + radius * Math.cos(endRad);
  const y2 = centerY + radius * Math.sin(endRad);
  
  const largeArcFlag = (endAngle - startAngle) > 180 ? 1 : 0;
  
  return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`;
};

// Helper function to determine current risk level
const getRiskLevel = (score: number, bands: RiskBand[]): string => {
  for (const band of bands) {
    if (score >= band.rangeStart && score <= band.rangeEnd) {
      return band.label;
    }
  }
  return bands[0].label;
};

export const RiskGaugeChart: React.FC<RiskGaugeChartProps> = ({ title, gauges }) => {
  return (
    <RiskContainer>
      <RiskTitle>{title}</RiskTitle>

      <RiskGaugesContainer>
        {gauges.map((gauge, index) => {
          const bands = gauge.bands || DEFAULT_RISK_BANDS;
          const maxScore = gauge.max || 100;
          const percentage = Math.min((gauge.score / maxScore) * 100, 100);
          const angle = (percentage / 100) * 180 - 90;
          const currentLevel = getRiskLevel(percentage, bands);
          
          // Calculate stats
          const remaining = maxScore - gauge.score;
          const dailyAvg = Math.round(gauge.score / 30);

          return (
            <RiskGaugeItem key={index}>
              <RiskGaugeContent>
                <RiskGaugeVisualContainer>
                  <RiskGaugeSVG viewBox="0 0 340 220">
                    {/* Render risk band arcs */}
                    {bands.map((band, bandIndex) => {
  // Calculate angles for semi-circle (0% = 0°, 100% = 180°)
  const startAngle = (band.rangeStart / 100) * 180;
  const endAngle = (band.rangeEnd / 100) * 180;
  const arcPath = createRiskArcPath(170, 170, 130, startAngle, endAngle);
                      
                      return (
                        <RiskBandPath
                          key={bandIndex}
                          d={arcPath}
                          fill="none"
                          stroke={band.color}
                          strokeWidth="16"
                          strokeLinecap="butt"
                        />
                      );
                    })}

                    {/* Scale labels */}
                    <RiskGaugeText x="36" y="198">0</RiskGaugeText>
                    <RiskGaugeText x="42" y="75">25</RiskGaugeText>
                    <RiskGaugeText x="162" y="25">50</RiskGaugeText>
                    <RiskGaugeText x="282" y="75">75</RiskGaugeText>
                    <RiskGaugeText x="290" y="198">100</RiskGaugeText>

                    {/* Center background */}
                    <g transform="translate(90, 100)">
                      <defs>
                        <linearGradient
                          id={`riskCenterGradient${index}`}
                          x1="80"
                          y1="0"
                          x2="80"
                          y2="160"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop offset="0%" stopColor="rgba(148, 163, 184, 1)" stopOpacity="0.1" />
                          <stop offset="100%" stopColor="rgba(71, 85, 105, 1)" stopOpacity="0.05" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M160 80C160 58.7827 151.571 38.4344 136.569 23.4315C121.566 8.42855 101.217 1.60186e-06 80 0C58.7827 -1.60186e-06 38.4344 8.42854 23.4315 23.4315C8.42855 38.4344 3.20373e-06 58.7827 0 80L80 80H160Z"
                        fill={`url(#riskCenterGradient${index})`}
                      />
                    </g>

                    {/* Score label */}
                    <RiskGaugeText
                      x="170"
                      y="125"
                      textAnchor="middle"
                      $fontSize={12}
                      $fontWeight="400"
                      $fill="rgba(120, 120, 120, 1)"
                    >
                      score
                    </RiskGaugeText>

                    {/* Percentage value */}
                    <RiskGaugeText
                      x="175"
                      y="165"
                      textAnchor="middle"
                      $fontSize={42}
                      $fontWeight="700"
                      $fill="rgba(0, 0, 0, 1)"
                    >
                      {Math.round(percentage)}%
                    </RiskGaugeText>

                    {/* Needle */}
                    <g transform="translate(170, 170)">
                      <RiskNeedleGroup $angle={angle}>
                        <path
                          d="M 0 -115 L -3.4 -80 L 3.4 -80 Z"
                          fill="rgba(76, 76, 76, 1)"
                        />
                      </RiskNeedleGroup>
                    </g>
                  </RiskGaugeSVG>

                  <RiskStatusText>
                    Current Status: {currentLevel}
                  </RiskStatusText>
                </RiskGaugeVisualContainer>

                <RiskStatsContainer>
                  <RiskStatsRow $marginBottom="98px">
                    <RiskStatItem>
                      <RiskStatLabel>Maximum</RiskStatLabel>
                      <RiskStatValue>{maxScore.toLocaleString()}</RiskStatValue>
                    </RiskStatItem>

                    <RiskStatItem>
                      <RiskStatLabel>Current Score</RiskStatLabel>
                      <RiskStatValue>{gauge.score.toLocaleString()}</RiskStatValue>
                    </RiskStatItem>
                  </RiskStatsRow>

                  <RiskStatsRow>
                    <RiskStatItem>
                      <RiskStatLabel>Gap to Max</RiskStatLabel>
                      <RiskStatValue>{remaining.toLocaleString()}</RiskStatValue>
                    </RiskStatItem>

                    <RiskStatItem>
                      <RiskStatLabel>Daily Average</RiskStatLabel>
                      <RiskStatValue>{dailyAvg.toLocaleString()} / day</RiskStatValue>
                    </RiskStatItem>
                  </RiskStatsRow>
                </RiskStatsContainer>
              </RiskGaugeContent>

              {/* Legend */}
              <RiskLegendContainer>
                {bands.map((band, bandIdx) => (
                  <RiskLegendItem key={bandIdx}>
                    <RiskLegendColor $color={band.color} />
                    <RiskLegendLabel>{band.label}</RiskLegendLabel>
                  </RiskLegendItem>
                ))}
              </RiskLegendContainer>

              {index < gauges.length - 1 && <RiskSeparator />}
            </RiskGaugeItem>
          );
        })}
      </RiskGaugesContainer>
    </RiskContainer>
  );
};

RiskGaugeChart.displayName = "RiskGaugeChart";