"use client";
import React, { useMemo, useState } from "react";
import { ChartData } from "chart.js";
import { ChartDropdown, DropdownOption } from "./ChartDropdown";

import { PieLineBarChart, PieLineBarChartType, makeAreaDataStraight } from "./PieLineBarChart";
import { BulletChart } from "./BulletChart";
import { GaugeChart, RiskGaugeChart } from "./GaugeChart";
import { HorizontalBarChart } from "./HorizontalBarChart";
import { GanttChart, GANTT_COLORS } from "./GanttChart";
import { CalendarHeatmapChart } from "./CalendarHeatmapChart";
import { LollipopChart } from "./LollipopChart";
import type { LollipopData, LollipopItem } from "./LollipopChart";
import { ColumnChart } from "./ColumnChart";
import type { ColumnChartData, ColumnItem } from "./ColumnChart";
import { KPIChart } from "./KPIChart";
import type { KPIChartData } from "./KPIChart";
import { GroupBarChart } from "./GroupBarChart";
import type { GroupBarChartData, GroupBarItem, GroupBarLegendItem } from "./GroupBarChart";
import { StackBarChart } from "./StackBarChart";
import type { StackBarChartData, StackBarDayData, StackBarLegendItem } from "./StackBarChart";
import type { BulletData, BulletItem } from "./BulletChart";
import type { GaugeData } from "./GaugeChart";
import type { HorizontalBarData, HorizontalBarItem, HorizontalBarTopPerformer } from "./HorizontalBarChart";
import type { GanttData } from "./GanttChart";
import type { HeatmapData } from "./CalendarHeatmapChart";

/* ============================================================================
   ASSET HELPERS
   ============================================================================ */

type AssetModule =
  | string
  | { src?: string; default?: string | { src?: string } }
  | { default?: string }
  | { default?: { src?: string } };

const assetSrc = (m: AssetModule): string => {
  if (typeof m === "string") return m;
  const anyM = m as any;
  if (typeof anyM?.src === "string") return anyM.src;
  const d = anyM?.default;
  if (typeof d === "string") return d;
  if (typeof d?.src === "string") return d.src;
  return "";
};

const FALLBACK_ICONS = {
  performancePeakIcon: "/chart-icons/performance-peak-icon.png",
  calendarIcon: "/chart-icons/calendar-3.png",
  increaseIcon: "/chart-icons/increase.png",
  decreaseIcon: "/chart-icons/decrease.png",
};

const getIconSrc = (imported: AssetModule, fallback: string): string => {
  const src = assetSrc(imported);
  return src || fallback;
};

let performancePeakIcon: AssetModule = "";
let calendarIcon: AssetModule = "";
let increaseIcon: AssetModule = "";
let decreaseIcon: AssetModule = "";

try {
  performancePeakIcon = require("../assets/icons/performance-peak-icon.png") as AssetModule;
  calendarIcon = require("../assets/icons/calendar-3.png") as AssetModule;
  increaseIcon = require("../assets/icons/increase.png") as AssetModule;
  decreaseIcon = require("../assets/icons/decrease.png") as AssetModule;
} catch (e) {}

/* ============================================================================
   TYPES & INTERFACES
   ============================================================================ */

export type ChartType =
  | "pie" | "doughnut" | "line" | "area" | "bar" | "bullet"
  | "gauge" | "gantt" | "calendarheatmap" | "horizontalbar"
  | "columnchart" | "groupbar" | "lollipop" | "kpi" | "riskgauge" | "stackbar";

export interface Filter {
  id: string;
  label: string;
  options: string[];
}

export interface ChartFiltersConfig {
  pie?: Filter[];
  doughnut?: Filter[];
  line?: Filter[];
  area?: Filter[];
  bar?: Filter[];
  bullet?: Filter[];
  gauge?: Filter[];
  gantt?: Filter[];
  heatmap?: Filter[];
  calendarheatmap?: Filter[];
  horizontalbar?: Filter[];
  columnchart?: Filter[];
  groupbar?: Filter[];
  stackbar?: Filter[];
  lollipop?: Filter[];
  kpi?: Filter[];
  riskgauge?: Filter[];
}

export interface DetailItem {
  label: string;
  value: string;
  color: string;
  description: string;
  status?: "In Progress" | "Overdue" | "On Target";
}

export interface MahatiChartAnalyticsWidgetProps {
  title: string;
  chartTypes: ChartType[];
  initialChartType: ChartType;
  filters: Filter[];
  chartFilters?: ChartFiltersConfig;
  selectedFilters: Record<string, string>;
  chartDataMap: Record<ChartType, ChartData<any>>;
  bulletData?: BulletData;
  gaugeData?: GaugeData;
  horizontalBarData?: HorizontalBarData;
  columnChartData?: ColumnChartData;
  groupBarData?: GroupBarChartData;
  stackBarData?: StackBarChartData;
  lollipopData?: LollipopData;
  kpiData?: Record<string, KPIChartData>;
  riskGaugeData?: any;
  ganttData?: Record<string, Record<string, GanttData>>;
  heatmapData?: Record<string, HeatmapData>;
  calendarheatmapData?: Record<string, any>;
  onApplyFilters?: (filters: Record<string, string>) => void;
  onChartTypeChange?: (chartType: ChartType) => void;
  onFiltersChange: (filters: Record<string, string>) => void;
  details: DetailItem[];
  quickStats: {
    totalVolume: { value: string; change: string; description: string };
    transactions: { value: string; description: string };
  };
  actionButtons: {
    label: string;
    style: "danger" | "primary" | "success" | "mahati";
    onClick: () => void;
  }[];
}

/* ============================================================================
   UTILITY FUNCTIONS
   ============================================================================ */

const colorToClass = (color: unknown): string => {
  const c = typeof color === "string" ? color.toLowerCase() : "";
  if (c.startsWith("rgba(") || c.startsWith("rgb(")) return c;
  const map: Record<string, string> = {
    "#7dcfaf": "#7DCFAF", "#f28a18": "#F28A18", "#2094f3": "#2094F3",
    "#909592": "#909592", "#bcc6cb": "#BCC6CB", "#3b82f6": "#3B82F6",
    "#10b981": "#10B981", "#ef4444": "#EF4444", "#f97316": "#F97316",
    "#f59e0b": "#F59E0B", "#8b5cf6": "#8B5CF6", "#ec4899": "#EC4899",
    "#6366f1": "#6366F1",
  };
  return map[c] || (typeof color === "string" ? color : "#D1D5DB");
};

const getStatusColors = (status: string) => {
  const statusConfig: Record<string, { textColor: string; backgroundColor: string }> = {
    "In Progress": { textColor: "rgba(23,97,163,1)", backgroundColor: "rgba(23,97,163,0.15)" },
    "Overdue": { textColor: "rgba(220,38,38,1)", backgroundColor: "rgba(239,68,68,0.15)" },
    "On Target": { textColor: "rgba(46,158,120,1)", backgroundColor: "rgba(70,194,155,0.15)" },
  };
  return statusConfig[status] || statusConfig["In Progress"];
};

const tabLabel = (type: ChartType) => {
  if (type === "area") return "Area Line Chart";
  if (type === "bullet") return "Bullet Chart";
  if (type === "gauge") return "Gauge Chart";
  if (type === "riskgauge") return "KPI Risk Gauge Chart";
  if (type === "gantt") return "Gantt Chart";
  if (type === "calendarheatmap") return "Calendar Heat Map";
  if (type === "horizontalbar") return "Horizontal Bar Chart";
  if (type === "columnchart") return "Column Chart";
  if (type === "groupbar") return "Group Bar Chart";
  if (type === "stackbar") return "Stacked Bar Chart";
  if (type === "lollipop") return "Lollipop Chart";
  if (type === "kpi") return "KPI Chart";
  return `${type.charAt(0).toUpperCase() + type.slice(1)} Chart`;
};

/* ============================================================================
   SHARED SMALL COMPONENTS
   ============================================================================ */

const MenuDotsButton = () => (
  <button
    type="button"
    className="w-8 h-8 flex items-center justify-center rounded bg-transparent border-none cursor-pointer transition-colors hover:bg-[rgba(243,244,246,1)]"
  >
    <div className="flex gap-1">
      <span className="w-1 h-1 bg-[rgba(107,114,128,1)] rounded-full" />
      <span className="w-1 h-1 bg-[rgba(107,114,128,1)] rounded-full" />
      <span className="w-1 h-1 bg-[rgba(107,114,128,1)] rounded-full" />
    </div>
  </button>
);

/* ============================================================================
   MAIN COMPONENT
   ============================================================================ */

