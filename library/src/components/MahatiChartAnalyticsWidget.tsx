"use client";
import React, { useMemo, useState } from "react";
import styled from "@emotion/styled";
import { ChartData } from "chart.js";
import { ChartDropdown, DropdownOption } from "./ChartDropdown";

// Import all chart components
import { PieLineBarChart, PieLineBarChartType, makeAreaDataStraight } from "./PieLineBarChart";
import { BulletChart } from "./BulletChart";
import { GaugeChart, RiskGaugeChart } from "./GaugeChart";
import { HorizontalBarChart } from "./HorizontalBarChart";
import { GanttChart, GANTT_COLORS } from "./GanttChart";
import { CalendarHeatmapChart } from "./CalendarHeatmapChart";

// LollipopChart
import { LollipopChart } from "./LollipopChart";
import type { LollipopData, LollipopItem } from "./LollipopChart";

// Column Chart
import { ColumnChart } from "./ColumnChart";
import type { ColumnChartData, ColumnItem } from "./ColumnChart";

// KPI Chart
import { KPIChart } from "./KPIChart";
import type { KPIChartData } from "./KPIChart";

// Group Bar Chart
// Group Bar Chart
import { GroupBarChart } from "./GroupBarChart";
import type { GroupBarChartData, GroupBarItem, GroupBarLegendItem } from "./GroupBarChart";  // ✅ ADD GroupBarLegendItem

// Import types
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
  if (typeof m === 'string') return m;
  const anyM = m as any;
  if (typeof anyM?.src === 'string') return anyM.src;
  const d = anyM?.default;
  if (typeof d === 'string') return d;
  if (typeof d?.src === 'string') return d.src;
  return '';
};

// ✅ ADD FALLBACK CONSTANTS
const FALLBACK_ICONS = {
  performancePeakIcon: '/chart-icons/performance-peak-icon.png',
  calendarIcon: '/chart-icons/calendar-3.png',
  increaseIcon: '/chart-icons/increase.png',  // ✅ ADD THIS LINE
  decreaseIcon: '/chart-icons/decrease.png',  // ✅ ADD THIS
};

// ✅ ADD HELPER FUNCTION
const getIconSrc = (imported: AssetModule, fallback: string): string => {
  const src = assetSrc(imported);
  return src || fallback;
};

// ✅ WRAP IMPORTS IN TRY-CATCH
let performancePeakIcon: AssetModule = '';
let calendarIcon: AssetModule = '';
let increaseIcon: AssetModule = '';  // ✅ ADD THIS LINE
let decreaseIcon: AssetModule = '';  // ✅ ADD THIS


try {
  performancePeakIcon = require('../assets/icons/performance-peak-icon.png') as AssetModule;
  calendarIcon = require('../assets/icons/calendar-3.png') as AssetModule;
  increaseIcon = require('../assets/icons/increase.png') as AssetModule;  // ✅ ADD THIS LINE
  decreaseIcon = require('../assets/icons/decrease.png') as AssetModule;  // ✅ ADD THIS (optional, can rotate increase icon instead)
} catch (e) {
  // Will use fallback paths if imports fail
}

/* ============================================================================
   TYPES & INTERFACES
   ============================================================================ */

export type ChartType = "pie" | "doughnut" | "line" | "area" | "bar" | "bullet" | "gauge" | "gantt" | "calendarheatmap" | "horizontalbar" | "columnchart" | "groupbar" | "lollipop" | "kpi" | "riskgauge";

export interface Filter {
  id: string;
  label: string;
  options: string[];
}

// REPLACE with:
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

// REPLACE with (ADD riskgaugeData):
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
  columnChartData?: ColumnChartData;  // ✅ ADD THIS LINE
  groupBarData?: GroupBarChartData;  // ✅ ADD THIS LINE
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
   STYLED COMPONENTS - MAIN CONTAINER
   ============================================================================ */

const MainContainer = styled.div`
  min-height: 100vh;
  background: white;
  overflow-x: hidden;
`;

/* ============================================================================
   STYLED COMPONENTS - TABS SECTION
   ============================================================================ */

const TabsSection = styled.div`
  background: white;
  padding: 16px;

  @media (min-width: 640px) {
    padding-left: 24px;
    padding-right: 24px;
  }

  @media (min-width: 768px) {
    padding-left: 32px;
    padding-right: 32px;
  }
`;

const TabsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const TabButton = styled.button<{ $isActive: boolean }>`
  position: relative;
  padding: 8px 16px;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s;
  border-radius: 9999px;
  outline: none;
  border: 1px solid;
  cursor: pointer;

  ${(props) =>
    props.$isActive
      ? `
    color: white;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    border-color: rgba(23, 97, 163, 0.45);
    background: linear-gradient(90deg, rgba(23, 97, 163, 1) 0%, rgba(77, 175, 131, 1) 100%);
  `
      : `
    color: rgba(55, 65, 81, 1);
    border-color: transparent;
    background: transparent;
    
    &:hover {
      border-color: rgba(23, 97, 163, 0.25);
      background: rgba(23, 97, 163, 0.05);
    }
  `}

  &:focus-visible {
    box-shadow: 0 0 0 2px rgba(23, 97, 163, 0.35);
  }

  @media (min-width: 640px) {
    padding: 10px 24px;
    font-size: 14px;
  }
`;

/* ============================================================================
   STYLED COMPONENTS - FILTERS SECTION
   ============================================================================ */

const FiltersSection = styled.div`
  padding: 16px;
  position: relative;
  z-index: 50;

  @media (min-width: 640px) {
    padding-left: 24px;
    padding-right: 24px;
  }

  @media (min-width: 768px) {
    padding-left: 32px;
    padding-right: 32px;
  }
`;

const FiltersWrapper = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-end;
  flex-wrap: wrap;
  position: relative;

  @media (min-width: 640px) {
    gap: 16px;
  }
`;

const FilterDropdownWrapper = styled.div<{ $zIndex: number }>`
  position: relative;
  z-index: ${props => props.$zIndex};
`;

const ApplyButton = styled.button`
  width: 77px;
  height: 30px;
  border-radius: 4px;
  border: 1px solid rgba(23, 97, 163, 1);
  background: linear-gradient(90deg, rgba(23, 97, 163, 1) 0%, rgba(77, 175, 131, 1) 100%);
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

/* ============================================================================
   STYLED COMPONENTS - CONTENT SECTION
   ============================================================================ */

const ContentSection = styled.div`
  padding: 16px;
  overflow-x: hidden;
  overflow-y: visible;

  @media (min-width: 640px) {
    padding-left: 24px;
    padding-right: 24px;
  }

  @media (min-width: 768px) {
    padding-left: 32px;
    padding-right: 32px;
  }
`;

/* ============================================================================
   STYLED COMPONENTS - PIE/DOUGHNUT LAYOUT
   ============================================================================ */

const PieGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: 640px) {
    gap: 24px;
  }
`;

const Card = styled.div`
  border-radius: 10px;
  border: 1px solid rgba(23, 97, 163, 1);
  background: rgba(241, 247, 248, 1);
  padding: 16px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  overflow: visible;

  @media (min-width: 640px) {
    padding: 24px;
  }
`;

const CardHeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 16px;
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

const ChartContainer = styled.div`
  height: 192px;
  padding: 8px;
  border-radius: 16px;

  @media (min-width: 640px) {
    height: 224px;
  }

  @media (min-width: 768px) {
    height: 256px;
  }
`;

const DetailsSection = styled.div`
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;

  @media (min-width: 640px) {
    margin-top: 24px;
    gap: 12px;
  }
`;

const DetailRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const DetailLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  @media (min-width: 640px) {
    gap: 12px;
  }
`;

const ColorBlock = styled.span<{ $color: string }>`
  width: 16px;
  height: 8px;
  border-radius: 2px;
  background-color: ${(props) => props.$color};
  flex-shrink: 0;

  @media (min-width: 640px) {
    width: 20px;
    height: 10px;
  }
`;

const DetailLabel = styled.span`
  color: rgba(55, 65, 81, 1);
  font-size: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (min-width: 640px) {
    font-size: 12px;
  }
`;

const DetailValue = styled.span`
  font-weight: 600;
  color: black;
  font-size: 12px;
  margin-left: 8px;

  @media (min-width: 640px) {
    font-size: 14px;
  }
`;

const DetailsCard = styled(Card)``;

const DetailsCardTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: rgba(17, 24, 39, 1);
  margin-bottom: 16px;

  @media (min-width: 640px) {
    font-size: 18px;
    margin-bottom: 24px;
  }
`;

const DetailsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (min-width: 640px) {
    gap: 20px;
  }
`;

const DetailItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;

  @media (min-width: 640px) {
    gap: 12px;
  }
`;

const DetailColorBar = styled.span<{ $color: string }>`
  display: inline-block;
  flex-shrink: 0;
  width: 18px;
  height: 10px;
  border-radius: 2px;
  background-color: ${(props) => props.$color};
`;

const DetailContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const DetailHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const DetailItemLabel = styled.div`
  font-weight: 600;
  color: rgba(17, 24, 39, 1);
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (min-width: 640px) {
    font-size: 14px;
  }
`;

const StatusBadge = styled.div<{ $bgColor: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 16px;
  border-radius: 4px;
  background-color: ${(props) => props.$bgColor};
  padding: 2px 4px;
`;

const StatusText = styled.span<{ $color: string }>`
  font-family: Poppins, sans-serif;
  font-weight: 600;
  white-space: nowrap;
  font-size: 6px;
  color: ${(props) => props.$color};
`;

const DetailDescription = styled.div`
  font-size: 10px;
  color: rgba(107, 114, 128, 1);
  margin-top: 2px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media (min-width: 640px) {
    font-size: 12px;
  }
`;

const DetailItemValue = styled.div`
  font-weight: 700;
  color: rgba(17, 24, 39, 1);
  font-size: 12px;
  margin-left: 8px;

  @media (min-width: 640px) {
    font-size: 14px;
  }
`;

const QuickStatsColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (min-width: 640px) {
    gap: 16px;
  }

  @media (min-width: 768px) {
    grid-column: span 2;
  }

  @media (min-width: 1024px) {
    grid-column: span 1;
  }
`;

const QuickStatCard = styled(Card)``;

const StatLabel = styled.div`
  color: rgba(31, 41, 55, 1);
  font-weight: 600;
  font-size: 12px;

  @media (min-width: 640px) {
    font-size: 14px;
  }
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: rgba(17, 24, 39, 1);
  margin-top: 12px;

  @media (min-width: 640px) {
    font-size: 30px;
    margin-top: 16px;
  }
`;

const StatChange = styled.div<{ $isPositive: boolean }>`
  font-size: 12px;
  font-weight: 500;
  margin-top: 4px;
  color: ${(props) => (props.$isPositive ? "rgba(22, 163, 74, 1)" : "rgba(220, 38, 38, 1)")};

  @media (min-width: 640px) {
    font-size: 14px;
  }
`;

const StatDescription = styled.div`
  font-size: 10px;
  color: rgba(107, 114, 128, 1);
  margin-top: 8px;

  @media (min-width: 640px) {
    font-size: 12px;
  }
`;

/* ============================================================================
   STYLED COMPONENTS - TWO-COLUMN LAYOUT (Bullet, Gauge, Horizontal Bar)
   ============================================================================ */

const TwoColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  max-width: 100%;

  @media (min-width: 1024px) {
    grid-template-columns: minmax(0, 1fr) minmax(0, 276px);
    gap: 0px;
  }

  @media (min-width: 640px) {
    gap: 24px;
  }
`;

const MainChartCard = styled.div`
  width: 100%;
  min-height: 350px;
  border-radius: 10px;
  border: 1px solid rgba(23, 97, 163, 1);
  background: rgba(241, 247, 248, 1);
  padding: 16px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  overflow: hidden;

  @media (min-width: 640px) {
    padding: 22px 30px 55px 30px;
    min-height: 383px;
  }
`;

const ChartWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;

  @media (min-width: 1024px) {
    max-width: 276px;
    gap: 24px;
  }

  @media (min-width: 640px) {
    gap: 24px;
  }
`;

const SidebarCard = styled.div`
  width: 100%;
  border-radius: 10px;
  border: 1px solid rgba(23, 97, 163, 1);
  background: rgba(241, 247, 248, 1);
  padding: 16px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

  @media (min-width: 640px) {
    padding: 16px;
  }
`;

const SidebarTitle = styled.h3`
  font-size: 12px;
  font-weight: 600;
  color: rgba(17, 24, 39, 1);
  margin-bottom: 12px;

  @media (min-width: 640px) {
    font-size: 14px;
    margin-bottom: 16px;
  }
`;

const SidebarDetailsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  @media (min-width: 640px) {
    gap: 12px;
  }
`;

const SidebarDetailItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
`;

const PercentageBadge = styled.div<{ $bgColor: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 8px;
  border-radius: 4px;
  background-color: ${props => props.$bgColor};
  font-weight: 700;
  font-size: 10px;
  color: rgba(17, 24, 39, 1);
  white-space: nowrap;
  flex-shrink: 0;

  @media (min-width: 640px) {
    font-size: 12px;
    padding: 6px 10px;
  }
`;

const DetailsCardFooter = styled.div`
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(229, 231, 235, 1);
  display: flex;
  align-items: flex-start;
  gap: 8px;
`;

