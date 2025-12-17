"use client";

import React, { useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

// Import existing components JUST for their prop types / variants
// import Table from "../components/TableTailwindCSS_3";
// import TabbedInterface from "../components/TabedInterfaceTailwindCSS";
import {Table} from "./TableTailwindCSS";
import {TabbedInterface} from "./TabedInterfaceTailwindCSS";



// Base prop types of existing components
type BaseTableProps = React.ComponentProps<typeof Table>;
type BaseTabProps = React.ComponentProps<typeof TabbedInterface>;

// Allow *all* visual/layout props of TabbedInterface,
// but we keep control of: tabs, onTabChange, draggableTabs, onReorderTabs, onCloseTab
type AllowedTabProps = Omit<
  BaseTabProps,
  "tabs" | "onTabChange" | "draggableTabs" | "onReorderTabs" | "onCloseTab"
>;

export interface TableWithTabProps<RowType extends Record<string, any>> {
  /**
   * Props that describe how the table should look.
   * We reuse the Table's interface, but here we only require headers + data.
   */
  tableProps: Pick<BaseTableProps, "headers" | "data">;

  /**
   * Props that describe how the tab container should look.
   * We reuse TabbedInterface's props but we control tabs & tab state.
   */
  tabProps?: AllowedTabProps;

  /**
   * If true, user can rearrange tabs by dragging.
   * If false/undefined, tabs cannot be rearranged.
   */
  rearrange?: boolean;

  /**
   * Optional custom row id. Defaults to the row index.
   */
  getRowId?: (row: RowType, index: number) => string | number;

  /**
   * Optional custom content renderer for the tab body.
   * If not provided, a simple key/value layout is shown.
   */
  renderTabContent?: (row: RowType) => React.ReactNode;

  /**
   * Optional callback when a row is opened as a tab.
   */
  onRowOpenInTab?: (row: RowType) => void;

  /**
   * Optional outer wrapper class.
   */
  className?: string;

  /**
   * Optional title/description displayed above the table.
   */
  title?: string;
  description?: string;

  /**
   * Key of the column to use as the tab header label.
   * For example: "name", "email", "policyNumber", etc.
   * If not provided, the first column in headers is used.
   */
  tabLabelKey?: string;

  /**
   * Optional font configuration for the section title/description.
   * Values like "sans", "serif", "mono", "Poppins", or a full Tailwind
   * class like "font-[Poppins]" are allowed.
   */
  sectionTitleFont?: string;
  sectionDescriptionFont?: string;
}

// Simple className join helper
const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

// Map a friendly font string -> Tailwind font class
const getFontClass = (font?: string): string => {
  if (!font) return "font-sans";

  const lower = font.toLowerCase().trim();

  if (lower === "sans" || lower === "sans-serif") return "font-sans";
  if (lower === "serif") return "font-serif";
  if (lower === "mono" || lower === "monospace") return "font-mono";

  // If it already looks like a Tailwind class, use as-is
  if (font.startsWith("font-") || font.includes("[")) return font;

  // Otherwise treat as a font family name
  return `font-[${font}]`;
};

type SelectedTab<RowType> = {
  id: string | number;
  label: string;
  row: RowType;
  rowIndex: number;
};

function renderCellValue(value: any): React.ReactNode {
  if (React.isValidElement(value)) return value;

  if (value === null || value === undefined) {
    return <span className="text-slate-400">-</span>;
  }

  if (Array.isArray(value)) {
    if (value.some((v) => React.isValidElement(v))) {
      return <>{value}</>;
    }
    return value.join(", ");
  }

  if (value instanceof Date) return value.toLocaleString();
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "number") return value.toString();
  if (typeof value === "object") return JSON.stringify(value);

  return String(value);
}

function DefaultTabContent<RowType extends Record<string, any>>({
  headers,
  row,
}: {
  headers: BaseTableProps["headers"];
  row: RowType;
}) {
  return (
    <div className="space-y-2">
      {headers.map((h) => (
        <div
          key={h.key}
          className="flex flex-col gap-1 rounded-lg bg-white p-3 text-sm shadow-sm sm:flex-row sm:items-center"
        >
          <span className="w-full text-xs font-semibold uppercase tracking-wide text-slate-500 sm:w-48">
            {h.label}
          </span>
          <span className="flex-1 break-words text-slate-800">
            {renderCellValue((row as any)[h.key])}
          </span>
        </div>
      ))}
    </div>
  );
}

