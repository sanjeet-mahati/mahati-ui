"use client";
import React, { useMemo, useState, useEffect } from "react";
import styled from "@emotion/styled";
import { ChartData } from "chart.js";
import { MahatiChartAnalyticsWidget } from "@/lib";
import chartDataJson from "./sample-chart-data.json";

const DemoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  overflow-x: hidden;
  max-width: 100%;
`;

const UploadCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(229, 231, 235, 1);
  padding: 16px;
`;

const UploadTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  line-height: 1.75rem;
  color: rgba(17, 24, 39, 1);
`;

const FileInput = styled.input`
  display: block;
  width: 100%;
  font-size: 14px;
  color: rgba(107, 114, 128, 1);
  
  &::file-selector-button {
    margin-right: 16px;
    padding: 8px 16px;
    border-radius: 9999px;
    border: 0;
    font-size: 14px;
    font-weight: 600;
    background-color: rgba(239, 246, 255, 1);
    color: rgba(29, 78, 216, 1);
    cursor: pointer;
    transition: background-color 0.2s;
  }

  &:hover::file-selector-button {
    background-color: rgba(219, 234, 254, 1);
  }
`;

const UploadHint = styled.p`
  margin-top: 8px;
  font-size: 14px;
  color: rgba(107, 114, 128, 1);
  line-height: 1.25rem;
`;

// ========================================
// TYPE DEFINITIONS
// ========================================

interface DetailItem {
  label: string;
  value: string;
  color: string;
  description: string;
  status?: "In Progress" | "Overdue" | "On Target";
}

const GANTT_COLOR_MAP = {
  green: "rgba(44, 160, 44, 1)",
  blue: "rgba(37, 99, 235, 1)",
  orange: "rgba(255, 127, 14, 1)",
  red: "rgba(239, 68, 68, 1)",
  purple: "rgba(147, 51, 234, 1)",
  teal: "rgba(20, 184, 166, 1)",
  pink: "rgba(236, 72, 153, 1)",
  yellow: "rgba(234, 179, 8, 1)",
  indigo: "rgba(99, 102, 241, 1)",
  emerald: "rgba(16, 185, 129, 1)",
} as const;

type ChartType = "pie" | "doughnut" | "line" | "area" | "bar" | "bullet" | "gauge" | "gantt" | "calendarheatmap" | "horizontalbar";
type TaskStatus = "Overdue" | "In Progress" | "On Target";

// ========================================
// HELPER FUNCTIONS
// ========================================

/**
 * Creates gradient for area charts
 */
const createAreaGradient = (color: string, opacityStart: number = 0.3, opacityEnd: number = 0) => {
  return (context: any) => {
    const ctx = context.chart.ctx;
    const chartArea = context.chart.chartArea;
    if (!chartArea) return color;

    const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);

    let r = 0, g = 0, b = 0;
    if (color.startsWith("#") && color.length === 7) {
      r = parseInt(color.slice(1, 3), 16);
      g = parseInt(color.slice(3, 5), 16);
      b = parseInt(color.slice(5, 7), 16);
    }

    gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${opacityStart})`);
    gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${opacityStart * 0.5})`);
    gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, ${opacityEnd})`);
    return gradient;
  };
};

/**
 * Process area chart data to add gradients
 */
const processAreaData = (data: any): ChartData<"line"> => {
  return {
    ...data,
    datasets: data.datasets.map((dataset: any) => {
      if (dataset.backgroundColor && typeof dataset.backgroundColor === 'object' && dataset.backgroundColor.gradient) {
        const { color, opacityStart, opacityEnd } = dataset.backgroundColor.gradient;
        return {
          ...dataset,
          backgroundColor: createAreaGradient(color, opacityStart, opacityEnd),
        };
      }
      return dataset;
    }),
  };
};

// ========================================
// MAIN COMPONENT
// ========================================

