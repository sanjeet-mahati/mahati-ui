"use client";
import React, { useState, useEffect, useRef } from "react";
import { HiOutlineClock, HiChevronDown, HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { HiCalendarDays } from "react-icons/hi2";

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

  navButtonLayout?: {
    width?: number;
    height?: number;
  };

  navButtonStyles?: {
    borderRadius?: number;
    backgroundColor?: string;
  };

  navArrowLayout?: {
    width?: number;
    height?: number;
    aspectRatio?: string;
  };

  navArrowStyles?: {
    backgroundImage?: string;
    backgroundColor?: string;
    backgroundPosition?: string;
    backgroundSize?: string;
    backgroundRepeat?: string;
  };

  timeButtonLayout?: {
    width?: number;
    height?: number;
  };

  timeButtonStyles?: {
    backgroundColor?: string;
    borderRadius?: number;
  };

  timeButtonHoverGradient?: {
    gradientStart?: string;
    gradientEnd?: string;
    gradientAngle?: number;
  };

  dateFieldLayout?: {
    width?: number;
    height?: number;
  };

  dateFieldStyles?: {
    borderRadius?: number;
    backgroundColor?: string;
  };

  todayButtonLayout?: {
    width?: number;
    height?: number;
  };

  todayButtonStyles?: {
    backgroundColor?: string;
    borderRadius?: number;
  };

  todayButtonHoverGradient?: {
    gradientStart?: string;
    gradientEnd?: string;
    gradientAngle?: number;
  };

  clearButtonLayout?: {
    width?: number;
    height?: number;
  };

  clearButtonStyles?: {
    backgroundColor?: string;
    borderRadius?: number;
  };

  confirmTimeButtonLayout?: {
    width?: number;
    height?: number;
  };

  confirmTimeButtonStyles?: {
    backgroundColor?: string;
    borderRadius?: number;
  };

  confirmTimeButtonHoverGradient?: {
    gradientStart?: string;
    gradientEnd?: string;
    gradientAngle?: number;
  };

  timeSelectLayout?: {
    width?: number;
    height?: number;
  };

  timeSelectStyles?: {
    borderRadius?: number;
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
  };

  timeFormatToggleLayout?: {
    width?: number;
    height?: number;
  };

  timeFormatToggleStyles?: {
    borderRadius?: number;
    backgroundColor?: string;
  };

  previewTextStyles?: {
    color?: string;
    fontFamily?: string;
    fontSize?: number;
    fontWeight?: number;
  };

  globalTypography?: {
    fontFamily?: string;
    fontSize?: number;
    fontWeight?: number;
    fontStyle?: string;
    lineHeight?: string;
  };

  calendarContainerLayout?: {
    width?: number;
    height?: number;
  };

  calendarContainerStyles?: {
    borderRadius?: number;
  };

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

const convertToDateString = (date: CalendarDate | null): string => {
  if (!date) return '';
  const year = date.year;
  const month = String(date.month + 1).padStart(2, '0'); 
  const day = String(date.day).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

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
    monthIndex: config.startDate.month - 1,
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
      const bufferSpace = 16;

      if (spaceBelow < calendarHeight + bufferSpace && spaceAbove > spaceBelow) {
        setPositionAbove(true);
      } else {
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

  // Calculate number of rows needed for the calendar grid
  const totalCells = firstDay + daysInMonth;
  const rowsNeeded = Math.ceil(totalCells / 7);

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
        onRangeChange?.({ start: date, end: rangeValue?.end || null });
        setActiveField("end");
      } else {
        const start = rangeValue?.start;
        if (start) {
          const startTime = new Date(start.year, start.month, start.day).getTime();
          const endTime = new Date(date.year, date.month, date.day).getTime();

          if (endTime < startTime) {
            onRangeChange?.({ start: date, end: start });
          } else {
            onRangeChange?.({ start, end: date });
          }
        } else {
          onRangeChange?.({ start: date, end: null });
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
        (enableRangeSelection && activeField === "end" && rangeValue?.start))
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
      onRangeChange?.({ start: null, end: null });
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
          className="flex items-center justify-center"
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
        ? isSameDate(rangeValue?.start, date) || isSameDate(rangeValue?.end, date)
        : isSameDate(value, date);

      const isInRange =
        enableRangeSelection && rangeValue?.start && rangeValue?.end
          ? (() => {
              const currentTime = new Date(date.year, date.month, date.day).getTime();
              const startTime = new Date(
                rangeValue.start.year,
                rangeValue.start.month,
                rangeValue.start.day
              ).getTime();
              const endTime = new Date(
                rangeValue.end.year,
                rangeValue.end.month,
                rangeValue.end.day
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
        <button
          type="button"
          key={`current-${day}`}
          onClick={() => {
            if (!isBlocked) selectDate(day);
          }}
          disabled={isBlocked}
          className={cn(
            "flex items-center justify-center rounded transition-all duration-200",
            isSelected && "bg-gradient-to-b from-[#1761A3] to-[#4DAF83] text-white shadow-md",
            !isSelected && isToday && "border-2 border-[#1761A3] text-[#1761A3]",
            !isSelected && !isToday && !isInRange && "bg-[rgba(0,123,255,0.05)] text-gray-700",
            isInRange && !isSelected && "bg-[rgba(23,97,163,0.15)] text-gray-700",
            !isSelected && !isBlocked && "hover:bg-[rgba(23,97,163,0.1)]",
            isBlocked && "cursor-not-allowed opacity-40 text-gray-400"
          )}
          style={{ 
            width: `${scaled(32)}px`, 
            height: `${scaled(30)}px`,
            fontSize: `${scaled(14)}px`,
            fontWeight: 600
          }}
        >
          {day}
        </button>
      );
    }

    const totalCells = firstDay + daysInMonth;
    const remainingCells = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
    for (let i = 0; i < remainingCells; i++) {
      days.push(
        <div
          key={`empty-end-${i}`}
          className="flex items-center justify-center"
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
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto">
          {(showTimeFormatToggle || showDateFormatSelector || showTimeZoneSelector) && (
            <div style={{ marginBottom: `${scaled(12)}px` }}>
              {showTimeFormatToggle && (
                <div style={{ marginBottom: `${scaled(12)}px` }}>
                  <div className="flex flex-col" style={{ gap: `${scaled(8)}px` }}>
                    <span className="text-black font-semibold" style={{ fontSize: `${scaled(12)}px` }}>
                      Format
                    </span>
                    <div className="flex items-center" style={{ gap: `${scaled(8)}px` }}>
                      <span
                        className={cn(
                          "transition-colors duration-200 font-semibold",
                          internalTimeFormat === "12h"
                            ? "text-gray-900"
                            : "text-gray-500"
                        )}
                        style={{ fontSize: `${scaled(12)}px` }}
                      >
                        12h
                      </span>
                      <button
                        type="button"
                        onClick={handleTimeFormatToggle}
                        className={cn(
                          "relative inline-flex items-center rounded-[8px] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                          internalTimeFormat === "24h" ? "bg-[#1761A3]" : "bg-slate-300"
                        )}
                        style={{
                          width: `${scaled(38)}px`,
                          height: `${scaled(17)}px`
                        }}
                        role="switch"
                        aria-checked={internalTimeFormat === "24h"}
                      >
                        <span
                          className="inline-block rounded-full transform bg-white shadow-md transition-transform duration-200"
                          style={{
                            width: `${scaled(13)}px`,
                            height: `${scaled(13)}px`,
                            transform: internalTimeFormat === "24h" 
                              ? `translateX(${scaled(23)}px)` 
                              : `translateX(${scaled(2)}px)`
                          }}
                        />
                      </button>
                      <span
                        className={cn(
                          "transition-colors duration-200 font-semibold",
                          internalTimeFormat === "24h"
                            ? "text-gray-900"
                            : "text-gray-500"
                        )}
                        style={{ fontSize: `${scaled(12)}px` }}
                      >
                        24h
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {(showDateFormatSelector || showTimeZoneSelector) && (
                <div className="flex items-start" style={{ gap: `${scaled(15)}px` }}>
                  {showDateFormatSelector && (
                    <div className={cn(
                      "flex flex-col",
                      showTimeZoneSelector ? "flex-1" : "w-full"
                    )} style={{ gap: `${scaled(8)}px` }}>
                      <span className="text-black font-semibold" style={{ 
                        fontSize: `${scaled(12)}px`,
                        paddingLeft: `${scaled(36)}px`
                      }}>
                        Date Format
                      </span>
                      <div className={cn(
                        "relative",
                        showTimeZoneSelector ? "" : "w-full"
                      )} style={{ height: `${scaled(40)}px` }}>
                        <select
                          value={internalDateFormat}
                          onChange={(e) => {
                            setInternalDateFormat(e.target.value);
                            onDateFormatChange?.(e.target.value);
                          }}
                          className={cn(
                            "block h-full border border-[rgba(23,97,163,0.4)] bg-[#F0F8FF] text-gray-900 font-semibold rounded-[6px] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-200 appearance-none",
                            showTimeZoneSelector ? "w-full" : "w-full",
                            "hover:bg-gradient-to-r hover:from-[rgba(23,97,163,0.4)] hover:to-[rgba(77,175,131,0.4)]"
                          )}
                          style={{
                            fontSize: `${scaled(12)}px`,
                            paddingLeft: `${scaled(36)}px`,
                            paddingRight: `${scaled(32)}px`
                          }}
                        >
                          {DATE_FORMAT_OPTIONS.map((format) => (
                            <option key={format} value={format}>
                              {format}
                            </option>
                          ))}
                        </select>
                        <HiChevronDown 
                          className="pointer-events-none absolute top-1/2 -translate-y-1/2 text-gray-500" 
                          style={{ 
                            right: `${scaled(8)}px`,
                            fontSize: `${scaled(18)}px`
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {showTimeZoneSelector && (
                    <div className={cn(
                      "flex flex-col",
                      showDateFormatSelector ? "flex-1" : "w-full"
                    )} style={{ gap: `${scaled(8)}px` }}>
                      <span className="text-black font-semibold text-right" style={{ 
                        fontSize: `${scaled(12)}px`,
                        paddingRight: `${scaled(36)}px`
                      }}>
                        Time Format
                      </span>
                      <div className={cn(
                        "relative",
                        showDateFormatSelector ? "" : "w-full"
                      )} style={{ height: `${scaled(40)}px` }}>
                        <select
                          value={internalTimeZoneFormat}
                          onChange={(e) => {
                            setInternalTimeZoneFormat(e.target.value);
                            onTimeZoneFormatChange?.(e.target.value);
                          }}
                          className={cn(
                            "block h-full border border-[rgba(23,97,163,0.4)] bg-[#F0F8FF] text-gray-900 font-semibold rounded-[6px] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-200 appearance-none",
                            showDateFormatSelector ? "w-full" : "w-full",
                            "hover:bg-gradient-to-r hover:from-[rgba(23,97,163,0.4)] hover:to-[rgba(77,175,131,0.4)]"
                          )}
                          style={{
                            fontSize: `${scaled(12)}px`,
                            paddingRight: `${scaled(36)}px`,
                            paddingLeft: `${scaled(32)}px`
                          }}
                        >
                          {TIME_ZONE_OPTIONS.map((zone) => (
                            <option key={zone} value={zone}>
                              {zone}
                            </option>
                          ))}
                        </select>
                        <HiChevronDown 
                          className="pointer-events-none absolute top-1/2 -translate-y-1/2 text-gray-500" 
                          style={{ 
                            right: `${scaled(8)}px`,
                            fontSize: `${scaled(18)}px`
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div style={{ marginTop: `${scaled(16)}px` }}>
            <label className="block text-gray-700 font-semibold" style={{ 
              marginBottom: `${scaled(12)}px`,
              fontSize: `${scaled(12)}px`
            }}>
              Time Select
            </label>

            <div className="flex" style={{ gap: `${scaled(12)}px` }}>
              <div className="flex-1">
                <div className="relative" style={{ width: `${scaled(106)}px` }}>
                  <select
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
                    className="block w-full bg-white border border-[rgba(77,175,131,0.25)] text-gray-900 font-semibold rounded-[6px] transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 appearance-none"
                    style={{
                      height: `${scaled(40)}px`,
                      fontSize: `${scaled(12)}px`,
                      paddingLeft: `${scaled(16)}px`,
                      paddingRight: `${scaled(32)}px`
                    }}
                  >
                    {(internalTimeFormat === "24h" ? hours24 : hours12).map((hour) => (
                      <option key={hour} value={hour}>
                        {String(hour).padStart(2, "0")}
                      </option>
                    ))}
                  </select>
                  <HiChevronDown 
                    className="pointer-events-none absolute top-1/2 -translate-y-1/2 text-gray-500" 
                    style={{ 
                      right: `${scaled(8)}px`,
                      fontSize: `${scaled(18)}px`
                    }}
                  />
                </div>
              </div>

              <div className="flex-1">
                <div className="relative" style={{ width: `${scaled(106)}px` }}>
                  <select
                    value={selectedMinute}
                    onChange={(e) => setSelectedMinute(Number(e.target.value))}
                    className="block w-full bg-white border border-[rgba(77,175,131,0.25)] text-gray-900 font-semibold rounded-[6px] transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 appearance-none"
                    style={{
                      height: `${scaled(40)}px`,
                      fontSize: `${scaled(12)}px`,
                      paddingLeft: `${scaled(16)}px`,
                      paddingRight: `${scaled(32)}px`
                    }}
                  >
                    {minutes.map((minute) => (
                      <option key={minute} value={minute}>
                        {String(minute).padStart(2, "0")}
                      </option>
                    ))}
                  </select>
                  <HiChevronDown 
                    className="pointer-events-none absolute top-1/2 -translate-y-1/2 text-gray-500" 
                    style={{ 
                      right: `${scaled(8)}px`,
                      fontSize: `${scaled(18)}px`
                    }}
                  />
                </div>
              </div>

              {internalTimeFormat === "12h" && (
                <div className="flex-1">
                  <div className="relative" style={{ width: `${scaled(106)}px` }}>
                    <select
                      value={selectedPeriod}
                      onChange={(e) => setSelectedPeriod(e.target.value as "AM" | "PM")}
                      className="block w-full bg-white border border-[rgba(77,175,131,0.25)] text-gray-900 font-semibold rounded-[6px] transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 appearance-none"
                      style={{
                        height: `${scaled(40)}px`,
                        fontSize: `${scaled(12)}px`,
                        paddingLeft: `${scaled(16)}px`,
                        paddingRight: `${scaled(32)}px`
                      }}
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                    <HiChevronDown 
                      className="pointer-events-none absolute top-1/2 -translate-y-1/2 text-gray-500" 
                      style={{ 
                        right: `${scaled(8)}px`,
                        fontSize: `${scaled(18)}px`
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div style={{ marginTop: `${scaled(12)}px` }}>
            <label className="block text-gray-700 font-semibold" style={{ 
              marginBottom: `${scaled(8)}px`,
              fontSize: `${scaled(12)}px`
            }}>
              Preview
            </label>
            <p className="text-left text-[#1761A3] font-semibold" style={{ fontSize: `${scaled(12)}px` }}>
              {formatDateWithFormat(value ?? null, internalDateFormat)}{" "}
              {formatTime(
                { hour: selectedHour, minute: selectedMinute, period: selectedPeriod },
                internalTimeFormat
              )}
              {internalTimeZoneFormat !== "none" ? ` ${internalTimeZoneFormat}` : ""}
            </p>
          </div>
        </div>

        <div className="mt-auto border-t border-gray-200 flex-shrink-0" style={{ paddingTop: `${scaled(15)}px` }}>
          {(showTodayButton || showClearButton) && (
            <div className="flex" style={{ 
              gap: `${scaled(12)}px`,
              marginBottom: `${scaled(15)}px`
            }}>
              {showTodayButton && (
                <button
                  type="button"
                  onClick={selectToday}
                  className={cn(
                    "flex items-center justify-center rounded-[6px] text-[#1761A3] font-semibold bg-[rgba(23,97,163,0.15)] transition-all duration-200 hover:bg-gradient-to-b hover:from-[#1761A3] hover:to-[#4DAF83] hover:text-white",
                    showClearButton ? "flex-1" : "w-full"
                  )}
                  style={{
                    height: `${scaled(38)}px`,
                    fontSize: `${scaled(12)}px`,
                    gap: `${scaled(8)}px`
                  }}
                >
                  <HiOutlineClock style={{ 
                    width: `${scaled(14)}px`, 
                    height: `${scaled(14)}px` 
                  }} />
                  Current Time
                </button>
              )}
              {showClearButton && (
                <button
                  type="button"
                  onClick={clearDate}
                  className={cn(
                    "flex items-center justify-center rounded-[6px] text-[#EF4444] font-semibold bg-[rgba(239,68,68,0.15)] transition-all duration-200 hover:opacity-80",
                    showTodayButton ? "flex-1" : "w-full"
                  )}
                  style={{
                    height: `${scaled(38)}px`,
                    fontSize: `${scaled(12)}px`
                  }}
                >
                  Clear
                </button>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={handleTimeConfirm}
            className="w-full rounded-[6px] bg-gradient-to-r from-[#1761A3] to-[#4DAF83] text-white font-semibold transition-all duration-200 hover:opacity-90"
            style={{
              height: `${scaled(38)}px`,
              fontSize: `${scaled(12)}px`
            }}
          >
            Confirm Time
          </button>
        </div>
      </div>
    );
  };

  const defaultIcon = (
    <HiCalendarDays style={{ 
      width: `${scaled(14)}px`, 
      height: `${scaled(14)}px` 
    }} className="text-gray-700" />
  );

  const calendarContent = (
    <div 
      ref={calendarRef}
      className={cn(
        "absolute left-0 z-50 border border-[#1761A3] bg-white shadow-xl transition-all duration-300 bg-gradient-to-b from-[rgba(23,97,163,0.08)] to-[rgba(77,175,131,0.08)]",
        positionAbove ? "bottom-full" : "top-full"
      )}
      style={{
        [positionAbove ? 'marginBottom' : 'marginTop']: `${scaled(8)}px`,
        width: `${scaled(406)}px`,
        height: `${scaled(580)}px`,
        borderRadius: `${scaled(22)}px`,
        maxWidth: '95vw',
        overflow: 'hidden',
      }}
    >
      <div className="h-full flex flex-col" style={{ 
        padding: `${scaled(24)}px`,
        paddingBottom: `${scaled(22)}px`
      }}>
        <div className="text-left font-bold text-gray-900 flex-shrink-0" style={{ 
          marginBottom: `${scaled(20)}px`,
          fontSize: `${scaled(20)}px`
        }}>
          {enableRangeSelection ? "Select Date Range" : "Select Date & Time"}
        </div>

        {enableRangeSelection ? (
          <div className="flex flex-shrink-0" style={{ 
            marginBottom: `${scaled(24)}px`,
            gap: `${scaled(12)}px`
          }}>
            <button
              type="button"
              onClick={handleStartFieldClick}
              className={cn(
                "flex flex-1 items-center rounded-[6px] bg-white border-2 border-gray-200 shadow-sm transition-all duration-200",
                activeField === "start" && "ring-2 ring-blue-500"
              )}
              style={{
                width: `${scaled(160)}px`,
                height: `${scaled(40)}px`,
                gap: `${scaled(12)}px`,
                padding: `0 ${scaled(16)}px`
              }}
            >
              {defaultIcon}
              <div className="flex flex-col items-start">
                <span className="font-medium text-gray-500" style={{ fontSize: `${scaled(12)}px` }}>
                  From Date
                </span>
                <span className="font-semibold text-gray-900" style={{ fontSize: `${scaled(14)}px` }}>
                  {rangeValue?.start ? formatDate(rangeValue.start) : "Select date"}
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={handleEndFieldClick}
              className={cn(
                "flex flex-1 items-center rounded-[6px] bg-white border-2 border-gray-200 shadow-sm transition-all duration-200",
                activeField === "end" && "ring-2 ring-blue-500"
              )}
              style={{
                width: `${scaled(160)}px`,
                height: `${scaled(40)}px`,
                gap: `${scaled(12)}px`,
                padding: `0 ${scaled(16)}px`
              }}
            >
              {defaultIcon}
              <div className="flex flex-col items-start">
                <span className="font-medium text-gray-500" style={{ fontSize: `${scaled(12)}px` }}>
                  To Date
                </span>
                <span className="font-semibold text-gray-900" style={{ fontSize: `${scaled(14)}px` }}>
                  {rangeValue?.end ? formatDate(rangeValue.end) : "Select date"}
                </span>
              </div>
            </button>
          </div>
        ) : (
          <div className="flex flex-shrink-0" style={{ 
            marginBottom: `${scaled(24)}px`,
            gap: `${scaled(12)}px`
          }}>
            <button
              type="button"
              onClick={handleChooseDateClick}
              className={cn(
                "flex items-center rounded-[6px] shadow-sm transition-all duration-200",
                enableTimeSelection ? "" : "w-full",
                !showTimeSelector && enableTimeSelection 
                  ? "bg-gradient-to-b from-[#1761A3] to-[#4DAF83] text-white border-2 border-transparent" 
                  : "bg-white border-2 border-gray-200 text-gray-900"
              )}
              style={{
                width: enableTimeSelection ? `${scaled(160)}px` : undefined,
                height: `${scaled(40)}px`,
                gap: `${scaled(12)}px`,
                padding: `0 ${scaled(16)}px`
              }}
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
                  },
                  className: !showTimeSelector && enableTimeSelection ? 'text-white' : 'text-gray-700'
                })}
              </span>
              <span 
                className="font-semibold" 
                style={{ 
                  fontSize: `${scaled(14)}px`,
                  color: !showTimeSelector && enableTimeSelection ? 'white' : '#111827'
                }}
              >
                {formatDate(value ?? null) || "Choose Date"}
              </span>
            </button>

            {enableTimeSelection && (
              <button
                type="button"
                onClick={handleChooseTimeClick}
                className={cn(
                  "flex items-center rounded-[6px] shadow-sm transition-all duration-200",
                  showTimeSelector 
                    ? "bg-gradient-to-b from-[#1761A3] to-[#4DAF83] text-white border-2 border-transparent" 
                    : "bg-white border-2 border-gray-200"
                )}
                style={{
                  width: `${scaled(160)}px`,
                  height: `${scaled(40)}px`,
                  gap: `${scaled(8)}px`,
                  padding: `0 ${scaled(16)}px`,
                  fontSize: `${scaled(14)}px`
                }}
              >
                <HiOutlineClock 
                  style={{ 
                    width: `${scaled(14)}px`, 
                    height: `${scaled(14)}px`,
                    color: showTimeSelector ? 'white' : undefined
                  }}
                  className={showTimeSelector ? 'text-white' : 'text-gray-700'}
                />
                <span 
                  className="font-semibold"
                  style={{ 
                    color: showTimeSelector ? 'white' : '#374151'
                  }}
                >
                  {timeValue ? formatTime(timeValue, internalTimeFormat) : "Choose Time"}
                </span>
              </button>
            )}
          </div>
        )}

        {showTimeSelector ? (
          renderTimeSelector()
        ) : (
          <div className="flex flex-col" style={{ 
            flex: '1 1 auto',
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Navigation Header */}
            <div className="flex-shrink-0">
              <div className="flex items-center justify-between" style={{ marginBottom: `${scaled(22)}px` }}>
                <button
                  type="button"
                  onClick={previousMonth}
                  className="flex items-center justify-center rounded-[6px] bg-[#1761A3] text-white transition-colors duration-200 hover:bg-gradient-to-b hover:from-[#1761A3] hover:to-[#4DAF83]"
                  style={{
                    width: `${scaled(32)}px`,
                    height: `${scaled(30)}px`
                  }}
                  aria-label="Previous month"
                >
                  <span className="inline-flex items-center justify-center">
                    <HiChevronLeft style={{ 
                      width: `${scaled(10)}px`, 
                      height: `${scaled(10)}px` 
                    }} />
                  </span>
                </button>

                <div className="relative">
                  {enableYearDropdown ? (
                    <button
                      type="button"
                      onClick={handleMonthYearClick}
                      className="font-bold text-[#1761A3] transition-colors duration-200 hover:opacity-80"
                      style={{ fontSize: `${scaled(18)}px` }}
                    >
                      {monthName} {currentYear}
                    </button>
                  ) : (
                    <h2 className="font-bold text-[#1761A3]" style={{ fontSize: `${scaled(18)}px` }}>
                      {monthName} {currentYear}
                    </h2>
                  )}

                  {enableYearDropdown && showYearDropdown && (
                    <div 
                      className="absolute left-1/2 top-full z-50 overflow-y-auto bg-white shadow-xl border border-[rgba(77,175,131,0.25)] rounded-[6px] -translate-x-1/2"
                      style={{
                        marginTop: `${scaled(8)}px`,
                        width: `${scaled(120)}px`,
                        maxHeight: `${scaled(240)}px`
                      }}
                    >
                      {Array.from({ length: 201 }, (_, i) => {
                        const year = today.getFullYear() - 100 + i;
                        return (
                          <button
                            key={year}
                            type="button"
                            onClick={() => handleYearSelect(year)}
                            className={cn(
                              "block w-full text-left font-semibold transition-colors duration-150",
                              year === currentYear
                                ? "bg-[#1761A3] text-white"
                                : "text-gray-900 hover:bg-blue-50"
                            )}
                            style={{
                              fontSize: `${scaled(14)}px`,
                              padding: `${scaled(8)}px ${scaled(12)}px`
                            }}
                          >
                            {year}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={nextMonth}
                  className="flex items-center justify-center rounded-[6px] bg-[#1761A3] text-white transition-colors duration-200 hover:bg-gradient-to-b hover:from-[#1761A3] hover:to-[#4DAF83]"
                  style={{
                    width: `${scaled(32)}px`,
                    height: `${scaled(30)}px`
                  }}
                  aria-label="Next month"
                >
                  <span className="inline-flex items-center justify-center">
                    <HiChevronRight style={{ 
                      width: `${scaled(10)}px`, 
                      height: `${scaled(10)}px` 
                    }} />
                  </span>
                </button>
              </div>

              {/* Day Names */}
              <div style={{ marginBottom: `${scaled(6)}px` }}>
                <div className="grid grid-cols-7" style={{ 
                  gap: `${scaled(8)}px ${scaled(8)}px`
                }}>
                  {DAY_NAMES.map((day) => (
                    <div
                      key={day}
                      className="flex items-center justify-center font-bold text-gray-600"
                      style={{
                        width: `${scaled(44)}px`,
                        height: `${scaled(28)}px`,
                        fontSize: `${scaled(12)}px`
                      }}
                    >
                      {day}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Calendar Grid - Always allocate space for 6 rows */}
            <div 
              className="flex-shrink-0"
              style={{ 
                height: `${scaled(228)}px`,
                marginBottom: `${scaled(8)}px`
              }}
            >
              <div className="grid grid-cols-7" style={{ 
                gap: `${scaled(8)}px ${scaled(16)}px`
              }}>
                {renderDays()}
              </div>
            </div>

            {/* Footer Buttons - Fixed at bottom */}
            <div className="flex-shrink-0 border-t border-gray-200" style={{ paddingTop: `${scaled(12)}px` }}>
              {(showTodayButton || showClearButton) && (
                <div className="flex" style={{ 
                  gap: `${scaled(12)}px`,
                  marginBottom: `${scaled(8)}px`
                }}>
                  {showTodayButton && (
                    <button
                      type="button"
                      onClick={selectToday}
                      className={cn(
                        "flex items-center justify-center rounded-[6px] text-[#1761A3] font-semibold bg-[rgba(23,97,163,0.15)] transition-all duration-200 hover:bg-gradient-to-b hover:from-[#1761A3] hover:to-[#4DAF83] hover:text-white",
                        showClearButton ? "flex-1" : "w-full"
                      )}
                      style={{
                        height: `${scaled(38)}px`,
                        fontSize: `${scaled(12)}px`,
                        gap: `${scaled(8)}px`
                      }}
                    >
                      <HiCalendarDays style={{ 
                        width: `${scaled(14)}px`, 
                        height: `${scaled(14)}px` 
                      }} />
                      Today
                    </button>
                  )}
                  {showClearButton && (
                    <button
                      type="button"
                      onClick={clearDate}
                      className={cn(
                        "flex items-center justify-center rounded-[6px] text-[#EF4444] font-semibold bg-[rgba(239,68,68,0.15)] transition-all duration-200 hover:opacity-80",
                        showTodayButton ? "flex-1" : "w-full"
                      )}
                      style={{
                        height: `${scaled(38)}px`,
                        fontSize: `${scaled(12)}px`
                      }}
                    >
                      Clear
                    </button>
                  )}
                </div>
              )}

              <button
                type="button"
                onClick={handleDateConfirm}
                className="w-full rounded-[6px] bg-gradient-to-r from-[#1761A3] to-[#4DAF83] text-white font-semibold transition-all duration-200 hover:opacity-90"
                style={{
                  height: `${scaled(38)}px`,
                  fontSize: `${scaled(12)}px`
                }}
              >
                Confirm Date
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div className="relative">
        {showIcon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center" style={{ paddingLeft: `${scaled(12)}px` }}>
            {icon || defaultIcon}
          </div>
        )}
        <input
          type="text"
          value={
            enableRangeSelection && rangeValue
              ? rangeValue.start && rangeValue.end
                ? `${formatDate(rangeValue.start)} - ${formatDate(rangeValue.end)}`
                : rangeValue.start
                ? `${formatDate(rangeValue.start)} - ...`
                : ""
              : enableTimeSelection && value && timeValue
              ? `${formatDate(value)} ${formatTime(timeValue, internalTimeFormat)}`
              : formatDate(value ?? null)
          }
          onClick={toggleCalendar}
          readOnly
          disabled={disabled}
          placeholder={placeholder}
          className={cn(
            "block w-full rounded-full border border-gray-300 bg-gray-50 font-semibold shadow-sm text-gray-900 placeholder-gray-500 transition-colors duration-200 focus:border-blue-500 focus:ring-blue-500",
            disabled && "cursor-not-allowed opacity-50"
          )}
          style={{
            paddingTop: `${scaled(10)}px`,
            paddingBottom: `${scaled(10)}px`,
            paddingLeft: showIcon ? `${scaled(40)}px` : `${scaled(12)}px`,
            paddingRight: `${scaled(12)}px`,
            fontSize: `${scaled(12)}px`
          }}
        />
      </div>

      {isOpen && calendarContent}
    </div>
  );
};

Calendar.displayName = "Calendar";
export { Calendar };