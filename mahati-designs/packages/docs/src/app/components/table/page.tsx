'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import Link from "next/link";
import Table from "../../components/Table";
import Button from "../../components/Button";

/* ========================= CSS / Styled Blocks (ALL AT TOP) ========================= */

// --- Shared header background gradient (match all other tables) ---
const HEADER_BG = 'linear-gradient(to right, #1e73be, #28a97d)';

const AllTablesLeft = createGlobalStyle`
  table th, table td {
    text-align: left !important;
  }
`;

const AlignableWrap = styled.div<{ align: "left" | "center" | "right" }>`
  && table th, && table td {
    text-align: ${p => p.align} !important;
  }
`;

const AllInOneBorders = createGlobalStyle`
  #all-in-one table { border-collapse: collapse; }
  #all-in-one th, #all-in-one td { border: 1px solid #e2e8f0; }
  #all-in-one th { border-bottom: 1px solid #e2e8f0; }
`;

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background: #f8fafc;
`;

const BackAnchor = styled.a`
  color: white;
  text-decoration: none;
  font-size: 0.875rem;
  margin-bottom: 16px;
  display: inline-block;
  &:hover { text-decoration: underline; }
`;

const SidebarList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const SidebarItem = styled.li<{ isActive?: boolean }>`
  color: ${p => p.isActive ? '#58a6ff' : 'white'};
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 6px;
  margin-bottom: 4px;
  font-size: 0.9rem;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #58a6ff;
  }
`;

const Content = styled.main`
  flex: 1;
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


const ResizableWrap = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: auto;
  background: #fff;
`;

const ResizableTable = styled.table`
  border-collapse: collapse;
  width: max-content;
  table-layout: fixed;
`;

const ResizableThead = styled.thead`
  background: ${HEADER_BG};
  color: #000000ff;

  & th {
    background: transparent;
    color: inherit;
    border-right: 1px solid rgba(255, 255, 255, 0.2);
  }
`;

const ResizableTh = styled.th`
  position: relative;
  text-align: left;
  padding: 10px 14px;
  color: #fff;
  user-select: none;
`;

const ResizableTd = styled.td`
  padding: 10px 14px;
  border-bottom: 1px solid #e2e8f0;
  border-right: 1px solid #f1f5f9;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ColResizer = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  width: 8px;
  height: 100%;
  cursor: col-resize;
  user-select: none;
  touch-action: none;

  &:hover { background: rgba(255,255,255,0.18); }
`;

const RowResizer = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  height: 6px;
  width: 100%;
  cursor: row-resize;
  user-select: none;
  touch-action: none;
  background: transparent;

  &:hover { background: rgba(15, 78, 127, 0.12); }
`;



const CornerBox = styled.div<{ w: number; h: number }>`
  position: relative;
  width: ${p => p.w}px;
  height: ${p => p.h}px;
  border: 1px solid #cfd8e3;
  border-radius: 8px;
  background: #ffffff;
  overflow: hidden;
`;

const CornerHandle = styled.div<{ pos: "nw" | "ne" | "sw" | "se" }>`
  position: absolute;
  width: 14px;
  height: 14px;
  background: #1e73be;
  border: 2px solid #ffffff;
  border-radius: 4px;
  z-index: 5;

  ${p => p.pos === "nw" && `left: -7px; top: -7px; cursor: nwse-resize;`}
  ${p => p.pos === "ne" && `right: -7px; top: -7px; cursor: nesw-resize;`}
  ${p => p.pos === "sw" && `left: -7px; bottom: -7px; cursor: nesw-resize;`}
  ${p => p.pos === "se" && `right: -7px; bottom: -7px; cursor: nwse-resize;`}
`;

const BorderedWrap = styled.div<{ dashed?: boolean }>`
  & table { border-collapse: collapse; }
  & table th, & table td {
    border: ${p => p.dashed ? "1px dashed #cfd8e3" : "1px solid #e2e8f0"};
  }
  & table th {
    border-bottom: ${p => p.dashed ? "1px dashed #cfd8e3" : "1px solid #e2e8f0"};
  }
`;

const CornerWrap = styled.div`
  position: relative;
  overflow: auto;
  background: #fff;
  border-radius: 8px;
`;

const CornerTable = styled.table`
  border-collapse: collapse;
  width: max-content;
  table-layout: fixed;
`;

const CornerThead = styled.thead`
  background: ${HEADER_BG};
  color: #000000ff;

  & th {
    background: transparent;
    color: inherit;
    border-right: 1px solid rgba(255, 255, 255, 0.2);
  }
`;

const CornerTh = styled.th`
  position: relative;
  text-align: left;
  padding: 10px 14px;
  color: #fff;
  user-select: none;
`;

