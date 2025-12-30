"use client";

import React, { useState } from "react";
import { X, ChevronDown } from "lucide-react";

import { Button } from "./Button";
import { Card } from "./card";
import { Calendar, CalendarDateRange } from "./Calendar";

/* ===================== TYPES ===================== */

export type SelectOption = string;

export type FilterField =
  | {
      name: string;
      label: string;
      type: "text";
      placeholder?: string;
    }
  | {
      name: string;
      label: string;
      type: "select";
      options: SelectOption[];
    }
  | {
      name: string;
      label: string;
      type: "dateRange";
    };

export type FilterValues = Record<string, any>;

/* ===================== FILTER CONFIG ===================== */

const filterFields: FilterField[] = [
  {
    name: "date",
    label: "Date Range",
    type: "dateRange",
  },
  {
    name: "activity",
    label: "Activity Type",
    type: "select",
    options: ["Activity List", "Login", "Update", "Delete"],
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: ["Active", "Inactive", "Pending"],
  },
  {
    name: "keyword",
    label: "Keyword search",
    type: "text",
    placeholder: "Search...",
  },
];

/* ===================== MAIN COMPONENT ===================== */

export const Filter = () => {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<FilterValues>({
    date: { start: null, end: null },
  });

  const handleChange = (name: string, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const resetField = (name: string) => {
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

      {/* DROPDOWN */}
      {open && (
        <div className="absolute right-0 mt-3 z-50">
          <Card
            variant="figma"
            className="w-[360px] p-0 overflow-hidden bg-white"
          >
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

            {/* DYNAMIC FIELDS */}
            {filterFields.map((field) => (
              <Section
                key={field.name}
                title={field.label}
                onReset={() => resetField(field.name)}
              >
                {field.type === "text" && (
                  <input
                    type="text"
                    placeholder={field.placeholder}
                    value={values[field.name] || ""}
                    onChange={(e) =>
                      handleChange(field.name, e.target.value)
                    }
                    className="w-full px-4 py-3 rounded-[6px]
                      border border-slate-300 bg-white
                      focus:outline-none focus:ring-2 focus:ring-[#1761a3]"
                  />
                )}

                {field.type === "select" && (
                  <Select
                    value={values[field.name] || ""}
                    options={field.options}
                    onChange={(v) => handleChange(field.name, v)}
                  />
                )}

                {field.type === "dateRange" && (
                  <Calendar
                    enableRangeSelection
                    rangeValue={
                      values[field.name] as CalendarDateRange
                    }
                    onRangeChange={(range) =>
                      handleChange(field.name, range)
                    }
                    size="small"
                  />
                )}
              </Section>
            ))}

            {/* FOOTER */}
            <div className="flex justify-between items-center px-5 py-4
              bg-gradient-to-r from-[#f3fbf8] to-[#eef6fb]">
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

/* ===================== INTERNAL UI ===================== */

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

const Select = ({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
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
      <option value="">Select</option>
      {options.map((opt) => (
        <option key={opt}>{opt}</option>
      ))}
    </select>
    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2
      w-4 h-4 text-slate-500 pointer-events-none" />
  </div>
);