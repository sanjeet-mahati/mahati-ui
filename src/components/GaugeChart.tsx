"use client";
import React from "react";

/* ============================================================================
   GAUGE CHART - ORIGINAL (PRODUCTION CODE)
   ⚠️  DO NOT MODIFY THIS SECTION - PRODUCTION CODE IN USE
   ============================================================================ */

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
  testId?: string;
}

export const GaugeChart: React.FC<GaugeChartProps> = ({ title, gauges, testId }) => {
  return (
    <div className="w-full h-full flex flex-col" data-testid={testId}>
      {/* Title */}
      <div
        className="mb-6"
        style={{
          color: "rgba(23,97,163,1)",
          fontFamily: "Poppins, sans-serif",
          fontSize: "18px",
          fontWeight: 600,
        }}
      >
        {title}
      </div>

      <div className="flex flex-col gap-10">
        {gauges.map((gauge, index) => {
          const percentage = Math.min((gauge.value / gauge.max) * 100, 100);
          const angle = (percentage / 100) * 180 - 90;
          const remaining = gauge.max - gauge.value;
          const dailyAvg = Math.round(gauge.value / 30);

          return (
            <div key={index} className="w-full">
              <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
                {/* Gauge Visual */}
                <div
                  className="relative w-full flex-shrink-0 lg:w-[340px]"
                  style={{ height: "220px" }}
                >
                  <svg className="w-full h-full" viewBox="0 0 340 220">
                    <defs>
                      <linearGradient id={`gaugeGradient${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="rgba(23,97,163,1)" />
                        <stop offset="100%" stopColor="rgba(77,175,131,1)" />
                      </linearGradient>
                    </defs>

                    {/* Background arc */}
                    <path
                      d="M 40 170 A 130 130 0 0 1 300 170"
                      fill="none"
                      stroke="rgba(230,230,230,1)"
                      strokeWidth="16"
                      strokeLinecap="round"
                    />

                    {/* Progress arc */}
                    <path
                      d="M 40 170 A 130 130 0 0 1 300 170"
                      fill="none"
                      stroke={`url(#gaugeGradient${index})`}
                      strokeWidth="16"
                      strokeLinecap="round"
                      style={{ transition: "all 0.7s ease-in-out" }}
                      strokeDasharray={`${(percentage / 100) * 408.4} 408.4`}
                    />

                    {/* Scale labels */}
                    {[
                      { x: 36, y: 198, t: "0" },
                      { x: 42, y: 75, t: "25" },
                      { x: 162, y: 25, t: "50" },
                      { x: 282, y: 75, t: "75" },
                      { x: 290, y: 198, t: "100" },
                    ].map(({ x, y, t }) => (
                      <text
                        key={t}
                        x={x}
                        y={y}
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontSize: "14px",
                          fontWeight: 500,
                          fill: "rgba(94,94,94,1)",
                        }}
                      >
                        {t}
                      </text>
                    ))}

                    {/* Center gradient background */}
                    <g transform="translate(90, 100)">
                      <defs>
                        <linearGradient
                          id={`centerGradient${index}`}
                          x1="80" y1="0" x2="80" y2="160"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop offset="0%" stopColor="rgba(23,97,163,1)" stopOpacity="0.1" />
                          <stop offset="100%" stopColor="rgba(77,175,131,1)" stopOpacity="0.1" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M160 80C160 58.7827 151.571 38.4344 136.569 23.4315C121.566 8.42855 101.217 1.60186e-06 80 0C58.7827 -1.60186e-06 38.4344 8.42854 23.4315 23.4315C8.42855 38.4344 3.20373e-06 58.7827 0 80L80 80H160Z"
                        fill={`url(#centerGradient${index})`}
                      />
                    </g>

                    <text
                      x="170" y="125" textAnchor="middle"
                      style={{ fontFamily: "Poppins, sans-serif", fontSize: "12px", fontWeight: 400, fill: "rgba(120,120,120,1)" }}
                    >
                      score
                    </text>
                    <text
                      x="175" y="165" textAnchor="middle"
                      style={{ fontFamily: "Poppins, sans-serif", fontSize: "42px", fontWeight: 700, fill: "rgba(0,0,0,1)" }}
                    >
                      {Math.round(percentage)}%
                    </text>

                    {/* Needle */}
                    <g transform="translate(170, 170)">
                      <g
                        style={{
                          transition: "all 0.7s ease-in-out",
                          transform: `rotate(${angle}deg)`,
                          transformOrigin: "0 0",
                        }}
                      >
                        <path d="M 0 -115 L -3.4 -80 L 3.4 -80 Z" fill="rgba(76,76,76,1)" />
                      </g>
                    </g>
                  </svg>

                  <div
                    className="absolute bottom-0 left-0 right-0 text-center"
                    style={{
                      color: "rgba(100,100,100,1)",
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "11px",
                      fontWeight: 400,
                    }}
                  >
                    You've completed {Math.round(percentage)}% of the total target
                  </div>
                </div>

                {/* Stats */}
                <div className="flex-1 flex flex-col justify-start">
                  <div className="flex gap-36 mb-[98px]">
                    {[
                      { label: "Target", value: gauge.max.toLocaleString() },
                      { label: "Achieved", value: gauge.value.toLocaleString() },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex flex-col">
                        <span style={{ color: "rgba(109,109,109,1)", fontFamily: "Poppins, sans-serif", fontSize: "12px", fontWeight: 500, marginBottom: "6px" }}>
                          {label}
                        </span>
                        <span style={{ color: "rgba(0,0,0,1)", fontFamily: "Poppins, sans-serif", fontSize: "16px", fontWeight: 600 }}>
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-36">
                    {[
                      { label: "Remaining", value: remaining.toLocaleString() },
                      { label: "Daily Avg Needed", value: `${dailyAvg.toLocaleString()} / day` },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex flex-col">
                        <span style={{ color: "rgba(109,109,109,1)", fontFamily: "Poppins, sans-serif", fontSize: "12px", fontWeight: 500, marginBottom: "6px" }}>
                          {label}
                        </span>
                        <span style={{ color: "rgba(0,0,0,1)", fontFamily: "Poppins, sans-serif", fontSize: "16px", fontWeight: 600 }}>
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {index < gauges.length - 1 && (
                <div className="mt-10 h-px" style={{ background: "rgba(220,220,220,1)" }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

GaugeChart.displayName = "GaugeChart";


/* ============================================================================
   RISK GAUGE CHART - NEW COMPONENT
   ✨ NEW FEATURE - Risk Assessment Gauge with Color-Coded Bands
   ============================================================================ */

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

const DEFAULT_RISK_BANDS: RiskBand[] = [
  { label: "Critical Risk", color: "#DC2626", rangeStart: 0, rangeEnd: 20 },
  { label: "High Risk", color: "#F97316", rangeStart: 20, rangeEnd: 40 },
  { label: "Stable", color: "#FBBF24", rangeStart: 40, rangeEnd: 60 },
  { label: "Strong", color: "#4ADE80", rangeStart: 60, rangeEnd: 80 },
  { label: "Top Performer", color: "#059669", rangeStart: 80, rangeEnd: 100 },
];

const createRiskArcPath = (
  centerX: number,
  centerY: number,
  radius: number,
  startAngle: number,
  endAngle: number
): string => {
  const startRad = ((startAngle - 180) * Math.PI) / 180;
  const endRad = ((endAngle - 180) * Math.PI) / 180;
  const x1 = centerX + radius * Math.cos(startRad);
  const y1 = centerY + radius * Math.sin(startRad);
  const x2 = centerX + radius * Math.cos(endRad);
  const y2 = centerY + radius * Math.sin(endRad);
  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`;
};

const getRiskLevel = (score: number, bands: RiskBand[]): string => {
  for (const band of bands) {
    if (score >= band.rangeStart && score <= band.rangeEnd) return band.label;
  }
  return bands[0].label;
};

export const RiskGaugeChart: React.FC<RiskGaugeChartProps> = ({ title, gauges }) => {
  return (
    <div className="w-full h-full flex flex-col">
      <div
        className="mb-6"
        style={{ color: "rgba(23,97,163,1)", fontFamily: "Poppins, sans-serif", fontSize: "18px", fontWeight: 600 }}
      >
        {title}
      </div>

      <div className="flex flex-col gap-10">
        {gauges.map((gauge, index) => {
          const bands = gauge.bands || DEFAULT_RISK_BANDS;
          const maxScore = gauge.max || 100;
          const percentage = Math.min((gauge.score / maxScore) * 100, 100);
          const angle = (percentage / 100) * 180 - 90;
          const currentLevel = getRiskLevel(percentage, bands);
          const remaining = maxScore - gauge.score;
          const dailyAvg = Math.round(gauge.score / 30);

          return (
            <div key={index} className="w-full">
              <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
                {/* Gauge Visual */}
                <div className="relative w-full flex-shrink-0 lg:w-[340px]" style={{ height: "220px" }}>
                  <svg className="w-full h-full" viewBox="0 0 340 220">
                    {/* Risk band arcs */}
                    {bands.map((band, bandIndex) => {
                      const startAngle = (band.rangeStart / 100) * 180;
                      const endAngle = (band.rangeEnd / 100) * 180;
                      const arcPath = createRiskArcPath(170, 170, 130, startAngle, endAngle);
                      return (
                        <path
                          key={bandIndex}
                          d={arcPath}
                          fill="none"
                          stroke={band.color}
                          strokeWidth="16"
                          strokeLinecap="butt"
                          style={{ transition: "all 0.7s ease-in-out" }}
                        />
                      );
                    })}

                    {/* Scale labels */}
                    {[
                      { x: 36, y: 198, t: "0" },
                      { x: 42, y: 75, t: "25" },
                      { x: 162, y: 25, t: "50" },
                      { x: 282, y: 75, t: "75" },
                      { x: 290, y: 198, t: "100" },
                    ].map(({ x, y, t }) => (
                      <text
                        key={t}
                        x={x} y={y}
                        style={{ fontFamily: "Poppins, sans-serif", fontSize: "14px", fontWeight: 500, fill: "rgba(94,94,94,1)" }}
                      >
                        {t}
                      </text>
                    ))}

                    {/* Center background */}
                    <g transform="translate(90, 100)">
                      <defs>
                        <linearGradient
                          id={`riskCenterGradient${index}`}
                          x1="80" y1="0" x2="80" y2="160"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop offset="0%" stopColor="rgba(148,163,184,1)" stopOpacity="0.1" />
                          <stop offset="100%" stopColor="rgba(71,85,105,1)" stopOpacity="0.05" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M160 80C160 58.7827 151.571 38.4344 136.569 23.4315C121.566 8.42855 101.217 1.60186e-06 80 0C58.7827 -1.60186e-06 38.4344 8.42854 23.4315 23.4315C8.42855 38.4344 3.20373e-06 58.7827 0 80L80 80H160Z"
                        fill={`url(#riskCenterGradient${index})`}
                      />
                    </g>

                    <text x="170" y="125" textAnchor="middle"
                      style={{ fontFamily: "Poppins, sans-serif", fontSize: "12px", fontWeight: 400, fill: "rgba(120,120,120,1)" }}
                    >
                      score
                    </text>
                    <text x="175" y="165" textAnchor="middle"
                      style={{ fontFamily: "Poppins, sans-serif", fontSize: "42px", fontWeight: 700, fill: "rgba(0,0,0,1)" }}
                    >
                      {Math.round(percentage)}%
                    </text>

                    {/* Needle */}
                    <g transform="translate(170, 170)">
                      <g style={{ transition: "all 0.7s ease-in-out", transform: `rotate(${angle}deg)`, transformOrigin: "0 0" }}>
                        <path d="M 0 -115 L -3.4 -80 L 3.4 -80 Z" fill="rgba(76,76,76,1)" />
                      </g>
                    </g>
                  </svg>

                  <div
                    className="absolute bottom-0 left-0 right-0 text-center"
                    style={{ color: "rgba(100,100,100,1)", fontFamily: "Poppins, sans-serif", fontSize: "11px", fontWeight: 400 }}
                  >
                    Current Status: {currentLevel}
                  </div>
                </div>

                {/* Stats */}
                <div className="flex-1 flex flex-col justify-start">
                  <div className="flex gap-36 mb-[98px]">
                    {[
                      { label: "Maximum", value: maxScore.toLocaleString() },
                      { label: "Current Score", value: gauge.score.toLocaleString() },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex flex-col">
                        <span style={{ color: "rgba(109,109,109,1)", fontFamily: "Poppins, sans-serif", fontSize: "12px", fontWeight: 500, marginBottom: "6px" }}>{label}</span>
                        <span style={{ color: "rgba(0,0,0,1)", fontFamily: "Poppins, sans-serif", fontSize: "16px", fontWeight: 600 }}>{value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-36">
                    {[
                      { label: "Gap to Max", value: remaining.toLocaleString() },
                      { label: "Daily Average", value: `${dailyAvg.toLocaleString()} / day` },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex flex-col">
                        <span style={{ color: "rgba(109,109,109,1)", fontFamily: "Poppins, sans-serif", fontSize: "12px", fontWeight: 500, marginBottom: "6px" }}>{label}</span>
                        <span style={{ color: "rgba(0,0,0,1)", fontFamily: "Poppins, sans-serif", fontSize: "16px", fontWeight: 600 }}>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-[30px] mt-[30px] justify-center">
                {bands.map((band, bandIdx) => (
                  <div key={bandIdx} className="flex items-center gap-2">
                    <div
                      className="w-5 h-3 rounded-sm"
                      style={{ backgroundColor: band.color }}
                    />
                    <span
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "11px",
                        color: "rgba(75,85,99,1)",
                        fontWeight: 500,
                      }}
                    >
                      {band.label}
                    </span>
                  </div>
                ))}
              </div>

              {index < gauges.length - 1 && (
                <div className="mt-10 h-px" style={{ background: "rgba(220,220,220,1)" }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

RiskGaugeChart.displayName = "RiskGaugeChart";