function TableWithTab<RowType extends Record<string, any>>({
  tableProps,
  tabProps,
  rearrange = false,
  getRowId,
  renderTabContent,
  onRowOpenInTab,
  className,
  title,
  description,
  tabLabelKey,
  sectionTitleFont,
  sectionDescriptionFont,
}: TableWithTabProps<RowType>) {
  const { headers, data } = tableProps;

  const [tabs, setTabs] = useState<SelectedTab<RowType>[]>([]);

  // Which column to use for label when opening a new tab:
  // 1) tabLabelKey if provided
  // 2) otherwise first column's key
  const labelColumnKey = tabLabelKey ?? headers[0]?.key;

  const sectionTitleFontClass = getFontClass(sectionTitleFont);
  const sectionDescriptionFontClass = getFontClass(sectionDescriptionFont);

  // Keep existing tabs' labels in sync when tabLabelKey or headers change
  useEffect(() => {
    if (!tabs.length) return;

    setTabs((prev) =>
      prev.map((t) => {
        const row = t.row as any;
        const effectiveKey = tabLabelKey ?? headers[0]?.key;

        const rawLabel =
          effectiveKey && row[effectiveKey] !== undefined
            ? row[effectiveKey]
            : t.id;

        const label =
          typeof rawLabel === "string" || typeof rawLabel === "number"
            ? String(rawLabel)
            : `Row ${t.rowIndex + 1}`;

        return { ...t, label };
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabLabelKey, headers]);

  // Row click: toggle its tab (open if closed, close if open)
  const handleRowClick = (row: RowType, index: number) => {
    const id = getRowId ? getRowId(row, index) : index;

    setTabs((prev) => {
      const existsIndex = prev.findIndex((t) => t.id === id);

      // If tab already exists → close it
      if (existsIndex !== -1) {
        const next = [...prev];
        next.splice(existsIndex, 1);
        return next;
      }

      // Else, open new tab using current labelColumnKey
      const rawLabel =
        labelColumnKey && (row as any)[labelColumnKey] !== undefined
          ? (row as any)[labelColumnKey]
          : id;

      const label =
        typeof rawLabel === "string" || typeof rawLabel === "number"
          ? String(rawLabel)
          : `Row ${index + 1}`;

      const next = [...prev, { id, label, row, rowIndex: index }];
      onRowOpenInTab?.(row);
      return next;
    });
  };

  const handleCloseTab = (id: string | number) => {
    setTabs((prev) => prev.filter((t) => t.id !== id));
  };

  const isRowSelected = (row: RowType, index: number) => {
    const id = getRowId ? getRowId(row, index) : index;
    return tabs.some((t) => t.id === id);
  };

  const handleReorderTabs = (fromIndex: number, toIndex: number) => {
    setTabs((prev) => {
      if (
        fromIndex < 0 ||
        fromIndex >= prev.length ||
        toIndex < 0 ||
        toIndex >= prev.length
      ) {
        return prev;
      }
      if (fromIndex === toIndex) return prev;

      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  };

  // Adapt internal selected tabs into TabbedInterface's expected shape
  const tabbedInterfaceTabs = tabs.map((t) => ({
    label: t.label,
    content: (
      <div className="space-y-4">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => handleCloseTab(t.id)}
            className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200"
          >
            <XMarkIcon className="h-3 w-3" />
            <span>Close tab</span>
          </button>
        </div>

        {renderTabContent ? (
          renderTabContent(t.row)
        ) : (
          <DefaultTabContent<RowType> headers={headers} row={t.row} />
        )}
      </div>
    ),
  }));

  // Respect user’s setting for header close icon, but default to true
  const effectiveShowHeaderClose =
    tabProps?.showTabCloseIconInHeader ?? true;

  return (
    <div
      className={cn(
        "w-full rounded-xl border border-slate-200 bg-white p-6 shadow-sm",
        className
      )}
    >
      {(title || description) && (
        <header className="mb-4">
          {title && (
            <h2
              className={cn(
                "text-xl font-semibold text-slate-900",
                sectionTitleFontClass
              )}
            >
              {title}
            </h2>
          )}
          {description && (
            <p
              className={cn(
                "mt-1 text-sm text-slate-500",
                sectionDescriptionFontClass
              )}
            >
              {description}
            </p>
          )}
        </header>
      )}

      {/* Clickable Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200">
        <table className="min-w-full border-collapse text-sm">
          <thead className="bg-gradient-to-r from-[#1761A3] to-[#4DAF83]">
            <tr>
              {headers.map((header) => (
                <th
                  key={header.key}
                  className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-white"
                >
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white">
            {data.length === 0 && (
              <tr>
                <td
                  colSpan={headers.length}
                  className="px-4 py-6 text-center text-sm text-slate-500"
                >
                  No records to display.
                </td>
              </tr>
            )}

            {data.map((row, index) => {
              const selected = isRowSelected(row, index);
              const rowId = getRowId ? getRowId(row, index) : index;

              return (
                <tr
                  key={String(rowId)}
                  onClick={() => handleRowClick(row, index)}
                  className={cn(
                    "cursor-pointer border-b border-slate-100 transition-colors hover:bg-slate-50",
                    selected && "bg-blue-50/70"
                  )}
                >
                  {headers.map((header) => (
                    <td
                      key={header.key}
                      className="px-3 py-2 align-middle text-slate-800"
                    >
                      {renderCellValue((row as any)[header.key])}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Tabs below table */}
      {tabs.length > 0 && (
        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Open Rows ({tabs.length})
            </h3>
            {rearrange && (
              <p className="text-xs text-slate-500">
                Drag the tab headers to change their order. Clicking a row
                again will close its tab.
              </p>
            )}
          </div>

          <TabbedInterface
            // allow all stylistic props from parent
            {...tabProps}
            // but we always control the logical behavior
            tabs={tabbedInterfaceTabs}
            draggableTabs={rearrange}
            onReorderTabs={rearrange ? handleReorderTabs : undefined}
            showTabCloseIconInHeader={effectiveShowHeaderClose}
            onCloseTab={(index) => {
              const target = tabs[index];
              if (!target) return;
              handleCloseTab(target.id);
            }}
          />
        </div>
      )}
    </div>
  );
}

export default TableWithTab;


// TableWithTab.displayName = "TableWithTab";
// export {TableWithTab};
