"use client";

import React, { useState } from "react";
import { X, ChevronDown } from "lucide-react";

import { Button } from "./Button";
import { Card } from "./card";
import { Calendar, CalendarDateRange } from "./Calendar";

/* ===================== TYPES ===================== */

export type FilterValues = {
  date: CalendarDateRange;
  activity: string;
  status: string;
  keyword: string;
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
            <Section title="Activity Type" onReset={() => resetField("activity")}>
              <MahatiActivity
                value={values.activity}
                onChange={(v) => handleChange("activity", v)}
              />
            </Section>

            {/* STATUS */}
            <Section title="Status" onReset={() => resetField("status")}>
              <MahatiStatus
                value={values.status}
                onChange={(v) => handleChange("status", v)}
              />
            </Section>

            {/* SEARCH */}
            <Section title="Keyword search" onReset={() => resetField("keyword")}>
              <MahatiSearch
                value={values.keyword}
                onChange={(v) => handleChange("keyword", v)}
              />
            </Section>

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
  <div
    className="px-5 py-4 bg-gradient-to-r from-[#f3fbf8] to-[#eef6fb]
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

/* ===================== REUSABLE FIELDS ===================== */

const activityOptions = ["Activity List", "Login", "Update", "Delete"];
const statusOptions = ["Active", "Inactive", "Pending"];

export const MahatiActivity = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) => (
  <Select
    value={value}
    onChange={onChange}
    placeholder="Select Activity"
    options={activityOptions}
  />
);

export const MahatiStatus = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) => (
  <Select
    value={value}
    onChange={onChange}
    placeholder="Select Status"
    options={statusOptions}
  />
);

export const MahatiSearch = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) => (
  <input
    type="text"
    value={value}
    placeholder="Search..."
    onChange={(e) => onChange(e.target.value)}
    className="w-full px-4 py-3 rounded-[6px]
      border border-slate-300 bg-white
      focus:outline-none focus:ring-2 focus:ring-[#1761a3]"
  />
);

/* ===================== BASE SELECT ===================== */

const Select = ({
  value,
  options,
  placeholder,
  onChange,
}: {
  value: string;
  options: string[];
  placeholder: string;
  onChange: (v: string) => void;
}) => (
  <div className="relative">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full appearance-none px-4 py-3 pr-10
        rounded-[6px] border border-slate-300 bg-white
        focus:outline-none focus:ring-2 focus:ring-[#1761a3]"
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt}>{opt}</option>
      ))}
    </select>

    <ChevronDown
      className="absolute right-3 top-1/2 -translate-y-1/2
      w-4 h-4 text-slate-500 pointer-events-none"
    />
  </div>
);