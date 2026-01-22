"use client";
import React, { useState, useEffect, useRef } from "react";
import { HiOutlineClock, HiChevronDown, HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { HiCalendarDays } from "react-icons/hi2";
import styled from '@emotion/styled';
import { css, keyframes } from '@emotion/react';

export interface CalendarDate {
  year: number;
  month: number;
  day: number;
}

export interface CalendarTime {
  hour: number;
  minute: number;
  period: "AM" | "PM";
}

export interface CalendarDateRange {
  start: CalendarDate | null;
  end: CalendarDate | null;
}

export type CalendarSize = "small" | "medium" | "large" | "extra-large";

export interface CalendarProps {
  value?: CalendarDate | null;
  onChange?: (date: CalendarDate | null, dateString?: string) => void;
  enableRangeSelection?: boolean;
  rangeValue?: CalendarDateRange;
  onRangeChange?: (range: CalendarDateRange) => void;
  enableTimeSelection?: boolean;
  timeValue?: CalendarTime | null;
  onTimeChange?: (time: CalendarTime) => void;
  showTimeFormatToggle?: boolean;
  timeFormat?: "12h" | "24h";
  onTimeFormatChange?: (format: "12h" | "24h") => void;
  autoHide?: boolean;
  showTodayButton?: boolean;
  showClearButton?: boolean;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  onShow?: () => void;
  onHide?: () => void;
  icon?: React.ReactNode;
  showIcon?: boolean;
  size?: CalendarSize;
  enableYearDropdown?: boolean;
  showDateFormatSelector?: boolean;
  dateFormat?: string;
  onDateFormatChange?: (format: string) => void;
  showTimeZoneSelector?: boolean;
  timeZoneFormat?: string;
  onTimeZoneFormatChange?: (format: string) => void;
  blockDateConfig?: {
    startDate: CalendarDate;
    days: number;
  };
}

// Styled Components
const CalendarContainer = styled.div`
  position: relative;
`;

const InputWrapper = styled.div`
  position: relative;
`;

const IconWrapper = styled.div`
  pointer-events: none;
  position: absolute;
  inset-block-start: 0;
  inset-block-end: 0;
  inset-inline-start: 0;
  display: flex;
  align-items: center;
`;

const CalendarInput = styled.input<{ $showIcon: boolean; $disabled: boolean; $scale: number }>`
  display: block;
  width: 100%;
  border-radius: 9999px;
  border: 1px solid #d1d5db;
  background-color: #f9fafb;
  font-weight: 600;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  color: #111827;
  transition: all 200ms;
  padding-top: ${props => props.$scale * 10}px;
  padding-bottom: ${props => props.$scale * 10}px;
  padding-left: ${props => props.$showIcon ? props.$scale * 40 : props.$scale * 12}px;
  padding-right: ${props => props.$scale * 12}px;
  font-size: ${props => props.$scale * 12}px;
  
  &::placeholder {
    color: #6b7280;
  }
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    ring: 2px solid #3b82f6;
  }
  
  ${props => props.$disabled && css`
    cursor: not-allowed;
    opacity: 0.5;
  `}
`;

const CalendarDropdown = styled.div<{ $scale: number; $positionAbove: boolean }>`
  position: absolute;
  left: 0;
  ${props => props.$positionAbove ? 'bottom: 100%;' : 'top: 100%;'}
  ${props => props.$positionAbove ? `margin-bottom: ${props.$scale * 8}px;` : `margin-top: ${props.$scale * 8}px;`}
  z-index: 50;
  border: 1px solid #1761A3;
  background-color: white;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  transition: all 300ms;
  background: linear-gradient(to bottom, rgba(23, 97, 163, 0.08), rgba(77, 175, 131, 0.08));
  width: ${props => props.$scale * 406}px;
  height: ${props => props.$scale * 580}px;
  border-radius: ${props => props.$scale * 22}px;
  max-width: 95vw;
  overflow: hidden;
`;

const CalendarContent = styled.div<{ $scale: number }>`
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: ${props => props.$scale * 24}px;
  padding-bottom: ${props => props.$scale * 22}px;
`;

const CalendarTitle = styled.div<{ $scale: number }>`
  text-align: left;
  font-weight: 700;
  color: #111827;
  flex-shrink: 0;
  margin-bottom: ${props => props.$scale * 20}px;
  font-size: ${props => props.$scale * 20}px;
`;

const FieldButtonsRow = styled.div<{ $scale: number }>`
  display: flex;
  flex-shrink: 0;
  margin-bottom: ${props => props.$scale * 24}px;
  gap: ${props => props.$scale * 12}px;
`;

const FieldButton = styled.button<{ $active: boolean; $scale: number; $fullWidth?: boolean }>`
  display: flex;
  align-items: center;
  border-radius: 6px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  transition: all 200ms;
  width: ${props => props.$fullWidth ? '100%' : `${props.$scale * 160}px`};
  height: ${props => props.$scale * 40}px;
  gap: ${props => props.$scale * 12}px;
  padding: 0 ${props => props.$scale * 16}px;
  border: 2px solid ${props => props.$active ? 'transparent' : '#e5e7eb'};
  background: ${props => props.$active 
    ? 'linear-gradient(to bottom, #1761A3, #4DAF83)' 
    : 'white'};
  color: ${props => props.$active ? 'white' : '#111827'};
  
  ${props => props.$active && css`
    ring: 2px solid #3b82f6;
  `}
  
  &:hover {
    opacity: 0.9;
  }
`;

const FieldLabel = styled.span<{ $scale: number }>`
  font-weight: 500;
  color: #6b7280;
  font-size: ${props => props.$scale * 12}px;
`;

const FieldValue = styled.span<{ $scale: number }>`
  font-weight: 600;
  font-size: ${props => props.$scale * 14}px;
`;

const NavHeader = styled.div<{ $scale: number }>`
  flex-shrink: 0;
  margin-bottom: ${props => props.$scale * 22}px;
`;

const NavRow = styled.div<{ $scale: number }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${props => props.$scale * 22}px;
`;

const NavButton = styled.button<{ $scale: number }>`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  background-color: #1761A3;
  color: white;
  transition: all 200ms;
  width: ${props => props.$scale * 32}px;
  height: ${props => props.$scale * 30}px;
  border: none;
  cursor: pointer;
  
  &:hover {
    background: linear-gradient(to bottom, #1761A3, #4DAF83);
  }
`;

const MonthYearButton = styled.button<{ $scale: number; $clickable: boolean }>`
  font-weight: 700;
  color: #1761A3;
  font-size: ${props => props.$scale * 18}px;
  background: transparent;
  border: none;
  cursor: ${props => props.$clickable ? 'pointer' : 'default'};
  transition: opacity 200ms;
  
  &:hover {
    opacity: ${props => props.$clickable ? 0.8 : 1};
  }
`;

const YearDropdown = styled.div<{ $scale: number }>`
  position: absolute;
  left: 50%;
  top: 100%;
  z-index: 50;
  overflow-y: auto;
  background-color: white;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(77, 175, 131, 0.25);
  border-radius: 6px;
  transform: translateX(-50%);
  margin-top: ${props => props.$scale * 8}px;
  width: ${props => props.$scale * 120}px;
  max-height: ${props => props.$scale * 240}px;
`;

const YearOption = styled.button<{ $selected: boolean; $scale: number }>`
  display: block;
  width: 100%;
  text-align: left;
  font-weight: 600;
  transition: all 150ms;
  font-size: ${props => props.$scale * 14}px;
  padding: ${props => props.$scale * 8}px ${props => props.$scale * 12}px;
  background-color: ${props => props.$selected ? '#1761A3' : 'white'};
  color: ${props => props.$selected ? 'white' : '#111827'};
  border: none;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.$selected ? '#1761A3' : '#eff6ff'};
  }