const DetailsCardFooterIcon = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: rgba(96, 165, 250, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
`;

const DetailsCardFooterIconText = styled.span`
  font-size: 10px;
  font-weight: 700;
  color: white;
`;

const DetailsCardFooterText = styled.div`
  flex: 1;
  font-size: 12px;
  color: rgba(107, 114, 128, 1);
  line-height: 1.5;
`;

const DetailsCardFooterBold = styled.span`
  font-weight: 600;
  color: rgba(17, 24, 39, 1);
`;

const SidebarColorBlock = styled.span<{ $color: string }>`
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  flex-shrink: 0;
  background-color: ${(props) => props.$color};

  @media (min-width: 640px) {
    width: 24px;
    height: 24px;
  }
`;

const SidebarDetailContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const SidebarDetailLabel = styled.div`
  font-weight: 600;
  color: rgba(17, 24, 39, 1);
  font-size: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (min-width: 640px) {
    font-size: 12px;
  }
`;

const SidebarDetailDescription = styled.div`
  font-size: 9px;
  color: rgba(107, 114, 128, 1);
  margin-top: 2px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media (min-width: 640px) {
    font-size: 10px;
  }
`;

const SidebarDetailValue = styled.div`
  font-weight: 700;
  color: rgba(17, 24, 39, 1);
  font-size: 10px;
  margin-left: 8px;

  @media (min-width: 640px) {
    font-size: 12px;
  }
`;

const ActionButtonsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (min-width: 640px) {
    gap: 16px;
  }
`;

const ActionButton = styled.button<{ $variant: "danger" | "primary" | "success" | "mahati" }>`
  width: 100%;
  padding: 10px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s;

  ${(props) => {
    switch (props.$variant) {
      case "danger":
        return `
          background: rgba(239, 68, 68, 1);
          color: white;
          &:hover { background: rgba(220, 38, 38, 1); }
        `;
      case "primary":
        return `
          background: rgba(59, 130, 246, 1);
          color: white;
          &:hover { background: rgba(37, 99, 235, 1); }
        `;
      case "success":
        return `
          background: rgba(34, 197, 94, 1);
          color: white;
          &:hover { background: rgba(22, 163, 74, 1); }
        `;
      case "mahati":
        return `
          background: rgba(23, 97, 163, 1);
          color: white;
          &:hover { background: rgba(15, 74, 122, 1); }
        `;
      default:
        return `
          background: rgba(107, 114, 128, 1);
          color: white;
          &:hover { background: rgba(75, 85, 99, 1); }
        `;
    }
  }}
`;

/* ============================================================================
   STYLED COMPONENTS - GANTT LAYOUT
   ============================================================================ */

const GanttGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  max-width: 100%;
  overflow: hidden;

  @media (min-width: 1024px) {
    grid-template-columns: minmax(0, 1fr) minmax(0, 205px);
    gap: 4px;
  }

  @media (min-width: 640px) {
    gap: 24px;
  }
`;

const GanttChartCard = styled(MainChartCard)`
  overflow-x: auto;
  
  @media (min-width: 1024px) {
    overflow-x: hidden;
  }

  @media (min-width: 640px) {
    padding: 12px 16px;
    min-height: 400px;
  }

  @media (min-width: 1024px) {
    padding: 22px 30px 55px 30px;
    min-height: 383px;
  }
`;

const GanttChartWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  min-width: 650px;
  width: 100%;

  @media (min-width: 1024px) {
    min-width: 0;
  }
`;

const GanttSidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  min-width: 0;

  @media (min-width: 1024px) {
    max-width: 205px;
  }
`;

const GanttQuickInsightsCard = styled(SidebarCard)`
  max-height: 400px;
  overflow-y: auto;
`;

const GanttInsightsTitle = styled(SidebarTitle)`
  position: sticky;
  top: 0;
  background: rgba(241, 247, 248, 1);
  padding-bottom: 8px;
  margin-bottom: 4px;
`;

const GanttProjectInfo = styled.div`
  font-size: 9px;
  color: rgba(75, 85, 99, 1);
  margin-bottom: 12px;
  position: sticky;
  top: 20px;
  background: rgba(241, 247, 248, 1);
  padding-bottom: 4px;
`;

const GanttTaskList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  @media (min-width: 640px) {
    gap: 12px;
  }
`;

const GanttTaskItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(229, 231, 235, 1);

  &:last-child {
    border-bottom: none;
  }
`;

const GanttTaskDot = styled.div<{ $color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
  background: ${props => props.$color};
`;

const GanttTaskContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const GanttTaskName = styled.div`
  font-weight: 500;
  color: rgba(17, 24, 39, 1);
  font-size: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (min-width: 640px) {
    font-size: 12px;
  }
`;

const GanttTaskProgress = styled.div`
  font-size: 8px;
  color: rgba(107, 114, 128, 1);
  margin-top: 2px;
`;

const GanttTaskStatus = styled.div<{ $bgColor: string; $color: string }>`
  font-size: 8px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 4px;
  white-space: nowrap;
  background-color: ${props => props.$bgColor};
  color: ${props => props.$color};
`;

const ProjectSummaryCard = styled(SidebarCard)``;

const ProjectSummaryTitle = styled(SidebarTitle)``;

const ProjectSummaryContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  @media (min-width: 640px) {
    gap: 12px;
  }
`;

const ProjectSummaryLabel = styled.div`
  font-size: 9px;
  color: rgba(75, 85, 99, 1);
  margin-bottom: 8px;

  @media (min-width: 640px) {
    font-size: 10px;
  }
`;

const ProjectStatusGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
`;

const ProjectStatusGridFull = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
  margin-top: 8px;
`;

const ProjectStatusBox = styled.div<{ $bgColor: string }>`
  background: ${props => props.$bgColor};
  padding: 8px;
  border-radius: 4px;
`;

const ProjectStatusLabel = styled.div<{ $color: string }>`
  color: ${props => props.$color};
  font-size: 10px;
  font-weight: 600;

  @media (min-width: 640px) {
    font-size: 12px;
  }
`;

const ProjectStatusValue = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: rgba(17, 24, 39, 1);

  @media (min-width: 640px) {
    font-size: 18px;
  }
`;

const ProjectExpectedDate = styled.div`
  font-size: 9px;
  color: rgba(107, 114, 128, 1);
  margin-top: 8px;

  @media (min-width: 640px) {
    font-size: 10px;
    margin-top: 12px;
  }
`;

/* ============================================================================
   STYLED COMPONENTS - CALENDAR HEATMAP LAYOUT
   ============================================================================ */

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  max-width: 100%;
  overflow: hidden;

  @media (min-width: 1024px) {
    grid-template-columns: minmax(0, 1fr) minmax(0, 165px);
    gap: 0px;
  }

  @media (min-width: 640px) {
    gap: 24px;
  }
`;

const CalendarChartCard = styled(MainChartCard)`
  overflow-x: auto;
  
  @media (min-width: 1024px) {
    overflow-x: hidden;
  }
`;

const CalendarChartWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  min-width: 750px;
  width: 100%;

  @media (min-width: 1024px) {
    min-width: 0;
  }
`;

const CalendarSidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  min-width: 0;

  @media (min-width: 1024px) {
    max-width: 280px;
  }
`;

const ActivityLegendCard = styled(SidebarCard)``;

const ActivityLegendTitle = styled(SidebarTitle)``;

const ActivityLegendList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ActivityLegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ActivityLegendColor = styled.div<{ $bgColor: string }>`
  width: 16px;
  height: 16px;
  border-radius: 2px;
  flex-shrink: 0;
  background-color: ${props => props.$bgColor};
`;

const ActivityLegendLabel = styled.span`
  font-size: 10px;
  color: rgba(55, 65, 81, 1);
  white-space: nowrap;

  @media (min-width: 640px) {
    font-size: 12px;
  }
`;

const CalendarQuickInsightsCard = styled.div`
  width: 100%;
  max-width: 280px;
  min-height: 210px;
  border-radius: 10px;
  border: 1px solid rgba(23, 97, 163, 1);
  background: rgba(241, 247, 248, 1);
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CalendarInsightsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const CalendarInsightsTitle = styled.div`
  color: rgba(0, 0, 0, 1);
  font-family: Poppins, sans-serif;
  font-size: 11px;
  font-weight: 600;
  line-height: normal;
`;

const CalendarInsightsSubtitle = styled.div`
  color: rgba(94, 94, 94, 1);
  font-family: Poppins, sans-serif;
  font-size: 8px;
  font-weight: 500;
  line-height: normal;
  text-align: right;
`;

const CalendarTotalVolumeLabel = styled.div`
  color: rgba(0, 0, 0, 1);
  font-family: Poppins, sans-serif;
  font-size: 11px;
  font-weight: 600;
  line-height: normal;
`;

const CalendarTotalVolumeValue = styled.div`
  color: rgba(0, 0, 0, 1);
  font-family: Poppins, sans-serif;
  font-size: 17px;
  font-weight: 600;
  line-height: normal;
  margin-top: 8px;
`;

const CalendarDivider = styled.div`
  width: 100%;
  height: 1px;
  background: rgba(77, 175, 131, 0.2);
`;

const CalendarIconBox = styled.div`
  width: 18px;
  height: 18px;
  border-radius: 4px;
  background: rgba(23, 97, 163, 1);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CalendarIcon = styled.img`
  width: 11px;
  height: 11px;
  object-fit: cover;
`;

const CalendarPeakDayWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  width: 100%;
`;

const CalendarPeakDayIconBox = styled(CalendarIconBox)``;

const CalendarPeakDayContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
`;

const CalendarPeakDayLabel = styled.div`
  color: rgba(23, 97, 163, 1);
  font-family: Poppins, sans-serif;
  font-size: 7.5px;
  font-weight: 500;
  line-height: normal;
  white-space: nowrap;
`;

const CalendarPeakDayValue = styled.div`
  color: rgba(0, 0, 0, 1);
  font-family: Poppins, sans-serif;
  font-size: 9px;
  font-weight: 600;
  line-height: normal;
  white-space: nowrap;
`;

const CalendarPeakDayCount = styled.div`
  color: rgba(94, 94, 94, 1);
  font-family: Poppins, sans-serif;
  font-size: 7.5px;
  font-weight: 500;
  line-height: normal;
  white-space: nowrap;
`;

const CalendarActiveDayWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  width: 100%;
`;

const CalendarActiveDayIconBox = styled(CalendarIconBox)``;

const CalendarActiveDayContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
`;

const CalendarActiveDayLabel = styled.div`
  color: rgba(23, 97, 163, 1);
  font-family: Poppins, sans-serif;
  font-size: 7.5px;
  font-weight: 500;
  line-height: normal;
  white-space: nowrap;
`;

const CalendarActiveDayValue = styled.div`
  color: rgba(0, 0, 0, 1);
  font-family: Poppins, sans-serif;
  font-size: 9px;
  font-weight: 600;
  line-height: normal;
  white-space: nowrap;
`;

const CalendarActiveDayAvg = styled.div`
  color: rgba(94, 94, 94, 1);
  font-family: Poppins, sans-serif;
  font-size: 7.5px;
  font-weight: 500;
  line-height: normal;
  white-space: nowrap;
`;

/* ============================================================================
   STYLED COMPONENTS - HORIZONTAL BAR LAYOUT
   ============================================================================ */

const HorizontalBarSidebar = styled(Sidebar)``;

const DemoLegendsCard = styled(SidebarCard)``;

const DemoLegendsTitle = styled(SidebarTitle)``;

const DemoLegendsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  @media (min-width: 640px) {
    gap: 12px;
  }
`;


const GroupBarLegendsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;  /* ✅ INCREASED SPACING */
  height: 130px;

  @media (min-width: 640px) {
    gap: 20px;  /* ✅ EVEN MORE ON LARGER SCREENS */
  }
`;

const DemoLegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const DemoLegendColor = styled.div<{ $bgColor: string }>`
  width: 14px;
  height: 12px;
  border-radius: 4px;
  flex-shrink: 0;
  background-color: ${props => props.$bgColor};
`;

const DemoLegendLabel = styled.span`
  font-size: 10px;
  color: rgba(55, 65, 81, 1);

  @media (min-width: 640px) {
    font-size: 12px;
  }
`;

const TopPerformerCard = styled(SidebarCard)``;

const TopPerformerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const TopPerformerTitle = styled.h3`
  font-size: 12px;
  font-weight: 600;
  color: rgba(17, 24, 39, 1);

  @media (min-width: 640px) {
    font-size: 14px;
  }
`;

const TopPerformerIndicator = styled.div<{ $color: string }>`
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${props => props.$color};
`;

const TopPerformerArrow = styled.svg<{ $isIncrease: boolean }>`
  width: 14px;
  height: 14px;
  fill: currentColor;
  transform: ${props => props.$isIncrease ? 'rotate(0deg)' : 'rotate(180deg)'};
`;

const TopPerformerChange = styled.span`
  font-size: 10px;
  font-weight: 600;
`;

const TopPerformerContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const TopPerformerLabel = styled.div`
  font-size: 10px;
  color: rgba(107, 114, 128, 1);
`;

const TopPerformerValue = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: rgba(17, 24, 39, 1);
`;

const TopPerformerStatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-top: 12px;
`;

const TopPerformerStat = styled.div``;

const TopPerformerStatLabel = styled.div`
  font-size: 9px;
  color: rgba(107, 114, 128, 1);
`;

const TopPerformerStatValue = styled.div<{ $color?: string }>`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.$color || 'rgba(17, 24, 39, 1)'};
`;

const TopPerformerNeedsFocus = styled.div`
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(229, 231, 235, 1);
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TopPerformerNeedsFocusLabel = styled.span`
  font-size: 9px;
  color: rgba(107, 114, 128, 1);
`;

const TopPerformerNeedsFocusValue = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: rgba(220, 38, 38, 1);
`;

/* ============================================================================
   STYLED COMPONENTS - LOLLIPOP CHART LAYOUT
   ============================================================================ */

const LollipopSidebar = styled(Sidebar)``;

const LollipopLegendsCard = styled(SidebarCard)``;

const LollipopLegendsTitle = styled(SidebarTitle)``;

const LollipopLegendsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  @media (min-width: 640px) {
    gap: 12px;
  }
`;

const LollipopLegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LollipopLegendColor = styled.div<{ $bgColor: string }>`
  width: 14px;
  height: 14px;
  border-radius: 50%;
  flex-shrink: 0;
  background-color: ${props => props.$bgColor};
`;

const LollipopLegendLabel = styled.span`
  font-size: 10px;
  color: rgba(55, 65, 81, 1);

  @media (min-width: 640px) {
    font-size: 12px;
  }
`;

const LollipopInsightsCard = styled(SidebarCard)``;

const LollipopInsightsTitle = styled(SidebarTitle)``;

const LollipopSummaryCard = styled(SidebarCard)``;

const LollipopSummaryHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const LollipopSummaryTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: rgba(17, 24, 39, 1);
  font-family: Poppins, sans-serif;
`;

const LollipopSummaryMenuButton = styled.button`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(156, 163, 175, 1);
  background: transparent;
  border: none;
  cursor: pointer;
  
  &:hover {
    color: rgba(75, 85, 99, 1);
  }
`;

const LollipopSummaryContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const LollipopSummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;
`;

const LollipopSummaryItem = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const LollipopSummaryLabel = styled.div`
  font-size: 10px;
  color: rgba(107, 114, 128, 1);
  font-family: Poppins, sans-serif;
  font-weight: 500;
`;

const LollipopSummaryValue = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: rgba(17, 24, 39, 1);
  font-family: Poppins, sans-serif;
`;

const LollipopSummaryFullWidth = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const LollipopTrendWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const LollipopTrendIndicator = styled.div<{ $isPositive: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${props => props.$isPositive ? 'rgba(46, 158, 120, 1)' : 'rgba(220, 38, 38, 1)'};
`;

const LollipopTrendArrow = styled.svg<{ $isPositive: boolean }>`
  width: 14px;
  height: 14px;
  fill: currentColor;
  transform: ${props => props.$isPositive ? 'rotate(0deg)' : 'rotate(180deg)'};
`;

const LollipopTrendText = styled.span`
  font-size: 14px;
  font-weight: 600;
  font-family: Poppins, sans-serif;
`;

const LollipopNeedsFocusWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-family: Poppins, sans-serif;
`;

const LollipopNeedsFocusLabel = styled.span`
  color: rgba(107, 114, 128, 1);
  font-weight: 500;
`;

const LollipopNeedsFocusValue = styled.span`
  color: rgba(220, 38, 38, 1);
  font-weight: 600;
`;


const LollipopInsightsContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const LollipopInsightItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const LollipopInsightLabel = styled.div`
  font-size: 10px;
  color: rgba(107, 114, 128, 1);
