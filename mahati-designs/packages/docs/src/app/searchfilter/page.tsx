"use client";
import React, { useState } from "react";
import {
  SearchFilter,
  FilterField,
  FilterValues,
} from "@mahati-designs/uicomponents";

const SearchFilterPage = () => {
  const [appliedFilters, setAppliedFilters] = useState<FilterValues>({});
  const [tableData, setTableData] = useState([
    { id: 1, name: "John Doe", department: "Engineering", status: "Active", date: "2024-01-15" },
    { id: 2, name: "Jane Smith", department: "Marketing", status: "Active", date: "2024-01-20" },
    { id: 3, name: "Mike Johnson", department: "Sales", status: "Inactive", date: "2024-02-10" },
    { id: 4, name: "Sarah Wilson", department: "HR", status: "Pending", date: "2024-02-15" },
    { id: 5, name: "David Brown", department: "Finance", status: "Active", date: "2024-03-01" },
  ]);

  const filterFields: FilterField[] = [
    {
      id: "dateRange",
      label: "Date Range",
      type: "date_range",
    },
    {
      id: "department",
      label: "Department",
      type: "select",
      placeholder: "Select Department",
      options: [
        { value: "engineering", label: "Engineering" },
        { value: "marketing", label: "Marketing" },
        { value: "sales", label: "Sales" },
        { value: "hr", label: "HR" },
        { value: "finance", label: "Finance" },
      ],
    },
    {
      id: "status",
      label: "Status",
      type: "multi_select",
      placeholder: "Select Status",
      options: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
        { value: "pending", label: "Pending" },
      ],
    },
    {
      id: "search",
      label: "Keyword Search",
      type: "text",
      placeholder: "Search by name...",
    },
  ];

  const handleApplyFilters = (filters: FilterValues) => {
    setAppliedFilters(filters);
    console.log("Applied filters:", filters);
    // Here you would filter your actual data
  };

  const handleResetFilters = () => {
    setAppliedFilters({});
    console.log("Filters reset");
  };

  const handleFieldReset = (fieldId: string) => {
    const updated = { ...appliedFilters };
    delete updated[fieldId];
    setAppliedFilters(updated);
    console.log(`Field ${fieldId} reset`);
  };

  const codeExample = `import { SearchFilter, FilterField, FilterValues } from '@mahati-designs/uicomponents';

const filterFields: FilterField[] = [
  {
    id: "dateRange",
    label: "Date Range", 
    type: "date_range",
  },
  {
    id: "department",
    label: "Department",
    type: "select",
    placeholder: "Select Department",
    options: [
      { value: "engineering", label: "Engineering" },
      { value: "marketing", label: "Marketing" },
    ],
  },
  {
    id: "status",
    label: "Status",
    type: "multi_select", 
    options: [
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" },
    ],
  },
  {
    id: "search",
    label: "Keyword Search",
    type: "text",
    placeholder: "Search...",
  },
];

<SearchFilter
  fields={filterFields}
  onApplyFilter={handleApplyFilters}
  onResetFilter={handleResetFilters}
  onResetField={handleFieldReset}
  buttonText="Filter"
  title="Advanced Filter"
  width="380px"
  placement="right"
/>`;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">SearchFilter Component</h1>
          <p className="text-gray-600">
            A flexible and dynamic filter component with support for date ranges, dropdowns, multi-select, and text search.
          </p>
        </div>

        {/* Live Demo */}
        <div className="bg-white rounded-lg shadow-lg mb-8">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-900">Interactive Demo</h2>
          </div>
          <div className="p-6">
            {/* Filter Component */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium">Employee Data</h3>
              <SearchFilter
                fields={filterFields}
                onApplyFilter={handleApplyFilters}
                onResetFilter={handleResetFilters}
                onResetField={handleFieldReset}
                buttonText="Filter Data"
                title="Filter Employees"
                width="400px"
                placement="right"
              />
            </div>

            {/* Sample Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">ID</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Name</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Department</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Status</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tableData.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm text-gray-900">{row.id}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{row.name}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{row.department}</td>
                      <td className="px-4 py-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          row.status === 'Active' ? 'bg-green-100 text-green-800' :
                          row.status === 'Inactive' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">{row.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Current Filters Display */}
            {Object.keys(appliedFilters).length > 0 && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="text-sm font-medium text-blue-900 mb-2">Applied Filters:</h4>
                <pre className="text-sm text-blue-700 bg-white p-2 rounded border overflow-auto">
                  {JSON.stringify(appliedFilters, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Code Example */}
        <div className="bg-white rounded-lg shadow-lg mb-8">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-900">Usage Example</h2>
          </div>
          <div className="p-6">
            <pre className="bg-gray-50 rounded-lg p-4 overflow-auto text-sm">
              <code>{codeExample}</code>
            </pre>
          </div>
        </div>

        {/* Props Documentation */}
        <div className="bg-white rounded-lg shadow-lg">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-900">Props</h2>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Prop</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Type</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Default</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Description</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-2 text-sm font-mono">fields</td>
                    <td className="px-4 py-2 text-sm">FilterField[]</td>
                    <td className="px-4 py-2 text-sm">-</td>
                    <td className="px-4 py-2 text-sm">Array of filter field configurations</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 text-sm font-mono">onApplyFilter</td>
                    <td className="px-4 py-2 text-sm">(values: FilterValues) => void</td>
                    <td className="px-4 py-2 text-sm">-</td>
                    <td className="px-4 py-2 text-sm">Callback when filters are applied</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 text-sm font-mono">buttonText</td>
                    <td className="px-4 py-2 text-sm">string</td>
                    <td className="px-4 py-2 text-sm">"Filter"</td>
                    <td className="px-4 py-2 text-sm">Text displayed on the filter button</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 text-sm font-mono">width</td>
                    <td className="px-4 py-2 text-sm">string</td>
                    <td className="px-4 py-2 text-sm">"360px"</td>
                    <td className="px-4 py-2 text-sm">Width of the filter dropdown</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 text-sm font-mono">placement</td>
                    <td className="px-4 py-2 text-sm">"left" | "right"</td>
                    <td className="px-4 py-2 text-sm">"right"</td>
                    <td className="px-4 py-2 text-sm">Dropdown placement relative to button</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">FilterField Types</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">date_range</h4>
                  <p className="text-sm text-gray-600">Integrated with Calendar component for date range selection</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">select</h4>
                  <p className="text-sm text-gray-600">Single selection dropdown with options</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">multi_select</h4>
                  <p className="text-sm text-gray-600">Multiple selection with checkboxes</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">text</h4>
                  <p className="text-sm text-gray-600">Text input for keyword search</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilterPage;