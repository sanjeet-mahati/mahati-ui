"use client";

import React, { useState } from "react";
import {
  ArrowDownOnSquareIcon,
  ArrowPathIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface TableProps {
  headers: { label: React.ReactNode; key: string }[];
  data: { [key: string]: unknown }[];

  tableTestId?: string;

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

  highlightRowColor?: string;
  actions?: (row: unknown) => React.ReactNode;

  onDownloadPDF?: (data: any[], headers: any[]) => void;
  onDownloadExcel?: (data: any[], headers: any[]) => void;

  searchable?: boolean;
  searchTerm?: string;
  onSearch?: (term: string, mode?: "startsWith" | "includes") => void;
  searchModeOptions?: ("startsWith" | "includes")[];
  onResetSearch?: () => void;

  summary?: "single" | "multi";
  summaryKey?: string;
  summaryTitleField?: string;

  summaryColumn?: boolean;
  summaryColumnKey?: string;
  summaryColumnMaxLength?: number;

  textWrapColumns?: string[];
  textWrapMaxLength?: number;
  textWrapColumnMaxLengths?: Record<string, number>;
}

const Table = ({
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
  tableTestId,
}: TableProps) => {
  const [searchMode, setSearchMode] = useState<"startsWith" | "includes">(
    searchModeOptions[0]
  );

  const [expandedRowIndex, setExpandedRowIndex] = useState<number | null>(null);
  const [expandedRowIndexes, setExpandedRowIndexes] = useState<Set<number>>(
    new Set()
  );

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
        className={`px-3 py-1 rounded text-sm font-medium text-white ${
          currentPage === 1
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-gradient-to-r from-[#1e73be] to-[#28a97d]"
        }`}
      >
        1
      </button>
    );

    const start = Math.max(2, currentPage - siblings);
    const end = Math.min(totalPages - 1, currentPage + siblings);

    if (start > 2) pages.push(<span key="s">...</span>);

    for (let i = start; i <= end; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          disabled={currentPage === i}
          className={`px-3 py-1 rounded text-sm font-medium text-white ${
            currentPage === i
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-gradient-to-r from-[#1e73be] to-[#28a97d]"
          }`}
        >
          {i}
        </button>
      );
    }

    if (end < totalPages - 1) pages.push(<span key="e">...</span>);

    if (totalPages > 1) {
      pages.push(
        <button
          key={totalPages}
          onClick={() => goToPage(totalPages)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded text-sm font-medium text-white ${
            currentPage === totalPages
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-gradient-to-r from-[#1e73be] to-[#28a97d]"
          }`}
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  const summaryColKeyToUse = summaryColumnKey || summaryKey;

  const renderCell = (value: any, key: string) => {
    if (value == null) return "-";

    if (React.isValidElement(value)) return value;

    if (typeof value === "boolean") return value ? "Yes" : "No";

    if (value instanceof Date) return value.toLocaleString();

    if (Array.isArray(value)) {
      if (value.some((item) => React.isValidElement(item))) return <>{value}</>;
      return value.join(", ");
    }

    if (typeof value === "object") return JSON.stringify(value);

    if (typeof value === "string") {
      if (textWrapColumns?.includes(key)) {
        const max =
          textWrapColumnMaxLengths?.[key] ?? textWrapMaxLength ?? 120;
        const truncated =
          value.length <= max ? value : value.substring(0, max) + "...";

        return (
          <div
            className="text-sm text-slate-600 line-clamp-2"
            title={value}
          >
            {truncated}
          </div>
        );
      }
    }

    return String(value);
  };

  return (
    <>
      {/* Controls */}
      {(searchable || onDownloadExcel || onDownloadPDF) && (
        <div className="mb-3 flex flex-wrap justify-between gap-3">

          {searchable && (
            <div className="flex items-center gap-2">
              <div className="relative">

                <input
                  value={searchTerm}
                  onChange={handleChange}
                  placeholder="Search..."
                  className="w-56 rounded-lg px-3 py-2 pr-8 text-sm text-[#1761A3] shadow focus:ring-2 focus:ring-emerald-500"
                />

                {searchTerm && (
                  <button
                    onClick={onResetSearch}
                    className="absolute right-2 top-2"
                  >
                    <XMarkIcon className="h-4 w-4"/>
                  </button>
                )}

              </div>

              <select
                value={searchMode}
                onChange={(e)=>setSearchMode(e.target.value as any)}
                className="rounded-lg px-2 py-2 text-sm shadow"
              >
                {searchModeOptions.map(mode=>(
                  <option key={mode} value={mode}>
                    {mode==="startsWith" ? "Starts With":"Includes"}
                  </option>
                ))}
              </select>

            </div>
          )}

          {(onDownloadPDF || onDownloadExcel) && (
            <div className="flex gap-2">

              {onDownloadPDF && (
                <button
                  onClick={()=>onDownloadPDF(data,headers)}
                  className="px-3 py-2 text-white rounded bg-gradient-to-r from-[#1e73be] to-[#28a97d]"
                >
                  <ArrowDownOnSquareIcon className="h-5 w-5"/>
                </button>
              )}

              {onDownloadExcel && (
                <button
                  onClick={()=>onDownloadExcel(data,headers)}
                  className="px-3 py-2 text-white rounded bg-gradient-to-r from-[#1e73be] to-[#28a97d]"
                >
                  Excel
                </button>
              )}

            </div>
          )}

        </div>
      )}

      {/* Table */}
      <div
        className="overflow-x-auto rounded-xl border border-[#1761A3] bg-white"
        data-testid={tableTestId}
      >

        <table className="w-full min-w-[900px] table-fixed">

          <thead className="bg-gradient-to-r from-[#1e73be] to-[#28a97d]">
            <tr>

              {headers.map((header,idx)=>(
                <th
                  key={idx}
                  className=" h-[50px] px-3 py-2 text-left text-sm font-bold text-white"
                >
                  {header.label}
                </th>
              ))}

              {actions && (
                <th className="px-3 py-2 text-white font-bold">
                  Actions
                </th>
              )}

            </tr>
          </thead>

          <tbody>

            {data.length>0 ? data.map((row,rowIndex)=>{

              const isExpanded =
                summary==="single"
                  ? expandedRowIndex===rowIndex
                  : expandedRowIndexes.has(rowIndex);

              const toggleRow=()=>{
                if(!summary) return;

                if(summary==="single"){
                  setExpandedRowIndex(prev=>prev===rowIndex?null:rowIndex)
                }else{
                  setExpandedRowIndexes(prev=>{
                    const next=new Set(prev)
                    next.has(rowIndex)?next.delete(rowIndex):next.add(rowIndex)
                    return next
                  })
                }
              }

              return(
                <React.Fragment key={rowIndex}>

                  <tr
                    onClick={toggleRow}
                    className=" h-[57px] border-b even:bg-slate-50 hover:bg-slate-100"
                    style={highlightRowColor?{backgroundColor:highlightRowColor}:undefined}
                  >

                    {headers.map((header,i)=>(
                      <td key={i} className="px-3 py-2 text-sm whitespace-nowrap overflow-hidden text-ellipsis max-w-[1px] break-words">
                        {renderCell(row[header.key],header.key)}
                      </td>
                    ))}

                    {actions && (
                      <td className="px-3 py-2 text-center">
                        {actions(row)}
                      </td>
                    )}

                  </tr>

                  {summary && isExpanded && (
                    <tr>

                      <td colSpan={headers.length+(actions?1:0)}
                      className="px-4 py-4 bg-gradient-to-r from-[rgba(239,246,255,0.5)] to-[rgba(219,234,254,0.5)]">

                        {(row as any)[summaryKey]}

                      </td>

                    </tr>
                  )}

                </React.Fragment>
              )

            }):(

              <tr>
                <td
                  colSpan={headers.length+(actions?1:0)}
                  className="text-center py-6 text-slate-500"
                >
                  No records found
                </td>
              </tr>

            )}

          </tbody>

        </table>


      </div>

{paginationRequired && totalPages > 1 && (
  <div className="flex justify-center mt-3 gap-2 items-center">

    <button
      onClick={() => goToPage(currentPage - 1)}
      disabled={currentPage === 1}
      className="px-3 py-1 rounded text-white text-sm bg-gradient-to-r from-[#1e73be] to-[#28a97d] disabled:bg-gray-300"
    >
      Previous
    </button>

    {renderPageNumbers()}

    <button
      onClick={() => goToPage(currentPage + 1)}
      disabled={currentPage === totalPages}
      className="px-3 py-1 rounded text-white text-sm bg-gradient-to-r from-[#1e73be] to-[#28a97d] disabled:bg-gray-300"
    >
      Next
    </button>

  </div>
)}
    </>
  )
};

export { Table };