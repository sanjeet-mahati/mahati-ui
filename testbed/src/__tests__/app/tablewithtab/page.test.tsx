import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';

// ─── Mock @mahatisystems/mahati-ui-components ─────────────────────────────────────────────────
jest.mock('@mahatisystems/mahati-ui-components', () => ({
  MahatiTable: ({ headers, data }: any) => (
    <table data-testid="mahati-table">
      <thead>
        <tr>
          {headers?.map((h: any) => <th key={h.key}>{h.label}</th>)}
        </tr>
      </thead>
      <tbody>
        {data?.map((row: any, i: number) => (
          <tr key={i} data-testid={`table-row-${i}`}>
            {headers?.map((h: any) => (
              <td key={h.key}>{String(row[h.key])}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),

  MahatiTableWithTab: ({
    tableProps,
    tabProps,
    tabLabelKey,
    rearrange,
    renderTabContent,
    getRowId,
  }: any) => (
    <div
      data-testid="mahati-table-with-tab"
      data-variant={tabProps?.variant}
      data-orientation={tabProps?.orientation}
      data-vertical-position={tabProps?.verticalPosition}
      data-show-close={tabProps?.showTabCloseIconInHeader ? 'true' : 'false'}
      data-close-position={tabProps?.tabCloseIconPosition}
      data-rearrange={rearrange ? 'true' : 'false'}
      data-tab-label-key={tabLabelKey}
    >
      {/* Table section */}
      <table data-testid="inner-table">
        <thead>
          <tr>
            {tableProps?.headers?.map((h: any) => (
              <th key={h.key}>{h.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableProps?.data?.map((row: any, i: number) => (
            <tr
              key={i}
              data-testid={`row-${getRowId?.(row) ?? i}`}
              onClick={() => {/* simulate row click */}}
            >
              {tableProps?.headers?.map((h: any) => (
                <td key={h.key}>{String(row[h.key])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Simulated tab content for each row */}
      <div data-testid="tab-content-area">
        {tableProps?.data?.map((row: any) => (
          <div key={getRowId?.(row)} data-testid={`tab-content-${getRowId?.(row)}`}>
            {renderTabContent?.(row)}
          </div>
        ))}
      </div>
    </div>
  ),
}));

// ─── Mock CodePreview ─────────────────────────────────────────────────────────
jest.mock('../../../app/CodePreview', () => ({
  CodePreview: ({ id, title, description, preview, code }: any) => (
    <div
      data-testid={`code-preview`}
      id={id}
    >
      <h3 data-testid={`section-title-${id}`}>{title}</h3>
      <div data-testid={`section-desc-${id}`}>{description}</div>
      <div data-testid={`preview-${id}`}>{preview}</div>
      <pre data-testid={`code-${id}`}>{code}</pre>
    </div>
  ),
}));

import TableWithTabDemo from '../../../app/tableWithTab/page';

// ─── Shared employee data (mirrors component) ─────────────────────────────────
const EMPLOYEES = [
  { id: 1, name: 'James Smith',  email: 'jamesmith@sample.com',    role: 'Admin',   department: 'IT',      location: 'New York',      active: true  },
  { id: 2, name: 'Mary Johnson', email: 'mary.johnson@sample.com', role: 'Manager', department: 'Product', location: 'San Francisco', active: true  },
  { id: 3, name: 'Robert Brown', email: 'robert.brown@sample.com', role: 'Analyst', department: 'Finance', location: 'Chicago',       active: false },
  { id: 4, name: 'Linda Davis',  email: 'linda.davis@sample.com',  role: 'Agent',   department: 'Support', location: 'Austin',        active: true  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// Render
// ═══════════════════════════════════════════════════════════════════════════════

describe('TableWithTabDemo — Render', () => {
  it('renders without crashing', () => {
    const { container } = render(<TableWithTabDemo />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders page heading "Table With Tabs"', () => {
    render(<TableWithTabDemo />);
    expect(screen.getByText('Table With Tabs')).toBeInTheDocument();
  });

  it('renders page description text', () => {
    render(<TableWithTabDemo />);
    expect(screen.getByText(/Click on any row to open it in a tab/i)).toBeInTheDocument();
  });

  it('renders description about rearranging tabs', () => {
    render(<TableWithTabDemo />);
    expect(screen.getByText(/rearranged, closed/i)).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// CodePreview sections
// ═══════════════════════════════════════════════════════════════════════════════

describe('TableWithTabDemo — Sections', () => {
  it('renders 3 CodePreview sections', () => {
    render(<TableWithTabDemo />);
    const sections = screen.getAllByTestId('code-preview');
    expect(sections.length).toBe(3);
  });

  it('renders "Tabs With Header Close Icon (Browser-like)" section title', () => {
    render(<TableWithTabDemo />);
    expect(screen.getByText('Tabs With Header Close Icon (Browser-like)')).toBeInTheDocument();
  });

  it('renders "Vertical Tabs (Tabs on the Right)" section title', () => {
    render(<TableWithTabDemo />);
    expect(screen.getByText('Vertical Tabs (Tabs on the Right)')).toBeInTheDocument();
  });

  it('renders "Vertical Tabs with Custom Label" section title', () => {
    render(<TableWithTabDemo />);
    expect(screen.getByText('Vertical Tabs with Custom Label')).toBeInTheDocument();
  });

  it('section 1 has correct id "header-close-icon"', () => {
    render(<TableWithTabDemo />);
    expect(document.getElementById('header-close-icon')).toBeInTheDocument();
  });

  it('section 2 has correct id "vertical-tabs-right"', () => {
    render(<TableWithTabDemo />);
    expect(document.getElementById('vertical-tabs-right')).toBeInTheDocument();
  });

  it('section 3 has correct id "vertical-tabs-right-custom-label"', () => {
    render(<TableWithTabDemo />);
    expect(document.getElementById('vertical-tabs-right-custom-label')).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Section descriptions
// ═══════════════════════════════════════════════════════════════════════════════

describe('TableWithTabDemo — Section Descriptions', () => {
  it('section 1 description mentions showTabCloseIconInHeader', () => {
    render(<TableWithTabDemo />);
    expect(screen.getAllByText(/showTabCloseIconInHeader/).length).toBeGreaterThan(0);
  });

  it('section 1 description mentions tabCloseIconPosition', () => {
    render(<TableWithTabDemo />);
    expect(screen.getAllByText(/tabCloseIconPosition/).length).toBeGreaterThan(0);
  });

  it('section 1 description mentions tabCloseIconContent', () => {
    render(<TableWithTabDemo />);
    expect(screen.getByText(/tabCloseIconContent/)).toBeInTheDocument();
  });

  it('section 2 description mentions tabs on right', () => {
    render(<TableWithTabDemo />);
    const rightTexts = screen.getAllByText('right');
    expect(rightTexts.length).toBeGreaterThan(0);
  });

  it('section 3 description mentions employee ID as label', () => {
    render(<TableWithTabDemo />);
    const idTexts = screen.getAllByText('ID');
    expect(idTexts.length).toBeGreaterThan(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// MahatiTableWithTab instances and props
// ═══════════════════════════════════════════════════════════════════════════════

describe('TableWithTabDemo — MahatiTableWithTab Instances', () => {
  it('renders 3 MahatiTableWithTab instances (one per section)', () => {
    render(<TableWithTabDemo />);
    const instances = screen.getAllByTestId('mahati-table-with-tab');
    expect(instances.length).toBe(3);
  });

  it('section 1 uses outline variant', () => {
    render(<TableWithTabDemo />);
    const instances = screen.getAllByTestId('mahati-table-with-tab');
    expect(instances[0].getAttribute('data-variant')).toBe('outline');
  });

  it('section 2 uses gradient variant', () => {
    render(<TableWithTabDemo />);
    const instances = screen.getAllByTestId('mahati-table-with-tab');
    expect(instances[1].getAttribute('data-variant')).toBe('gradient');
  });

  it('section 3 uses gradient variant', () => {
    render(<TableWithTabDemo />);
    const instances = screen.getAllByTestId('mahati-table-with-tab');
    expect(instances[2].getAttribute('data-variant')).toBe('gradient');
  });

  it('section 1 uses horizontal orientation', () => {
    render(<TableWithTabDemo />);
    const instances = screen.getAllByTestId('mahati-table-with-tab');
    expect(instances[0].getAttribute('data-orientation')).toBe('horizontal');
  });

  it('section 2 uses vertical orientation', () => {
    render(<TableWithTabDemo />);
    const instances = screen.getAllByTestId('mahati-table-with-tab');
    expect(instances[1].getAttribute('data-orientation')).toBe('vertical');
  });

  it('section 3 uses vertical orientation', () => {
    render(<TableWithTabDemo />);
    const instances = screen.getAllByTestId('mahati-table-with-tab');
    expect(instances[2].getAttribute('data-orientation')).toBe('vertical');
  });

  it('section 2 has verticalPosition="right"', () => {
    render(<TableWithTabDemo />);
    const instances = screen.getAllByTestId('mahati-table-with-tab');
    expect(instances[1].getAttribute('data-vertical-position')).toBe('right');
  });

  it('section 3 has verticalPosition="right"', () => {
    render(<TableWithTabDemo />);
    const instances = screen.getAllByTestId('mahati-table-with-tab');
    expect(instances[2].getAttribute('data-vertical-position')).toBe('right');
  });

  it('all instances have showTabCloseIconInHeader=true', () => {
    render(<TableWithTabDemo />);
    const instances = screen.getAllByTestId('mahati-table-with-tab');
    instances.forEach(inst => {
      expect(inst.getAttribute('data-show-close')).toBe('true');
    });
  });

  it('all instances have tabCloseIconPosition="right"', () => {
    render(<TableWithTabDemo />);
    const instances = screen.getAllByTestId('mahati-table-with-tab');
    instances.forEach(inst => {
      expect(inst.getAttribute('data-close-position')).toBe('right');
    });
  });

  it('all instances have rearrange=true', () => {
    render(<TableWithTabDemo />);
    const instances = screen.getAllByTestId('mahati-table-with-tab');
    instances.forEach(inst => {
      expect(inst.getAttribute('data-rearrange')).toBe('true');
    });
  });

  it('section 3 has tabLabelKey="id"', () => {
    render(<TableWithTabDemo />);
    const instances = screen.getAllByTestId('mahati-table-with-tab');
    expect(instances[2].getAttribute('data-tab-label-key')).toBe('id');
  });

  it('sections 1 and 2 do not have tabLabelKey', () => {
    render(<TableWithTabDemo />);
    const instances = screen.getAllByTestId('mahati-table-with-tab');
    expect(instances[0].getAttribute('data-tab-label-key')).toBeNull();
    expect(instances[1].getAttribute('data-tab-label-key')).toBeNull();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Table columns
// ═══════════════════════════════════════════════════════════════════════════════

describe('TableWithTabDemo — Table Columns', () => {
  it('renders ID column header', () => {
    render(<TableWithTabDemo />);
    expect(screen.getAllByText('ID').length).toBeGreaterThan(0);
  });

  it('renders Name column header', () => {
    render(<TableWithTabDemo />);
    expect(screen.getAllByText('Name').length).toBeGreaterThan(0);
  });

  it('renders Email column header', () => {
    render(<TableWithTabDemo />);
    expect(screen.getAllByText('Email').length).toBeGreaterThan(0);
  });

  it('renders Role column header', () => {
    render(<TableWithTabDemo />);
    expect(screen.getAllByText('Role').length).toBeGreaterThan(0);
  });

  it('renders Department column header', () => {
    render(<TableWithTabDemo />);
    expect(screen.getAllByText('Department').length).toBeGreaterThan(0);
  });

  it('renders Location column header', () => {
    render(<TableWithTabDemo />);
    expect(screen.getAllByText('Location').length).toBeGreaterThan(0);
  });

  it('renders Active column header', () => {
    render(<TableWithTabDemo />);
    expect(screen.getAllByText('Active').length).toBeGreaterThan(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Employee data rendered in table rows
// ═══════════════════════════════════════════════════════════════════════════════

describe('TableWithTabDemo — Employee Data in Table', () => {
  it('renders James Smith in table', () => {
    render(<TableWithTabDemo />);
    expect(screen.getAllByText('James Smith').length).toBeGreaterThan(0);
  });

  it('renders Mary Johnson in table', () => {
    render(<TableWithTabDemo />);
    expect(screen.getAllByText('Mary Johnson').length).toBeGreaterThan(0);
  });

  it('renders Robert Brown in table', () => {
    render(<TableWithTabDemo />);
    expect(screen.getAllByText('Robert Brown').length).toBeGreaterThan(0);
  });

  it('renders Linda Davis in table', () => {
    render(<TableWithTabDemo />);
    expect(screen.getAllByText('Linda Davis').length).toBeGreaterThan(0);
  });

  it('renders all 4 employee rows per table instance', () => {
    render(<TableWithTabDemo />);
    // Each MahatiTableWithTab renders 4 rows → 3 instances × 4 = 12 row-1..row-4 entries
    expect(screen.getAllByTestId('row-1').length).toBe(3);
    expect(screen.getAllByTestId('row-2').length).toBe(3);
    expect(screen.getAllByTestId('row-3').length).toBe(3);
    expect(screen.getAllByTestId('row-4').length).toBe(3);
  });

  it('renders Admin role', () => {
    render(<TableWithTabDemo />);
    expect(screen.getAllByText('Admin').length).toBeGreaterThan(0);
  });

  it('renders Manager role', () => {
    render(<TableWithTabDemo />);
    expect(screen.getAllByText('Manager').length).toBeGreaterThan(0);
  });

  it('renders Analyst role', () => {
    render(<TableWithTabDemo />);
    expect(screen.getAllByText('Analyst').length).toBeGreaterThan(0);
  });

  it('renders Agent role', () => {
    render(<TableWithTabDemo />);
    expect(screen.getAllByText('Agent').length).toBeGreaterThan(0);
  });

  it('renders New York location', () => {
    render(<TableWithTabDemo />);
    expect(screen.getAllByText('New York').length).toBeGreaterThan(0);
  });

  it('renders San Francisco location', () => {
    render(<TableWithTabDemo />);
    expect(screen.getAllByText('San Francisco').length).toBeGreaterThan(0);
  });

  it('renders IT department', () => {
    render(<TableWithTabDemo />);
    expect(screen.getAllByText('IT').length).toBeGreaterThan(0);
  });

  it('renders email addresses', () => {
    render(<TableWithTabDemo />);
    expect(screen.getAllByText('jamesmith@sample.com').length).toBeGreaterThan(0);
    expect(screen.getAllByText('mary.johnson@sample.com').length).toBeGreaterThan(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// EmployeeTabContent (renderTabContent)
// ═══════════════════════════════════════════════════════════════════════════════

describe('TableWithTabDemo — EmployeeTabContent', () => {
  it('renders tab content for each employee', () => {
    render(<TableWithTabDemo />);
    EMPLOYEES.forEach(emp => {
      const contentAreas = screen.getAllByTestId(`tab-content-${emp.id}`);
      expect(contentAreas.length).toBeGreaterThan(0);
    });
  });

  it('renders employee name as heading in tab content', () => {
    render(<TableWithTabDemo />);
    // James Smith appears in both table row and tab content heading
    const jamesHeadings = screen.getAllByText('James Smith');
    expect(jamesHeadings.length).toBeGreaterThan(0);
  });

  it('renders role · department · location in tab content', () => {
    render(<TableWithTabDemo />);
    expect(screen.getAllByText(/Admin · IT · New York/).length).toBeGreaterThan(0);
  });

  it('renders Summary section heading in tab content', () => {
    render(<TableWithTabDemo />);
    expect(screen.getAllByText('Summary').length).toBeGreaterThan(0);
  });

  it('renders James Smith summary text', () => {
    render(<TableWithTabDemo />);
    expect(
      screen.getAllByText(/overseeing infrastructure security/i).length
    ).toBeGreaterThan(0);
  });

  it('renders Mary Johnson summary text', () => {
    render(<TableWithTabDemo />);
    expect(
      screen.getAllByText(/product strategy for the core platform/i).length
    ).toBeGreaterThan(0);
  });

  it('renders Robert Brown summary text', () => {
    render(<TableWithTabDemo />);
    expect(
      screen.getAllByText(/financial reports and supports quarterly/i).length
    ).toBeGreaterThan(0);
  });

  it('renders Linda Davis summary text', () => {
    render(<TableWithTabDemo />);
    expect(
      screen.getAllByText(/enterprise customer support/i).length
    ).toBeGreaterThan(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// DemoGrid wrapper
// ═══════════════════════════════════════════════════════════════════════════════

describe('TableWithTabDemo — DemoGrid', () => {
  it('renders grid wrappers for each section', () => {
    const { container } = render(<TableWithTabDemo />);
    const grids = container.querySelectorAll('.grid.grid-cols-1.gap-6');
    expect(grids.length).toBe(3);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Code snippets
// ═══════════════════════════════════════════════════════════════════════════════

it('renders MahatiTableWithTab code snippets', () => {
  render(<TableWithTabDemo />);
  const codeBlocks = screen.getAllByTestId(/code-/);

  expect(codeBlocks.length).toBeGreaterThan(0);

  const hasComponent = codeBlocks.some(block =>
    block.textContent?.includes('MahatiTableWithTab')
  );

  expect(hasComponent).toBe(true);
});

