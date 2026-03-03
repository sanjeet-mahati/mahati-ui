"use client";
import React, { useMemo, useState, useRef, useEffect } from "react";
import styled from "@emotion/styled";

/* ============================================================================
   STYLED COMPONENTS
   ============================================================================ */

const Container = styled.div`
  width: 100%;
  height: 350px;
  border-radius: 10px;
  border: 1px solid rgba(23, 97, 163, 1);
  background: rgba(241, 247, 248, 1);
  padding: 16px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  overflow: hidden;
  display: flex;
  flex-direction: column;

  @media (min-width: 640px) {
    padding: 20px 24px 24px 24px;
    height: 350px;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 12px;

  @media (min-width: 640px) {
    margin-bottom: 14px;
  }

  @media (min-width: 1024px) {
    margin-bottom: 16px;
  }
`;

const TimePeriodTabs = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 6px;
  align-items: center;

  @media (min-width: 640px) {
    gap: 8px;
  }
`;

const TimePeriodTab = styled.button<{ $isActive: boolean }>`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 500;
  font-family: 'Inter', 'Poppins', sans-serif;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  
  ${props => props.$isActive 
    ? `
      background-color: rgba(23, 97, 163, 1);
      color: white;
    `
    : `
      background-color: transparent;
      color: rgba(148, 163, 184, 1);
      
      &:hover {
        background-color: rgba(23, 97, 163, 0.1);
        color: rgba(23, 97, 163, 1);
      }
    `
  }

  @media (min-width: 640px) {
    padding: 5px 14px;
    font-size: 12px;
  }

  @media (min-width: 1024px) {
    padding: 6px 16px;
    font-size: 13px;
  }
`;

const HeaderLeft = styled.div`
  position: relative;
  flex: 1;
`;

const HeaderRight = styled.div`
  position: relative;
  flex-shrink: 0;
`;

const Title = styled.h3`
  color: rgba(148, 163, 184, 1);
  font-family: 'Inter', 'Poppins', sans-serif;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: -0.01em;
  line-height: 1.4;

  @media (min-width: 640px) {
    font-size: 14px;
  }

  @media (min-width: 1024px) {
    font-size: 15px;
  }
`;

const ChangeIndicator = styled.div<{ $isPositive: boolean }>`
  display: flex;
  align-items: center;
  gap: 3px;
  padding: 3px 8px;
  border-radius: 6px;
  background-color: ${props => props.$isPositive 
    ? 'rgba(209, 250, 229, 1)' 
    : 'rgba(254, 226, 226, 1)'};
  transition: background-color 0.3s ease-in-out;
  
  @media (min-width: 640px) {
    padding: 4px 10px;
    gap: 4px;
  }
`;

const ChangeIcon = styled.svg<{ $isPositive: boolean }>`
  width: 11px;
  height: 11px;
  fill: ${props => props.$isPositive 
    ? 'rgba(34, 197, 94, 1)' 
    : 'rgba(239, 68, 68, 1)'};
  transition: fill 0.3s ease-in-out, transform 0.3s ease-in-out;
  
  @media (min-width: 640px) {
    width: 12px;
    height: 12px;
  }

  @media (min-width: 1024px) {
    width: 13px;
    height: 13px;
  }
`;

const ChangeText = styled.span<{ $isPositive: boolean }>`
  color: ${props => props.$isPositive 
    ? 'rgba(34, 197, 94, 1)' 
    : 'rgba(239, 68, 68, 1)'};
  font-family: 'Inter', 'Poppins', sans-serif;
  font-size: 11px;
  font-weight: 600;
  transition: color 0.3s ease-in-out;
  
  @media (min-width: 640px) {
    font-size: 12px;
  }

  @media (min-width: 1024px) {
    font-size: 13px;
  }
