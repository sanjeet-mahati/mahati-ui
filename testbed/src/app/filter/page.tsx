"use client";

import React, { useState } from "react";
import { CodePreview } from "../CodePreview";
import { PropsTable } from "../PropsTable";
import {
  MahatiButton,
  MahatiActivity,
  MahatiStatus,
  MahatiSearch,
  MahatiCalendar,
  CalendarDate,
} from "@mahatisystems/mahati-ui-components";

export default function FilterPage() {
  const [open, setOpen] = useState(false);

  const [fromDate, setFromDate] = useState<CalendarDate | null>(null);
  const [toDate, setToDate] = useState<CalendarDate | null>(null);

  const [activityType, setActivityType] = useState("Activity List");
  const [status, setStatus] = useState("Active");
  const [keyword, setKeyword] = useState("");

  const filterProps = [
  {
    name: "open",
    type: "boolean",
    default: "false",
    description: "Controls whether the filter modal is visible.",
  },
  {
    name: "onClose",
    type: "() => void",
    default: "-",
    description: "Triggered when the close (X) button is clicked.",
  },
  {
    name: "fromDate",
    type: "CalendarDate | null",
    default: "null",
    description: "Selected start date in the date range filter.",
  },
  {
    name: "toDate",
    type: "CalendarDate | null",
    default: "null",
    description: "Selected end date in the date range filter.",
  },
  {
    name: "activityType",
    type: "string",
    default: `"Activity List"`,
    description: "Selected activity type value.",
  },
  {
    name: "status",
    type: "string",
    default: `"Active"`,
    description: "Selected status value.",
  },
  {
    name: "keyword",
    type: "string",
    default: '""',
    description: "Keyword entered in the search input.",
  },
];

const statusValues = [{
    label: "Select Status",
    value: ""
  }, {
    label: "In Force",
    value: 1
  }, {
    label: "Expired",
    value: 2
  }, {
    label: "Cancelled",
    value: 3
  }];

  const resetAll = () => {
    setFromDate(null);
    setToDate(null);
    setActivityType("Activity List");
    setStatus("Active");
    setKeyword("");
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 text-black">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Filter</h1>
        <p className="text-gray-600">
          Filters allow users to narrow down data using date range, status, and keywords.
        </p>
      </div>

      <PropsTable  props={filterProps} title="Props" />

      <br />

      <CodePreview
        title="Basic Filter"
        code={`<MahatiButton onClick={() => setOpen(true)}>Open Filter</MahatiButton>`}
        preview={
            <div className="flex justify-center py-10 relative">
            <MahatiButton
            onClick={() => setOpen(true)}
            className="
                flex items-center gap-2
                px-5 py-3
                rounded-[8px]
                border border-[rgba(23,97,163,0.35)]
                bg-gradient-to-r from-[#f2fbf8] to-[#eef6fb]
                text-[#0f172a] text-sm font-semibold
                shadow-sm
            "
            >
            <img
                src="/icons/filter-icon.png"
                alt="Filter"
                className="w-5 h-5 opacity-90"
            />
            Filter
            </MahatiButton>

            {open && (
            <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30">
                <div
                className="
                    w-[360px]
                    rounded-[8px]
                    border border-[rgba(23,97,163,0.35)]
                    bg-white
                    shadow-lg
                "
                >
                {/* HEADER */}
                <div className="flex justify-between items-center px-5 py-3 border-b border-[rgba(23,97,163,0.35)]">
                    <h3 className="text-md font-semibold">Add Filter</h3>
                    <button
                    onClick={() => setOpen(false)}
                    className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center"
                    >
                    <img
                        src="/icons/close-icon.png"
                        alt="Close"
                        className="w-4 h-4 opacity-90"
                    />
                    </button>
                </div>

                {/* DATE RANGE */}
                <div className="px-5 py-4 bg-gradient-to-r from-[#f3fbf8] to-[#eef6fb] border-b border-[rgba(23,97,163,0.35)]">
                    <div className="flex justify-between items-center mb-3">
                    <span className="font-semibold text-sm">Date Range</span>
                    <button
                        className="text-[#1761A3] font-semibold text-sm"
                        onClick={() => {
                        setFromDate(null);
                        setToDate(null);
                        }}
                    >
                        Reset
                    </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="text-xs text-slate-500">From</label>
                        <MahatiCalendar
                        value={fromDate}
                        onChange={setFromDate}
                        placeholder="Select date"
                        size="small"
                        autoHide
                        />
                    </div>

                    <div>
                        <label className="text-xs text-slate-500">To</label>
                        <MahatiCalendar
                        value={toDate}
                        onChange={setToDate}
                        placeholder="Select date"
                        size="small"
                        autoHide
                        />
                    </div>
                    </div>
                </div>

                {/* ACTIVITY TYPE */}
                <div className="px-5 py-4 bg-gradient-to-r from-[#f3fbf8] to-[#eef6fb] border-b border-[rgba(23,97,163,0.35)]">
                    <div className="flex justify-between items-center mb-3">
                    <span className="font-semibold text-sm">Activity Type</span>
                    <button
                        className="text-[#1761A3] font-semibold text-sm"
                        onClick={() => setActivityType("Activity List")}
                    >
                        Reset
                    </button>
                    </div>

                    <div className="relative w-full">
                    <select
                        value={activityType}
                        onChange={(e) => setActivityType(e.target.value)}
                        className="
                        w-full appearance-none
                        px-4 py-3 pr-10
                        rounded-[6px]
                        border border-slate-300
                        bg-white text-sm
                        focus:outline-none focus:ring-2 focus:ring-[#1761A3]
                        "
                    >
                        <option>Activity List</option>
                        <option>Login</option>
                        <option>Update</option>
                        <option>Delete</option>
                    </select>

                    <img
                        src="/icons/down-arrow.png"
                        alt="Dropdown"
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 opacity-80"
                    />
                    </div>
                </div>

                {/* STATUS */}
                <div className="px-5 py-4 bg-gradient-to-r from-[#f3fbf8] to-[#eef6fb] border-b border-[rgba(23,97,163,0.35)]">
                    <div className="flex justify-between items-center mb-3">
                    <span className="font-semibold text-sm">Status</span>
                    <button
                        className="text-[#1761A3] font-semibold text-sm"
                        onClick={() => setStatus("Active")}
                    >
                        Reset
                    </button>
                    </div>

                    <div className="relative w-full">
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="
                        w-full appearance-none
                        px-4 py-3 pr-10
                        rounded-[6px]
                        border border-slate-300
                        bg-white text-sm
                        focus:outline-none focus:ring-2 focus:ring-[#1761A3]
                        "
                    >
                        <option>Active</option>
                        <option>Inactive</option>
                        <option>Pending</option>
                    </select>

                    <img
                        src="/icons/down-arrow.png"
                        alt="Dropdown"
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 opacity-80"
                    />
                    </div>
                </div>

                {/* KEYWORD SEARCH */}
                <div className="px-5 py-4 bg-gradient-to-r from-[#f3fbf8] to-[#eef6fb] border-b border-[rgba(23,97,163,0.35)]">
                    <div className="flex justify-between items-center mb-3">
                    <span className="font-semibold text-sm">Keyword search</span>
                    <button
                        className="text-[#1761A3] font-semibold text-sm"
                        onClick={() => setKeyword("")}
                    >
                        Reset
                    </button>
                    </div>

                    <input
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Search..."
                    className="
                        w-full px-4 py-3
                        rounded-[6px]
                        border border-slate-300
                        bg-white text-sm
                        focus:outline-none focus:ring-2 focus:ring-[#1761A3]
                    "
                    />
                </div>

                {/* FOOTER */}
                <div className="flex justify-between items-center px-5 py-4 bg-gradient-to-r from-[#f3fbf8] to-[#eef6fb]">
                    <button
                    onClick={resetAll}
                    className="px-5 py-3 rounded-[6px] border border-[#1761A3] text-sm bg-[#F0F8FF] font-semibold"
                    >
                    Reset all
                    </button>

                    <button className="px-5 py-3 rounded-[6px] text-white text-sm font-semibold bg-gradient-to-r from-[#1761A3] to-[#4DAF83]">
                    Apply Now
                    </button>
                </div>
                </div>
            </div>
            )}
            </div>
        }
        />

        {/* ================= DATE / TIME FILTER ================= */}
            <CodePreview
            title="Date / Time Filter"
            code={`<MahatiCalendar />`}
            preview={
                <div className="flex gap-6 justify-center py-6">
                <div className="flex flex-col gap-2">
                    <span className="text-sm font-semibold text-gray-700">From Date</span>
                    <MahatiCalendar
                    value={fromDate}
                    onChange={setFromDate}
                    placeholder="Select date"
                    size="small"
                    showTodayButton
                    showClearButton
                    autoHide
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <span className="text-sm font-semibold text-gray-700">To Date</span>
                    <MahatiCalendar
                    value={toDate}
                    onChange={setToDate}
                    placeholder="Select date"
                    size="small"
                    showTodayButton
                    showClearButton
                    autoHide
                    />
                </div>
                </div>
            }
            />

      {/* ================= ACTIVITY FILTER ================= */}
            <CodePreview
            title="Activity Filter"
            code={`<MahatiActivity
                        value={selectedStatus.value}
                        options={statusValues}
                        size="small"
                        onChange={(v) => {
                          const selectedItem = statusValues.find(item => item.value === v);
                        setSelectedStatus({
                        value: v,
                        label: selectedItem?.label || "Select Status",
                        });
                    }}
                  />`}
            preview={
                <div className="max-w-[300px] mx-auto flex justify-center">
                <MahatiActivity
                    value={activityType}
                    onChange={(v) => setActivityType(String(v))}
                    size="small"
                />
                </div>
            }
            />

            {/* ================= STATUS FILTER ================= */}
            <CodePreview
            title="Status Filter"
            code={`<MahatiStatus
                        value={selectedStatus.value}
                        options={statusValues}
                        size="small"
                        onChange={(v) => {
                          const selectedItem = statusValues.find(item => item.value === v);
                        setSelectedStatus({
                        value: v,
                        label: selectedItem?.label || "Select Status",
                        });
                    }}
                  />`}
            preview={
                <div className="max-w-[300px] mx-auto flex justify-center">
                <MahatiStatus
                    value={status}
                    onChange={(v) => setStatus(String(v))}
                    size="small"
                />
                </div>
            }
            />

            {/* ================= SEARCH FILTER ================= */}
            <CodePreview
            title="Search Filter"
            code={`<MahatiSearch
            value={keyword}
            onChange={setKeyword}
            placeholder="Search..."
            size="small"
            />`}
            preview={
                <div className="max-w-[300px] mx-auto flex justify-center">
                <MahatiSearch
                    value={keyword}
                    onChange={setKeyword}
                    placeholder="Search..."
                    size="small"
                />
                </div>
            }
            />

    </div>
  );
}
