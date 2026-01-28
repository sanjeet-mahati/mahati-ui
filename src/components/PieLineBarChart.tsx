"use client";
import React from "react";
import styled from "@emotion/styled";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Filler,
  ChartData,
  ChartOptions,
} from "chart.js";
import { Doughnut, Line, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Filler
);

/* ============================================================================
   STYLED COMPONENTS
   ============================================================================ */

const ChartContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

/* ============================================================================
   TYPES
   ============================================================================ */

export type PieLineBarChartType = "pie" | "doughnut" | "line" | "area" | "bar";

/* ============================================================================
   HELPER FUNCTIONS
   ============================================================================ */

export const makeAreaDataStraight = (data: ChartData<any>): ChartData<any> => {
  const datasets = Array.isArray(data.datasets) ? data.datasets : [];
  return {
    ...data,
    datasets: datasets.map((ds: any) => ({
      ...ds,
      tension: 0,
      cubicInterpolationMode: "default",
    })),
  };
};

/* ============================================================================
   PROPS INTERFACE
   ============================================================================ */

export interface PieLineBarChartProps {
  chartType: PieLineBarChartType;
  data: ChartData<any>;
  options?: ChartOptions<any>;
}

/* ============================================================================
   COMPONENT
   ============================================================================ */

export const PieLineBarChart: React.FC<PieLineBarChartProps> = ({ 
  chartType, 
  data, 
  options 
}) => {
  const defaultOptions: ChartOptions<any> = React.useMemo(() => {
    const isLineFamily = chartType === "line" || chartType === "area";

    if (isLineFamily) {
      return {
        responsive: true,
        maintainAspectRatio: false,
        elements: { line: { tension: 0 } },
        plugins: {
          legend: { display: false },
          tooltip: {
            mode: "index",
            intersect: false,
            backgroundColor: "rgba(255,255,255,0.95)",
            titleColor: "rgba(31,41,55,1)",
            bodyColor: "rgba(107,114,128,1)",
            borderColor: "rgba(229,231,235,1)",
            borderWidth: 1,
            padding: 12,
            displayColors: true,
          },
        },
        scales: {
          x: {
            grid: { display: true, color: "rgba(229,231,235,1)", drawBorder: false },
            ticks: { color: "rgba(107,114,128,1)", font: { size: 11 } },
          },
          y: {
            grid: { display: true, color: "rgba(229,231,235,1)", drawBorder: false },
            ticks: { color: "rgba(107,114,128,1)", font: { size: 11 } },
            min: 40,
            max: 90,
          },
        },
        interaction: { mode: "nearest", axis: "x", intersect: false },
      };
    }

    return {
      responsive: true,
      maintainAspectRatio: false,
      cutout: chartType === "pie" || chartType === "doughnut" ? "50%" : undefined,
      plugins: { legend: { display: false } },
    };
  }, [chartType]);

  const chartOptions = options || defaultOptions;

  const renderChart = () => {
    switch (chartType) {
      case "line":
      case "area":
        return <Line key={chartType} data={data} options={chartOptions} />;
      case "bar":
        return <Bar key={chartType} data={data} options={chartOptions} />;
      case "pie":
      case "doughnut":
        return <Doughnut key={chartType} data={data} options={chartOptions} />;
      default:
        return null;
    }
  };

  return <ChartContainer>{renderChart()}</ChartContainer>;
};

PieLineBarChart.displayName = "PieLineBarChart";