`;

const LollipopInsightValue = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: rgba(17, 24, 39, 1);
`;

const LollipopInsightChange = styled.div<{ $isPositive: boolean }>`
  font-size: 12px;
  font-weight: 500;
  color: ${props => props.$isPositive ? 'rgba(22, 163, 74, 1)' : 'rgba(220, 38, 38, 1)'};
`;

/* ============================================================================
   STYLED COMPONENTS - GAUGE SPECIFIC COMPONENTS
   ============================================================================ */

const GaugeQuickInsightsCard = styled.div`
  width: 276px;
  height: 191px;
  border-radius: 10px;
  border: 1px solid rgba(23, 97, 163, 1);
  background: rgba(241, 247, 248, 1);
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  position: relative;
`;

const GaugeInsightsHeader = styled.div`
  position: absolute;
  top: 17px;
  left: 19px;
  right: 17.14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const GaugeInsightsTitle = styled.div`
  color: rgba(0, 0, 0, 1);
  font-family: Poppins, sans-serif;
  font-size: 12px;
  font-weight: 600;
  line-height: normal;
`;

const GaugeInsightsDate = styled.div`
  color: rgba(94, 94, 94, 1);
  font-family: Poppins, sans-serif;
  font-size: 10px;
  font-weight: 500;
  line-height: normal;
`;

const GaugeVolume = styled.div`
  position: absolute;
  top: 57px;
  left: 18.13px;
  color: rgba(0, 0, 0, 1);
  font-family: Poppins, sans-serif;
  font-size: 12px;
  font-weight: 600;
  line-height: normal;
`;

const GaugeVolumeValue = styled.div`
  position: absolute;
  top: 80px;
  left: 18.13px;
  color: rgba(0, 0, 0, 1);
  font-family: Poppins, sans-serif;
  font-size: 18px;
  font-weight: 600;
  line-height: normal;
`;

const GaugeDivider = styled.div`
  position: absolute;
  top: 119px;
  left: 19.14px;
  right: 19.14px;
  height: 1px;
  background: rgba(77, 175, 131, 0.2);
`;

const GaugePeakDay = styled.div`
  position: absolute;
  top: 137px;
  left: 19.14px;
  width: 20.146px;
  height: 20px;
  border-radius: 4px;
  background: rgba(23, 97, 163, 1);
`;

const GaugePeakIcon = styled.img`
  position: absolute;
  top: 3.98px;
  left: 4.05px;
  width: 12.044px;
  height: 12.044px;
  object-fit: cover;
`;

const GaugePeakLabel = styled.div`
  position: absolute;
  top: 134px;
  left: 48.35px;
  width: 98.277px;
  color: rgba(23, 97, 163, 1);
  font-family: Poppins, sans-serif;
  font-size: 8px;
  font-weight: 500;
  line-height: normal;
`;

const GaugePeakDate = styled.div`
  position: absolute;
  top: 146px;
  left: 48.35px;
  width: 59.431px;
  color: rgba(0, 0, 0, 1);
  font-family: Poppins, sans-serif;
  font-size: 10px;
  font-weight: 600;
  line-height: normal;
`;

const GaugePeakEvents = styled.div`
  position: absolute;
  top: 161px;
  left: 48.35px;
  width: 52.38px;
  color: rgba(94, 94, 94, 1);
  font-family: Poppins, sans-serif;
  font-size: 8px;
  font-weight: 500;
  line-height: normal;
`;

const GaugeActiveDayBox = styled.div`
  position: absolute;
  top: 137px;
  left: 164.18px;
  width: 20.146px;
  height: 20px;
  border-radius: 4px;
  background: rgba(23, 97, 163, 1);
`;

const GaugeActiveIcon = styled.img`
  position: absolute;
  top: 4.98px;
  left: 5.05px;
  width: 10.036px;
  height: 10.036px;
  object-fit: cover;
`;

const GaugeActiveLabel = styled.div`
  position: absolute;
  top: 134px;
  left: 193.39px;
  width: 65.474px;
  color: rgba(23, 97, 163, 1);
  font-family: Poppins, sans-serif;
  font-size: 8px;
  font-weight: 500;
  line-height: normal;
`;

const GaugeActiveDayValue = styled.div`
  position: absolute;
  top: 146px;
  left: 193.39px;
  width: 62.453px;
  color: rgba(0, 0, 0, 1);
  font-family: Poppins, sans-serif;
  font-size: 10px;
  font-weight: 600;
  line-height: normal;
`;

const GaugeActiveAvg = styled.div`
  position: absolute;
  top: 161px;
  left: 193.39px;
  width: 57.416px;
  color: rgba(94, 94, 94, 1);
  font-family: Poppins, sans-serif;
  font-size: 8px;
  font-weight: 500;
  line-height: normal;
`;

const GoalHealthCard = styled(SidebarCard)``;

/* ============================================================================
   STYLED COMPONENTS - PERFORMANCE SUMMARY CARD (Bullet Chart)
   ============================================================================ */

const PerformanceSummaryCard = styled(SidebarCard)``;

const PerformanceSummaryHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const PerformanceSummaryTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: rgba(17, 24, 39, 1);
`;

const PerformanceSummaryMenuButton = styled.button`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(156, 163, 175, 1);
  background: transparent;
  border: none;
  cursor: pointer;
  
  &:hover {
    color: rgba(75, 85, 99, 1);
  }
`;

const PerformanceSummaryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const PerformanceSummaryItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const PerformanceSummaryLabel = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: rgba(17, 24, 39, 1);
`;

const PerformanceSummaryBadge = styled.div<{ $variant: 'success' | 'danger' | 'info' }>`
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  
  ${props => {
    switch (props.$variant) {
      case 'success':
        return `
          background-color: rgba(220, 252, 231, 1);
          color: rgba(22, 163, 74, 1);
        `;
      case 'danger':
        return `
          background-color: rgba(254, 226, 226, 1);
          color: rgba(220, 38, 38, 1);
        `;
      case 'info':
        return `
          background-color: rgba(219, 234, 254, 1);
          color: rgba(37, 99, 235, 1);
        `;
      default:
        return `
          background-color: rgba(243, 244, 246, 1);
          color: rgba(75, 85, 99, 1);
        `;
    }
  }}
`;

const PerformanceSummaryFooter = styled.div`
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(229, 231, 235, 1);
  display: flex;
  align-items: flex-start;
  gap: 8px;
`;

const PerformanceSummaryIcon = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: rgba(96, 165, 250, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
`;

const PerformanceSummaryIconText = styled.span`
  font-size: 10px;
  font-weight: 700;
  color: white;
`;

const PerformanceSummaryActionText = styled.div`
  flex: 1;
  font-size: 12px;
  color: rgba(107, 114, 128, 1);
  line-height: 1.5;
`;

const PerformanceSummaryActionBold = styled.span`
  font-weight: 600;
  color: rgba(17, 24, 39, 1);
`;

const BulletDetailItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  
  &:not(:last-child) {
    border-bottom: 1px solid rgba(229, 231, 235, 1);
  }
`;

const BulletDetailLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const BulletDetailLabel = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: rgba(17, 24, 39, 1);
`;

const BulletDetailDescription = styled.span`
  font-size: 12px;
  color: rgba(107, 114, 128, 1);
`;

const BulletPercentageBox = styled.div<{ $label: string }>`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  
  ${props => {
    const label = props.$label.toLowerCase();
    if (label.includes('revenue')) {
      return `
        background-color: rgba(70, 194, 155, 0.15);
        color: rgba(22, 163, 74, 1);
      `;
    } else if (label.includes('profit')) {
      return `
        background-color: rgba(239, 68, 68, 0.15);
        color: rgba(220, 38, 38, 1);
      `;
    } else if (label.includes('customer')) {
      return `
        background-color: rgba(23, 97, 163, 0.15);
        color: rgba(23, 97, 163, 1);
      `;
    } else {
      return `
        background-color: rgba(229, 231, 235, 1);
        color: rgba(55, 65, 81, 1);
      `;
    }
  }}
`;

const BulletDetailsCardFooter = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding-top: 16px;
  margin-top: 16px;
  border-top: 1px solid rgba(229, 231, 235, 1);
`;

const BulletDetailsIcon = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: rgba(96, 165, 250, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
`;

const BulletDetailsIconText = styled.span`
  font-size: 10px;
  font-weight: bold;
  color: white;
`;

const BulletDetailsFooterText = styled.p`
  font-size: 12px;
  color: rgba(107, 114, 128, 1);
  margin: 0;
  line-height: 1.5;
`;

const BulletDetailsFooterBold = styled.span`
  font-weight: 600;
  color: rgba(17, 24, 39, 1);
`;

const GoalHealthHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const GoalHealthTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: rgba(17, 24, 39, 1);
`;

const GoalHealthBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const GoalHealthBadgeText = styled.span`
  font-size: 10px;
  font-weight: 500;
  color: rgba(46, 158, 120, 1);
`;

const GoalHealthCheckmark = styled.svg`
  width: 16px;
  height: 16px;
`;

const GoalHealthMenuButton = styled.button`
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(156, 163, 175, 1);
  background: transparent;
  border: none;
  cursor: pointer;
  
  &:hover {
    color: rgba(75, 85, 99, 1);
  }
`;

const GoalHealthMenuIcon = styled.svg`
  width: 16px;
  height: 16px;
  fill: currentColor;
`;

const GoalHealthStatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 16px;
`;

const GoalHealthStat = styled.div``;

const GoalHealthStatLabel = styled.div`
  font-size: 10px;
  color: rgba(107, 114, 128, 1);
  margin-bottom: 4px;
`;

