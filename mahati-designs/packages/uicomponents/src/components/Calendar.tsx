"use client";

import React, { useMemo, useState } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/solid";

// Simple className join helper
const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

/* ======================================================
   HELPERS FOR FONT, SIZE, COLORS
====================================================== */

const resolveFontFamilyClass = (value?: string) => {
  if (!value) return "font-poppins"; // default
  if (value.startsWith("font-")) return value;

  switch (value.toLowerCase()) {
    case "poppins":
      return "font-poppins";
    case "sans":
    case "sans-serif":
      return "font-sans";
    case "serif":
      return "font-serif";
    case "mono":
    case "monospace":
      return "font-mono";
    default:
      return value;
  }
};

const resolveFontWeightClass = (value?: string) => {
  switch (value) {
    case "400":
      return "font-normal";
    case "500":
      return "font-medium";
    case "600":
      return "font-semibold";
    case "700":
      return "font-bold";
    default:
      // default = 600
      return "font-semibold";
  }
};

const resolveFontSizeClass = (value?: string) => {
  if (!value) return "text-[16px]";
  return `text-[${value}]`;
};

const normalizeRgba = (rgba?: string) =>
  rgba ? rgba.replace(/\s+/g, "") : undefined;

const buildTextColorClass = (rgba: string | undefined, fallback: string) => {
  const value = normalizeRgba(rgba) ?? fallback;
  return `text-[${value}]`;
};

const buildBgColorClass = (rgba: string | undefined, fallback: string) => {
  const value = normalizeRgba(rgba) ?? fallback;
  return `bg-[${value}]`;
};

/* ======================================================
   PROPS
====================================================== */

export interface CalendarProps {
  /** Mode of the calendar:
   *  - "single": single-date selection (default)
   *  - "range":  date range selection (From / To)
   */
  mode?: "single" | "range";

  /** Controlled single selected date (used in mode="single"). */
  value?: Date;
  /** Called when user selects a date in single mode. */
  onChange?: (date: Date) => void;

  /** Controlled range start date (used in mode="range"). */
  fromValue?: Date;
  /** Controlled range end date (used in mode="range"). */
  toValue?: Date;
  /** Called when user selects / updates a range in range mode. */
  onRangeChange?: (from?: Date, to?: Date) => void;

  /** Minimum selectable date (inclusive) */
  minDate?: Date;
  /** Maximum selectable date (inclusive) */
  maxDate?: Date;

  /** Extra classes for the outer container */
  className?: string;

  /**
   * Typography for current month + year label (e.g. "December 2025").
   * If not provided, defaults are:
   * - color: rgba(23, 97, 163, 1)
   * - font: Poppins
   * - size: 16px
   * - weight: 600
   */
  monthYearColorRGBA?: string;
  monthYearFontFamily?: string;
  monthYearFontSize?: string;   // e.g. "16px"
  monthYearFontWeight?: string; // e.g. "600"

  /**
   * Navigation buttons (Previous / Next)
   * If not provided, defaults are:
   * - background: rgba(23, 97, 163, 1)
   * - icon color: rgba(255, 255, 255, 1)
   * - width: 32px
   * - height: 30px
   * - radius: 6px
   */
  navButtonBgColorRGBA?: string;
  navButtonIconColorRGBA?: string;
  navButtonWidth?: string;   // "32px"
  navButtonHeight?: string;  // "30px"
  navButtonRadius?: string;  // "6px"

  /**
   * Selected date CELL (calendar grid day) styling.
   *
   * These are optional and have defaults:
   *  selectedDateWidth: "40px"
   *  selectedDateHeight: "38px"
   *  selectedDateRadius: "12px"
   *
   *  selectedDateClassName:
   *    Tailwind classes for background/extra styles of selected cell.
   *    If not provided, defaults to:
   *      "bg-gradient-to-b from-[rgba(23,97,163,1)] to-[rgba(77,175,131,1)]"
   */
  selectedDateWidth?: string;
  selectedDateHeight?: string;
  selectedDateRadius?: string;
  selectedDateClassName?: string;

