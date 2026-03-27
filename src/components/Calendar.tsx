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
  calendartestId?:string;
  value?: CalendarDate | null;
  onChange?: (date: CalendarDate | null, dateString?: string) => void;
  enableRangeSelection?: boolean;
  rangeValue?: CalendarDateRange;
  previewTextStyles?: React.CSSProperties;
  globalTypography?: React.CSSProperties;
  onRangeChange?: (range: CalendarDateRange) => void;
  enableTimeSelection?: boolean;
  timeValue?: CalendarTime | null;
  onTimeChange?: (time: CalendarTime | null) => void;
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

const Calendar = ({
  calendartestId,
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
  previewTextStyles={},
  globalTypography={}
}: CalendarProps) => {
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
      onTimeChange?.(null);
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
       <button
  type="button"
  key={`current-${day}`}
  onClick={() => {
    if (!isBlocked) selectDate(day);
  }}



  disabled={isBlocked}
  className={`
    flex items-center justify-center rounded
    font-semibold transition-all
    ${isSelected ? "text-white shadow" : ""}
    ${!isSelected && isToday ? "border-2 border-[#1761A3] text-[#1761A3]" : ""}
    ${!isSelected && !isToday && !isInRange ? "bg-[rgba(0,123,255,0.05)] text-gray-700" : ""}
    ${isInRange && !isSelected ? "bg-[rgba(23,97,163,0.15)] text-gray-700" : ""}
    ${!isBlocked && !isSelected ? "hover:bg-[rgba(23,97,163,0.1)]" : ""}
    ${isBlocked ? "opacity-40 cursor-not-allowed text-gray-400" : "cursor-pointer"}
  `}
  style={{
    width: scale * 32,
    height: scale * 30,
    fontSize: scale * 14,
    background: isSelected
      ? "linear-gradient(to bottom,#1761A3,#4DAF83)"
      : undefined
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
        <div style={{ marginBottom: scaled(12) }}>

          {showTimeFormatToggle && (
            <div style={{ marginBottom: scaled(12) }}>

              <div className="flex flex-col gap-2">

                <span
                  className="font-semibold text-black"
                  style={{ fontSize: scale * 12 }}
                >
                  Format
                </span>

                <div
                  className="flex items-center"
                  style={{ gap: scale * 8 }}
                >

                  <span
                    className={`font-semibold ${
                      internalTimeFormat === "12h"
                        ? "text-[#111827]"
                        : "text-[#6b7280]"
                    }`}
                    style={{ fontSize: scale * 12 }}
                  >
                    12h
                  </span>

                  <button
                    type="button"
                    onClick={handleTimeFormatToggle}
                    role="switch"
                    aria-checked={internalTimeFormat === "24h"}
                    className="relative inline-flex items-center rounded-lg transition-all"
                    style={{
                      width: scale * 38,
                      height: scale * 17,
                      background:
                        internalTimeFormat === "24h"
                          ? "#1761A3"
                          : "#cbd5e1"
                    }}
                  >
                    <span
                      className="bg-white rounded-full shadow"
                      style={{
                        width: scale * 13,
                        height: scale * 13,
                        transform:
                          internalTimeFormat === "24h"
                            ? `translateX(${scale * 23}px)`
                            : `translateX(${scale * 2}px)`
                      }}
                    />
                  </button>

                  <span
                    className={`font-semibold ${
                      internalTimeFormat === "24h"
                        ? "text-[#111827]"
                        : "text-[#6b7280]"
                    }`}
                    style={{ fontSize: scale * 12 }}
                  >
                    24h
                  </span>

                </div>
              </div>
            </div>
          )}

          {(showDateFormatSelector || showTimeZoneSelector) && (
            <div
              className="flex items-start"
              style={{ gap: scale * 15 }}
            >

              {showDateFormatSelector && (
                <div className="flex flex-col flex-1">

                  <span
                    className="font-semibold text-black text-center"
                    style={{ fontSize: scale * 12 }}
                  >
                    Date Format
                  </span>

                  <div
                    className="relative"
                    style={{ height: scale * 40 }}
                  >
                    <select
                      value={internalDateFormat}
                      onChange={(e) => {
                        setInternalDateFormat(e.target.value);
                        onDateFormatChange?.(e.target.value);
                      }}
                      className="appearance-none border rounded-md font-semibold text-[#111827] cursor-pointer"
                      style={{
                        height: "100%",
                        width: "100%",
                        fontSize: scale * 12,
                        paddingLeft: scale * 36,
                        paddingRight: scale * 32,
                        border: "1px solid rgba(77,175,131,0.25)",
                        background: "#F0F8FF"
                      }}
                    >
                      {DATE_FORMAT_OPTIONS.map((format) => (
                        <option key={format}>{format}</option>
                      ))}
                    </select>

                    <HiChevronDown
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-[#6b7280]"
                      style={{ fontSize: scale * 18 }}
                    />
                  </div>

                </div>
              )}

              {showTimeZoneSelector && (
                <div className="flex flex-col flex-1">

                  <span
                    className="font-semibold text-black text-right"
                    style={{ fontSize: scale * 12 }}
                  >
                    Time Format
                  </span>

                  <div
                    className="relative"
                    style={{ height: scale * 40 }}
                  >
                    <select
                      value={internalTimeZoneFormat}
                      onChange={(e) => {
                        setInternalTimeZoneFormat(e.target.value);
                        onTimeZoneFormatChange?.(e.target.value);
                      }}
                      className="appearance-none border rounded-md font-semibold text-[#111827] cursor-pointer"
                      style={{
                        height: "100%",
                        width: "100%",
                        fontSize: scale * 12,
                        paddingLeft: scale * 16,
                        paddingRight: scale * 32,
                        border: "1px solid rgba(77,175,131,0.25)"
                      }}
                    >
                      {TIME_ZONE_OPTIONS.map((zone) => (
                        <option key={zone}>{zone}</option>
                      ))}
                    </select>

                    <HiChevronDown
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-[#6b7280]"
                      style={{ fontSize: scale * 18 }}
                    />
                  </div>

                </div>
              )}

            </div>
          )}
        </div>
      )}

      {/* TIME SELECT */}

      <div style={{ marginTop: scale * 16 }}>

        <label
          className="block text-[#374151] font-semibold"
          style={{
            marginBottom: scale * 12,
            fontSize: scale * 12
          }}
        >
          Time Select
        </label>

        <div
          className="flex"
          style={{ gap: scale * 12 }}
        >

          {/* HOURS */}

          <div className="flex-1 relative">

            <select
              value={selectedHour}
              onChange={(e) => setSelectedHour(Number(e.target.value))}
              className="appearance-none border rounded-md font-semibold cursor-pointer"
              style={{
                height: scale * 40,
                width: "100%",
                fontSize: scale * 12,
                paddingLeft: scale * 16,
                paddingRight: scale * 32
              }}
            >
              {(internalTimeFormat === "24h" ? hours24 : hours12).map((hour) => (
                <option key={hour} value={hour}>
                  {String(hour).padStart(2, "0")}
                </option>
              ))}
            </select>

            <HiChevronDown
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[#6b7280]"
              style={{ fontSize: scale * 18 }}
            />
          </div>

          {/* MINUTES */}

          <div className="flex-1 relative">

            <select
              value={selectedMinute}
              onChange={(e) => setSelectedMinute(Number(e.target.value))}
              className="appearance-none border rounded-md font-semibold cursor-pointer"
              style={{
                height: scale * 40,
                width: "100%",
                fontSize: scale * 12,
                paddingLeft: scale * 16,
                paddingRight: scale * 32
              }}
            >
              {minutes.map((minute) => (
                <option key={minute} value={minute}>
                  {String(minute).padStart(2, "0")}
                </option>
              ))}
            </select>

            <HiChevronDown
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[#6b7280]"
              style={{ fontSize: scale * 18 }}
            />
          </div>

          {internalTimeFormat === "12h" && (
            <div className="flex-1 relative">

              <select
                value={selectedPeriod}
                onChange={(e) =>
                  setSelectedPeriod(e.target.value as "AM" | "PM")
                }
                className="appearance-none border rounded-md font-semibold cursor-pointer"
                style={{
                  height: scale * 40,
                  width: "100%",
                  fontSize: scale * 12,
                  paddingLeft: scale * 16,
                  paddingRight: scale * 32
                }}
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>

              <HiChevronDown
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#6b7280]"
                style={{ fontSize: scale * 18 }}
              />

            </div>
          )}
        </div>
      </div>

      {/* PREVIEW */}

      <div style={{ marginTop: scale * 12 }}>

        <label
          className="block font-semibold text-[#374151]"
          style={{
            marginBottom: scale * 8,
            fontSize: scale * 12
          }}
        >
          Preview
        </label>

        <p
          className="text-[#1761A3] font-semibold"
          style={{ fontSize: scale * 12 }}
        >
          {formatDateWithFormat(value ?? null, internalDateFormat)}{" "}
          {formatTime(
            { hour: selectedHour, minute: selectedMinute, period: selectedPeriod },
            internalTimeFormat
          )}
          {internalTimeZoneFormat !== "none"
            ? ` ${internalTimeZoneFormat}`
            : ""}
        </p>

      </div>

    </div>

    {/* FOOTER */}

    <div
      className="border-t border-[#e5e7eb]"
      style={{ paddingTop: scale * 15 }}
    >

      {(showTodayButton || showClearButton) && (
        <div
          className="flex"
          style={{
            gap: scale * 12,
            marginBottom: scale * 8
          }}
        >

          {showTodayButton && (
            <button
              onClick={selectToday}
              className="flex items-center justify-center rounded-md font-semibold"
              style={{
                height: scale * 38,
                fontSize: scale * 12,
                background: "rgba(23,97,163,0.15)",
                color: "#1761A3",
                gap: scale * 8,
                flex: !showClearButton ? "none" : 1
              }}
            >
              <HiOutlineClock
                style={{
                  width: scaled(14),
                  height: scaled(14)
                }}
              />
              Current Time
            </button>
          )}

          {showClearButton && (
            <button
              onClick={clearDate}
              className="rounded-md font-semibold"
              style={{
                height: scale * 38,
                fontSize: scale * 12,
                background: "rgba(239,68,68,0.15)",
                color: "#EF4444",
                flex: !showTodayButton ? "none" : 1
              }}
            >
              Clear
            </button>
          )}

        </div>
      )}

      <button
        onClick={handleTimeConfirm}
        className="w-full rounded-md font-semibold text-white"
        style={{
          height: scale * 38,
          fontSize: scale * 12,
          background: "linear-gradient(to right,#1761A3,#4DAF83)"
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
    }} />
  );

 return (
  <div
    ref={containerRef}
    className={`relative ${className ?? ""}`}
    data-testid={calendartestId}
  >
    {/* INPUT WRAPPER */}

    <div className="relative">

      {showIcon && (
        <div
          className="pointer-events-none absolute inset-y-0 left-0 flex items-center"
          style={{ paddingLeft: scaled(12) }}
        >
          {(icon || defaultIcon) as any}
        </div>
      )}

      <input
        type="text"
        readOnly
        disabled={disabled}
        placeholder={placeholder}
        onClick={toggleCalendar}
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
        className="block w-full rounded-full border border-gray-300 bg-gray-50 font-semibold text-gray-900 shadow-sm transition-all focus:outline-none focus:border-blue-500"
        style={{
          paddingTop: scale * 10,
          paddingBottom: scale * 10,
          paddingLeft: showIcon ? scale * 40 : scale * 12,
          paddingRight: scale * 12,
          fontSize: scale * 12,
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.5 : 1
        }}
      />
    </div>

    {/* DROPDOWN */}

    {isOpen && (
      <div
        ref={calendarRef}
        className="absolute left-0 z-[9999] overflow-hidden bg-white"
        style={{
          width: scale * 406,
          borderRadius: scale * 22,
          border: "1px solid #1761A3",
          marginTop: positionAbove ? undefined : scale * 8,
          marginBottom: positionAbove ? scale * 8 : undefined
        }}
      >

        {/* CONTENT */}

        <div
          className="flex flex-col"
          style={{
            padding: scale * 24,
            background:
              "linear-gradient(to bottom, rgba(23,97,163,0.08), rgba(77,175,131,0.08))"
          }}
        >

          {/* TITLE */}

          <div
            className="font-bold text-gray-900"
            style={{
              fontSize: scale * 20,
              marginBottom: scale * 20
            }}
          >
            {enableRangeSelection
              ? "Select Date Range"
              : "Select Date & Time"}
          </div>

          {/* RANGE / DATE BUTTONS */}

          <div
            className={`flex items-center ${!enableTimeSelection ? "justify-center":"justify-center"}`}
            style={{
              gap: enableTimeSelection ? scale * 20 : 0,
              marginBottom: scale * 24,
              width: "100%"
            }}
          >

            {enableRangeSelection ? (
              <>
                {/* FROM DATE */}

                <button
                  type="button"
                  onClick={handleStartFieldClick}
                  className="flex items-center rounded-md shadow-sm"
                  style={{
                    height: scale * 40,
                    padding: `0 ${scale * 16}px`,
                    background:
                      activeField === "start"
                        ? "linear-gradient(to bottom,#1761A3,#4DAF83)"
                        : "white",
                    color:
                      activeField === "start"
                        ? "white"
                        : "#111827"
                  }}
                >
                  {defaultIcon}

                  <div className="flex flex-col items-start">

                    <span
                      className="text-gray-500"
                      style={{ fontSize: scale * 12,
                        gap : scale * 24,
                       }}
                    >
                      From Date
                    </span>

                    <span style={{ fontSize: scale * 14 }}>
                      {finalRangeValue?.start
                        ? formatDate(finalRangeValue.start)
                        : "Select date"}
                    </span>

                  </div>
                </button>

                {/* TO DATE */}

                <button
                  type="button"
                  onClick={handleEndFieldClick}
                  className="flex  items-center rounded-md shadow-sm"
                  style={{
                    height: scale * 40,
                    padding: `0 ${scale * 16}px`,
                    background:
                      activeField === "end"
                        ? "linear-gradient(to bottom,#1761A3,#4DAF83)"
                        : "white",
                    color:
                      activeField === "end"
                        ? "white"
                        : "#111827"
                  }}
                >
                  {defaultIcon}

                  <div className="flex flex-col items-start"
                  style={{gap: scale * 4}}
                  >

                    <span style={{ fontSize: scale * 12

                     }}>
                      To Date
                    </span>

                    <span style={{ fontSize: scale * 14 }}>
                      {finalRangeValue?.end
                        ? formatDate(finalRangeValue.end)
                        : "Select date"}
                    </span>

                  </div>
                </button>
              </>
            ) : (
              <>
                {/* DATE BUTTON */}

                <button
                  type="button"
                  onClick={handleChooseDateClick}
                  className="flex items-center justify-center rounded-md shadow-sm"
                  style={{
                    height: scale * 40,
                    padding: `0 ${scale * 16}px`,
                    minWidth:enableTimeSelection ? scale *140  : scale * 220,
                    background:
                      !showTimeSelector && enableTimeSelection
                        ? "linear-gradient(to bottom,#1761A3,#4DAF83)"
                        : "white",
                    color:
                      !showTimeSelector && enableTimeSelection
                        ? "white"
                        : "#111827"
                  }}
                >
                  {defaultIcon}

                  <span style={{ fontSize: scale * 14 }}>
                    {formatDate(value ?? null) || "Choose Date"}
                  </span>
                </button>

                {/* TIME BUTTON */}

                {enableTimeSelection && (
                  <button
                    type="button"
                    onClick={handleChooseTimeClick}
                    className="flex items-center rounded-md shadow-sm"
                    style={{
                      height: scale * 40,
                      padding: `0 ${scale * 16}px`,
                      marginLeft:scale *16,
                      background: showTimeSelector
                        ? "linear-gradient(to bottom,#1761A3,#4DAF83)"
                        : "white",
                      color: showTimeSelector
                        ? "white"
                        : "#111827"
                    }}
                  >
                    <HiOutlineClock
                      style={{
                        width: scaled(14),
                        height: scaled(14)
                      }}
                    />

                    <span style={{ fontSize: scale * 14 }}>
                      {timeValue
                        ? formatTime(
                            timeValue,
                            internalTimeFormat
                          )
                        : "Choose Time"}
                    </span>
                  </button>
                )}
              </>
            )}
          </div>

          {/* NAVIGATION */}

          <div style={{ marginBottom: scale * 22 }}>

            {/* <div className="flex items-center justify-between">

              <button 
                aria-label="Previous month"
                onClick={previousMonth}
                className="flex items-center justify-center rounded-md bg-[#1761A3] text-white"
                style={{
                  width: scale * 32,
                  height: scale * 30
                }}
              >
                <HiChevronLeft
                  style={{
                    width: scaled(10),
                    height: scaled(10)
                  }}
                />
              </button>

              <button
                onClick={handleMonthYearClick}
                className="font-bold text-[#1761A3]"
                style={{ fontSize: scale * 18 }}
              >
                {monthName} {currentYear}
              </button>

              <button
                aria-label="Next month"
                onClick={nextMonth}
                className="flex items-center justify-center rounded-md bg-[#1761A3] text-white"
                style={{
                  width: scale * 32,
                  height: scale * 30
                }}
              >
                <HiChevronRight
                  style={{
                    width: scaled(10),
                    height: scaled(10)
                  }}
                />
              </button>

            </div> */}
            <div className="relative flex items-center justify-between">

  <button 
    aria-label="Previous month"
    onClick={previousMonth}
    className="flex items-center justify-center rounded-md bg-[#1761A3] text-white"
    style={{
      width: scale * 32,
      height: scale * 30
    }}
  >
    <HiChevronLeft style={{ width: scaled(10), height: scaled(10) }} />
  </button>

  {/* 🔽 MONTH YEAR BUTTON */}
  <div className="relative">
    <button
      onClick={handleMonthYearClick}
      className="font-bold text-[#1761A3]"
      style={{ fontSize: scale * 18 }}
    >
      {monthName} {currentYear}
    </button>

    {/* 🔥 ADD DROPDOWN HERE */}
    {showYearDropdown && (
      <div
        className="absolute bg-white border rounded-md shadow-md z-[9999] max-h-40 overflow-y-auto"
        style={{
          marginTop: scale * 8,
          width: scale * 120
        }}
      >
        {Array.from({ length: 100 }, (_, i) => currentYear - 50 + i).map((year) => (
          <div
            key={year}
            onClick={() => handleYearSelect(year)}
            className="px-3 py-2 cursor-pointer hover:bg-gray-100"
            style={{ fontSize: scale * 12 }}
          >
            {year}
          </div>
        ))}
      </div>
    )}
  </div>

  <button
    aria-label="Next month"
    onClick={nextMonth}
    className="flex items-center justify-center rounded-md bg-[#1761A3] text-white"
    style={{
      width: scale * 32,
      height: scale * 30
    }}
  >
    <HiChevronRight style={{ width: scaled(10), height: scaled(10) }} />
  </button>

</div>

          </div>

          {/* DAYS GRID */}

         {!showTimeSelector ? (
  <>
    {/* DAYS GRID */}
    <div
      className="grid grid-cols-7"
      style={{ gap: scale * 24}}
    >
      {renderDays()}
    </div>

    {/* FOOTER */}
    <div
      className="flex justify-between"
      style={{
        gap: scale * 12,
        marginTop: scale * 8
      }}
    >
      {showTodayButton && (
        <button
          onClick={selectToday}
          className="flex items-center justify-center font-semibold"
          style={{
            width: scale * 165,
            height: scale * 38,
            borderRadius: scale * 6,
            background: "rgba(23, 97, 163, 0.15)",
            color: "#1761A3",
            fontSize: scale * 12,
            gap: scale * 8
          }}
        >
          <HiCalendarDays
            style={{
              width: scaled(14),
              height: scaled(14)
            }}
          />
          Today
        </button>
      )}

      {showClearButton && (
        <button
          onClick={clearDate}
          className="flex items-center justify-center font-semibold"
          style={{
            width: scale * 165,
            height: scale * 38,
            borderRadius: scale * 6,
            background: "rgba(239, 68, 68, 0.15)",
            color: "#EF4444",
            fontSize: scale * 12
          }}
        >
          🗑 Clear
        </button>
      )}
    </div>

    <button
      onClick={handleDateConfirm}
      className="w-full rounded-md font-semibold text-white"
      style={{
        height: scale * 38,
        marginTop:scale*12,
        background: "linear-gradient(to right,#1761A3,#4DAF83)"
      }}
    >
      Confirm Date
    </button>
  </>
) : (
  renderTimeSelector()   // 🔥 THIS LINE FIXES EVERYTHING
)}
          </div>

        </div>
      
    )}
  </div>
);
};

Calendar.displayName = "Calendar";
export { Calendar };
