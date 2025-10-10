"use client";
import React from "react";
import styled from "styled-components";

const HEADER_BG = "linear-gradient(to right, #1e73be, #28a97d)";

const TableContainer = styled.div`
  margin-top: 10px;
  border-radius: 10px;

border: 1px solid #1761A3;

background: #FFF;
  overflow: hidden; /* clip children to keep rounded corners */

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
    .
  }
`;

const TableData = styled.td`
  padding: 10px;
  border-bottom: 1px solid #ccc;
  color: #000;

font-family: Poppins;
font-size: 14px;
font-style: normal;
font-weight: 500;
line-height: normal;
`;

const EmptyState = styled.td`
  text-align: center;
  padding: 20px;
  color: #999;
`;

/* ==== Centered pagination ==== */
const PaginationContainer = styled.div`
  margin-top: 15px;
  display: flex;
  justify-content: center;
  width: 100%;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
`;

const PageButton = styled.button`
  padding: 6px 12px;
  background: ${HEADER_BG};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const PageSizeSelect = styled.select`
  margin-left: 10px;
  padding: 6px;
  border-radius: 4px;
  border: 1px solid #aaa;
`;

const PageInfoInline = styled.span`
  margin-left: 10px;
  font-size: 13px;
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
}) => {
  const hasValidLimit = typeof limit === "number" && limit > 0;
  const hasValidTotal = typeof totalCount === "number" && totalCount >= 0;
  const isPaginated = !!(hasValidLimit && hasValidTotal && setPage && setLimit);

  const totalPages = isPaginated
    ? Math.max(1, Math.ceil((totalCount as number) / (limit as number)))
    : 0;
  const currentPage = isPaginated
    ? typeof page === "number" && page > 0
      ? page
      : 1
    : 1;

  const goToPage = (p: number) => {
    if (!isPaginated) return;
    const clamped = Math.max(1, Math.min(totalPages, p));
    setPage!(clamped);
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

  return (
    <>
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
                          // ✅ wrap raw HTML safely in span, not div
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
                  No data available
                </EmptyState>
              </tr>
            )}
          </tbody>
        </StyledTable>
      </TableContainer>

      {isPaginated && (
        <PaginationContainer>
          <ButtonContainer>
            <PageButton onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
              Previous
            </PageButton>

            {renderPageNumbers()}

            <PageButton onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
              Next
            </PageButton>

            <PageSizeSelect
              value={limit}
              onChange={(e) => {
                setPage!(1);
                setLimit!(Number(e.target.value));
              }}
            >
              {[5, 10, 15].map((size) => (
                <option key={size} value={size}>
                  {size} per page
                </option>
              ))}
            </PageSizeSelect>

            <PageInfoInline>
              Page {currentPage} of {totalPages} (Total: {totalCount} items)
            </PageInfoInline>
          </ButtonContainer>
        </PaginationContainer>
      )}
    </>
  );
};

export default Table;
