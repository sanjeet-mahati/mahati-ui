// tabdemotailwindcss.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {MahatiTableTailwind} from "@/components";

// import Table from "../../components/TableTailwindCSS";
import {MahatiButton} from "@/components";

type Align = "left" | "center" | "right";

type Person = {
  id: number;
  name: string;
  email: string;
  role: "Admin" | "Manager" | "Analyst" | "Agent" | string;
  active: boolean | string;
  createdAt: string;
  url: string;
  dob: string;
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

const Currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

const toKey = (label: string, existing: Set<string>) => {
  let base = label.trim().toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
  if (!base) base = "field";
  let k = base, i = 1;
  while (existing.has(k)) k = `${base}_${i++}`;
  return k;
};

const Section: React.FC<React.PropsWithChildren<{ id?: string; className?: string }>> = ({ id, className, children }) => (
  <section id={id} className={`mb-12 rounded-xl border border-slate-200 bg-white p-8 shadow-sm ${className ?? ""}`}>
    {children}
  </section>
);
const SectionTitle: React.FC<React.PropsWithChildren> = ({ children }) => (
  <h2 className="mb-3 text-2xl font-semibold text-slate-800">{children}</h2>
);
const SectionDescription: React.FC<React.PropsWithChildren> = ({ children }) => (
  <p className="mb-6 leading-relaxed text-slate-500">{children}</p>
);
const DemoGrid: React.FC<React.PropsWithChildren> = ({ children }) => (
  <div className="grid grid-cols-1 gap-6">{children}</div>
);

const useSearchPaginate = (rows: Person[], defaultLimit = 10) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(defaultLimit);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search) return rows;
    const q = search.toLowerCase();
    return rows.filter((r) => Object.values(r).some((v) => String(v).toLowerCase().includes(q)));
  }, [rows, search]);

  const total = filtered.length;
  const start = (page - 1) * limit;
  const slice = filtered.slice(start, start + limit);

  const onSearch = (term: string) => {
    setSearch(term);
    setPage(1);
  };
  const onReset = () => {
    setSearch("");
    setPage(1);
  };

  return { page, setPage, limit, setLimit, search, onSearch, onReset, total, slice };
};

const SortableTable: React.FC<{
  headers: { label: React.ReactNode; key: string }[];
  data: any[];
  sortable?: boolean;
}> = ({ headers, data, sortable = true }) => {
  const [sort, setSort] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);
  const sorted = useMemo(() => {
    if (!sort || !sortable) return data;
    const { key, direction } = sort;
    const dir = direction === "asc" ? 1 : -1;
    const toMinutes = (t: string) => {
      if (!t) return 0;
      const [hh, mm] = t.split(":").map(Number);
      return (hh || 0) * 60 + (mm || 0);
    };
    return [...data].sort((a: any, b: any) => {
      let av = a[key], bv = b[key];
      const k = key.toLowerCase();
      if (k.includes("date")) {
        av = av ? new Date(av).getTime() : 0;
        bv = bv ? new Date(bv).getTime() : 0;
      } else if (k.includes("time")) {
        av = toMinutes(av);
        bv = toMinutes(bv);
      } else if (typeof av === "string" && typeof bv === "string") {
        av = av.toLowerCase();
        bv = bv.toLowerCase();
      }
      if (av < bv) return -1 * dir;
      if (av > bv) return 1 * dir;
      return 0;
    });
  }, [data, sort, sortable]);

  const indicator = (key: string) =>
    sort?.key === key ? (sort.direction === "asc" ? "↑" : "↓") : "↕";

  const clickableHeaders = headers.map((h) => ({
    ...h,
    label: (
      <button
        type="button"
        onClick={() => {
          if (!sortable) return;
          let direction: "asc" | "desc" = "asc";
          if (sort && sort.key === h.key && sort.direction === "asc") direction = "desc";
          setSort({ key: h.key, direction });
        }}
        className={`group inline-flex items-center gap-2 ${sortable ? "cursor-pointer" : "cursor-default"}`}
        title={sortable ? "Sort" : undefined}
      >
        <span>{h.label}</span>
        <span className="text-xs text-slate-500 group-hover:text-slate-700">{indicator(h.key)}</span>
      </button>
    ),
  }));

  return <MahatiTableTailwind headers={clickableHeaders} data={sorted} />;
};

