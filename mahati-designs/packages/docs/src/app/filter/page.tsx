"use client";

import React, { useState } from "react";
import { CodePreview } from "../CodePreview";
import { PropsTable } from "../PropsTable";
import {
  MahatiCalendar,
  CalendarDate,
  MahatiSearchFilter,
  FilterField,
  FilterValues,
} from "@/components";

export default function FilterPage() {
  const [appliedFilters, setAppliedFilters] = useState<FilterValues>({});
  const [fromDate, setFromDate] = useState<CalendarDate | null>(null);
  const [toDate, setToDate] = useState<CalendarDate | null>(null);

  // Define filter fields for SearchFilter component
  const filterFields: FilterField[] = [
    {
      id: "dateRange",
      label: "Date Range",
      type: "date_range",
    },
    {
      id: "activityType",
      label: "Activity Type",
      type: "select",
      placeholder: "Activity List",
      options: [
        { value: "login", label: "Login" },
        { value: "update", label: "Update" },
        { value: "delete", label: "Delete" },
        { value: "create", label: "Create" },
        { value: "view", label: "View" },
      ],
    },
    {
      id: "status",
      label: "Status",
      type: "select",
      placeholder: "Select Status",
      options: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
        { value: "pending", label: "Pending" },
        { value: "suspended", label: "Suspended" },
      ],
    },
    {
      id: "departments",
      label: "Departments",
      type: "multi_select",
      placeholder: "Select Departments",
      options: [
        { value: "engineering", label: "Engineering" },
        { value: "marketing", label: "Marketing" },
        { value: "sales", label: "Sales" },
        { value: "hr", label: "Human Resources" },
        { value: "finance", label: "Finance" },
      ],
    },
    {
      id: "keyword",
      label: "Keyword Search",
      type: "text",
      placeholder: "Search...",
    },
  ];

  const filterProps = [
  {
    name: "fields",
    type: "FilterField[]",
    default: "[]",
    description: "Array of filter field configurations.",
  },
  {
    name: "onApplyFilter",
    type: "(values: FilterValues) => void",
    default: "-",
    description: "Callback function called when filters are applied.",
  },
  {
    name: "onResetFilter",
    type: "() => void",
    default: "undefined",
    description: "Optional callback for resetting all filters.",
  },
  {
    name: "onResetField",
    type: "(fieldId: string) => void",
    default: "undefined",
    description: "Optional callback for resetting individual fields.",
  },
  {
    name: "buttonText",
    type: "string",
    default: `"Filter"`,
    description: "Text displayed on the filter button.",
  },
  {
    name: "title",
    type: "string",
    default: `"Add Filter"`,
    description: "Title shown in the filter dropdown header.",
  },
  {
    name: "width",
    type: "string",
    default: `"360px"`,
    description: "Width of the filter dropdown panel.",
  },
  {
    name: "placement",
    type: "'left' | 'right'",
    default: `"right"`,
    description: "Position of dropdown relative to button.",
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    description: "Whether the filter button is disabled.",
  },
  {
    name: "showResetAll",
    type: "boolean",
    default: "true",
    description: "Whether to show the 'Reset all' button.",
  },
  {
    name: "initialValues",
    type: "FilterValues",
    default: "{}",
    description: "Initial filter values.",
  },
];

  const handleApplyFilter = (values: FilterValues) => {
    setAppliedFilters(values);
    console.log("Applied Filters:", values);
  };

  const handleResetFilter = () => {
    setAppliedFilters({});
    console.log("All filters reset");
  };

  const handleResetField = (fieldId: string) => {
    const updated = { ...appliedFilters };
    delete updated[fieldId];
    setAppliedFilters(updated);
    console.log(`Field ${fieldId} reset`);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">SearchFilter Component</h1>
        <p className="text-gray-600">
          A dynamic and flexible filter component with support for date ranges, dropdowns, multi-select, and text search.
        </p>
      </div>

      <PropsTable id="props" props={filterProps} title="Props" />

      <br />

      <CodePreview
        id="basic-filter"
        title="SearchFilter Component"
        code={`import { MahatiSearchFilter } from "@/components";

const filterFields = [
  {
    id: "dateRange",
    label: "Date Range",
    type: "date_range",
  },
  {
    id: "activityType",
    label: "Activity Type",
    type: "select",
    placeholder: "Activity List",
    options: [
      { value: "login", label: "Login" },
      { value: "update", label: "Update" },
      { value: "delete", label: "Delete" },
    ],
  },
  {
    id: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" },
      { value: "pending", label: "Pending" },
    ],
  },
  {
    id: "keyword",
    label: "Keyword Search",
    type: "text",
    placeholder: "Search...",
  },
];

<MahatiSearchFilter
  fields={filterFields}
  onApplyFilter={handleApplyFilter}
  onResetFilter={handleResetFilter}
  onResetField={handleResetField}
  buttonText="Filter Data"
  title="Advanced Filter"
  width="400px"
  placement="right"
/>`}
        preview={
          <div className="flex flex-col items-center py-10 space-y-6">
            {/* SearchFilter Component */}
            <div className="flex justify-end w-full max-w-2xl">
              <MahatiSearchFilter
                fields={filterFields}
                onApplyFilter={handleApplyFilter}
                onResetFilter={handleResetFilter}
                onResetField={handleResetField}
                buttonText="Filter Data"
                title="Advanced Filter"
                width="400px"
                placement="right"
                showResetAll={true}
              />
            </div>

            {/* Display Applied Filters */}
            {Object.keys(appliedFilters).length > 0 && (
              <div className="w-full max-w-2xl bg-blue-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-900 mb-2">Applied Filters:</h4>
                <pre className="text-sm text-blue-700 bg-white p-3 rounded border overflow-auto">
                  {JSON.stringify(appliedFilters, null, 2)}
                </pre>
              </div>
            )}

            {/* Sample Data Table */}
            <div className="w-full max-w-2xl">
              <h4 className="text-lg font-medium mb-3">Sample Data</h4>
              <div className="overflow-x-auto bg-white border rounded-lg">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">ID</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Name</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Department</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Status</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-2 text-sm">001</td>
                      <td className="px-4 py-2 text-sm">John Doe</td>
                      <td className="px-4 py-2 text-sm">Engineering</td>
                      <td className="px-4 py-2"><span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Active</span></td>
                      <td className="px-4 py-2 text-sm">2024-01-15</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 text-sm">002</td>
                      <td className="px-4 py-2 text-sm">Jane Smith</td>
                      <td className="px-4 py-2 text-sm">Marketing</td>
                      <td className="px-4 py-2"><span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Active</span></td>
                      <td className="px-4 py-2 text-sm">2024-02-20</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 text-sm">003</td>
                      <td className="px-4 py-2 text-sm">Mike Johnson</td>
                      <td className="px-4 py-2 text-sm">Sales</td>
                      <td className="px-4 py-2"><span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">Inactive</span></td>
                      <td className="px-4 py-2 text-sm">2024-03-10</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        }
        />

        {/* ================= COMPACT FILTER VARIANTS ================= */}
        <CodePreview
            id="compact-filters"
            title="Filter Variants"
            code={`// Left aligned filter
<MahatiSearchFilter
  fields={[{ id: "search", label: "Search", type: "text" }]}
  placement="left"
  buttonText="🔍"
  width="280px"
/>

// Multi-select filter
<MahatiSearchFilter
  fields={[{
    id: "departments",
    label: "Departments", 
    type: "multi_select",
    options: [
      { value: "eng", label: "Engineering" },
      { value: "marketing", label: "Marketing" }
    ]
  }]}
  buttonText="Select Departments"
/>`}
            preview={
                <div className="space-y-6 py-6">
                <div className="flex justify-between items-center">
                    <span className="font-medium">Left Aligned Filter:</span>
                    <MahatiSearchFilter
                    fields={[
                        {
                        id: "quickSearch",
                        label: "Quick Search",
                        type: "text",
                        placeholder: "Type to search...",
                        },
                    ]}
                    onApplyFilter={(values) => console.log("Quick search:", values)}
                    buttonText="🔍"
                    placement="left"
                    width="280px"
                    showResetAll={false}
                    />
                </div>

                <div className="flex justify-between items-center">
                    <span className="font-medium">Multi-Select Filter:</span>
                    <MahatiSearchFilter
                    fields={[
                        {
                        id: "departments",
                        label: "Departments",
                        type: "multi_select",
                        placeholder: "Select departments...",
                        options: [
                            { value: "engineering", label: "Engineering" },
                            { value: "marketing", label: "Marketing" },
                            { value: "sales", label: "Sales" },
                            { value: "hr", label: "HR" },
                        ],
                        },
                    ]}
                    onApplyFilter={(values) => console.log("Departments:", values)}
                    buttonText="Select Departments"
                    width="320px"
                    />
                </div>

                <div className="flex justify-between items-center">
                    <span className="font-medium">Date Range Only:</span>
                    <MahatiSearchFilter
                    fields={[
                        {
                        id: "dateRange",
                        label: "Date Range",
                        type: "date_range",
                        },
                    ]}
                    onApplyFilter={(values) => console.log("Date range:", values)}
                    buttonText="📅 Select Dates"
                    width="350px"
                    />
                </div>
                </div>
            }
            />

        {/* ================= FIELD TYPES DEMO ================= */}
        <CodePreview
            id="field-types"
            title="Field Types Demo"
            code={`const allFieldTypes = [
  { id: "date", label: "Date Range", type: "date_range" },
  { id: "single", label: "Single Select", type: "select", options: [...] },
  { id: "multi", label: "Multi Select", type: "multi_select", options: [...] },
  { id: "text", label: "Text Search", type: "text", placeholder: "Search..." }
];`}
            preview={
                <div className="flex justify-center py-6">
                <MahatiSearchFilter
                    fields={[
                    {
                        id: "dateExample",
                        label: "Date Range",
                        type: "date_range",
                    },
                    {
                        id: "selectExample",
                        label: "Priority Level",
                        type: "select",
                        placeholder: "Select priority",
                        options: [
                        { value: "high", label: "High Priority" },
                        { value: "medium", label: "Medium Priority" },
                        { value: "low", label: "Low Priority" },
                        ],
                    },
                    {
                        id: "multiExample",
                        label: "Categories",
                        type: "multi_select",
                        placeholder: "Select categories",
                        options: [
                        { value: "bug", label: "Bug Fix" },
                        { value: "feature", label: "New Feature" },
                        { value: "improvement", label: "Improvement" },
                        { value: "docs", label: "Documentation" },
                        ],
                    },
                    {
                        id: "textExample",
                        label: "Keyword Search",
                        type: "text",
                        placeholder: "Search tickets...",
                    },
                    ]}
                    onApplyFilter={(values) => console.log("All field types:", values)}
                    buttonText="All Field Types"
                    title="Advanced Search"
                    width="420px"
                />
                </div>
            }
            />
        {/* ================= INDIVIDUAL COMPONENTS FOR REFERENCE ================= */}
        <CodePreview
            id="date-time-filter"
            title="Individual Calendar Components"
            code={`<MahatiCalendar 
  value={fromDate}
  onChange={setFromDate}
  placeholder="Select date"
  size="small"
/>`}
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

      {/* ================= DROPDOWN FILTER ================= */}
      <CodePreview
        id="dropdown-filter"
        title="Dropdown Filter"
        code={`<select>...</select>`}
        preview={
            <div className="w-64 mx-auto">
            <div className="relative w-full">
                <select
                className="w-full h-[36px] appearance-none px-4 pr-10 rounded-[6px]
                            border border-slate-300 bg-white text-sm
                            focus:outline-none focus:ring-2 focus:ring-[#1761A3]"
                >
                <option>Select category</option>
                <option>Option 1</option>
                <option>Option 2</option>
                </select>

                {/* Down arrow icon */}
                <img
                src="/icons/down-arrow.png"
                alt="Dropdown"
                className="pointer-events-none absolute right-3 top-1/2
                            -translate-y-1/2 w-3 h-3 opacity-80"
                />
            </div>
            </div>
        }
        />

      {/* ================= SEARCH FILTER ================= */}
        <CodePreview
        id="search-filter"
        title="Search Filter"
        code={`<input type="text" placeholder="Search..." />`}
        preview={
            <div className="w-64 mx-auto">
            <input
                type="text"
                placeholder="Search..."
                className="w-full border border-gray-300 px-3 py-2 text-sm bg-white
                        focus:outline-none focus:ring-2 focus:ring-[#1761A3]"
                style={{ borderRadius: "4px" }}
            />
            </div>
        }
        />

    </div>
  );
}