export const MahatiChartAnalyticsWidget = ({
  title,
  chartTypes,
  initialChartType,
  filters,
  chartFilters,
  selectedFilters,
  chartDataMap,
  bulletData,
  gaugeData,
  horizontalBarData,
  columnChartData,
  groupBarData,
  stackBarData,
  lollipopData,
  kpiData,
  riskGaugeData,
  ganttData,
  heatmapData,
  calendarheatmapData,
  onApplyFilters,
  quickStats,
  actionButtons,
  onChartTypeChange,
  onFiltersChange,
  details,
}: MahatiChartAnalyticsWidgetProps) => {
  const [chartType, setChartType] = useState<ChartType>(initialChartType);
  const [selectedGanttProject, setSelectedGanttProject] = useState<string>("Project 1");
  const [selectedCalendarHeatmapProject, setSelectedCalendarHeatmapProject] = useState<string>("Project 1");

  const currentFilters = useMemo(() => {
    if (chartFilters && chartFilters[chartType]) return chartFilters[chartType] || [];
    return filters;
  }, [chartType, chartFilters, filters]);

  const currentData = useMemo(() => {
    const base = chartDataMap[chartType];
    if (chartType === "area" && base) return makeAreaDataStraight(base);
    return base;
  }, [chartDataMap, chartType]);

  const isLineFamily = chartType === "line" || chartType === "area";
  const isPieFamily = chartType === "pie" || chartType === "doughnut";

  const bulletDetails = useMemo(() => {
    if (chartType === "bullet" && bulletData?.bullets) {
      return bulletData.bullets.map((bullet) => {
        const percentageAchieved = Math.round((bullet.achieved / bullet.target) * 100);
        return { label: bullet.name, value: `${percentageAchieved}% Done`, description: `${percentageAchieved}% of target achieved`, color: "rgba(183,232,214,0.9)" };
      });
    }
    return [];
  }, [chartType, bulletData]);

  const currentGanttData = useMemo(() => {
    if (chartType === "gantt" && ganttData) {
      const year = selectedFilters["SelectYear"] || "2026";
      const type = selectedFilters["SelectType"] || "Development";
      const baseData = ganttData[year]?.[type];
      if (!baseData) return undefined;
      if (selectedGanttProject === "Project 2") {
        return {
          title: `${baseData.title} - ${selectedGanttProject}`,
          projectName: `${baseData.projectName} - ${selectedGanttProject}`,
          tasks: baseData.tasks.map((task) => {
            const newProgress = Math.max(0, task.progress - 20);
            let newStatus: "In Progress" | "On Target" | "Overdue" | "Completed" = task.status;
            if (task.progress <= 70 && task.status === "On Target") newStatus = "In Progress";
            return { ...task, progress: newProgress, status: newStatus };
          }),
        };
      }
      return { ...baseData, title: `${baseData.title} - ${selectedGanttProject}`, projectName: `${baseData.projectName} - ${selectedGanttProject}` };
    }
    return undefined;
  }, [chartType, ganttData, selectedFilters, selectedGanttProject]);

  const currentHorizontalBarTopPerformer = useMemo(() => {
    if (chartType !== "horizontalbar" || !horizontalBarData) return undefined;
    const selectedYear = selectedFilters["SelectYear"] || "2026";
    const selectedMonth = selectedFilters["SelectMonth"] || "January";
    const yearData = horizontalBarData[selectedYear] as Record<string, Record<string, { Revenue: number; Profit: number; Cost: number }>>;
    const monthData = yearData?.[selectedMonth];
    if (!monthData) return undefined;
    const monthOrder = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const currentMonthIndex = monthOrder.indexOf(selectedMonth);
    const previousMonth = currentMonthIndex > 0 ? monthOrder[currentMonthIndex - 1] : "December";
    const previousYear = currentMonthIndex > 0 ? selectedYear : String(Number(selectedYear) - 1);
    const previousYearData = horizontalBarData[previousYear] as Record<string, Record<string, { Revenue: number; Profit: number; Cost: number }>> | undefined;
    const previousMonthData = previousYearData?.[previousMonth];
    const products = Object.keys(monthData);
    let maxRevenue = 0, topProduct = "", minRevenue = Infinity, needsFocusProduct = "";
    products.forEach((product) => {
      const revenue = monthData[product].Revenue;
      if (revenue > maxRevenue) { maxRevenue = revenue; topProduct = product; }
      if (revenue < minRevenue) { minRevenue = revenue; needsFocusProduct = product; }
    });
    let percentageChange = 0, isIncrease = true;
    if (previousMonthData && previousMonthData[topProduct]) {
      const cur = monthData[topProduct].Revenue, prev = previousMonthData[topProduct].Revenue;
      if (prev !== 0) { percentageChange = ((cur - prev) / prev) * 100; isIncrease = percentageChange >= 0; }
    }
    const topProductData = monthData[topProduct];
    return { category: "Category", name: topProduct, revenue: `${topProductData.Revenue}k`, profit: `${topProductData.Profit}k`, needsFocus: needsFocusProduct, change: `${Math.abs(percentageChange).toFixed(0)}%`, isIncrease };
  }, [chartType, horizontalBarData, selectedFilters]);

  const calendarPeakAndActiveDay = useMemo(() => {
    const empty = { peakDay: { date: "", dayName: "", value: 0 }, mostActiveDay: { dayName: "", count: 0, average: 0 } };
    if (chartType !== "calendarheatmap" || !calendarheatmapData) return empty;
    const year = selectedFilters["SelectYear"] || "2026";
    const type = selectedFilters["SelectType"] || "Development";
    const project = selectedCalendarHeatmapProject;
    if (!calendarheatmapData[project]?.[year]?.[type]) return empty;
    const yearData = calendarheatmapData[project][year][type];
    let allDayData: { date: string; value: number; dayName: string }[] = [];
    const dayOfWeekCounts: Record<string, { total: number; count: number }> = { Sunday:{total:0,count:0},Monday:{total:0,count:0},Tuesday:{total:0,count:0},Wednesday:{total:0,count:0},Thursday:{total:0,count:0},Friday:{total:0,count:0},Saturday:{total:0,count:0} };
    Object.keys(yearData).forEach((monthName) => {
      const monthData = yearData[monthName];
      if (monthData?.data && Array.isArray(monthData.data)) {
        monthData.data.forEach((item: { date: string; value: number }) => {
          const [y, m, d] = item.date.split("-").map((n) => parseInt(n));
          const dateObj = new Date(y, m - 1, d);
          const dayNames = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
          const dayName = dayNames[dateObj.getDay()];
          allDayData.push({ date: item.date, value: item.value, dayName });
          if (dayOfWeekCounts[dayName]) { dayOfWeekCounts[dayName].total += item.value; dayOfWeekCounts[dayName].count += 1; }
        });
      }
    });
    let peakDay = { date: "", dayName: "", value: 0 };
    if (allDayData.length > 0) peakDay = allDayData.reduce((max, cur) => cur.value > max.value ? cur : max);
    let mostActiveDay = { dayName: "", count: 0, average: 0 };
    Object.entries(dayOfWeekCounts).forEach(([dayName, stats]) => {
      if (stats.count > 0) { const avg = stats.total / stats.count; if (avg > mostActiveDay.average) mostActiveDay = { dayName, count: stats.count, average: Math.round(avg) }; }
    });
    return { peakDay, mostActiveDay };
  }, [chartType, calendarheatmapData, selectedFilters, selectedCalendarHeatmapProject]);

  const formatPeakDate = (dateStr: string) => {
    if (!dateStr) return "Wed, 12 Jun";
    try { return new Date(dateStr).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }); }
    catch { return "Wed, 12 Jun"; }
  };

  const currentBulletData = useMemo(() => {
    if (!bulletData) return null;
    const year = selectedFilters.SelectYear || "2026";
    const month = selectedFilters.SelectMonth || "January";
    const type = selectedFilters.SelectType || "Sales";
    const yearData = (bulletData as any)[year];
    if (yearData) {
      const typeData = yearData[type];
      if (typeData) {
        const monthData = typeData[month];
        if (monthData?.bullets) return { title: monthData.title || bulletData.title, bullets: monthData.bullets };
      }
    }
    return { title: bulletData.title, bullets: bulletData.bullets };
  }, [bulletData, selectedFilters]);

  const currentKPIData = useMemo(() => {
    if (chartType !== "kpi" || !kpiData) return null;
    const kpiKey = selectedFilters["SelectKPI"];
    if (!kpiKey) return kpiData[Object.keys(kpiData)[0]] || null;
    return kpiData[kpiKey] || null;
  }, [chartType, kpiData, selectedFilters]);

  /* ==========================================================================
     RENDER CHART FUNCTION
     ========================================================================== */

  const renderChart = () => {
    switch (chartType) {
      case "pie": case "doughnut": case "line": case "area": case "bar":
        if (currentData) return <PieLineBarChart chartType={chartType as PieLineBarChartType} data={currentData} />;
        return null;
      case "bullet":
        if (currentBulletData) return <BulletChart title={currentBulletData.title} bullets={currentBulletData.bullets} />;
        return null;
      case "gauge": {
        if (gaugeData) {
          const sy = selectedFilters["SelectYear"] || "2026";
          const sm = selectedFilters["SelectMonth"] || "January";
          let currentGauge = gaugeData.gauges || [];
          if ((gaugeData as any)[sy]?.[sm]) currentGauge = (gaugeData as any)[sy][sm];
          return <GaugeChart title="Performance Metrics" gauges={currentGauge} />;
        }
        return null;
      }
      case "gantt": {
        if (currentGanttData) {
          const month = selectedFilters["SelectMonth"] || "Jan - Feb";
          const year = selectedFilters["SelectYear"] || "2026";
          return <GanttChart data={currentGanttData} selectedYear={year} selectedMonth={month} selectedProject={selectedGanttProject} onProjectChange={setSelectedGanttProject} />;
        }
        return null;
      }
      case "calendarheatmap": {
        if (calendarheatmapData?.[selectedCalendarHeatmapProject]) {
          const year = selectedFilters["SelectYear"] || "2026";
          const type = selectedFilters["SelectType"] || "Development";
          const projectData = calendarheatmapData[selectedCalendarHeatmapProject];
          const yearData = projectData[year];
          if (!yearData?.[type]) return null;
          return <CalendarHeatmapChart data={yearData[type]} selectedProject={selectedCalendarHeatmapProject} selectedYear={year} selectedType={type} onProjectChange={setSelectedCalendarHeatmapProject} calendarheatmapData={calendarheatmapData} />;
        }
        return null;
      }
      case "horizontalbar": {
        if (!horizontalBarData) return null;
        const sy = selectedFilters["SelectYear"] || "2026";
        const sm = selectedFilters["SelectMonth"] || "January";
        const sp = selectedFilters["SelectType"] || "Product 1";
        const yearData = horizontalBarData[sy] as Record<string, Record<string, { Revenue: number; Profit: number; Cost: number }>>;
        const monthData = yearData?.[sm];
        const productData = monthData?.[sp];
        const xAxisConfig = horizontalBarData.xAxis?.[sy];
        const bars: HorizontalBarItem[] = productData ? [
          { name: "Revenue", value: productData.Revenue, color: "rgba(23,97,163,1)" },
          { name: "Profit", value: productData.Profit, color: "rgba(70,194,155,1)" },
          { name: "Cost", value: productData.Cost, color: "rgba(47,164,169,1)" },
        ] : [];
        return <HorizontalBarChart title={horizontalBarData.title} bars={bars} selectedYear={sy} selectedMonth={sm} selectedType={sp} xAxisConfig={xAxisConfig} topPerformer={currentHorizontalBarTopPerformer} />;
      }
      case "columnchart": {
        if (!columnChartData) return null;
        const sy = selectedFilters["SelectYear"] || "2026";
        const sm = selectedFilters["SelectMonth"] || "January";
        const st = selectedFilters["SelectType"] || "Category A";
        const yearData = (columnChartData as any)?.[sy];
        const typeData = yearData?.[sm]?.[st] || [];
        const yAxisConfig = columnChartData.yAxis?.[sy];
        const columns: ColumnItem[] = typeData.map((item: any) => ({ name: item.name, value: item.value, gradient: item.gradient || "linear-gradient(180deg, rgba(77,175,131,1) 0%, rgba(23,97,163,1) 100%)" }));
        return <ColumnChart title={columnChartData.title} columns={columns} selectedYear={sy} selectedMonth={sm} selectedType={st} yAxisConfig={yAxisConfig} />;
      }
      case "lollipop": {
        if (!lollipopData) return null;
        const ly = selectedFilters["SelectYear"] || "2026";
        const lm = selectedFilters["SelectMonth"] || "January";
        const lc = selectedFilters["SelectType"] || "Category A";
        const lo = selectedFilters["SelectOrientation"] || "horizontal";
        const lYearData = ((lollipopData as any)[ly] || {}) as Record<string, Record<string, LollipopItem[]>>;
        const lCatData = lYearData?.[lm]?.[lc] || [];
        return <LollipopChart title={lollipopData.title} items={lCatData} selectedYear={ly} selectedMonth={lm} selectedCategory={lc} orientation={lo as "horizontal" | "vertical"} />;
      }
      case "kpi":
        if (currentKPIData) return <KPIChart data={currentKPIData} />;
        return null;
      case "riskgauge": {
        if (riskGaugeData) {
          const sy = selectedFilters["SelectYear"] || "2026";
          const sm = selectedFilters["SelectMonth"] || "January";
          const st = selectedFilters["SelectType"] || "Credit Score";
          let currentRiskGauges = riskGaugeData.gauges || [];
          if ((riskGaugeData as any)[sy]?.[sm]?.[st]) currentRiskGauges = (riskGaugeData as any)[sy][sm][st];
          return <RiskGaugeChart title="KPI Risk Assessment Metrics" gauges={currentRiskGauges} />;
        }
        return null;
      }
      case "groupbar": {
        if (!groupBarData) return null;
        const sy = selectedFilters["SelectYear"] || "2026";
        const sm = selectedFilters["SelectMonth"] || "January";
        const groups: GroupBarItem[] = (groupBarData as any)?.[sy]?.[sm] || [];
        const yAxisConfig = groupBarData.yAxis?.[sy];
        return <GroupBarChart title={groupBarData.title} groups={groups} legends={groupBarData.legends} selectedYear={sy} selectedMonth={sm} yAxisConfig={yAxisConfig} />;
      }
      case "stackbar": {
        if (!stackBarData) return null;
        const sy = selectedFilters["SelectYear"] || "2026";
        const sm = selectedFilters["SelectMonth"] || "January";
        const sw = selectedFilters["SelectWeek"] || "Week 1";
        const st = selectedFilters["SelectType"] || "Category A";
        const typeData = (stackBarData as any)?.[sy]?.[sm]?.[sw]?.[st] || [];
        const yAxisConfig = stackBarData.yAxis?.[sy];
        return <StackBarChart title={stackBarData.title} data={typeData} legends={stackBarData.legends} selectedYear={sy} selectedMonth={sm} selectedWeek={sw} selectedType={st} yAxisConfig={yAxisConfig} allData={stackBarData} />;
      }
      default:
        return null;
    }
  };

  /* ==========================================================================
     MAIN RENDER
     ========================================================================== */

  return (
    <div className="min-h-screen bg-white">

      {/* ===== TABS SECTION ===== */}
      <div className="bg-white p-4 sm:px-6 md:px-8">
        <div className="flex flex-wrap gap-2">
          {chartTypes.map((type) => {
            const isActive = chartType === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => { setChartType(type); onChartTypeChange?.(type); }}
                aria-pressed={isActive}
                className={`
                  relative px-4 py-2 text-xs font-medium transition-all duration-200 rounded-full outline-none border cursor-pointer
                  sm:px-6 sm:py-2.5 sm:text-sm
                  focus-visible:shadow-[0_0_0_2px_rgba(23,97,163,0.35)]
                  ${isActive
                    ? "text-white shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] border-[rgba(23,97,163,0.45)] bg-gradient-to-r from-[rgba(23,97,163,1)] to-[rgba(77,175,131,1)]"
                    : "text-[rgba(55,65,81,1)] border-transparent bg-transparent hover:border-[rgba(23,97,163,0.25)] hover:bg-[rgba(23,97,163,0.05)]"
                  }
                `}
              >
                {tabLabel(type)}
              </button>
            );
          })}
        </div>
      </div>

      {/* ===== FILTERS SECTION ===== */}
      <div className="p-4 relative z-50 sm:px-6 md:px-8">
        <div className="flex gap-3 items-end flex-wrap relative sm:gap-4">
          {(currentFilters as Filter[]).map((filter: Filter, index: number) => {
            const options: DropdownOption[] = filter.options.map((opt: string) => ({ key: opt, value: opt }));
            return (
              <div
                key={filter.id}
                className="relative"
                style={{ zIndex: 50 + ((currentFilters as Filter[]).length - index) }}
              >
                <ChartDropdown
                  options={options}
                  value={selectedFilters[filter.id]}
                  onSelect={(val) => onFiltersChange({ ...selectedFilters, [filter.id]: String(val) })}
                  variant="mahatiFilter"
                  label={filter.label}
                />
              </div>
            );
          })}
          <button
            type="button"
            onClick={() => onApplyFilters?.(selectedFilters)}
            className="w-[77px] h-[30px] rounded border border-[rgba(23,97,163,1)] bg-gradient-to-r from-[rgba(23,97,163,1)] to-[rgba(77,175,131,1)] text-white text-sm font-medium cursor-pointer transition-opacity hover:opacity-90"
          >
            Apply
          </button>
        </div>
      </div>

      {/* ===== CONTENT SECTION ===== */}
      <div className="p-4 overflow-y-visible sm:px-6 md:px-8">

        {/* ===== PIE/DOUGHNUT LAYOUT ===== */}
        {isPieFamily && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 sm:gap-6">
            {/* Chart Card */}
            <div className="rounded-[10px] border border-[rgba(23,97,163,1)] bg-[rgba(241,247,248,1)] p-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] overflow-visible sm:p-6">
              <div className="flex items-center justify-end mb-4">
                <MenuDotsButton />
              </div>
              <div className="h-48 p-2 rounded-2xl sm:h-56 md:h-64">
                {renderChart()}
              </div>
              <div className="mt-4 flex flex-col gap-2 text-sm sm:mt-6 sm:gap-3">
                {details.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <span className="w-4 h-2 rounded-sm flex-shrink-0 sm:w-5 sm:h-2.5" style={{ backgroundColor: colorToClass(item.color) }} />
                      <span className="text-[rgba(55,65,81,1)] text-[10px] overflow-hidden text-ellipsis whitespace-nowrap sm:text-xs">{item.label}</span>
                    </div>
                    <span className="font-semibold text-black text-xs ml-2 sm:text-sm">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Details Card */}
            <div className="rounded-[10px] border border-[rgba(23,97,163,1)] bg-[rgba(241,247,248,1)] p-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] sm:p-6">
              <h3 className="text-base font-semibold text-[rgba(17,24,39,1)] mb-4 sm:text-lg sm:mb-6">Details</h3>
              <div className="flex flex-col gap-3 sm:gap-5">
                {details.map((item, idx) => {
                  const statusColors = item.status ? getStatusColors(item.status) : null;
                  return (
                    <div key={idx} className="flex items-start gap-2 sm:gap-3">
                      <span className="inline-block flex-shrink-0 w-[18px] h-[10px] rounded-sm" style={{ backgroundColor: colorToClass(item.color) }} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <div className="font-semibold text-[rgba(17,24,39,1)] text-xs overflow-hidden text-ellipsis whitespace-nowrap sm:text-sm">{item.label}</div>
                          {item.status && statusColors && (
                            <div className="flex items-center justify-center w-12 h-4 rounded px-1 py-0.5" style={{ backgroundColor: statusColors.backgroundColor }}>
                              <span className="font-[Poppins,sans-serif] font-semibold whitespace-nowrap text-[6px]" style={{ color: statusColors.textColor }}>{item.status}</span>
                            </div>
                          )}
                        </div>
                        <div className="text-[10px] text-[rgba(107,114,128,1)] mt-0.5 line-clamp-2 sm:text-xs">{item.description}</div>
                      </div>
                      <div className="font-bold text-[rgba(17,24,39,1)] text-xs ml-2 sm:text-sm">{item.value}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-col gap-3 md:col-span-2 lg:col-span-1 sm:gap-4">
              <div className="rounded-[10px] border border-[rgba(23,97,163,1)] bg-[rgba(241,247,248,1)] p-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] sm:p-6">
                <div className="text-[rgba(31,41,55,1)] font-semibold text-xs sm:text-sm">Total Volume</div>
                <div className="text-2xl font-bold text-[rgba(17,24,39,1)] mt-3 sm:text-[30px] sm:mt-4">{quickStats.totalVolume.value}</div>
                <div className={`text-xs font-medium mt-1 sm:text-sm ${quickStats.totalVolume.change.startsWith("+") ? "text-[rgba(22,163,74,1)]" : "text-[rgba(220,38,38,1)]"}`}>{quickStats.totalVolume.change}</div>
                <div className="text-[10px] text-[rgba(107,114,128,1)] mt-2 sm:text-xs">{quickStats.totalVolume.description}</div>
              </div>
              <div className="rounded-[10px] border border-[rgba(23,97,163,1)] bg-[rgba(241,247,248,1)] p-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] sm:p-6">
                <div className="text-[rgba(31,41,55,1)] font-semibold text-xs sm:text-sm">Transactions</div>
                <div className="text-2xl font-bold text-[rgba(17,24,39,1)] mt-3 sm:text-[30px] sm:mt-4">{quickStats.transactions.value}</div>
                <div className="text-[10px] text-[rgba(107,114,128,1)] mt-2 sm:text-xs">{quickStats.transactions.description}</div>
              </div>
            </div>
          </div>
        )}

        {/* ===== BULLET CHART LAYOUT ===== */}
        {chartType === "bullet" && (
          <div className="grid grid-cols-1 gap-4 max-w-full lg:grid-cols-[minmax(0,1fr)_minmax(0,276px)] lg:gap-0 sm:gap-6">
            <div className="w-full min-h-[350px] rounded-[10px] border border-[rgba(23,97,163,1)] bg-[rgba(241,247,248,1)] p-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] overflow-hidden sm:p-[22px_30px_55px_30px] sm:min-h-[383px]">
              <div className="h-full flex flex-col">{renderChart()}</div>
            </div>
            <div className="flex flex-col gap-4 w-full lg:max-w-[276px] sm:gap-6">
              {/* Details sidebar card */}
              <div className="w-full rounded-[10px] border border-[rgba(23,97,163,1)] bg-[rgba(241,247,248,1)] p-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] sm:p-[29px]">
                <h3 className="text-xs font-semibold text-[rgba(17,24,39,1)] mb-3 sm:text-sm sm:mb-4">Details</h3>
                <div>
                  {currentBulletData?.bullets.map((bullet: any, idx: number) => {
                    const percentage = Math.round((bullet.achieved / bullet.target) * 100);
                    const getBadgeBg = (name: string) => {
                      const n = name.toLowerCase();
                      if (n.includes("revenue")) return "rgba(70,194,155,0.15)";
                      if (n.includes("profit")) return "rgba(239,68,68,0.15)";
                      if (n.includes("customer")) return "rgba(23,97,163,0.15)";
                      return "rgba(229,231,235,1)";
                    };
                    return (
                      <div key={idx} className="flex justify-between items-center py-3 not-last:border-b border-[rgba(229,231,235,1)]">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-medium text-[rgba(17,24,39,1)]">{bullet.name}</span>
                          <span className="text-xs text-[rgba(107,114,128,1)]">{bullet.achieved.toLocaleString()} / {bullet.target.toLocaleString()}</span>
                        </div>
                        <div className="px-2 py-1 rounded text-sm font-medium" style={{ backgroundColor: getBadgeBg(bullet.name) }}>{percentage}%</div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-start gap-2 pt-4 mt-4 border-t border-[rgba(229,231,235,1)]">
                  <div className="w-4 h-4 rounded-full bg-[rgba(96,165,250,1)] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[10px] font-bold text-white">i</span>
                  </div>
                  <p className="text-xs text-[rgba(107,114,128,1)] m-0 leading-relaxed">Suggested Actions: <span className="font-semibold text-[rgba(17,24,39,1)]">Optimizing pricing or reduce operational costs.</span></p>
                </div>
              </div>
              {/* Quick Insights */}
              <QuickInsightsCard
                totalVolume="$33,850.00"
                peakIconSrc={getIconSrc(performancePeakIcon, FALLBACK_ICONS.performancePeakIcon)}
                peakDate="Wed, 12 Jun"
                peakEvents="5,600 events"
                calendarIconSrc={getIconSrc(calendarIcon, FALLBACK_ICONS.calendarIcon)}
                activeDayLabel="Most Active Day"
                activeDayValue="Wednesday"
                activeAvg="Avg 920 / day"
                dateLabel={new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              />
            </div>
          </div>
        )}

        {/* ===== GAUGE CHART LAYOUT ===== */}
        {chartType === "gauge" && gaugeData && (
          <div className="grid grid-cols-1 gap-4 max-w-full lg:grid-cols-[minmax(0,1fr)_minmax(0,276px)] lg:gap-0 sm:gap-6">
            <div className="w-full min-h-[350px] rounded-[10px] border border-[rgba(23,97,163,1)] bg-[rgba(241,247,248,1)] p-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] overflow-hidden sm:p-[22px_30px_55px_30px] sm:min-h-[383px]">
              <div className="h-full flex flex-col">{renderChart()}</div>
            </div>
            <div className="flex flex-col gap-4 w-full lg:max-w-[276px] sm:gap-6">
              {(() => {
                const sy = selectedFilters["SelectYear"] || "2026";
                const sm2 = selectedFilters["SelectMonth"] || "January";
                let currentGauge = gaugeData.gauges?.length > 0 ? gaugeData.gauges[0] : null;
                if (gaugeData[sy]?.[sm2]?.length > 0) currentGauge = gaugeData[sy][sm2][0];
                if (!currentGauge) return null;
                const gauge = currentGauge;
                const dailyAvgNeeded = Math.round(gauge.value / 30);
                const currentPace = 360;
                const daysRemaining = 8;
                const yearNum = parseInt(sy);
                const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
                const monthIndex = monthNames.indexOf(sm2);
                const lastDayOfMonth = new Date(yearNum, monthIndex + 1, 0);
                const lastDay = lastDayOfMonth.getDate();
                const lastDayWeekday = lastDayOfMonth.getDay();
                let lastFriday = lastDayWeekday === 5 ? lastDay : lastDayWeekday < 5 ? lastDay - (lastDayWeekday + 2) : lastDay - 1;
                const formattedDate = new Date(yearNum, monthIndex, lastFriday).toLocaleDateString("en-US", { month: "short", day: "numeric" });
                return (
                  <div className="w-full rounded-[10px] border border-[rgba(23,97,163,1)] bg-[rgba(241,247,248,1)] p-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] sm:p-[29px]">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-[rgba(17,24,39,1)]">Goal Health</h3>
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] font-medium text-[rgba(46,158,120,1)]">On Track</span>
                        <button className="w-4 h-4 flex items-center justify-center text-[rgba(156,163,175,1)] bg-transparent border-none cursor-pointer hover:text-[rgba(75,85,99,1)]">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="4" r="1"/><circle cx="8" cy="8" r="1"/><circle cx="8" cy="12" r="1"/></svg>
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      {[["Current Pace", `${currentPace} / day`], ["Required Pace", `${dailyAvgNeeded} / day`], ["Days Remaining", `${daysRemaining} days`], ["Expected Finish", formattedDate]].map(([label, value]) => (
                        <div key={label}>
                          <div className="text-[10px] text-[rgba(107,114,128,1)] mb-1">{label}</div>
                          <div className="text-sm font-semibold text-[rgba(17,24,39,1)]">{value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
              <QuickInsightsCard
                totalVolume="$33,850.00"
                peakIconSrc={getIconSrc(performancePeakIcon, FALLBACK_ICONS.performancePeakIcon)}
                peakDate="Wed, 12 Jun"
                peakEvents="5,600 events"
                calendarIconSrc={getIconSrc(calendarIcon, FALLBACK_ICONS.calendarIcon)}
                activeDayLabel="Most Active Day"
                activeDayValue="Wednesday"
                activeAvg="Avg 920 / day"
                dateLabel={new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              />
            </div>
          </div>
        )}

        {/* ===== RISK GAUGE CHART LAYOUT ===== */}
        {chartType === "riskgauge" && riskGaugeData && (
          <div className="grid grid-cols-1 gap-4 max-w-full lg:grid-cols-[minmax(0,1fr)_minmax(0,276px)] lg:gap-0 sm:gap-6">
            <div className="w-full min-h-[350px] rounded-[10px] border border-[rgba(23,97,163,1)] bg-[rgba(241,247,248,1)] p-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] overflow-hidden sm:p-[22px_30px_55px_30px] sm:min-h-[383px]">
              <div className="h-full flex flex-col">{renderChart()}</div>
            </div>
            <div className="flex flex-col gap-4 w-full lg:max-w-[276px] sm:gap-6">
              {(() => {
                const sy = selectedFilters["SelectYear"] || "2026";
                const sm2 = selectedFilters["SelectMonth"] || "January";
                const st = selectedFilters["SelectType"] || "Credit Score";
                let currentRiskGauge = riskGaugeData.gauges?.length > 0 ? riskGaugeData.gauges[0] : null;
                if ((riskGaugeData as any)[sy]?.[sm2]?.[st]?.length > 0) currentRiskGauge = (riskGaugeData as any)[sy][sm2][st][0];
                if (!currentRiskGauge) return null;
                const gauge = currentRiskGauge;
                const maxScore = gauge.max || 100;
                const dailyAvgNeeded = Math.round(gauge.score / 30);
                const currentPace = Math.round(gauge.score / 20);
                return (
                  <div className="w-full rounded-[10px] border border-[rgba(23,97,163,1)] bg-[rgba(241,247,248,1)] p-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] sm:p-[29px]">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-[rgba(17,24,39,1)]">Risk Health</h3>
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] font-medium text-[rgba(46,158,120,1)]">On Track</span>
                        <button className="w-4 h-4 flex items-center justify-center text-[rgba(156,163,175,1)] bg-transparent border-none cursor-pointer hover:text-[rgba(75,85,99,1)]">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="4" r="1"/><circle cx="8" cy="8" r="1"/><circle cx="8" cy="12" r="1"/></svg>
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {[["Current Pace", `${currentPace} / day`], ["Required Pace", `${dailyAvgNeeded} / day`], ["Days Remaining", "8 days"], ["Max Score", String(maxScore)]].map(([label, value]) => (
                        <div key={label}>
                          <div className="text-[10px] text-[rgba(107,114,128,1)] mb-1">{label}</div>
                          <div className="text-sm font-semibold text-[rgba(17,24,39,1)]">{value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
              {/* Risk gauge quick insights - dynamic */}
              <div className="w-[276px] h-[191px] rounded-[10px] border border-[rgba(23,97,163,1)] bg-[rgba(241,247,248,1)] shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] relative">
                <div className="absolute top-[17px] left-[19px] right-[17px] flex items-center justify-between">
                  <div className="text-black font-[Poppins,sans-serif] text-xs font-semibold">Quick Insights</div>
                  <div className="text-[rgba(94,94,94,1)] font-[Poppins,sans-serif] text-[10px] font-medium">{`${selectedFilters["SelectYear"]||"2026"} : ${selectedFilters["SelectMonth"]||"January"}`}</div>
                </div>
                <div className="absolute top-[57px] left-[18px] text-black font-[Poppins,sans-serif] text-xs font-semibold">Risk Score</div>
                <div className="absolute top-[80px] left-[18px] text-black font-[Poppins,sans-serif] text-lg font-semibold">
                  {(riskGaugeData as any)?.[selectedFilters["SelectYear"]||"2026"]?.[selectedFilters["SelectMonth"]||"January"]?.[selectedFilters["SelectType"]||"Credit Score"]?.[0]?.score || 0}
                </div>
                <div className="absolute top-[119px] left-[19px] right-[19px] h-px bg-[rgba(77,175,131,0.2)]" />
                <div className="absolute top-[137px] left-[19px] w-5 h-5 rounded bg-[rgba(23,97,163,1)]">
                  <img src={getIconSrc(performancePeakIcon, FALLBACK_ICONS.performancePeakIcon)} alt="" className="absolute top-1 left-1 w-3 h-3 object-cover" />
                </div>
                <div className="absolute top-[134px] left-[48px] text-[rgba(23,97,163,1)] font-[Poppins,sans-serif] text-[8px] font-medium">Peak Performance</div>
                <div className="absolute top-[146px] left-[48px] text-black font-[Poppins,sans-serif] text-[10px] font-semibold">N/A</div>
                <div className="absolute top-[161px] left-[48px] text-[rgba(94,94,94,1)] font-[Poppins,sans-serif] text-[8px] font-medium">No data</div>
                <div className="absolute top-[137px] left-[164px] w-5 h-5 rounded bg-[rgba(23,97,163,1)]">
                  <img src={getIconSrc(calendarIcon, FALLBACK_ICONS.calendarIcon)} alt="" className="absolute top-1 left-1 w-[10px] h-[10px] object-cover" />
                </div>
                <div className="absolute top-[134px] left-[193px] text-[rgba(23,97,163,1)] font-[Poppins,sans-serif] text-[8px] font-medium">Assessment Day</div>
                <div className="absolute top-[146px] left-[193px] text-black font-[Poppins,sans-serif] text-[10px] font-semibold">Wednesday</div>
                <div className="absolute top-[161px] left-[193px] text-[rgba(94,94,94,1)] font-[Poppins,sans-serif] text-[8px] font-medium">Avg Score: 0</div>
              </div>
            </div>
          </div>
        )}

        {/* ===== GANTT CHART LAYOUT ===== */}
        {chartType === "gantt" && (
          <div className="grid grid-cols-1 gap-4 max-w-full overflow-hidden lg:grid-cols-[minmax(0,1fr)_minmax(0,205px)] lg:gap-1 sm:gap-6">
            <div className="rounded-[10px] border border-[rgba(23,97,163,1)] bg-[rgba(241,247,248,1)] p-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] overflow-x-auto sm:p-3 sm:min-h-[400px] lg:overflow-x-hidden lg:p-[22px_30px_55px_30px] lg:min-h-[383px]">
              <div className="h-full flex flex-col min-w-[650px] w-full lg:min-w-0">
                {renderChart()}
              </div>
            </div>
            <div className="flex flex-col gap-3 w-full min-w-0 lg:max-w-[205px]">
              {/* Quick Insights */}
              <div className="w-full rounded-[10px] border border-[rgba(23,97,163,1)] bg-[rgba(241,247,248,1)] p-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] max-h-[400px] overflow-y-auto sm:p-[29px]">
                <h3 className="text-xs font-semibold text-[rgba(17,24,39,1)] mb-3 sticky top-0 bg-[rgba(241,247,248,1)] pb-2 sm:text-sm sm:mb-4">Quick Insights - All Titles</h3>
                <div className="text-[9px] text-[rgba(75,85,99,1)] mb-3 sticky top-5 bg-[rgba(241,247,248,1)] pb-1 sm:text-[10px]">Showing data for: {selectedGanttProject}</div>
                <div className="flex flex-col gap-2 sm:gap-3">
                  {currentGanttData?.tasks.map((task) => {
                    const taskColor = GANTT_COLORS[task.color] || GANTT_COLORS.blue;
                    return (
                      <div key={task.id} className="flex items-center gap-2 pb-2 border-b border-[rgba(229,231,235,1)] last:border-none">
                        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: taskColor }} />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-[rgba(17,24,39,1)] text-[10px] overflow-hidden text-ellipsis whitespace-nowrap sm:text-xs">{task.name}</div>
                          <div className="text-[8px] text-[rgba(107,114,128,1)] mt-0.5">{task.progress}% complete</div>
                        </div>
                        <div className="text-[8px] font-semibold px-2 py-0.5 rounded whitespace-nowrap" style={{ backgroundColor: getStatusColors(task.status).backgroundColor, color: getStatusColors(task.status).textColor }}>{task.status}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* Project Summary */}
              <div className="w-full rounded-[10px] border border-[rgba(23,97,163,1)] bg-[rgba(241,247,248,1)] p-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] sm:p-[29px]">
                <h3 className="text-xs font-semibold text-[rgba(17,24,39,1)] mb-3 sm:text-sm sm:mb-4">Project Summary</h3>
                <div className="flex flex-col gap-2 sm:gap-3">
                  <div className="text-[9px] text-[rgba(75,85,99,1)] mb-2 sm:text-[10px]">Overall Status</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-[rgba(254,242,242,1)] p-2 rounded"><div className="text-[rgba(220,38,38,1)] text-[10px] font-semibold sm:text-xs">Overdue</div><div className="text-base font-bold text-[rgba(17,24,39,1)] sm:text-lg">{currentGanttData?.tasks.filter(t => t.status === "Overdue").length || 0}</div></div>
                    <div className="bg-[rgba(239,246,255,1)] p-2 rounded"><div className="text-[rgba(37,99,235,1)] text-[10px] font-semibold sm:text-xs">In Progress</div><div className="text-base font-bold text-[rgba(17,24,39,1)] sm:text-lg">{currentGanttData?.tasks.filter(t => t.status === "In Progress").length || 0}</div></div>
                  </div>
                  <div className="grid grid-cols-1 gap-2 mt-2">
                    <div className="bg-[rgba(240,253,244,1)] p-2 rounded"><div className="text-[rgba(22,163,74,1)] text-[10px] font-semibold sm:text-xs">On Target</div><div className="text-base font-bold text-[rgba(17,24,39,1)] sm:text-lg">{currentGanttData?.tasks.filter(t => t.status === "On Target").length || 0}</div></div>
                  </div>
                  <div className="text-[9px] text-[rgba(107,114,128,1)] mt-2 sm:text-[10px] sm:mt-3">
                    {(() => {
                      if (!currentGanttData?.tasks?.length) return "Expected by 25 Feb 2025";
                      const lastTask = currentGanttData.tasks[currentGanttData.tasks.length - 1];
                      const [day, month] = lastTask.endDate.split("/");
                      const monthNames: Record<string, string> = {"01":"Jan","02":"Feb","03":"Mar","04":"Apr","05":"May","06":"Jun","07":"Jul","08":"Aug","09":"Sep","10":"Oct","11":"Nov","12":"Dec"};
                      return `Expected by ${day} ${monthNames[month] || "Jan"} ${selectedFilters["SelectYear"] || "2026"}`;
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===== CALENDAR HEATMAP LAYOUT ===== */}
        {chartType === "calendarheatmap" && (
          <div className="grid grid-cols-1 gap-4 max-w-full overflow-hidden lg:grid-cols-[minmax(0,1fr)_minmax(0,280px)] lg:gap-0 sm:gap-6">
            <div className="rounded-[10px] border border-[rgba(23,97,163,1)] bg-[rgba(241,247,248,1)] p-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] overflow-x-auto lg:overflow-x-hidden sm:p-[22px_30px_55px_30px] sm:min-h-[383px]">
              <div className="h-full flex flex-col min-w-[750px] w-full lg:min-w-0">{renderChart()}</div>
            </div>
            <div className="flex flex-col gap-3 w-full min-w-0 lg:max-w-[280px]">
              {/* Activity Legend */}
              <div className="w-full rounded-[10px] border border-[rgba(23,97,163,1)] bg-[rgba(241,247,248,1)] p-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] sm:p-[29px]">
                <h3 className="text-xs font-semibold text-[rgba(17,24,39,1)] mb-3 sm:text-sm sm:mb-4">Activity Legend</h3>
                <div className="flex flex-col gap-2">
                  {[["rgba(154,219,255,1)","<1K: Low activity"],["rgba(102,194,241,1)","1K - 3K: Moderate activity"],["rgba(43,160,209,1)","3K - 5K: High activity"],["rgba(23,97,163,1)",">5K: Very high activity"]].map(([color, label]) => (
                    <div key={label} className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-sm flex-shrink-0" style={{ backgroundColor: color }} />
                      <span className="text-[10px] text-[rgba(55,65,81,1)] whitespace-nowrap sm:text-xs">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Calendar Quick Insights */}
              <div className="w-full max-w-[280px] min-h-[210px] rounded-[10px] border border-[rgba(23,97,163,1)] bg-[rgba(241,247,248,1)] shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] p-3 flex flex-col gap-3">
                <div className="flex items-center justify-between w-full">
                  <div className="text-black font-[Poppins,sans-serif] text-[11px] font-semibold">Quick Insights</div>
                  <div className="text-[rgba(94,94,94,1)] font-[Poppins,sans-serif] text-[8px] font-medium text-right">{selectedFilters["SelectYear"]||"2026"}, {selectedCalendarHeatmapProject}, {selectedFilters["SelectType"]||"Development"}</div>
                </div>
                <div>
                  <div className="text-black font-[Poppins,sans-serif] text-[11px] font-semibold">Total Volume</div>
                  <div className="text-black font-[Poppins,sans-serif] text-[17px] font-semibold mt-2">${quickStats.totalVolume.value}</div>
                </div>
                <div className="w-full h-px bg-[rgba(77,175,131,0.2)]" />
                <div className="flex items-start gap-2 w-full">
                  <div className="w-[18px] h-[18px] rounded bg-[rgba(23,97,163,1)] flex items-center justify-center flex-shrink-0">
                    <img src={getIconSrc(performancePeakIcon, FALLBACK_ICONS.performancePeakIcon)} alt="" className="w-[11px] h-[11px] object-cover" />
                  </div>
                  <div className="flex flex-col gap-1 flex-1">
                    <div className="text-[rgba(23,97,163,1)] font-[Poppins,sans-serif] text-[7.5px] font-medium whitespace-nowrap">Peak Day</div>
                    <div className="text-black font-[Poppins,sans-serif] text-[9px] font-semibold whitespace-nowrap">{formatPeakDate(calendarPeakAndActiveDay.peakDay.date)}</div>
                    <div className="text-[rgba(94,94,94,1)] font-[Poppins,sans-serif] text-[7.5px] font-medium whitespace-nowrap">{calendarPeakAndActiveDay.peakDay.value ? `${calendarPeakAndActiveDay.peakDay.value.toLocaleString()} events` : "5,600 events"}</div>
                  </div>
                </div>
                <div className="flex items-start gap-2 w-full">
                  <div className="w-[18px] h-[18px] rounded bg-[rgba(23,97,163,1)] flex items-center justify-center flex-shrink-0">
                    <img src={getIconSrc(calendarIcon, FALLBACK_ICONS.calendarIcon)} alt="" className="w-[10px] h-[10px] object-cover" />
                  </div>
                  <div className="flex flex-col gap-1 flex-1">
                    <div className="text-[rgba(23,97,163,1)] font-[Poppins,sans-serif] text-[7.5px] font-medium whitespace-nowrap">Most Active Day</div>
                    <div className="text-black font-[Poppins,sans-serif] text-[9px] font-semibold whitespace-nowrap">{calendarPeakAndActiveDay.mostActiveDay.dayName || "Wednesday"}</div>
                    <div className="text-[rgba(94,94,94,1)] font-[Poppins,sans-serif] text-[7.5px] font-medium whitespace-nowrap">Avg {calendarPeakAndActiveDay.mostActiveDay.average || 920} / day</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===== HORIZONTAL BAR LAYOUT ===== */}
        {chartType === "horizontalbar" && (
          <div className="grid grid-cols-1 gap-4 max-w-full lg:grid-cols-[minmax(0,1fr)_minmax(0,276px)] lg:gap-0 sm:gap-6">
            <div className="w-full min-h-[350px] rounded-[10px] border border-[rgba(23,97,163,1)] bg-[rgba(241,247,248,1)] p-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] overflow-hidden sm:p-[22px_30px_55px_30px] sm:min-h-[383px]">
              <div className="h-full flex flex-col">{renderChart()}</div>
            </div>
            <div className="flex flex-col gap-4 w-full lg:max-w-[276px] sm:gap-6">
              <div className="w-full rounded-[10px] border border-[rgba(23,97,163,1)] bg-[rgba(241,247,248,1)] p-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] sm:p-[29px]">
                <h3 className="text-xs font-semibold text-[rgba(17,24,39,1)] mb-3 sm:text-sm sm:mb-4">Demo Legends</h3>
                <div className="flex flex-col gap-2 sm:gap-3">
                  {[["rgba(23,97,163,1)","Revenue"],["rgba(70,194,155,1)","Profit"],["rgba(47,164,169,1)","Cost"]].map(([color, label]) => (
                    <div key={label} className="flex items-center gap-2">
                      <div className="w-[14px] h-3 rounded bg-transparent flex-shrink-0" style={{ backgroundColor: color }} />
                      <span className="text-[10px] text-[rgba(55,65,81,1)] sm:text-xs">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
              {currentHorizontalBarTopPerformer && <TopPerformerCard performer={currentHorizontalBarTopPerformer} />}
            </div>
          </div>
        )}

        {/* ===== COLUMN CHART LAYOUT ===== */}
        {chartType === "columnchart" && (
          <div className="grid grid-cols-1 gap-4 max-w-full lg:grid-cols-[minmax(0,1fr)_minmax(0,276px)] lg:gap-0 sm:gap-6">
            <div className="w-full min-h-[350px] rounded-[10px] border border-[rgba(23,97,163,1)] bg-[rgba(241,247,248,1)] p-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] overflow-hidden sm:p-[22px_30px_55px_30px] sm:min-h-[383px]">
              <div className="h-full flex flex-col">{renderChart()}</div>
            </div>
            <div className="flex flex-col gap-4 w-full lg:max-w-[276px] sm:gap-6">
              {/* Top Category Card */}
              <div className="w-full rounded-[10px] border border-[rgba(23,97,163,1)] bg-[rgba(241,247,248,1)] p-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] sm:p-[29px]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-semibold text-[rgba(17,24,39,1)] sm:text-sm">Top Category</h3>
                  <div className="flex items-center bg-[rgba(77,175,131,0.15)] px-3 py-1 rounded-xl text-[10px] font-semibold text-[rgba(77,175,131,1)] font-[Poppins,sans-serif]">Leading</div>
                </div>
                {(() => {
                  if (!columnChartData) return null;
                  const sy = selectedFilters["SelectYear"] || "2026";
                  const sm2 = selectedFilters["SelectMonth"] || "January";
                  const st = selectedFilters["SelectType"] || "Category A";
                  const typeData = (columnChartData as any)?.[sy]?.[sm2]?.[st] || [];
                  if (!typeData.length) return null;
                  const topPerformer = typeData.reduce((max: any, item: any) => item.value > max.value ? item : max, typeData[0]);
                  const totalRevenue = typeData.reduce((sum: number, item: any) => sum + item.value, 0);
                  const contribution = totalRevenue > 0 ? Math.round((topPerformer.value / totalRevenue) * 100) : 0;
                  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
                  const ci = monthNames.indexOf(sm2);
                  const prevMonth = ci > 0 ? monthNames[ci - 1] : "December";
                  const prevYear = ci > 0 ? sy : String(Number(sy) - 1);
                  const prevTypeData = (columnChartData as any)?.[prevYear]?.[prevMonth]?.[st] || [];
                  const prevTop = prevTypeData.find((i: any) => i.name === topPerformer.name);
                  const growth = prevTop?.value > 0 ? Math.round(((topPerformer.value - prevTop.value) / prevTop.value) * 100) : 14;
                  const rank = [...typeData].sort((a: any, b: any) => b.value - a.value).findIndex((i: any) => i.name === topPerformer.name) + 1;
                  return (
                    <>
                      <div className="text-base font-semibold text-[rgba(23,97,163,1)] font-[Poppins,sans-serif] mb-5">{topPerformer.name}</div>
                      <div className="grid grid-cols-2 gap-3">
                        {[["Revenue", topPerformer.value >= 1000 ? `${(topPerformer.value/1000).toFixed(1)}k` : topPerformer.value, undefined], ["Contribution", `${contribution}%`, undefined], ["Growth", `${growth>=0?"+":""}${growth}%`, growth>=0?"rgba(46,158,120,1)":"rgba(220,38,38,1)"], ["Rank", `#${rank}`, undefined]].map(([label, value, color]) => (
                          <div key={String(label)}>
                            <div className="text-[9px] text-[rgba(107,114,128,1)]">{label}</div>
                            <div className="text-sm font-semibold" style={{ color: color as string || "rgba(17,24,39,1)" }}>{String(value)}</div>
                          </div>
                        ))}
                      </div>
                    </>
                  );
                })()}
              </div>
              {/* Quick Insights Card */}
              <div className="flex-1 w-full rounded-[10px] border border-[rgba(23,97,163,1)] bg-[rgba(241,247,248,1)] p-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] flex flex-col justify-center sm:p-[29px]">
                <div className="flex justify-between items-center mb-10">
                  <h3 className="text-xs font-semibold text-[rgba(17,24,39,1)] sm:text-sm">Quick Insights</h3>
                  <div className="text-[10px] text-[rgba(107,114,128,1)] font-[Poppins,sans-serif] font-medium">{selectedFilters["SelectMonth"]||"January"} {selectedFilters["SelectYear"]||"2026"}</div>
                </div>
                <div className="text-xs font-semibold text-[rgba(17,24,39,1)] mb-8 font-[Poppins,sans-serif]">Total Volume</div>
                {(() => {
                  if (!columnChartData) return null;
                  const sy = selectedFilters["SelectYear"] || "2026";
                  const sm2 = selectedFilters["SelectMonth"] || "January";
                  const st = selectedFilters["SelectType"] || "Category A";
                  const typeData = (columnChartData as any)?.[sy]?.[sm2]?.[st] || [];
                  const currentTotal = typeData.reduce((sum: number, item: any) => sum + item.value, 0);
                  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
                  const ci = monthNames.indexOf(sm2);
                  const prevMonth = ci > 0 ? monthNames[ci-1] : "December";
                  const prevYear = ci > 0 ? sy : String(Number(sy)-1);
                  const prevTypeData = (columnChartData as any)?.[prevYear]?.[prevMonth]?.[st] || [];
                  const prevTotal = prevTypeData.reduce((sum: number, item: any) => sum + item.value, 0);
                  const pctChange = prevTotal > 0 ? Math.round(((currentTotal - prevTotal) / prevTotal) * 100) : 0;
                  const isIncrease = pctChange >= 0;
                  const bgColor = isIncrease ? "rgba(209,250,229,1)" : "rgba(254,226,226,1)";
                  const textColor = isIncrease ? "rgba(5,150,105,1)" : "rgba(220,38,38,1)";
                  return (
                    <div className="flex items-center gap-3">
                      <div className="text-2xl font-bold text-[rgba(17,24,39,1)] font-[Poppins,sans-serif] tracking-tight">${currentTotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                      <div className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md flex-shrink-0" style={{ background: bgColor }}>
                        <img src={isIncrease ? getIconSrc(increaseIcon, FALLBACK_ICONS.increaseIcon) : getIconSrc(decreaseIcon, FALLBACK_ICONS.decreaseIcon)} alt={isIncrease ? "increase" : "decrease"} className="w-3.5 h-3.5 object-contain" />
                        <span className="text-xs font-semibold font-[Poppins,sans-serif]" style={{ color: textColor }}>{Math.abs(pctChange)}%</span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        )}

        {/* ===== GROUP BAR CHART LAYOUT ===== */}
        {chartType === "groupbar" && (
          <div className="grid grid-cols-1 gap-4 max-w-full lg:grid-cols-[minmax(0,1fr)_minmax(0,276px)] lg:gap-0 sm:gap-6">
            <div className="w-full min-h-[350px] rounded-[10px] border border-[rgba(23,97,163,1)] bg-[rgba(241,247,248,1)] p-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] overflow-hidden sm:p-[22px_30px_55px_30px] sm:min-h-[383px]">
              <div className="h-full flex flex-col">{renderChart()}</div>
            </div>
            <div className="flex flex-col gap-4 w-full lg:max-w-[276px] sm:gap-6">
              {/* Legends */}
              {(() => {
                if (!groupBarData) return null;
                const legends: GroupBarLegendItem[] = groupBarData.legends || [];
                const defaultLegends = [["rgba(23,97,163,1)","Revenue"],["rgba(77,175,131,1)","Profit"],["rgba(220,38,38,1)","Loss"],["rgba(47,164,169,1)","Cost"]];
                return (
                  <div className="w-full rounded-[10px] border border-[rgba(23,97,163,1)] bg-[rgba(241,247,248,1)] p-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] sm:p-[29px]">
                    <h3 className="text-xs font-semibold text-[rgba(17,24,39,1)] mb-3 sm:text-sm sm:mb-4">Legends</h3>
                    <div className="flex flex-col h-[130px] gap-4 sm:gap-5">
                      {legends.length > 0
                        ? legends.map((legend, i) => (
                          <div key={legend.key || i} className="flex items-center gap-2">
                            <div className="w-[14px] h-3 rounded flex-shrink-0" style={{ backgroundColor: legend.color }} />
                            <span className="text-[10px] text-[rgba(55,65,81,1)] sm:text-xs">{legend.label}</span>
                          </div>
                        ))
                        : defaultLegends.map(([color, label]) => (
                          <div key={label} className="flex items-center gap-2">
                            <div className="w-[14px] h-3 rounded flex-shrink-0" style={{ backgroundColor: color }} />
                            <span className="text-[10px] text-[rgba(55,65,81,1)] sm:text-xs">{label}</span>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                );
              })()}
              {/* Top Performer */}
              {(() => {
                if (!groupBarData) return null;
                const sy = selectedFilters["SelectYear"] || "2026";
                const sm2 = selectedFilters["SelectMonth"] || "January";
                const groups: GroupBarItem[] = (groupBarData as any)?.[sy]?.[sm2] || [];
                if (!groups.length) return null;
                const legends: GroupBarLegendItem[] = groupBarData.legends || [];
                const getColor = (key: string, fallback: string) => legends.find(l => l.key === key)?.color || fallback;
                const revenueColor = getColor("revenue", "rgba(37,99,235,1)");
                const profitColor = getColor("profit", "rgba(77,175,131,1)");
                const lossColor = getColor("loss", "rgba(220,38,38,1)");
                const getProfitOrLoss = (g: GroupBarItem) => g.profitOrLoss !== undefined && g.profitOrLoss !== null ? g.profitOrLoss : g.revenue - g.cost;
                const topPerformer = groups.reduce((max, item) => item.revenue > max.revenue ? item : max, groups[0]);
                const topPL = getProfitOrLoss(topPerformer);
                const isTopProfitable = topPL >= 0;
                const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
                const ci = monthNames.indexOf(sm2);
                const prevMonth = ci > 0 ? monthNames[ci-1] : "December";
                const prevYear = ci > 0 ? sy : String(Number(sy)-1);
                const prevGroups: GroupBarItem[] = (groupBarData as any)?.[prevYear]?.[prevMonth] || [];
                const prevTop = prevGroups.find(i => i.name === topPerformer.name);
                const pctChange = prevTop && prevTop.revenue > 0 ? Math.round(((topPerformer.revenue - prevTop.revenue) / prevTop.revenue) * 100) : 12;
                const isIncrease = pctChange >= 0;
                const lossProducts = groups.filter(i => getProfitOrLoss(i) < 0);
                const needsFocus = lossProducts.length > 0 ? lossProducts.reduce((max, i) => getProfitOrLoss(i) < getProfitOrLoss(max) ? i : max, lossProducts[0]) : groups.reduce((min, i) => i.revenue < min.revenue ? i : min, groups[0]);
                const needsFocusHasLoss = getProfitOrLoss(needsFocus) < 0;
                return (
                  <div className="w-full rounded-[10px] border border-[rgba(23,97,163,1)] bg-[rgba(241,247,248,1)] p-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] sm:p-[29px]">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xs font-semibold text-[rgba(17,24,39,1)] sm:text-sm">Top Performer</h3>
                      <div className="flex items-center gap-1" style={{ color: isIncrease ? "rgba(46,158,120,1)" : "rgba(220,38,38,1)" }}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ transform: isIncrease ? "rotate(0deg)" : "rotate(180deg)" }}><path d="M7 0L13.9282 13.5H0.0717969L7 0Z" fill="currentColor"/></svg>
                        <span className="text-[10px] font-semibold">{Math.abs(pctChange)}%</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[rgba(107,114,128,1)]">Category</div>
                      <div className="text-sm font-semibold text-[rgba(17,24,39,1)] mb-3">{topPerformer.name}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div><div className="text-[9px] text-[rgba(107,114,128,1)]">Revenue</div><div className="text-sm font-semibold" style={{ color: revenueColor }}>{topPerformer.revenue}k</div></div>
                      <div><div className="text-[9px] text-[rgba(107,114,128,1)]">{isTopProfitable ? "Profit" : "Loss"}</div><div className="text-sm font-semibold" style={{ color: isTopProfitable ? profitColor : lossColor }}>{Math.abs(topPL)}k</div></div>
                    </div>
                    <div className="flex items-center gap-2 pt-3 border-t border-[rgba(229,231,235,1)]">
                      <span className="text-[9px] text-[rgba(107,114,128,1)]">Needs Focus:</span>
                      <span className="text-xs font-semibold text-[rgba(220,38,38,1)]">{needsFocus.name} {needsFocusHasLoss ? "(Loss)" : "(Low Revenue)"}</span>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* ===== STACKED BAR CHART LAYOUT ===== */}
        {chartType === "stackbar" && (
          <div className="grid grid-cols-1 gap-4 max-w-full lg:grid-cols-[minmax(0,1fr)_minmax(0,276px)] lg:gap-0 sm:gap-6">
            <div className="w-full min-h-[350px] rounded-[10px] border border-[rgba(23,97,163,1)] bg-[rgba(241,247,248,1)] p-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] overflow-hidden sm:p-[22px_30px_55px_30px] sm:min-h-[383px]">
              <div className="h-full flex flex-col">{renderChart()}</div>
            </div>
            <div className="flex flex-col gap-4 w-full lg:max-w-[276px] sm:gap-6">
              {/* Legends */}
              {(() => {
                if (!stackBarData) return null;
                const legends: StackBarLegendItem[] = stackBarData.legends || [];
                const defaultLegends = [["rgba(37,99,235,1)","Aggregating Amount"],["rgba(34,197,94,1)","Outstanding Amount"],["rgba(239,68,68,1)","Write-Off Amount"]];
                return (
                  <div className="w-full rounded-[10px] border border-[rgba(23,97,163,1)] bg-[rgba(241,247,248,1)] p-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] sm:p-[29px]">
                    <h3 className="text-xs font-semibold text-[rgba(17,24,39,1)] mb-3 sm:text-sm sm:mb-4">Legends</h3>
                    <div className="flex flex-col gap-2 sm:gap-3">
                      {legends.length > 0
                        ? legends.map((l, i) => (
                          <div key={l.key || i} className="flex items-center gap-2">
                            <div className="w-[14px] h-3 rounded flex-shrink-0" style={{ backgroundColor: l.color }} />
                            <span className="text-[10px] text-[rgba(55,65,81,1)] sm:text-xs">{l.label}</span>
                          </div>
                        ))
                        : defaultLegends.map(([color, label]) => (
                          <div key={label} className="flex items-center gap-2">
                            <div className="w-[14px] h-3 rounded flex-shrink-0" style={{ backgroundColor: color }} />
                            <span className="text-[10px] text-[rgba(55,65,81,1)] sm:text-xs">{label}</span>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                );
              })()}
              {/* Top Performer */}
              {(() => {
                if (!stackBarData) return null;
                const sy = selectedFilters["SelectYear"] || "2026";
                const sm2 = selectedFilters["SelectMonth"] || "January";
                const sw = selectedFilters["SelectWeek"] || "Week 1";
                const st = selectedFilters["SelectType"] || "Category A";
                const typeData: StackBarDayData[] = (stackBarData as any)?.[sy]?.[sm2]?.[sw]?.[st] || [];
                if (!typeData.length) return null;
                const topPerformer = typeData.reduce((max, day) => {
                  const mt = max.aggregating + max.outstanding + max.writeOff;
                  const ct = day.aggregating + day.outstanding + day.writeOff;
                  return ct > mt ? day : max;
                }, typeData[0]);
                const topTotal = topPerformer.aggregating + topPerformer.outstanding + topPerformer.writeOff;
                const needsFocus = typeData.reduce((min, day) => {
                  const mt2 = min.aggregating + min.outstanding + min.writeOff;
                  const ct2 = day.aggregating + day.outstanding + day.writeOff;
                  return ct2 < mt2 ? day : min;
                }, typeData[0]);
                const weekNum = parseInt(sw.replace("Week ", ""));
                let percentageChange = 12, isIncrease = true;
                const prevWeek = weekNum > 1 ? `Week ${weekNum - 1}` : null;
                if (prevWeek) {
                  const prevTypeData: StackBarDayData[] = (stackBarData as any)?.[sy]?.[sm2]?.[prevWeek]?.[st] || [];
                  const prevDay = prevTypeData.find(d => d.day === topPerformer.day);
                  if (prevDay) {
                    const pt = prevDay.aggregating + prevDay.outstanding + prevDay.writeOff;
                    if (pt > 0) { const ch = ((topTotal - pt) / pt) * 100; percentageChange = Math.abs(Math.round(ch)); isIncrease = ch >= 0; }
                  }
                }
                return (
                  <div className="w-full rounded-[10px] border border-[rgba(23,97,163,1)] bg-[rgba(241,247,248,1)] p-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] sm:p-[29px]">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xs font-semibold text-[rgba(17,24,39,1)] sm:text-sm">Top Performer</h3>
                      <div className="flex items-center gap-1" style={{ color: isIncrease ? "rgba(46,158,120,1)" : "rgba(220,38,38,1)" }}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ transform: isIncrease ? "rotate(0deg)" : "rotate(180deg)" }}><path d="M7 0L13.9282 13.5H0.0717969L7 0Z" fill="currentColor"/></svg>
                        <span className="text-[10px] font-semibold">{percentageChange}%</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[rgba(107,114,128,1)]">Day</div>
                      <div className="text-sm font-semibold text-[rgba(17,24,39,1)] mb-3">{topPerformer.day}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div><div className="text-[9px] text-[rgba(107,114,128,1)]">Aggregating</div><div className="text-sm font-semibold text-[rgba(37,99,235,1)]">${topPerformer.aggregating}</div></div>
                      <div><div className="text-[9px] text-[rgba(107,114,128,1)]">Outstanding</div><div className="text-sm font-semibold text-[rgba(34,197,94,1)]">${topPerformer.outstanding}</div></div>
                    </div>
                    <div className="flex items-center gap-2 pt-3 border-t border-[rgba(229,231,235,1)]">
                      <span className="text-[9px] text-[rgba(107,114,128,1)]">Needs Focus:</span>
                      <span className="text-xs font-semibold text-[rgba(220,38,38,1)]">{needsFocus.day}</span>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* ===== LOLLIPOP CHART LAYOUT ===== */}
        {chartType === "lollipop" && (
          <div className="grid grid-cols-1 gap-4 max-w-full lg:grid-cols-[minmax(0,1fr)_minmax(0,276px)] lg:gap-0 sm:gap-6">
            <div className="w-full min-h-[350px] rounded-[10px] border border-[rgba(23,97,163,1)] bg-[rgba(241,247,248,1)] p-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] overflow-hidden sm:p-[22px_30px_55px_30px] sm:min-h-[383px]">
              <div className="h-full flex flex-col">{renderChart()}</div>
            </div>
            <div className="flex flex-col gap-4 w-full lg:max-w-[276px] sm:gap-6">
              {/* Legends */}
              <div className="w-full rounded-[10px] border border-[rgba(23,97,163,1)] bg-[rgba(241,247,248,1)] p-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] sm:p-[29px]">
                <h3 className="text-xs font-semibold text-[rgba(17,24,39,1)] mb-3 sm:text-sm sm:mb-4">
                  {(() => { const fid = currentFilters[currentFilters.length - 2]?.id; return (currentFilters as Filter[]).find((f: Filter) => f.id === fid)?.label || "Categories"; })()}
                </h3>
                <div className="flex flex-col gap-2 sm:gap-3">
                  {(() => {
                    const fid = currentFilters[currentFilters.length - 2]?.id;
                    const filter = (currentFilters as Filter[]).find((f: Filter) => f.id === fid);
                    const colors = ["rgba(37,99,235,1)","rgba(16,185,129,1)","rgba(245,158,11,1)","rgba(239,68,68,1)","rgba(147,51,234,1)"];
                    return (filter?.options || []).map((opt: string, idx: number) => (
                      <div key={opt} className="flex items-center gap-2">
                        <div className="w-3.5 h-3.5 rounded-full flex-shrink-0" style={{ backgroundColor: colors[idx % colors.length] }} />
                        <span className="text-[10px] text-[rgba(55,65,81,1)] sm:text-xs">{opt}</span>
                      </div>
                    ));
                  })()}
                </div>
              </div>
              {/* Monthly Summary */}
              <div className="w-full rounded-[10px] border border-[rgba(23,97,163,1)] bg-[rgba(241,247,248,1)] p-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] sm:p-[29px]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-[rgba(17,24,39,1)] font-[Poppins,sans-serif]">Monthly Summary</h3>
                  <button className="w-5 h-5 flex items-center justify-center text-[rgba(156,163,175,1)] bg-transparent border-none cursor-pointer hover:text-[rgba(75,85,99,1)]">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="4" r="1"/><circle cx="8" cy="8" r="1"/><circle cx="8" cy="12" r="1"/></svg>
                  </button>
                </div>
                {(() => {
                  const f0 = currentFilters[0]?.id, f1 = currentFilters[1]?.id, f2 = currentFilters[2]?.id;
                  const year = selectedFilters[f0] || currentFilters[0]?.options[0] || "2026";
                  const month = selectedFilters[f1] || currentFilters[1]?.options[0] || "January";
                  const category = selectedFilters[f2] || currentFilters[2]?.options[0] || "Category A";
                  const yearData = ((lollipopData as any)?.[year] || {}) as Record<string, Record<string, LollipopItem[]>>;
                  const catData = yearData?.[month]?.[category] || [];
                  const bestItem = catData.length ? catData.reduce((max, i) => i.value > max.value ? i : max, catData[0]) : null;
                  const lowestItem = catData.length ? catData.reduce((min, i) => i.value < min.value ? i : min, catData[0]) : null;
                  const avg = catData.length ? Math.round(catData.reduce((s, i) => s + i.value, 0) / catData.length) : 0;
                  const aboveAvg = catData.filter(i => i.value > avg).length;
                  const isPositive = aboveAvg > catData.length - aboveAvg;
                  return (
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between gap-2">
                        <div className="flex-1"><div className="text-[10px] text-[rgba(107,114,128,1)] font-[Poppins,sans-serif] font-medium">Best Product</div><div className="text-sm font-semibold text-[rgba(17,24,39,1)] font-[Poppins,sans-serif]">{bestItem?.label || "N/A"}</div></div>
                        <div className="flex-1"><div className="text-[10px] text-[rgba(107,114,128,1)] font-[Poppins,sans-serif] font-medium">Lowest Product</div><div className="text-sm font-semibold text-[rgba(17,24,39,1)] font-[Poppins,sans-serif]">{lowestItem?.label || "N/A"}</div></div>
                      </div>
                      <div className="flex justify-between gap-2">
                        <div className="flex-1"><div className="text-[10px] text-[rgba(107,114,128,1)] font-[Poppins,sans-serif] font-medium">Average</div><div className="text-sm font-semibold text-[rgba(17,24,39,1)] font-[Poppins,sans-serif]">{avg}</div></div>
                        <div className="flex-1">
                          <div className="text-[10px] text-[rgba(107,114,128,1)] font-[Poppins,sans-serif] font-medium">Trend</div>
                          <div className="flex items-center gap-1" style={{ color: isPositive ? "rgba(46,158,120,1)" : "rgba(220,38,38,1)" }}>
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ transform: isPositive ? "rotate(0deg)" : "rotate(180deg)" }}><path d="M7 0L13.9282 13.5H0.0717969L7 0Z" fill="currentColor"/></svg>
                            <span className="text-sm font-semibold font-[Poppins,sans-serif]">{isPositive ? "Positive" : "Negative"}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-[Poppins,sans-serif]">
                        <span className="text-[rgba(107,114,128,1)] font-medium">Needs Focus:</span>
                        <span className="text-[rgba(220,38,38,1)] font-semibold">{lowestItem?.label || "N/A"}</span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        )}

        {/* ===== KPI CHART LAYOUT ===== */}
        {chartType === "kpi" && currentKPIData && (
          <div className="w-full">{renderChart()}</div>
        )}

        {/* ===== LINE/AREA/BAR LAYOUT ===== */}
        {(chartType === "line" || chartType === "area" || chartType === "bar") && !isPieFamily && (
          <div className="grid grid-cols-1 gap-4 max-w-full lg:grid-cols-[minmax(0,1fr)_minmax(0,276px)] lg:gap-0 sm:gap-6">
            <div className="w-full min-h-[350px] rounded-[10px] border border-[rgba(23,97,163,1)] bg-[rgba(241,247,248,1)] p-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] overflow-hidden sm:p-[22px_30px_55px_30px] sm:min-h-[383px]">
              <div className="h-full flex flex-col">{renderChart()}</div>
            </div>
            <div className="flex flex-col gap-4 w-full lg:max-w-[276px] sm:gap-6">
              <div className="w-full rounded-[10px] border border-[rgba(23,97,163,1)] bg-[rgba(241,247,248,1)] p-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] sm:p-[29px]">
                <h3 className="text-xs font-semibold text-[rgba(17,24,39,1)] mb-3 sm:text-sm sm:mb-4">Details</h3>
                <div className="flex flex-col gap-2 sm:gap-3">
                  {details.map((item, idx) => {
                    let bgColor = "rgba(229,231,235,0.5)";
                    if (item.label === "Revenue") bgColor = "rgba(70,194,155,0.15)";
                    else if (item.label === "Profit") bgColor = "rgba(239,68,68,0.15)";
                    else if (item.label === "New Customers") bgColor = "rgba(23,97,163,0.15)";
                    return (
                      <div key={idx} className="flex items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-[rgba(17,24,39,1)] text-[10px] overflow-hidden text-ellipsis whitespace-nowrap sm:text-xs">{item.label}</div>
                          <div className="text-[9px] text-[rgba(107,114,128,1)] mt-0.5 line-clamp-2 sm:text-[10px]">{item.description}</div>
                        </div>
                        <div className="inline-flex items-center justify-center px-2 py-1 rounded text-[10px] font-bold text-[rgba(17,24,39,1)] whitespace-nowrap flex-shrink-0 sm:text-xs sm:px-2.5 sm:py-1.5" style={{ backgroundColor: bgColor }}>{item.value}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="w-full rounded-[10px] border border-[rgba(23,97,163,1)] bg-[rgba(241,247,248,1)] p-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] sm:p-[29px]">
                <h3 className="text-xs font-semibold text-[rgba(17,24,39,1)] mb-3 sm:text-sm sm:mb-4">Quick Stats</h3>
                <div className="mb-3">
                  <div className="text-[rgba(31,41,55,1)] font-semibold text-xs sm:text-sm">Total Volume</div>
                  <div className="text-xl font-bold text-[rgba(17,24,39,1)] mt-2">{quickStats.totalVolume.value}</div>
                  <div className="text-[10px] text-[rgba(107,114,128,1)] mt-1 sm:text-xs">{quickStats.totalVolume.description}</div>
                </div>
                <div>
                  <div className="text-[rgba(31,41,55,1)] font-semibold text-xs sm:text-sm">Transactions</div>
                  <div className="text-xl font-bold text-[rgba(17,24,39,1)] mt-2">{quickStats.transactions.value}</div>
                  <div className="text-[10px] text-[rgba(107,114,128,1)] mt-1 sm:text-xs">{quickStats.transactions.description}</div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

MahatiChartAnalyticsWidget.displayName = "MahatiChartAnalyticsWidget";

/* ============================================================================
   SHARED SUB-COMPONENTS (extracted to avoid repetition)
   ============================================================================ */

interface QuickInsightsCardProps {
  totalVolume: string;
  peakIconSrc: string;
  peakDate: string;
  peakEvents: string;
  calendarIconSrc: string;
  activeDayLabel: string;
  activeDayValue: string;
  activeAvg: string;
  dateLabel: string;
}

const QuickInsightsCard: React.FC<QuickInsightsCardProps> = ({
  totalVolume, peakIconSrc, peakDate, peakEvents,
  calendarIconSrc, activeDayLabel, activeDayValue, activeAvg, dateLabel,
}) => (
  <div className="w-[276px] h-[191px] rounded-[10px] border border-[rgba(23,97,163,1)] bg-[rgba(241,247,248,1)] shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] relative">
    <div className="absolute top-[17px] left-[19px] right-[17px] flex items-center justify-between">
      <div className="text-black font-[Poppins,sans-serif] text-xs font-semibold">Quick Insights</div>
      <div className="text-[rgba(94,94,94,1)] font-[Poppins,sans-serif] text-[10px] font-medium">{dateLabel}</div>
    </div>
    <div className="absolute top-[57px] left-[18px] text-black font-[Poppins,sans-serif] text-xs font-semibold">Total Volume</div>
    <div className="absolute top-[80px] left-[18px] text-black font-[Poppins,sans-serif] text-lg font-semibold">{totalVolume}</div>
    <div className="absolute top-[119px] left-[19px] right-[19px] h-px bg-[rgba(77,175,131,0.2)]" />
    <div className="absolute top-[137px] left-[19px] w-5 h-5 rounded bg-[rgba(23,97,163,1)]">
      <img src={peakIconSrc} alt="" className="absolute top-1 left-1 w-3 h-3 object-cover" />
    </div>
    <div className="absolute top-[134px] left-[48px] text-[rgba(23,97,163,1)] font-[Poppins,sans-serif] text-[8px] font-medium">Peak Day</div>
    <div className="absolute top-[146px] left-[48px] text-black font-[Poppins,sans-serif] text-[10px] font-semibold">{peakDate}</div>
    <div className="absolute top-[161px] left-[48px] text-[rgba(94,94,94,1)] font-[Poppins,sans-serif] text-[8px] font-medium">{peakEvents}</div>
    <div className="absolute top-[137px] left-[164px] w-5 h-5 rounded bg-[rgba(23,97,163,1)]">
      <img src={calendarIconSrc} alt="" className="absolute top-1 left-1 w-[10px] h-[10px] object-cover" />
    </div>
    <div className="absolute top-[134px] left-[193px] text-[rgba(23,97,163,1)] font-[Poppins,sans-serif] text-[8px] font-medium">{activeDayLabel}</div>
    <div className="absolute top-[146px] left-[193px] text-black font-[Poppins,sans-serif] text-[10px] font-semibold">{activeDayValue}</div>
    <div className="absolute top-[161px] left-[193px] text-[rgba(94,94,94,1)] font-[Poppins,sans-serif] text-[8px] font-medium">{activeAvg}</div>
  </div>
);

interface TopPerformerCardProps {
  performer: { name: string; revenue: string; profit: string; needsFocus: string; change: string; isIncrease: boolean };
}

const TopPerformerCard: React.FC<TopPerformerCardProps> = ({ performer }) => (
  <div className="w-full rounded-[10px] border border-[rgba(23,97,163,1)] bg-[rgba(241,247,248,1)] p-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] sm:p-[29px]">
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-xs font-semibold text-[rgba(17,24,39,1)] sm:text-sm">Top Performer</h3>
      <div className="flex items-center gap-1" style={{ color: performer.isIncrease ? "rgba(46,158,120,1)" : "rgba(220,38,38,1)" }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ transform: performer.isIncrease ? "rotate(0deg)" : "rotate(180deg)" }}>
          <path d="M7 0L13.9282 13.5H0.0717969L7 0Z" fill="currentColor"/>
        </svg>
        <span className="text-[10px] font-semibold">{performer.change}</span>
      </div>
    </div>
    <div>
      <div className="text-[10px] text-[rgba(107,114,128,1)]">Category</div>
      <div className="text-sm font-semibold text-[rgba(17,24,39,1)] mb-3">{performer.name}</div>
    </div>
    <div className="grid grid-cols-2 gap-3 mb-3">
      <div>
        <div className="text-[9px] text-[rgba(107,114,128,1)]">Revenue</div>
        <div className="text-sm font-semibold text-[rgba(37,99,235,1)]">{performer.revenue}</div>
      </div>
      <div>
        <div className="text-[9px] text-[rgba(107,114,128,1)]">Profit</div>
        <div className="text-sm font-semibold text-[rgba(77,175,131,1)]">{performer.profit}</div>
      </div>
    </div>
    <div className="flex items-center gap-2 pt-3 border-t border-[rgba(229,231,235,1)]">
      <span className="text-[9px] text-[rgba(107,114,128,1)]">Needs Focus:</span>
      <span className="text-xs font-semibold text-[rgba(220,38,38,1)]">{performer.needsFocus}</span>
    </div>
  </div>
);