export default function TabDemoTailwindCSS() {
  // ====== Shared datasets & headers ======
  const peopleAll = PEOPLE;
  const basicHeaders = [
    { label: "ID", key: "id" },
    { label: "Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "Role", key: "role" },
    { label: "Active", key: "active" },
    { label: "Date", key: "createdAt" },
  ];

  // ====== Paginated + Search ======
  const { page, setPage, limit, setLimit, search, onSearch, onReset, total, slice } = useSearchPaginate(peopleAll, 10);

  // ====== Custom cells & actions (editable, add row/col) ======
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
        const defaults = [
          { label: "Name", key: "name" },
          { label: "Email", key: "email" },
          { label: "Role", key: "role" },
          { label: "Status", key: "active" },
          { label: "Date of Birth", key: "dob" },
        ];
        setScriptHeaders(defaults);
        setScriptRows(peopleAll.slice(0, 8).map((p) => ({ ...p })));
        if (typeof window !== "undefined") {
          localStorage.setItem(LS_HEADERS, JSON.stringify(defaults));
          localStorage.setItem(LS_ROWS, JSON.stringify(peopleAll.slice(0, 8)));
        }
      }
    } catch {
      // ignore
    } finally {
      setInitialized(true);
    }
  }, [peopleAll]);

  useEffect(() => {
    if (initialized) {
      try {
        localStorage.setItem(LS_HEADERS, JSON.stringify(scriptHeaders));
      } catch {}
    }
  }, [scriptHeaders, initialized]);

  useEffect(() => {
    if (initialized) {
      try {
        localStorage.setItem(LS_ROWS, JSON.stringify(scriptRows));
      } catch {}
    }
  }, [scriptRows, initialized]);

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
    setScriptRows((prev) => prev.map((r) => (r.id === draftRow.id ? ({ ...draftRow } as Person) : r)));
    setEditingRowId(null);
    setDraftRow(null);
  };
  const deleteRow = (id: number) => {
    if (!confirm("Delete this row?")) return;
    setScriptRows((prev) => prev.filter((r) => r.id !== id));
    if (editingRowId === id) cancelEdit();
  };
  const handleCellChange = (key: string, value: any) => {
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
    scriptHeaders.forEach((h) => {
      if (!(h.key in blank)) (blank as any)[h.key] = h.key === "active" ? true : "";
    });
    setScriptRows((prev) => [blank, ...prev]);
    setEditingRowId(nextId);
    setDraftRow({ ...blank });
  };
  const handleAddColumn = () => {
    const label = window.prompt("Enter new column label (e.g., Phone):");
    if (!label) return;
    const existing = new Set(scriptHeaders.map((h) => h.key));
    const key = toKey(label, existing);
    const newHeader = { label, key };
    setScriptHeaders((prev) => [...prev, newHeader]);
    setScriptRows((prev) => prev.map((r) => ({ ...r, [key]: "" })));
    setDraftRow((dr) => (dr ? { ...dr, [key]: "" } : dr));
  };
  const resetDemo = () => {
    localStorage.removeItem(LS_HEADERS);
    localStorage.removeItem(LS_ROWS);
    const defaults = [
      { label: "Name", key: "name" },
      { label: "Email", key: "email" },
      { label: "Role", key: "role" },
      { label: "Status", key: "active" },
      { label: "Date of Birth", key: "dob" },
    ];
    setScriptHeaders(defaults);
    setScriptRows(peopleAll.slice(0, 8).map((p) => ({ ...p })));
    setEditingRowId(null);
    setDraftRow(null);
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
              className="w-full rounded-md border border-slate-300 px-2 py-1 text-sm"
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
              onChange={(e) =>
                handleCellChange(key, e.target.value ? new Date(e.target.value).toISOString() : "")
              }
              className="w-full rounded-md border border-slate-300 px-2 py-1 text-sm"
            />
          );
        } else {
          cells[key] = () => (
            <input
              type="text"
              value={value ?? ""}
              onChange={(e) => handleCellChange(key, e.target.value)}
              placeholder={label}
              className="w-full rounded-md border border-slate-300 px-2 py-1 text-sm"
            />
          );
        }
      } else {
        if (key === "role") {
          cells[key] = (
            <span className="rounded-full border border-slate-300 bg-slate-50 px-2 py-0.5 text-xs">
              {String(value ?? "")}
            </span>
          );
        } else if (key === "active") {
          const on = typeof value === "boolean" ? value : String(value) === "true";
          cells[key] = (
            <span className={`font-semibold ${on ? "text-green-600" : "text-red-500"}`}>
              {on ? "Active" : "Inactive"}
            </span>
          );
        } else if (key === "name") {
          cells[key] = (
            <Link href={`/people/${r.id}`} className="text-sky-700 hover:underline">
              {String(value ?? "")}
            </Link>
          );
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

  // ===== Date/Time sorting demo data =====
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
  const tasksDataPrepared = tasksData.map((t) => ({ ...t, dueDate: new Date(t.dueDate) }));

  // ===== Alignment Controls =====
  const [aioAlign, setAioAlign] = useState<Align>("left");

  // ===== Per-column alignment =====
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
    perColHeaders.reduce((acc, h) => ({ ...acc, [h.key]: "left" as Align }), {} as Record<string, Align>)
  );
  const cycleAlign = (a: Align): Align => (a === "left" ? "center" : a === "center" ? "right" : "left");
  const toggleColAlign = (key: string) => setColAlign((prev) => ({ ...prev, [key]: cycleAlign(prev[key]) }));

  const perColData = useMemo(() => {
    return peopleAll.slice(0, 8).map((r) => {
      const currencyValue = Currency.format((r.id * 37.42) % 10000);
      const raw: any = {
        id: r.id,
        name: (
          <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-sky-700 hover:underline">
            {r.name}
          </a>
        ),
        email: r.email,
        role: <span className="rounded-full border border-slate-300 bg-slate-50 px-2 py-0.5 text-xs">{r.role}</span>,
        active:
          (typeof r.active === "boolean" ? r.active : String(r.active) === "true") ? (
            <span className="font-semibold text-green-600">Active</span>
          ) : (
            <span className="font-semibold text-red-500">Inactive</span>
          ),
        currency: currencyValue,
        createdAt: new Date(r.createdAt).toLocaleString(),
      };
      const wrapped: any = {};
      perColHeaders.forEach((h) => {
        const alignCls =
          colAlign[h.key] === "left"
            ? "text-left"
            : colAlign[h.key] === "center"
            ? "text-center"
            : "text-right";
        wrapped[h.key] = <div className={alignCls}>{raw[h.key]}</div>;
      });
      return wrapped;
    });
  }, [peopleAll, colAlign]);

  const perColHeadersClickable = perColHeaders.map((h) => ({
    ...h,
    label: (
      <button
        type="button"
        onClick={() => toggleColAlign(h.key)}
        className="inline-flex items-center gap-2 text-left"
        title="Click to cycle alignment of this column's cells"
      >
        <span>{h.label}</span>
        <span className="text-xs opacity-80">
          {colAlign[h.key] === "left" ? "↤" : colAlign[h.key] === "center" ? "↔" : "↦"}
        </span>
      </button>
    ),
  }));

  // ===== Column visibility =====
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

  const [visibleKeys, setVisibleKeys] = useState<string[]>(
    () => visibilityHeaders.map((h) => h.key)
  );
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

  const toggleKey = (key: string) =>
    setVisibleKeys((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  const selectAll = () => setVisibleKeys(visibilityHeaders.map((h) => h.key));
  const clearAll = () => setVisibleKeys([]);

  const visibilityData = useMemo(() => {
    const departments = ["Sales", "Support", "Ops", "Legal", "Finance", "HR", "IT"];
    const locations = ["NY", "Miami", "Dallas", "LA", "Boston", "Chicago", "Washington DC"];
    return peopleAll.slice(0, 10).map((r) => ({
      id: r.id,
      name: (
        <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-sky-700 hover:underline">
          {r.name}
        </a>
      ),
      email: r.email,
      role: r.role,
      active:
        (typeof r.active === "boolean" ? r.active : String(r.active) === "true") ? (
          <span className="font-semibold text-green-600">Active</span>
        ) : (
          <span className="font-semibold text-red-500">Inactive</span>
        ),
      currency: Currency.format((r.id * 51.2) % 20000),
      createdAt: new Date(r.createdAt).toLocaleString(),
      department: departments[r.id % departments.length],
      location: locations[r.id % locations.length],
      phone: `+1-(555)-014-87${(r.id % 100).toString().padStart(2, "0")}`,
    }));
  }, [peopleAll]);

  const filteredHeaders = visibilityHeaders.filter((h) => visibleKeys.includes(h.key));

  // ===== Render =====
  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-6xl px-6 py-12">
        <header className="mb-12">
          <h1 className="mb-4 text-5xl font-bold text-slate-900">Table</h1>
          <p className=" text-lg leading-relaxed text-slate-500">
            Basic, paginated, bordered, sortable, editable tables, per-table alignment controls, per-column alignment,
            a column visibility demo, and an all-in-one demo — all fed by the same dataset.
          </p>
        </header>

        {/* BASIC */}
        <Section id="basic">
          <SectionTitle>Basic Table</SectionTitle>
          <SectionDescription>A minimal example with static data and no pagination controls.</SectionDescription>
          <DemoGrid>
            <MahatiTableTailwind headers={basicHeaders} data={peopleAll.slice(0, 8)} />
          </DemoGrid>
        </Section>

        {/* PAGINATED */}
        <Section id="paginated">
          <SectionTitle>Paginated Table</SectionTitle>
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <input
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Search…"
              className="w-64 rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
            <MahatiButton onClick={onReset}>Reset</MahatiButton>
            <div className="ml-auto flex items-center gap-2 text-sm text-slate-600">
              <span>Rows per page:</span>
              <select
                value={limit}
                onChange={(e) => {
                  setPage(1);
                  setLimit(Number(e.target.value));
                }}
                className="rounded-md border border-slate-300 px-2 py-1 text-sm"
              >
                {[5, 8, 10, 12, 15].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              <span>| Total: {total}</span>
            </div>
          </div>

          <DemoGrid>
            <MahatiTableTailwind
              headers={basicHeaders}
              data={slice}
              page={page}
              setPage={setPage}
              limit={limit}
              setLimit={setLimit}
              totalCount={total}
              paginationRequired
              paginationPosition="bottom-center"
              searchable
              searchTerm={search}
              onSearch={onSearch}
              onResetSearch={onReset}
              onDownloadPDF={() => alert("PDF download triggered!")}
            />
          </DemoGrid>
        </Section>

        {/* CUSTOM CELLS & ACTIONS */}
        <Section id="custom">
          <SectionTitle>Custom Cells &amp; Actions</SectionTitle>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <MahatiButton variant="primary" onClick={handleAddRow}>
              + Add Row
            </MahatiButton>
            <MahatiButton onClick={handleAddColumn}>+ Add Column</MahatiButton>
            <MahatiButton variant="danger" onClick={resetDemo}>
              Reset Demo
            </MahatiButton>
          </div>
          <DemoGrid>
            <MahatiTableTailwind
              headers={scriptHeaders}
              data={customTableData}
              actions={(row) => {
                const rId = Number((row as any).id);
                const source = scriptRows.find((r) => r.id === rId);
                const isEditing = source?.id === editingRowId;
                return (
                  <div className="flex items-center gap-2">
                    {!isEditing ? (
                      <>
                        <MahatiButton size="small" onClick={() => source && startEdit(source)}>
                          Edit
                        </MahatiButton>
                        <MahatiButton size="small" variant="danger" onClick={() => source && deleteRow(source.id)}>
                          Delete
                        </MahatiButton>
                      </>
                    ) : (
                      <>
                        <MahatiButton size="small" variant="primary" onClick={saveEdit}>
                          Save
                        </MahatiButton>
                        <MahatiButton size="small" onClick={cancelEdit}>
                          Cancel
                        </MahatiButton>
                      </>
                    )}
                  </div>
                );
              }}
            />
          </DemoGrid>
        </Section>

        {/* DATE & TIME SORTING */}
        <Section id="date-time-sorting">
          <SectionTitle>Date &amp; Time Sorting</SectionTitle>
          <DemoGrid>
            <SortableTable headers={taskHeaders} data={tasksDataPrepared} />
          </DemoGrid>
        </Section>

        {/* BORDERED */}
        <Section id="bordered">
          <SectionTitle>Bordered Table (Visible Edges)</SectionTitle>
          <SectionDescription>Wrap the original Table to show visible cell edges.</SectionDescription>
          <DemoGrid>
            <div className="[&_table]:border-collapse [&_th]:border [&_td]:border [&_th]:border-slate-200 [&_td]:border-slate-200 rounded-lg bg-white p-2">
              <MahatiTableTailwind headers={basicHeaders} data={peopleAll.slice(0, 10)} />
            </div>
          </DemoGrid>
        </Section>

        {/* ALIGNMENT CONTROLS (ALL CELLS) */}
        <Section id="alignment-controls">
          <SectionTitle>Alignment Controls (Left / Center / Right)</SectionTitle>
          <SectionDescription>
            This table starts left-aligned. Use the buttons to change alignment of <em>all cells</em> in this table only.
          </SectionDescription>

          <div className="mb-3 flex flex-wrap items-center gap-2">
            <MahatiButton size="small" variant={aioAlign === "left" ? "primary" : undefined} onClick={() => setAioAlign("left")}>
              Left
            </MahatiButton>
            <MahatiButton size="small" variant={aioAlign === "center" ? "primary" : undefined} onClick={() => setAioAlign("center")}>
              Center
            </MahatiButton>
            <MahatiButton size="small" variant={aioAlign === "right" ? "primary" : undefined} onClick={() => setAioAlign("right")}>
              Right
            </MahatiButton>
          </div>

          <DemoGrid>
            <div className={aioAlign === "left" ? "text-left" : aioAlign === "center" ? "text-center" : "text-right"}>
              <MahatiTableTailwind headers={basicHeaders} data={peopleAll.slice(0, 8)} />
            </div>
          </DemoGrid>
        </Section>

        {/* PER-COLUMN ALIGNMENT */}
        <Section id="per-column-alignment">
          <SectionTitle>Per-Column Alignment (Click Header to Cycle)</SectionTitle>
          <SectionDescription>
            Starts left-aligned. Click a column header to cycle that column’s <em>cell</em> alignment: Left → Center → Right → Left.
          </SectionDescription>
          <DemoGrid>
            <MahatiTableTailwind headers={perColHeadersClickable} data={perColData} />
          </DemoGrid>
        </Section>

        {/* COLUMN VISIBILITY */}
        <Section id="column-visibility">
          <SectionTitle>Column Visibility (Multi-Select)</SectionTitle>
          <SectionDescription>
            Use the dropdown to choose which columns are shown. Initially all 10 columns are visible.
          </SectionDescription>

          <div className="mb-3 flex items-center">
            <div className="relative" ref={pickerRef}>
              <button
                type="button"
                onClick={() => setPickerOpen((o) => !o)}
                aria-haspopup="menu"
                aria-expanded={pickerOpen}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm hover:bg-slate-50"
              >
                Columns ({visibleKeys.length}/{visibilityHeaders.length})
              </button>

              {pickerOpen && (
                <div
                  role="menu"
                  aria-label="Choose visible columns"
                  className="absolute left-0 top-[calc(100%+6px)] z-30 min-w-60 rounded-xl border border-slate-200 bg-white p-2 shadow-xl"
                >
                  <div className="max-h-72 space-y-1 overflow-auto">
                    {visibilityHeaders.map((h) => (
                      <label
                        key={h.key}
                        className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-50"
                      >
                        <input
                          type="checkbox"
                          checked={visibleKeys.includes(h.key)}
                          onChange={() => toggleKey(h.key)}
                          className="h-4 w-4 rounded border-slate-300"
                        />
                        <span className="text-sm text-slate-700">{h.label}</span>
                      </label>
                    ))}
                  </div>
                  <div className="mt-2 flex items-center gap-2 border-t border-slate-100 pt-2">
                    <MahatiButton size="small" onClick={selectAll}>
                      Select All
                    </MahatiButton>
                    <MahatiButton size="small" onClick={clearAll}>
                      Clear All
                    </MahatiButton>
                    <div className="ml-auto">
                      <MahatiButton size="small" variant="primary" onClick={() => setPickerOpen(false)}>
                        Done
                      </MahatiButton>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <DemoGrid>
            <MahatiTableTailwind
              headers={visibilityHeaders.filter((h) => visibleKeys.includes(h.key))}
              data={useMemo(() => {
                // Build rows picking only visible keys
                return visibilityData.map((row) => {
                  const obj: Record<string, any> = {};
                  visibilityHeaders.forEach((h) => {
                    if (visibleKeys.includes(h.key)) obj[h.key] = (row as any)[h.key];
                  });
                  return obj;
                });
              }, [visibilityData, visibleKeys])}
            />
          </DemoGrid>
        </Section>

        {/* ALL-IN-ONE (minus resizers to keep Tailwind-only) */}
        <Section id="all-in-one">
          <SectionTitle>All-in-One Table (Everything Demo)</SectionTitle>
          <SectionDescription>
            Combines: sortable headers, pagination, editable rows & actions, add column/row, per-table alignment
            controls, and visible borders — all in one table.
          </SectionDescription>

          {/* alignment + actions */}
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <MahatiButton size="small" variant={aioAlign === "left" ? "primary" : undefined} onClick={() => setAioAlign("left")}>
              Left
            </MahatiButton>
            <MahatiButton size="small" variant={aioAlign === "center" ? "primary" : undefined} onClick={() => setAioAlign("center")}>
              Center
            </MahatiButton>
            <MahatiButton size="small" variant={aioAlign === "right" ? "primary" : undefined} onClick={() => setAioAlign("right")}>
              Right
            </MahatiButton>

            <span className="mx-2 h-6 w-px bg-slate-200" />

            <MahatiButton size="small" onClick={handleAddColumn}>
              + Add Column
            </MahatiButton>
            <MahatiButton size="small" onClick={handleAddRow}>
              + Add Row
            </MahatiButton>
            <MahatiButton size="small" variant="danger" onClick={resetDemo}>
              Reset
            </MahatiButton>
          </div>

          <div className={`${aioAlign === "left" ? "text-left" : aioAlign === "center" ? "text-center" : "text-right"} rounded-lg bg-white p-2 [&_table]:border-collapse [&_th]:border [&_td]:border [&_th]:border-slate-200 [&_td]:border-slate-200`}>
            {/* Sortable headers + pagination with scriptRows */}
            <SortableTable
              headers={[
                { label: "ID", key: "id" },
                ...scriptHeaders,
              ]}
              data={scriptRows}
            />
          </div>

          {/* Simple pager for scriptRows (optional) */}
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-600">
            <span className="font-medium">Rows:</span>
            <span>{scriptRows.length}</span>
          </div>
        </Section>
      </main>
    </div>
  );
}
