"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, ChevronDown } from "lucide-react";
import { createPortal } from "react-dom";

import { Button } from "./Button";
import { Calendar, CalendarDateRange } from "./Calendar";

/* ===================== TYPES ===================== */

type FilterValues = {
  date: CalendarDateRange;
  activity: string;
  status: string;
  keyword: string;
};

type FieldSize = "small" | "medium";

interface SelectOption {
  label: string;
  value: string | number;
}

interface MahatiActivityProps {
  value: string | number;
  onChange: (v: string | number) => void;
  options?: SelectOption[];
  size?: FieldSize;
  testId?: string;
}

interface MahatiStatusProps {
  value: string | number;
  onChange: (v: string | number) => void;
  options?: SelectOption[];
  size?: FieldSize;
  testId?: string;
}

interface MahatiSearchProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  size?: FieldSize;
  testId?: string;
}

/* ===================== CONSTANTS ===================== */

const DEFAULT_ACTIVITY_OPTIONS: SelectOption[] = [
  { label: "Select Activity", value: "" },
  { label: "Activity List", value: "Activity List" },
  { label: "Login", value: "Login" },
  { label: "Update", value: "Update" },
  { label: "Delete", value: "Delete" },
];

const DEFAULT_STATUS_OPTIONS: SelectOption[] = [
  { label: "Select Status", value: "" },
  { label: "Pending", value: "Pending" },
  { label: "Approved", value: "Approved" },
  { label: "Rejected", value: "Rejected" },
];

/* ===================== MAIN FILTER ===================== */

interface FilterProps {
  onApply?: (filters: FilterValues) => void;
  onReset?: () => void;
  activityOptions?: SelectOption[];
  statusOptions?: SelectOption[];
  searchPlaceholder?: string;
  testId?: string;
}

const Filter = ({
  onApply,
  onReset,
  activityOptions = DEFAULT_ACTIVITY_OPTIONS,
  statusOptions = DEFAULT_STATUS_OPTIONS,
  searchPlaceholder = "Search...",
  testId,
}: FilterProps) => {
  const [open, setOpen] = useState(false);

  const [values, setValues] = useState<FilterValues>({
    date: { start: null, end: null },
    activity: "",
    status: "",
    keyword: "",
  });

  const handleChange = (name: keyof FilterValues, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const resetField = (name: keyof FilterValues) => {
    if (name === "date") {
      setValues((prev) => ({
        ...prev,
        date: { start: null, end: null },
      }));
    } else {
      setValues((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const resetAll = () => {
    const newValues = {
      date: { start: null, end: null },
      activity: "",
      status: "",
      keyword: "",
    };
    setValues(newValues);

    if (onReset) onReset();
    else if (onApply) onApply(newValues);
  };

  const applyFilters = () => {
    if (onApply) onApply(values);
    setOpen(false);
  };

  return (
    <div className="relative" data-testid={testId}>
      {/* BUTTON */}

      <button
      type="button"
        data-testid={testId ? `${testId}-button` : undefined}
        onClick={() => setOpen((p) => !p)}
        className="
        flex items-center gap-2
        px-5 py-3
        rounded-lg
        border border-[rgba(23,97,163,0.35)]
        bg-gradient-to-r from-[#f2fbf8] to-[#eef6fb]
        text-slate-900 font-semibold
        shadow-sm
        hover:from-[#e8f5f0] hover:to-[#e0f0f6]
        focus:outline-none focus:ring-2 focus:ring-[#1761a3]
      "
      >
        Filter
      </button>

      {/* MODAL */}

      {open && (
        <div
          className="absolute right-0 mt-3 z-50"
          data-testid={testId ? `${testId}-model` : undefined}
        >
          <div className="w-[360px] bg-white border border-slate-200 rounded-lg shadow">
            {/* HEADER */}

            <div className="flex justify-between items-center px-5 py-3 border-b border-[rgba(23,97,163,0.35)]">
              <h3 className="text-base font-semibold">Add Filter</h3>

              <button
              type="button"
                data-testid={testId ? `${testId}-close` : undefined}
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 hover:bg-slate-200"
              >
                <X className="w-4 h-4 text-slate-600" />
              </button>
            </div>

            {/* DATE RANGE */}

            <Section title="Date Range" onReset={() => resetField("date")}>
              <Calendar
                enableRangeSelection
                rangeValue={values.date}
                onRangeChange={(range) => handleChange("date", range)}
                size="small"
              />
            </Section>

            {/* ACTIVITY */}

            <SelectWrapper>
              <select
                className="w-full appearance-none px-4 py-3 pr-10 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1761a3]"
                value={values.activity}
                onChange={(e) => handleChange("activity", e.target.value)}
              >
                {activityOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              <SelectIcon />
            </SelectWrapper>

            {/* STATUS */}

            <SelectWrapper>
              <select
                className="w-full appearance-none px-4 py-3 pr-10 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1761a3]"
                value={values.status}
                onChange={(e) => handleChange("status", e.target.value)}
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              <SelectIcon />
            </SelectWrapper>

            {/* SEARCH */}

            <input
              className="w-full px-4 py-3 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1761a3]"
              value={values.keyword}
              placeholder={searchPlaceholder}
              onChange={(e) => handleChange("keyword", e.target.value)}
            />

            {/* FOOTER */}

            <div className="flex justify-between items-center px-5 py-4 bg-gradient-to-r from-[#f3fbf8] to-[#eef6fb]">
              <button
              type="button"
                data-testid={testId ? `${testId}-resetall` : undefined}
                onClick={resetAll}
                className="border border-[#1761a3] bg-[#f0f8ff] px-4 py-2 rounded-md hover:bg-[#e6f3ff]"
              >
                Reset all
              </button>

              <button
              type="button"
                data-testid={testId ? `${testId}-apply` : undefined}
                onClick={applyFilters}
                className="px-4 py-2 rounded-md text-white bg-gradient-to-r from-[#1761a3] to-[#4daf83] hover:opacity-90"
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ===================== SECTION ===================== */

const Section = ({
  title,
  onReset,
  children,
}: {
  title: string;
  onReset: () => void;
  children: React.ReactNode;
}) => (
  <div className="px-5 py-4 bg-gradient-to-r from-[#f3fbf8] to-[#eef6fb] border-b border-[rgba(23,97,163,0.35)]">
    <div className="flex justify-between mb-3">
      <h6 className="font-semibold text-sm">{title}</h6>
      <button type="button" onClick={onReset} className="text-[#1761a3] text-sm font-semibold hover:opacity-80">
        Reset
      </button>
    </div>

    {children}
  </div>
);

/* ===================== SHARED ===================== */

const SelectWrapper = ({ children }: any) => (
  <div className="relative w-full mb-3">{children}</div>
);

const SelectIcon = () => (
  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
    <ChevronDown className="w-4 h-4" />
  </span>
);

/* ===================== PUBLISHABLE COMPONENTS ===================== */

/* ===================== PUBLISHABLE COMPONENTS ===================== */

/** ================= MAHATI ACTIVITY ================= */

const MahatiActivity = ({
  value,
  onChange,
  options = DEFAULT_ACTIVITY_OPTIONS,
  size = "medium",
  testId,
}: MahatiActivityProps) => {

  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [pos, setPos] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);

  const selectedLabel =
    options.find((o) => o.value == value)?.label || "Select Activity";

  const updatePosition = () => {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();

    setPos({
      top: rect.bottom + window.scrollY + 6,
      left: rect.left + window.scrollX,
      width: rect.width,
    });
  };

  useEffect(() => {

    if (!open) return;

    updatePosition();

    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };

  }, [open]);

  useEffect(() => {

    const handler = (e: MouseEvent) => {

      if (
        triggerRef.current?.contains(e.target as Node) ||
        dropdownRef.current?.contains(e.target as Node)
      ) {
        return;
      }

      setOpen(false);
    };

    document.addEventListener("mousedown", handler);

    return () => document.removeEventListener("mousedown", handler);

  }, []);

  return (
    <>
      {/* Trigger */}

      <div
        data-testid={testId ? `${testId}-trigger` : undefined}
        ref={triggerRef}
        onClick={() => setOpen((p) => !p)}
        className={`
          w-full
          flex items-center justify-between
          bg-white
          border
          rounded-md
          cursor-pointer
          transition
          ${
            open
              ? "border-[#1761a3] ring-2 ring-[#1761a333]"
              : "border-slate-300"
          }
          ${size === "small" ? "px-3 py-2" : "px-4 py-3"}
        `}
      >

        <span className="text-sm truncate">
          {selectedLabel}
        </span>

        <ChevronDown
          className={`w-4 h-4 text-slate-500 transition ${
            open ? "rotate-180" : ""
          }`}
        />

      </div>

      {/* Dropdown */}

      {open &&
        pos &&
        createPortal(

          <div
            data-testid={testId ? `${testId}-dropdown` : undefined}
            ref={dropdownRef}
            style={{
              top: pos.top,
              left: pos.left,
              width: pos.width,
              position: "absolute",
            }}
            className="
              z-[9999]
              bg-white
              border border-slate-300
              rounded-md
              shadow-xl
              max-h-[240px]
              overflow-y-auto
            "
          >

            {options.map((opt) => (

              <div
                key={String(opt.value)}
                data-testid={
                  testId
                    ? `${testId}-option-${String(opt.value)}`
                    : undefined
                }
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className="
                  px-4 py-2
                  text-sm
                  cursor-pointer
                  hover:bg-[#1761a3]
                  hover:text-white
                "
              >
                {opt.label}
              </div>

            ))}

          </div>,

          document.body
        )}
    </>
  );
};


/** ================= MAHATI STATUS ================= */

const MahatiStatus = ({
  value,
  onChange,
  options = DEFAULT_STATUS_OPTIONS,
  size = "medium",
  testId,
}: MahatiStatusProps) => {

  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [pos, setPos] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);

  const selectedLabel =
    options.find((o) => o.value == value)?.label || "Select Status";

  const updatePosition = () => {

    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();

    setPos({
      top: rect.bottom + window.scrollY + 6,
      left: rect.left + window.scrollX,
      width: rect.width,
    });

  };

  useEffect(() => {

    if (!open) return;

    updatePosition();

    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };

  }, [open]);

  useEffect(() => {

    const handler = (e: MouseEvent) => {

      if (
        triggerRef.current?.contains(e.target as Node) ||
        dropdownRef.current?.contains(e.target as Node)
      ) return;

      setOpen(false);

    };

    document.addEventListener("mousedown", handler);

    return () => document.removeEventListener("mousedown", handler);

  }, []);

  return (
    <>
      <div
        data-testid={testId ? `${testId}-trigger` : undefined}
        ref={triggerRef}
        onClick={() => setOpen((p) => !p)}
        className={`
          w-full
          flex items-center justify-between
          bg-white
          border
          rounded-md
          cursor-pointer
          transition
          ${
            open
              ? "border-[#1761a3] ring-2 ring-[#1761a333]"
              : "border-slate-300"
          }
          ${size === "small" ? "px-3 py-2" : "px-4 py-3"}
        `}
      >

        <span className="text-sm truncate">
          {selectedLabel}
        </span>

        <ChevronDown
          className={`w-4 h-4 text-slate-500 transition ${
            open ? "rotate-180" : ""
          }`}
        />

      </div>

      {open &&
        pos &&
        createPortal(

          <div
            data-testid={testId ? `${testId}-dropdown` : undefined}
            ref={dropdownRef}
            style={{
              top: pos.top,
              left: pos.left,
              width: pos.width,
              position: "absolute",
            }}
            className="
              z-[9999]
              bg-white
              border border-slate-300
              rounded-md
              shadow-xl
              max-h-[240px]
              overflow-y-auto
            "
          >

            {options.map((opt) => (

              <div
                key={String(opt.value)}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className="
                  px-4 py-2
                  text-sm
                  cursor-pointer
                  hover:bg-[#1761a3]
                  hover:text-white
                "
              >
                {opt.label}
              </div>

            ))}

          </div>,

          document.body
        )}
    </>
  );
};


/** ================= MAHATI SEARCH ================= */

const MahatiSearch = ({
  value,
  onChange,
  placeholder = "Search...",
  size = "medium",
  testId,
}: MahatiSearchProps) => (

  <input
    data-testid={testId}
    type="text"
    value={value}
    placeholder={placeholder}
    onChange={(e) => onChange(e.target.value)}
    className={`
      w-full
      border border-slate-300
      rounded-md
      bg-white
      text-sm
      focus:outline-none
      focus:ring-2
      focus:ring-[#1761a3]
      ${
        size === "small"
          ? "px-3 py-2"
          : "px-4 py-3"
      }
    `}
  />

);


/* ================= EXPORTS ================= */

Filter.displayName = "Filter";
MahatiActivity.displayName = "MahatiActivity";
MahatiStatus.displayName = "MahatiStatus";
MahatiSearch.displayName = "MahatiSearch";

export {
  Filter,
  MahatiActivity,
  MahatiStatus,
  MahatiSearch,
  DEFAULT_ACTIVITY_OPTIONS,
  DEFAULT_STATUS_OPTIONS,
};

export type {
  FilterValues,
  FieldSize,
  SelectOption,
  MahatiActivityProps,
  MahatiStatusProps,
  MahatiSearchProps,
};