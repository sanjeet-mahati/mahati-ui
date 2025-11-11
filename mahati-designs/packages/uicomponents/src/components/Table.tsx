'use client';
import React from "react";
import styled from "styled-components";
 
const TableContainer = styled.div`margin-top: 10px;`;
const StyledTable = styled.table`width: 100%; border-collapse: collapse;`;
const TableHeader = styled.th`padding: 12px; background: #135f9b; color: white; text-align: left;`;
const TableRow = styled.tr`&:nth-child(even) { background-color: #f9f9f9; } &:hover { background-color: #f1f1f1; }`;
const TableData = styled.td`padding: 10px; border-bottom: 1px solid #ccc;`;
const EmptyState = styled.td`text-align: center; padding: 20px; color: #999;`;
 
const PaginationContainer = styled.div`margin-top: 15px; display: flex; flex-direction: column; align-items: center;`;
const ButtonContainer = styled.div`display: flex; gap: 6px; align-items: center; flex-wrap: wrap;`;
const PageButton = styled.button`
  padding: 6px 12px;
  background: #135f9b;
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
const PageInfo = styled.div`margin-top: 8px; font-size: 13px;`;
 
interface TableProps {
  headers: { label: string; key: string }[];
  data: { [key: string]: unknown }[];
  page?: number;
  setPage?: (page: number) => void;
  limit?: number;
  setLimit?: (limit: number)=>void;
  totalCount?: number;
  highlightRowColor?: string;
  actions?: (row: unknown) => React.ReactNode;
}
 
const Table: React.FC<TableProps> = ({
  headers,
  data,
  page=0,
  setPage,
  limit=0,
  setLimit,
  totalCount=0,
  highlightRowColor,
  actions,
}) => {
  const totalPages = Math.ceil(totalCount/ limit) || 0;
 
  const renderPageNumbers = () => {
    const pages = [];
    const siblings = 1;
 
    if (totalPages <= 1) return null;
 
    // Always show first
    pages.push(
  <PageButton
  key={1}
  onClick={() => setPage?.(1)}
  disabled={page === 1}
>
  1
</PageButton>
 
    );
 
    if (page > siblings + 2) pages.push(<span key="start-ellipsis">...</span>);
 
    for (let i = Math.max(2, page - siblings); i <= Math.min(totalPages - 1, page + siblings); i++) {
      pages.push(
          <PageButton
            key={i}
            onClick={() => setPage?.(i)}
            disabled={page === i}
          >
            {i}
          </PageButton>
      );
    }
 
    if (page < totalPages - siblings - 1) pages.push(<span key="end-ellipsis">...</span>);
 
    if (totalPages > 1)
      pages.push(
     <PageButton
  key={1}
  onClick={() =>setPage?.(1)}
  disabled={page === 1}
>
  {totalPages+1}
</PageButton>
      );
 
    return pages;
  };
 
  return (
    <>
      <TableContainer>
        <StyledTable>
          <thead>
            <tr>
              {headers.map((header, idx) => (
                <TableHeader key={idx}>{header.label}</TableHeader>
              ))}
              {actions && <TableHeader>Actions</TableHeader>}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((row, rowIndex) => (
                <TableRow key={rowIndex} className={highlightRowColor}>
                  {headers.map((header, cellIdx) => (
                    <TableData key={cellIdx}>
                      {(() => {
                        const value = row[header.key];
                       
                        // Handle JSX/React elements
                        if (React.isValidElement(value)) {
                          return value;
                        }
 
                        // Handle functions that return JSX
                        if (typeof value === 'function') {
                          try {
                            const result = value();
                            if (React.isValidElement(result)) {
                              return result;
                            }
                          } catch (e) {
                            console.warn('Error executing function in table cell:', e);
                          }
                        }
 
                        // Handle HTML strings
                        if (typeof value === 'string' && (
                          value.trim().startsWith('<') &&
                          value.trim().endsWith('>')
                        )) {
                          return <div dangerouslySetInnerHTML={{ __html: value }} />;
                        }
 
                        // Handle arrays (join them)
                        if (Array.isArray(value)) {
                          if (value.some(item => React.isValidElement(item))) {
                            return <>{value}</>;
                          }
                          return value.join(', ');
                        }
 
                        // Handle dates
                        if (value instanceof Date) {
                          return value.toLocaleString();
                        }
 
                        // Handle booleans
                        if (typeof value === 'boolean') {
                          return value ? 'Yes' : 'No';
                        }
 
                        // Handle null/undefined
                        if (value === null || value === undefined) {
                          return '-';
                        }
 
                        // Handle numbers
                        if (typeof value === 'number') {
                          return value.toString();
                        }
 
                        // Handle objects
                        if (typeof value === 'object') {
                          return JSON.stringify(value);
                        }
 
                        // Default to string
                        return String(value);
                      })()}
                    </TableData>
                  ))}
                  {actions && <TableData>{actions(row)}</TableData>}
                </TableRow>
              ))
            ) : (
              <tr>
                <EmptyState colSpan={headers.length + (actions ? 1 : 0)}>No data available</EmptyState>
              </tr>
            )}
          </tbody>
        </StyledTable>
      </TableContainer>
 
      {(totalPages > 1 || totalCount <= limit) && (
        <PaginationContainer>
          <ButtonContainer>
            <PageButton onClick={() => setPage?.(page - 1)} disabled={page === 1}>
              Previous
            </PageButton>
            {renderPageNumbers()}
            <PageButton onClick={() => setPage?.(page + 1)} disabled={page === totalPages}>
              Next
            </PageButton>
 
            <PageSizeSelect
              value={limit}
              onChange={(e) => {
               setPage?.(1)
                setLimit?.(Number(e.target.value));
              }}
            >
              {[5, 10, 15].map((size) => (
                <option key={size} value={size}>
                  {size} per page
                </option>
              ))}
            </PageSizeSelect>
          </ButtonContainer>
          <PageInfo>
            Page {page+1} of {totalPages+1} (Total: {totalCount} items)
          </PageInfo>
        </PaginationContainer>
      )}
    </>
  );
};
 
export default Table;