`;

const ValueSection = styled.div`
  margin-bottom: 14px;

  @media (min-width: 640px) {
    margin-bottom: 16px;
  }

  @media (min-width: 1024px) {
    margin-bottom: 18px;
  }
`;

const MainValue = styled.div`
  color: rgba(15, 23, 42, 1);
  font-family: 'Inter', 'Poppins', sans-serif;
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.1;
  transition: opacity 0.3s ease-in-out;

  @media (min-width: 640px) {
    font-size: 36px;
  }

  @media (min-width: 768px) {
    font-size: 40px;
  }

  @media (min-width: 1024px) {
    font-size: 42px;
  }

  @media (min-width: 1280px) {
    font-size: 44px;
  }
`;

const ChartContainer = styled.div`
  flex: 1;
  position: relative;
  min-height: 100px;
  margin-bottom: 12px;

  @media (min-width: 640px) {
    min-height: 110px;
    margin-bottom: 14px;
  }

  @media (min-width: 1024px) {
    min-height: 120px;
    margin-bottom: 16px;
  }
`;

const ChartSvg = styled.svg`
  width: 100%;
  height: 100%;
  overflow: visible;
`;

const TrendPath = styled.path<{ $isPositive: boolean }>`
  fill: none;
  stroke: ${props => props.$isPositive 
    ? 'rgba(34, 197, 94, 1)' 
    : 'rgba(239, 68, 68, 1)'};
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: d 0.4s ease-in-out, stroke 0.3s ease-in-out;

  @media (min-width: 1024px) {
    stroke-width: 1;
  }
`;

const GradientArea = styled.path`
  stroke: none;
  transition: d 0.4s ease-in-out, fill 0.3s ease-in-out;
`;

const HoverCircle = styled.circle<{ $isPositive: boolean }>`
  fill: ${props => props.$isPositive 
    ? 'rgba(34, 197, 94, 1)' 
    : 'rgba(239, 68, 68, 1)'};
  stroke: white;
  stroke-width: 1;
  opacity: 0;
  transition: opacity 0.2s;
  pointer-events: none;

  @media (min-width: 1024px) {
    stroke-width: 1;
  }
`;

const HoverLine = styled.line`
  stroke: rgba(148, 163, 184, 0.3);
  stroke-width: 1;
  stroke-dasharray: 4 4;
  opacity: 0;
  transition: opacity 0.2s;
  pointer-events: none;
`;

const InteractionOverlay = styled.rect`
  fill: transparent;
  cursor: crosshair;
`;

const Tooltip = styled.div<{ $x: number; $y: number; $visible: boolean }>`
  position: absolute;
  left: ${props => props.$x}px;
  top: ${props => props.$y}px;
  background-color: rgba(220, 235, 238, 1);
  color: rgba(0, 0, 0, 1);
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  font-family: 'Inter', 'Poppins', sans-serif;
  pointer-events: none;
  opacity: ${props => props.$visible ? 1 : 0};
  transition: opacity 0.2s;
  transform: translate(-50%, -100%);
  margin-top: -8px;
  white-space: nowrap;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  z-index: 10;
  border: 1px solid rgba(23, 97, 163, 0.2);

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 5px solid transparent;
    border-top-color: rgba(220, 235, 238, 1);
  }

  @media (min-width: 640px) {
    padding: 8px 12px;
    font-size: 13px;
  }

  @media (min-width: 1024px) {
    padding: 10px 14px;
    font-size: 14px;
  }
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 10px;
  border-top: 1px solid rgba(226, 232, 240, 0.6);
  flex-shrink: 0;

  @media (min-width: 640px) {
    padding-top: 12px;
  }

  @media (min-width: 1024px) {
    padding-top: 14px;
  }
`;

const FooterText = styled.span`
  color: rgba(148, 163, 184, 1);
  font-family: 'Inter', 'Poppins', sans-serif;
  font-size: 11px;
  font-weight: 500;
  transition: opacity 0.3s ease-in-out;

  @media (min-width: 640px) {
    font-size: 12px;
  }

  @media (min-width: 1024px) {
    font-size: 13px;
  }
