"use client";

import React, { useState } from "react";
import {
  ArrowDownOnSquareIcon,
  ArrowPathIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import styled from '@emotion/styled';
import { css } from '@emotion/react';

interface TableProps {
  headers: { label: React.ReactNode; key: string }[];
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
  summary?: "single" | "multi";
  summaryKey?: string;
  summaryTitleField?: string;

  // SUMMARY COLUMN (truncated summary text in a dedicated column)
  summaryColumn?: boolean;
  summaryColumnKey?: string;
  summaryColumnMaxLength?: number;

  // GENERIC TEXT WRAP ON MULTIPLE COLUMNS
  textWrapColumns?: string[];
  textWrapMaxLength?: number;
  textWrapColumnMaxLengths?: Record<string, number>;
}

// Styled Components
const TableContainer = styled.div`
  margin-top: 0.25rem;
  overflow: hidden;
  border-radius: 0.75rem;
  border: 1px solid #1761A3;
  background-color: white;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background: linear-gradient(to right, #1e73be, #28a97d);
`;

const TableHeaderRow = styled.tr``;

const TableHeader = styled.th<{ isFirst?: boolean; isLast?: boolean }>`
  height: 50px;
  padding: 0.5rem 0.75rem;
  text-align: left;
  font-size: 0.875rem;
  font-weight: 700;
  color: white;
  
  ${props => props.isFirst && css`
    border-top-left-radius: 0.75rem;
  `}
  
  ${props => props.isLast && css`
    border-top-right-radius: 0.75rem;
  `}
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr<{ 
  isExpandable?: boolean; 
  isExpanded?: boolean;
  highlightColor?: string;
}>`
  height: 57px;
  border-bottom: 1px solid #e2e8f0;
  font-size: 0.875rem;
  color: #0f172a;
  
  &:nth-of-type(even) {
    background-color: #f8fafc;
  }
  
  &:hover {
    background-color: #f1f5f9;
  }
  
  ${props => props.isExpandable && css`
    cursor: pointer;
    transition: background-color 0.2s ease;
  `}
  
  ${props => props.isExpanded && css`
    background-color: rgba(30, 190, 145, 0.38) !important;
  `}
  
  ${props => props.highlightColor && css`
    background-color: ${props.highlightColor};
  `}
`;

const TableCell = styled.td`
  padding: 0.5rem 0.75rem;
`;

const TruncatedText = styled.div`
  font-size: 0.875rem;
  line-height: 1.625;
  color: #475569;
  word-break: break-word;
  white-space: normal;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const SummaryRow = styled.tr`
  border-bottom: 1px solid #bfdbfe;
`;

const SummaryCell = styled.td`
  background: linear-gradient(to right, rgba(239, 246, 255, 0.5), rgba(219, 234, 254, 0.5));
  padding: 1rem 0.75rem;
`;

const SummaryContent = styled.div`
  display: flex;
  align-items: start;
  gap: 0.75rem;
`;

const SummaryInner = styled.div`
  flex: 1;
`;

const SummaryHeader = styled.div`
  margin-bottom: 0.5rem;
  display: flex;
  align-items: start;
  justify-content: space-between;
`;

const SummaryTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
`;

const SummaryCloseButton = styled.button`
  margin-left: 0.5rem;
  height: 1.5rem;
  width: 1.5rem;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #bfdbfe;
  }
`;

const SummaryText = styled.p`
  font-size: 0.875rem;
  line-height: 1.625;
  color: #475569;
  margin: 0;
`;

const EmptyRow = styled.tr``;

const EmptyCell = styled.td`
  padding: 1.5rem 1rem;
  text-align: center;
  color: #64748b;
`;

const EmptyContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

const ControlsWrapper = styled.div`
  margin-bottom: 0.75rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
`;

const SearchControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SearchInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  width: 14rem;
  border-radius: 0.5rem;
  border: 1px solid transparent;
  background-color: white;
  padding: 0.5rem 0.75rem;
  padding-right: 2rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #1761A3;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  outline: none;
  ring: 1px solid transparent;
  transition: all 0.2s ease;
  
  &:focus {
    border-color: transparent;
    ring: 2px solid #10b981;
  }
  
  &::placeholder {
    color: #94a3b8;
  }
`;

const ClearButton = styled.button`
  position: absolute;
  right: 0.5rem;
  height: 1.5rem;
  width: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  background: transparent;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f1f5f9;
    color: #334155;
  }
`;

const SearchModeSelect = styled.select`
  border-radius: 0.5rem;
  border: 1px solid transparent;
  background-color: white;
  padding: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #334155;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  outline: none;
  ring: 1px solid transparent;
  transition: all 0.2s ease;
  cursor: pointer;
  
  &:hover {
    background-color: #f8fafc;
  }
  
  &:focus {
    border-color: transparent;
    ring: 2px solid #10b981;
  }
`;

