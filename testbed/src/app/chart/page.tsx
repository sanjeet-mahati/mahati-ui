"use client";
import React, { useMemo, useState, useEffect } from "react";
import styled from "@emotion/styled";
import { ChartData } from "chart.js";
import { MahatiChartAnalyticsWidget } from "@/lib";
import chartDataJson from "./sample-chart-data.json";

/* ============================================================================
   STYLED COMPONENTS
   ============================================================================ */

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

/* ============================================================================
   TYPES
   ============================================================================ */

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

type ChartType = "pie" | "doughnut" | "line" | "area" | "bar" | "bullet" | "gauge" | "riskgauge" | "gantt" | "calendarheatmap" | "horizontalbar" | "columnchart" | "groupbar" | "stackbar" | "lollipop" | "kpi";
type TaskStatus = "Overdue" | "In Progress" | "On Target";

/* ============================================================================
   UTILITY FUNCTIONS
   ============================================================================ */

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

const getAreaChartData = (areaData: any, filters: Record<string, string>) => {
  if (!areaData) return null;

  let current = areaData;

  if (filters.Relationship && current?.Relationship?.[filters.Relationship]) {
    current = current.Relationship[filters.Relationship];
  }

  if (filters.DebtCollector && current?.DebtCollector?.[filters.DebtCollector]) {
    current = current.DebtCollector[filters.DebtCollector];
  }

  if (filters.CollectionAgency && current?.CollectionAgency?.[filters.CollectionAgency]) {
    current = current.CollectionAgency[filters.CollectionAgency];
  }

  if (filters.Periodicity && current?.Periodicity?.[filters.Periodicity]) {
    current = current.Periodicity[filters.Periodicity];
  }

  if (current?.labels && current?.datasets) {
    return current;
  }

  if (areaData.Periodicity?.[filters.Periodicity]?.labels) {
    return areaData.Periodicity[filters.Periodicity];
  }
  if (areaData.Relationship?.[filters.Relationship]?.labels) {
    return areaData.Relationship[filters.Relationship];
  }
  if (areaData.DebtCollector?.[filters.DebtCollector]?.labels) {
    return areaData.DebtCollector[filters.DebtCollector];
  }
  if (areaData.CollectionAgency?.[filters.CollectionAgency]?.labels) {
    return areaData.CollectionAgency[filters.CollectionAgency];
  }

  return areaData.default || areaData;
};

/* ============================================================================
   MAIN COMPONENT
   ============================================================================ */