const CornerTd = styled.td`
  padding: 10px 14px;
  border-bottom: 1px solid #e2e8f0;
  border-right: 1px solid #f1f5f9;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;


const AIOThead = styled.thead`
  background: ${HEADER_BG};
  color: #fff;

  & th {
    background: transparent;
    color: inherit;
    border-right: 1px solid rgba(255, 255, 255, 0.2);
  }
`;

const tdStyle: React.CSSProperties = {
  padding: "10px 14px",
  borderBottom: "1px solid #e2e8f0",
  borderRight: "1px solid #f1f5f9",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis"
};
const inputStyle: React.CSSProperties = {
  padding: "6px 8px",
  border: "1px solid #cbd5e1",
  borderRadius: 6,
  width: "100%"
};

/* ======= Column Picker Styles ======= */
const PickerWrap = styled.div`
  position: relative;
  display: inline-block;
`;
const PickerButton = styled.button`
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  background: #ffffff;
  cursor: pointer;
  font-size: 0.9rem;
  &:hover { background: #f8fafc; }
`;
const PickerMenu = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  min-width: 240px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
  z-index: 30;
  padding: 8px;
`;
const PickerRow = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 8px;
  border-radius: 8px;
  cursor: pointer;
  &:hover { background: #f8fafc; }
`;
const PickerActions = styled.div`
  display: flex;
  gap: 8px;
  padding: 8px;
  border-top: 1px solid #f1f5f9;
  margin-top: 8px;
`;



type Person = {
  id: number;
  name: string;
  email: string;
  role: "Admin" | "Manager" | "Analyst" | "Agent" | string;
  active: boolean | string;
  createdAt: string;
  url: string;
  dob: string; // Date of Birth (MM/DD/YYYY)
  [key: string]: any;
};

const PEOPLE: Person[] = [
  { id: 1,  name: "James Smith",          email: "jamesmith@sample.com",            role: "Admin",   active: true,  createdAt: "2024-01-30T09:00:00.000Z", url: "https://www.google.com",     dob: "03/14/1990" },
  { id: 2,  name: "Christopher Anderson", email: "christopheranderson@sample.com",  role: "Manager", active: true,  createdAt: "2024-01-29T09:00:00.000Z", url: "https://about.meta.com",     dob: "07/22/1985" },
  { id: 3,  name: "Ronald Clark",         email: "ronaldlark@sample.com",           role: "Analyst", active: false, createdAt: "2024-01-28T09:00:00.000Z", url: "https://www.apple.com",      dob: "11/05/1992" },
  { id: 4,  name: "Mary Wright",          email: "mary.wright@sample.com",          role: "Agent",   active: true,  createdAt: "2024-01-27T09:00:00.000Z", url: "https://www.microsoft.com",  dob: "01/18/1988" },
  { id: 5,  name: "Lisa Mitchell",        email: "lmitchell@sample.com",            role: "Admin",   active: true,  createdAt: "2024-01-26T09:00:00.000Z", url: "https://www.amazon.com",     dob: "09/30/1995" },
  { id: 6,  name: "Michelle Johnson",     email: "michellejohnson@sample.com",      role: "Manager", active: false, createdAt: "2024-01-25T09:00:00.000Z", url: "https://about.netflix.com",  dob: "12/12/1983" },
  { id: 7,  name: "John Thomas",          email: "johnthomas@sample.com",           role: "Analyst", active: true,  createdAt: "2024-01-24T09:00:00.000Z", url: "https://www.tesla.com",      dob: "04/02/1991" },
  { id: 8,  name: "Daniel Rodriguez",     email: "rodriguez@sample.com",            role: "Agent",   active: true,  createdAt: "2024-01-23T09:00:00.000Z", url: "https://www.nvidia.com",     dob: "06/25/1989" },
  { id: 9,  name: "Anthony Lopez",        email: "anthonylopez@sample.com",         role: "Admin",   active: false, createdAt: "2024-01-22T09:00:00.000Z", url: "https://openai.com",         dob: "10/10/1993" },
  { id: 10, name: "Patricia perez",       email: "patriciaperez@sample.com",        role: "Manager", active: true,  createdAt: "2024-01-21T09:00:00.000Z", url: "https://www.adobe.com",      dob: "02/08/1987" },
  { id: 11, name: "Nancy Williams",       email: "nancywilliams@sample.com",        role: "Analyst", active: true,  createdAt: "2024-01-20T09:00:00.000Z", url: "https://www.salesforce.com", dob: "08/19/1990" },
  { id: 12, name: "Laura Jackson",        email: "laurajackson@sample.com",         role: "Agent",   active: false, createdAt: "2024-01-19T09:00:00.000Z", url: "https://www.intel.com",      dob: "05/27/1984" },
  { id: 13, name: "Robert Lewis",         email: "lewis@sample.com",                role: "Admin",   active: true,  createdAt: "2024-01-18T09:00:00.000Z", url: "https://www.ibm.com",        dob: "03/03/1992" },
  { id: 14, name: "Paul Hill",            email: "paulhill@sample.com",             role: "Manager", active: true,  createdAt: "2024-01-17T09:00:00.000Z", url: "https://www.oracle.com",     dob: "07/11/1986" },
  { id: 15, name: "Kevin Roberts",        email: "kevinroberts@sample.com",         role: "Analyst", active: false, createdAt: "2024-01-16T09:00:00.000Z", url: "https://www.uber.com",       dob: "11/23/1994" },
  { id: 16, name: "Linda Jones",          email: "jones@sample.com",                role: "Agent",   active: true,  createdAt: "2024-01-15T09:00:00.000Z", url: "https://www.airbnb.com",     dob: "09/09/1988" },
  { id: 17, name: "Mark Turner",          email: "markturner@sample.com",           role: "Admin",   active: true,  createdAt: "2024-01-14T09:00:00.000Z", url: "https://www.spotify.com",    dob: "12/31/1991" },
  { id: 18, name: "Betty Walker",         email: "bettywalker@sample.com",          role: "Manager", active: false, createdAt: "2024-01-13T09:00:00.000Z", url: "https://www.zoom.com",       dob: "01/05/1985" },
  { id: 19, name: "Kimberly Green",       email: "kimberlygreen@sample.com",        role: "Analyst", active: true,  createdAt: "2024-01-12T09:00:00.000Z", url: "https://slack.com",          dob: "04/14/1993" },
  { id: 20, name: "Jeff Martin",          email: "jeffmartin@sample.com",           role: "Agent",   active: true,  createdAt: "2024-01-11T09:00:00.000Z", url: "https://www.atlassian.com",  dob: "06/06/1989" },
  { id: 21, name: "David Miller",         email: "davidmiller@sample.com",          role: "Admin",   active: false, createdAt: "2024-01-10T09:00:00.000Z", url: "https://www.shopify.com",    dob: "08/08/1982" },
  { id: 22, name: "Sandra Baker",         email: "sandrabaker@sample.com",          role: "Manager", active: true,  createdAt: "2024-01-09T09:00:00.000Z", url: "https://www.bytedance.com",  dob: "10/21/1990" },
  { id: 23, name: "Steven Evans",         email: "stevenevans@sample.com",          role: "Analyst", active: true,  createdAt: "2024-01-08T09:00:00.000Z", url: "https://stripe.com",         dob: "02/14/1987" },
  { id: 24, name: "Ruth Taylor",          email: "ruthtaylor@sample.com",           role: "Agent",   active: false, createdAt: "2024-01-07T09:00:00.000Z", url: "https://www.paypal.com",     dob: "05/05/1995" },
  { id: 25, name: "Sharon Collins",       email: "collins@sample.com",              role: "Admin",   active: true,  createdAt: "2024-01-06T09:00:00.000Z", url: "https://www.cloudflare.com", dob: "03/21/1984" },
];

function toKey(label: string, existing: Set<string>) {
  let base = label.trim().toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
  if (!base) base = "field";
  let k = base;
  let i = 1;
  while (existing.has(k)) k = `${base}_${i++}`;
  return k;
}
function serializeRows(rows: Person[]) { return rows.map(r => ({ ...r })); }



type SortableTableProps = {
  headers: { label: React.ReactNode; key: string }[];
  data: any[];
  sortable?: boolean;
};
const SortableTable: React.FC<SortableTableProps> = ({ headers, data, sortable = true }) => {
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
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) return '↕';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

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
        data={sortedData}
      />
    </SortableTableContainer>
  );
};



type AlignmentControlsProps = {
  headers: { label: string; key: string }[];
  data: any[];
};
const AlignmentControls: React.FC<AlignmentControlsProps> = ({ headers, data }) => {
  const [align, setAlign] = useState<"left"|"center"|"right">("left");
  return (
    <>
      {/* <ActionsBar>
        <Button size="small" variant={align === "left" ? "primary" : undefined} onClick={() => setAlign("left")}>Left</Button>
        <Button size="small" variant={align === "center" ? "primary" : undefined} onClick={() => setAlign("center")}>Center</Button>
        <Button size="small" variant={align === "right" ? "primary" : undefined} onClick={() => setAlign("right")}>Right</Button>
      </ActionsBar>

      <AlignableWrap align={align}>
        <DemoGrid>
          <Table headers={headers} data={data} />
        </DemoGrid>
      </AlignableWrap> */}
    </>
  );
};



type Align = "left" | "center" | "right";
const cycleAlign = (a: Align): Align => (a === "left" ? "center" : a === "center" ? "right" : "left");

const CurrencyFormatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });



export default function TableDemoPage() {
  const [activeSection, setActiveSection] = useState("basic");
  const scrollTo = (id: string) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const peopleAll = PEOPLE;
  const basicHeaders = [
    { label: "ID", key: "id" },
    { label: "Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "Role", key: "role" },
    { label: "Active", key: "active" },
    { label: "Date", key: "createdAt" },
  ];

  /* ---------- Paginated demo ---------- */
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const totalCount = peopleAll.length;
  const pagedData = useMemo(() => {
    const start = (page - 1) * limit;
    return peopleAll.slice(start, start + limit);
  }, [peopleAll, page, limit]);

  
  const LS_HEADERS = "mahati.customTable.headers.v2";
  const LS_ROWS = "mahati.customTable.rows.v2";
  const [scriptHeaders, setScriptHeaders] = useState<{ label: string; key: string }[]>([]);
  const [scriptRows, setScriptRows] = useState<Person[]>([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    try {
      const h = typeof window !== "undefined" ? localStorage.getItem(LS_HEADERS) : null;
      const r = typeof window !== "undefined" ? localStorage.getItem(LS_ROWS) : null;
      if (h && r) {
        setScriptHeaders(JSON.parse(h));
        setScriptRows(JSON.parse(r));
      } else {
        const defaultHeaders = [
          { label: "Name", key: "name" },
          { label: "Email", key: "email" },
          { label: "Role", key: "role" },
          { label: "Status", key: "active" },
          { label: "Date of Birth", key: "dob" },
        ];
        const defaultRows = serializeRows(peopleAll.slice(0, 8));
        setScriptHeaders(defaultHeaders);
        setScriptRows(defaultRows);
        if (typeof window !== "undefined") {
          localStorage.setItem(LS_HEADERS, JSON.stringify(defaultHeaders));
          localStorage.setItem(LS_ROWS, JSON.stringify(defaultRows));
        }
      }
    } catch (e) {
      console.warn("Failed to parse saved table state:", e);
    } finally {
      setInitialized(true);
    }
  }, [peopleAll]);

  useEffect(() => { if (initialized) try { localStorage.setItem(LS_HEADERS, JSON.stringify(scriptHeaders)); } catch {} }, [scriptHeaders, initialized]);
  useEffect(() => { if (initialized) try { localStorage.setItem(LS_ROWS, JSON.stringify(serializeRows(scriptRows))); } catch {} }, [scriptRows, initialized]);

  const [editingRowId, setEditingRowId] = useState<number | null>(null);
  const [draftRow, setDraftRow] = useState<Record<string, any> | null>(null);

  const startEdit = (row: Person) => { setEditingRowId(row.id); setDraftRow({ ...row }); };
  const cancelEdit = () => { setEditingRowId(null); setDraftRow(null); };
  const saveEdit = () => {
    if (!draftRow) return;
    setScriptRows(prev => prev.map(r => (r.id === draftRow.id ? { ...draftRow } as Person : r)));
    setEditingRowId(null); setDraftRow(null);
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
      createdAt: "2024-01-01T09:00:00.000Z",
      url: "",
      dob: "",
    };
    scriptHeaders.forEach(h => { if (!(h.key in blank)) (blank as any)[h.key] = h.key === "active" ? true : ""; });
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
        } else if (key.toLowerCase().includes("date") && key !== "dob") {
          const localVal = value ? new Date(value).toISOString().slice(0, 16) : "";
          cells[key] = () => (
            <input
              type="datetime-local"
              value={localVal}
              onChange={(e) => { const iso = e.target.value ? new Date(e.target.value).toISOString() : ""; handleCellChange(key, iso); }}
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
            <span style={{ padding: "2px 8px", borderRadius: 999, border: "1px solid #cbd5e1", fontSize: 12, background: "#f8fafc" }}>
              {String(value ?? "")}
            </span>
          );
        } else if (key === "active") {
          const on = typeof value === "boolean" ? value : String(value) === "true";
          cells[key] = <span style={{ fontWeight: 600, color: on ? "#16a34a" : "#ef4444" }}>{on ? "Active" : "Inactive"}</span>;
        } else if (key === "name") {
          cells[key] = <Link href={`/people/${r.id}`} style={{ color: "#1e73be", textDecoration: "none" }}>{String(value ?? "")}</Link>;
        } else if (typeof value === "string" && key.toLowerCase().includes("date") && key !== "dob") {
          cells[key] = value ? new Date(value).toLocaleString() : "-";
        } else {
          cells[key] = value ?? "";
        }
      }
    });
    (cells as any).id = r.id;
    return cells;
  });

  
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

  
  const cornerCols = [
    { key: "id", label: "ID", width: 80 },
    { key: "name", label: "Name", width: 180 },
    { key: "email", label: "Email", width: 260 },
    { key: "role", label: "Role", width: 140 },
    { key: "createdAt", label: "Date", width: 200 },
  ];
  const cornerData = useMemo(() => {
    return peopleAll.map(r => ({
      id: r.id,
      name: r.name,
      email: r.email,
      role: r.role,
      createdAt: new Date(r.createdAt).toLocaleString(),
    }));
  }, [peopleAll]);

  const [cornerWidth, setCornerWidth] = useState(760);
  const [cornerHeight, setCornerHeight] = useState(360);
  const cornerDragRef = useRef<{ startX: number; startY: number; startW: number; startH: number; corner: "nw" | "ne" | "sw" | "se" } | null>(null);

  const onCornerMove = useCallback((e: MouseEvent) => {
    const c = cornerDragRef.current; if (!c) return;
    const minW = 420, minH = 220, maxW = 1600, maxH = 900;
    let newW = c.startW, newH = c.startH;
    const dx = e.clientX - c.startX, dy = e.clientY - c.startY;
    if (c.corner === "se") { newW += dx; newH += dy; }
    else if (c.corner === "sw") { newW -= dx; newH += dy; }
    else if (c.corner === "ne") { newW += dx; newH -= dy; }
    else { newW -= dx; newH -= dy; }
    setCornerWidth(Math.max(minW, Math.min(maxW, newW)));
    setCornerHeight(Math.max(minH, Math.min(maxH, newH)));
  }, []);
  const onCornerUp = useCallback(() => {
    cornerDragRef.current = null;
    window.removeEventListener("mousemove", onCornerMove);
    window.removeEventListener("mouseup", onCornerUp);
  }, [onCornerMove]);
  const beginCornerResize = (corner: "nw" | "ne" | "sw" | "se", e: React.MouseEvent) => {
    e.preventDefault();
    cornerDragRef.current = { startX: e.clientX, startY: e.clientY, startW: cornerWidth, startH: cornerHeight, corner };
    window.addEventListener("mousemove", onCornerMove);
    window.addEventListener("mouseup", onCornerUp);
  };

  const [crColWidths, setCrColWidths] = useState<number[]>(cornerCols.map(c => Math.max(c.width ?? 160, 80)));
  const [crRowHeights, setCrRowHeights] = useState<number[]>(peopleAll.map(() => 44));
  const crColDrag = useRef<{ idx: number; startX: number; startW: number } | null>(null);
  const crRowDrag = useRef<{ idx: number; startY: number; startH: number } | null>(null);

  const onCrColMove = useCallback((e: MouseEvent) => {
    const a = crColDrag.current; if (!a) return;
    const delta = e.clientX - a.startX;
    setCrColWidths(prev => { const next = [...prev]; next[a.idx] = Math.max(80, Math.min(600, a.startW + delta)); return next; });
  }, []);
  const onCrColUp = useCallback(() => {
    crColDrag.current = null;
    window.removeEventListener("mousemove", onCrColMove);
    window.removeEventListener("mouseup", onCrColUp);
  }, [onCrColMove]);
  const startCrCol = (idx: number, e: React.MouseEvent) => {
    e.preventDefault();
    crColDrag.current = { idx, startX: e.clientX, startW: crColWidths[idx] };
    window.addEventListener("mousemove", onCrColMove);
    window.addEventListener("mouseup", onCrColUp);
  };

  const onCrRowMove = useCallback((e: MouseEvent) => {
    const a = crRowDrag.current; if (!a) return;
    const delta = e.clientY - a.startY;
    setCrRowHeights(prev => { const next = [...prev]; next[a.idx] = Math.max(28, Math.min(160, a.startH + delta)); return next; });
  }, []);
  const onCrRowUp = useCallback(() => {
    crRowDrag.current = null;
    window.removeEventListener("mousemove", onCrRowMove);
    window.removeEventListener("mouseup", onCrRowUp);
  }, [onCrRowMove]);
  const startCrRow = (idx: number, e: React.MouseEvent) => {
    e.preventDefault();
    crRowDrag.current = { idx, startY: e.clientY, startH: crRowHeights[idx] };
    window.addEventListener("mousemove", onCrRowMove);
    window.addEventListener("mouseup", onCrRowUp);
  };

  useEffect(() => {
    if (crRowHeights.length !== peopleAll.length) {
      setCrRowHeights(Array.from({ length: peopleAll.length }).map((_, i) => crRowHeights[i] ?? 44));
    }
  }, [peopleAll.length]);

  
  const sections = [
    { id: "basic", name: "Basic Table" },
    { id: "paginated", name: "Paginated Table" },
    { id: "custom", name: "Custom Cells & Actions" },
    { id: "date-time-sorting", name: "Date & Time Sorting" },
    { id: "bordered", name: "Bordered Table" },
    { id: "resizable", name: "Resizable Columns & Rows" },
    { id: "corner-resizable", name: "Corner + Col + Row Resizing (with Pagination)" },
    { id: "alignment-controls", name: "Alignment Controls (Left / Center / Right)" },
    { id: "per-column-alignment", name: "Per-Column Alignment (Click Header to Cycle)" },
    { id: "column-visibility", name: "Column Visibility (Multi-Select)" },
    { id: "all-in-one", name: "All-in-One Table" },
  ];

  const resetDemo = () => {
    localStorage.removeItem(LS_HEADERS);
    localStorage.removeItem(LS_ROWS);
    const defaultHeaders = [
      { label: "Name", key: "name" },
      { label: "Email", key: "email" },
      { label: "Role", key: "role" },
      { label: "Status", key: "active" },
      { label: "Date of Birth", key: "dob" },
    ];
    const defaultRows = serializeRows(peopleAll.slice(0, 8));
    setScriptHeaders(defaultHeaders);
    setScriptRows(defaultRows);
    setEditingRowId(null);
    setDraftRow(null);
  };

  
  const [aioAlign, setAioAlign] = useState<"left" | "center" | "right">("left");
  const [aioWidth, setAioWidth] = useState(900);
  const [aioHeight, setAioHeight] = useState(420);
  const aioCornerRef = useRef<{ startX: number; startY: number; startW: number; startH: number; corner: "nw"|"ne"|"sw"|"se"; } | null>(null);

  const onAioCornerMove = useCallback((e: MouseEvent) => {
    const c = aioCornerRef.current; if (!c) return;
    const minW = 520, minH = 260, maxW = 1800, maxH = 1000;
    let newW = c.startW, newH = c.startH;
    const dx = e.clientX - c.startX, dy = e.clientY - c.startY;
    if (c.corner === "se") { newW += dx; newH += dy; }
    else if (c.corner === "sw") { newW -= dx; newH += dy; }
    else if (c.corner === "ne") { newW += dx; newH -= dy; }
    else { newW -= dx; newH -= dy; }
    setAioWidth(Math.max(minW, Math.min(maxW, newW)));
    setAioHeight(Math.max(minH, Math.min(maxH, newH)));
  }, []);
  const onAioCornerUp = useCallback(() => {
    aioCornerRef.current = null;
    window.removeEventListener("mousemove", onAioCornerMove);
    window.removeEventListener("mouseup", onAioCornerUp);
  }, [onAioCornerMove]);
  const beginAioCornerResize = (corner: "nw"|"ne"|"sw"|"se", e: React.MouseEvent) => {
    e.preventDefault();
    aioCornerRef.current = { startX: e.clientX, startY: e.clientY, startW: aioWidth, startH: aioHeight, corner };
    window.addEventListener("mousemove", onAioCornerMove);
    window.addEventListener("mouseup", onAioCornerUp);
  };

  const [aioHeaders, setAioHeaders] = useState<{label: string; key: string}[]>([
    { label: "ID", key: "id" },
    { label: "Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "Role", key: "role" },
    { label: "Active", key: "active" },
    { label: "Date", key: "createdAt" },
  ]);

  
  const [aioRows, setAioRows] = useState<Person[]>(() => peopleAll.map(r => ({ ...r })));

  
  useEffect(() => {
    setAioRows(peopleAll.map(r => ({ ...r })));
  }, [peopleAll]);

  const [aioSort, setAioSort] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);
  const aioSortedRows = useMemo(() => {
    const data = [...aioRows];
    if (!aioSort) return data;
    const { key, direction } = aioSort;
    const dir = direction === "asc" ? 1 : -1;
    const toMinutes = (t: string) => { if (!t) return 0; const [hh, mm] = t.split(':').map(Number); return (hh || 0) * 60 + (mm || 0); };
    data.sort((a: any, b: any) => {
      let av = a[key], bv = b[key];
      if (String(key).toLowerCase().includes("date")) { av = av ? new Date(av).getTime() : 0; bv = bv ? new Date(bv).getTime() : 0; }
      else if (String(key).toLowerCase().includes("time")) { av = toMinutes(av); bv = toMinutes(bv); }
      else if (typeof av === "string" && typeof bv === "string") { av = av.toLowerCase(); bv = bv.toLowerCase(); }
      if (av < bv) return -1 * dir; if (av > bv) return  1 * dir; return 0;
    });
    return data;
  }, [aioRows, aioSort]);

  const [aioPage, setAioPage] = useState(1);
  const [aioLimit, setAioLimit] = useState(8);
  const aioTotal = aioSortedRows.length;
  const aioTotalPages = Math.max(1, Math.ceil(aioTotal / aioLimit));
  const aioStart = (aioPage - 1) * aioLimit;
  const aioSlice = aioSortedRows.slice(aioStart, aioStart + aioLimit);

  const [aioColWidths, setAioColWidths] = useState<number[]>(aioHeaders.map((_, i) => [90, 160, 260, 140, 120, 200][i] ?? 140));
  useEffect(() => { if (aioColWidths.length !== aioHeaders.length) setAioColWidths(aioHeaders.map((_, i) => aioColWidths[i] ?? 140)); }, [aioHeaders.length]);

  const [aioRowHeights, setAioRowHeights] = useState<number[]>(() => aioRows.map(() => 44));
  useEffect(() => {
    if (aioRowHeights.length !== aioRows.length) {
      setAioRowHeights(Array.from({ length: aioRows.length }, (_, i) => aioRowHeights[i] ?? 44));
    }
  }, [aioRows.length]);

  const aioColDrag = useRef<{ idx: number; startX: number; startW: number } | null>(null);
  const aioRowDrag = useRef<{ idx: number; startY: number; startH: number } | null>(null);

  const onAioColMove = useCallback((e: MouseEvent) => {
    const a = aioColDrag.current; if (!a) return;
    const delta = e.clientX - a.startX;
    setAioColWidths(prev => { const next = [...prev]; next[a.idx] = Math.max(80, Math.min(700, a.startW + delta)); return next; });
  }, []);
  const onAioColUp = useCallback(() => { aioColDrag.current = null; window.removeEventListener("mousemove", onAioColMove); window.removeEventListener("mouseup", onAioColUp); }, [onAioColMove]);
  const startAioCol = (idx: number, e: React.MouseEvent) => { e.preventDefault(); aioColDrag.current = { idx, startX: e.clientX, startW: aioColWidths[idx] }; window.addEventListener("mousemove", onAioColMove); window.addEventListener("mouseup", onAioColUp); };

  const onAioRowMove = useCallback((e: MouseEvent) => {
    const a = aioRowDrag.current; if (!a) return;
    const delta = e.clientY - a.startY;
    setAioRowHeights(prev => { const next = [...prev]; next[a.idx] = Math.max(28, Math.min(200, a.startH + delta)); return next; });
  }, []);
  const onAioRowUp = useCallback(() => { aioRowDrag.current = null; window.removeEventListener("mousemove", onAioRowMove); window.removeEventListener("mouseup", onAioRowUp); }, [onAioRowMove]);
  const startAioRow = (globalIdx: number, e: React.MouseEvent) => { e.preventDefault(); aioRowDrag.current = { idx: globalIdx, startY: e.clientY, startH: (aioRowHeights[globalIdx] ?? 44) }; window.addEventListener("mousemove", onAioRowMove); window.addEventListener("mouseup", onAioRowUp); };

  const [aioEditingId, setAioEditingId] = useState<number | null>(null);
  const [aioDraft, setAioDraft] = useState<Record<string, any> | null>(null);
  const aioStartEdit = (row: Person) => { setAioEditingId(row.id); setAioDraft({ ...row }); };
  const aioCancelEdit = () => { setAioEditingId(null); setAioDraft(null); };
  const aioSaveEdit = () => { if (!aioDraft) return; setAioRows(prev => prev.map(r => (r.id === (aioDraft as any).id ? { ...(aioDraft as any) } : r))); setAioEditingId(null); setAioDraft(null); };
  const aioDeleteRow = (id: number) => { if (!confirm("Delete this row?")) return; setAioRows(prev => prev.filter(r => r.id !== id)); if (aioEditingId === id) aioCancelEdit(); };
  const aioHandleCell = (key: string, value: any) => { if (!aioDraft) return; setAioDraft({ ...aioDraft, [key]: value }); };
  const aioAddRow = () => {
    const nextId = (aioRows.reduce((m, r) => Math.max(m, r.id as number), 0) || 0) + 1;
    const blank: Person = { id: nextId, name: "", email: "", role: "Agent", active: true, createdAt: "2024-01-01T09:00:00.000Z", url: "", dob: "" };
    aioHeaders.forEach(h => { if (!(h.key in blank)) (blank as any)[h.key] = h.key === "active" ? true : ""; });
    setAioRows(prev => [blank, ...prev]);
    setAioEditingId(nextId);
    setAioDraft({ ...blank });
  };
  const aioAddColumn = () => {
    const label = window.prompt("Enter new column label (e.g., Phone):");
    if (!label) return;
    const existing = new Set(aioHeaders.map(h => h.key));
    const key = toKey(label, existing);
    const newHeader = { label, key };
    setAioHeaders(prev => [...prev, newHeader]);
    setAioRows(prev => prev.map(r => ({ ...r, [key]: "" })));
    setAioDraft(dr => (dr ? { ...dr, [key]: "" } : dr));
  };
  const aioReset = () => {

    setAioHeaders([
      { label: "ID", key: "id" },
      { label: "Name", key: "name" },
      { label: "Email", key: "email" },
      { label: "Role", key: "role" },
      { label: "Active", key: "active" },
      { label: "Date", key: "createdAt" },
    ]);
    setAioRows(peopleAll.map(r => ({ ...r })));
    setAioColWidths([90,160,260,140,120,200]);
    setAioRowHeights(Array.from({length: peopleAll.length}, () => 44));
    setAioEditingId(null); setAioDraft(null);
    setAioPage(1); setAioLimit(8);
    setAioSort(null);
    setAioAlign("left");
    setAioWidth(900); setAioHeight(420);
  };
  const aioHeaderClick = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (aioSort && aioSort.key === key && aioSort.direction === "asc") direction = "desc";
    setAioSort({ key, direction });
    setAioPage(1);
  };

  
  const perColHeaders = [
    { label: "ID", key: "id" },
    { label: "Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "Role", key: "role" },
    { label: "Active", key: "active" },
    { label: "Amount", key: "currency" },
    { label: "Date", key: "createdAt" },
  ];
  const [colAlign, setColAlign] = useState<Record<string, Align>>(() =>
    perColHeaders.reduce((acc, h) => { acc[h.key] = "left"; return acc; }, {} as Record<string, Align>)
  );
  const toggleColAlign = (key: string) => {
    setColAlign(prev => ({ ...prev, [key]: cycleAlign(prev[key]) }));
  };
  const perColData = useMemo(() => {
    const rows = peopleAll.slice(0, 8).map((r) => {
      const currencyValue = CurrencyFormatter.format((r.id * 37.42) % 10000);
      const raw: any = {
        id: r.id,
        name: (
          <a
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#1e73be", textDecoration: "none" }}
          >
            {r.name}
          </a>
        ),
        email: r.email,
        role: <span style={{ padding: "2px 8px", borderRadius: 999, border: "1px solid #cbd5e1", fontSize: 12, background: "#f8fafc" }}>{r.role}</span>,
        active: (typeof r.active === "boolean" ? r.active : String(r.active) === "true")
          ? <span style={{ fontWeight: 600, color: "#16a34a" }}>Active</span>
          : <span style={{ fontWeight: 600, color: "#ef4444" }}>Inactive</span>,
        currency: currencyValue,
        createdAt: new Date(r.createdAt).toLocaleString(),
      };
      const wrapped: any = {};
      perColHeaders.forEach(h => {
        const key = h.key;
        wrapped[key] = <div style={{ textAlign: colAlign[key] }}>{raw[key]}</div>;
      });
      return wrapped;
    });
    return rows;
  }, [peopleAll, colAlign]);

  const perColHeadersClickable = perColHeaders.map(h => ({
    ...h,
    label: (
      <div
        onClick={() => toggleColAlign(h.key)}
        title="Click to cycle alignment of this column's cells"
        style={{ cursor: "pointer", userSelect: "none" }}
      >
        {h.label}
        <span style={{ marginLeft: 8, fontSize: 12, opacity: 0.85 }}>
          {colAlign[h.key] === "left" ? "↤" : colAlign[h.key] === "center" ? "↔" : "↦"}
        </span>
      </div>
    )
  }));

  

  const visibilityHeaders = [
    { label: "ID", key: "id" },
    { label: "Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "Role", key: "role" },
    { label: "Active", key: "active" },
    { label: "Currency", key: "currency" },
    { label: "Date", key: "createdAt" },
    { label: "Department", key: "department" },
    { label: "Location", key: "location" },
    { label: "Phone", key: "phone" },
  ] as const;

  const [visibleKeys, setVisibleKeys] = useState<string[]>(() => visibilityHeaders.map(h => h.key));
  const [pickerOpen, setPickerOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!pickerRef.current) return;
      if (!pickerRef.current.contains(e.target as Node)) setPickerOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggleKey = (key: string) => {
    setVisibleKeys(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };
  const selectAll = () => setVisibleKeys(visibilityHeaders.map(h => h.key));
  const clearAll = () => setVisibleKeys([]);

  const visibilityData = useMemo(() => {
    const departments = ["Sales", "Support", "Ops", "Legal", "Finance", "HR", "IT"];
    const locations = ["NY", "Miami", "Dallas", "LA", "Boston", "Chicago", "Washington DC"];
    return peopleAll.slice(0, 10).map((r) => ({
      id: r.id,
      name: (
        <a
          href={r.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#1e73be", textDecoration: "none" }}
        >
          {r.name}
        </a>
      ),
      email: r.email,
      role: r.role,
      active: (typeof r.active === "boolean" ? r.active : String(r.active) === "true")
        ? <span style={{ fontWeight: 600, color: "#16a34a" }}>Active</span>
        : <span style={{ fontWeight: 600, color: "#ef4444" }}>Inactive</span>,
      currency: CurrencyFormatter.format((r.id * 51.2) % 20000),
      createdAt: new Date(r.createdAt).toLocaleString(),
      department: departments[r.id % departments.length],
      location: locations[r.id % locations.length],
      phone: `+1-(555)-014-87${(r.id % 100).toString().padStart(2, "0")}`,
    }));
  }, [peopleAll]);

  const filteredHeaders = visibilityHeaders.filter(h => visibleKeys.includes(h.key));

  

  return (
<></>
  );
}
