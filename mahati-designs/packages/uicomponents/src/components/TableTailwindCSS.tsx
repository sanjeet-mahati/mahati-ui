"use client";

import React, { useState } from "react";
import {
  ArrowDownOnSquareIcon,
  ArrowPathIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface TableProps {
  headers: { label: string; key: string }[];
  data: { [key: string]: unknown }[];

  // Pagination
  page?: number;
  setPage?: (page: number) => void;
  limit?: number;
  setLimit?: (limit: number) => void;
  totalCount?: number;
  paginationRequired?: boolean;
  paginationPosition?:
    | "top-left"
    | "top-center"
    | "top-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right";

  // Row styling & actions
  highlightRowColor?: string;
  actions?: (row: unknown) => React.ReactNode;

  // Downloads
  onDownloadPDF?: (data: any[], headers: any[]) => void;
  onDownloadExcel?: (data: any[], headers: any[]) => void;

  // Search
  searchable?: boolean;
  searchTerm?: string;
  onSearch?: (term: string, mode?: "startsWith" | "includes") => void;
  searchModeOptions?: ("startsWith" | "includes")[];
  onResetSearch?: () => void;

  // SUMMARY DRAWER (row-expanding)
  /**
   * summary = "single"  => only one row summary open at a time
   * summary = "multi"   => multiple rows can be expanded
   * undefined / omitted => no summary drawers
   */
  summary?: "single" | "multi";
  /** which key in data row contains the summary text/content (default: "summary") */
  summaryKey?: string;
  /** which key in data row contains title field, e.g. name (default: "name") */
  summaryTitleField?: string;

  // SUMMARY COLUMN (truncated summary text in a dedicated column)
  /**
   * When true, any cell whose header.key === (summaryColumnKey || summaryKey)
   * will be rendered as a truncated summary column with ellipsis and hover full text.
   */
  summaryColumn?: boolean;
  /** Key to treat as summary column; falls back to summaryKey if not provided */
  summaryColumnKey?: string;
  /** Max length before truncating summary column text (default: 120) */
  summaryColumnMaxLength?: number;

  // GENERIC TEXT WRAP ON MULTIPLE COLUMNS
  /**
   * Keys of columns where text should be truncated with ellipsis and show full text on hover.
   * Example: ["summary"] or ["email", "summary", "createdAt"]
   */
  textWrapColumns?: string[];
  /** Global default max length for truncated text (for textWrapColumns) */
  textWrapMaxLength?: number;
  /**
   * Per-column max length overrides for textWrapColumns (and summary column).
   * Example: { email: 40, summary: 200 }
   */
  textWrapColumnMaxLengths?: Record<string, number>;
}

const Table: React.FC<TableProps> = ({
  headers,
  data,

  page,
  setPage,
  limit,
  setLimit,
  totalCount,
  highlightRowColor,
  actions,
  paginationRequired,
  paginationPosition = "bottom-center",
  onDownloadPDF,
  onDownloadExcel,

  searchable = false,
  searchTerm = "",
  onResetSearch,
  onSearch,
  searchModeOptions = ["includes", "startsWith"],

  summary,
  summaryKey = "summary",
  summaryTitleField = "name",

  summaryColumn = false,
  summaryColumnKey,
  summaryColumnMaxLength = 120,

  textWrapColumns,
  textWrapMaxLength = 120,
  textWrapColumnMaxLengths,
}) => {
  const [searchMode, setSearchMode] = useState<"startsWith" | "includes">(
    searchModeOptions[0]
  );

  // Summary drawer state
  const [expandedRowIndex, setExpandedRowIndex] = useState<number | null>(null); // for "single"
  const [expandedRowIndexes, setExpandedRowIndexes] = useState<Set<number>>(
    new Set()
  ); // for "multi"

  const isPaginated = paginationRequired;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch?.(e.target.value, searchMode);
  };

  const totalPages = isPaginated
    ? Math.max(1, Math.ceil((totalCount || 0) / (limit || 1)))
    : 0;

  const currentPage = isPaginated
    ? typeof page === "number" && page > 0
      ? page
      : 1
    : 1;

  const goToPage = (p: number) => {
    if (!isPaginated) return;
    const clamped = Math.max(1, Math.min(totalPages, p));
    setPage?.(clamped);
  };

  const renderPageNumbers = () => {
    if (!isPaginated || totalPages <= 1) return null;

    const pages: React.ReactNode[] = [];
    const siblings = 1;

    pages.push(
      <button
        key={1}
        onClick={() => goToPage(1)}
        disabled={currentPage === 1}
        className="inline-flex items-center rounded-md px-3 py-1 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
        style={{
          background:
            currentPage === 1
              ? "#ccc"
              : "linear-gradient(to right, #1e73beee, #28a97d)",
        }}
      >
        1
      </button>
    );

    if (currentPage > siblings + 2) {
      pages.push(
        <span key="start-ellipsis" className="px-1 text-sm text-slate-500">
          ...
        </span>
      );
    }

    const start = Math.max(2, currentPage - siblings);
    const end = Math.min(totalPages - 1, currentPage + siblings);

    for (let i = start; i <= end; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          disabled={currentPage === i}
          className="inline-flex items-center rounded-md px-3 py-1 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
          style={{
            background:
              currentPage === i
                ? "#ccc"
                : "linear-gradient(to right, #1e73be, #28a97d)",
          }}
        >
          {i}
        </button>
      );
    }

    if (currentPage < totalPages - siblings - 1) {
      pages.push(
        <span key="end-ellipsis" className="px-1 text-sm text-slate-500">
          ...
        </span>
      );
    }

    if (totalPages > 1) {
      pages.push(
        <button
          key={totalPages}
          onClick={() => goToPage(totalPages)}
          disabled={currentPage === totalPages}
          className="inline-flex items-center rounded-md px-3 py-1 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
          style={{
            background:
              currentPage === totalPages
                ? "#ccc"
                : "linear-gradient(to right, #1e73be, #28a97d)",
          }}
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  const renderPagination = () => {
    if (!isPaginated) return null;

    const align =
      paginationPosition.includes("left")
        ? "justify-start"
        : paginationPosition.includes("right")
        ? "justify-end"
        : "justify-center";

    return (
      <div className={`my-2 flex w-full ${align}`}>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="inline-flex items-center rounded-md px-3 py-1 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              background:
                currentPage === 1
                  ? "#ccc"
                  : "linear-gradient(to right, #1e73be, #28a97d)",
            }}
          >
            Previous
          </button>

          {renderPageNumbers()}

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="inline-flex items-center rounded-md px-3 py-1 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              background:
                currentPage === totalPages
                  ? "#ccc"
                  : "linear-gradient(to right, #1e73be, #28a97d)",
            }}
          >
            Next
          </button>

          <select
            value={limit}
            onChange={(e) => {
              setPage?.(1);
              setLimit?.(Number(e.target.value));
            }}
            className="ml-2 rounded-md border border-slate-300 px-2 py-1 text-sm text-slate-700"
          >
            {[5, 10, 15].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>

          <span className="ml-2 text-xs text-slate-600">
            Page {currentPage} of {totalPages} (Total: {totalCount} items)
          </span>
        </div>
      </div>
    );
  };

  const summaryColKeyToUse = summaryColumnKey || summaryKey;

  return (
    <>
      {(searchable || onDownloadExcel || onDownloadPDF) && (
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          {searchable && (
            <div className="flex items-center gap-2">
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={handleChange}
                  className="w-56 rounded-lg border border-transparent bg-white px-3 py-2 pr-8 text-sm font-medium text-[#1761A3] shadow-sm outline-none ring-1 ring-transparent transition focus:border-transparent focus:ring-2 focus:ring-emerald-400"
                />
                {searchTerm && (
                  <button
                    onClick={onResetSearch}
                    aria-label="Clear search"
                    className="absolute right-2 flex h-6 w-6 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                )}
              </div>
              <select
                value={searchMode}
                onChange={(e) =>
                  setSearchMode(e.target.value as "startsWith" | "includes")
                }
                className="rounded-lg border border-transparent bg-white px-2 py-2 text-sm font-medium text-slate-700 shadow-sm outline-none ring-1 ring-transparent transition hover:bg-slate-50 focus:border-transparent focus:ring-2 focus:ring-emerald-400"
              >
                {searchModeOptions.map((mode) => (
                  <option key={mode} value={mode}>
                    {mode === "startsWith" ? "Starts With" : "Includes"}
                  </option>
                ))}
              </select>
            </div>
          )}

          {(onDownloadPDF || onDownloadExcel) && (
            <div className="mt-1 flex items-center gap-2">
              {onDownloadPDF && (
                <button
                  onClick={() => onDownloadPDF(data, headers)}
                  className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-white shadow-sm hover:opacity-90"
                  style={{
                    background: "linear-gradient(to right, #1e73be, #28a97d)",
                  }}
                >
                  <ArrowDownOnSquareIcon className="h-5 w-5" />
                </button>
              )}
              {onDownloadExcel && (
                <button
                  onClick={() => onDownloadExcel(data, headers)}
                  className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-white shadow-sm hover:opacity-90"
                  style={{
                    background: "linear-gradient(to right, #1e73be, #28a97d)",
                  }}
                >
                  <ArrowDownOnSquareIcon className="h-5 w-5" />
                  <span>Excel</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {paginationPosition.startsWith("top") &&
        data.length > 0 &&
        renderPagination()}

      <div className="mt-1 overflow-hidden rounded-xl border border-[#1761A3] bg-white">
        <table className="w-full border-collapse">
          <thead
            style={{
              background: "linear-gradient(to right, #1e73be, #28a97d)",
            }}
          >
            <tr>
              {headers.map((header, idx) => (
                <th
                  key={idx}
                  className="h-[50px] px-3 py-2 text-left text-sm font-bold text-white first:rounded-tl-xl last:rounded-tr-xl"
                >
                  {header.label}
                </th>
              ))}
              {actions && (
                <th className="h-[50px] px-3 py-2 text-left text-sm font-bold text-white">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {data.length > 0 ? (
              data.map((row, rowIndex) => {
                const isExpandable = !!summary;
                const isExpanded =
                  summary === "single"
                    ? expandedRowIndex === rowIndex
                    : summary === "multi"
                    ? expandedRowIndexes.has(rowIndex)
                    : false;

                const handleRowClick = () => {
                  if (!summary) return;
                  if (summary === "single") {
                    setExpandedRowIndex((prev) =>
                      prev === rowIndex ? null : rowIndex
                    );
                  } else if (summary === "multi") {
                    setExpandedRowIndexes((prev) => {
                      const next = new Set(prev);
                      if (next.has(rowIndex)) {
                        next.delete(rowIndex);
                      } else {
                        next.add(rowIndex);
                      }
                      return next;
                    });
                  }
                };

                const handleCloseDrawer = (e: React.MouseEvent) => {
                  e.stopPropagation();
                  if (summary === "single") {
                    setExpandedRowIndex(null);
                  } else if (summary === "multi") {
                    setExpandedRowIndexes((prev) => {
                      const next = new Set(prev);
                      next.delete(rowIndex);
                      return next;
                    });
                  }
                };

                const titleValue = (row as any)[summaryTitleField];
                const summaryValue = (row as any)[summaryKey];

                return (
                  <React.Fragment key={rowIndex}>
                    <tr
                      onClick={isExpandable ? handleRowClick : undefined}
                      className={`h-[57px] border-b border-slate-200 text-sm text-slate-900 even:bg-slate-50 hover:bg-slate-100 ${
                        isExpandable ? "cursor-pointer transition-colors" : ""
                      } ${highlightRowColor || ""} ${
                        isExpanded ? "bg-[#1e73be80]" : ""
                      }`}
                      style={
                        isExpanded
                          ? {
                              backgroundColor: "rgba(30, 190, 145, 0.38)",
                            }
                          : undefined
                      }
                    >
                      {headers.map((header, cellIdx) => (
                        <td key={cellIdx} className="px-3 py-2">
                          {(() => {
                            const value = row[header.key];

                            // === SUMMARY COLUMN HANDLING (single column) ===
                            if (
                              summaryColumn &&
                              header.key === summaryColKeyToUse
                            ) {
                              if (value == null) {
                                return "-";
                              }

                              if (React.isValidElement(value)) {
                                return (
                                  <div className="text-sm leading-relaxed text-slate-600 break-words whitespace-normal line-clamp-2">
                                    {value}
                                  </div>
                                );
                              }

                              let fullText: string;
                              if (typeof value === "string") {
                                fullText = value;
                              } else if (typeof value === "object") {
                                fullText = JSON.stringify(value);
                              } else {
                                fullText = String(value);
                              }

                              const summaryOverride =
                                textWrapColumnMaxLengths &&
                                textWrapColumnMaxLengths[summaryColKeyToUse];

                              const maxLen =
                                summaryOverride ?? summaryColumnMaxLength;

                              const truncated =
                                fullText.length <= maxLen
                                  ? fullText
                                  : fullText.substring(0, maxLen).trim() +
                                    "...";

                              return (
                                <div
                                  className="text-sm leading-relaxed text-slate-600 break-words whitespace-normal line-clamp-2"
                                  title={fullText}
                                >
                                  {truncated}
                                </div>
                              );
                            }
                            // === END SUMMARY COLUMN HANDLING ===

                            // === GENERIC MULTI-COLUMN TEXT WRAP HANDLING ===
                            if (
                              textWrapColumns &&
                              textWrapColumns.includes(header.key)
                            ) {
                              if (value == null) {
                                return "-";
                              }

                              if (React.isValidElement(value)) {
                                return (
                                  <div className="text-sm leading-relaxed text-slate-600 break-words whitespace-normal line-clamp-2">
                                    {value}
                                  </div>
                                );
                              }

                              let fullText: string;
                              if (typeof value === "string") {
                                fullText = value;
                              } else if (typeof value === "object") {
                                fullText = JSON.stringify(value);
                              } else {
                                fullText = String(value);
                              }

                              const perColMax =
                                textWrapColumnMaxLengths &&
                                textWrapColumnMaxLengths[header.key];

                              const maxLen =
                                perColMax ?? textWrapMaxLength;

                              const truncated =
                                fullText.length <= maxLen
                                  ? fullText
                                  : fullText.substring(0, maxLen).trim() +
                                    "...";

                              return (
                                <div
                                  className="text-sm leading-relaxed text-slate-600 break-words whitespace-normal line-clamp-2"
                                  title={fullText}
                                >
                                  {truncated}
                                </div>
                              );
                            }
                            // === END GENERIC MULTI-COLUMN TEXT WRAP HANDLING ===

                            // Normal rendering branch
                            if (React.isValidElement(value)) return value;

                            if (typeof value === "function") {
                              try {
                                const result = value();
                                if (React.isValidElement(result)) return result;
                              } catch (e) {
                                console.warn(
                                  "Error executing function in table cell:",
                                  e
                                );
                              }
                            }

                            if (
                              typeof value === "string" &&
                              value.trim().startsWith("<") &&
                              value.trim().endsWith(">")
                            ) {
                              return (
                                <span
                                  dangerouslySetInnerHTML={{ __html: value }}
                                />
                              );
                            }

                            if (Array.isArray(value)) {
                              if (
                                value.some((item) =>
                                  React.isValidElement(item)
                                )
                              ) {
                                return <>{value}</>;
                              }
                              return value.join(", ");
                            }

                            if (value instanceof Date)
                              return value.toLocaleString();
                            if (typeof value === "boolean")
                              return value ? "Yes" : "No";
                            if (value === null || value === undefined)
                              return "-";
                            if (typeof value === "number")
                              return value.toString();
                            if (typeof value === "object")
                              return JSON.stringify(value);

                            return String(value);
                          })()}
                        </td>
                      ))}
                      {actions && <td className="px-3 py-2">{actions(row)}</td>}
                    </tr>

                    {isExpandable && isExpanded && (
                      <tr className="border-b border-blue-200">
                        <td
                          colSpan={headers.length + (actions ? 1 : 0)}
                          className="bg-gradient-to-r from-blue-25 to-blue-50 px-3 py-4"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-1">
                              <div className="mb-2 flex items-start justify-between">
                                <h4 className="text-sm font-semibold text-slate-800">
                                  {titleValue
                                    ? `Summary for ${String(titleValue)}`
                                    : "Summary"}
                                </h4>
                                <button
                                  onClick={handleCloseDrawer}
                                  className="ml-2 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full transition-colors hover:bg-blue-200"
                                  aria-label="Close summary"
                                >
                                  <XMarkIcon className="h-4 w-4 text-slate-600" />
                                </button>
                              </div>
                              <p className="text-sm leading-relaxed text-slate-600">
                                {summaryValue == null
                                  ? "-"
                                  : React.isValidElement(summaryValue)
                                  ? summaryValue
                                  : typeof summaryValue === "string"
                                  ? summaryValue
                                  : typeof summaryValue === "object"
                                  ? JSON.stringify(summaryValue)
                                  : String(summaryValue)}
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={headers.length + (actions ? 1 : 0)}
                  className="px-4 py-6 text-center text-slate-500"
                >
                  <div className="flex items-center justify-center gap-4">
                    <span>No records found.</span>
                    {onResetSearch && (
                      <button
                        onClick={onResetSearch}
                        className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-white shadow-sm hover:opacity-90"
                        style={{
                          background: "linear-gradient(to right, #1e73b, #28a97d)",
                        }}
                      >
                        <span>Reset</span>
                        <ArrowPathIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {paginationPosition.startsWith("bottom") &&
        data.length > 0 &&
        renderPagination()}
    </>
  );
};

// export default Table;

// export default Table;

// export default Table;
Table.displayName = "Table";
export {Table};