export default function MahatiChart() {
  const [chartData, setChartData] = useState(chartDataJson);
  const [currentChartType, setCurrentChartType] = useState<ChartType>("area");

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

  const [riskGaugeSelectedFilters, setRiskGaugeSelectedFilters] = useState<Record<string, string>>({
    SelectYear: "2026",
    SelectMonth: "January",
    SelectType: "Credit Score",
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

  const [columnChartSelectedFilters, setColumnChartSelectedFilters] = useState<Record<string, string>>({
    SelectYear: "2026",
    SelectMonth: "January",
    SelectType: "Category A",
  });

  const [groupBarSelectedFilters, setGroupBarSelectedFilters] = useState<Record<string, string>>({
    SelectYear: "2026",
    SelectMonth: "January",
  });

  const [stackBarSelectedFilters, setStackBarSelectedFilters] = useState<Record<string, string>>({
    SelectYear: "2026",
    SelectMonth: "January",
    SelectWeek: "Week 1",
    SelectType: "Category A",
  });

  const [lollipopSelectedFilters, setLollipopSelectedFilters] = useState<Record<string, string>>(() => {
    const lollipopFilters = chartData.filters?.lollipop || [];
    const initialFilters: Record<string, string> = {};
    
    lollipopFilters.forEach((filter: any) => {
      if (filter.id !== 'SelectOrientation' && filter.options && filter.options.length > 0) {
        initialFilters[filter.id] = filter.options[0];
      }
    });
    
    initialFilters['SelectOrientation'] = 'horizontal';
    
    return initialFilters;
  });

  const [calendarHeatmapSelectedFilters, setCalendarHeatmapSelectedFilters] = useState<Record<string, string>>({
    SelectYear: "2026",
    SelectType: "Development",
  });

  const [kpiSelectedFilters, setKpiSelectedFilters] = useState<Record<string, string>>(() => {
    const kpiFilters = chartData.filters?.kpi || [];
    const initialFilters: Record<string, string> = {};
    
    kpiFilters.forEach((filter: any) => {
      if (filter.options && filter.options.length > 0) {
        initialFilters[filter.id] = filter.options[0];
      }
    });
    
    return initialFilters;
  });

  const [currentStats, setCurrentStats] = useState(chartData.quickStats?.pie || {});

  const [activeChartDataMap, setActiveChartDataMap] = useState<Record<ChartType, ChartData<any>>>({
    pie: {} as any,
    doughnut: {} as any,
    line: {} as any,
    area: {} as any,
    bar: {} as any,
    bullet: { labels: [], datasets: [] },
    gauge: { labels: [], datasets: [] },
    riskgauge: { labels: [], datasets: [] },
    gantt: { labels: [], datasets: [] },
    calendarheatmap: { labels: [], datasets: [] },
    horizontalbar: { labels: [], datasets: [] },
    columnchart: { labels: [], datasets: [] },
    groupbar: { labels: [], datasets: [] },
    stackbar: { labels: [], datasets: [] },
    lollipop: { labels: [], datasets: [] },
    kpi: { labels: [], datasets: [] },
  });

  useEffect(() => {
    const initialMap: Record<ChartType, ChartData<any>> = {
      pie: chartData.chartData?.pie as ChartData<"doughnut"> || {},
      doughnut: chartData.chartData?.doughnut as ChartData<"doughnut"> || {},
      line: chartData.chartData?.line as ChartData<"line"> || {},
      area: processAreaData(
        getAreaChartData(chartData.chartData?.area, selectedFilters) ||
        chartData.chartData?.area?.default ||
        {}
      ),
      bar: chartData.chartData?.bar as ChartData<"bar"> || {},
      bullet: { labels: [], datasets: [] },
      gauge: { labels: [], datasets: [] },
      riskgauge: { labels: [], datasets: [] },
      gantt: { labels: [], datasets: [] },
      calendarheatmap: { labels: [], datasets: [] },
      horizontalbar: { labels: [], datasets: [] },
      columnchart: { labels: [], datasets: [] },
      groupbar: { labels: [], datasets: [] },
      stackbar: { labels: [], datasets: [] },
      lollipop: { labels: [], datasets: [] },
      kpi: { labels: [], datasets: [] },
    };

    setActiveChartDataMap(initialMap);
    setCurrentStats((chartData.quickStats as any)?.[currentChartType] || chartData.quickStats?.pie || {});
  }, [chartData, currentChartType]);

  const currentSelectedFilters = useMemo(() => {
    switch (currentChartType) {
      case 'gantt': return ganttSelectedFilters;
      case 'horizontalbar': return horizontalBarSelectedFilters;
      case 'columnchart': return columnChartSelectedFilters;
      case 'groupbar': return groupBarSelectedFilters;
      case 'stackbar': return stackBarSelectedFilters;
      case 'calendarheatmap': return calendarHeatmapSelectedFilters;
      case 'lollipop': return lollipopSelectedFilters;
      case 'kpi': return kpiSelectedFilters;
      case 'riskgauge': return riskGaugeSelectedFilters;
      case 'bullet':
      case 'gauge': return bulletGaugeSelectedFilters;
      default: return selectedFilters;
    }
  }, [currentChartType, selectedFilters, bulletGaugeSelectedFilters, riskGaugeSelectedFilters, ganttSelectedFilters, horizontalBarSelectedFilters, columnChartSelectedFilters, groupBarSelectedFilters, stackBarSelectedFilters, calendarHeatmapSelectedFilters, lollipopSelectedFilters, kpiSelectedFilters]);

  const currentFilters = useMemo(() => {
    switch (currentChartType) {
      case 'gantt': return chartData.filters?.gantt || [];
      case 'horizontalbar': return chartData.filters?.horizontalbar || [];
      case 'columnchart': return chartData.filters?.columnchart || [];
      case 'groupbar': return chartData.filters?.groupbar || [];
      case 'stackbar': return chartData.filters?.stackbar || [];
      case 'calendarheatmap': return chartData.filters?.calendarheatmap || [];
      case 'lollipop': return chartData.filters?.lollipop || [];
      case 'kpi': return chartData.filters?.kpi || [];
      case 'riskgauge': return chartData.filters?.riskgauge || [];
      case 'bullet':
      case 'gauge': return chartData.filters?.bulletGauge || [];
      default: return chartData.filters?.default || [];
    }
  }, [currentChartType, chartData.filters]);

  const handleChartTypeChange = (chartType: ChartType) => {
    setCurrentChartType(chartType);
    setCurrentStats((chartData.quickStats as any)?.[chartType] || chartData.quickStats?.pie || {});
  };

  const handleFiltersChange = (newFilters: Record<string, string>) => {
    console.log('🔄 Filter Change - Chart Type:', currentChartType);
    console.log('🔄 Filter Change - New Filters:', newFilters);
    
    if (currentChartType === 'kpi') {
      console.log('✅ Setting KPI Filters:', newFilters);
      setKpiSelectedFilters(newFilters);
    } else if (currentChartType === 'gantt') {
      setGanttSelectedFilters(newFilters);
    } else if (currentChartType === 'horizontalbar') {
      setHorizontalBarSelectedFilters(newFilters);
    } else if (currentChartType === 'columnchart') {
      setColumnChartSelectedFilters(newFilters);
    } else if (currentChartType === 'groupbar') {
      setGroupBarSelectedFilters(newFilters);
    } else if (currentChartType === 'stackbar') {
      setStackBarSelectedFilters(newFilters);
    } else if (currentChartType === 'calendarheatmap') {
      setCalendarHeatmapSelectedFilters(newFilters);
    } else if (currentChartType === 'lollipop') {
      setLollipopSelectedFilters(newFilters);
    } else if (currentChartType === 'riskgauge') {
      setRiskGaugeSelectedFilters(newFilters);
    } else if (currentChartType === 'bullet' || currentChartType === 'gauge') {
      setBulletGaugeSelectedFilters(newFilters);
    } else {
      setSelectedFilters(newFilters);

      if (currentChartType === 'area') {
        const updatedData = getAreaChartData(chartData.chartData?.area, newFilters);
        if (updatedData?.labels && updatedData?.datasets) {
          setActiveChartDataMap(prev => ({
            ...prev,
            area: processAreaData(updatedData)
          }));
        }
      }
    }
  };

  const handleApplyFilters = () => {
    console.log(`Applying filters for ${currentChartType}:`, currentSelectedFilters);
  };

  const currentDetails = useMemo((): DetailItem[] => {
    const data = activeChartDataMap[currentChartType];
    if (!data || !data.datasets?.length) return [];

    if (currentChartType === 'area' || currentChartType === 'line') {
      const boxColors = [
        "rgba(37, 99, 235, 1)",
        "rgba(22, 163, 74, 1)",
        "rgba(239, 68, 68, 1)",
      ];

      return data.datasets.map((dataset: any, idx: number) => ({
        label: dataset.label || `Series ${idx + 1}`,
        value: dataset.data?.[dataset.data.length - 1]?.toString() || '0',
        color: dataset.borderColor || '#6b7280',
        description: `Latest value for ${dataset.label || 'series'}`,
        boxStyle: {
          width: "12px",
          height: "12px",
          borderRadius: "2px",
          backgroundColor: boxColors[idx] || "#6b7280",
        },
      }));
    }

    if (currentChartType === 'bullet') {
      const year = bulletGaugeSelectedFilters.SelectYear || '2026';
      const month = bulletGaugeSelectedFilters.SelectMonth || 'January';
      const type = bulletGaugeSelectedFilters.SelectType || 'Sales';
      const bulletMonthData = (chartData.bullet as any)?.[year]?.[type]?.[month];

      if (bulletMonthData?.bullets) {
        return bulletMonthData.bullets.map((b: any) => {
          const percentage = Math.round((b.achieved / b.target) * 100);
          return {
            label: b.name,
            value: `${percentage}%`,
            description: `${b.achieved.toLocaleString()} / ${b.target.toLocaleString()}`,
            color: "rgba(23,97,163,1)",
          };
        });
      }
      return [];
    }

    if (currentChartType === 'gauge') {
      const year = bulletGaugeSelectedFilters.SelectYear || '2026';
      const month = bulletGaugeSelectedFilters.SelectMonth || 'January';
      const type = bulletGaugeSelectedFilters.SelectType || 'Sales';
      const gaugeMonthData = (chartData.gauge as any)?.[year]?.[type]?.[month];

      if (gaugeMonthData?.gauges) {
        return gaugeMonthData.gauges.map((g: any) => {
          const percentage = Math.round((g.value / g.max) * 100);
          return {
            label: g.name,
            value: `${percentage}%`,
            description: `${g.value.toLocaleString()} / ${g.max.toLocaleString()}`,
            color: "rgba(23,97,163,1)",
          };
        });
      }
      return [];
    }

    if (currentChartType === 'riskgauge') {
      const year = riskGaugeSelectedFilters.SelectYear || '2026';
      const month = riskGaugeSelectedFilters.SelectMonth || 'January';
      const type = riskGaugeSelectedFilters.SelectType || 'Credit Score';
      const riskGaugeYearData = (chartData.riskgauge as any)?.[year]?.[month]?.[type];

      if (riskGaugeYearData && Array.isArray(riskGaugeYearData)) {
        return riskGaugeYearData.map((g: any) => {
          const percentage = Math.round((g.score / (g.max || 100)) * 100);
          return {
            label: g.name || 'Risk Score',
            value: `${percentage}%`,
            description: `Risk Score: ${g.score} / ${g.max || 100}`,
            color: "rgba(239, 68, 68, 1)",
          };
        });
      }
      return [];
    }

    if (currentChartType === 'gantt') {
      const year = ganttSelectedFilters.SelectYear || '2026';
      const type = ganttSelectedFilters.SelectType || 'Development';
      const ganttTaskData = (chartData.gantt as any)?.[year]?.[type]?.tasks || [];
      
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
      const calendarHeatmapProjectData = (chartData.calendarheatmap as any)?.[project]?.[year]?.[type];
      
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
      const products = (chartData.horizontalbar as any)?.products;
      const firstProduct = products ? Object.keys(products)[0] : null;
      const productData = firstProduct ? products[firstProduct] : null;
      
      if (!productData) return [];
      
      const colors = ['rgba(37, 99, 235, 1)', 'rgba(77, 175, 131, 1)', 'rgba(23, 97, 163, 1)'];
      const metrics = ['Revenue', 'Profit', 'Cost'];
      
      return metrics.map((metric, index) => ({
        label: metric,
        value: `${productData[metric] || 0}`,
        description: `${metric}: ${productData[metric] || 0}`,
        color: colors[index],
      }));
    }

    if (currentChartType === 'columnchart') {
      const year = columnChartSelectedFilters.SelectYear || '2026';
      const month = columnChartSelectedFilters.SelectMonth || 'January';
      const type = columnChartSelectedFilters.SelectType || 'Category A';
      
      const columnYearData = (chartData.columnchart as any)?.[year];
      const columnMonthData = columnYearData?.[month];
      const columnTypeData = columnMonthData?.[type] || [];
      
      return columnTypeData.slice(0, 6).map((item: any) => ({
        label: item.name,
        value: `${item.value >= 1000 ? (item.value / 1000).toFixed(1) + 'k' : item.value}`,
        description: `Value: ${item.value}`,
        color: item.gradient || 'linear-gradient(180deg, rgba(77, 175, 131, 1) 0%, rgba(23, 97, 163, 1) 100%)',
      }));
    }

    if (currentChartType === 'groupbar') {
      const year = groupBarSelectedFilters.SelectYear || '2026';
      const month = groupBarSelectedFilters.SelectMonth || 'January';
      
      const groupBarYearData = (chartData.groupbar as any)?.[year];
      const groupBarMonthData = groupBarYearData?.[month] || [];
      
      const legends = (chartData.groupbar as any)?.legends || [];
      const getColor = (key: string, fallback: string): string => {
        const legend = legends.find((l: any) => l.key === key);
        return legend?.color || fallback;
      };
      
      const revenueColor = getColor('revenue', 'rgba(23, 97, 163, 1)');
      const profitColor = getColor('profit', 'rgba(77, 175, 131, 1)');
      const lossColor = getColor('loss', 'rgba(220, 38, 38, 1)');
      const costColor = getColor('cost', 'rgba(47, 164, 169, 1)');
      
      const allMetrics: any[] = [];
      
      const getProfitOrLoss = (group: any): number => {
        if (group.profitOrLoss !== undefined && group.profitOrLoss !== null) {
          return group.profitOrLoss;
        }
        return group.revenue - group.cost;
      };
      
      groupBarMonthData.forEach((group: any) => {
        const profitOrLossValue = getProfitOrLoss(group);
        const isProfitable = profitOrLossValue >= 0;
        const profitLossLabel = isProfitable ? 'Profit' : 'Loss';
        const profitLossColor = isProfitable ? profitColor : lossColor;
        const profitLossAbsValue = Math.abs(profitOrLossValue);
        
        allMetrics.push(
          { label: `${group.name} - Revenue`, value: `${group.revenue}k`, description: 'Revenue', color: revenueColor },
          { label: `${group.name} - ${profitLossLabel}`, value: `${profitLossAbsValue}k`, description: profitLossLabel, color: profitLossColor },
          { label: `${group.name} - Cost`, value: `${group.cost}k`, description: 'Cost', color: costColor }
        );
      });
      
      return allMetrics.slice(0, 6);
    }

    if (currentChartType === 'stackbar') {
      const year = stackBarSelectedFilters.SelectYear || '2026';
      const month = stackBarSelectedFilters.SelectMonth || 'January';
      const week = stackBarSelectedFilters.SelectWeek || 'Week 1';
      const type = stackBarSelectedFilters.SelectType || 'Category A';
      
      const stackBarYearData = (chartData.stackbar as any)?.[year];
      const stackBarMonthData = stackBarYearData?.[month];
      const stackBarWeekData = stackBarMonthData?.[week];
      const stackBarTypeData = stackBarWeekData?.[type] || [];
      
      const legends = (chartData.stackbar as any)?.legends || [];
      const getColor = (key: string, fallback: string): string => {
        const legend = legends.find((l: any) => l.key === key);
        return legend?.color || fallback;
      };
      
      const aggregatingColor = getColor('aggregating', 'rgba(37, 99, 235, 1)');
      const outstandingColor = getColor('outstanding', 'rgba(34, 197, 94, 1)');
      const writeOffColor = getColor('writeOff', 'rgba(239, 68, 68, 1)');
      
      const allMetrics: any[] = [];
      
      stackBarTypeData.forEach((day: any) => {
        allMetrics.push(
          { label: `${day.day} - Aggregating`, value: `$${day.aggregating}`, description: 'Aggregating Amount', color: aggregatingColor },
          { label: `${day.day} - Outstanding`, value: `$${day.outstanding}`, description: 'Outstanding Amount', color: outstandingColor },
          { label: `${day.day} - Write-Off`, value: `$${day.writeOff}`, description: 'Write-Off Amount', color: writeOffColor }
        );
      });
      
      return allMetrics.slice(0, 6);
    }

    if (currentChartType === 'lollipop') {
      const year = lollipopSelectedFilters.SelectYear || '2026';
      const month = lollipopSelectedFilters.SelectMonth || 'January';
      const category = lollipopSelectedFilters.SelectType || 'Category A';
      const lollipopYearData = (chartData.lollipop as any)?.[year]?.[month]?.[category] || [];
      
      return lollipopYearData.slice(0, 5).map((item: any) => ({
        label: item.label,
        value: `${item.value}`,
        description: `Value: ${item.value}`,
        color: item.color || 'rgba(37, 99, 235, 1)',
      }));
    }

    const total = data.datasets[0]?.data?.reduce((sum: number, v: number) => sum + v, 0) || 0;
    return (data.labels || []).map((label: any, idx: number) => {
      const value = data.datasets[0]?.data?.[idx] || 0;
      const percentage = total > 0 ? ((value / total) * 100).toFixed(0) : '0';
      const bgColor = Array.isArray(data.datasets[0]?.backgroundColor)
        ? data.datasets[0].backgroundColor[idx]
        : data.datasets[0]?.backgroundColor || '#6b7280';

      return {
        label: label,
        value: `${percentage}%`,
        description: `Represents ${label}`,
        color: bgColor,
      };
    });
  }, [activeChartDataMap, currentChartType, chartData, bulletGaugeSelectedFilters, riskGaugeSelectedFilters, ganttSelectedFilters, horizontalBarSelectedFilters, columnChartSelectedFilters, groupBarSelectedFilters, stackBarSelectedFilters, calendarHeatmapSelectedFilters, lollipopSelectedFilters, kpiSelectedFilters]);

  const chartFiltersConfig = {
    pie: chartData.filters?.default,
    doughnut: chartData.filters?.default,
    line: chartData.filters?.default,
    area: chartData.filters?.default,
    bar: chartData.filters?.default,
    bullet: chartData.filters?.bulletGauge,
    gauge: chartData.filters?.bulletGauge,
    gantt: chartData.filters?.gantt,
    heatmap: (chartData.filters as any)?.heatmap,
    calendarheatmap: chartData.filters?.calendarheatmap,
    horizontalbar: chartData.filters?.horizontalbar,
    columnchart: chartData.filters?.columnchart,
    groupbar: chartData.filters?.groupbar,
    stackbar: chartData.filters?.stackbar,
    lollipop: chartData.filters?.lollipop,
    kpi: chartData.filters?.kpi,
    riskgauge: chartData.filters?.riskgauge,
  };

  const actionButtons = (chartData.actionButtons || []).map((btn: any) => ({
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
        const uploaded = JSON.parse(e.target?.result as string);
        if (!uploaded.chartData || !uploaded.filters) {
          alert("Invalid JSON structure.");
          return;
        }
        setChartData(uploaded);

        const newMap: Record<ChartType, ChartData<any>> = {
          pie: uploaded.chartData.pie || {},
          doughnut: uploaded.chartData.doughnut || {},
          line: uploaded.chartData.line || {},
          area: processAreaData(
            getAreaChartData(uploaded.chartData.area, selectedFilters) ||
            uploaded.chartData.area?.default ||
            {}
          ),
          bar: uploaded.chartData.bar || {},
          bullet: { labels: [], datasets: [] },
          gauge: { labels: [], datasets: [] },
          riskgauge: { labels: [], datasets: [] },
          gantt: { labels: [], datasets: [] },
          calendarheatmap: { labels: [], datasets: [] },
          horizontalbar: { labels: [], datasets: [] },
          columnchart: { labels: [], datasets: [] },
          groupbar: { labels: [], datasets: [] },
          stackbar: { labels: [], datasets: [] },
          lollipop: { labels: [], datasets: [] },
          kpi: { labels: [], datasets: [] },
        };
        setActiveChartDataMap(newMap);
      } catch (err) {
        console.error("JSON parse error:", err);
        alert("Invalid JSON file.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <DemoContainer>
      <div className="mx-auto w-full max-w-6xl">
        <br />
        <h1 className="mb-2 text-3xl sm:text-4xl font-bold text-[rgba(17,24,39,1)]">
          Charts
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed mb-8">
          Charts UI provides various types of charts like{" "}
          <b>"Pie"</b>, <b>"Doughnut"</b>, <b>"Line"</b>, <b>"Area"</b>, <b>"Bar"</b>, <b>"Bullet"</b>,{" "}
          <b>"Gauge"</b>, <b>"Gantt"</b>, <b>"Calendar Heatmap"</b>, <b>"Horizontal Bar"</b>, <b>"Column Chart"</b>,{" "}
          <b>"Group Bar Chart"</b>, <b>"Stacked Bar Chart"</b>, <b>"Lollipop Chart"</b>, <b>"KPI Chart"</b>, <b>"KPI Risk Gauge Chart"</b>.
        </p>
      </div>

      <UploadCard>
        <UploadTitle>Upload Custom Data (Optional)</UploadTitle>
        <FileInput type="file" accept=".json" onChange={handleFileUpload} />
        <UploadHint>
          Upload a JSON file with the same structure as sample-chart-data.json
        </UploadHint>
      </UploadCard>

      <MahatiChartAnalyticsWidget
        title={chartData.metadata?.title || "Mahati Systems Chart Analytics"}
        chartTypes={
          [
            "pie",
            "doughnut",
            "line",
            "area",
            "bar",
            "bullet",
            "gauge",
            "gantt",
            "calendarheatmap",
            "horizontalbar",
            "lollipop",
            "kpi",
            "riskgauge",
            "columnchart",
            "groupbar",
            "stackbar",
          ] as const
        }
        initialChartType="area"
        filters={currentFilters}
        chartFilters={chartFiltersConfig}
        selectedFilters={currentSelectedFilters}
        chartDataMap={activeChartDataMap}
        bulletData={chartData.bullet}
        gaugeData={chartData.gauge}
        horizontalBarData={chartData.horizontalbar}
        columnChartData={chartData.columnchart}
        groupBarData={chartData.groupbar}
        stackBarData={chartData.stackbar}
        lollipopData={chartData.lollipop}
        kpiData={chartData.kpi}
        riskGaugeData={chartData.riskgauge}
        ganttData={chartData.gantt as any}
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