`;

/* ============================================================================
   MULTI-SELECT DROPDOWN & WIDGET STYLED COMPONENTS
   ============================================================================ */

const DropdownContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 400px;
  @media (max-width: 767px) { max-width: 100%; }
`;

const DropdownButton = styled.button`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: white;
  border: 2px solid rgba(23, 97, 163, 1);
  border-radius: 8px;
  cursor: pointer;
  font-family: 'Inter', 'Poppins', sans-serif;
  font-size: 14px;
  transition: all 0.2s;
  &:hover {
    border-color: rgba(23, 97, 163, 0.8);
    background: rgba(241, 247, 248, 0.5);
  }
  &:focus {
    outline: none;
    border-color: rgba(23, 97, 163, 1);
    box-shadow: 0 0 0 3px rgba(23, 97, 163, 0.1);
  }
  @media (min-width: 640px) {
    font-size: 15px;
    padding: 14px 18px;
  }
`;

const ButtonText = styled.span`
  color: rgba(15, 23, 42, 1);
  font-weight: 500;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ArrowIcon = styled.span<{ $isOpen: boolean }>`
  color: rgba(23, 97, 163, 1);
  transform: ${props => props.$isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
  transition: transform 0.2s;
  margin-left: 12px;
  flex-shrink: 0;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: white;
  border: 2px solid rgba(23, 97, 163, 1);
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  max-height: 320px;
  overflow-y: auto;
  z-index: 1000;
  animation: slideDown 0.2s ease-out;
  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-8px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const DropdownItem = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  transition: background 0.15s;
  &:hover { background: rgba(241, 247, 248, 1); }
  &:not(:last-child) { border-bottom: 1px solid rgba(226, 232, 240, 0.6); }
  @media (min-width: 640px) { padding: 14px 18px; }
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  margin-right: 12px;
  cursor: pointer;
  accent-color: rgba(23, 97, 163, 1);
  flex-shrink: 0;
  @media (min-width: 640px) { width: 20px; height: 20px; }
`;

const CheckboxLabel = styled.label`
  flex: 1;
  font-family: 'Inter', 'Poppins', sans-serif;
  font-size: 14px;
  color: rgba(15, 23, 42, 1);
  cursor: pointer;
  user-select: none;
  @media (min-width: 640px) { font-size: 15px; }
`;

const DropdownFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: rgba(241, 247, 248, 0.5);
  border-top: 1px solid rgba(226, 232, 240, 1);
  @media (min-width: 640px) { padding: 14px 18px; }
`;

const DropdownFooterText = styled.span`
  font-family: 'Inter', 'Poppins', sans-serif;
  font-size: 12px;
  color: rgba(148, 163, 184, 1);
  font-weight: 500;
  @media (min-width: 640px) { font-size: 13px; }
`;

const ClearButton = styled.button`
  font-family: 'Inter', 'Poppins', sans-serif;
  font-size: 12px;
  color: rgba(23, 97, 163, 1);
  font-weight: 600;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 0.15s;
  &:hover { background: rgba(23, 97, 163, 0.1); }
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(23, 97, 163, 0.2);
  }
  @media (min-width: 640px) { font-size: 13px; }
`;

const WidgetContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  padding: 16px;
  background: rgba(248, 250, 252, 1);
  @media (min-width: 640px) { padding: 24px; }
  @media (min-width: 1024px) { padding: 32px; }
  @media (min-width: 1440px) { padding: 40px; }
`;

const WidgetHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 24px;
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 24px;
  }
  @media (min-width: 1024px) {
    padding: 28px 32px;
    margin-bottom: 32px;
  }
`;

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const WidgetTitle = styled.h1`
  font-family: 'Inter', 'Poppins', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: rgba(15, 23, 42, 1);
  margin: 0;
  @media (min-width: 640px) { font-size: 28px; }
  @media (min-width: 1024px) { font-size: 32px; }
`;

const WidgetSubtitle = styled.p`
  font-family: 'Inter', 'Poppins', sans-serif;
  font-size: 14px;
  color: rgba(148, 163, 184, 1);
  margin: 0;
  @media (min-width: 640px) { font-size: 15px; }
`;

const ChartsGrid = styled.div<{ $count: number }>`
  display: grid;
  gap: 16px;
  width: 100%;
  grid-template-columns: 1fr;
  @media (min-width: 768px) {
    grid-template-columns: ${props => props.$count === 1 ? '1fr' : 'repeat(2, 1fr)'};
    gap: 18px;
  }
  @media (min-width: 1024px) {
    grid-template-columns: ${props => {
      if (props.$count === 1) return '1fr';
      if (props.$count === 2) return 'repeat(2, 1fr)';
      return 'repeat(3, 1fr)';
    }};
    gap: 20px;
  }
  @media (min-width: 1440px) {
    grid-template-columns: ${props => {
      if (props.$count === 1) return '1fr';
      if (props.$count === 2) return 'repeat(2, 1fr)';
      if (props.$count === 3) return 'repeat(3, 1fr)';
      return 'repeat(4, 1fr)';
    }};
    gap: 24px;
  }
`;

const ChartWrapper = styled.div`
  width: 100%;
  animation: fadeIn 0.3s ease-in-out;
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

/* ============================================================================
   INTERFACES
   ============================================================================ */

export interface KPIChartData {
  title: string;
  value: string;
  change?: number;
  timeLabel: string;
  timePeriod: string;
  data: number[];
  labels?: string[];
  timePeriods?: string[];
  timestamps?: string[];
}

export interface KPIChartProps {
  data: KPIChartData;
}

export interface KPIWidgetProps {
  kpiData: Record<string, KPIChartData>;
  defaultSelected?: string[];
}

/* ============================================================================
   HELPER FUNCTIONS
   ============================================================================ */

const createLinearPath = (points: { x: number; y: number }[]): string => {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x},${points[0].y}`;
  let path = `M ${points[0].x},${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    path += ` L ${points[i].x},${points[i].y}`;
  }
  return path;
};

const createAreaPath = (points: { x: number; y: number }[], height: number): string => {
  if (points.length === 0) return '';
  const linePath = createLinearPath(points);
  const lastPoint = points[points.length - 1];
  const firstPoint = points[0];
  return `${linePath} L ${lastPoint.x},${height} L ${firstPoint.x},${height} Z`;
};

const calculatePercentageChange = (data: number[]): number => {
  if (!data || data.length < 2) return 0;
  const firstValue = data[0];
  const lastValue = data[data.length - 1];
  if (firstValue === 0) {
    if (lastValue > 0) return 100;
    if (lastValue < 0) return -100;
    return 0;
  }
  const change = ((lastValue - firstValue) / Math.abs(firstValue)) * 100;
  return Math.round(change * 10) / 10;
};

const getTimeLabel = (period: string, dataLength: number, timestamps?: string[]): string => {
  switch (period) {
    case '1D': return 'Last 1 Day';
    case '1W': return 'Last 1 Week';
    case '1M': return 'Last 1 Month';
    case '6M': return 'Last 6 Months';
    case '1Y': return 'Last 1 Year';
    case 'MAX':
      if (timestamps && timestamps.length >= 2) {
        const startDate = new Date(timestamps[0]);
        const endDate = new Date(timestamps[timestamps.length - 1]);
        const monthsDiff = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth());
        if (monthsDiff === 0) {
          const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
          return `Last ${daysDiff} Day${daysDiff > 1 ? 's' : ''}`;
        } else if (monthsDiff < 12) {
          return `Last ${monthsDiff} Month${monthsDiff > 1 ? 's' : ''}`;
        } else {
          const years = Math.floor(monthsDiff / 12);
          const months = monthsDiff % 12;
          if (months === 0) return `Last ${years} Year${years > 1 ? 's' : ''}`;
          else return `Last ${years}y ${months}m`;
        }
      }
      return `All Data (${dataLength} points)`;
    default: return 'All Data';
  }
};

const getDateRange = (period: string, filteredTimestamps: string[], allTimestamps?: string[]): string => {
  if (period === 'MAX' && allTimestamps && allTimestamps.length >= 2) {
    const startDate = new Date(allTimestamps[0]);
    const endDate = new Date(allTimestamps[allTimestamps.length - 1]);
    return formatDateRange(startDate, endDate);
  }
  if (filteredTimestamps && filteredTimestamps.length >= 2) {
    const startDate = new Date(filteredTimestamps[0]);
    const endDate = new Date(filteredTimestamps[filteredTimestamps.length - 1]);
    return formatDateRange(startDate, endDate);
  } else if (filteredTimestamps && filteredTimestamps.length === 1) {
    const date = new Date(filteredTimestamps[0]);
    return formatSingleDate(date);
  }
  return 'No Date Range';
};

const formatDateRange = (startDate: Date, endDate: Date): string => {
  const sameYear = startDate.getFullYear() === endDate.getFullYear();
  const sameMonth = sameYear && startDate.getMonth() === endDate.getMonth();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const startMonth = monthNames[startDate.getMonth()];
  const startDay = startDate.getDate();
  const startYear = startDate.getFullYear();
  const endMonth = monthNames[endDate.getMonth()];
  const endDay = endDate.getDate();
  const endYear = endDate.getFullYear();
  if (sameMonth) {
    return `${startMonth} ${String(startDay).padStart(2, '0')} - ${endMonth} ${String(endDay).padStart(2, '0')}`;
  } else if (sameYear) {
    return `${startMonth} ${String(startDay).padStart(2, '0')} - ${endMonth} ${String(endDay).padStart(2, '0')}`;
  } else {
    return `${startMonth} ${String(startDay).padStart(2, '0')} ${startYear} - ${endMonth} ${String(endDay).padStart(2, '0')} ${endYear}`;
  }
};

const formatSingleDate = (date: Date): string => {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = monthNames[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month} ${String(day).padStart(2, '0')}, ${year}`;
};

