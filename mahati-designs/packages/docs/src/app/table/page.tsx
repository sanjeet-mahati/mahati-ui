"use client";

import React, { useState, useMemo } from "react";
import { MahatiTable } from "@/components";
import { PropsTable } from "../PropsTable";
import { CodePreview } from "../CodePreview";

const sampleData = [
  { id: 1, name: 'John Doe', email: 'john.doe@example.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', role: 'User', status: 'Inactive' },
  { id: 3, name: 'Sam Wilson', email: 'sam.wilson@example.com', role: 'Editor', status: 'Active' },
  { id: 4, name: 'Alice Brown', email: 'alice.brown@example.com', role: 'User', status: 'Active' },
  { id: 5, name: 'Bob Johnson', email: 'bob.johnson@example.com', role: 'User', status: 'Pending' },
  { id: 6, name: 'Chris Lee', email: 'chris.lee@example.com', role: 'Editor', status: 'Inactive' },
  { id: 7, name: 'Patricia Green', email: 'pat.green@example.com', role: 'Admin', status: 'Active' },
  { id: 8, name: 'Michael Clark', email: 'michael.clark@example.com', role: 'User', status: 'Active' },
];

const headers = [
  { label: 'ID', key: 'id' },
  { label: 'Name', key: 'name' },
  { label: 'Email', key: 'email' },
  { label: 'Role', key: 'role' },
];

export default function TablePage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = useMemo(() => {
    return sampleData.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * limit;
    const end = start + limit;
    return filteredData.slice(start, end);
  }, [page, limit, filteredData]);

  const tableProps = [
    { name: 'headers', type: '{ label: string; key: string }[]', required: true, description: 'Defines the table columns.' },
    { name: 'data', type: 'Record<string, any>[]', required: true, description: 'The array of data to display.' },
    { name: 'paginationRequired', type: 'boolean', default: 'false', description: 'Enables pagination.' },
    { name: 'page', type: 'number', description: 'The current active page (controlled).' },
    { name: 'setPage', type: '(page: number) => void', description: 'Callback to update the current page.' },
    { name: 'limit', type: 'number', description: 'Number of items per page.' },
    { name: 'setLimit', type: '(limit: number) => void', description: 'Callback to update the limit.' },
    { name: 'totalCount', type: 'number', description: 'Total number of items for pagination calculation.' },
    { name: 'searchable', type: 'boolean', default: 'false', description: 'Enables the search input.' },
    { name: 'searchTerm', type: 'string', description: 'The current search term (controlled).' },
    { name: 'onSearch', type: '(term: string) => void', description: 'Callback when search term changes.' },
    { name: 'actions', type: '(row: any) => React.ReactNode', description: 'Renders custom actions for each row.' },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Table</h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          A versatile table component for displaying data with features like pagination, searching, and custom actions.
        </p>
      </div>

      <CodePreview
        title="Basic Table"
        code={`const headers = [
  { label: 'ID', key: 'id' },
  { label: 'Name', key: 'name' },
  { label: 'Email', key: 'email' },
];
const data = [
  { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com' },
];

<MahatiTable headers={headers} data={data} />`}
        preview={
          <MahatiTable headers={headers} data={sampleData.slice(0, 3)} />
        }
      />

      <CodePreview
        title="Paginated"
        code={`<MahatiTable
  headers={headers}
  data={paginatedData}
  paginationRequired
  page={page}
  setPage={setPage}
  limit={limit}
  setLimit={setLimit}
  totalCount={filteredData.length}
/>`}
        preview={
          <MahatiTable
            headers={headers}
            data={paginatedData}
            paginationRequired
            page={page}
            setPage={setPage}
            limit={limit}
            setLimit={setLimit}
            totalCount={filteredData.length}
          />
        }
      />

      <CodePreview
        title="All-in-One"
        code={`<MahatiTable
  headers={headers}
  data={paginatedData}
  searchable
  searchTerm={searchTerm}
  onSearch={(term) => setSearchTerm(term)}
  onResetSearch={() => setSearchTerm("")}
  paginationRequired
  page={page}
  setPage={setPage}
  limit={limit}
  setLimit={setLimit}
  totalCount={filteredData.length}
/>`}
        preview={
          <MahatiTable
            headers={headers}
            data={paginatedData}
            searchable
            searchTerm={searchTerm}
            onSearch={(term) => setSearchTerm(term)}
            onResetSearch={() => setSearchTerm("")}
            paginationRequired
            page={page}
            setPage={setPage}
            limit={limit}
            setLimit={setLimit}
            totalCount={filteredData.length}
          />
        }
      />

      <CodePreview
        title="Custom Cells"
        code={`const headersWithCustom = [
  { label: 'Name', key: 'name' },
  { label: 'Status', key: 'status' },
];

const dataWithCustom = sampleData.map(item => ({
  ...item,
  status: (
    <span className={\`px-2 py-1 text-xs font-semibold rounded-full \${
      item.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
    }\`}>
      {item.status}
    </span>
  )
}));

<MahatiTable
  headers={headersWithCustom}
  data={dataWithCustom}
  actions={(row) => (
    <button
      onClick={() => alert(\`Editing \${row.name}\`)}
      className="text-blue-600 hover:underline"
    >
      Edit
    </button>
  )}
/>`}
        preview={
          <MahatiTable
            headers={[
              { label: 'Name', key: 'name' },
              { label: 'Status', key: 'status' },
            ]}
            data={sampleData.slice(0, 4).map(item => ({
              ...item,
              status: (
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  item.status === 'Active' ? 'bg-green-100 text-green-800' : 
                  item.status === 'Inactive' ? 'bg-gray-100 text-gray-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {item.status}
                </span>
              )
            }))}
            actions={(row) => (
              <button
                onClick={() => alert(`Editing ${row.name}`)}
                className="text-blue-600 hover:underline text-sm"
              >
                Edit
              </button>
            )}
          />
        }
      />

    

    </div>
  );
}