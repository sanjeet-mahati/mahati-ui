"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, ChevronDown } from "lucide-react";

import { Button } from "./Button";
import { Card } from "./card";
import { Calendar, CalendarDateRange } from "./Calendar";
import { createPortal } from "react-dom";

/* ===================== TYPES ===================== */

export type FilterValues = {
  date: CalendarDateRange;
  activity: string;
  status: string;
  keyword: string;
};

export type FieldSize = "small" | "medium";

/* ===================== SIZE STYLES ===================== */
const selectExtraStyles = {
  small: "w-full pr-10",
  medium: "w-full pr-10",
};

const dropdownPadding: Record<FieldSize, string> = {
  small: "py-2.5",
  medium: "py-3",
};

const fieldStyles: Record<FieldSize, string> = {
  small:
    "w-full px-3 py-2 pr-5 bg-white border border-gray-300 rounded-md " +
    "appearance-none focus:outline-none focus:ring-2 focus:ring-[#1761a3]",

  medium:
    "w-full px-4 py-3 pr-6 bg-white border border-slate-300 rounded-md " +
    "appearance-none focus:outline-none focus:ring-2 focus:ring-[#1761a3]",
};


/* ===================== MAIN FILTER ===================== */

export const Filter = () => {
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
    setValues({
      date: { start: null, end: null },
      activity: "",
      status: "",
      keyword: "",
    });
  };

  const applyFilters = () => {
    console.log("Applied Filters:", values);
    setOpen(false);
  };

  return (
    <div className="relative">
      {/* FILTER BUTTON */}
      <Button
        variant="outline"
        className="flex items-center gap-2 px-5 py-3 rounded-lg
          border border-[rgba(23,97,163,0.35)]
          bg-gradient-to-r from-[#f2fbf8] to-[#eef6fb]
          text-[#0f172a] font-semibold shadow-sm"
        onClick={() => setOpen((p) => !p)}
      >
        Filter
      </Button>

      {/* FILTER MODAL */}
      {open && (
        <div className="absolute right-0 mt-3 z-50">
          <Card variant="figma" className="w-[360px] p-0 overflow-hidden bg-white">
            {/* HEADER */}
            <div className="flex justify-between items-center px-5 py-3 border-b border-[rgba(23,97,163,0.35)]">
              <h3 className="text-md font-semibold">Add Filter</h3>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center"
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
            <div className="relative w-full">
            <select
              value={values.activity}
              onChange={(e) => handleChange("activity", e.target.value)}
              className="
                w-full appearance-none
                px-4 py-3 pr-10
                rounded-[6px]
                border border-slate-300
                bg-white text-sm
                focus:outline-none focus:ring-2 focus:ring-[#1761A3]
              "
            >
              <option value="">Select Activity</option>
              <option>Activity List</option>
              <option>Login</option>
              <option>Update</option>
              <option>Delete</option>
            </select>

            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          </div>

            {/* STATUS */}
            <div className="relative w-full">
            <select
              value={values.status}
              onChange={(e) => handleChange("status", e.target.value)}
              className="
                w-full appearance-none
                px-4 py-3 pr-10
                rounded-[6px]
                border border-slate-300
                bg-white text-sm
                focus:outline-none focus:ring-2 focus:ring-[#1761A3]
              "
            >
              <option value="">Select Status</option>
              <option>Pending</option>
              <option>Approved</option>
              <option>Rejected</option>
            </select>

            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          </div>

            {/* SEARCH */}
            <input
              value={values.keyword}
              onChange={(e) => handleChange("keyword", e.target.value)}
              placeholder="Search..."
              className="
                w-full px-4 py-3
                rounded-[6px]
                border border-slate-300
                bg-white text-sm
                focus:outline-none focus:ring-2 focus:ring-[#1761A3]
              "
            />

            {/* FOOTER */}
            <div className="flex justify-between items-center px-5 py-4 bg-gradient-to-r from-[#f3fbf8] to-[#eef6fb]">
              <Button
                variant="outline"
                className="border-[#1761A3] bg-[#F0F8FF]"
                onClick={resetAll}
              >
                Reset all
              </Button>

              <Button
                className="text-white bg-gradient-to-r from-[#1761a3] to-[#4daf83]"
                onClick={applyFilters}
              >
                Apply Now
              </Button>
            </div>
          </Card>
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
  <div className="px-5 py-4 bg-gradient-to-r from-[#f3fbf8] to-[#eef6fb]
    border-b border-[rgba(23,97,163,0.35)]"
  >
    <div className="flex justify-between items-center mb-3">
      <h6 className="font-semibold text-sm">{title}</h6>
      <button
        onClick={onReset}
        className="text-[#1761a3] font-semibold text-sm"
      >
        Reset
      </button>
    </div>
    {children}
  </div>
);

/* ===================== REUSABLE OPTIONS ===================== */

const activityOptions = ["Activity List", "Login", "Update", "Delete"];
const statusOptions = ["Active", "Inactive", "Pending"];

/* ===================== PUBLISHABLE COMPONENTS ===================== */

export interface SelectOption {
  label: string;
  value: string | number;
}
/** ✅ MAHATI ACTIVITY */
export const DEFAULT_ACTIVITY_OPTIONS: SelectOption[] = [
  { label: "Select Activity", value: "" },
  { label: "Activity List", value: "Activity List" },
  { label: "Login", value: "Login" },
  { label: "Update", value: "Update" },
  { label: "Delete", value: "Delete" },
];

/** ✅ MAHATI ACTIVITY (Native <select>) */
export const MahatiActivity = ({
  value,
  onChange,
  options = DEFAULT_ACTIVITY_OPTIONS,
  size = "medium",
}: {
  value: string | number;
  onChange: (v: string | number) => void;
  options?: SelectOption[];
  size?: FieldSize;
}) => {
  return (
    <div className="relative w-full">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`
          ${fieldStyles[size]}
          appearance-none
          pr-10
        `}
      >
        {options?.map((opt) => (
          <option key={String(opt.value)} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Chevron icon */}
      <ChevronDown
        className="
          pointer-events-none
          absolute
          right-3
          top-1/2
          -translate-y-1/2
          w-4
          h-4
          text-slate-500
        "
      />
    </div>
  );
};

const getDropdownPosition = (el: HTMLElement) => {
  const rect = el.getBoundingClientRect();
  return {
    top: rect.bottom + window.scrollY + 6,
    left: rect.left + window.scrollX,
    width: rect.width,
  };
};

/** ✅ MAHATI STATUS */
export const DEFAULT_STATUS_OPTIONS: SelectOption[] = [
  { label: "Select Status", value: "" },
  { label: "Pending", value: "Pending" },
  { label: "Approved", value: "Approved" },
  { label: "Rejected", value: "Rejected" },
];
export const MahatiStatus = ({
  value,
  onChange,
  options= DEFAULT_STATUS_OPTIONS,
  size = "medium",
}: {
  value: string | number;
  onChange: (v: string | number) => void;
  options: SelectOption[];
  size?: "small" | "medium";
}) => {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);

  const selectedLabel =
    options?.find((o) => o.value == value)?.label || "Select Status";

  const updatePosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setPos({
      top: rect.bottom + window.scrollY + 6,
      left: rect.left + window.scrollX,
      width: rect.width,
    });
  };

  // keep dropdown aligned on scroll / resize
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

  // ✅ OUTSIDE CLICK FIX (trigger + dropdown)
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
        ref={triggerRef}
        onClick={() => setOpen((p) => !p)}
        className={`
          ${fieldStyles[size]}
          cursor-pointer
          flex items-center justify-between
          relative
          ${open ? "border-[#1761a3] ring-2 ring-[#1761a3]" : ""}
        `}
      >
        <span className="truncate">{selectedLabel}</span>
        <ChevronDown
          className={`w-4 h-4 text-slate-500 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Dropdown */}
      {open &&
        pos &&
        createPortal(
          <div
            ref={dropdownRef}
            style={{
              position: "absolute",
              top: pos.top,
              left: pos.left,
              width: pos.width,
            }}
            className="
              z-[9999]
              rounded-[6px]
              border border-slate-300
              bg-white
              shadow-xl
              max-h-[240px]
              overflow-y-auto
            "
          >
            {options?.map((opt) => (
              <div
                key={String(opt.value)}
                onClick={() => {
                  onChange(opt.value); // ✅ now works
                  setOpen(false);
                }}
                className="
                  px-4 py-2
                  text-sm
                  cursor-pointer
                  text-black hover:bg-[#1761a3] hover:text-white
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

/** ✅ MAHATI SEARCH */
export const MahatiSearch = ({
  value,
  onChange,
  placeholder = "Search...",
  size = "medium",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  size?: FieldSize;
}) => (
  <input
    type="text"
    value={value}
    placeholder={placeholder}
    onChange={(e) => onChange(e.target.value)}
    className={fieldStyles[size]}
  />
);