const DownloadButtons = styled.div`
  margin-top: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const DownloadButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: white;
  background: linear-gradient(to right, #1e73be, #28a97d);
  border: none;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: opacity 0.2s ease;
  
  &:hover {
    opacity: 0.9;
  }
`;

const PaginationWrapper = styled.div<{ align: string }>`
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  display: flex;
  width: 100%;
  
  ${props => {
    if (props.align.includes('left')) return css`justify-content: flex-start;`;
    if (props.align.includes('right')) return css`justify-content: flex-end;`;
    return css`justify-content: center;`;
  }}
`;

const PaginationControls = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const PaginationButton = styled.button<{ isActive?: boolean; disabled?: boolean }>`
  display: inline-flex;
  align-items: center;
  border-radius: 0.375rem;
  padding: 0.25rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: white;
  background: ${props => props.isActive || props.disabled 
    ? '#ccc' 
    : 'linear-gradient(to right, #1e73be, #28a97d)'};
  border: none;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.5 : 1};
  transition: opacity 0.2s ease;
  
  &:hover:not(:disabled) {
    opacity: 0.9;
  }
`;

const PaginationEllipsis = styled.span`
  padding: 0 0.25rem;
  font-size: 0.875rem;
  color: #64748b;
`;

const LimitSelect = styled.select`
  margin-left: 0.5rem;
  border-radius: 0.375rem;
  border: 1px solid #cbd5e1;
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  color: #334155;
  cursor: pointer;
  
  &:focus {
    outline: none;
    ring: 2px solid #10b981;
  }
`;

const PaginationInfo = styled.span`
  margin-left: 0.5rem;
  font-size: 0.75rem;
  color: #475569;
`;

const ResetButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: white;
  background: linear-gradient(to right, #1e73be, #28a97d);
  border: none;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: opacity 0.2s ease;
  
  &:hover {
    opacity: 0.9;
  }
`;

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
      <PaginationButton
        key={1}
        onClick={() => goToPage(1)}
        disabled={currentPage === 1}
        isActive={currentPage === 1}
      >
        1
      </PaginationButton>
    );

    if (currentPage > siblings + 2) {
      pages.push(
        <PaginationEllipsis key="start-ellipsis">...</PaginationEllipsis>
      );
    }

    const start = Math.max(2, currentPage - siblings);
    const end = Math.min(totalPages - 1, currentPage + siblings);

    for (let i = start; i <= end; i++) {
      pages.push(
        <PaginationButton
          key={i}
          onClick={() => goToPage(i)}
          disabled={currentPage === i}
          isActive={currentPage === i}
        >
          {i}
        </PaginationButton>
      );
    }

    if (currentPage < totalPages - siblings - 1) {
      pages.push(
        <PaginationEllipsis key="end-ellipsis">...</PaginationEllipsis>
      );
    }

    if (totalPages > 1) {
      pages.push(
        <PaginationButton
          key={totalPages}
          onClick={() => goToPage(totalPages)}
          disabled={currentPage === totalPages}
          isActive={currentPage === totalPages}
        >
          {totalPages}
        </PaginationButton>
      );
    }

    return pages;
  };

  const renderPagination = () => {
    if (!isPaginated) return null;

    const align = paginationPosition.includes("left")
      ? "left"
      : paginationPosition.includes("right")
      ? "right"
      : "center";

    return (
      <PaginationWrapper align={align}>
        <PaginationControls>
          <PaginationButton
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </PaginationButton>

          {renderPageNumbers()}

          <PaginationButton
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </PaginationButton>

          <LimitSelect
            value={limit}
            onChange={(e) => {
              setPage?.(1);
              setLimit?.(Number(e.target.value));
            }}
          >
            {[5, 10, 15].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </LimitSelect>

          <PaginationInfo>
            Page {currentPage} of {totalPages} (Total: {totalCount} items)
          </PaginationInfo>
        </PaginationControls>
      </PaginationWrapper>
    );
  };

  const summaryColKeyToUse = summaryColumnKey || summaryKey;

  return (
    <>
      {(searchable || onDownloadExcel || onDownloadPDF) && (
        <ControlsWrapper>
          {searchable && (
            <SearchControls>
              <SearchInputWrapper>
                <SearchInput
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={handleChange}
                />
                {searchTerm && (
                  <ClearButton
                    onClick={onResetSearch}
                    aria-label="Clear search"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </ClearButton>
                )}
              </SearchInputWrapper>
              <SearchModeSelect
                value={searchMode}
                onChange={(e) =>
                  setSearchMode(e.target.value as "startsWith" | "includes")
                }
              >
                {searchModeOptions.map((mode) => (
                  <option key={mode} value={mode}>
                    {mode === "startsWith" ? "Starts With" : "Includes"}
                  </option>
                ))}
              </SearchModeSelect>
            </SearchControls>
          )}

          {(onDownloadPDF || onDownloadExcel) && (
            <DownloadButtons>
              {onDownloadPDF && (
                <DownloadButton onClick={() => onDownloadPDF(data, headers)}>
                  <ArrowDownOnSquareIcon className="h-5 w-5" />
                </DownloadButton>
              )}
              {onDownloadExcel && (
                <DownloadButton onClick={() => onDownloadExcel(data, headers)}>
                  <ArrowDownOnSquareIcon className="h-5 w-5" />
                  <span>Excel</span>
                </DownloadButton>
              )}
            </DownloadButtons>
          )}
        </ControlsWrapper>
      )}

      {paginationPosition.startsWith("top") &&
        data.length > 0 &&
        renderPagination()}

      <TableContainer>
        <StyledTable>
          <TableHead>
            <TableHeaderRow>
              {headers.map((header, idx) => (
                <TableHeader
                  key={idx}
                  isFirst={idx === 0}
                  isLast={!actions && idx === headers.length - 1}
                >
                  {header.label}
                </TableHeader>
              ))}
              {actions && (
                <TableHeader isLast={true}>Actions</TableHeader>
              )}
            </TableHeaderRow>
          </TableHead>

          <TableBody>
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
                    <TableRow
                      onClick={isExpandable ? handleRowClick : undefined}
                      isExpandable={isExpandable}
                      isExpanded={isExpanded}
                      highlightColor={highlightRowColor}
                    >
                      {headers.map((header, cellIdx) => (
                        <TableCell key={cellIdx}>
                          {(() => {
                            const value = row[header.key];

                            // Summary column handling
                            if (
                              summaryColumn &&
                              header.key === summaryColKeyToUse
                            ) {
                              if (value == null) return "-";

                              if (React.isValidElement(value)) {
                                return <TruncatedText>{value}</TruncatedText>;
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
                                  : fullText.substring(0, maxLen).trim() + "...";

                              return (
                                <TruncatedText title={fullText}>
                                  {truncated}
                                </TruncatedText>
                              );
                            }

                            // Generic text wrap handling
                            if (
                              textWrapColumns &&
                              textWrapColumns.includes(header.key)
                            ) {
                              if (value == null) return "-";

                              if (React.isValidElement(value)) {
                                return <TruncatedText>{value}</TruncatedText>;
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

                              const maxLen = perColMax ?? textWrapMaxLength;

                              const truncated =
                                fullText.length <= maxLen
                                  ? fullText
                                  : fullText.substring(0, maxLen).trim() + "...";

                              return (
                                <TruncatedText title={fullText}>
                                  {truncated}
                                </TruncatedText>
                              );
                            }

                            // Normal rendering
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
                                value.some((item) => React.isValidElement(item))
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
                        </TableCell>
                      ))}
                      {actions && <TableCell>{actions(row)}</TableCell>}
                    </TableRow>

                    {isExpandable && isExpanded && (
                      <SummaryRow>
                        <SummaryCell colSpan={headers.length + (actions ? 1 : 0)}>
                          <SummaryContent>
                            <SummaryInner>
                              <SummaryHeader>
                                <SummaryTitle>
                                  {titleValue
                                    ? `Summary for ${String(titleValue)}`
                                    : "Summary"}
                                </SummaryTitle>
                                <SummaryCloseButton
                                  onClick={handleCloseDrawer}
                                  aria-label="Close summary"
                                >
                                  <XMarkIcon className="h-4 w-4 text-slate-600" />
                                </SummaryCloseButton>
                              </SummaryHeader>
                              <SummaryText>
                                {summaryValue == null
                                  ? "-"
                                  : React.isValidElement(summaryValue)
                                  ? summaryValue
                                  : typeof summaryValue === "string"
                                  ? summaryValue
                                  : typeof summaryValue === "object"
                                  ? JSON.stringify(summaryValue)
                                  : String(summaryValue)}
                              </SummaryText>
                            </SummaryInner>
                          </SummaryContent>
                        </SummaryCell>
                      </SummaryRow>
                    )}
                  </React.Fragment>
                );
              })
            ) : (
              <EmptyRow>
                <EmptyCell colSpan={headers.length + (actions ? 1 : 0)}>
                  <EmptyContent>
                    <span>No records found.</span>
                    {onResetSearch && (
                      <ResetButton onClick={onResetSearch}>
                        <span>Reset</span>
                        <ArrowPathIcon className="h-5 w-5" />
                      </ResetButton>
                    )}
                  </EmptyContent>
                </EmptyCell>
              </EmptyRow>
            )}
          </TableBody>
        </StyledTable>
      </TableContainer>

      {paginationPosition.startsWith("bottom") &&
        data.length > 0 &&
        renderPagination()}
    </>
  );
};

Table.displayName = "Table";
export { Table };