  /**
   * FORMATTED SELECTED DATE PILL (top left, showing e.g. 12/01/2025)
   * Props for the OUTER gradient wrapper:
   * Defaults:
   * - height: 40px
   * - width: 160px (when time placeholder is visible)
   * - radius: 6px
   * - gradient: from rgba(23,97,163,1) to rgba(77,175,131,1)
   *
   * When `showTimePlaceholder` is false, the pill stretches full-width
   * in single mode. In range mode the layout is different (From/To rows).
   */
  headerDateHeight?: string;               // "40px"
  headerDateWidth?: string;                // "160px"
  headerDateRadius?: string;               // "6px"
  headerDateGradientFromRGBA?: string;     // "rgba(23,97,163,1)"
  headerDateGradientToRGBA?: string;       // "rgba(77,175,131,1)"

  /**
   * Whether to show the "Choose Time" placeholder pill on the right
   * (only relevant in single mode).
   *
   * - Default: false  → only the date pill is shown, stretched to full row.
   * - true:           → row has 2 pills: [date pill] [time placeholder]
   */
  showTimePlaceholder?: boolean;

  /**
   * Range mode: when true, consumers may show the number of days
   * between from/to in their preview (e.g. after "To" date).
   * Default: false.
   *
   * Note: the component does not render this text itself; it is meant
   * to be used by consuming UIs (like CalendarDemo preview).
   */
  showRangeDayCount?: boolean;
}

interface DayCell {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isDisabled: boolean;
}

