import React, { useState, useMemo } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
 
// Styled Components for Table and Pagination
const TableContainer = styled.div`
  width: 100%;
  margin: 20px 0;
  overflow-x: auto;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
`;
 
const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;
 
const TableHeader = styled.th`
  padding: 15px;
  text-align: left;
  background: #135f9b;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
`;
 
const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f2f2f2;
  }
 
  &:hover {
    background-color: #eadcb2;
  }
`;
 
const TableData = styled.td`
  padding: 12px 15px;
  text-align: left;
  border-bottom: 8px solid #eadcb2;
`;
 
const EmptyState = styled.div`
  padding: 20px;
  text-align: center;
  color: #999;
`;
 
const PaginationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
`;
 
const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;
 
const PageButton = styled.button`
  padding: 5px 10px;
  margin: 0 5px;
  background-color: #135f9b;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
 
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;
 
const PageSizeSelect = styled.select`
  margin-left: 15px;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
`;
 
const PageInfo = styled.div`
  margin-top: 10px;
  font-size: 14px;
  color: #333;
`;
 
const FilterInputContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 15px;
  width: 100%;
`;
 
const FilterInputWrapper = styled.div`
  position: relative;
  width: 190px;
`;
 
const FilterInput = styled.input`
  padding: 6px 30px 6px 10px;
  width: 100%;
  box-sizing: border-box;
  border: 1px solid black;
  border-radius: 10px;
`;
 
const SearchIcon = styled(FontAwesomeIcon)`
  position: absolute;
  top: 50%;
  right: 2px;
  transform: translateY(-50%);
  color: black;
`;
 
interface TableProps {
  headers: { label: string; key: string }[];
  data: { [key: string]: any }[];
  initialRowsPerPage?: number;
  pageSizes?: number[];
}
const Table: React.FC<TableProps> = ({
  headers,
  data,
  initialRowsPerPage = 5,
  pageSizes = [5, 10, 15],
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filterValue, setFilterValue] = useState<string>("");
 
  const sortedData = useMemo(() => {
    if (!sortKey) return data;
    const sorted = [...data].sort((a, b) => {
      if (a[sortKey] < b[sortKey]) return sortOrder === "asc" ? -1 : 1;
      if (a[sortKey] > b[sortKey]) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [data, sortKey, sortOrder]);
 
 
  const filteredData = useMemo(() => {
    if (!filterValue) return sortedData;
 
    return sortedData.filter((row) =>
      headers.some((header) => {
        const cellValue = row[header.key];
 
        // Handle hyperlinks or plain text
        const textValue =
          typeof cellValue === "object" &&
          cellValue !== null &&
          "props" in cellValue
            ? cellValue.props.children // Extract visible text from React elements
            : cellValue;
 
        // Convert textValue to a string safely before using toLowerCase
        return String(textValue).toLowerCase().includes(filterValue.toLowerCase());
      })
    );
  }, [filterValue, sortedData, headers]);
 
 
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
 
  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(startIndex, startIndex + rowsPerPage);
  }, [currentPage, rowsPerPage, filteredData]);
 
  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };
 
  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };
 
  const handlePageChange = (newPage: number) => setCurrentPage(newPage);
 
  return (
    <>
      <FilterInputContainer>
        <FilterInputWrapper>
          <FilterInput
            type="text"
            placeholder="Filter Table Data"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
          />
          <SearchIcon icon={faSearch} />
        </FilterInputWrapper>
      </FilterInputContainer>
 
      <TableContainer>
        <StyledTable>
          <thead>
            <tr>
              {headers.map((header, index) => (
                <TableHeader key={index} onClick={() => handleSort(header.key)}>
                  {header.label}{" "}
                  {sortKey === header.key
                    ? sortOrder === "asc"
                      ? "↑"
                      : "↓"
                    : ""}
                </TableHeader>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                {headers.map((header, cellIndex) => (
                  <TableData key={cellIndex}>
                    {header.key === "hyperlinkKey" ? (
                      // Handle hyperlinks with anchor tags
                      <a
                        href={row[header.key]}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {row[header.key]}
                      </a>
                    ) : typeof row[header.key] === "boolean" ? (
                      // Handle boolean values
                      row[header.key] ? "Yes" : "No"
                    ) : row[header.key] ? (
                      // Handle general non-empty values
                      row[header.key]
                    ) : (
                      // Handle empty or null values
                      "-"
                    )}
                  </TableData>
                ))}
              </TableRow>
             
              ))
            ) : (
              <tr>
                {/* <td colSpan={headers.length}>
                  <EmptyState>No data available</EmptyState>
                </td> */}
              </tr>
            )}
          </tbody>
        </StyledTable>
      </TableContainer>
 
      {filteredData.length > 0 && (
        <PaginationContainer>
          <ButtonContainer>
            <PageButton
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </PageButton>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (page) =>
                  page === currentPage ||
                  (page >= currentPage - 2 && page <= currentPage + 2)
              )
              .map((page) => (
                <PageButton
                  key={page}
                  onClick={() => handlePageChange(page)}
                  disabled={page === currentPage}
                >
                  {page}
                </PageButton>
              ))}
            <PageButton
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </PageButton>
            <PageSizeSelect value={rowsPerPage} onChange={handlePageSizeChange}>
              {pageSizes.map((size) => (
                <option key={size} value={size}>
                  {size} per page
                </option>
              ))}
            </PageSizeSelect>
          </ButtonContainer>
          <PageInfo>
            Page {currentPage} of {totalPages} (Total: {filteredData.length}{" "}
            items)
          </PageInfo>
        </PaginationContainer>
      )}
    </>
  );
};
 
export default Table;
 