`;

const DayNamesGrid = styled.div<{ $scale: number }>`
  margin-bottom: ${props => props.$scale * 6}px;
`;

const GridContainer = styled.div<{ $scale: number }>`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: ${props => props.$scale * 8}px ${props => props.$scale * 8}px;
`;

const DayName = styled.div<{ $scale: number }>`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: #4b5563;
  width: ${props => props.$scale * 44}px;
  height: ${props => props.$scale * 28}px;
  font-size: ${props => props.$scale * 12}px;
`;

const CalendarGrid = styled.div<{ $scale: number }>`
  flex-shrink: 0;
  height: ${props => props.$scale * 228}px;
  margin-bottom: ${props => props.$scale * 8}px;
`;

const DayButton = styled.button<{ 
  $selected: boolean; 
  $isToday: boolean; 
  $inRange: boolean; 
  $blocked: boolean;
  $scale: number;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 200ms;
  width: ${props => props.$scale * 32}px;
  height: ${props => props.$scale * 30}px;
  font-size: ${props => props.$scale * 14}px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  
  ${props => props.$selected && css`
    background: linear-gradient(to bottom, #1761A3, #4DAF83);
    color: white;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  `}
  
  ${props => !props.$selected && props.$isToday && css`
    border: 2px solid #1761A3;
    color: #1761A3;
    background: transparent;
  `}
  
  ${props => !props.$selected && !props.$isToday && !props.$inRange && css`
    background-color: rgba(0, 123, 255, 0.05);
    color: #374151;
  `}
  
  ${props => props.$inRange && !props.$selected && css`
    background-color: rgba(23, 97, 163, 0.15);
    color: #374151;
  `}
  
  ${props => !props.$selected && !props.$blocked && css`
    &:hover {
      background-color: rgba(23, 97, 163, 0.1);
    }
  `}
  
  ${props => props.$blocked && css`
    cursor: not-allowed;
    opacity: 0.4;
    color: #9ca3af;
  `}
`;

const FooterSection = styled.div<{ $scale: number }>`
  flex-shrink: 0;
  border-top: 1px solid #e5e7eb;
  padding-top: ${props => props.$scale * 12}px;
`;

const ButtonRow = styled.div<{ $scale: number }>`
  display: flex;
  gap: ${props => props.$scale * 12}px;
  margin-bottom: ${props => props.$scale * 8}px;
`;

const ActionButton = styled.button<{ $variant: 'today' | 'clear' | 'confirm'; $fullWidth?: boolean; $scale: number }>`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  font-weight: 600;
  transition: all 200ms;
  height: ${props => props.$scale * 38}px;
  font-size: ${props => props.$scale * 12}px;
  width: ${props => props.$fullWidth ? '100%' : 'auto'};
  flex: ${props => props.$fullWidth ? 'none' : 1};
  gap: ${props => props.$scale * 8}px;
  border: none;
  cursor: pointer;
  
  ${props => props.$variant === 'today' && css`
    color: #1761A3;
    background-color: rgba(23, 97, 163, 0.15);
    
    &:hover {
      background: linear-gradient(to bottom, #1761A3, #4DAF83);
      color: white;
    }
  `}
  
  ${props => props.$variant === 'clear' && css`
    color: #EF4444;
    background-color: rgba(239, 68, 68, 0.15);
    
    &:hover {
      opacity: 0.8;
    }
  `}
  
  ${props => props.$variant === 'confirm' && css`
    background: linear-gradient(to right, #1761A3, #4DAF83);
    color: white;
    
    &:hover {
      opacity: 0.9;
    }
  `}
`;

// Time Selector Styles
const TimeSelectorContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const TimeSelectorContent = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const TimeFormatSection = styled.div<{ $scale: number }>`
  margin-bottom: ${props => props.$scale * 12}px;
`;

const TimeFormatRow = styled.div<{ $scale: number }>`
  display: flex;
  flex-direction: column;
  gap: ${props => props.$scale * 8}px;
`;

const TimeFormatLabel = styled.span<{ $scale: number }>`
  color: #000;
  font-weight: 600;
  font-size: ${props => props.$scale * 12}px;
`;

const TimeFormatToggleRow = styled.div<{ $scale: number }>`
  display: flex;
  align-items: center;
  gap: ${props => props.$scale * 8}px;
`;

const TimeFormatText = styled.span<{ $active: boolean; $scale: number }>`
  transition: color 200ms;
  font-weight: 600;
  font-size: ${props => props.$scale * 12}px;
  color: ${props => props.$active ? '#111827' : '#6b7280'};
`;

const ToggleSwitch = styled.button<{ $active: boolean; $scale: number }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  border-radius: 8px;
  transition: all 200ms;
  width: ${props => props.$scale * 38}px;
  height: ${props => props.$scale * 17}px;
  background-color: ${props => props.$active ? '#1761A3' : '#cbd5e1'};
  border: none;
  cursor: pointer;
  
  &:focus {
    outline: none;
    ring: 2px solid #3b82f6;
    ring-offset: 2px;
  }
`;

const ToggleThumb = styled.span<{ $active: boolean; $scale: number }>`
  display: inline-block;
  border-radius: 50%;
  background-color: white;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  transition: transform 200ms;
  width: ${props => props.$scale * 13}px;
  height: ${props => props.$scale * 13}px;
  transform: ${props => props.$active 
    ? `translateX(${props.$scale * 23}px)` 
    : `translateX(${props.$scale * 2}px)`};
`;

const SelectRow = styled.div<{ $scale: number }>`
  display: flex;
  align-items: start;
  gap: ${props => props.$scale * 15}px;
`;

const SelectWrapper = styled.div<{ $fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  flex: ${props => props.$fullWidth ? 'none' : 1};
  width: ${props => props.$fullWidth ? '100%' : 'auto'};
`;

const SelectLabel = styled.span<{ $scale: number; $align?: 'left' | 'right' | 'center' }>`
  color: #000;
  font-weight: 600;
  font-size: ${props => props.$scale * 12}px;
  text-align: ${props => props.$align || 'left'};
  padding-left: ${props => props.$align === 'center' ? `${props.$scale * 36}px` : 0};
  padding-right: ${props => props.$align === 'right' ? `${props.$scale * 36}px` : 0};
  margin-bottom: ${props => props.$scale * 8}px;
`;

const SelectContainer = styled.div<{ $scale: number; $fullWidth?: boolean }>`
  position: relative;
  height: ${props => props.$scale * 40}px;
  width: ${props => props.$fullWidth ? '100%' : 'auto'};
`;

const StyledSelect = styled.select<{ $scale: number; $fullWidth?: boolean }>`
  display: block;
  height: 100%;
  border: 1px solid rgba(77, 175, 131, 0.25);
  background-color: ${props => props.$fullWidth ? '#F0F8FF' : 'white'};
  color: #111827;
  font-weight: 600;
  border-radius: 6px;
  transition: all 200ms;
  font-size: ${props => props.$scale * 12}px;
  padding-left: ${props => props.$fullWidth ? `${props.$scale * 36}px` : `${props.$scale * 16}px`};
  padding-right: ${props => props.$scale * 32}px;
  width: ${props => props.$fullWidth ? '100%' : `${props.$scale * 106}px`};
  appearance: none;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    ring: 2px solid rgba(59, 130, 246, 0.2);
  }
  
  &:hover {
    background: ${props => props.$fullWidth 
      ? 'linear-gradient(to right, rgba(23, 97, 163, 0.4), rgba(77, 175, 131, 0.4))' 
      : 'white'};
  }
`;

const SelectIcon = styled(HiChevronDown)<{ $scale: number }>`
  pointer-events: none;
  position: absolute;
  top: 50%;
  right: ${props => props.$scale * 8}px;
  transform: translateY(-50%);
  color: #6b7280;
  font-size: ${props => props.$scale * 18}px;
`;

const TimeSelectSection = styled.div<{ $scale: number }>`
  margin-top: ${props => props.$scale * 16}px;
`;

const TimeSelectLabel = styled.label<{ $scale: number }>`
  display: block;
  color: #374151;
  font-weight: 600;
  margin-bottom: ${props => props.$scale * 12}px;
  font-size: ${props => props.$scale * 12}px;
`;

const TimeSelectGrid = styled.div<{ $scale: number }>`
  display: flex;
  gap: ${props => props.$scale * 12}px;
`;

const TimeSelectItem = styled.div`
  flex: 1;
`;

const PreviewSection = styled.div<{ $scale: number }>`
  margin-top: ${props => props.$scale * 12}px;
`;

const PreviewLabel = styled.label<{ $scale: number }>`
  display: block;
  color: #374151;
  font-weight: 600;
  margin-bottom: ${props => props.$scale * 8}px;
  font-size: ${props => props.$scale * 12}px;
`;

const PreviewText = styled.p<{ $scale: number }>`
  text-align: left;
  color: #1761A3;
  font-weight: 600;
  font-size: ${props => props.$scale * 12}px;
`;

const TimeFooter = styled.div<{ $scale: number }>`
  margin-top: auto;
  border-top: 1px solid #e5e7eb;
  flex-shrink: 0;
  padding-top: ${props => props.$scale * 15}px;
`;

// Utility Functions
const convertToDateString = (date: CalendarDate | null): string => {
  if (!date) return '';
  const year = date.year;
  const month = String(date.month + 1).padStart(2, '0');
  const day = String(date.day).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const isSameDate = (
  date1: CalendarDate | null | undefined,
  date2: CalendarDate | null | undefined
): boolean => {
  if (!date1 || !date2) return false;
  return (
    date1.year === date2.year &&
    date1.month === date2.month &&
    date1.day === date2.day
  );
};

const formatDate = (date: CalendarDate | null): string => {
  if (!date) return "";
  const month = String(date.month + 1).padStart(2, "0");
  const day = String(date.day).padStart(2, "0");
  const year = String(date.year);
  return `${month}-${day}-${year}`;
};

const formatDateWithFormat = (date: CalendarDate | null, format: string): string => {
  if (!date) return "";

  const monthNum = date.month + 1;
  const month = String(monthNum).padStart(2, "0");
  const day = String(date.day).padStart(2, "0");
  const year = String(date.year);

  const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  const monthAbbr = monthNames[date.month];

  if (format === "none") {
    return `${month}-${day}-${year}`;
  }

  switch (format) {
    case "MM/DD/YYYY":
      return `${month}/${day}/${year}`;
    case "DD/MM/YYYY":
      return `${day}/${month}/${year}`;
    case "YYYY/MM/DD":
      return `${year}/${month}/${day}`;
    case "MMM/DD/YYYY":
      return `${monthAbbr}/${day}/${year}`;
    case "DD/MMM/YYYY":
      return `${day}/${monthAbbr}/${year}`;
    case "YYYY/MMM/DD":
      return `${year}/${monthAbbr}/${day}`;
    case "MMM DD, YYYY":
      return `${monthAbbr} ${day}, ${year}`;
    case "DD MMM YYYY":
      return `${day} ${monthAbbr} ${year}`;
    case "YYYY MMM DD":
      return `${year} ${monthAbbr} ${day}`;
    case "MM-DD-YYYY":
      return `${month}-${day}-${year}`;
    case "DD-MM-YYYY":
      return `${day}-${month}-${year}`;
    case "YYYY-MM-DD":
      return `${year}-${month}-${day}`;
    case "MMM-DD-YYYY":
      return `${monthAbbr}-${day}-${year}`;
    case "DD-MMM-YYYY":
      return `${day}-${monthAbbr}-${year}`;
    case "YYYY-MMM-DD":
      return `${year}-${monthAbbr}-${day}`;
    case "DD.MM.YYYY":
      return `${day}.${month}.${year}`;
    case "MM.DD.YYYY":
      return `${month}.${day}.${year}`;
    case "YYYY.MM.DD":
      return `${year}.${month}.${day}`;
    default:
      return `${month}-${day}-${year}`;
  }
};

const formatTime = (time: CalendarTime | null, format: "12h" | "24h" = "12h"): string => {
  if (!time) return "";

  if (format === "24h") {
    let hour24 = time.hour;
    if (time.period === "PM" && time.hour !== 12) {
      hour24 = time.hour + 12;
    } else if (time.period === "AM" && time.hour === 12) {
      hour24 = 0;
    }
    const hour = String(hour24).padStart(2, "0");
    const minute = String(time.minute).padStart(2, "0");
    return `${hour}:${minute}`;
  }

  const hour = String(time.hour).padStart(2, "0");
  const minute = String(time.minute).padStart(2, "0");
  return `${hour}:${minute} ${time.period}`;
};

const getDaysInMonth = (year: number, monthIndex: number): number => {
  return new Date(year, monthIndex + 1, 0).getDate();
};

const getFirstDayOfMonth = (year: number, monthIndex: number): number => {
  return new Date(year, monthIndex, 1).getDay();
};

const getMonthName = (monthIndex: number): string => {
  return new Date(2024, monthIndex, 1).toLocaleDateString("en-US", {
    month: "long",
  });
};

const DAY_NAMES = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"] as const;

const DATE_FORMAT_OPTIONS = [
  "none",
  "MM/DD/YYYY",
  "DD/MM/YYYY",
  "YYYY/MM/DD",
  "MMM/DD/YYYY",
  "DD/MMM/YYYY",
  "YYYY/MMM/DD",
  "MMM DD, YYYY",
  "DD MMM YYYY",
  "YYYY MMM DD",
  "MM-DD-YYYY",
  "DD-MM-YYYY",
  "YYYY-MM-DD",
  "MMM-DD-YYYY",
  "DD-MMM-YYYY",
  "YYYY-MMM-DD",
  "DD.MM.YYYY",
  "MM.DD.YYYY",
  "YYYY.MM.DD",
];

const TIME_ZONE_OPTIONS = [
  "none",
  "UTC",
  "GMT",
  "EST",
  "EDT",
  "CST",
  "CDT",
  "MST",
  "MDT",
  "PST",
  "PDT",
  "IST",
  "JST",
  "KST",
  "AEST",
  "AEDT",
  "NZST",
  "NZDT",
  "CET",
  "CEST",
  "BST",
  "AST",
  "HST",
  "AKST",
  "AKDT",
  "SST",
  "NST",
  "WET",
  "WEST",
  "EET",
  "EEST",
  "MSK",
  "HKT",
  "SGT",
  "PKT",
  "BDT",
  "AWST",
  "ACST",
  "ACDT",
  "NFT",
];

type InternalDate = { year: number; monthIndex: number; day: number };

const compareInternalDates = (a: InternalDate, b: InternalDate): number => {
  if (a.year !== b.year) return a.year - b.year;
  if (a.monthIndex !== b.monthIndex) return a.monthIndex - b.monthIndex;
  return a.day - b.day;
};

const addDaysInternal = (start: InternalDate, daysToAdd: number): InternalDate => {
  let y = start.year;
  let m = start.monthIndex;
  let d = start.day + daysToAdd;

  while (true) {
    const dim = getDaysInMonth(y, m);
    if (d <= dim) break;
    d -= dim;
    m += 1;
    if (m > 11) {
      m = 0;
      y += 1;
    }
  }

  return { year: y, monthIndex: m, day: d };
};

const isBlockedDateHelper = (
  date: CalendarDate,
  config?: { startDate: CalendarDate; days: number }
): boolean => {
  if (!config || config.days <= 0) return false;

  const startInternal: InternalDate = {
    year: config.startDate.year,
    monthIndex: config.startDate.month,
    day: config.startDate.day,
  };

  const endInternal = addDaysInternal(startInternal, config.days - 1);

  const currentInternal: InternalDate = {
    year: date.year,
    monthIndex: date.month,
    day: date.day,
  };

  const afterOrOnStart = compareInternalDates(currentInternal, startInternal) >= 0;
  const beforeOrOnEnd = compareInternalDates(currentInternal, endInternal) <= 0;

  return afterOrOnStart && beforeOrOnEnd;
};

const getLocalTimeZone = (): string => {
  const timeZoneString = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const date = new Date();
  const shortTimeZone = date.toLocaleTimeString('en-us', { timeZoneName: 'short' }).split(' ')[2];
  return shortTimeZone || timeZoneString;
};

const SIZE_SCALES = {
  "small": 0.65,
  "medium": 0.8,
  "large": 0.9,
  "extra-large": 1.0,
} as const;

const getDeviceScale = (): number => {
  if (typeof window === 'undefined') return 1;
  
  const width = window.innerWidth;
  
  if (width < 640) return 0.7;
  if (width < 1024) return 0.85;
  
  return 1;
};

const Calendar: React.FC<CalendarProps> = ({
  value,
  onChange,
  enableRangeSelection = false,
  rangeValue,
  onRangeChange,
  enableTimeSelection = false,
  timeValue,
  onTimeChange,
  showTimeFormatToggle = false,
  timeFormat = "12h",
  onTimeFormatChange,
  autoHide = false,
  showTodayButton = false,
  showClearButton = false,
  placeholder = "Select date",
  className,
  disabled = false,
  onShow,
  onHide,
  icon,
  showIcon = true,
  size = "extra-large",
  enableYearDropdown = false,
  showDateFormatSelector = false,
  dateFormat = "none",
  onDateFormatChange,
  showTimeZoneSelector = false,
  timeZoneFormat = "none",
  onTimeZoneFormatChange,
  blockDateConfig,
}) => {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(
    value?.year || today.getFullYear()
  );
  const [currentMonth, setCurrentMonth] = useState(
    value?.month ?? today.getMonth()
  );
  const [internalRangeValue, setInternalRangeValue] = useState<CalendarDateRange>({ start: null, end: null });
  const [isOpen, setIsOpen] = useState(false);
  const [activeField, setActiveField] = useState<"start" | "end">("start");
  const [showTimeSelector, setShowTimeSelector] = useState(false);
  const [selectedHour, setSelectedHour] = useState(timeValue?.hour || 12);
  const [selectedMinute, setSelectedMinute] = useState(timeValue?.minute || 0);
  const [selectedPeriod, setSelectedPeriod] = useState<"AM" | "PM">(timeValue?.period || "AM");
  const [internalTimeFormat, setInternalTimeFormat] = useState<"12h" | "24h">(timeFormat);
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [internalDateFormat, setInternalDateFormat] = useState(dateFormat);
  const [internalTimeZoneFormat, setInternalTimeZoneFormat] = useState(timeZoneFormat);
  const [deviceScale, setDeviceScale] = useState(1);
  const [positionAbove, setPositionAbove] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  const sizeScale = SIZE_SCALES[size];
  const scale = sizeScale * deviceScale;

  const finalRangeValue = rangeValue ?? internalRangeValue;

  const scaled = (value: number): number => Math.round(value * scale);

  useEffect(() => {
    const handleResize = () => {
      setDeviceScale(getDeviceScale());
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (!isOpen || !containerRef.current || !calendarRef.current) return;

    const calculatePosition = () => {
      const containerRect = containerRef.current?.getBoundingClientRect();
      const calendarHeight = calendarRef.current?.offsetHeight || 580 * scale;
      
      if (!containerRect) return;

      const spaceBelow = window.innerHeight - containerRect.bottom;
      const spaceAbove = containerRect.top;
      const bufferSpace = 20;

      // Only flip to above if there's absolutely no space below AND more space above
      if (spaceBelow < calendarHeight + bufferSpace && spaceAbove > calendarHeight + bufferSpace) {
        setPositionAbove(true);
      } else {
        // Default to below
        setPositionAbove(false);
      }
    };

    calculatePosition();
    window.addEventListener('resize', calculatePosition);
    window.addEventListener('scroll', calculatePosition, true);

    return () => {
      window.removeEventListener('resize', calculatePosition);
      window.removeEventListener('scroll', calculatePosition, true);
    };
  }, [isOpen, scale]);

  useEffect(() => {
    if (value) {
      setCurrentYear(value.year);
      setCurrentMonth(value.month);
    }
  }, [value]);

  useEffect(() => {
    if (timeValue) {
      setSelectedHour(timeValue.hour);
      setSelectedMinute(timeValue.minute);
      setSelectedPeriod(timeValue.period);
    }
  }, [timeValue]);

  useEffect(() => {
    setInternalTimeFormat(timeFormat);
  }, [timeFormat]);

  useEffect(() => {
    setInternalDateFormat(dateFormat);
  }, [dateFormat]);

  useEffect(() => {
    setInternalTimeZoneFormat(timeZoneFormat);
  }, [timeZoneFormat]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        if (isOpen) {
          setIsOpen(false);
          setShowTimeSelector(false);
          setShowYearDropdown(false);
          onHide?.();
        }
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onHide]);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
  const monthName = getMonthName(currentMonth);

  const previousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const selectDate = (day: number) => {
    const date: CalendarDate = {
      year: currentYear,
      month: currentMonth,
      day,
    };

    if (enableRangeSelection) {
      if (activeField === "start") {
        const newRange = { start: date, end: finalRangeValue?.end || null };
        if (!rangeValue) setInternalRangeValue(newRange);
        onRangeChange?.(newRange);
        setActiveField("end");
      } else {
        const start = finalRangeValue?.start;
        if (start) {
          const startTime = new Date(start.year, start.month, start.day).getTime();
          const endTime = new Date(date.year, date.month, date.day).getTime();

          let newRange;
          if (endTime < startTime) {
            newRange = { start: date, end: start };
          } else {
            newRange = { start, end: date };
          }
          if (!rangeValue) setInternalRangeValue(newRange);
          onRangeChange?.(newRange);
        } else {
          const newRange = { start: date, end: null };
          if (!rangeValue) setInternalRangeValue(newRange);
          onRangeChange?.(newRange);
          setActiveField("end");
        }
      }
    } else {
      const dateString = convertToDateString(date);
      onChange?.(date, dateString);
    }

    if (showTimeSelector) {
      setShowTimeSelector(false);
    }

    if (
      autoHide &&
      (!enableRangeSelection ||
        (enableRangeSelection && activeField === "end" && finalRangeValue?.start))
    ) {
      setIsOpen(false);
      setShowTimeSelector(false);
      onHide?.();
    }
  };

  const selectToday = () => {
    const todayDate: CalendarDate = {
      year: today.getFullYear(),
      month: today.getMonth(),
      day: today.getDate(),
    };

    setCurrentYear(todayDate.year);
    setCurrentMonth(todayDate.month);
    
    const dateString = convertToDateString(todayDate);
    onChange?.(todayDate, dateString);

    if (enableTimeSelection && showTimeSelector) {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      
      let hour12: number;
      let period: "AM" | "PM";
      
      if (currentHour === 0) {
        hour12 = 12;
        period = "AM";
      } else if (currentHour === 12) {
        hour12 = 12;
        period = "PM";
      } else if (currentHour > 12) {
        hour12 = currentHour - 12;
        period = "PM";
      } else {
        hour12 = currentHour;
        period = "AM";
      }
      
      setSelectedHour(hour12);
      setSelectedMinute(currentMinute);
      setSelectedPeriod(period);
      
      onTimeChange?.({
        hour: hour12,
        minute: currentMinute,
        period: period,
      });

      if (showTimeZoneSelector) {
        const localTZ = getLocalTimeZone();
        setInternalTimeZoneFormat(localTZ);
        onTimeZoneFormatChange?.(localTZ);
      }
    }

    if (autoHide) {
      setIsOpen(false);
      setShowTimeSelector(false);
      onHide?.();
    }
  };

  const clearDate = () => {
    if (enableRangeSelection) {
      const newRange = { start: null, end: null };
      if (!rangeValue) setInternalRangeValue(newRange);
      onRangeChange?.(newRange);
      setActiveField("start");
    } else {
      onChange?.(null, '');
    }
    if (enableTimeSelection) {
      onTimeChange?.({ hour: 12, minute: 0, period: "AM" });
      setSelectedHour(12);
      setSelectedMinute(0);
      setSelectedPeriod("AM");
    }
  };

  const toggleCalendar = () => {
    if (disabled) return;

    const newState = !isOpen;
    setIsOpen(newState);

    if (newState) {
      setShowTimeSelector(false);
      onShow?.();
    } else {
      setShowTimeSelector(false);
      onHide?.();
    }
  };

  const handleStartFieldClick = () => {
    if (!isOpen) {
      setIsOpen(true);
      onShow?.();
    }
    setActiveField("start");
    setShowTimeSelector(false);
  };

  const handleEndFieldClick = () => {
    if (!isOpen) {
      setIsOpen(true);
      onShow?.();
    }
    setActiveField("end");
    setShowTimeSelector(false);
  };

  const handleChooseTimeClick = () => {
    setShowTimeSelector(!showTimeSelector);
  };

  const handleChooseDateClick = () => {
    setShowTimeSelector(false);
  };

  const handleTimeFormatToggle = () => {
    const newFormat = internalTimeFormat === "12h" ? "24h" : "12h";
    setInternalTimeFormat(newFormat);
    onTimeFormatChange?.(newFormat);
  };

  const handleTimeConfirm = () => {
    onTimeChange?.({
      hour: selectedHour,
      minute: selectedMinute,
      period: selectedPeriod,
    });
    setShowTimeSelector(false);
  };

  const handleDateConfirm = () => {
    setIsOpen(false);
    onHide?.();
  };

  const handleMonthYearClick = () => {
    if (enableYearDropdown) {
      setShowYearDropdown(!showYearDropdown);
    }
  };

  const handleYearSelect = (year: number) => {
    setCurrentYear(year);
    setShowYearDropdown(false);
  };

  const renderDays = () => {
    const days: React.ReactNode[] = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div
          key={`empty-start-${i}`}
          style={{ width: `${scaled(44)}px`, height: `${scaled(44)}px` }}
        />
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date: CalendarDate = {
        year: currentYear,
        month: currentMonth,
        day,
      };

      const isSelected = enableRangeSelection
        ? isSameDate(finalRangeValue?.start, date) || isSameDate(finalRangeValue?.end, date)
        : isSameDate(value, date);

      const isInRange =
        enableRangeSelection && finalRangeValue?.start && finalRangeValue?.end
          ? (() => {
              const currentTime = new Date(date.year, date.month, date.day).getTime();
              const startTime = new Date(
                finalRangeValue.start.year,
                finalRangeValue.start.month,
                finalRangeValue.start.day
              ).getTime();
              const endTime = new Date(
                finalRangeValue.end.year,
                finalRangeValue.end.month,
                finalRangeValue.end.day
              ).getTime();
              return currentTime > startTime && currentTime < endTime;
            })()
          : false;

      const isToday = isSameDate(
        {
          year: today.getFullYear(),
          month: today.getMonth(),
          day: today.getDate(),
        },
        date
      );

      const isBlocked = isBlockedDateHelper(date, blockDateConfig);

      days.push(
        <DayButton
          type="button"
          key={`current-${day}`}
          onClick={() => {
            if (!isBlocked) selectDate(day);
          }}
          disabled={isBlocked}
          $selected={isSelected}
          $isToday={isToday}
          $inRange={isInRange}
          $blocked={isBlocked}
          $scale={scale}
        >
          {day}
        </DayButton>
      );
    }

    const totalCells = firstDay + daysInMonth;
    const remainingCells = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
    for (let i = 0; i < remainingCells; i++) {
      days.push(
        <div
          key={`empty-end-${i}`}
          style={{ width: `${scaled(44)}px`, height: `${scaled(44)}px` }}
        />
      );
    }

    return days;
  };

  const renderTimeSelector = () => {
    const hours12 = Array.from({ length: 12 }, (_, i) => i + 1);
    const hours24 = Array.from({ length: 24 }, (_, i) => i);
    const minutes = Array.from({ length: 60 }, (_, i) => i);

    return (
      <TimeSelectorContainer>
        <TimeSelectorContent>
          {(showTimeFormatToggle || showDateFormatSelector || showTimeZoneSelector) && (
            <TimeFormatSection $scale={scale}>
              {showTimeFormatToggle && (
                <div style={{ marginBottom: `${scaled(12)}px` }}>
                  <TimeFormatRow $scale={scale}>
                    <TimeFormatLabel $scale={scale}>Format</TimeFormatLabel>
                    <TimeFormatToggleRow $scale={scale}>
                      <TimeFormatText $active={internalTimeFormat === "12h"} $scale={scale}>
                        12h
                      </TimeFormatText>
                      <ToggleSwitch
                        type="button"
                        onClick={handleTimeFormatToggle}
                        $active={internalTimeFormat === "24h"}
                        $scale={scale}
                        role="switch"
                        aria-checked={internalTimeFormat === "24h"}
                      >
                        <ToggleThumb $active={internalTimeFormat === "24h"} $scale={scale} />
                      </ToggleSwitch>
                      <TimeFormatText $active={internalTimeFormat === "24h"} $scale={scale}>
                        24h
                      </TimeFormatText>
                    </TimeFormatToggleRow>
                  </TimeFormatRow>
                </div>
              )}

              {(showDateFormatSelector || showTimeZoneSelector) && (
                <SelectRow $scale={scale}>
                  {showDateFormatSelector && (
                    <SelectWrapper $fullWidth={!showTimeZoneSelector}>
                      <SelectLabel $scale={scale} $align="center">
                        Date Format
                      </SelectLabel>
                      <SelectContainer $scale={scale} $fullWidth={!showTimeZoneSelector}>
                        <StyledSelect
                          value={internalDateFormat}
                          onChange={(e) => {
                            setInternalDateFormat(e.target.value);
                            onDateFormatChange?.(e.target.value);
                          }}
                          $scale={scale}
                          $fullWidth={!showTimeZoneSelector}
                        >
                          {DATE_FORMAT_OPTIONS.map((format) => (
                            <option key={format} value={format}>
                              {format}
                            </option>
                          ))}
                        </StyledSelect>
                        <SelectIcon $scale={scale} />
                      </SelectContainer>
                    </SelectWrapper>
                  )}

                  {showTimeZoneSelector && (
                    <SelectWrapper $fullWidth={!showDateFormatSelector}>
                      <SelectLabel $scale={scale} $align="right">
                        Time Format
                      </SelectLabel>
                      <SelectContainer $scale={scale} $fullWidth={!showDateFormatSelector}>
                        <StyledSelect
                          value={internalTimeZoneFormat}
                          onChange={(e) => {
                            setInternalTimeZoneFormat(e.target.value);
                            onTimeZoneFormatChange?.(e.target.value);
                          }}
                          $scale={scale}
                          $fullWidth={!showDateFormatSelector}
                        >
                          {TIME_ZONE_OPTIONS.map((zone) => (
                            <option key={zone} value={zone}>
                              {zone}
                            </option>
                          ))}
                        </StyledSelect>
                        <SelectIcon $scale={scale} />
                      </SelectContainer>
                    </SelectWrapper>
                  )}
                </SelectRow>
              )}
            </TimeFormatSection>
          )}

          <TimeSelectSection $scale={scale}>
            <TimeSelectLabel $scale={scale}>Time Select</TimeSelectLabel>

            <TimeSelectGrid $scale={scale}>
              <TimeSelectItem>
                <SelectContainer $scale={scale}>
                  <StyledSelect
                    value={
                      internalTimeFormat === "24h"
                        ? selectedPeriod === "PM" && selectedHour !== 12
                          ? selectedHour + 12
                          : selectedPeriod === "AM" && selectedHour === 12
                          ? 0
                          : selectedHour
                        : selectedHour
                    }
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (internalTimeFormat === "24h") {
                        if (value === 0) {
                          setSelectedHour(12);
                          setSelectedPeriod("AM");
                        } else if (value === 12) {
                          setSelectedHour(12);
                          setSelectedPeriod("PM");
                        } else if (value > 12) {
                          setSelectedHour(value - 12);
                          setSelectedPeriod("PM");
                        } else {
                          setSelectedHour(value);
                          setSelectedPeriod("AM");
                        }
                      } else {
                        setSelectedHour(value);
                      }
                    }}
                    $scale={scale}
                  >
                    {(internalTimeFormat === "24h" ? hours24 : hours12).map((hour) => (
                      <option key={hour} value={hour}>
                        {String(hour).padStart(2, "0")}
                      </option>
                    ))}
                  </StyledSelect>
                  <SelectIcon $scale={scale} />
                </SelectContainer>
              </TimeSelectItem>

              <TimeSelectItem>
                <SelectContainer $scale={scale}>
                  <StyledSelect
                    value={selectedMinute}
                    onChange={(e) => setSelectedMinute(Number(e.target.value))}
                    $scale={scale}
                  >
                    {minutes.map((minute) => (
                      <option key={minute} value={minute}>
                        {String(minute).padStart(2, "0")}
                      </option>
                    ))}
                  </StyledSelect>
                  <SelectIcon $scale={scale} />
                </SelectContainer>
              </TimeSelectItem>

              {internalTimeFormat === "12h" && (
                <TimeSelectItem>
                  <SelectContainer $scale={scale}>
                    <StyledSelect
                      value={selectedPeriod}
                      onChange={(e) => setSelectedPeriod(e.target.value as "AM" | "PM")}
                      $scale={scale}
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </StyledSelect>
                    <SelectIcon $scale={scale} />
                  </SelectContainer>
                </TimeSelectItem>
              )}
            </TimeSelectGrid>
          </TimeSelectSection>

          <PreviewSection $scale={scale}>
            <PreviewLabel $scale={scale}>Preview</PreviewLabel>
            <PreviewText $scale={scale}>
              {formatDateWithFormat(value ?? null, internalDateFormat)}{" "}
              {formatTime(
                { hour: selectedHour, minute: selectedMinute, period: selectedPeriod },
                internalTimeFormat
              )}
              {internalTimeZoneFormat !== "none" ? ` ${internalTimeZoneFormat}` : ""}
            </PreviewText>
          </PreviewSection>
        </TimeSelectorContent>

        <TimeFooter $scale={scale}>
          {(showTodayButton || showClearButton) && (
            <ButtonRow $scale={scale}>
              {showTodayButton && (
                <ActionButton
                  type="button"
                  onClick={selectToday}
                  $variant="today"
                  $fullWidth={!showClearButton}
                  $scale={scale}
                >
                  <HiOutlineClock style={{ 
                    width: `${scaled(14)}px`, 
                    height: `${scaled(14)}px` 
                  }} />
                  Current Time
                </ActionButton>
              )}
              {showClearButton && (
                <ActionButton
                  type="button"
                  onClick={clearDate}
                  $variant="clear"
                  $fullWidth={!showTodayButton}
                  $scale={scale}
                >
                  Clear
                </ActionButton>
              )}
            </ButtonRow>
          )}

          <ActionButton
            type="button"
            onClick={handleTimeConfirm}
            $variant="confirm"
            $fullWidth
            $scale={scale}
          >
            Confirm Time
          </ActionButton>
        </TimeFooter>
      </TimeSelectorContainer>
    );
  };

  const defaultIcon = (
    <HiCalendarDays style={{ 
      width: `${scaled(14)}px`, 
      height: `${scaled(14)}px` 
    }} />
  );

  return (
    <CalendarContainer ref={containerRef} className={className}>
      <InputWrapper>
        {showIcon && (
          <IconWrapper style={{ paddingLeft: `${scaled(12)}px` }}>
            {icon || defaultIcon}
          </IconWrapper>
        )}
        <CalendarInput
          type="text"
          value={
            enableRangeSelection && finalRangeValue
              ? finalRangeValue.start && finalRangeValue.end
                ? `${formatDate(finalRangeValue.start)} - ${formatDate(finalRangeValue.end)}`
                : finalRangeValue.start
                ? `${formatDate(finalRangeValue.start)} - ...`
                : ""
              : enableTimeSelection && value && timeValue
              ? `${formatDate(value)} ${formatTime(timeValue, internalTimeFormat)}`
              : formatDate(value ?? null)
          }
          onClick={toggleCalendar}
          readOnly
          disabled={disabled}
          placeholder={placeholder}
          $showIcon={showIcon}
          $disabled={disabled}
          $scale={scale}
        />
      </InputWrapper>

      {isOpen && (
        <CalendarDropdown $scale={scale} $positionAbove={positionAbove} ref={calendarRef}>
          <CalendarContent $scale={scale}>
            <CalendarTitle $scale={scale}>
              {enableRangeSelection ? "Select Date Range" : "Select Date & Time"}
            </CalendarTitle>

            {enableRangeSelection ? (
              <FieldButtonsRow $scale={scale}>
                <FieldButton
                  type="button"
                  onClick={handleStartFieldClick}
                  $active={activeField === "start"}
                  $scale={scale}
                >
                  {defaultIcon}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <FieldLabel $scale={scale}>From Date</FieldLabel>
                    <FieldValue $scale={scale}>
                      {finalRangeValue?.start ? formatDate(finalRangeValue.start) : "Select date"}
                    </FieldValue>
                  </div>
                </FieldButton>

                <FieldButton
                  type="button"
                  onClick={handleEndFieldClick}
                  $active={activeField === "end"}
                  $scale={scale}
                >
                  {defaultIcon}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <FieldLabel $scale={scale}>To Date</FieldLabel>
                    <FieldValue $scale={scale}>
                      {finalRangeValue?.end ? formatDate(finalRangeValue.end) : "Select date"}
                    </FieldValue>
                  </div>
                </FieldButton>
              </FieldButtonsRow>
            ) : (
              <FieldButtonsRow $scale={scale}>
                <FieldButton
                  type="button"
                  onClick={handleChooseDateClick}
                  $active={!showTimeSelector && enableTimeSelection}
                  $scale={scale}
                  $fullWidth={!enableTimeSelection}
                >
                  <span style={{ 
                    color: !showTimeSelector && enableTimeSelection ? 'white' : undefined,
                    width: `${scaled(14)}px`, 
                    height: `${scaled(14)}px`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {React.cloneElement(defaultIcon as React.ReactElement, {
                      style: { 
                        width: `${scaled(14)}px`, 
                        height: `${scaled(14)}px`,
                        color: !showTimeSelector && enableTimeSelection ? 'white' : undefined
                      }
                    })}
                  </span>
                  <FieldValue $scale={scale}>
                    {formatDate(value ?? null) || "Choose Date"}
                  </FieldValue>
                </FieldButton>

                {enableTimeSelection && (
                  <FieldButton
                    type="button"
                    onClick={handleChooseTimeClick}
                    $active={showTimeSelector}
                    $scale={scale}
                  >
                    <HiOutlineClock 
                      style={{ 
                        width: `${scaled(14)}px`, 
                        height: `${scaled(14)}px`,
                        color: showTimeSelector ? 'white' : undefined
                      }}
                    />
                    <FieldValue $scale={scale}>
                      {timeValue ? formatTime(timeValue, internalTimeFormat) : "Choose Time"}
                    </FieldValue>
                  </FieldButton>
                )}
              </FieldButtonsRow>
            )}

            {showTimeSelector ? (
              renderTimeSelector()
            ) : (
              <div style={{ 
                flex: '1 1 auto',
                minHeight: 0,
                display: 'flex',
                flexDirection: 'column'
              }}>
                <NavHeader $scale={scale}>
                  <NavRow $scale={scale}>
                    <NavButton
                      type="button"
                      onClick={previousMonth}
                      $scale={scale}
                      aria-label="Previous month"
                    >
                      <HiChevronLeft style={{ 
                        width: `${scaled(10)}px`, 
                        height: `${scaled(10)}px` 
                      }} />
                    </NavButton>

                    <div style={{ position: 'relative' }}>
                      <MonthYearButton
                        type="button"
                        onClick={handleMonthYearClick}
                        $clickable={enableYearDropdown}
                        $scale={scale}
                      >
                        {monthName} {currentYear}
                      </MonthYearButton>

                      {enableYearDropdown && showYearDropdown && (
                        <YearDropdown $scale={scale}>
                          {Array.from({ length: 201 }, (_, i) => {
                            const year = today.getFullYear() - 100 + i;
                            return (
                              <YearOption
                                key={year}
                                type="button"
                                onClick={() => handleYearSelect(year)}
                                $selected={year === currentYear}
                                $scale={scale}
                              >
                                {year}
                              </YearOption>
                            );
                          })}
                        </YearDropdown>
                      )}
                    </div>

                    <NavButton
                      type="button"
                      onClick={nextMonth}
                      $scale={scale}
                      aria-label="Next month"
                    >
                      <HiChevronRight style={{ 
                        width: `${scaled(10)}px`, 
                        height: `${scaled(10)}px` 
                      }} />
                    </NavButton>
                  </NavRow>

                  <DayNamesGrid $scale={scale}>
                    <GridContainer $scale={scale}>
                      {DAY_NAMES.map((day) => (
                        <DayName key={day} $scale={scale}>
                          {day}
                        </DayName>
                      ))}
                    </GridContainer>
                  </DayNamesGrid>
                </NavHeader>

                <CalendarGrid $scale={scale}>
                  <GridContainer $scale={scale}>
                    {renderDays()}
                  </GridContainer>
                </CalendarGrid>

                <FooterSection $scale={scale}>
                  {(showTodayButton || showClearButton) && (
                    <ButtonRow $scale={scale}>
                      {showTodayButton && (
                        <ActionButton
                          type="button"
                          onClick={selectToday}
                          $variant="today"
                          $fullWidth={!showClearButton}
                          $scale={scale}
                        >
                          <HiCalendarDays style={{ 
                            width: `${scaled(14)}px`, 
                            height: `${scaled(14)}px` 
                          }} />
                          Today
                        </ActionButton>
                      )}
                      {showClearButton && (
                        <ActionButton
                          type="button"
                          onClick={clearDate}
                          $variant="clear"
                          $fullWidth={!showTodayButton}
                          $scale={scale}
                        >
                          Clear
                        </ActionButton>
                      )}
                    </ButtonRow>
                  )}

                  <ActionButton
                    type="button"
                    onClick={handleDateConfirm}
                    $variant="confirm"
                    $fullWidth
                    $scale={scale}
                  >
                    Confirm Date
                  </ActionButton>
                </FooterSection>
              </div>
            )}
          </CalendarContent>
        </CalendarDropdown>
      )}
    </CalendarContainer>
  );
};

Calendar.displayName = "Calendar";
export { Calendar };
