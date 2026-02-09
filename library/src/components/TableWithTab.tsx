"use client";

import React, { useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import styled from '@emotion/styled';
import { css } from '@emotion/react';

// Import existing components
import { Table } from "./Table";
import { TabbedInterface } from "./TabedInterface";

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
   * Values like "sans", "serif", "mono", "Poppins", or a custom font name.
   */
  sectionTitleFont?: string;
  sectionDescriptionFont?: string;
}

// Map font strings to CSS
const getFontFamily = (font?: string): string => {
  if (!font) return "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  
  const lower = font.toLowerCase().trim();
  
  if (lower === "sans" || lower === "sans-serif") 
    return "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  if (lower === "serif") 
    return "Georgia, 'Times New Roman', serif";
  if (lower === "mono" || lower === "monospace") 
    return "'Courier New', Courier, monospace";
  if (lower === "poppins") 
    return "'Poppins', sans-serif";
  
  return `'${font}', sans-serif`;
};

// Styled Components
const Container = styled.div`
  width: 100%;
  border-radius: 0.75rem;
  border: 1px solid #e2e8f0;
  background-color: white;
  padding: 1.5rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
`;

const Header = styled.header`
  margin-bottom: 1rem;
`;

const Title = styled.h2<{ fontFamily: string }>`
  font-size: 1.25rem;
  font-weight: 600;
  color: #0f172a;
  font-family: ${props => props.fontFamily};
`;

const Description = styled.p<{ fontFamily: string }>`
  margin-top: 0.25rem;
  font-size: 0.875rem;
  color: #64748b;
  font-family: ${props => props.fontFamily};
`;

const TableWrapper = styled.div`
  overflow: hidden;
  border-radius: 0.75rem;
  border: 1px solid #e2e8f0;
`;

const StyledTable = styled.table`
  min-width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
`;

const TableHead = styled.thead`
  background: linear-gradient(to right, #1761A3, #4DAF83);
`;

const TableHeadRow = styled.tr``;

const TableHeadCell = styled.th`
  padding: 0.5rem 0.75rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: white;
`;

const TableBody = styled.tbody`
  background-color: white;
`;

const TableRow = styled.tr<{ selected: boolean }>`
  cursor: pointer;
  border-bottom: 1px solid #f1f5f9;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f8fafc;
  }

  ${props => props.selected && css`
    background-color: rgba(219, 234, 254, 0.7);
  `}
`;

const TableCell = styled.td`
  padding: 0.5rem 0.75rem;
  vertical-align: middle;
  color: #1e293b;
`;

const EmptyRow = styled.tr``;

const EmptyCell = styled.td`
  padding: 1.5rem 1rem;
  text-align: center;
  font-size: 0.875rem;
  color: #64748b;
`;

const TabsSection = styled.div`
  margin-top: 1.5rem;
`;

const TabsHeader = styled.div`
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TabsTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #64748b;
`;

const TabsHint = styled.p`
  font-size: 0.75rem;
  color: #64748b;
`;

const TabContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CloseButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const CloseButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  border-radius: 9999px;
  background-color: #f1f5f9;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: #334155;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #e2e8f0;
  }

  svg {
    height: 0.75rem;
    width: 0.75rem;
  }
`;

const DefaultContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const DetailRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  border-radius: 0.5rem;
  background-color: white;
  padding: 0.75rem;
  font-size: 0.875rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

  @media (min-width: 640px) {
    flex-direction: row;
    align-items: center;
  }
`;

const DetailLabel = styled.span`
  width: 100%;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #64748b;

  @media (min-width: 640px) {
    width: 12rem;
  }
`;

const DetailValue = styled.span`
  flex: 1;
  word-break: break-words;
  color: #1e293b;
`;

const EmptyValue = styled.span`
  color: #cbd5e1;
`;

type SelectedTab<RowType> = {
  id: string | number;
  label: string;
  row: RowType;
  rowIndex: number;
};

function renderCellValue(value: any): React.ReactNode {
  if (React.isValidElement(value)) return value;

  if (value === null || value === undefined) {
    return <EmptyValue>-</EmptyValue>;
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
    <DefaultContentContainer>
      {headers.map((h) => (
        <DetailRow key={h.key}>
          <DetailLabel>{h.label as any}</DetailLabel>
          <DetailValue>{renderCellValue((row as any)[h.key]) as any}</DetailValue>
        </DetailRow>
      ))}
    </DefaultContentContainer>
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
}: TableWithTabProps<RowType>) {
  const { headers, data } = tableProps;

  const [tabs, setTabs] = useState<SelectedTab<RowType>[]>([]);

  // Which column to use for label when opening a new tab:
  // 1) tabLabelKey if provided
  // 2) otherwise first column's key
  const labelColumnKey = tabLabelKey ?? headers[0]?.key;

  const sectionTitleFontFamily = getFontFamily(sectionTitleFont);
  const sectionDescriptionFontFamily = getFontFamily(sectionDescriptionFont);

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
      <TabContentWrapper>
        <CloseButtonWrapper>
          <CloseButton
            type="button"
            onClick={() => handleCloseTab(t.id)}
          >
            <XMarkIcon />
            <span>Close tab</span>
          </CloseButton>
        </CloseButtonWrapper>

        {(renderTabContent ? (
          renderTabContent(t.row)
        ) : (
          <DefaultTabContent<RowType> headers={headers} row={t.row} />
        )) as any}
      </TabContentWrapper>
    ),
  }));

  // Respect user's setting for header close icon, but default to true
  const effectiveShowHeaderClose =
    tabProps?.showTabCloseIconInHeader ?? true;

  return (
    <Container>
      {(title || description) && (
        <Header>
          {title && (
            <Title fontFamily={sectionTitleFontFamily}>
              {title}
            </Title>
          )}
          {description && (
            <Description fontFamily={sectionDescriptionFontFamily}>
              {description}
            </Description>
          )}
        </Header>
      )}

      {/* Clickable Table */}
      <TableWrapper>
        <StyledTable>
          <TableHead>
            <TableHeadRow>
              {headers.map((header) => (
                <TableHeadCell key={header.key}>
                  {header.label as any}
                </TableHeadCell>
              ))}
            </TableHeadRow>
          </TableHead>
          <TableBody>
            {data.length === 0 && (
              <EmptyRow>
                <EmptyCell colSpan={headers.length}>
                  No records to display.
                </EmptyCell>
              </EmptyRow>
            )}

            {data.map((row, index) => {
              const selected = isRowSelected(row as RowType, index);
              const rowId = getRowId ? getRowId(row as RowType, index) : index;

              return (
                <TableRow
                  key={String(rowId)}
                  onClick={() => handleRowClick(row as RowType, index)}
                  selected={selected}
                >
                  {headers.map((header) => (
                    <TableCell key={header.key}>
                      {renderCellValue((row as any)[header.key]) as any}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </StyledTable>
      </TableWrapper>

      {/* Tabs below table */}
      {tabs.length > 0 && (
        <TabsSection>
          <TabsHeader>
            <TabsTitle>
              Open Rows ({tabs.length})
            </TabsTitle>
            {rearrange && (
              <TabsHint>
                Drag the tab headers to change their order. Clicking a row
                again will close its tab.
              </TabsHint>
            )}
          </TabsHeader>

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
        </TabsSection>
      )}
    </Container>
  );
}

TableWithTab.displayName = "TableWithTab";
export { TableWithTab };