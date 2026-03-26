import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Table } from '../src/components/Table';

const mockHeaders = [
  { label: 'Name', key: 'name' },
  { label: 'Email', key: 'email' },
  { label: 'Age', key: 'age' },
];

const mockData = [
  { name: 'John Doe',    email: 'john@example.com', age: 30 },
  { name: 'Jane Smith',  email: 'jane@example.com', age: 25 },
  { name: 'Bob Johnson', email: 'bob@example.com',  age: 35 },
];

describe('Table', () => {

  // ─── Render ───────────────────────────────────────────────────────────────

  describe('Render', () => {
    it('should render table element', () => {
      render(<Table headers={mockHeaders} data={mockData} />);
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('should apply tableTestId to wrapper', () => {
      render(<Table headers={mockHeaders} data={mockData} tableTestId="my-table" />);
      expect(screen.getByTestId('my-table')).toBeInTheDocument();
    });

    it('should render thead', () => {
      const { container } = render(<Table headers={mockHeaders} data={mockData} />);
      expect(container.querySelector('thead')).toBeInTheDocument();
    });

    it('should render tbody', () => {
      const { container } = render(<Table headers={mockHeaders} data={mockData} />);
      expect(container.querySelector('tbody')).toBeInTheDocument();
    });
  });

  // ─── Headers ──────────────────────────────────────────────────────────────

  describe('Headers', () => {
    it('should render all header labels', () => {
      render(<Table headers={mockHeaders} data={mockData} />);
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Age')).toBeInTheDocument();
    });

    it('should render correct number of th elements', () => {
      const { container } = render(<Table headers={mockHeaders} data={mockData} />);
      expect(container.querySelectorAll('th').length).toBe(3);
    });

    it('should render Actions header when actions prop provided', () => {
      render(
        <Table headers={mockHeaders} data={mockData} actions={() => <button>Edit</button>} />
      );
      expect(screen.getByText('Actions')).toBeInTheDocument();
    });

    it('should not render Actions header when actions not provided', () => {
      render(<Table headers={mockHeaders} data={mockData} />);
      expect(screen.queryByText('Actions')).not.toBeInTheDocument();
    });

    it('should render ReactNode header label', () => {
      const headers = [{ label: <span data-testid="custom-hdr">Custom</span>, key: 'name' }];
      render(<Table headers={headers} data={[{ name: 'A' }]} />);
      expect(screen.getByTestId('custom-hdr')).toBeInTheDocument();
    });
  });

  // ─── Data Rows ────────────────────────────────────────────────────────────

  describe('Data Rows', () => {
    it('should render all data rows', () => {
      render(<Table headers={mockHeaders} data={mockData} />);
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
    });

    it('should render correct number of tr elements in tbody', () => {
      const { container } = render(<Table headers={mockHeaders} data={mockData} />);
      const tbody = container.querySelector('tbody');
      expect(tbody?.querySelectorAll('tr').length).toBe(3);
    });

    it('should render cell values', () => {
      render(<Table headers={mockHeaders} data={mockData} />);
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
      expect(screen.getByText('35')).toBeInTheDocument();
    });

    it('should show "No records found" when data is empty', () => {
      render(<Table headers={mockHeaders} data={[]} />);
      expect(screen.getByText('No records found')).toBeInTheDocument();
    });

    it('should apply highlightRowColor as inline style', () => {
      const { container } = render(
        <Table headers={mockHeaders} data={mockData} highlightRowColor="#ffd700" />
      );
      const rows = container.querySelectorAll('tbody tr');
      expect((rows[0] as HTMLElement).style.backgroundColor).toBe('rgb(255, 215, 0)');
    });

    it('should not apply row style when highlightRowColor not provided', () => {
      const { container } = render(<Table headers={mockHeaders} data={mockData} />);
      const rows = container.querySelectorAll('tbody tr');
      expect((rows[0] as HTMLElement).style.backgroundColor).toBe('');
    });
  });

  // ─── Cell Rendering (renderCell) ──────────────────────────────────────────

  describe('renderCell', () => {
    it('should render null as "-"', () => {
      render(<Table headers={[{ label: 'X', key: 'x' }]} data={[{ x: null }]} />);
      expect(screen.getByText('-')).toBeInTheDocument();
    });

    it('should render undefined as "-"', () => {
      render(<Table headers={[{ label: 'X', key: 'x' }]} data={[{ x: undefined }]} />);
      expect(screen.getByText('-')).toBeInTheDocument();
    });

    it('should render boolean true as "Yes"', () => {
      render(
        <Table
          headers={[{ label: 'Active', key: 'active' }]}
          data={[{ active: true }]}
        />
      );
      expect(screen.getByText('Yes')).toBeInTheDocument();
    });

    it('should render boolean false as "No"', () => {
      render(
        <Table
          headers={[{ label: 'Active', key: 'active' }]}
          data={[{ active: false }]}
        />
      );
      expect(screen.getByText('No')).toBeInTheDocument();
    });

    it('should render array of strings as comma-joined', () => {
      render(
        <Table
          headers={[{ label: 'Tags', key: 'tags' }]}
          data={[{ tags: ['a', 'b', 'c'] }]}
        />
      );
      expect(screen.getByText('a, b, c')).toBeInTheDocument();
    });

    it('should render object as JSON string', () => {
      render(
        <Table
          headers={[{ label: 'Meta', key: 'meta' }]}
          data={[{ meta: { foo: 'bar' } }]}
        />
      );
      expect(screen.getByText('{"foo":"bar"}')).toBeInTheDocument();
    });

    it('should render ReactNode value directly', () => {
      render(
        <Table
          headers={[{ label: 'Icon', key: 'icon' }]}
          data={[{ icon: <span data-testid="custom-cell">★</span> }]}
        />
      );
      expect(screen.getByTestId('custom-cell')).toBeInTheDocument();
    });

    it('should render Date as localeString', () => {
      const date = new Date('2024-01-01T00:00:00');
      render(
        <Table
          headers={[{ label: 'Date', key: 'date' }]}
          data={[{ date }]}
        />
      );
      expect(screen.getByText(date.toLocaleString())).toBeInTheDocument();
    });

    it('should truncate textWrap columns beyond maxLength', () => {
      const longText = 'A'.repeat(150);
      render(
        <Table
          headers={[{ label: 'Notes', key: 'notes' }]}
          data={[{ notes: longText }]}
          textWrapColumns={['notes']}
          textWrapMaxLength={120}
        />
      );
      expect(screen.getByText('A'.repeat(120) + '...')).toBeInTheDocument();
    });

    it('should not truncate textWrap column within maxLength', () => {
      const shortText = 'A'.repeat(50);
      render(
        <Table
          headers={[{ label: 'Notes', key: 'notes' }]}
          data={[{ notes: shortText }]}
          textWrapColumns={['notes']}
          textWrapMaxLength={120}
        />
      );
      expect(screen.getByText(shortText)).toBeInTheDocument();
    });

    it('should use per-column maxLength from textWrapColumnMaxLengths', () => {
      const longText = 'B'.repeat(80);
      render(
        <Table
          headers={[{ label: 'Notes', key: 'notes' }]}
          data={[{ notes: longText }]}
          textWrapColumns={['notes']}
          textWrapColumnMaxLengths={{ notes: 50 }}
        />
      );
      expect(screen.getByText('B'.repeat(50) + '...')).toBeInTheDocument();
    });
  });

  // ─── Actions ─────────────────────────────────────────────────────────────

  describe('Actions', () => {
    it('should render action cell per row', () => {
      render(
        <Table
          headers={mockHeaders}
          data={mockData}
          actions={(row: any) => (
            <button data-testid={`edit-${row.name}`}>Edit</button>
          )}
        />
      );
      expect(screen.getByTestId('edit-John Doe')).toBeInTheDocument();
      expect(screen.getByTestId('edit-Jane Smith')).toBeInTheDocument();
    });

    it('should pass full row to actions function', () => {
      const actionsFn = jest.fn(() => <span>act</span>);
      render(<Table headers={mockHeaders} data={mockData} actions={actionsFn} />);
      expect(actionsFn).toHaveBeenCalledWith(mockData[0]);
      expect(actionsFn).toHaveBeenCalledWith(mockData[1]);
    });
  });

  // ─── Search ───────────────────────────────────────────────────────────────

  describe('Search', () => {
    it('should render search input when searchable=true', () => {
      render(<Table headers={mockHeaders} data={mockData} searchable searchTerm="" onSearch={jest.fn()} />);
      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    });

    it('should not render search when searchable=false', () => {
      render(<Table headers={mockHeaders} data={mockData} />);
      expect(screen.queryByPlaceholderText('Search...')).not.toBeInTheDocument();
    });

    it('should call onSearch when input changes', () => {
      const onSearch = jest.fn();
      render(<Table headers={mockHeaders} data={mockData} searchable searchTerm="" onSearch={onSearch} />);
      fireEvent.change(screen.getByPlaceholderText('Search...'), { target: { value: 'John' } });
      expect(onSearch).toHaveBeenCalledWith('John', expect.any(String));
    });

    it('should display current searchTerm value', () => {
      render(<Table headers={mockHeaders} data={mockData} searchable searchTerm="Alice" onSearch={jest.fn()} />);
      expect(screen.getByPlaceholderText('Search...')).toHaveValue('Alice');
    });

    it('should show clear button when searchTerm is non-empty', () => {
      render(<Table headers={mockHeaders} data={mockData} searchable searchTerm="test" onSearch={jest.fn()} onResetSearch={jest.fn()} />);
      // XMarkIcon button appears
      expect(screen.getByRole('button', { name: '' })).toBeInTheDocument();
    });

    it('should call onResetSearch when clear button clicked', () => {
      const onResetSearch = jest.fn();
      render(
        <Table
          headers={mockHeaders} data={mockData}
          searchable searchTerm="test"
          onSearch={jest.fn()} onResetSearch={onResetSearch}
        />
      );
      // click the X clear button (first button in search area)
      const buttons = screen.getAllByRole('button');
      fireEvent.click(buttons[0]);
      expect(onResetSearch).toHaveBeenCalled();
    });

    it('should render search mode select', () => {
      render(<Table headers={mockHeaders} data={mockData} searchable searchTerm="" onSearch={jest.fn()} />);
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('should render default searchModeOptions', () => {
      render(<Table headers={mockHeaders} data={mockData} searchable searchTerm="" onSearch={jest.fn()} />);
      expect(screen.getByText('Includes')).toBeInTheDocument();
      expect(screen.getByText('Starts With')).toBeInTheDocument();
    });
  });

  // ─── Download Buttons ─────────────────────────────────────────────────────

  describe('Download Buttons', () => {
    it('should render PDF download button when onDownloadPDF provided', () => {
      const onPDF = jest.fn();
      render(<Table headers={mockHeaders} data={mockData} onDownloadPDF={onPDF} />);
      // ArrowDownOnSquareIcon button
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('should call onDownloadPDF with data and headers', () => {
      const onPDF = jest.fn();
      render(<Table headers={mockHeaders} data={mockData} onDownloadPDF={onPDF} />);
      const buttons = screen.getAllByRole('button');
      fireEvent.click(buttons[0]);
      expect(onPDF).toHaveBeenCalledWith(mockData, mockHeaders);
    });

    it('should render Excel download button', () => {
      const onExcel = jest.fn();
      render(<Table headers={mockHeaders} data={mockData} onDownloadExcel={onExcel} />);
      expect(screen.getByText('Excel')).toBeInTheDocument();
    });

    it('should call onDownloadExcel with data and headers', () => {
      const onExcel = jest.fn();
      render(<Table headers={mockHeaders} data={mockData} onDownloadExcel={onExcel} />);
      fireEvent.click(screen.getByText('Excel'));
      expect(onExcel).toHaveBeenCalledWith(mockData, mockHeaders);
    });
  });

  // ─── Summary (Expand Rows) ────────────────────────────────────────────────

  describe('Summary', () => {
    const summaryData = [
      { name: 'Alice', summary: 'Alice summary text', age: 28 },
      { name: 'Bob',   summary: 'Bob summary text',   age: 32 },
    ];

    it('should expand row on click when summary="single"', () => {
      render(<Table headers={mockHeaders} data={summaryData} summary="single" />);
      const rows = screen.getAllByRole('row');
      fireEvent.click(rows[1]); // first data row
      expect(screen.getByText('Alice summary text')).toBeInTheDocument();
    });

    it('should collapse expanded row on second click (single)', () => {
      render(<Table headers={mockHeaders} data={summaryData} summary="single" />);
      const rows = screen.getAllByRole('row');
      fireEvent.click(rows[1]);
      fireEvent.click(rows[1]);
      expect(screen.queryByText('Alice summary text')).not.toBeInTheDocument();
    });

    it('should only keep one row expanded when summary="single"', () => {
      render(<Table headers={mockHeaders} data={summaryData} summary="single" />);
      const rows = screen.getAllByRole('row');
      fireEvent.click(rows[1]); // expand Alice
      fireEvent.click(rows[2]); // expand Bob — should collapse Alice
      expect(screen.queryByText('Alice summary text')).not.toBeInTheDocument();
      expect(screen.getByText('Bob summary text')).toBeInTheDocument();
    });

    it('should allow multiple rows expanded when summary="multi"', () => {
      render(<Table headers={mockHeaders} data={summaryData} summary="multi" />);
      const rows = screen.getAllByRole('row');
      fireEvent.click(rows[1]);
      fireEvent.click(rows[2]);
      expect(screen.getByText('Alice summary text')).toBeInTheDocument();
      expect(screen.getByText('Bob summary text')).toBeInTheDocument();
    });

    it('should not expand when summary not set', () => {
      render(<Table headers={mockHeaders} data={summaryData} />);
      const rows = screen.getAllByRole('row');
      fireEvent.click(rows[1]);
      expect(screen.queryByText('Alice summary text')).not.toBeInTheDocument();
    });
  });

  // ─── Pagination ───────────────────────────────────────────────────────────

  describe('Pagination', () => {
    it('should not render pagination when paginationRequired=false', () => {
      render(<Table headers={mockHeaders} data={mockData} paginationRequired={false} />);
      expect(screen.queryByText('Previous')).not.toBeInTheDocument();
    });

    it('should not render pagination when only 1 page', () => {
      render(
        <Table
          headers={mockHeaders} data={mockData}
          paginationRequired={true}
          page={1} totalCount={3} limit={10}
          setPage={jest.fn()}
        />
      );
      expect(screen.queryByText('Previous')).not.toBeInTheDocument();
    });

    it('should render Previous/Next when multiple pages', () => {
      render(
        <Table
          headers={mockHeaders} data={mockData}
          paginationRequired={true}
          page={2} totalCount={30} limit={10}
          setPage={jest.fn()}
        />
      );
      expect(screen.getByText('Previous')).toBeInTheDocument();
      expect(screen.getByText('Next')).toBeInTheDocument();
    });

    it('should disable Previous on first page', () => {
      render(
        <Table
          headers={mockHeaders} data={mockData}
          paginationRequired={true}
          page={1} totalCount={30} limit={10}
          setPage={jest.fn()}
        />
      );
      expect(screen.getByText('Previous')).toBeDisabled();
    });

    it('should disable Next on last page', () => {
      render(
        <Table
          headers={mockHeaders} data={mockData}
          paginationRequired={true}
          page={3} totalCount={30} limit={10}
          setPage={jest.fn()}
        />
      );
      expect(screen.getByText('Next')).toBeDisabled();
    });

    it('should call setPage with page+1 when Next clicked', () => {
      const setPage = jest.fn();
      render(
        <Table
          headers={mockHeaders} data={mockData}
          paginationRequired={true}
          page={1} totalCount={30} limit={10}
          setPage={setPage}
        />
      );
      fireEvent.click(screen.getByText('Next'));
      expect(setPage).toHaveBeenCalledWith(2);
    });

    it('should call setPage with page-1 when Previous clicked', () => {
      const setPage = jest.fn();
      render(
        <Table
          headers={mockHeaders} data={mockData}
          paginationRequired={true}
          page={3} totalCount={30} limit={10}
          setPage={setPage}
        />
      );
      fireEvent.click(screen.getByText('Previous'));
      expect(setPage).toHaveBeenCalledWith(2);
    });

    it('should render page number buttons', () => {
      render(
        <Table
          headers={mockHeaders} data={mockData}
          paginationRequired={true}
          page={1} totalCount={30} limit={10}
          setPage={jest.fn()}
        />
      );
      // pages 1, 2, 3
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });
  });
});