const calculateSum = (data: number[]): number => {
  if (!data || data.length === 0) return 0;
  return data.reduce((sum, value) => sum + value, 0);
};

const formatCurrencyValue = (value: number): string => {
  if (value === 0) return '$0';
  const absValue = Math.abs(value);
  const isNegative = value < 0;
  const prefix = isNegative ? '-' : '';
  if (absValue >= 1_000_000_000) {
    const billions = absValue / 1_000_000_000;
    return `${prefix}$${billions.toFixed(1)}B`;
  } else if (absValue >= 1_000_000) {
    const millions = absValue / 1_000_000;
    return `${prefix}$${millions.toFixed(1)}M`;
  } else if (absValue >= 1_000) {
    const thousands = absValue / 1_000;
    return `${prefix}$${thousands.toFixed(1)}K`;
  } else {
    return `${prefix}$${absValue.toFixed(0)}`;
  }
};

/* ============================================================================
   MAIN KPI CHART COMPONENT
   ============================================================================ */

export const KPIChart: React.FC<KPIChartProps> = ({ data }) => {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = React.useState({ x: 0, y: 0 });
  const [selectedPeriod, setSelectedPeriod] = React.useState<string>(
    data.timePeriods && data.timePeriods.length > 0 
      ? data.timePeriods[data.timePeriods.length - 1]
      : 'MAX'
  );
  const containerRef = React.useRef<HTMLDivElement>(null);

  const { filteredData, filteredTimestamps } = useMemo(() => {
    if (!data.timePeriods || !data.timestamps || selectedPeriod === 'MAX') {
      return { filteredData: data.data, filteredTimestamps: data.timestamps || [] };
    }
    const now = new Date();
    let cutoffDate = new Date();
    switch (selectedPeriod) {
      case '1D': cutoffDate.setDate(now.getDate() - 1); break;
      case '1W': cutoffDate.setDate(now.getDate() - 7); break;
      case '1M': cutoffDate.setMonth(now.getMonth() - 1); break;
      case '6M': cutoffDate.setMonth(now.getMonth() - 6); break;
      case '1Y': cutoffDate.setFullYear(now.getFullYear() - 1); break;
      default: return { filteredData: data.data, filteredTimestamps: data.timestamps || [] };
    }
    const filtered: number[] = [];
    const filteredTS: string[] = [];
    data.timestamps.forEach((timestamp, index) => {
      const dataDate = new Date(timestamp);
      if (dataDate >= cutoffDate && dataDate <= now && index < data.data.length) {
        filtered.push(data.data[index]);
        filteredTS.push(timestamp);
      }
    });
    return {
      filteredData: filtered.length > 0 ? filtered : data.data,
      filteredTimestamps: filteredTS.length > 0 ? filteredTS : (data.timestamps || [])
    };
  }, [data.data, data.timestamps, data.timePeriods, selectedPeriod]);

  const percentageChange = useMemo(() => calculatePercentageChange(filteredData), [filteredData]);
  const isPositive = percentageChange >= 0;

  const dynamicTimeLabel = useMemo(() => 
    getTimeLabel(selectedPeriod, filteredData.length, data.timestamps),
    [selectedPeriod, filteredData.length, data.timestamps]
  );

  const dynamicDateRange = useMemo(() => 
    getDateRange(selectedPeriod, filteredTimestamps, data.timestamps),
    [selectedPeriod, filteredTimestamps, data.timestamps]
  );

  const dynamicValue = useMemo(() => {
    const sum = calculateSum(filteredData);
    return formatCurrencyValue(sum);
  }, [filteredData]);

  const { points, minValue, maxValue, chartWidth, chartHeight } = useMemo(() => {
    const width = 400;
    const height = 100;
    const padding = 5;
    if (!filteredData || filteredData.length === 0) {
      return { points: [], minValue: 0, maxValue: 0, chartWidth: width, chartHeight: height };
    }
    const min = Math.min(...filteredData);
    const max = Math.max(...filteredData);
    const range = max - min || 1;
    const calculatedPoints = filteredData.map((value, index) => {
      const x = padding + (index / (filteredData.length - 1)) * (width - padding * 2);
      const y = height - padding - ((value - min) / range) * (height - padding * 2);
      return { x, y, value };
    });
    return { points: calculatedPoints, minValue: min, maxValue: max, chartWidth: width, chartHeight: height };
  }, [filteredData]);

  const linearPath = useMemo(() => createLinearPath(points), [points]);
  const areaPath = useMemo(() => createAreaPath(points, chartHeight), [points, chartHeight]);
  const gradientId = `kpi-gradient-${isPositive ? 'positive' : 'negative'}-${Math.random().toString(36).substr(2, 9)}`;

  const handleMouseMove = (event: React.MouseEvent<SVGRectElement>) => {
    if (!containerRef.current || points.length === 0) return;
    const svg = event.currentTarget.ownerSVGElement;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * chartWidth;
    let nearestIndex = 0;
    let minDistance = Math.abs(points[0].x - x);
    points.forEach((point, index) => {
      const distance = Math.abs(point.x - x);
      if (distance < minDistance) {
        minDistance = distance;
        nearestIndex = index;
      }
    });
    setHoveredIndex(nearestIndex);
    const pointX = (points[nearestIndex].x / chartWidth) * rect.width;
    const pointY = (points[nearestIndex].y / chartHeight) * rect.height;
    setTooltipPos({ x: pointX, y: pointY });
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const formatValue = (value: number): string => {
    return value.toLocaleString();
  };

  return (
    <Container ref={containerRef}>
      <Header>
        <HeaderLeft><Title>{data.title}</Title></HeaderLeft>
        {data.timePeriods && data.timePeriods.length > 0 && (
          <TimePeriodTabs>
            {data.timePeriods.map((period) => (
              <TimePeriodTab key={period} $isActive={selectedPeriod === period} onClick={() => setSelectedPeriod(period)} type="button">
                {period}
              </TimePeriodTab>
            ))}
          </TimePeriodTabs>
        )}
        <HeaderRight>
          <ChangeIndicator $isPositive={isPositive}>
            <ChangeIcon $isPositive={isPositive} viewBox="0 0 12 12">
              {isPositive ? <path d="M6 2L10 6H8V10H4V6H2L6 2Z" /> : <path d="M6 10L2 6H4V2H8V6H10L6 10Z" />}
            </ChangeIcon>
            <ChangeText $isPositive={isPositive}>{Math.abs(percentageChange)}%</ChangeText>
          </ChangeIndicator>
        </HeaderRight>
      </Header>

      <ValueSection><MainValue>{dynamicValue}</MainValue></ValueSection>

      <ChartContainer>
        <ChartSvg viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
              {isPositive ? (
                <>
                  <stop offset="0%" stopColor="rgba(34, 197, 94, 0.2)" />
                  <stop offset="50%" stopColor="rgba(34, 197, 94, 0.1)" />
                  <stop offset="100%" stopColor="rgba(34, 197, 94, 0.02)" />
                </>
              ) : (
                <>
                  <stop offset="0%" stopColor="rgba(239, 68, 68, 0.2)" />
                  <stop offset="50%" stopColor="rgba(239, 68, 68, 0.1)" />
                  <stop offset="100%" stopColor="rgba(239, 68, 68, 0.02)" />
                </>
              )}
            </linearGradient>
          </defs>
          <GradientArea d={areaPath} fill={`url(#${gradientId})`} />
          <TrendPath d={linearPath} $isPositive={isPositive} />
          {hoveredIndex !== null && points[hoveredIndex] && !isNaN(points[hoveredIndex].x) && !isNaN(points[hoveredIndex].y) && (
            <>
              <HoverLine x1={points[hoveredIndex].x} y1="0" x2={points[hoveredIndex].x} y2={chartHeight} style={{ opacity: 1 }} />
              <HoverCircle cx={points[hoveredIndex].x} cy={points[hoveredIndex].y} r="3.5" $isPositive={isPositive} style={{ opacity: 1 }} />
            </>
          )}
          <InteractionOverlay x="0" y="0" width={chartWidth} height={chartHeight} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} />
        </ChartSvg>
        {hoveredIndex !== null && points[hoveredIndex] && (
          <Tooltip $x={tooltipPos.x} $y={tooltipPos.y} $visible={true}>{formatValue(points[hoveredIndex].value)}</Tooltip>
        )}
      </ChartContainer>

      <Footer>
        <FooterText>{dynamicTimeLabel}</FooterText>
        <FooterText>{dynamicDateRange}</FooterText>
      </Footer>
    </Container>
  );
};