export default function MahatiChart() {

  const [chartData, setChartData] = useState(chartDataJson);
  const [currentChartType, setCurrentChartType] = useState<ChartType>("pie");

  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({
    Relationship: "Partner",
    DebtCollector: "Collector B",
    CollectionAgency: "Agency B",
    Periodicity: "12 months",
  });

  const [bulletGaugeSelectedFilters, setBulletGaugeSelectedFilters] = useState<Record<string, string>>({
    SelectYear: "2026",
    SelectMonth: "January",
    SelectType: "Sales",
  });

  const [ganttSelectedFilters, setGanttSelectedFilters] = useState<Record<string, string>>({
    SelectYear: "2026",
    SelectMonth: "Jan - Feb",
    SelectType: "Development",
  });

  const [horizontalBarSelectedFilters, setHorizontalBarSelectedFilters] = useState<Record<string, string>>({
    SelectYear: "2026",
    SelectMonth: "January",
    SelectType: "Product 1",
  });

  const [calendarHeatmapSelectedFilters, setCalendarHeatmapSelectedFilters] = useState<Record<string, string>>({
    SelectYear: "2026",
    SelectType: "Development",
  });

  const [currentStats, setCurrentStats] = useState(chartData.quickStats.pie);
  const [activeChartDataMap, setActiveChartDataMap] = useState<Record<ChartType, ChartData<any>>>({} as any);

  useEffect(() => {
    const initialDataMap: Record<ChartType, ChartData<any>> = {
      pie: chartData.chartData.pie as ChartData<"doughnut">,
      doughnut: chartData.chartData.doughnut as ChartData<"doughnut">,
      line: chartData.chartData.line as ChartData<"line">,
      area: processAreaData(chartData.chartData.area) as ChartData<"line">,
      bar: chartData.chartData.bar as ChartData<"bar">,
      
      bullet: { labels: [], datasets: [] } as ChartData<"bar">,
      gauge: { labels: [], datasets: [] } as ChartData<"bar">,
      gantt: { labels: [], datasets: [] } as ChartData<"bar">,
      calendarheatmap: { labels: [], datasets: [] } as ChartData<"bar">,
      horizontalbar: { labels: [], datasets: [] } as ChartData<"bar">,
    };

    setActiveChartDataMap(initialDataMap);
  }, [chartData]);

  const currentSelectedFilters = useMemo(() => {
    if (currentChartType === 'gantt') {
      return ganttSelectedFilters;
    }
    if (currentChartType === 'horizontalbar') {
      return horizontalBarSelectedFilters;
    }
    if (currentChartType === 'calendarheatmap') {
      return calendarHeatmapSelectedFilters;
    }
    if (currentChartType === 'bullet' || currentChartType === 'gauge') {
      return bulletGaugeSelectedFilters;
    }
    return selectedFilters;
  }, [currentChartType, selectedFilters, bulletGaugeSelectedFilters, ganttSelectedFilters, horizontalBarSelectedFilters, calendarHeatmapSelectedFilters]);

  const currentFilters = useMemo(() => {
    if (currentChartType === 'gantt') {
      return chartData.filters.gantt;
    }
    if (currentChartType === 'horizontalbar') {
      return chartData.filters.horizontalbar;
    }
    if (currentChartType === 'calendarheatmap') {
      return chartData.filters.calendarheatmap;
    }
    if (currentChartType === 'bullet' || currentChartType === 'gauge') {
      return chartData.filters.bulletGauge;
    }
    return chartData.filters.default;
  }, [currentChartType, chartData.filters]);

  const handleChartTypeChange = (chartType: ChartType) => {
    setCurrentChartType(chartType);
    setCurrentStats((chartData.quickStats as any)[chartType]);
  };

  const handleFiltersChange = (filters: Record<string, string>) => {
    if (currentChartType === 'gantt') {
      setGanttSelectedFilters(filters);
    } else if (currentChartType === 'horizontalbar') {
      setHorizontalBarSelectedFilters(filters);
    } else if (currentChartType === 'calendarheatmap') {
      setCalendarHeatmapSelectedFilters(filters);
    } else if (currentChartType === 'bullet' || currentChartType === 'gauge') {
      setBulletGaugeSelectedFilters(filters);
    } else {
      setSelectedFilters(filters);
    }
  };

  const handleApplyFilters = () => {
    if (currentChartType === 'gantt') {
      console.log('Applying gantt filters:', ganttSelectedFilters);
      
    } else if (currentChartType === 'horizontalbar') {
      console.log('Applying horizontalbar filters:', horizontalBarSelectedFilters);
      
    } else if (currentChartType === 'calendarheatmap') {
      console.log('Applying calendar heatmap filters:', calendarHeatmapSelectedFilters);
      
    } else {
      console.log('Applying filters:', selectedFilters);
    }
  };

  const currentDetails = useMemo((): DetailItem[] => {
    if (currentChartType === 'bullet') {
      const year = bulletGaugeSelectedFilters.SelectYear || '2026';
      const month = bulletGaugeSelectedFilters.SelectMonth || 'January';
      const type = bulletGaugeSelectedFilters.SelectType || 'Sales';
      const bulletMonthData = (chartData.bullet as any)[year]?.[type]?.[month];
      
      if (!bulletMonthData || !bulletMonthData.bullets) return [];

      return bulletMonthData.bullets.map((b: any) => {
        const percentageAchieved = Math.round((b.achieved / b.target) * 100);
        return {
          label: b.name,
          value: `${percentageAchieved}%`,
          description: `${b.achieved.toLocaleString()} / ${b.target.toLocaleString()}`,
          color: "rgba(23,97,163,1)",
        };
      });
    }

    if (currentChartType === 'gauge') {
      const year = bulletGaugeSelectedFilters.SelectYear || '2026';
      const month = bulletGaugeSelectedFilters.SelectMonth || 'January';
      const type = bulletGaugeSelectedFilters.SelectType || 'Sales';
      const gaugeMonthData = (chartData.gauge as any)[year]?.[type]?.[month];
      
      if (!gaugeMonthData || !gaugeMonthData.gauges) return [];

      return gaugeMonthData.gauges.map((gauge: any) => {
        const percentageAchieved = Math.round((gauge.value / gauge.max) * 100);
        return {
          label: gauge.name,
          value: `${percentageAchieved}%`,
          description: `${gauge.value.toLocaleString()} / ${gauge.max.toLocaleString()}`,
          color: "rgba(23,97,163,1)",
        };
      });
    }

    if (currentChartType === 'gantt') {
      const year = ganttSelectedFilters.SelectYear || '2026';
      const type = ganttSelectedFilters.SelectType || 'Development';
      const ganttTaskData = (chartData.gantt as any)[year]?.[type]?.tasks || [];
      
      return ganttTaskData.map((task: any) => {
        const taskColor = GANTT_COLOR_MAP[task.color as keyof typeof GANTT_COLOR_MAP] || GANTT_COLOR_MAP.blue;
        return {
          label: task.name,
          value: task.status,
          description: `${task.progress}% complete (${task.startDate} - ${task.endDate})`,
          color: taskColor,
          status: task.status as "In Progress" | "Overdue" | "On Target",
        };
      });
    }

    if (currentChartType === 'calendarheatmap') {
      const year = calendarHeatmapSelectedFilters.SelectYear || '2026';
      const type = calendarHeatmapSelectedFilters.SelectType || 'Development';
      const project = 'Project 1'; 
      const calendarHeatmapProjectData = (chartData.calendarheatmap as any)[project]?.[year]?.[type];
      
      if (!calendarHeatmapProjectData) return [];

      let allDays: any[] = [];
      Object.keys(calendarHeatmapProjectData).forEach(monthName => {
        const monthData = calendarHeatmapProjectData[monthName];
        if (monthData && monthData.data && Array.isArray(monthData.data)) {
          allDays = [...allDays, ...monthData.data];
        }
      });

      const sortedDays = allDays
        .sort((a: any, b: any) => b.value - a.value)
        .slice(0, 3);
      
      return sortedDays.map((day: any, index: number) => {
        const date = new Date(day.date);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        const colors = ['rgba(25, 118, 210, 1)', 'rgba(66, 165, 245, 1)', 'rgba(144, 202, 249, 1)'];
        
        return {
          label: dayName,
          value: `${day.value.toLocaleString()} activities`,
          description: index === 0 ? 'Peak activity day' : index === 1 ? 'High activity day' : 'Active day',
          color: colors[index],
        };
      });
    }

    if (currentChartType === 'horizontalbar') {
      
      const products = chartData.horizontalbar.products;
      const firstProduct = products ? Object.keys(products)[0] : null;
      const productData = firstProduct ? products[firstProduct] : null;
      
      if (!productData) return [];
      
      const colors = ['rgba(37, 99, 235, 1)', 'rgba(77, 175, 131, 1)', 'rgba(23, 97, 163, 1)'];
      const metrics = ['Revenue', 'Profit', 'Cost'];
      
      return metrics.map((metric, index) => ({
        label: metric,
        value: `${productData[metric]}`,
        description: `${metric}: ${productData[metric]}`,
        color: colors[index],
      }));
    }

    const data = activeChartDataMap[currentChartType];
    if (!data || !data.datasets || data.datasets.length === 0) return [];

    if ((currentChartType === 'line' || currentChartType === 'area') && data.datasets.length > 1) {
      return data.datasets.map((dataset: any) => ({
        label: dataset.label || '',
        value: dataset.data[dataset.data.length - 1].toString(),
        color: dataset.borderColor,
        description: `Latest value for ${dataset.label}`
      }));
    } 

    else {
      const total = data.datasets[0].data.reduce((sum: number, val: number) => sum + val, 0);
      return (data.labels || []).map((label: any, index: number) => {
        const value = data.datasets[0].data[index];
        const percentage = total > 0 ? ((value / total) * 100).toFixed(0) : 0;
        const colors = data.datasets[0].backgroundColor;
        const color = Array.isArray(colors) ? colors[index] : (colors as string);
        return {
          label: label,
          value: `${percentage}%`,
          description: `Represents ${label}`,
          color: color,
        };
      });
    }
  }, [activeChartDataMap, currentChartType, chartData, ganttSelectedFilters, horizontalBarSelectedFilters]);

  const chartFiltersConfig = {
    pie: chartData.filters.default,
    doughnut: chartData.filters.default,
    line: chartData.filters.default,
    area: chartData.filters.default,
    bar: chartData.filters.default,
    bullet: chartData.filters.bulletGauge,
    gauge: chartData.filters.bulletGauge,
    gantt: chartData.filters.gantt,
    heatmap: chartData.filters.heatmap,
    calendarheatmap: chartData.filters.calendarheatmap,
  };

  const actionButtons = chartData.actionButtons.map((btn) => ({
    label: btn.label,
    style: btn.style as "danger" | "primary" | "success" | "mahati",
    onClick: () => alert(`${btn.label} clicked!`),
  }));

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const uploadedData = JSON.parse(e.target?.result as string);

        if (!uploadedData.chartData || !uploadedData.filters || !uploadedData.quickStats) {
          alert("Invalid JSON structure. Please check the sample-chart-data.json format.");
          return;
        }

        setChartData(uploadedData);

        const newDataMap: Record<ChartType, ChartData<any>> = {
          pie: uploadedData.chartData.pie as ChartData<"doughnut">,
          doughnut: uploadedData.chartData.doughnut as ChartData<"doughnut">,
          line: uploadedData.chartData.line as ChartData<"line">,
          area: processAreaData(uploadedData.chartData.area) as ChartData<"line">,
          bar: uploadedData.chartData.bar as ChartData<"bar">,
          bullet: { labels: [], datasets: [] } as ChartData<"bar">,
          gauge: { labels: [], datasets: [] } as ChartData<"bar">,
          gantt: { labels: [], datasets: [] } as ChartData<"bar">,
        };
        setActiveChartDataMap(newDataMap);

        setCurrentStats(uploadedData.quickStats[currentChartType]);
        
        console.log("Custom data loaded successfully!");
      } catch (error) {
        console.error("Error parsing JSON:", error);
        alert("Invalid JSON file. Please check the file format.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <DemoContainer>
      <div className="mx-auto w-full max-w-6xl">
        <br></br>
        <h1 className="mb-2 text-3xl sm:text-4xl font-bold text-[rgba(17,24,39,1)]">
          Charts
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed mb-8">
          Charts UI provides various types of charts like 
          <b> "Pie"</b>, <b>"Doughnut"</b>, <b>"Line"</b>, <b>"Area"</b>, <b>"Bar"</b>, <b>"Bullet"</b>, <b>"Gauge"</b>, <b>"Gantt"</b>, <b>"Calendar Heatmap"</b>, <b>"Horizontal Bar"</b>.
        </p>
      </div>
      <UploadCard>
        <UploadTitle>Upload Custom Data (Optional)</UploadTitle>
        <FileInput
          type="file"
          accept=".json"
          onChange={handleFileUpload}
        />
        <UploadHint>
          Upload a JSON file with the same structure as sample-chart-data.json
        </UploadHint>
      </UploadCard>

      <MahatiChartAnalyticsWidget
        title={chartData.metadata.title}
        chartTypes={["pie", "doughnut", "line", "area", "bar", "bullet", "gauge", "gantt", "calendarheatmap", "horizontalbar"] as const}
        initialChartType={"pie" as const}
        filters={currentFilters}
        chartFilters={chartFiltersConfig}
        selectedFilters={currentSelectedFilters}
        chartDataMap={activeChartDataMap}
        bulletData={chartData.bullet}
        gaugeData={chartData.gauge}
        horizontalBarData={chartData.horizontalbar}
        ganttData={chartData.gantt as any}
        heatmapData={chartData.heatmap as any}
        calendarheatmapData={chartData.calendarheatmap as any}
        onApplyFilters={handleApplyFilters}
        onFiltersChange={handleFiltersChange}
        details={currentDetails}
        quickStats={currentStats}
        onChartTypeChange={handleChartTypeChange}
        actionButtons={actionButtons}
      />
    </DemoContainer>
  );
}