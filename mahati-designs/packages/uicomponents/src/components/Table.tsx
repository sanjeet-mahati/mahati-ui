"use client";
import React, { useState } from "react";
import styled from "styled-components";
import { ArrowDownOnSquareIcon, ArrowPathIcon, XMarkIcon } from "@heroicons/react/24/outline";

const HEADER_BG = "linear-gradient(to right, #1e73be, #28a97d)";

const TableContainer = styled.div`
  margin-top: 6px;
  border-radius: 10px;
  border: 1px solid #1761A3;
  background: #FFF;
  overflow: hidden;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const StyledThead = styled.thead`
  background: ${HEADER_BG};
`;

const TableHeader = styled.th`
  background: transparent;
  color: #fff;
  font-family: Poppins;
  font-size: 14px;
  font-weight: 700;
  text-align: left;
  height: 50px;
  padding: 10px;

  &:first-child {
    border-top-left-radius: 10px;
  }
  &:last-child {
    border-top-right-radius: 10px;
  }
`;

const TableRow = styled.tr`
  width: 706px;
  height: 57px;
  flex-shrink: 0;
  &:nth-child(even) {
    background-color: #f9f9f9;
  }
  &:hover {
    background-color: #f1f1f1;
  }
`;

const TableData = styled.td`
  padding: 10px;
  border-bottom: 1px solid #ccc;
  color: #000;
  font-family: Poppins;
  font-size: 14px;
  font-weight: 500;
`;

const EmptyState = styled.td`
  text-align: center;
  padding: 20px;
  color: #999;
`;

const PaginationWrapper = styled.div<{ align: "left" | "center" | "right" }>`
  margin: 10px 0;
  display: flex;
  justify-content: ${({ align }) =>
    align === "left" ? "flex-start" : align === "right" ? "flex-end" : "center"};
  width: 100%;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
`;

const PageSizeSelect = styled.select`
  margin-left: 10px;
  padding: 6px;
  border-radius: 4px;
  border: 1px solid #aaa;
`;
const NoDataContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem; /* Adds space between the text and the button */
  padding: 40px;
  color: #666;
  border: 1px dashed #ddd;
  border-radius: 8px;
  margin: 20px 0;
`;

const PageInfoInline = styled.span`
  margin-left: 10px;
  font-size: 13px;
`;

const SearchInput = styled.input`
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid transparent;
  background: linear-gradient(white, white) padding-box,
              linear-gradient(to right, #1e73be, #28a97d) border-box;
  color: #1761A3;
  font-size: 14px;
  font-family: Poppins;
  width: 220px;
  transition: all 0.2s ease;

  &::placeholder {
    color: #999;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 6px rgba(40, 169, 125, 0.4);
  }
`;

const SearchSelect = styled.select`
  padding: 6px 8px;
  border-radius: 6px;
  border: 1px solid transparent;
  background: linear-gradient(white, white) padding-box,
              linear-gradient(to right, #1e73be, #28a97d) border-box;
  font-size: 14px;
  font-family: Poppins;
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    box-shadow: 0 0 6px rgba(40, 169, 125, 0.4);
  }
`;

const SearchInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const ClearButton = styled.button`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  padding: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  border-radius: 50%;
  transition: color 0.2s, background-color 0.2s;

  &:hover {
    color: #333;
    background-color: #f1f1f1;
  }
`;

const PageButton = styled.button`
  background: linear-gradient(to right, #1e73be, #28a97d);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-family: Poppins;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const TopControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  flex-wrap: wrap;
  gap: 10px;
`;

const SearchGroup = styled.div`
  display: flex;
  align-items: center;
  margin-top: 6px;
  gap: 6px;
`;

const ButtonGroup = styled.div`
  display: flex;
  padding-top: 6px;
  margin-top: 6px;
  gap: 8px;
`;

