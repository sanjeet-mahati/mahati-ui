"use client";

import React, { useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

import { Table } from "./Table";
import { TabbedInterface } from "./TabedInterface";

type BaseTableProps = React.ComponentProps<typeof Table>;
type BaseTabProps = React.ComponentProps<typeof TabbedInterface>;

type AllowedTabProps = Omit<
  BaseTabProps,
  "tabs" | "onTabChange" | "draggableTabs" | "onReorderTabs" | "onCloseTab"
>;

export interface TableWithTabProps<RowType extends Record<string, any>> {
  tableProps: Pick<BaseTableProps, "headers" | "data">;
  tabProps?: AllowedTabProps;
  rearrange?: boolean;
  getRowId?: (row: RowType, index: number) => string | number;
  renderTabContent?: (row: RowType) => React.ReactNode;
  onRowOpenInTab?: (row: RowType) => void;
  title?: string;
  description?: string;
  testId?: string;
  tabLabelKey?: string;
  sectionTitleFont?: string;
  sectionDescriptionFont?: string;
}

const getFontFamily = (font?: string): string => {
  if (!font)
    return "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

  const lower = font.toLowerCase().trim();

  if (lower === "sans" || lower === "sans-serif")
    return "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  if (lower === "serif") return "Georgia, 'Times New Roman', serif";
  if (lower === "mono" || lower === "monospace")
    return "'Courier New', Courier, monospace";
  if (lower === "poppins") return "'Poppins', sans-serif";

  return `'${font}', sans-serif`;
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
    return <span className="text-slate-300">-</span>;
  }

  if (Array.isArray(value)) {
    if (value.some((v) => React.isValidElement(v))) return <>{value}</>;
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
    <div className="flex flex-col gap-2">
      {headers.map((h) => (
        <div
          key={h.key}
          className="flex flex-col sm:flex-row sm:items-center gap-1 rounded-lg bg-white p-3 text-sm shadow-sm"
        >
          <span className="w-full sm:w-48 text-xs font-semibold uppercase tracking-wide text-slate-500">
            {h.label as any}
          </span>

          <span className="flex-1 break-words text-slate-800">
            {renderCellValue((row as any)[h.key]) as any}
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
  title,
  description,
  tabLabelKey,
  sectionTitleFont,
  sectionDescriptionFont,
  testId,
}: TableWithTabProps<RowType>) {
  const { headers, data } = tableProps;

  const [tabs, setTabs] = useState<SelectedTab<RowType>[]>([]);

  const labelColumnKey = tabLabelKey ?? headers[0]?.key;

  const sectionTitleFontFamily = getFontFamily(sectionTitleFont);
  const sectionDescriptionFontFamily = getFontFamily(sectionDescriptionFont);

  useEffect(() => {
    if (!tabs.length) return;

    setTabs((prev) =>
      prev.map((t) => {
        const row = t.row as any;

        const rawLabel =
          labelColumnKey && row[labelColumnKey] !== undefined
            ? row[labelColumnKey]
            : t.id;

        const label =
          typeof rawLabel === "string" || typeof rawLabel === "number"
            ? String(rawLabel)
            : `Row ${t.rowIndex + 1}`;

        return { ...t, label };
      })
    );
  }, [tabLabelKey, headers]);

  const handleRowClick = (row: RowType, index: number) => {
    const id = getRowId ? getRowId(row, index) : index;

    setTabs((prev) => {
      const existsIndex = prev.findIndex((t) => t.id === id);

      if (existsIndex !== -1) {
        const next = [...prev];
        next.splice(existsIndex, 1);
        return next;
      }

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
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  };

  const tabbedInterfaceTabs = tabs.map((t) => ({
    label: t.label,
    content: (
      <div className="flex flex-col gap-4">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => handleCloseTab(t.id)}
            className="inline-flex items-center gap-1 rounded-full bg-[#f1f5f9] px-3 py-1 text-xs font-medium text-[#334155] transition-colors hover:bg-[#e2e8f0]"
          >
            <XMarkIcon className="h-3 w-3" />
            <span>Close tab</span>
          </button>
        </div>

        {(renderTabContent ? (
          renderTabContent(t.row)
        ) : (
          <DefaultTabContent<RowType> headers={headers} row={t.row} />
        )) as any}
      </div>
    ),
  }));

  const effectiveShowHeaderClose =
    tabProps?.showTabCloseIconInHeader ?? true;

  return (
    <div
      data-testid={testId}
      className="w-full rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      {(title || description) && (
        <div className="mb-4">
          {title && (
            <h2
              className="text-xl font-semibold text-slate-900"
              style={{ fontFamily: sectionTitleFontFamily }}
            >
              {title}
            </h2>
          )}

          {description && (
            <p
              className="mt-1 text-sm text-slate-500"
              style={{ fontFamily: sectionDescriptionFontFamily }}
            >
              {description}
            </p>
          )}
        </div>
      )}

      <div className="overflow-x-auto w-full rounded-xl border border-slate-200">
        <div className="min-w-[900px]">
          <table className="min-w-full border-collapse text-sm">
            <thead className="bg-gradient-to-r from-[#1761A3] to-[#4DAF83]">
              <tr>
                {headers.map((header) => (
                  <th
                    key={header.key}
                    className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-white"
                  >
                    {header.label as any}
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
                const selected = isRowSelected(row as RowType, index);

                const rowId = getRowId
                  ? getRowId(row as RowType, index)
                  : index;

                return (
                  <tr
                    key={String(rowId)}
                    onClick={() => handleRowClick(row as RowType, index)}
                    className={`cursor-pointer border-b border-slate-100 transition hover:bg-slate-50 ${
                      selected ? "bg-blue-100/70" : ""
                    }`}
                  >
                    {headers.map((header) => (
                      <td
                        key={header.key}
                        className="px-3 py-2 text-slate-800"
                      >
                        {renderCellValue(
                          (row as any)[header.key]
                        ) as any}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {tabs.length > 0 && (
        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Open Rows ({tabs.length})
            </h3>

            {rearrange && (
              <p className="text-xs text-slate-500">
                Drag the tab headers to change their order.
              </p>
            )}
          </div>

          <TabbedInterface
            {...tabProps}
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

TableWithTab.displayName = "TableWithTab";

export { TableWithTab };