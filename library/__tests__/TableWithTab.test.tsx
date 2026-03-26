import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { TableWithTab } from '../src/components/TableWithTab';

// ─── FIXED Mock TabbedInterface ──────────────────────────────────────────────
jest.mock('../src/components/TabbedInterface', () => ({
  TabbedInterface: ({ tabs, onCloseTab }: any) => (
    <div data-testid="tabbed-interface">
      {tabs.map((tab: any, i: number) => (
        <div key={i} data-testid={`tab-${i}`}>
          <span data-testid={`tab-label-${i}`}>{tab.label}</span>
          <div data-testid={`tab-content-${i}`}>{tab.content}</div>
          <button 
            data-testid={`tab-close-header-${i}`} 
            onClick={() => onCloseTab?.(i)}
            aria-label="Close tab"
          >
            Close Header
          </button>
        </div>
      ))}
    </div>
  ),
}));

// ─── Test Data ───────────────────────────────────────────────────────────────
const mockHeaders = [
  { label: 'Name',  key: 'name' },
  { label: 'Email', key: 'email' },
  { label: 'Age',   key: 'age' },
];

const mockData = [
  { name: 'John Doe',    email: 'john@example.com', age: 30 },
  { name: 'Jane Smith',  email: 'jane@example.com', age: 25 },
  { name: 'Bob Johnson', email: 'bob@example.com',  age: 35 },
];

// ─── Test Setup ──────────────────────────────────────────────────────────────
const user = userEvent.setup();

