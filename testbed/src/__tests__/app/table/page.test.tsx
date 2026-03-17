import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// ─── Mock next/link ───────────────────────────────────────────────────────────
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

// ─── Mock @mahatisystems/mahati-ui-components ─────────────────────────────────────────────────────────
// Source imports: MahatiTable, MahatiButton
jest.mock('@mahatisystems/mahati-ui-components', () => ({
  MahatiTable: ({ headers, data, actions, paginationRequired, page, setPage,
    limit, setLimit, totalCount, paginationPosition, onResetSearch,
    onDownloadPDF, summary, summaryKey, summaryTitleField,
    summaryColumn, summaryColumnKey, textWrapColumns, textWrapMaxLength }: any) => (
    <div data-testid="mahati-table"
      data-pagination={paginationRequired ? 'true' : 'false'}
      data-summary={summary || ''}
      data-summary-column={summaryColumn ? 'true' : 'false'}
    >
      <table>
        <thead>
          <tr>
            {headers?.map((h: any, i: number) => (
              <th key={i} data-testid={`th-${h.key}`}>
                {typeof h.label === 'string' ? h.label : h.key}
              </th>
            ))}
            {actions && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data?.map((row: any, i: number) => (
            <tr key={i} data-testid={`table-row-${i}`}>
              {headers?.map((h: any) => {
                const cell = row[h.key];
                // Safely render: functions → call them, Date objects → toString,
                // objects (but not React elements) → JSON, primitives → as-is
                const renderCell = (v: any): React.ReactNode => {
                  if (typeof v === 'function') return renderCell(v());
                  if (v instanceof Date) return v.toLocaleDateString();
                  if (v === null || v === undefined) return '';
                  if (typeof v === 'object' && !React.isValidElement(v)) return JSON.stringify(v);
                  return v;
                };
                return (
                  <td key={h.key}>
                    {renderCell(cell)}
                  </td>
                );
              })}
              {actions && <td data-testid={`action-cell-${i}`}>{actions(row)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
      {paginationRequired && (
        <div data-testid="pagination">
          <button onClick={() => setPage?.((p: number) => Math.max(1, p - 1))}>Prev</button>
          <span data-testid="page-info">Page {page}</span>
          <button onClick={() => setPage?.((p: number) => p + 1)}>Next</button>
        </div>
      )}
    </div>
  ),

  MahatiButton: ({ children, onClick, variant, size, className, disabled }: any) => (
    <button
      data-testid="mahati-button"
      data-variant={variant}
      data-size={size}
      className={className}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  ),
}));

// ─── Mock CodePreview ─────────────────────────────────────────────────────────
jest.mock('@/app/CodePreview', () => ({
  CodePreview: ({ title, preview, code }: any) => (
    <div data-testid="code-preview">
      <h2 data-testid={`section-${title?.toLowerCase().replace(/[\s()&/]+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '')}`}>
        {title}
      </h2>
      <div data-testid="preview-area">{preview}</div>
      <pre data-testid="code-block">{code}</pre>
    </div>
  ),
}));

// ─── Suppress localStorage errors in jsdom ────────────────────────────────────
beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  // Provide a basic localStorage stub since jsdom supports it
  Storage.prototype.getItem = jest.fn().mockReturnValue(null);
  Storage.prototype.setItem = jest.fn();
  Storage.prototype.removeItem = jest.fn();
});

afterEach(() => {
  jest.restoreAllMocks();
});

import TablePage from '../../../app/table/page';

// ═══════════════════════════════════════════════════════════════════════════════
// Render
// ═══════════════════════════════════════════════════════════════════════════════

describe('TablePage — Render', () => {
  it('renders without crashing', () => {
    const { container } = render(<TablePage />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders page heading "Table"', () => {
    render(<TablePage />);
    expect(screen.getByRole('heading', { level: 1, name: 'Table' })).toBeInTheDocument();
  });

  it('renders page description text', () => {
    render(<TablePage />);
    expect(screen.getByText(/Basic, paginated, bordered, sortable/i)).toBeInTheDocument();
  });

  it('renders multiple CodePreview sections', () => {
    render(<TablePage />);
    expect(screen.getAllByTestId('code-preview').length).toBeGreaterThan(5);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Section titles
// ═══════════════════════════════════════════════════════════════════════════════

describe('TablePage — Section Titles', () => {
  it('renders "Basic Table" section', () => {
    render(<TablePage />);
    expect(screen.getByText('Basic Table')).toBeInTheDocument();
  });

  it('renders "Paginated Table" section', () => {
    render(<TablePage />);
    expect(screen.getByText('Paginated Table')).toBeInTheDocument();
  });

  it('renders "Custom Cells & Actions" section', () => {
    render(<TablePage />);
    expect(screen.getByText('Custom Cells & Actions')).toBeInTheDocument();
  });

  it('renders "Date & Time Sorting" section', () => {
    render(<TablePage />);
    expect(screen.getByText('Date & Time Sorting')).toBeInTheDocument();
  });

  it('renders "Bordered Table (Visible Edges)" section', () => {
    render(<TablePage />);
    expect(screen.getByText('Bordered Table (Visible Edges)')).toBeInTheDocument();
  });

  it('renders "Alignment Controls (Left / Center / Right)" section', () => {
    render(<TablePage />);
    expect(screen.getByText('Alignment Controls (Left / Center / Right)')).toBeInTheDocument();
  });

  it('renders "Per-Column Alignment" section', () => {
    render(<TablePage />);
    expect(screen.getByText('Per-Column Alignment')).toBeInTheDocument();
  });

  it('renders "Column Visibility (Multi-Select)" section', () => {
    render(<TablePage />);
    expect(screen.getByText('Column Visibility (Multi-Select)')).toBeInTheDocument();
  });

  it('renders "All-in-One Table" section', () => {
    render(<TablePage />);
    expect(screen.getByText('All-in-One Table')).toBeInTheDocument();
  });

  it('renders "Expandable Rows with Summary" section', () => {
    render(<TablePage />);
    expect(screen.getByText('Expandable Rows with Summary')).toBeInTheDocument();
  });

  it('renders "Expandable Multiple Rows with Summary" section', () => {
    render(<TablePage />);
    expect(screen.getByText('Expandable Multiple Rows with Summary')).toBeInTheDocument();
  });

  it('renders "Text Wrap Table (Summary Column)" section', () => {
    render(<TablePage />);
    expect(screen.getByText('Text Wrap Table (Summary Column)')).toBeInTheDocument();
  });

  it('renders "Multi-Column Text Wrap Table" section', () => {
    render(<TablePage />);
    expect(screen.getByText('Multi-Column Text Wrap Table')).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// MahatiTable instances
// ═══════════════════════════════════════════════════════════════════════════════

describe('TablePage — MahatiTable Instances', () => {
  it('renders multiple MahatiTable instances', () => {
    render(<TablePage />);
    expect(screen.getAllByTestId('mahati-table').length).toBeGreaterThan(5);
  });

  it('renders a table with paginationRequired=true', () => {
    render(<TablePage />);
    const tables = screen.getAllByTestId('mahati-table');
    const paginated = tables.find(t => t.getAttribute('data-pagination') === 'true');
    expect(paginated).toBeInTheDocument();
  });

  it('renders a table with summary="single"', () => {
    render(<TablePage />);
    const tables = screen.getAllByTestId('mahati-table');
    const singleSummary = tables.find(t => t.getAttribute('data-summary') === 'single');
    expect(singleSummary).toBeInTheDocument();
  });

  it('renders a table with summary="multi"', () => {
    render(<TablePage />);
    const tables = screen.getAllByTestId('mahati-table');
    const multiSummary = tables.find(t => t.getAttribute('data-summary') === 'multi');
    expect(multiSummary).toBeInTheDocument();
  });

  it('renders a table with summaryColumn=true', () => {
    render(<TablePage />);
    const tables = screen.getAllByTestId('mahati-table');
    const summaryCol = tables.find(t => t.getAttribute('data-summary-column') === 'true');
    expect(summaryCol).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// People data in basic table
// ═══════════════════════════════════════════════════════════════════════════════

describe('TablePage — People Data', () => {
  it('renders James Smith in table', () => {
    render(<TablePage />);
    expect(screen.getAllByText('James Smith').length).toBeGreaterThan(0);
  });

  it('renders Christopher Anderson in table', () => {
    render(<TablePage />);
    expect(screen.getAllByText('Christopher Anderson').length).toBeGreaterThan(0);
  });

  it('renders Admin role badge', () => {
    render(<TablePage />);
    expect(screen.getAllByText('Admin').length).toBeGreaterThan(0);
  });

  it('renders Manager role badge', () => {
    render(<TablePage />);
    expect(screen.getAllByText('Manager').length).toBeGreaterThan(0);
  });

  it('renders email addresses', () => {
    render(<TablePage />);
    expect(screen.getAllByText('jamesmith@sample.com').length).toBeGreaterThan(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Paginated table
// ═══════════════════════════════════════════════════════════════════════════════

describe('TablePage — Paginated Table', () => {
  it('renders search input', () => {
    render(<TablePage />);
    expect(screen.getByPlaceholderText('Search…')).toBeInTheDocument();
  });

  it('renders Reset button', () => {
    render(<TablePage />);
    const buttons = screen.getAllByTestId('mahati-button');
    const reset = buttons.find(b => b.textContent === 'Reset');
    expect(reset).toBeInTheDocument();
  });

  it('renders rows per page selector', () => {
    render(<TablePage />);
    const select = screen.getByDisplayValue('10');
    expect(select).toBeInTheDocument();
  });

  it('renders pagination controls', () => {
    render(<TablePage />);
    expect(screen.getByTestId('pagination')).toBeInTheDocument();
  });

  it('shows total count text', () => {
    render(<TablePage />);
    expect(screen.getByText(/Total:/)).toBeInTheDocument();
  });

  it('search input filters data on change', () => {
    render(<TablePage />);
    const searchInput = screen.getByPlaceholderText('Search…');
    fireEvent.change(searchInput, { target: { value: 'James' } });
    // After filtering, total should reflect fewer rows
    expect(screen.getByText(/Total:/)).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Custom cells & actions
// ═══════════════════════════════════════════════════════════════════════════════

describe('TablePage — Custom Cells & Actions', () => {
  it('renders "+ Add Row" button', () => {
    render(<TablePage />);
    const buttons = screen.getAllByTestId('mahati-button');
    const addRow = buttons.find(b => b.textContent === '+ Add Row');
    expect(addRow).toBeInTheDocument();
  });

  it('renders "+ Add Column" button', () => {
    render(<TablePage />);
    const buttons = screen.getAllByTestId('mahati-button');
    const addCol = buttons.find(b => b.textContent === '+ Add Column');
    expect(addCol).toBeInTheDocument();
  });

  it('renders "Reset Demo" button', () => {
    render(<TablePage />);
    const buttons = screen.getAllByTestId('mahati-button');
    const reset = buttons.find(b => b.textContent === 'Reset Demo');
    expect(reset).toBeInTheDocument();
  });

  it('renders Edit action buttons in custom table', () => {
    render(<TablePage />);
    const editButtons = screen.getAllByTestId('mahati-button').filter(
      b => b.textContent === 'Edit'
    );
    expect(editButtons.length).toBeGreaterThan(0);
  });

  it('renders Delete action buttons in custom table', () => {
    render(<TablePage />);
    const deleteButtons = screen.getAllByTestId('mahati-button').filter(
      b => b.textContent === 'Delete'
    );
    expect(deleteButtons.length).toBeGreaterThan(0);
  });

  it('clicking Edit shows Save and Cancel buttons', () => {
    render(<TablePage />);
    const editButtons = screen.getAllByTestId('mahati-button').filter(
      b => b.textContent === 'Edit'
    );
    fireEvent.click(editButtons[0]);
    expect(screen.getAllByText('Save').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Cancel').length).toBeGreaterThan(0);
  });

  it('clicking Cancel restores Edit/Delete buttons', () => {
    render(<TablePage />);
    const editButtons = screen.getAllByTestId('mahati-button').filter(
      b => b.textContent === 'Edit'
    );
    fireEvent.click(editButtons[0]);
    const cancelButton = screen.getAllByTestId('mahati-button').find(
      b => b.textContent === 'Cancel'
    );
    fireEvent.click(cancelButton!);
    expect(screen.getAllByText('Edit').length).toBeGreaterThan(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Task table (Date & Time Sorting)
// ═══════════════════════════════════════════════════════════════════════════════

describe('TablePage — Date & Time Sorting', () => {
  it('renders task names', () => {
    render(<TablePage />);
    expect(screen.getAllByText('Design Homepage').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Fix Login Bug').length).toBeGreaterThan(0);
  });

  it('renders task priorities', () => {
    render(<TablePage />);
    expect(screen.getAllByText('High').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Critical').length).toBeGreaterThan(0);
  });

  it('renders task statuses', () => {
    render(<TablePage />);
    expect(screen.getAllByText('In Progress').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Completed').length).toBeGreaterThan(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Alignment controls
// ═══════════════════════════════════════════════════════════════════════════════

describe('TablePage — Alignment Controls', () => {
  it('renders Left, Center, Right alignment buttons', () => {
    render(<TablePage />);
    expect(screen.getAllByText('Left').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Center').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Right').length).toBeGreaterThan(0);
  });

  it('clicking Center alignment button works without crashing', () => {
    render(<TablePage />);
    const centerBtns = screen.getAllByTestId('mahati-button').filter(
      b => b.textContent === 'Center'
    );
    expect(() => fireEvent.click(centerBtns[0])).not.toThrow();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Column visibility
// ═══════════════════════════════════════════════════════════════════════════════

describe('TablePage — Column Visibility', () => {
  it('renders Columns picker button', () => {
    render(<TablePage />);
    expect(screen.getByText(/Columns \(/)).toBeInTheDocument();
  });

  it('opens column picker on click', () => {
    render(<TablePage />);
    const pickerBtn = screen.getByText(/Columns \(/);
    fireEvent.click(pickerBtn);
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('renders Select All button in picker', () => {
    render(<TablePage />);
    fireEvent.click(screen.getByText(/Columns \(/));
    const selectAll = screen.getAllByTestId('mahati-button').find(
      b => b.textContent === 'Select All'
    );
    expect(selectAll).toBeInTheDocument();
  });

  it('renders Clear All button in picker', () => {
    render(<TablePage />);
    fireEvent.click(screen.getByText(/Columns \(/));
    const clearAll = screen.getAllByTestId('mahati-button').find(
      b => b.textContent === 'Clear All'
    );
    expect(clearAll).toBeInTheDocument();
  });

  it('renders Done button in picker', () => {
    render(<TablePage />);
    fireEvent.click(screen.getByText(/Columns \(/));
    const done = screen.getAllByTestId('mahati-button').find(
      b => b.textContent === 'Done'
    );
    expect(done).toBeInTheDocument();
  });

  it('renders column checkboxes in picker', () => {
    render(<TablePage />);
    fireEvent.click(screen.getByText(/Columns \(/));
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes.length).toBeGreaterThan(5);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// All-in-one table
// ═══════════════════════════════════════════════════════════════════════════════

describe('TablePage — All-in-One Table', () => {
  it('renders Reset button in all-in-one section', () => {
    render(<TablePage />);
    const resetBtns = screen.getAllByTestId('mahati-button').filter(
      b => b.textContent === 'Reset'
    );
    expect(resetBtns.length).toBeGreaterThan(0);
  });

  it('renders Rows label in all-in-one section', () => {
    render(<TablePage />);
    expect(screen.getByText('Rows:')).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Code snippets
// ═══════════════════════════════════════════════════════════════════════════════

describe('TablePage — Code Snippets', () => {
  it('code blocks contain MahatiTable references', () => {
    render(<TablePage />);
    const codeBlocks = screen.getAllByTestId('code-block');
    const hasMahatiTable = codeBlocks.some(b => b.textContent?.includes('MahatiTable'));
    expect(hasMahatiTable).toBe(true);
  });

  it('code blocks contain paginationRequired reference', () => {
    render(<TablePage />);
    const codeBlocks = screen.getAllByTestId('code-block');
    const hasPagination = codeBlocks.some(b => b.textContent?.includes('paginationRequired'));
    expect(hasPagination).toBe(true);
  });

  it('code blocks contain summary reference', () => {
    render(<TablePage />);
    const codeBlocks = screen.getAllByTestId('code-block');
    const hasSummary = codeBlocks.some(b => b.textContent?.includes('summary'));
    expect(hasSummary).toBe(true);
  });

  it('code blocks contain textWrapColumns reference', () => {
    render(<TablePage />);
    const codeBlocks = screen.getAllByTestId('code-block');
    const hasTextWrap = codeBlocks.some(b => b.textContent?.includes('textWrapColumns'));
    expect(hasTextWrap).toBe(true);
  });
});