const GoalHealthStatValue = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: rgba(17, 24, 39, 1);
`;

/* ============================================================================
   UTILITY FUNCTIONS
   ============================================================================ */

const colorToClass = (color: unknown): string => {  // ✅ Added ': string'
  const c = typeof color === "string" ? color.toLowerCase() : "";
  
  if (c.startsWith("rgba(") || c.startsWith("rgb(")) {
    return c;
  }
  
  const map: Record<string, string> = {
    "#7dcfaf": "#7DCFAF", "#f28a18": "#F28A18", "#2094f3": "#2094F3",
    "#909592": "#909592", "#bcc6cb": "#BCC6CB", "#3b82f6": "#3B82F6",
    "#10b981": "#10B981", "#ef4444": "#EF4444", "#f97316": "#F97316",
    "#f59e0b": "#F59E0B", "#8b5cf6": "#8B5CF6", "#ec4899": "#EC4899",
    "#6366f1": "#6366F1",
  };
  return map[c] || (typeof color === "string" ? color : "#D1D5DB");  // ✅ Fixed
};

const getStatusColors = (status: string) => {
  const statusConfig: Record<string, { textColor: string; backgroundColor: string }> = {
    "In Progress": {
      textColor: "rgba(23, 97, 163, 1)",
      backgroundColor: "rgba(23, 97, 163, 0.15)",
    },
    "Overdue": {
      textColor: "rgba(220, 38, 38, 1)",
      backgroundColor: "rgba(239, 68, 68, 0.15)",
    },
    "On Target": {
      textColor: "rgba(46, 158, 120, 1)",
      backgroundColor: "rgba(70, 194, 155, 0.15)",
    },
  };
  return statusConfig[status] || statusConfig["In Progress"];
};

// REPLACE with (ADD riskgauge):
const tabLabel = (type: ChartType) => {
  if (type === "area") return "Area Line Chart";
  if (type === "bullet") return "Bullet Chart";
  if (type === "gauge") return "Gauge Chart";
  if (type === "riskgauge") return "KPI Risk Gauge Chart";
  if (type === "gantt") return "Gantt Chart";
  if (type === "calendarheatmap") return "Calendar Heat Map";
  if (type === "horizontalbar") return "Horizontal Bar Chart";
  if (type === "columnchart") return "Column Chart";  // ✅ ADD THIS LINE
  if (type === "groupbar") return "Group Bar Chart";  // ✅ ADD THIS LINE
  if (type === "lollipop") return "Lollipop Chart";
  if (type === "kpi") return "KPI Chart";
  return `${type.charAt(0).toUpperCase() + type.slice(1)} Chart`;
};

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
  columnChartData,  // ✅ ADD THIS LINE
  groupBarData,  // ✅ ADD THIS LINE
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
  if (chartFilters && chartFilters[chartType]) {
    return chartFilters[chartType] || [];
  }
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
    if (chartType === 'bullet' && bulletData && bulletData.bullets) {
      return bulletData.bullets.map((bullet) => {
        const percentageAchieved = Math.round((bullet.achieved / bullet.target) * 100);
        return {
          label: bullet.name,
          value: `${percentageAchieved}% Done`,
          description: `${percentageAchieved}% of target achieved`,
          color: "rgba(183, 232, 214, 0.9)",
        };
      });
    }
    return [];
  }, [chartType, bulletData]);

  const currentGanttData = useMemo(() => {
    if (chartType === 'gantt' && ganttData) {
      const year = selectedFilters['SelectYear'] || '2026';
      const type = selectedFilters['SelectType'] || 'Development';
      const baseData = ganttData[year]?.[type];
      
      if (!baseData) return undefined;
      
      if (selectedGanttProject === "Project 2") {
        return {
          title: `${baseData.title} - ${selectedGanttProject}`,
          projectName: `${baseData.projectName} - ${selectedGanttProject}`,
          tasks: baseData.tasks.map(task => {
            const newProgress = Math.max(0, task.progress - 20);
            let newStatus: "In Progress" | "On Target" | "Overdue" | "Completed" = task.status;
            if (task.progress <= 70 && task.status === "On Target") {
              newStatus = "In Progress";
            }
            return {
              ...task,
              progress: newProgress,
              status: newStatus
            };
          })
        };
      }

      return {
        ...baseData,
        title: `${baseData.title} - ${selectedGanttProject}`,
        projectName: `${baseData.projectName} - ${selectedGanttProject}`,
      };
    }
    return undefined;
  }, [chartType, ganttData, selectedFilters, selectedGanttProject]);

  const currentHorizontalBarTopPerformer = useMemo(() => {
  if (chartType !== 'horizontalbar' || !horizontalBarData) return undefined;  // CHANGED: null → undefined
  
  const selectedYear = selectedFilters['SelectYear'] || '2026';
  const selectedMonth = selectedFilters['SelectMonth'] || 'January';
  
  const yearData = horizontalBarData[selectedYear] as Record<string, Record<string, {Revenue: number, Profit: number, Cost: number}>>;
  const monthData = yearData?.[selectedMonth];
  
  if (!monthData) return undefined;  // CHANGED: null → undefined
  
  const monthOrder = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];
  const currentMonthIndex = monthOrder.indexOf(selectedMonth);
  const previousMonth = currentMonthIndex > 0 ? monthOrder[currentMonthIndex - 1] : 'December';
  const previousYear = currentMonthIndex > 0 ? selectedYear : String(Number(selectedYear) - 1);
  
  const previousYearData = horizontalBarData[previousYear] as Record<string, Record<string, {Revenue: number, Profit: number, Cost: number}>> | undefined;
  const previousMonthData = previousYearData?.[previousMonth];
  
  const products = Object.keys(monthData);
  let maxRevenue = 0;
  let topProduct = '';
  let minRevenue = Infinity;
  let needsFocusProduct = '';
  
  products.forEach(product => {
    const revenue = monthData[product].Revenue;
    if (revenue > maxRevenue) {
      maxRevenue = revenue;
      topProduct = product;
    }
    if (revenue < minRevenue) {
      minRevenue = revenue;
      needsFocusProduct = product;
    }
  });
  
  let percentageChange = 0;
  let isIncrease = true;
  
  if (previousMonthData && previousMonthData[topProduct]) {
    const currentRevenue = monthData[topProduct].Revenue;
    const previousRevenue = previousMonthData[topProduct].Revenue;
    
    if (previousRevenue !== 0) {
      percentageChange = ((currentRevenue - previousRevenue) / previousRevenue) * 100;
      isIncrease = percentageChange >= 0;
    }
  }
  
  const topProductData = monthData[topProduct];
  return {
    category: "Category",
    name: topProduct,
    revenue: `${topProductData.Revenue}k`,
    profit: `${topProductData.Profit}k`,
    needsFocus: needsFocusProduct,
    change: `${Math.abs(percentageChange).toFixed(0)}%`,
    isIncrease: isIncrease
  };
}, [chartType, horizontalBarData, selectedFilters]);

  const calendarPeakAndActiveDay = useMemo(() => {
    if (chartType !== 'calendarheatmap' || !calendarheatmapData) {
      return {
        peakDay: { date: '', dayName: '', value: 0 },
        mostActiveDay: { dayName: '', count: 0, average: 0 }
      };
    }

    const year = selectedFilters['SelectYear'] || '2026';
    const type = selectedFilters['SelectType'] || 'Development';
    const project = selectedCalendarHeatmapProject;

    if (!calendarheatmapData[project] || !calendarheatmapData[project][year] || !calendarheatmapData[project][year][type]) {
      return {
        peakDay: { date: '', dayName: '', value: 0 },
        mostActiveDay: { dayName: '', count: 0, average: 0 }
      };
    }

    const yearData = calendarheatmapData[project][year][type];
    let allDayData: { date: string; value: number; dayName: string }[] = [];
    const dayOfWeekCounts: Record<string, { total: number; count: number }> = {
      'Sunday': { total: 0, count: 0 },
      'Monday': { total: 0, count: 0 },
      'Tuesday': { total: 0, count: 0 },
      'Wednesday': { total: 0, count: 0 },
      'Thursday': { total: 0, count: 0 },
      'Friday': { total: 0, count: 0 },
      'Saturday': { total: 0, count: 0 }
    };

    Object.keys(yearData).forEach(monthName => {
      const monthData = yearData[monthName];
      if (monthData && monthData.data && Array.isArray(monthData.data)) {
        monthData.data.forEach((item: { date: string; value: number }) => {
          const [yearPart, monthPart, dayPart] = item.date.split('-').map(n => parseInt(n));
          const dateObj = new Date(yearPart, monthPart - 1, dayPart);
          const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
          const dayName = dayNames[dateObj.getDay()];
          
          allDayData.push({
            date: item.date,
            value: item.value,
            dayName: dayName
          });

          if (dayOfWeekCounts[dayName]) {
            dayOfWeekCounts[dayName].total += item.value;
            dayOfWeekCounts[dayName].count += 1;
          }
        });
      }
    });

    let peakDay = { date: '', dayName: '', value: 0 };
    if (allDayData.length > 0) {
      const peak = allDayData.reduce((max, current) => 
        current.value > max.value ? current : max
      );
      peakDay = peak;
    }

    let mostActiveDay = { dayName: '', count: 0, average: 0 };
    Object.entries(dayOfWeekCounts).forEach(([dayName, stats]) => {
      if (stats.count > 0) {
        const average = stats.total / stats.count;
        if (average > mostActiveDay.average) {
          mostActiveDay = {
            dayName: dayName,
            count: stats.count,
            average: Math.round(average)
          };
        }
      }
    });

    return { peakDay, mostActiveDay };
  }, [chartType, calendarheatmapData, selectedFilters, selectedCalendarHeatmapProject]);

  const formatPeakDate = (dateStr: string) => {
    if (!dateStr) return 'Wed, 12 Jun';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    } catch {
      return 'Wed, 12 Jun';
    }
  };

  const currentBulletData = useMemo(() => {
    if (!bulletData) return null;

    const year = selectedFilters.SelectYear || '2026';
    const month = selectedFilters.SelectMonth || 'January';
    const type = selectedFilters.SelectType || 'Sales';

    const yearData = (bulletData as any)[year];
    if (yearData) {
      const typeData = yearData[type];
      if (typeData) {
        const monthData = typeData[month];
        if (monthData && monthData.bullets) {
          return {
            title: monthData.title || bulletData.title,
            bullets: monthData.bullets
          };
        }
      }
    }

    return {
      title: bulletData.title,
      bullets: bulletData.bullets
    };
  }, [bulletData, selectedFilters]);



  // ADD KPI data memoization - CORRECTED VERSION
const currentKPIData = useMemo(() => {
  if (chartType !== 'kpi' || !kpiData) return null;
  
  const kpiKey = selectedFilters['SelectKPI'];
  
  console.log('KPI Chart - Selected Filter:', kpiKey); // DEBUG LOG
  console.log('KPI Chart - Available Keys:', Object.keys(kpiData)); // DEBUG LOG
  
  if (!kpiKey) {
    const firstKey = Object.keys(kpiData)[0];
    console.log('KPI Chart - Using first key:', firstKey); // DEBUG LOG
    return kpiData[firstKey] || null;
  }
  
  const data = kpiData[kpiKey];
  console.log('KPI Chart - Data for key:', data); // DEBUG LOG
  
  return data || null;
}, [chartType, kpiData, selectedFilters]);


  /* ==========================================================================
     RENDER CHART FUNCTION
     ========================================================================== */

  const renderChart = () => {
    switch (chartType) {
      case "pie":
      case "doughnut":
      case "line":
      case "area":
      case "bar":
        if (currentData) {
          return (
            <PieLineBarChart
              chartType={chartType as PieLineBarChartType}
              data={currentData}
            />
          );
        }
        return null;

      case "bullet":
        if (currentBulletData) {
          return (
            <BulletChart
              title={currentBulletData.title}
              bullets={currentBulletData.bullets}
            />
          );
        }
        return null;

      case "gauge": {
        if (gaugeData) {
          const selectedYear = selectedFilters['SelectYear'] || '2026';
          const selectedMonth = selectedFilters['SelectMonth'] || 'January';
          let currentGauge = gaugeData.gauges || [];
          
          // FIXED: Cast to any for dynamic access
          if ((gaugeData as any)[selectedYear]?.[selectedMonth]) {
            currentGauge = (gaugeData as any)[selectedYear][selectedMonth];
          }
          
          return (
            <GaugeChart
              title="Performance Metrics"
              gauges={currentGauge}
            />
          );
        }
        return null;
      }

      case "gantt": {
        if (currentGanttData) {
          const month = selectedFilters['SelectMonth'] || 'Jan - Feb';
          const year = selectedFilters['SelectYear'] || '2026';
          return (
            <GanttChart
              data={currentGanttData}
              selectedYear={year}
              selectedMonth={month}
              selectedProject={selectedGanttProject}
              onProjectChange={setSelectedGanttProject}
            />
          );
        }
        return null;
      }

      case "calendarheatmap": {
        if (calendarheatmapData && calendarheatmapData[selectedCalendarHeatmapProject]) {
          const year = selectedFilters['SelectYear'] || '2026';
          const type = selectedFilters['SelectType'] || 'Development';
          const projectData = calendarheatmapData[selectedCalendarHeatmapProject];
          
          const yearData = projectData[year];
          if (!yearData || !yearData[type]) {
            return null;
          }

          const heatmapDataForChart = yearData[type];
          
          return (
            <CalendarHeatmapChart
              data={heatmapDataForChart}
              selectedProject={selectedCalendarHeatmapProject}
              selectedYear={year}
              selectedType={type}
              onProjectChange={setSelectedCalendarHeatmapProject}
              calendarheatmapData={calendarheatmapData}
            />
          );
        }
        return null;
      }

      case "horizontalbar": {
        if (!horizontalBarData) return null;
        
        const selectedYear = selectedFilters['SelectYear'] || '2026';
        const selectedMonth = selectedFilters['SelectMonth'] || 'January';
        const selectedProduct = selectedFilters['SelectType'] || 'Product 1';
        
        const yearData = horizontalBarData[selectedYear] as Record<string, Record<string, {Revenue: number, Profit: number, Cost: number}>>;
        const monthData = yearData?.[selectedMonth];
        const productData = monthData?.[selectedProduct];
        
        const xAxisConfig = horizontalBarData.xAxis?.[selectedYear];
        
        const bars: HorizontalBarItem[] = productData ? [
          { name: 'Revenue', value: productData.Revenue, color: 'rgba(23, 97, 163, 1)' },
          { name: 'Profit', value: productData.Profit, color: 'rgba(70, 194, 155, 1)' },
          { name: 'Cost', value: productData.Cost, color: 'rgba(47, 164, 169, 1)' }
        ] : [];
        
        return (
          <HorizontalBarChart 
            title={horizontalBarData.title} 
            bars={bars} 
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
            selectedType={selectedProduct}
            xAxisConfig={xAxisConfig}
            topPerformer={currentHorizontalBarTopPerformer} 
          />
        );
      }

      case "columnchart": {
        if (!columnChartData) return null;
        
        const selectedYear = selectedFilters['SelectYear'] || '2026';
        const selectedMonth = selectedFilters['SelectMonth'] || 'January';
        const selectedType = selectedFilters['SelectType'] || 'Category A';
        
        const yearData = (columnChartData as any)?.[selectedYear];
        const monthData = yearData?.[selectedMonth];
        const typeData = monthData?.[selectedType] || [];
        
        const yAxisConfig = columnChartData.yAxis?.[selectedYear];
        
        const columns: ColumnItem[] = typeData.map((item: any) => ({
          name: item.name,
          value: item.value,
          gradient: item.gradient || 'linear-gradient(180deg, rgba(77, 175, 131, 1) 0%, rgba(23, 97, 163, 1) 100%)'
        }));
        
        return (
          <ColumnChart 
            title={columnChartData.title} 
            columns={columns}
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
            selectedType={selectedType}
            yAxisConfig={yAxisConfig}
          />
        );
      }

      case "lollipop": {
        if (!lollipopData) return null;
        
        const lollipopYear = selectedFilters['SelectYear'] || '2026';
        const lollipopMonth = selectedFilters['SelectMonth'] || 'January';
        const lollipopCategory = selectedFilters['SelectType'] || 'Category A';
        const lollipopOrientation = selectedFilters['SelectOrientation'] || 'horizontal';
        
        // FIXED: Cast lollipopData to any before accessing dynamic property
        const lollipopYearData = ((lollipopData as any)[lollipopYear] || {}) as Record<string, Record<string, LollipopItem[]>>;
        const lollipopMonthData = lollipopYearData?.[lollipopMonth];
        const lollipopCategoryData = lollipopMonthData?.[lollipopCategory] || [];
        
        return (
          <LollipopChart 
            title={lollipopData.title} 
            items={lollipopCategoryData}
            selectedYear={lollipopYear}
            selectedMonth={lollipopMonth}
            selectedCategory={lollipopCategory}
            orientation={lollipopOrientation as "horizontal" | "vertical"}
          />
        );
      }


      case "kpi": {
      if (currentKPIData) {
        return <KPIChart 
                  data={currentKPIData} 
                />;
      }
      return null;
      }

      case "riskgauge": {
        if (riskGaugeData) {
          const selectedYear = selectedFilters['SelectYear'] || '2026';
          const selectedMonth = selectedFilters['SelectMonth'] || 'January';
          const selectedType = selectedFilters['SelectType'] || 'Credit Score';
          
          let currentRiskGauges = riskGaugeData.gauges || [];
          
          if ((riskGaugeData as any)[selectedYear]?.[selectedMonth]?.[selectedType]) {
            currentRiskGauges = (riskGaugeData as any)[selectedYear][selectedMonth][selectedType];
          }
          
          return (
            <RiskGaugeChart
              title="KPI Risk Assessment Metrics"
              gauges={currentRiskGauges}
            />
          );
        }
        return null;
      }

      case "groupbar": {
        if (!groupBarData) return null;
        
        const selectedYear = selectedFilters['SelectYear'] || '2026';
        const selectedMonth = selectedFilters['SelectMonth'] || 'January';
        
        const yearData = (groupBarData as any)?.[selectedYear];
        const monthData = yearData?.[selectedMonth];
        const groups: GroupBarItem[] = monthData || [];
        
        const yAxisConfig = groupBarData.yAxis?.[selectedYear];
        const legends = groupBarData.legends;  // ✅ GET LEGENDS FROM DATA
        
        return (
          <GroupBarChart 
            title={groupBarData.title} 
            groups={groups}
            legends={legends}  // ✅ PASS LEGENDS
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
            yAxisConfig={yAxisConfig}
          />
        );
      }

      default:
        return null;
    }
  };

  /* ==========================================================================
     MAIN RENDER
     ========================================================================== */

  return (
    <MainContainer>
      {/* ===== TABS SECTION ===== */}
      <TabsSection>
        <TabsWrapper>
          {chartTypes.map((type) => {
            const isActive = chartType === type;
            return (
              <TabButton
                key={type}
                type="button"
                $isActive={isActive}
                onClick={() => {
                  setChartType(type);
                  onChartTypeChange?.(type);
                }}
                aria-pressed={isActive}
              >
                {tabLabel(type)}
              </TabButton>
            );
          })}
        </TabsWrapper>
      </TabsSection>

      {/* ===== FILTERS SECTION ===== */}
      <FiltersSection>
        <FiltersWrapper>
          {currentFilters.map((filter: Filter, index: number) => {
    const options: DropdownOption[] = filter.options.map((opt: string) => ({
      key: opt,
      value: opt,
    }));


            return (
              <FilterDropdownWrapper 
        key={filter.id}
        $zIndex={50 + (currentFilters.length - index)}
      >
        <ChartDropdown
          options={options}
          value={selectedFilters[filter.id]} // This should show current value
          onSelect={(val) => {
            console.log('Dropdown onSelect called:', val, 'for filter:', filter.id); // ADD THIS
            onFiltersChange({ ...selectedFilters, [filter.id]: String(val) })
          }}
          variant="mahatiFilter"
          label={filter.label}
        />
      </FilterDropdownWrapper>
            );
          })}
          <ApplyButton
            type="button"
            onClick={() => onApplyFilters?.(selectedFilters)}
          >
            Apply
          </ApplyButton>
        </FiltersWrapper>
      </FiltersSection>

      {/* ===== CONTENT SECTION ===== */}
      <ContentSection>
        {/* ===== PIE/DOUGHNUT LAYOUT ===== */}
        {isPieFamily && (
          <PieGrid>
            <Card style={{ overflow: 'visible' }}>
              <CardHeaderRow>
                <MenuButton type="button">
                  <MenuDots>
                    <MenuDot />
                    <MenuDot />
                    <MenuDot />
                  </MenuDots>
                </MenuButton>
              </CardHeaderRow>

              <ChartContainer>
                {renderChart()}
              </ChartContainer>

              <DetailsSection>
                {details.map((item, idx) => (
                  <DetailRow key={idx}>
                    <DetailLeft>
                      <ColorBlock $color={colorToClass(item.color)} />
                      <DetailLabel>{item.label}</DetailLabel>
                    </DetailLeft>
                    <DetailValue>{item.value}</DetailValue>
                  </DetailRow>
                ))}
              </DetailsSection>
            </Card>

            <DetailsCard>
              <DetailsCardTitle>Details</DetailsCardTitle>
              <DetailsList>
                {details.map((item, idx) => {
                  const statusColors = item.status ? getStatusColors(item.status) : null;
                  
                  return (
                    <DetailItem key={idx}>
                      <DetailColorBar $color={colorToClass(item.color)} />
                      <DetailContent>
                        <DetailHeader>
                          <DetailItemLabel>{item.label}</DetailItemLabel>
                          {item.status && statusColors && (
                            <StatusBadge $bgColor={statusColors.backgroundColor}>
                              <StatusText $color={statusColors.textColor}>
                                {item.status}
                              </StatusText>
                            </StatusBadge>
                          )}
                        </DetailHeader>
                        <DetailDescription>{item.description}</DetailDescription>
                      </DetailContent>
                      <DetailItemValue>{item.value}</DetailItemValue>
                    </DetailItem>
                  );
                })}
              </DetailsList>
            </DetailsCard>

            <QuickStatsColumn>
              <QuickStatCard>
                <StatLabel>Total Volume</StatLabel>
                <StatValue>{quickStats.totalVolume.value}</StatValue>
                <StatChange $isPositive={quickStats.totalVolume.change.startsWith("+")}>
                  {quickStats.totalVolume.change}
                </StatChange>
                <StatDescription>{quickStats.totalVolume.description}</StatDescription>
              </QuickStatCard>

              <QuickStatCard>
                <StatLabel>Transactions</StatLabel>
                <StatValue>{quickStats.transactions.value}</StatValue>
                <StatDescription>{quickStats.transactions.description}</StatDescription>
              </QuickStatCard>
            </QuickStatsColumn>
          </PieGrid>
        )}

        {/* ===== BULLET CHART LAYOUT ===== */}
        {chartType === "bullet" && (
          <TwoColumnGrid>
            <MainChartCard>
              <ChartWrapper>
                {renderChart()}
              </ChartWrapper>
            </MainChartCard>

            <Sidebar>
              <SidebarCard>
                <SidebarTitle>Details</SidebarTitle>
                <div>
  {currentBulletData?.bullets.map((bullet: any, idx: number) => {  // ADDED TYPES
    const percentage = Math.round((bullet.achieved / bullet.target) * 100);
    
    return (
      <BulletDetailItem key={idx}>
        <BulletDetailLeft>
          <BulletDetailLabel>{bullet.name}</BulletDetailLabel>
          <BulletDetailDescription>
            {bullet.achieved.toLocaleString()} / {bullet.target.toLocaleString()}
          </BulletDetailDescription>
        </BulletDetailLeft>
        <BulletPercentageBox $label={bullet.name}>
          {percentage}%
        </BulletPercentageBox>
      </BulletDetailItem>
    );
  })}
</div>
                
                <BulletDetailsCardFooter>
                  <BulletDetailsIcon>
                    <BulletDetailsIconText>i</BulletDetailsIconText>
                  </BulletDetailsIcon>
                  <BulletDetailsFooterText>
                    Suggested Actions:<BulletDetailsFooterBold> Optimizing pricing or reduce operational costs.</BulletDetailsFooterBold>
                  </BulletDetailsFooterText>
                </BulletDetailsCardFooter>
              </SidebarCard>

              <GaugeQuickInsightsCard>
                <GaugeInsightsHeader>
                  <GaugeInsightsTitle>Quick Insights</GaugeInsightsTitle>
                  <GaugeInsightsDate>
                    {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </GaugeInsightsDate>
                </GaugeInsightsHeader>

                <GaugeVolume>Total Volume</GaugeVolume>
                <GaugeVolumeValue>$33,850.00</GaugeVolumeValue>
                <GaugeDivider />

                <GaugePeakDay>
                  <GaugePeakIcon src={getIconSrc(performancePeakIcon, FALLBACK_ICONS.performancePeakIcon)} alt="" />
                </GaugePeakDay>
                <GaugePeakLabel>Peak Day</GaugePeakLabel>
                <GaugePeakDate>Wed, 12 Jun</GaugePeakDate>
                <GaugePeakEvents>5,600 events</GaugePeakEvents>

                <GaugeActiveDayBox>
                  <GaugeActiveIcon src={getIconSrc(calendarIcon, FALLBACK_ICONS.calendarIcon)} alt="" />
                </GaugeActiveDayBox>
                <GaugeActiveLabel>Most Active Day</GaugeActiveLabel>
                <GaugeActiveDayValue>Wednesday</GaugeActiveDayValue>
                <GaugeActiveAvg>Avg 920 / day</GaugeActiveAvg>
              </GaugeQuickInsightsCard>
            </Sidebar>
          </TwoColumnGrid>
        )}

        {/* ===== GAUGE CHART LAYOUT ===== */}
        {chartType === "gauge" && gaugeData && (
          <TwoColumnGrid>
            <MainChartCard>
              <ChartWrapper>
                {renderChart()}
              </ChartWrapper>
            </MainChartCard>

            <Sidebar>
              {(() => {
                const selectedYear = selectedFilters['SelectYear'] || '2026';
                const selectedMonth = selectedFilters['SelectMonth'] || 'January';
                let currentGauge = gaugeData.gauges && gaugeData.gauges.length > 0 ? gaugeData.gauges[0] : null;
                
                if (gaugeData[selectedYear]?.[selectedMonth]) {
                  const filteredGauges = gaugeData[selectedYear][selectedMonth];
                  if (filteredGauges && filteredGauges.length > 0) {
                    currentGauge = filteredGauges[0];
                  }
                }
                
                if (!currentGauge) return null;
                
                const gauge = currentGauge;
                const dailyAvgNeeded = Math.round(gauge.value / 30);
                const currentPace = 360;
                const daysRemaining = 8;

                const yearNum = parseInt(selectedYear);
                const monthName = selectedMonth;
                const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                                    'July', 'August', 'September', 'October', 'November', 'December'];
                const monthIndex = monthNames.indexOf(monthName);

                const lastDayOfMonth = new Date(yearNum, monthIndex + 1, 0);
                const lastDay = lastDayOfMonth.getDate();
                const lastDayWeekday = lastDayOfMonth.getDay();

                let lastFriday;
                if (lastDayWeekday === 5) {
                  lastFriday = lastDay;
                } else if (lastDayWeekday < 5) {
                  lastFriday = lastDay - (lastDayWeekday + 2);
                } else {
                  lastFriday = lastDay - 1;
                }
                
                const expectedFinish = new Date(yearNum, monthIndex, lastFriday);
                const formattedDate = expectedFinish.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

                return (
                  <GoalHealthCard>
                    <GoalHealthHeader>
                      <GoalHealthTitle>Goal Health</GoalHealthTitle>
                      <GoalHealthBadge>
                        <GoalHealthBadgeText>On Track</GoalHealthBadgeText>
                        <GoalHealthMenuButton>
                          <GoalHealthMenuIcon width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                            <circle cx="8" cy="4" r="1"/>
                            <circle cx="8" cy="8" r="1"/>
                            <circle cx="8" cy="12" r="1"/>
                          </GoalHealthMenuIcon>
                        </GoalHealthMenuButton>
                      </GoalHealthBadge>
                    </GoalHealthHeader>
                    
                    <GoalHealthStatsGrid>
                      <GoalHealthStat>
                        <GoalHealthStatLabel>Current Pace</GoalHealthStatLabel>
                        <GoalHealthStatValue>{currentPace} / day</GoalHealthStatValue>
                      </GoalHealthStat>
                      <GoalHealthStat>
                        <GoalHealthStatLabel>Required Pace</GoalHealthStatLabel>
                        <GoalHealthStatValue>{dailyAvgNeeded} / day</GoalHealthStatValue>
                      </GoalHealthStat>
                    </GoalHealthStatsGrid>
                    
                    <GoalHealthStatsGrid>
                      <GoalHealthStat>
                        <GoalHealthStatLabel>Days Remaining</GoalHealthStatLabel>
                        <GoalHealthStatValue>{daysRemaining} days</GoalHealthStatValue>
                      </GoalHealthStat>
                      <GoalHealthStat>
                        <GoalHealthStatLabel>Expected Finish</GoalHealthStatLabel>
                        <GoalHealthStatValue>{formattedDate}</GoalHealthStatValue>
                      </GoalHealthStat>
                    </GoalHealthStatsGrid>
                  </GoalHealthCard>
                );
              })()}

              <GaugeQuickInsightsCard>
                <GaugeInsightsHeader>
                  <GaugeInsightsTitle>Quick Insights</GaugeInsightsTitle>
                  <GaugeInsightsDate>
                    {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </GaugeInsightsDate>
                </GaugeInsightsHeader>

                <GaugeVolume>Total Volume</GaugeVolume>
                <GaugeVolumeValue>$33,850.00</GaugeVolumeValue>
                <GaugeDivider />

                <GaugePeakDay>
                  <GaugePeakIcon src={getIconSrc(performancePeakIcon, FALLBACK_ICONS.performancePeakIcon)} alt="" />
                </GaugePeakDay>
                <GaugePeakLabel>Peak Day</GaugePeakLabel>
                <GaugePeakDate>Wed, 12 Jun</GaugePeakDate>
                <GaugePeakEvents>5,600 events</GaugePeakEvents>

                <GaugeActiveDayBox>
                  <GaugeActiveIcon src={getIconSrc(calendarIcon, FALLBACK_ICONS.calendarIcon)} alt="" />
                  </GaugeActiveDayBox>
                  <GaugeActiveLabel>Most Active Day</GaugeActiveLabel>
                  <GaugeActiveDayValue>Wednesday</GaugeActiveDayValue>
                  <GaugeActiveAvg>Avg 920 / day</GaugeActiveAvg>
                  </GaugeQuickInsightsCard>
                  </Sidebar>
                  </TwoColumnGrid>
                  )}


        {/* // FIND the GAUGE CHART LAYOUT section and ADD this AFTER it: */}

      {/* ===== RISK GAUGE CHART LAYOUT ===== */}
      {/* ===== RISK GAUGE CHART LAYOUT ===== */}
{/* ===== RISK GAUGE CHART LAYOUT ===== */}
{chartType === "riskgauge" && riskGaugeData && (
  <TwoColumnGrid>
    <MainChartCard>
      <ChartWrapper>
        {renderChart()}
      </ChartWrapper>
    </MainChartCard>

    <Sidebar>
      {(() => {
        const selectedYear = selectedFilters['SelectYear'] || '2026';
        const selectedMonth = selectedFilters['SelectMonth'] || 'January';
        const selectedType = selectedFilters['SelectType'] || 'Credit Score';
        
        let currentRiskGauge = riskGaugeData.gauges && riskGaugeData.gauges.length > 0 ? riskGaugeData.gauges[0] : null;
        
        if ((riskGaugeData as any)[selectedYear]?.[selectedMonth]?.[selectedType]) {
          const filteredRiskGauges = (riskGaugeData as any)[selectedYear][selectedMonth][selectedType];
          if (filteredRiskGauges && filteredRiskGauges.length > 0) {
            currentRiskGauge = filteredRiskGauges[0];
          }
        }
        
        if (!currentRiskGauge) return null;
        
        const gauge = currentRiskGauge;
        const maxScore = gauge.max || 100;
        const dailyAvgNeeded = Math.round(gauge.score / 30);
        const currentPace = Math.round(gauge.score / 20);
        const daysRemaining = 8;

        return (
          <GoalHealthCard>
            <GoalHealthHeader>
              <GoalHealthTitle>Risk Health</GoalHealthTitle>
              <GoalHealthBadge>
                <GoalHealthBadgeText>On Track</GoalHealthBadgeText>
                <GoalHealthMenuButton>
                  <GoalHealthMenuIcon width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <circle cx="8" cy="4" r="1"/>
                    <circle cx="8" cy="8" r="1"/>
                    <circle cx="8" cy="12" r="1"/>
                  </GoalHealthMenuIcon>
                </GoalHealthMenuButton>
              </GoalHealthBadge>
            </GoalHealthHeader>
            
            <GoalHealthStatsGrid>
              <GoalHealthStat>
                <GoalHealthStatLabel>Current Pace</GoalHealthStatLabel>
                <GoalHealthStatValue>{currentPace} / day</GoalHealthStatValue>
              </GoalHealthStat>
              <GoalHealthStat>
                <GoalHealthStatLabel>Required Pace</GoalHealthStatLabel>
                <GoalHealthStatValue>{dailyAvgNeeded} / day</GoalHealthStatValue>
              </GoalHealthStat>
            </GoalHealthStatsGrid>
            
            <GoalHealthStatsGrid>
              <GoalHealthStat>
                <GoalHealthStatLabel>Days Remaining</GoalHealthStatLabel>
                <GoalHealthStatValue>{daysRemaining} days</GoalHealthStatValue>
              </GoalHealthStat>
              <GoalHealthStat>
                <GoalHealthStatLabel>Max Score</GoalHealthStatLabel>
                <GoalHealthStatValue>{maxScore}</GoalHealthStatValue>
              </GoalHealthStat>
            </GoalHealthStatsGrid>
          </GoalHealthCard>
        );
      })()}

      <GaugeQuickInsightsCard>
  <GaugeInsightsHeader>
    <GaugeInsightsTitle>Quick Insights</GaugeInsightsTitle>
    <GaugeInsightsDate>
  {`${selectedFilters['SelectYear'] || '2026'} : ${selectedFilters['SelectMonth'] || 'January'} : ${selectedFilters['SelectType'] || 'Credit Score'}`}
</GaugeInsightsDate>
  </GaugeInsightsHeader>

  <GaugeVolume>Risk Score</GaugeVolume>
  <GaugeVolumeValue>
    {(() => {
      const selectedYear = selectedFilters['SelectYear'] || '2026';
      const selectedMonth = selectedFilters['SelectMonth'] || 'January';
      const selectedType = selectedFilters['SelectType'] || 'Credit Score';
      return (riskGaugeData as any)?.[selectedYear]?.[selectedMonth]?.[selectedType]?.[0]?.score || 0;
    })()}
  </GaugeVolumeValue>
  <GaugeDivider />

  {/* DYNAMIC PEAK PERFORMANCE */}
  {(() => {
    const selectedYear = selectedFilters['SelectYear'] || '2026';
    const selectedType = selectedFilters['SelectType'] || 'Credit Score';
    
    let peakMonth = '';
    let peakScore = -1;
    let peakDate = '';
    let peakLabel = '';
    
    // Find peak performance across all months for selected year and type
    const yearData = (riskGaugeData as any)?.[selectedYear];
    if (yearData) {
      Object.keys(yearData).forEach(month => {
        const monthData = yearData[month]?.[selectedType];
        if (monthData && Array.isArray(monthData)) {
          monthData.forEach((item: any, index: number) => {
            if (item.score > peakScore) {
              peakScore = item.score;
              peakMonth = month;
              
              // Check if there's a date property (daily data)
              if (item.date) {
                peakDate = item.date;
              } else {
                // Use middle of the month (15th)
                const monthIndex = ['January', 'February', 'March', 'April', 'May', 'June', 
                                   'July', 'August', 'September', 'October', 'November', 'December'].indexOf(month);
                const date = new Date(parseInt(selectedYear), monthIndex, 15);
                peakDate = date.toISOString().split('T')[0];
              }
            }
          });
        }
      });
    }
    
    // Format peak date
    if (peakDate) {
      const date = new Date(peakDate);
      peakLabel = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    } else {
      peakLabel = 'N/A';
    }
    
    return (
      <>
        <GaugePeakDay>
          <GaugePeakIcon src={getIconSrc(performancePeakIcon, FALLBACK_ICONS.performancePeakIcon)} alt="" />
        </GaugePeakDay>
        <GaugePeakLabel>Peak Performance</GaugePeakLabel>
        <GaugePeakDate>{peakLabel}</GaugePeakDate>
        <GaugePeakEvents>{peakScore > 0 ? `Score: ${peakScore}` : 'No data'}</GaugePeakEvents>
      </>
    );
  })()}

  {/* DYNAMIC ASSESSMENT DAY */}
  {/* DYNAMIC ASSESSMENT DAY */}
{(() => {
  const selectedYear = selectedFilters['SelectYear'] || '2026';
  const selectedType = selectedFilters['SelectType'] || 'Credit Score';
  
  let peakMonth = '';
  let peakScore = -1;
  let peakDate = '';
  let assessmentDay = 'Wednesday'; // Default
  let avgScore = 0;
  let totalScore = 0;
  let count = 0;
  
  // Find peak performance to determine assessment day
  const yearData = (riskGaugeData as any)?.[selectedYear];
  if (yearData) {
    Object.keys(yearData).forEach(month => {
      const monthData = yearData[month]?.[selectedType];
      if (monthData && Array.isArray(monthData)) {
        monthData.forEach((item: any) => {
          totalScore += item.score || 0;
          count++;
          
          // Track peak performance
          if (item.score > peakScore) {
            peakScore = item.score;
            peakMonth = month;
            
            // Get the date of peak performance
            if (item.date) {
              const date = new Date(item.date);
              assessmentDay = date.toLocaleDateString('en-US', { weekday: 'long' });
            } else {
              // Use middle of month (15th) if no date
              const monthIndex = ['January', 'February', 'March', 'April', 'May', 'June', 
                                 'July', 'August', 'September', 'October', 'November', 'December'].indexOf(month);
              const date = new Date(parseInt(selectedYear), monthIndex, 15);
              assessmentDay = date.toLocaleDateString('en-US', { weekday: 'long' });
            }
          }
        });
      }
    });
  }
  
  // Calculate average score
  avgScore = count > 0 ? Math.round(totalScore / count) : 0;
  
  return (
    <>
      <GaugeActiveDayBox>
        <GaugeActiveIcon src={getIconSrc(calendarIcon, FALLBACK_ICONS.calendarIcon)} alt="" />
      </GaugeActiveDayBox>
      <GaugeActiveLabel>Assessment Day</GaugeActiveLabel>
      <GaugeActiveDayValue>{assessmentDay}</GaugeActiveDayValue>
      <GaugeActiveAvg>Avg Score: {avgScore}</GaugeActiveAvg>
    </>
  );
})()}
</GaugeQuickInsightsCard>
    </Sidebar>
  </TwoColumnGrid>
)}


              {/* ===== GANTT CHART LAYOUT ===== */}
    {chartType === "gantt" && (
      <GanttGrid>
        <GanttChartCard>
          <GanttChartWrapper>
            {renderChart()}
          </GanttChartWrapper>
        </GanttChartCard>

        <GanttSidebar>
          <GanttQuickInsightsCard>
            <GanttInsightsTitle>Quick Insights - All Titles</GanttInsightsTitle>
            <GanttProjectInfo>
              Showing data for: {selectedGanttProject}
            </GanttProjectInfo>
            <GanttTaskList>
              {currentGanttData?.tasks.map((task) => {
                const taskColor = GANTT_COLORS[task.color] || GANTT_COLORS.blue;
                return (
                  <GanttTaskItem key={task.id}>
                    <GanttTaskDot $color={taskColor} />
                    <GanttTaskContent>
                      <GanttTaskName>{task.name}</GanttTaskName>
                      <GanttTaskProgress>{task.progress}% complete</GanttTaskProgress>
                    </GanttTaskContent>
                    <GanttTaskStatus
                      $bgColor={getStatusColors(task.status).backgroundColor}
                      $color={getStatusColors(task.status).textColor}
                    >
                      {task.status}
                    </GanttTaskStatus>
                  </GanttTaskItem>
                );
              })}
            </GanttTaskList>
          </GanttQuickInsightsCard>

          <ProjectSummaryCard>
            <ProjectSummaryTitle>Project Summary</ProjectSummaryTitle>
            <ProjectSummaryContent>
              <div>
                <ProjectSummaryLabel>Overall Status</ProjectSummaryLabel>
                <ProjectStatusGrid>
                  <ProjectStatusBox $bgColor="rgba(254, 242, 242, 1)">
                    <ProjectStatusLabel $color="rgba(220, 38, 38, 1)">Overdue</ProjectStatusLabel>
                    <ProjectStatusValue>
                      {currentGanttData?.tasks.filter(task => task.status === "Overdue").length || 0}
                    </ProjectStatusValue>
                  </ProjectStatusBox>
                  <ProjectStatusBox $bgColor="rgba(239, 246, 255, 1)">
                    <ProjectStatusLabel $color="rgba(37, 99, 235, 1)">In Progress</ProjectStatusLabel>
                    <ProjectStatusValue>
                      {currentGanttData?.tasks.filter(task => task.status === "In Progress").length || 0}
                    </ProjectStatusValue>
                  </ProjectStatusBox>
                </ProjectStatusGrid>
                <ProjectStatusGridFull>
                  <ProjectStatusBox $bgColor="rgba(240, 253, 244, 1)">
                    <ProjectStatusLabel $color="rgba(22, 163, 74, 1)">On Target</ProjectStatusLabel>
                    <ProjectStatusValue>
                      {currentGanttData?.tasks.filter(task => task.status === "On Target").length || 0}
                    </ProjectStatusValue>
                  </ProjectStatusBox>
                </ProjectStatusGridFull>
              </div>
              <ProjectExpectedDate>
                {(() => {
                  if (!currentGanttData?.tasks || currentGanttData.tasks.length === 0) {
                    return "Expected by 25 Feb 2025";
                  }
                  
                  const lastTask = currentGanttData.tasks[currentGanttData.tasks.length - 1];
                  const endDate = lastTask.endDate;
                  
                  const [day, month] = endDate.split('/');
                  
                  const monthNames: Record<string, string> = {
                    '01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr',
                    '05': 'May', '06': 'Jun', '07': 'Jul', '08': 'Aug',
                    '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec'
                  };
                  
                  const monthName = monthNames[month] || 'Jan';
                  const year = selectedFilters['SelectYear'] || '2026';
                  
                  return `Expected by ${day} ${monthName} ${year}`;
                })()}
              </ProjectExpectedDate>
            </ProjectSummaryContent>
          </ProjectSummaryCard>
        </GanttSidebar>
      </GanttGrid>
    )}

    {/* ===== CALENDAR HEATMAP LAYOUT ===== */}
    {chartType === "calendarheatmap" && (
      <CalendarGrid>
        <CalendarChartCard>
          <CalendarChartWrapper>
            {renderChart()}
          </CalendarChartWrapper>
        </CalendarChartCard>

        <CalendarSidebar>
          <ActivityLegendCard>
            <ActivityLegendTitle>Activity Legend</ActivityLegendTitle>
            <ActivityLegendList>
              <ActivityLegendItem>
                <ActivityLegendColor $bgColor="rgba(154, 219, 255, 1)" />
                <ActivityLegendLabel>&lt;1K: Low activity</ActivityLegendLabel>
              </ActivityLegendItem>
              <ActivityLegendItem>
                <ActivityLegendColor $bgColor="rgba(102, 194, 241, 1)" />
                <ActivityLegendLabel>1K - 3K: Moderate activity</ActivityLegendLabel>
              </ActivityLegendItem>
              <ActivityLegendItem>
                <ActivityLegendColor $bgColor="rgba(43, 160, 209, 1)" />
                <ActivityLegendLabel>3K - 5K: High activity</ActivityLegendLabel>
              </ActivityLegendItem>
              <ActivityLegendItem>
                <ActivityLegendColor $bgColor="rgba(23, 97, 163, 1)" />
                <ActivityLegendLabel>&gt;5K: Very high activity</ActivityLegendLabel>
              </ActivityLegendItem>
            </ActivityLegendList>
          </ActivityLegendCard>

          <CalendarQuickInsightsCard>
            <CalendarInsightsHeader>
              <CalendarInsightsTitle>Quick Insights</CalendarInsightsTitle>
              <CalendarInsightsSubtitle>
                {selectedFilters['SelectYear'] || '2026'}, {selectedCalendarHeatmapProject}, {selectedFilters['SelectType'] || 'Development'}
              </CalendarInsightsSubtitle>
            </CalendarInsightsHeader>

            <div>
              <CalendarTotalVolumeLabel>Total Volume</CalendarTotalVolumeLabel>
              <CalendarTotalVolumeValue>${quickStats.totalVolume.value}</CalendarTotalVolumeValue>
            </div>
            
            <CalendarDivider />

            <CalendarPeakDayWrapper>
              <CalendarPeakDayIconBox>
                <CalendarIcon src={getIconSrc(performancePeakIcon, FALLBACK_ICONS.performancePeakIcon)} alt="" />
              </CalendarPeakDayIconBox>
              <CalendarPeakDayContent>
                <CalendarPeakDayLabel>Peak Day</CalendarPeakDayLabel>
                <CalendarPeakDayValue>
                  {formatPeakDate(calendarPeakAndActiveDay.peakDay.date)}
                </CalendarPeakDayValue>
                <CalendarPeakDayCount>
                  {calendarPeakAndActiveDay.peakDay.value 
                    ? `${calendarPeakAndActiveDay.peakDay.value.toLocaleString()} events`
                    : '5,600 events'}
                </CalendarPeakDayCount>
              </CalendarPeakDayContent>
            </CalendarPeakDayWrapper>

            <CalendarActiveDayWrapper>
              <CalendarActiveDayIconBox>
                <CalendarIcon src={getIconSrc(calendarIcon, FALLBACK_ICONS.calendarIcon)} alt="" />
              </CalendarActiveDayIconBox>
              <CalendarActiveDayContent>
                <CalendarActiveDayLabel>Most Active Day</CalendarActiveDayLabel>
                <CalendarActiveDayValue>
                  {calendarPeakAndActiveDay.mostActiveDay.dayName || 'Wednesday'}
                </CalendarActiveDayValue>
                <CalendarActiveDayAvg>
                  Avg {calendarPeakAndActiveDay.mostActiveDay.average || 920} / day
                </CalendarActiveDayAvg>
              </CalendarActiveDayContent>
            </CalendarActiveDayWrapper>
          </CalendarQuickInsightsCard>
        </CalendarSidebar>
      </CalendarGrid>
    )}

    {/* ===== HORIZONTAL BAR LAYOUT ===== */}
    {chartType === "horizontalbar" && (
      <TwoColumnGrid>
        <MainChartCard style={{ minHeight: '350px' }}>
          <ChartWrapper>
            {renderChart()}
          </ChartWrapper>
        </MainChartCard>

        <HorizontalBarSidebar>
          <DemoLegendsCard>
            <DemoLegendsTitle>Demo Legends</DemoLegendsTitle>
            <DemoLegendsList>
              <DemoLegendItem>
                <DemoLegendColor $bgColor="rgba(23, 97, 163, 1)" />
                <DemoLegendLabel>Revenue</DemoLegendLabel>
              </DemoLegendItem>
              <DemoLegendItem>
                <DemoLegendColor $bgColor="rgba(70, 194, 155, 1)" />
                <DemoLegendLabel>Profit</DemoLegendLabel>
              </DemoLegendItem>
              <DemoLegendItem>
                <DemoLegendColor $bgColor="rgba(47, 164, 169, 1)" />
                <DemoLegendLabel>Cost</DemoLegendLabel>
              </DemoLegendItem>
            </DemoLegendsList>
          </DemoLegendsCard>

          {currentHorizontalBarTopPerformer && (
            <TopPerformerCard>
              <TopPerformerHeader>
                <TopPerformerTitle>Top Performer</TopPerformerTitle>
                <TopPerformerIndicator 
                  $color={currentHorizontalBarTopPerformer.isIncrease 
                    ? 'rgba(46, 158, 120, 1)' 
                    : 'rgba(220, 38, 38, 1)'}
                >
                  <TopPerformerArrow 
                    $isIncrease={currentHorizontalBarTopPerformer.isIncrease}
                    width="14" 
                    height="14" 
                    viewBox="0 0 14 14" 
                    fill="none"
                  >
                    <path d="M7 0L13.9282 13.5H0.0717969L7 0Z" fill="currentColor"/>
                  </TopPerformerArrow>
                  <TopPerformerChange>{currentHorizontalBarTopPerformer.change}</TopPerformerChange>
                </TopPerformerIndicator>
              </TopPerformerHeader>
              
              <TopPerformerContent>
                <div>
                  <TopPerformerLabel>Category</TopPerformerLabel>
                  <TopPerformerValue>{currentHorizontalBarTopPerformer.name}</TopPerformerValue>
                </div>
                
                <TopPerformerStatsGrid>
                  <TopPerformerStat>
                    <TopPerformerStatLabel>Revenue</TopPerformerStatLabel>
                    <TopPerformerStatValue $color="rgba(37,99,235,1)">
                      {currentHorizontalBarTopPerformer.revenue}
                    </TopPerformerStatValue>
                  </TopPerformerStat>
                  <TopPerformerStat>
                    <TopPerformerStatLabel>Profit</TopPerformerStatLabel>
                    <TopPerformerStatValue $color="rgba(77,175,131,1)">
                      {currentHorizontalBarTopPerformer.profit}
                    </TopPerformerStatValue>
                  </TopPerformerStat>
                </TopPerformerStatsGrid>
                
                <TopPerformerNeedsFocus>
                  <TopPerformerNeedsFocusLabel>Needs Focus:</TopPerformerNeedsFocusLabel>
                  <TopPerformerNeedsFocusValue>
                    {currentHorizontalBarTopPerformer.needsFocus}
                  </TopPerformerNeedsFocusValue>
                </TopPerformerNeedsFocus>
              </TopPerformerContent>
            </TopPerformerCard>
          )}
        </HorizontalBarSidebar>
      </TwoColumnGrid>
    )}

    {/* ===== COLUMN CHART LAYOUT ===== */}
    {/* ===== COLUMN CHART LAYOUT ===== */}
    {/* ===== COLUMN CHART LAYOUT ===== */}
    {chartType === "columnchart" && (
      <TwoColumnGrid>
        <MainChartCard style={{ minHeight: '350px' }}>
          <ChartWrapper>
            {renderChart()}
          </ChartWrapper>
        </MainChartCard>

        <Sidebar>
          {/* TOP CATEGORY CARD */}
          <TopPerformerCard>
            <TopPerformerHeader>
              <TopPerformerTitle>Top Category</TopPerformerTitle>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                background: 'rgba(77, 175, 131, 0.15)',
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '10px',
                fontWeight: '600',
                color: 'rgba(77, 175, 131, 1)',
                fontFamily: 'Poppins, sans-serif'
              }}>
                Leading
              </div>
            </TopPerformerHeader>
            
            <TopPerformerContent>
              {(() => {
                if (!columnChartData) return null;
                
                const selectedYear = selectedFilters['SelectYear'] || '2026';
                const selectedMonth = selectedFilters['SelectMonth'] || 'January';
                const selectedType = selectedFilters['SelectType'] || 'Category A';
                
                const yearData = (columnChartData as any)?.[selectedYear];
                const monthData = yearData?.[selectedMonth];
                const typeData = monthData?.[selectedType] || [];
                
                const topPerformer = typeData.reduce((max: any, item: any) => 
                  item.value > max.value ? item : max, 
                  typeData[0] || { name: 'N/A', value: 0 }
                );
                
                const totalRevenue = typeData.reduce((sum: number, item: any) => sum + item.value, 0);
                const contribution = totalRevenue > 0 
                  ? Math.round((topPerformer.value / totalRevenue) * 100) 
                  : 0;
                
                const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                                  'July', 'August', 'September', 'October', 'November', 'December'];
                const currentMonthIndex = monthNames.indexOf(selectedMonth);
                const previousMonth = currentMonthIndex > 0 
                  ? monthNames[currentMonthIndex - 1] 
                  : 'December';
                const previousYear = currentMonthIndex > 0 
                  ? selectedYear 
                  : String(Number(selectedYear) - 1);
                
                const prevYearData = (columnChartData as any)?.[previousYear];
                const prevMonthData = prevYearData?.[previousMonth];
                const prevTypeData = prevMonthData?.[selectedType] || [];
                const prevTopPerformer = prevTypeData.find((item: any) => item.name === topPerformer.name);
                
                const growth = prevTopPerformer && prevTopPerformer.value > 0
                  ? Math.round(((topPerformer.value - prevTopPerformer.value) / prevTopPerformer.value) * 100)
                  : 14;
                
                const sortedByValue = [...typeData].sort((a: any, b: any) => b.value - a.value);
                const rank = sortedByValue.findIndex((item: any) => item.name === topPerformer.name) + 1;
                
                return (
                  <>
                    <div style={{ 
                      fontSize: '16px', 
                      fontWeight: '600',
                      color: 'rgba(23, 97, 163, 1)',
                      fontFamily: 'Poppins, sans-serif',
                      marginBottom: '20px'
                    }}>
                      {topPerformer.name}
                    </div>
                    
                    <TopPerformerStatsGrid>
                      <TopPerformerStat>
                        <TopPerformerStatLabel>Revenue</TopPerformerStatLabel>
                        <TopPerformerStatValue>
                          {topPerformer.value >= 1000 
                            ? `${(topPerformer.value / 1000).toFixed(1)}k` 
                            : topPerformer.value}
                        </TopPerformerStatValue>
                      </TopPerformerStat>
                      
                      <TopPerformerStat>
                        <TopPerformerStatLabel>Contribution</TopPerformerStatLabel>
                        <TopPerformerStatValue>{contribution}%</TopPerformerStatValue>
                      </TopPerformerStat>
                    </TopPerformerStatsGrid>
                    
                    <TopPerformerStatsGrid style={{ marginTop: '16px' }}>
                      <TopPerformerStat>
                        <TopPerformerStatLabel>Growth</TopPerformerStatLabel>
                        <TopPerformerStatValue $color={growth >= 0 ? 'rgba(46, 158, 120, 1)' : 'rgba(220, 38, 38, 1)'}>
                          {growth >= 0 ? '+' : ''}{growth}%
                        </TopPerformerStatValue>
                      </TopPerformerStat>
                      
                      <TopPerformerStat>
                        <TopPerformerStatLabel>Rank</TopPerformerStatLabel>
                        <TopPerformerStatValue>#{rank}</TopPerformerStatValue>
                      </TopPerformerStat>
                    </TopPerformerStatsGrid>
                  </>
                );
              })()}
            </TopPerformerContent>
          </TopPerformerCard>

          {/* QUICK INSIGHTS CARD - WITH FLEX ALIGNMENT */}
          {/* QUICK INSIGHTS CARD - WITH FLEX ALIGNMENT */}
    {/* QUICK INSIGHTS CARD - WITH FLEX ALIGNMENT AND DYNAMIC PERCENTAGE */}
    <SidebarCard style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '40px'
      }}>
        <SidebarTitle style={{ marginBottom: '0' }}>Quick Insights</SidebarTitle>
        <div style={{ 
          fontSize: '10px',
          color: 'rgba(107, 114, 128, 1)',
          fontFamily: 'Poppins, sans-serif',
          fontWeight: '500'
        }}>
          {(() => {
            const month = selectedFilters['SelectMonth'] || 'January';
            const year = selectedFilters['SelectYear'] || '2026';
            return `${month} ${year}`;
          })()}
        </div>
      </div>
      
      <div style={{ 
        fontSize: '12px',
        color: 'rgba(17, 24, 39, 1)',
        fontWeight: '600',
        marginBottom: '30px',
        fontFamily: 'Poppins, sans-serif'
      }}>
        Total Volume
      </div>
      
      {(() => {
        if (!columnChartData) return null;
        
        const selectedYear = selectedFilters['SelectYear'] || '2026';
        const selectedMonth = selectedFilters['SelectMonth'] || 'January';
        const selectedType = selectedFilters['SelectType'] || 'Category A';
        
        // Get current month data
        const yearData = (columnChartData as any)?.[selectedYear];
        const monthData = yearData?.[selectedMonth];
        const typeData = monthData?.[selectedType] || [];
        const currentTotal = typeData.reduce((sum: number, item: any) => sum + item.value, 0);
        
        // Calculate previous month
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                          'July', 'August', 'September', 'October', 'November', 'December'];
        const currentMonthIndex = monthNames.indexOf(selectedMonth);
        const previousMonth = currentMonthIndex > 0 
          ? monthNames[currentMonthIndex - 1] 
          : 'December';
        const previousYear = currentMonthIndex > 0 
          ? selectedYear 
          : String(Number(selectedYear) - 1);
        
        // Get previous month data
        const prevYearData = (columnChartData as any)?.[previousYear];
        const prevMonthData = prevYearData?.[previousMonth];
        const prevTypeData = prevMonthData?.[selectedType] || [];
        const previousTotal = prevTypeData.reduce((sum: number, item: any) => sum + item.value, 0);
        
        // Calculate percentage change
        let percentageChange = 0;
        if (previousTotal > 0) {
          percentageChange = Math.round(((currentTotal - previousTotal) / previousTotal) * 100);
        }
        
        const isIncrease = percentageChange >= 0;
        const absPercentage = Math.abs(percentageChange);
        
        // Colors for increase/decrease
        const bgColor = isIncrease ? 'rgba(209, 250, 229, 1)' : 'rgba(254, 226, 226, 1)';
        const textColor = isIncrease ? 'rgba(5, 150, 105, 1)' : 'rgba(220, 38, 38, 1)';
        
        return (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px' 
          }}>
            <div style={{ 
              fontSize: '24px',
              fontWeight: '700',
              color: 'rgba(17, 24, 39, 1)',
              fontFamily: 'Poppins, sans-serif',
              letterSpacing: '-0.5px'
            }}>
              ${currentTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            
            {/* Dynamic Badge - Green for Increase, Red for Decrease */}
            {/* Dynamic Badge - Green for Increase, Red for Decrease */}
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      padding: '6px 10px',
      borderRadius: '6px',
      background: bgColor,
      flexShrink: 0
    }}>
      <img 
        src={isIncrease 
          ? getIconSrc(increaseIcon, FALLBACK_ICONS.increaseIcon)
          : getIconSrc(decreaseIcon, FALLBACK_ICONS.decreaseIcon)
        }
        alt={isIncrease ? "increase" : "decrease"}
        style={{
          width: '14px',
          height: '14px',
          objectFit: 'contain'
        }}
      />
      <span style={{
        fontSize: '12px',
        fontWeight: '600',
        color: textColor,
        fontFamily: 'Poppins, sans-serif'
      }}>
        {absPercentage}%
      </span>
    </div>
          </div>
        );
      })()}
    </SidebarCard>
        </Sidebar>
      </TwoColumnGrid>
    )}

    {/* ===== GROUP BAR CHART LAYOUT ===== */}
    {/* ===== GROUP BAR CHART LAYOUT ===== */}
    {chartType === "groupbar" && (
      <TwoColumnGrid>
        <MainChartCard style={{ minHeight: '350px' }}>
          <ChartWrapper>
            {renderChart()}
          </ChartWrapper>
        </MainChartCard>

        <Sidebar>  {/* ✅ ADD OPENING TAG HERE */}
          {/* LEGENDS CARD - DYNAMIC FROM JSON */}
          {(() => {
            if (!groupBarData) return null;
            
            // Get legends from JSON data
            const legends: GroupBarLegendItem[] = groupBarData.legends || [];
            
            // Fallback to default if no legends in JSON
            if (legends.length === 0) {
              return (
                <SidebarCard>
                  <SidebarTitle>Legends</SidebarTitle>
                  <GroupBarLegendsList>
                    <DemoLegendItem>
                      <DemoLegendColor $bgColor="rgba(23, 97, 163, 1)" />
                      <DemoLegendLabel>Revenue</DemoLegendLabel>
                    </DemoLegendItem>
                    <DemoLegendItem>
                      <DemoLegendColor $bgColor="rgba(77, 175, 131, 1)" />
                      <DemoLegendLabel>Profit</DemoLegendLabel>
                    </DemoLegendItem>
                    <DemoLegendItem>
                      <DemoLegendColor $bgColor="rgba(220, 38, 38, 1)" />
                      <DemoLegendLabel>Loss</DemoLegendLabel>
                    </DemoLegendItem>
                    <DemoLegendItem>
                      <DemoLegendColor $bgColor="rgba(47, 164, 169, 1)" />
                      <DemoLegendLabel>Cost</DemoLegendLabel>
                    </DemoLegendItem>
                  </GroupBarLegendsList>
                </SidebarCard>
              );
            }
            
            // Render dynamic legends from JSON
            return (
              <SidebarCard>
                <SidebarTitle>Legends</SidebarTitle>
                <GroupBarLegendsList>
                  {legends.map((legend, index) => (
                    <DemoLegendItem key={legend.key || index}>
                      <DemoLegendColor $bgColor={legend.color} />
                      <DemoLegendLabel>{legend.label}</DemoLegendLabel>
                    </DemoLegendItem>
                  ))}
                </GroupBarLegendsList>
              </SidebarCard>
            );
          })()}

          {/* TOP PERFORMER CARD - USE DYNAMIC COLORS */}
          {(() => {
            if (!groupBarData) return null;
            
            const selectedYear = selectedFilters['SelectYear'] || '2026';
            const selectedMonth = selectedFilters['SelectMonth'] || 'January';
            
            const yearData = (groupBarData as any)?.[selectedYear];
            const monthData = yearData?.[selectedMonth];
            const groups: GroupBarItem[] = monthData || [];
            
            if (groups.length === 0) return null;
            
            // ✅ GET COLORS FROM LEGENDS
            const legends: GroupBarLegendItem[] = groupBarData.legends || [];
            const getColor = (key: string, fallback: string): string => {
              const legend = legends.find(l => l.key === key);
              return legend?.color || fallback;
            };
            
            const revenueColor = getColor('revenue', 'rgba(37,99,235,1)');
            const profitColor = getColor('profit', 'rgba(77,175,131,1)');
            const lossColor = getColor('loss', 'rgba(220,38,38,1)');
            
            // ✅ Helper to get profit/loss (auto-calculate if not provided)
            const getProfitOrLoss = (group: GroupBarItem): number => {
              if (group.profitOrLoss !== undefined && group.profitOrLoss !== null) {
                return group.profitOrLoss;
              }
              return group.revenue - group.cost;
            };
            
            // Find top performer by revenue
            const topPerformer = groups.reduce((max, item) => 
              item.revenue > max.revenue ? item : max, 
              groups[0]
            );
            
            // Check if top performer has profit or loss
            const topPerformerProfitLoss = getProfitOrLoss(topPerformer);
            const isTopPerformerProfitable = topPerformerProfitLoss >= 0;
            const topPerformerProfitLossAbs = Math.abs(topPerformerProfitLoss);
            
            // Calculate month-over-month change
            const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                               'July', 'August', 'September', 'October', 'November', 'December'];
            const currentMonthIndex = monthNames.indexOf(selectedMonth);
            const previousMonth = currentMonthIndex > 0 
              ? monthNames[currentMonthIndex - 1] 
              : 'December';
            const previousYear = currentMonthIndex > 0 
              ? selectedYear 
              : String(Number(selectedYear) - 1);
            
            const prevYearData = (groupBarData as any)?.[previousYear];
            const prevMonthData = prevYearData?.[previousMonth];
            const prevGroups: GroupBarItem[] = prevMonthData || [];
            const prevTopPerformer = prevGroups.find(item => item.name === topPerformer.name);
            
            const percentageChange = prevTopPerformer && prevTopPerformer.revenue > 0
              ? Math.round(((topPerformer.revenue - prevTopPerformer.revenue) / prevTopPerformer.revenue) * 100)
              : 12;
            
            const isIncrease = percentageChange >= 0;
            
            // Find product needing focus (lowest revenue OR highest loss)
            let needsFocus = groups.reduce((min, item) => 
              item.revenue < min.revenue ? item : min, 
              groups[0]
            );
            
            // Check if any product has loss
            const lossProducts = groups.filter(item => getProfitOrLoss(item) < 0);
            if (lossProducts.length > 0) {
              // Find product with highest loss
              needsFocus = lossProducts.reduce((maxLoss, item) => 
                getProfitOrLoss(item) < getProfitOrLoss(maxLoss) ? item : maxLoss,
                lossProducts[0]
              );
            }
            
            const needsFocusProfitLoss = getProfitOrLoss(needsFocus);
            const needsFocusHasLoss = needsFocusProfitLoss < 0;
            
            return (
              <TopPerformerCard>
                <TopPerformerHeader>
                  <TopPerformerTitle>Top Performer</TopPerformerTitle>
                  <TopPerformerIndicator 
                    $color={isIncrease ? 'rgba(46, 158, 120, 1)' : 'rgba(220, 38, 38, 1)'}
                  >
                    <TopPerformerArrow 
                      $isIncrease={isIncrease}
                      width="14" 
                      height="14" 
                      viewBox="0 0 14 14" 
                      fill="none"
                    >
                      <path d="M7 0L13.9282 13.5H0.0717969L7 0Z" fill="currentColor"/>
                    </TopPerformerArrow>
                    <TopPerformerChange>{Math.abs(percentageChange)}%</TopPerformerChange>
                  </TopPerformerIndicator>
                </TopPerformerHeader>
                
                <TopPerformerContent>
                  <div>
                    <TopPerformerLabel>Category</TopPerformerLabel>
                    <TopPerformerValue>{topPerformer.name}</TopPerformerValue>
                  </div>
                  
                  <TopPerformerStatsGrid>
                    <TopPerformerStat>
                      <TopPerformerStatLabel>Revenue</TopPerformerStatLabel>
                      <TopPerformerStatValue $color={revenueColor}>
                        {topPerformer.revenue}k
                      </TopPerformerStatValue>
                    </TopPerformerStat>
                    <TopPerformerStat>
                      <TopPerformerStatLabel>{isTopPerformerProfitable ? 'Profit' : 'Loss'}</TopPerformerStatLabel>
                      <TopPerformerStatValue $color={isTopPerformerProfitable ? profitColor : lossColor}>
                        {topPerformerProfitLossAbs}k
                      </TopPerformerStatValue>
                    </TopPerformerStat>
                  </TopPerformerStatsGrid>
                  
                  <TopPerformerNeedsFocus>
                    <TopPerformerNeedsFocusLabel>Needs Focus:</TopPerformerNeedsFocusLabel>
                    <TopPerformerNeedsFocusValue>
                      {needsFocus.name} {needsFocusHasLoss ? '(Loss)' : '(Low Revenue)'}
                    </TopPerformerNeedsFocusValue>
                  </TopPerformerNeedsFocus>
                </TopPerformerContent>
              </TopPerformerCard>
            );
          })()}
        </Sidebar>  {/* ✅ CLOSING TAG IS NOW CORRECT */}
      </TwoColumnGrid>
    )}

    {/* ===== LOLLIPOP CHART LAYOUT ===== */}
        {chartType === "lollipop" && (
          <TwoColumnGrid>
            <MainChartCard style={{ minHeight: '350px' }}>
              <ChartWrapper>
                {renderChart()}
              </ChartWrapper>
            </MainChartCard>

            <LollipopSidebar>
              <LollipopLegendsCard>
                <LollipopLegendsTitle>
  {(() => {
    const firstFilterId = currentFilters[currentFilters.length - 2]?.id;
    const firstFilter = currentFilters.find((f: Filter) => f.id === firstFilterId);
    return firstFilter?.label || 'Categories';
  })()}
</LollipopLegendsTitle>
<LollipopLegendsList>
  {(() => {
    const firstFilterId = currentFilters[currentFilters.length - 2]?.id;
    const firstFilter = currentFilters.find((f: Filter) => f.id === firstFilterId);
    const colors = [
      'rgba(37, 99, 235, 1)',
      'rgba(16, 185, 129, 1)',
      'rgba(245, 158, 11, 1)',
      'rgba(239, 68, 68, 1)',
      'rgba(147, 51, 234, 1)',
    ];
    
    return (firstFilter?.options || []).map((option: string, idx: number) => (
      <LollipopLegendItem key={option}>
        <LollipopLegendColor $bgColor={colors[idx % colors.length]} />
        <LollipopLegendLabel>{option}</LollipopLegendLabel>
      </LollipopLegendItem>
    ));
  })()}
</LollipopLegendsList>
              </LollipopLegendsCard>

              <LollipopSummaryCard>
                <LollipopSummaryHeader>
                  <LollipopSummaryTitle>Monthly Summary</LollipopSummaryTitle>
                  <LollipopSummaryMenuButton>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <circle cx="8" cy="4" r="1"/>
                      <circle cx="8" cy="8" r="1"/>
                      <circle cx="8" cy="12" r="1"/>
                    </svg>
                  </LollipopSummaryMenuButton>
                </LollipopSummaryHeader>
                
                <LollipopSummaryContent>
                  {/* Best Product and Lowest Product Row */}
                  <LollipopSummaryRow>
                    <LollipopSummaryItem>
                      <LollipopSummaryLabel>Best Product</LollipopSummaryLabel>
                      <LollipopSummaryValue>
  {lollipopData && (() => {
    const firstFilterId = currentFilters[0]?.id;
    const secondFilterId = currentFilters[1]?.id;
    const thirdFilterId = currentFilters[2]?.id;
    
    const year = selectedFilters[firstFilterId] || currentFilters[0]?.options[0] || '2026';
    const month = selectedFilters[secondFilterId] || currentFilters[1]?.options[0] || 'January';
    const category = selectedFilters[thirdFilterId] || currentFilters[2]?.options[0] || 'Category A';
    
    // FIXED: Cast lollipopData to any before accessing dynamic property
    const yearData = ((lollipopData as any)[year] || {}) as Record<string, Record<string, LollipopItem[]>>;
    const monthData = yearData?.[month];
    const categoryData = monthData?.[category] || [];
    
    if (categoryData.length === 0) return 'N/A';
    
    const maxItem = categoryData.reduce((max, item) => 
      item.value > max.value ? item : max, 
      categoryData[0]
    );
    
    return maxItem.label;
  })()}
</LollipopSummaryValue>
                    </LollipopSummaryItem>
                    
                    <LollipopSummaryItem>
                      <LollipopSummaryLabel>Lowest Product</LollipopSummaryLabel>
                      <LollipopSummaryValue>
  {lollipopData && (() => {
    const firstFilterId = currentFilters[0]?.id;
    const secondFilterId = currentFilters[1]?.id;
    const thirdFilterId = currentFilters[2]?.id;
    
    const year = selectedFilters[firstFilterId] || currentFilters[0]?.options[0] || '2026';
    const month = selectedFilters[secondFilterId] || currentFilters[1]?.options[0] || 'January';
    const category = selectedFilters[thirdFilterId] || currentFilters[2]?.options[0] || 'Category A';
    
    // FIXED: Add fallback for empty object
    const yearData = ((lollipopData as any)[year] || {}) as Record<string, Record<string, LollipopItem[]>>;
    const monthData = yearData?.[month];
    const categoryData = monthData?.[category] || [];
    
    if (categoryData.length === 0) return 'N/A';
    
    const minItem = categoryData.reduce((min, item) => 
      item.value < min.value ? item : min, 
      categoryData[0]
    );
    
    return minItem.label;
  })()}
</LollipopSummaryValue>
                    </LollipopSummaryItem>
                  </LollipopSummaryRow>
                  
                  {/* Average and Trend Row */}
                  <LollipopSummaryRow>
                    <LollipopSummaryItem>
                      <LollipopSummaryLabel>Average</LollipopSummaryLabel>
                      <LollipopSummaryValue>
  {lollipopData && (() => {
    const firstFilterId = currentFilters[0]?.id;
    const secondFilterId = currentFilters[1]?.id;
    const thirdFilterId = currentFilters[2]?.id;
    
    const year = selectedFilters[firstFilterId] || currentFilters[0]?.options[0] || '2026';
    const month = selectedFilters[secondFilterId] || currentFilters[1]?.options[0] || 'January';
    const category = selectedFilters[thirdFilterId] || currentFilters[2]?.options[0] || 'Category A';
    
    // FIXED: Cast lollipopData to any
    const yearData = ((lollipopData as any)[year] || {}) as Record<string, Record<string, LollipopItem[]>>;
    const monthData = yearData?.[month];
    const categoryData = monthData?.[category] || [];
    
    if (categoryData.length === 0) return 0;
    
    const total = categoryData.reduce((sum, item) => sum + item.value, 0);
    const avg = Math.round(total / categoryData.length);
    
    return avg;
  })()}
</LollipopSummaryValue>
                    </LollipopSummaryItem>
                    
                    <LollipopSummaryItem>
                      <LollipopSummaryLabel>Trend</LollipopSummaryLabel>
                      <LollipopTrendWrapper>
  {lollipopData && (() => {
    const firstFilterId = currentFilters[0]?.id;
    const secondFilterId = currentFilters[1]?.id;
    const thirdFilterId = currentFilters[2]?.id;
    
    const year = selectedFilters[firstFilterId] || currentFilters[0]?.options[0] || '2026';
    const month = selectedFilters[secondFilterId] || currentFilters[1]?.options[0] || 'January';
    const category = selectedFilters[thirdFilterId] || currentFilters[2]?.options[0] || 'Category A';
    
    // FIXED: Cast lollipopData to any
    const yearData = ((lollipopData as any)[year] || {}) as Record<string, Record<string, LollipopItem[]>>;
    const monthData = yearData?.[month];
    const categoryData = monthData?.[category] || [];
    
    if (categoryData.length === 0) {
      return (
        <LollipopTrendIndicator $isPositive={true}>
          <LollipopTrendArrow $isPositive={true} width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 0L13.9282 13.5H0.0717969L7 0Z" fill="currentColor"/>
          </LollipopTrendArrow>
          <LollipopTrendText>Positive</LollipopTrendText>
        </LollipopTrendIndicator>
      );
    }
    
    const total = categoryData.reduce((sum, item) => sum + item.value, 0);
    const average = total / categoryData.length;
    const itemsAboveAverage = categoryData.filter(item => item.value > average).length;
    const itemsBelowOrEqualAverage = categoryData.length - itemsAboveAverage;
    const isPositive = itemsAboveAverage > itemsBelowOrEqualAverage;
    
    return (
      <LollipopTrendIndicator $isPositive={isPositive}>
        <LollipopTrendArrow $isPositive={isPositive} width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M7 0L13.9282 13.5H0.0717969L7 0Z" fill="currentColor"/>
        </LollipopTrendArrow>
        <LollipopTrendText>{isPositive ? 'Positive' : 'Negative'}</LollipopTrendText>
      </LollipopTrendIndicator>
    );
  })()}
</LollipopTrendWrapper>
                    </LollipopSummaryItem>

                  </LollipopSummaryRow>
                  
                  {/* Needs Focus Row */}
                  <LollipopSummaryFullWidth>
                    <LollipopNeedsFocusWrapper>
                      <LollipopNeedsFocusLabel>Needs Focus:</LollipopNeedsFocusLabel>
                      <LollipopNeedsFocusValue>
  {lollipopData && (() => {
    const firstFilterId = currentFilters[0]?.id;
    const secondFilterId = currentFilters[1]?.id;
    const thirdFilterId = currentFilters[2]?.id;
    
    const year = selectedFilters[firstFilterId] || currentFilters[0]?.options[0] || '2026';
    const month = selectedFilters[secondFilterId] || currentFilters[1]?.options[0] || 'January';
    const category = selectedFilters[thirdFilterId] || currentFilters[2]?.options[0] || 'Category A';
    
    // FIXED: Cast lollipopData to any
    const yearData = ((lollipopData as any)[year] || {}) as Record<string, Record<string, LollipopItem[]>>;
    const monthData = yearData?.[month];
    const categoryData = monthData?.[category] || [];
    
    if (categoryData.length === 0) return 'N/A';
    
    const minItem = categoryData.reduce((min, item) => 
      item.value < min.value ? item : min, 
      categoryData[0]
    );
    
    return minItem.label;
  })()}
</LollipopNeedsFocusValue>
                    </LollipopNeedsFocusWrapper>
                  </LollipopSummaryFullWidth>
                </LollipopSummaryContent>
              </LollipopSummaryCard>
            </LollipopSidebar>
          </TwoColumnGrid>
        )}


      {/* ===== KPI CHART LAYOUT ===== */}
  {chartType === "kpi" && currentKPIData && (
  <div style={{ width: '100%' }}>
    {renderChart()}
  </div>
)}



    {/* ===== LINE/AREA/BAR LAYOUT ===== */}
    {/* ===== LINE/AREA/BAR LAYOUT ===== */}
{(chartType === "line" || chartType === "area" || chartType === "bar") && !isPieFamily ? (
  <TwoColumnGrid>
    <MainChartCard>
      <ChartWrapper>
        {renderChart()}
      </ChartWrapper>
    </MainChartCard>

    <Sidebar>
      <SidebarCard>
        <SidebarTitle>Details</SidebarTitle>
        <SidebarDetailsList>
          {details.map((item, idx) => {
            let bgColor = "rgba(229, 231, 235, 0.5)";
            if (item.label === "Revenue") {
              bgColor = "rgba(70, 194, 155, 0.15)";
            } else if (item.label === "Profit") {
              bgColor = "rgba(239, 68, 68, 0.15)";
            } else if (item.label === "New Customers") {
              bgColor = "rgba(23, 97, 163, 0.15)";
            }
            
            return (
              <SidebarDetailItem key={idx}>
                <SidebarDetailContent>
                  <SidebarDetailLabel>{item.label}</SidebarDetailLabel>
                  <SidebarDetailDescription>{item.description}</SidebarDetailDescription>
                </SidebarDetailContent>
                <PercentageBadge $bgColor={bgColor}>
                  {item.value}
                </PercentageBadge>
              </SidebarDetailItem>
            );
          })}
        </SidebarDetailsList>
      </SidebarCard>

      <SidebarCard>
        <SidebarTitle>Quick Stats</SidebarTitle>
        <div style={{ marginBottom: '12px' }}>
          <StatLabel>Total Volume</StatLabel>
          <StatValue style={{ fontSize: '20px', marginTop: '8px' }}>
            {quickStats.totalVolume.value}
          </StatValue>
          <StatDescription style={{ marginTop: '4px' }}>
            {quickStats.totalVolume.description}
          </StatDescription>
        </div>
        <div>
          <StatLabel>Transactions</StatLabel>
          <StatValue style={{ fontSize: '20px', marginTop: '8px' }}>
            {quickStats.transactions.value}
          </StatValue>
          <StatDescription style={{ marginTop: '4px' }}>
            {quickStats.transactions.description}
          </StatDescription>
        </div>
      </SidebarCard>
    </Sidebar>
  </TwoColumnGrid>
) : null}
  </ContentSection>
</MainContainer>
);
};
MahatiChartAnalyticsWidget.displayName = "MahatiChartAnalyticsWidget";