describe('TableWithTab', () => {
  // ─── Render ───────────────────────────────────────────────────────────────
  describe('Render', () => {
    it('should render table element', () => {
      render(<TableWithTab tableProps={{ headers: mockHeaders, data: mockData }} />);
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('should apply testId to wrapper', () => {
      render(<TableWithTab tableProps={{ headers: mockHeaders, data: mockData }} testId="twt" />);
      expect(screen.getByTestId('twt')).toBeInTheDocument();
    });

    it('should render all headers', () => {
      render(<TableWithTab tableProps={{ headers: mockHeaders, data: mockData }} />);
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Age')).toBeInTheDocument();
    });

    it('should render all data rows', () => {
      render(<TableWithTab tableProps={{ headers: mockHeaders, data: mockData }} />);
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
    });

    it('should show "No records to display." when data is empty', () => {
      render(<TableWithTab tableProps={{ headers: mockHeaders, data: [] }} />);
      expect(screen.getByText('No records to display.')).toBeInTheDocument();
    });

    it('should not render TabbedInterface when no tabs open', () => {
      render(<TableWithTab tableProps={{ headers: mockHeaders, data: mockData }} />);
      expect(screen.queryByTestId('tabbed-interface')).not.toBeInTheDocument();
    });
  });

  // ─── Title / Description ──────────────────────────────────────────────────
  describe('Title and Description', () => {
    it('should render title', () => {
      render(<TableWithTab tableProps={{ headers: mockHeaders, data: mockData }} title="My Table" />);
      expect(screen.getByText('My Table')).toBeInTheDocument();
    });

    it('should render description', () => {
      render(<TableWithTab tableProps={{ headers: mockHeaders, data: mockData }} description="Desc text" />);
      expect(screen.getByText('Desc text')).toBeInTheDocument();
    });
  });

  // ─── FIXED: Row Click → Open Tab ──────────────────────────────────────────
  describe('Row Click → Open Tab', () => {
    it('should open TabbedInterface when row clicked', async () => {
      render(<TableWithTab tableProps={{ headers: mockHeaders, data: mockData }} />);
      const rows = screen.getAllByRole('row');
      await user.click(rows[1]); // Skip header row (index 0)
      await waitFor(() => {
        expect(screen.getByTestId('tabbed-interface')).toBeInTheDocument();
      });
    });

    it('should show "Open Rows (1)" after clicking one row', async () => {
      render(<TableWithTab tableProps={{ headers: mockHeaders, data: mockData }} />);
      const rows = screen.getAllByRole('row');
      await user.click(rows[1]);
      await waitFor(() => {
        expect(screen.getByText('Open Rows (1)')).toBeInTheDocument();
      });
    });

    it('should use first header key as tab label by default', async () => {
      render(<TableWithTab tableProps={{ headers: mockHeaders, data: mockData }} />);
      const rows = screen.getAllByRole('row');
      await user.click(rows[1]);
      await waitFor(() => {
        expect(screen.getByTestId('tab-label-0')).toHaveTextContent('John Doe');
      });
    });

    it('should use tabLabelKey for tab label', async () => {
      render(
        <TableWithTab
          tableProps={{ headers: mockHeaders, data: mockData }}
          tabLabelKey="email"
        />
      );
      const rows = screen.getAllByRole('row');
      await user.click(rows[1]);
      await waitFor(() => {
        expect(screen.getByTestId('tab-label-0')).toHaveTextContent('john@example.com');
      });
    });

    it('should open multiple tabs when multiple rows clicked', async () => {
      render(<TableWithTab tableProps={{ headers: mockHeaders, data: mockData }} />);
      const rows = screen.getAllByRole('row');
      await user.click(rows[1]);
      await user.click(rows[2]);
      await waitFor(() => {
        expect(screen.getByText('Open Rows (2)')).toBeInTheDocument();
      });
    });

    it('should call onRowOpenInTab with row data when tab opened', async () => {
      const onRowOpenInTab = jest.fn();
      render(
        <TableWithTab
          tableProps={{ headers: mockHeaders, data: mockData }}
          onRowOpenInTab={onRowOpenInTab}
        />
      );
      const rows = screen.getAllByRole('row');
      await user.click(rows[1]);
      expect(onRowOpenInTab).toHaveBeenCalledWith(mockData[0]);
    });
  });

  // ─── FIXED: Deselect / Toggle Row ─────────────────────────────────────────
  describe('Deselect Row (Toggle)', () => {
    it('should close tab when same row clicked again', async () => {
      render(<TableWithTab tableProps={{ headers: mockHeaders, data: mockData }} />);
      const rows = screen.getAllByRole('row');
      await user.click(rows[1]); // open
      await waitFor(() => {
        expect(screen.getByTestId('tabbed-interface')).toBeInTheDocument();
      });
      await user.click(rows[1]); // close
      await waitFor(() => {
        expect(screen.queryByTestId('tabbed-interface')).not.toBeInTheDocument();
      });
    });

    it('should show Open Rows count decreasing when tab closed', async () => {
      render(<TableWithTab tableProps={{ headers: mockHeaders, data: mockData }} />);
      const rows = screen.getAllByRole('row');
      await user.click(rows[1]);
      await user.click(rows[2]);
      await waitFor(() => {
        expect(screen.getByText('Open Rows (2)')).toBeInTheDocument();
      });
      await user.click(rows[1]); // deselect first
      await waitFor(() => {
        expect(screen.getByText('Open Rows (1)')).toBeInTheDocument();
      });
    });
  });

  // ─── FIXED: Close Tab ─────────────────────────────────────────────────────
  describe('Close Tab', () => {
    it('should close tab when header close button clicked', async () => {
      render(<TableWithTab tableProps={{ headers: mockHeaders, data: mockData }} />);
      const rows = screen.getAllByRole('row');
      await user.click(rows[1]);
      await waitFor(() => {
        expect(screen.getByTestId('tabbed-interface')).toBeInTheDocument();
      });
      await user.click(screen.getByTestId('tab-close-header-0'));
      await waitFor(() => {
        expect(screen.queryByTestId('tabbed-interface')).not.toBeInTheDocument();
      });
    });

    it('should close correct tab among multiple', async () => {
      render(<TableWithTab tableProps={{ headers: mockHeaders, data: mockData }} />);
      const rows = screen.getAllByRole('row');
      await user.click(rows[1]);
      await user.click(rows[2]);
      await waitFor(() => {
        expect(screen.getByTestId('tab-close-header-0')).toBeInTheDocument();
      });
      await user.click(screen.getByTestId('tab-close-header-0')); // close first tab
      await waitFor(() => {
        expect(screen.getByText('Open Rows (1)')).toBeInTheDocument();
      });
    });
  });

  // ─── renderTabContent ─────────────────────────────────────────────────────
  describe('renderTabContent', () => {
    it('should use custom renderTabContent when provided', async () => {
      render(
        <TableWithTab
          tableProps={{ headers: mockHeaders, data: mockData }}
          renderTabContent={(row: any) => (
            <div data-testid="custom-content">{row.name} - custom</div>
          )}
        />
      );
      const rows = screen.getAllByRole('row');
      await user.click(rows[1]);
      await waitFor(() => {
        expect(screen.getByTestId('custom-content')).toHaveTextContent('John Doe - custom');
      });
    });
  });

  // ─── Cell Rendering ───────────────────────────────────────────────────────
  describe('Cell Rendering', () => {
    it('should render null cell as "-"', () => {
      render(
        <TableWithTab
          tableProps={{
            headers: [{ label: 'X', key: 'x' }],
            data: [{ x: null }],
          }}
        />
      );
      expect(screen.getByText('-')).toBeInTheDocument();
    });

    it('should render boolean true as "Yes"', () => {
      render(
        <TableWithTab
          tableProps={{
            headers: [{ label: 'Active', key: 'active' }],
            data: [{ active: true }],
          }}
        />
      );
      expect(screen.getByText('Yes')).toBeInTheDocument();
    });
  });
});