/* ======================================================
   MAIN COMPONENT
====================================================== */

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const Calendar: React.FC<CalendarProps> = ({
  mode = "single",

  value,
  onChange,

  fromValue,
  toValue,
  onRangeChange,

  minDate,
  maxDate,
  className,

  monthYearColorRGBA,
  monthYearFontFamily,
  monthYearFontSize,
  monthYearFontWeight,

  navButtonBgColorRGBA,
  navButtonIconColorRGBA,
  navButtonWidth,
  navButtonHeight,
  navButtonRadius,

  selectedDateWidth,
  selectedDateHeight,
  selectedDateRadius,
  selectedDateClassName,

  headerDateHeight,
  headerDateWidth,
  headerDateRadius,
  headerDateGradientFromRGBA,
  headerDateGradientToRGBA,

  showTimePlaceholder = false,
}) => {
  const today = useMemo(() => startOfDay(new Date()), []);

  // Single-mode internal state
  const [internalDate, setInternalDate] = useState<Date | undefined>(
    value ?? today
  );

  // Range-mode internal state
  const [internalFrom, setInternalFrom] = useState<Date | undefined>();
  const [internalTo, setInternalTo] = useState<Date | undefined>();

  const isRangeMode = mode === "range";

  const selectedDate = !isRangeMode ? (value ?? internalDate) : undefined;

  const effectiveFrom = isRangeMode ? (fromValue ?? internalFrom) : undefined;
  const effectiveTo = isRangeMode ? (toValue ?? internalTo) : undefined;

  const [currentMonth, setCurrentMonth] = useState<Date>(() => {
    const base =
      (isRangeMode ? effectiveFrom ?? effectiveTo : selectedDate) ?? today;
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });

  const monthLabel = useMemo(
    () =>
      currentMonth.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      }),
    [currentMonth]
  );

  // For single mode: selected pill (MM/DD/YYYY)
  const formattedSelectedDate = useMemo(() => {
    if (!selectedDate) return "MM/DD/YYYY";
    return selectedDate.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  }, [selectedDate]);

  // For range mode: From / To pills (MM/DD/YYYY)
  const formattedFromDate = useMemo(() => {
    if (!effectiveFrom) return "MM/DD/YYYY";
    return effectiveFrom.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  }, [effectiveFrom]);

  const formattedToDate = useMemo(() => {
    if (!effectiveTo) return "MM/DD/YYYY";
    return effectiveTo.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  }, [effectiveTo]);

  const goToPreviousMonth = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  };

  const isDateDisabled = (date: Date) => {
    const ts = startOfDay(date).getTime();
    if (minDate && ts < startOfDay(minDate).getTime()) return true;
    if (maxDate && ts > startOfDay(maxDate).getTime()) return true;
    return false;
  };

  const handleSelectDateSingle = (date: Date) => {
    if (isDateDisabled(date)) return;
    if (!value) setInternalDate(date);
    onChange?.(date);
  };

  const handleSelectDateRange = (date: Date) => {
    if (isDateDisabled(date)) return;

    const clickedTs = startOfDay(date).getTime();
    const fromTs = effectiveFrom ? startOfDay(effectiveFrom).getTime() : null;
    const toTs = effectiveTo ? startOfDay(effectiveTo).getTime() : null;

    let newFrom: Date | undefined = effectiveFrom;
    let newTo: Date | undefined = effectiveTo;

    if (!effectiveFrom || (effectiveFrom && effectiveTo)) {
      // Start a new range
      newFrom = date;
      newTo = undefined;
    } else if (fromTs !== null && toTs === null) {
      if (clickedTs < fromTs) {
        // New start before previous start
        newFrom = date;
        newTo = undefined;
      } else if (clickedTs === fromTs) {
        // Same day as start: reset end
        newFrom = date;
        newTo = undefined;
      } else {
        // Valid end after start
        newFrom = effectiveFrom;
        newTo = date;
      }
    }

    // Uncontrolled: update internal
    if (!fromValue && !toValue) {
      setInternalFrom(newFrom);
      setInternalTo(newTo);
    }

    onRangeChange?.(newFrom, newTo);
  };

  const days: DayCell[] = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const startWeekday = firstDayOfMonth.getDay(); // 0 (Sun) - 6 (Sat)
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const totalCells = 42; // 6 weeks grid
    const cells: DayCell[] = [];

    for (let i = 0; i < totalCells; i++) {
      const dayOffset = i - startWeekday + 1;

      // Only show current month dates. Others: placeholders.
      if (dayOffset < 1 || dayOffset > daysInMonth) {
        cells.push({
          date: new Date(year, month, 1), // dummy
          isCurrentMonth: false,
          isToday: false,
          isSelected: false,
          isDisabled: true,
        });
        continue;
      }

      const cellDate = new Date(year, month, dayOffset);
      const cellTs = startOfDay(cellDate).getTime();
      const todayTs = startOfDay(today).getTime();
      const selectedTs = selectedDate
        ? startOfDay(selectedDate).getTime()
        : null;

      const isToday = cellTs === todayTs;
      const isSelected = selectedTs !== null && cellTs === selectedTs;
      const disabled = isDateDisabled(cellDate);

      cells.push({
        date: cellDate,
        isCurrentMonth: true,
        isToday,
        isSelected,
        isDisabled: disabled,
      });
    }

    return cells;
  }, [currentMonth, today, selectedDate, minDate, maxDate]);

  /* ======================================================
     RESOLVED CLASSES (WITH DEFAULTS)
  ======================================================= */

  // Card wrapper
  const containerClasses = cn(
    "w-[406px] h-[526px] rounded-[22px] border border-[#1761A3]",
    "bg-gradient-to-b from-[rgba(23,97,163,0.08)] to-[rgba(77,175,131,0.08)]",
    "p-6 shadow-sm",
    className
  );

  // Month + Year typography
  const monthYearClasses = cn(
    resolveFontFamilyClass(monthYearFontFamily || "poppins"),
    resolveFontSizeClass(monthYearFontSize || "16px"),
    resolveFontWeightClass(monthYearFontWeight || "600"),
    buildTextColorClass(monthYearColorRGBA, "rgba(23,97,163,1)")
  );

  // Navigation button defaults
  const navWidthClass = `w-[${navButtonWidth || "32px"}]`;
  const navHeightClass = `h-[${navButtonHeight || "30px"}]`;
  const navRadiusClass = `rounded-[${navButtonRadius || "6px"}]`;
  const navBgClass = buildBgColorClass(
    navButtonBgColorRGBA,
    "rgba(23,97,163,1)"
  );
  const navIconColorClass = buildTextColorClass(
    navButtonIconColorRGBA,
    "rgba(255,255,255,1)"
  );

  // SELECTED DATE CELL (GRID DAY)
  const selectedWidthClass = `w-[${selectedDateWidth || "40px"}]`;
  const selectedHeightClass = `h-[${selectedDateHeight || "38px"}]`;
  const selectedRadiusClass = `rounded-[${selectedDateRadius || "12px"}]`;

  const defaultSelectedGradient =
    "bg-gradient-to-b from-[rgba(23,97,163,1)] to-[rgba(77,175,131,1)]";

  const selectedBgClass =
    selectedDateClassName || defaultSelectedGradient;

  // HEADER DATE PILL (formattedSelectedDate) – single mode
  const headerDateHeightClass = `h-[${headerDateHeight || "40px"}]`;
  const headerDateWidthClass = showTimePlaceholder
    ? `w-[${headerDateWidth || "160px"}]`
    : "w-full";
  const headerDateRadiusClass = `rounded-[${headerDateRadius || "6px"}]`;

  const headerDateFrom = normalizeRgba(
    headerDateGradientFromRGBA || "rgba(23,97,163,1)"
  )!;
  const headerDateTo = normalizeRgba(
    headerDateGradientToRGBA || "rgba(77,175,131,1)"
  )!;

  const headerDateGradientClasses = cn(
    "bg-gradient-to-r",
    `from-[${headerDateFrom}]`,
    `to-[${headerDateTo}]`
  );

  /* ======================================================
     RENDER
  ======================================================= */

  return (
    <div className={containerClasses}>
      {/* Title */}
      <h2 className="mb-6 text-xl font-semibold text-slate-900">
        {isRangeMode ? "Select Date Range" : "Select Date &amp; Time"}
      </h2>

      {/* Header Pills Section */}
      {isRangeMode ? (
        // RANGE MODE: From / To pills in two rows, no time placeholder
        <div className="mb-6 space-y-3">
          {/* From Date pill */}
          <div className="flex items-center">
            <div className="h-[40px] w-full rounded-[6px] bg-gradient-to-r from-[rgba(23,97,163,1)] to-[rgba(77,175,131,1)] p-[1px]">
              <button
                type="button"
                className="flex h-full w-full items-center justify-between rounded-[5px] bg-white px-3"
              >
                <span className="inline-flex items-center gap-2">
                  <span className="font-poppins text-[12px] font-semibold text-black">
                    From:
                  </span>
                </span>
                <span className="font-poppins text-[12px] font-semibold text-black">
                  {formattedFromDate}
                </span>
              </button>
            </div>
          </div>

          {/* To Date pill */}
          <div className="flex items-center">
            <div className="h-[40px] w-full rounded-[6px] bg-gradient-to-r from-[rgba(23,97,163,1)] to-[rgba(77,175,131,1)] p-[1px]">
              <button
                type="button"
                className="flex h-full w-full items-center justify-between rounded-[5px] bg-white px-3"
              >
                <span className="inline-flex items-center gap-2">
                  <span className="font-poppins text-[12px] font-semibold text-black">
                    To:
                  </span>
                </span>
                <span className="font-poppins text-[12px] font-semibold text-black">
                  {formattedToDate}
                </span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        // SINGLE MODE: Selected date pill + optional time placeholder
        <div className="mb-6 flex gap-3">
          {/* Date display (formattedSelectedDate pill) */}
          <div className={cn("flex items-center", showTimePlaceholder ? "" : "flex-1")}>
            <div
              className={cn(
                headerDateHeightClass,
                headerDateWidthClass,
                headerDateRadiusClass,
                headerDateGradientClasses,
                "p-[1px]"
              )}
            >
              <button
                type="button"
                className="flex h-full w-full items-center justify-between rounded-[5px] bg-white px-3"
              >
                <span className="inline-flex items-center gap-2">
                  <CalendarDaysIcon className="h-4 w-4 text-sky-500" />
                  <span className="font-poppins text-[12px] font-semibold text-black">
                    {formattedSelectedDate}
                  </span>
                </span>
              </button>
            </div>
          </div>

          {/* Time placeholder pill (optional) */}
          {showTimePlaceholder && (
            <button
              type="button"
              className="flex-1 inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-500 shadow-sm"
            >
              Choose Time
            </button>
          )}
        </div>
      )}

      {/* Header: Prev | Month Label | Next */}
      <div className="mb-4 flex items-center justify-between">
        {/* PREVIOUS BUTTON */}
        <button
          type="button"
          onClick={goToPreviousMonth}
          className={cn(
            navWidthClass,
            navHeightClass,
            navRadiusClass,
            navBgClass,
            "flex items-center justify-center shadow-md"
          )}
        >
          <ChevronLeftIcon
            className={cn("h-4 w-4", navIconColorClass)}
          />
        </button>

        {/* MONTH + YEAR LABEL */}
        <div className={monthYearClasses}>{monthLabel}</div>

        {/* NEXT BUTTON */}
        <button
          type="button"
          onClick={goToNextMonth}
          className={cn(
            navWidthClass,
            navHeightClass,
            navRadiusClass,
            navBgClass,
            "flex items-center justify-center shadow-md"
          )}
        >
          <ChevronRightIcon
            className={cn("h-4 w-4", navIconColorClass)}
          />
        </button>
      </div>

      {/* Weekday header */}
      <div className="mb-2 grid grid-cols-7 gap-1 text-center text-xs font-semibold uppercase tracking-wide text-slate-400">
        <span>Sun</span>
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
      </div>

      {/* Days grid – ONLY CURRENT MONTH DATES SHOW NUMBERS */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          if (!day.isCurrentMonth) {
            return (
              <div
                key={`placeholder-${index}`}
                className="h-10 w-10"
              />
            );
          }

          const baseClasses =
            "flex items-center justify-center text-sm font-medium transition-colors duration-150";

          // Shared radius & size
          const selectedSizeAndRadius = cn(
            selectedWidthClass,
            selectedHeightClass,
            selectedRadiusClass
          );

          const normalSizeAndRadius = cn(
            "h-10 w-10",
            `rounded-[${selectedDateRadius || "12px"}]`
          );

          const cellTs = startOfDay(day.date).getTime();
          const todayTs = today.getTime();

          const fromTs = effectiveFrom
            ? startOfDay(effectiveFrom).getTime()
            : null;
          const toTs = effectiveTo ? startOfDay(effectiveTo).getTime() : null;

          const isRangeStart =
            isRangeMode && fromTs !== null && cellTs === fromTs;
          const isRangeEnd =
            isRangeMode && toTs !== null && cellTs === toTs;
          const isInRange =
            isRangeMode &&
            fromTs !== null &&
            toTs !== null &&
            cellTs > fromTs &&
            cellTs < toTs;

          const isToday = day.isToday;
          const isSelectedSingle =
            !isRangeMode && day.isSelected && !day.isDisabled;

          const sizeAndRadiusClasses = isSelectedSingle
            ? selectedSizeAndRadius
            : normalSizeAndRadius;

          let stateClasses: string;

          if (day.isDisabled) {
            stateClasses =
              "cursor-not-allowed bg-slate-50 text-slate-300";
          } else if (isRangeMode) {
            if (isRangeStart || isRangeEnd) {
              stateClasses = cn(
                selectedBgClass,
                "text-white shadow-md ring-2 ring-sky-300"
              );
            } else if (isInRange) {
              stateClasses =
                "bg-[rgba(0,123,255,0.10)] text-slate-700";
            } else {
              stateClasses =
                "bg-[rgba(0,123,255,0.05)] text-slate-600 hover:bg-sky-50 hover:text-sky-700";
            }
          } else if (isSelectedSingle) {
            stateClasses = cn(
              selectedBgClass,
              "text-white shadow-md ring-2 ring-sky-300"
            );
          } else {
            stateClasses =
              "bg-[rgba(0,123,255,0.05)] text-slate-600 hover:bg-sky-50 hover:text-sky-700";
          }

          const todayRing =
            !day.isDisabled &&
            !isSelectedSingle &&
            !isRangeStart &&
            !isRangeEnd &&
            isToday
              ? "ring-1 ring-sky-400"
              : "";

          const handleClick = () => {
            if (isRangeMode) {
              handleSelectDateRange(day.date);
            } else {
              handleSelectDateSingle(day.date);
            }
          };

          return (
            <button
              key={day.date.toISOString()}
              type="button"
              onClick={handleClick}
              disabled={day.isDisabled}
              className={cn(
                baseClasses,
                sizeAndRadiusClasses,
                stateClasses,
                todayRing
              )}
            >
              {day.date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