interface TableProps {
  headers: { label: string; key: string }[];
  data: { [key: string]: unknown }[];
  page?: number;
  setPage?: (page: number) => void;
  limit?: number;
  setLimit?: (limit: number) => void;
  totalCount?: number;
  highlightRowColor?: string;
  actions?: (row: unknown) => React.ReactNode;
  paginationRequired?: boolean;
  paginationPosition?:
    | "top-left"
    | "top-center"
    | "top-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right";
  onDownloadPDF?: (data: any[], headers: any[]) => void;
  onDownloadExcel?: (data: any[], headers: any[]) => void;
  searchable?: boolean;
  searchTerm?: string; // <-- CHANGE 1: Added prop to receive search term from parent
  onSearch?: (term: string, mode: "startsWith" | "includes") => void;
  searchModeOptions?: ("startsWith" | "includes")[];
  onResetSearch?: () => void;
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
  searchTerm = "", // <-- CHANGE 2: Destructure prop and remove internal state
  onResetSearch,
  onSearch,
  searchModeOptions = ["includes", "startsWith"],
}) => {
  const [searchMode, setSearchMode] = useState<"startsWith" | "includes">(
    searchModeOptions[0]
  );
  const isPaginated = paginationRequired;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Let the parent component handle the state update
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
      <PageButton key={1} onClick={() => goToPage(1)} disabled={currentPage === 1}>
        1
      </PageButton>
    );

    if (currentPage > siblings + 2) {
      pages.push(<span key="start-ellipsis">...</span>);
    }

    const start = Math.max(2, currentPage - siblings);
    const end = Math.min(totalPages - 1, currentPage + siblings);

    for (let i = start; i <= end; i++) {
      pages.push(
        <PageButton key={i} onClick={() => goToPage(i)} disabled={currentPage === i}>
          {i}
        </PageButton>
      );
    }

    if (currentPage < totalPages - siblings - 1) {
      pages.push(<span key="end-ellipsis">...</span>);
    }

    if (totalPages > 1) {
      pages.push(
        <PageButton
          key={totalPages}
          onClick={() => goToPage(totalPages)}
          disabled={currentPage === totalPages}
        >
          {totalPages}
        </PageButton>
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
        <ButtonContainer>
          <PageButton onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
            Previous
          </PageButton>

          {renderPageNumbers()}

          <PageButton
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </PageButton>

          <PageSizeSelect
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
          </PageSizeSelect>

          <PageInfoInline>
            Page {currentPage} of {totalPages} (Total: {totalCount} items)
          </PageInfoInline>
        </ButtonContainer>
      </PaginationWrapper>
    );
  };

   return (
    <>
      {(searchable || onDownloadExcel || onDownloadPDF) && (
        <TopControls>
          {searchable && (
            <SearchGroup>
              <SearchInputWrapper>
                <SearchInput
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={handleChange}
                  style={{ paddingRight: '32px' }}
                />
                {searchTerm && (
                  <ClearButton onClick={onResetSearch} aria-label="Clear search">
                    <XMarkIcon style={{ width: 16, height: 16 }} />
                  </ClearButton>
                )}
              </SearchInputWrapper>
              <SearchSelect
                value={searchMode}
                onChange={(e) => setSearchMode(e.target.value as any)}
              >
                {searchModeOptions.map((mode) => (
                  <option key={mode} value={mode}>
                    {mode === "startsWith" ? "Starts With" : "Includes"}
                  </option>
                ))}
              </SearchSelect>
            </SearchGroup>
          )}

          {(onDownloadPDF || onDownloadExcel) && (
            <ButtonGroup>
              {onDownloadPDF && (
                <PageButton onClick={() => onDownloadPDF(data, headers)}>
                  <ArrowDownOnSquareIcon />
                </PageButton>
              )}
              {onDownloadExcel && (
                <PageButton onClick={() => onDownloadExcel(data, headers)}>
                  <ArrowDownOnSquareIcon />
                  Excel
                </PageButton>
              )}
            </ButtonGroup>
          )}
        </TopControls>
      )}

      {paginationPosition.startsWith("top") && data.length > 0 && renderPagination()}

      <TableContainer>
        <StyledTable>
          <StyledThead>
            <tr>
              {headers.map((header, idx) => (
                <TableHeader key={idx}>{header.label}</TableHeader>
              ))}
              {actions && <TableHeader>Actions</TableHeader>}
            </tr>
          </StyledThead>

          <tbody>
            {data.length > 0 ? (
              data.map((row, rowIndex) => (
                <TableRow key={rowIndex} className={highlightRowColor}>
                  {headers.map((header, cellIdx) => (
                    <TableData key={cellIdx}>
                      {(() => {
                        const value = row[header.key];

                        if (React.isValidElement(value)) return value;
                        if (typeof value === "function") {
                          try {
                            const result = value();
                            if (React.isValidElement(result)) return result;
                          } catch (e) {
                            console.warn("Error executing function in table cell:", e);
                          }
                        }
                        if (
                          typeof value === "string" &&
                          value.trim().startsWith("<") &&
                          value.trim().endsWith(">")
                        ) {
                          return <span dangerouslySetInnerHTML={{ __html: value }} />;
                        }
                        if (Array.isArray(value)) {
                          if (value.some((item) => React.isValidElement(item)))
                            return <>{value}</>;
                          return value.join(", ");
                        }
                        if (value instanceof Date) return value.toLocaleString();
                        if (typeof value === "boolean") return value ? "Yes" : "No";
                        if (value === null || value === undefined) return "-";
                        if (typeof value === "number") return value.toString();
                        if (typeof value === "object") return JSON.stringify(value);
                        return String(value);
                      })()}
                    </TableData>
                  ))}
                  {actions && <TableData>{actions(row)}</TableData>}
                </TableRow>
              ))
            ) : (
              <tr>
                <EmptyState colSpan={headers.length + (actions ? 1 : 0)}>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
                    <span>No records found.</span>
                    {onResetSearch && (
                      <PageButton onClick={onResetSearch} >Reset<ArrowPathIcon /></PageButton>
                    )}
                  </div>
                </EmptyState>
              </tr>
            )}
          </tbody>
        </StyledTable>
      </TableContainer>

      {paginationPosition.startsWith("bottom") && data.length > 0 && renderPagination()}
    </>
  );

};

Table.displayName = "Table";
export {Table};