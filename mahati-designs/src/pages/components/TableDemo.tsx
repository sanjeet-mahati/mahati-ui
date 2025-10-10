'use client';

import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import Link from "next/link";
import Table from "../../components/Table";
import Button from "../../components/Button";

/* ---------- Simplified Layout (No Sidebar - using Layout component) ---------- */

const Content = styled.main`
  padding: 48px;
  max-width: 1200px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  margin-bottom: 48px;
`;

const PageTitle = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 16px;
`;

const PageDescription = styled.p`
  font-size: 1.15rem;
  color: #718096;
  line-height: 1.6;
  max-width: 800px;
`;

const Section = styled.section`
  margin-bottom: 48px;
  padding: 32px;
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 12px;
`;

const SectionDescription = styled.p`
  color: #718096;
  margin-bottom: 20px;
  line-height: 1.6;
`;

const DemoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
`;

const ActionsBar = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  flex-wrap: wrap;
`;

const SortableTableContainer = styled.div`
  position: relative;
`;

const SortIndicator = styled.span`
  margin-left: 8px;
  font-size: 0.75rem;
  color: #6b7280;
`;

/* ---------- Helpers / Mock Data ---------- */

type Person = {
  id: number;
  name: string;
  email: string;
  role: "Admin" | "Manager" | "Analyst" | "Agent" | string;
  active: boolean | string;
  createdAt: Date | string;
  [key: string]: any;
};

function makePeople(n: number): Person[] {
  const roles: Person["role"][] = ["Admin", "Manager", "Analyst", "Agent"];
  const arr: Person[] = [];
  for (let i = 1; i <= n; i++) {
    arr.push({
      id: i,
      name: `User ${i}`,
      email: `user${i}@mahati.example.com`,
      role: roles[i % roles.length],
      active: i % 3 !== 0,
      createdAt: new Date(Date.now() - i * 86400000).toISOString(), // Store as ISO string
    });
  }
  return arr;
}

function toKey(label: string, existing: Set<string>) {
  let base = label
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");
  if (!base) base = "field";
  let k = base;
  let i = 1;
  while (existing.has(k)) k = `${base}_${i++}`;
  return k;
}

// Format date consistently on client side only
function formatDate(dateValue: Date | string): string {
  if (!dateValue) return "-";
  const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

/* ---------- Page ---------- */

export default function TableDemoPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  /* ====== BASIC TABLE ====== */
  
  const peopleAll = useMemo(() => makePeople(37), []);
  const basicHeaders = [
    { label: "ID", key: "id" },
    { label: "Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "Role", key: "role" },
    { label: "Active", key: "active" },
    { label: "Created", key: "createdAt" },
  ];

  // Format dates for display only on client side
  const basicDisplayData = useMemo(() => {
    if (!mounted) return peopleAll.slice(0, 8);
    return peopleAll.slice(0, 8).map(person => ({
      ...person,
      createdAt: formatDate(person.createdAt)
    }));
  }, [peopleAll, mounted]);

  /* ====== PAGINATED TABLE ====== */
  
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  const totalCount = peopleAll.length;
  const pagedData = useMemo(() => {
    const start = (page - 1) * limit;
    const sliced = peopleAll.slice(start, start + limit);
    if (!mounted) return sliced;
    return sliced.map(person => ({
      ...person,
      createdAt: formatDate(person.createdAt)
    }));
  }, [peopleAll, page, limit, mounted]);

  /* ====== CUSTOM CELLS & ACTIONS (in-memory only) ====== */

  const [scriptHeaders, setScriptHeaders] = useState<{ label: string; key: string }[]>([
    { label: "Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "Role", key: "role" },
    { label: "Status", key: "active" },
  ]);
  
  const [scriptRows, setScriptRows] = useState<Person[]>(() => makePeople(8));
  const [editingRowId, setEditingRowId] = useState<number | null>(null);
  const [draftRow, setDraftRow] = useState<Record<string, any> | null>(null);

  const startEdit = (row: Person) => {
    setEditingRowId(row.id);
    setDraftRow({ ...row });
  };
  
  const cancelEdit = () => {
    setEditingRowId(null);
    setDraftRow(null);
  };
  
  const saveEdit = () => {
    if (!draftRow) return;
    setScriptRows(prev => prev.map(r => (r.id === draftRow.id ? { ...draftRow } as Person : r)));
    setEditingRowId(null);
    setDraftRow(null);
  };
  
  const deleteRow = (id: number) => {
    if (!confirm("Delete this row?")) return;
    setScriptRows(prev => prev.filter(r => r.id !== id));
    if (editingRowId === id) cancelEdit();
  };

  const handleCellChange = (key: string, value: string) => {
    if (!draftRow) return;
    setDraftRow({ ...draftRow, [key]: value });
  };

  const handleAddRow = () => {
    const nextId = (scriptRows.reduce((m, r) => Math.max(m, r.id as number), 0) || 0) + 1;
    const blank: Person = {
      id: nextId,
      name: "",
      email: "",
      role: "Agent",
      active: true,
      createdAt: new Date().toISOString(),
    };
    scriptHeaders.forEach(h => {
      if (!(h.key in blank)) (blank as any)[h.key] = h.key === "active" ? true : "";
    });

    setScriptRows(prev => [blank, ...prev]);
    setEditingRowId(nextId);
    setDraftRow({ ...blank });
  };

  const handleAddColumn = () => {
    const label = window.prompt("Enter new column label (e.g., Phone):");
    if (!label) return;
    const existing = new Set(scriptHeaders.map(h => h.key));
    const key = toKey(label, existing);
    const newHeader = { label, key };

    setScriptHeaders(prev => [...prev, newHeader]);
    setScriptRows(prev => prev.map(r => ({ ...r, [key]: "" })));
    setDraftRow(dr => (dr ? { ...dr, [key]: "" } : dr));
  };

  const resetDemo = () => {
    setScriptHeaders([
      { label: "Name", key: "name" },
      { label: "Email", key: "email" },
      { label: "Role", key: "role" },
      { label: "Status", key: "active" },
    ]);
    setScriptRows(makePeople(8));
    setEditingRowId(null);
    setDraftRow(null);
  };

  // Build table data
  const customTableData = scriptRows.map((r) => {
    const isEditing = r.id === editingRowId;
    const cells: Record<string, any> = {};

    scriptHeaders.forEach(({ key, label }) => {
      const value = isEditing ? (draftRow?.[key] ?? "") : (r as any)[key];

      if (isEditing) {
        if (key === "active") {
          cells[key] = () => (
            <select
              value={String(value)}
              onChange={(e) => handleCellChange(key, e.target.value === "true" ? "true" : "false")}
              style={{ padding: "6px 8px", border: "1px solid #cbd5e1", borderRadius: 6 }}
            >
              <option value="true">true</option>
              <option value="false">false</option>
            </select>
          );
        } else if (key.toLowerCase().includes("date")) {
          const localVal = value
            ? (value instanceof Date ? value.toISOString() : new Date(value).toISOString()).slice(0, 16)
            : "";
          cells[key] = () => (
            <input
              type="datetime-local"
              value={localVal}
              onChange={(e) => {
                const iso = e.target.value ? new Date(e.target.value).toISOString() : "";
                handleCellChange(key, iso);
              }}
              style={{ padding: "6px 8px", border: "1px solid #cbd5e1", borderRadius: 6, width: "100%" }}
            />
          );
        } else {
          cells[key] = () => (
            <input
              type="text"
              value={value ?? ""}
              onChange={(e) => handleCellChange(key, e.target.value)}
              style={{ padding: "6px 8px", border: "1px solid #cbd5e1", borderRadius: 6, width: "100%" }}
              placeholder={label}
            />
          );
        }
      } else {
        if (key === "role") {
          cells[key] = (
            <span
              style={{
                padding: "2px 8px",
                borderRadius: 999,
                border: "1px solid #cbd5e1",
                fontSize: 12,
                background: "#f8fafc",
              }}
            >
              {String(value ?? "")}
            </span>
          );
        } else if (key === "active") {
          const on = typeof value === "boolean" ? value : String(value) === "true";
          cells[key] = (
            <span style={{ fontWeight: 600, color: on ? "#16a34a" : "#ef4444" }}>
              {on ? "Active" : "Inactive"}
            </span>
          );
        } else if (key === "name") {
          cells[key] = (
            <Link href={`/people/${r.id}`} style={{ color: "#1e73be", textDecoration: "none" }}>
              {String(value ?? "")}
            </Link>
          );
        } else if (key.toLowerCase().includes("date") && mounted) {
          cells[key] = formatDate(value);
        } else {
          cells[key] = value ?? "";
        }
      }
    });

    (cells as any).id = r.id;
    return cells;
  });

  /* ====== DATE & TIME SORTING ====== */

  const taskHeaders = [
    { label: "ID", key: "id" },
    { label: "Task", key: "task" },
    { label: "Priority", key: "priority" },
    { label: "Due Date", key: "dueDate" },
    { label: "Estimated Time", key: "estimatedTime" },
    { label: "Status", key: "status" },
  ];

  const tasksData = [
    { id: 1, task: "Design Homepage", priority: "High",   dueDate: "2024-02-15T00:00:00.000Z", estimatedTime: "02:30", status: "In Progress" },
    { id: 2, task: "Fix Login Bug",   priority: "Critical", dueDate: "2024-01-25T00:00:00.000Z", estimatedTime: "01:15", status: "Pending" },
    { id: 3, task: "Write Docs",      priority: "Medium", dueDate: "2024-03-01T00:00:00.000Z", estimatedTime: "04:00", status: "Completed" },
    { id: 4, task: "Update Deps",     priority: "Low",    dueDate: "2024-02-28T00:00:00.000Z", estimatedTime: "00:45", status: "Pending" },
    { id: 5, task: "Code Review",     priority: "High",   dueDate: "2024-01-30T00:00:00.000Z", estimatedTime: "01:30", status: "In Progress" },
  ];

  const [dateTimePage, setDateTimePage] = useState(1);
  const [dateTimeLimit, setDateTimeLimit] = useState(5);

  const SortableTable: React.FC<any> = ({
    headers,
    data,
    sortable = true,
    page = 1,
    setPage,
    limit = 5,
    setLimit,
    totalCount
  }) => {
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
    const [sortedData, setSortedData] = useState(data);

    useEffect(() => {
      if (sortConfig && sortable) {
        const sorted = [...data].sort((a, b) => {
          let aValue = a[sortConfig.key];
          let bValue = b[sortConfig.key];

          if (sortConfig.key.toLowerCase().includes('date')) {
            aValue = new Date(aValue).getTime();
            bValue = new Date(bValue).getTime();
          } else if (sortConfig.key.toLowerCase().includes('time')) {
            const toMinutes = (t: string) => {
              if (!t) return 0;
              const [hh, mm] = t.split(':').map(Number);
              return (hh || 0) * 60 + (mm || 0);
            };
            aValue = toMinutes(aValue);
            bValue = toMinutes(bValue);
          } else if (typeof aValue === 'string') {
            aValue = aValue.toLowerCase();
            bValue = bValue.toLowerCase();
          }

          if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
          if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
          return 0;
        });
        setSortedData(sorted);
      } else {
        setSortedData(data);
      }
    }, [sortConfig, data, sortable]);

    const handleSort = (key: string) => {
      if (!sortable) return;
      let direction: 'asc' | 'desc' = 'asc';
      if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
        direction = 'desc';
      }
      setSortConfig({ key, direction });
      setPage?.(1);
    };

    const getSortIndicator = (key: string) => {
      if (!sortConfig || sortConfig.key !== key) return '↕';
      return sortConfig.direction === 'asc' ? '↑' : '↓';
    };

    // Format dates for display
    const displayData = mounted ? sortedData.map(item => ({
      ...item,
      dueDate: formatDate(item.dueDate)
    })) : sortedData;

    return (
      <SortableTableContainer>
        <Table
          headers={headers.map((header: any) => ({
            ...header,
            label: (
              <div
                onClick={() => handleSort(header.key)}
                style={{ cursor: sortable ? 'pointer' : 'default', display: 'flex', alignItems: 'center' }}
              >
                {header.label}
                <SortIndicator>{getSortIndicator(header.key)}</SortIndicator>
              </div>
            )
          }))}
          data={displayData}
          page={page}
          setPage={setPage}
          limit={limit}
          setLimit={setLimit}
          totalCount={totalCount}
        />
      </SortableTableContainer>
    );
  };

  if (!mounted) {
    return (
      <Content>
        <PageHeader>
          <PageTitle>Table</PageTitle>
          <PageDescription>Loading...</PageDescription>
        </PageHeader>
      </Content>
    );
  }

  return (
    <Content>
      <PageHeader>
        <PageTitle>Table</PageTitle>
        <PageDescription>
          Basic, paginated, and a fully interactive table with add/edit/delete functionality.
        </PageDescription>
      </PageHeader>

      {/* ====== BASIC TABLE ====== */}
      <Section id="basic">
        <SectionTitle>Basic Table</SectionTitle>
        <SectionDescription>
          A minimal example with static data and no pagination controls.
        </SectionDescription>
        <DemoGrid>
          <Table
            headers={basicHeaders}
            data={basicDisplayData}
            limit={Number.NaN}
            totalCount={basicDisplayData.length}
          />
        </DemoGrid>
      </Section>

      {/* ====== PAGINATED TABLE ====== */}
      <Section id="paginated">
        <SectionTitle>Paginated Table</SectionTitle>
        <SectionDescription>
          Client-side pagination to demonstrate wiring. In your app, pass server results and the real <code>totalCount</code>.
        </SectionDescription>
        <DemoGrid>
          <Table
            headers={basicHeaders}
            data={pagedData}
            page={page}
            setPage={setPage}
            limit={limit}
            setLimit={setLimit}
            totalCount={totalCount}
          />
        </DemoGrid>
      </Section>

      {/* ====== CUSTOM CELLS & ACTIONS ====== */}
      <Section id="custom">
        <SectionTitle>Custom Cells & Actions</SectionTitle>
        <SectionDescription>
          Add rows/columns, inline edit with Save/Cancel, and Delete a row. Changes are stored in memory during your session.
        </SectionDescription>

        <ActionsBar>
          <Button variant="primary" onClick={handleAddRow}>+ Add Row</Button>
          <Button onClick={handleAddColumn}>+ Add Column</Button>
          <Button variant="ghost" onClick={resetDemo}>Reset Demo</Button>
        </ActionsBar>

        <DemoGrid>
          <Table
            headers={scriptHeaders}
            data={customTableData}
            actions={(row) => {
              const rId = Number((row as any).id);
              const source = scriptRows.find(r => r.id === rId);
              const isEditing = source?.id === editingRowId;

              return (
                <div style={{ display: "flex", gap: 8 }}>
                  {!isEditing ? (
                    <>
                      <Button size="sm" onClick={() => source && startEdit(source)}>Edit</Button>
                      <Button size="sm" variant="destructive" onClick={() => source && deleteRow(source.id)}>
                        Delete
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button size="sm" variant="primary" onClick={saveEdit}>Save</Button>
                      <Button size="sm" onClick={cancelEdit}>Cancel</Button>
                    </>
                  )}
                </div>
              );
            }}
          />
        </DemoGrid>
      </Section>

      {/* ====== DATE & TIME SORTING ====== */}
      <Section id="date-time-sorting">
        <SectionTitle>Date & Time Sorting</SectionTitle>
        <SectionDescription>
          Click column headers to sort. <strong>Due Date</strong> sorts by date; <strong>Estimated Time</strong> sorts by time (HH:mm). Pagination included.
        </SectionDescription>
        <DemoGrid>
          <SortableTable
            headers={taskHeaders}
            data={tasksData}
            page={dateTimePage}
            setPage={setDateTimePage}
            limit={dateTimeLimit}
            setLimit={setDateTimeLimit}
            totalCount={tasksData.length}
          />
        </DemoGrid>
      </Section>
    </Content>
  );
}