/* ============================================================================
   MULTI-SELECT DROPDOWN COMPONENT
   ============================================================================ */

interface MultiSelectDropdownProps {
  options: string[];
  selectedValues: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({ options, selectedValues, onChange, placeholder = "Select options" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCheckboxChange = (option: string) => {
    console.log('🔵 Checkbox clicked:', option);
    console.log('🔵 Current selections:', selectedValues);
    
    if (selectedValues.includes(option)) {
      // Deselect - but keep at least one selected
      if (selectedValues.length > 1) {
        const newSelection = selectedValues.filter(v => v !== option);
        console.log('🔵 Deselecting, new selection:', newSelection);
        onChange(newSelection);
      } else {
        console.log('🔵 Cannot deselect - only one item selected');
      }
    } else {
      // Select - add to array
      const newSelection = [...selectedValues, option];
      console.log('🔵 Selecting, new selection:', newSelection);
      onChange(newSelection);
    }
  };

  return (
    <DropdownContainer ref={dropdownRef}>
      <DropdownButton onClick={() => setIsOpen(!isOpen)} type="button">
        <ButtonText>
          {selectedValues.length === 0 ? placeholder : selectedValues.length === 1 ? selectedValues[0] : `${selectedValues.length} KPIs selected`}
        </ButtonText>
        <ArrowIcon $isOpen={isOpen}>▼</ArrowIcon>
      </DropdownButton>
      {isOpen && (
        <DropdownMenu onClick={(e) => e.stopPropagation()}>
          {options.map((option) => (
            <DropdownItem 
              key={option} 
              onClick={(e) => {
                e.stopPropagation();
                handleCheckboxChange(option);
              }}
            >
              <Checkbox 
                type="checkbox" 
                checked={selectedValues.includes(option)} 
                onChange={(e) => {
                  e.stopPropagation();
                  handleCheckboxChange(option);
                }}
                onClick={(e) => e.stopPropagation()}
              />
              <CheckboxLabel onClick={(e) => e.stopPropagation()}>{option}</CheckboxLabel>
            </DropdownItem>
          ))}
          <DropdownFooter>
            <DropdownFooterText>{selectedValues.length} of {options.length} selected</DropdownFooterText>
            {selectedValues.length > 1 && (
              <ClearButton onClick={(e) => { e.stopPropagation(); onChange([selectedValues[0]]); }}>Clear All</ClearButton>
            )}
          </DropdownFooter>
        </DropdownMenu>
      )}
    </DropdownContainer>
  );
};

/* ============================================================================
   KPI WIDGET (MAIN COMPONENT WITH MULTI-SELECT)
   ============================================================================ */

export const KPIWidget: React.FC<KPIWidgetProps> = ({ kpiData, defaultSelected }) => {
  const kpiOptions = Object.keys(kpiData);
  const [selectedKPIs, setSelectedKPIs] = useState<string[]>(
    defaultSelected && defaultSelected.length > 0 ? defaultSelected : kpiOptions.length > 0 ? [kpiOptions[0]] : []
  );

  console.log('🔵 KPIWidget Render:', {
    kpiOptions,
    selectedKPIs,
    selectedCount: selectedKPIs.length,
    defaultSelected
  });

  const handleSelectionChange = (newSelection: string[]) => {
    console.log('🔵 KPIWidget - Selection changing:', {
      from: selectedKPIs,
      to: newSelection
    });
    setSelectedKPIs(newSelection);
  };

  return (
    <WidgetContainer>
      <WidgetHeader>
        <TitleSection>
          <WidgetTitle>KPI Dashboard</WidgetTitle>
          <WidgetSubtitle>Compare multiple KPIs side-by-side</WidgetSubtitle>
        </TitleSection>
        <MultiSelectDropdown options={kpiOptions} selectedValues={selectedKPIs} onChange={handleSelectionChange} placeholder="Select KPIs to compare" />
      </WidgetHeader>
      <ChartsGrid $count={selectedKPIs.length}>
        {selectedKPIs.map((kpiName) => {
          const chartData = kpiData[kpiName];
          if (!chartData) {
            console.error(`🔴 Missing data for KPI: ${kpiName}`);
            return null;
          }
          return (
            <ChartWrapper key={kpiName}>
              <KPIChart data={chartData} />
            </ChartWrapper>
          );
        })}
      </ChartsGrid>
    </WidgetContainer>
  );
};

export default KPIWidget;

KPIChart.displayName = "KPIChart";