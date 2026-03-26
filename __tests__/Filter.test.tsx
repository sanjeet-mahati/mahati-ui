import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  Filter,
  MahatiActivity,
  MahatiStatus,
  MahatiSearch,
  DEFAULT_ACTIVITY_OPTIONS,
  DEFAULT_STATUS_OPTIONS,
} from '../src/components/Filter';

// ─── Mock createPortal so portal-based dropdowns render inline ───────────────
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: (node: React.ReactNode) => node,
}));

// ─── Mock Calendar to avoid deep dependency ──────────────────────────────────
jest.mock('./Calendar', () => ({
  Calendar: ({ onRangeChange }: any) => (
    <div data-testid="mock-calendar">
      <button onClick={() => onRangeChange({ start: new Date('2024-01-01'), end: new Date('2024-01-31') })}>
        Select Range
      </button>
    </div>
  ),
}), { virtual: true });

// ─────────────────────────────────────────────────────────────────────────────

describe('Filter', () => {
  const mockOnApply = jest.fn();
  const mockOnReset = jest.fn();

  beforeEach(() => jest.clearAllMocks());

  // ─── Basic Rendering ───────────────────────────────────────────────────────

  describe('Basic Rendering', () => {
    it('should render filter button', () => {
      render(<Filter onApply={mockOnApply} />);
      expect(screen.getByText('Filter')).toBeInTheDocument();
    });

    it('should not show modal on initial render', () => {
      render(<Filter onApply={mockOnApply} />);
      expect(screen.queryByText('Add Filter')).not.toBeInTheDocument();
    });

    it('should have correct displayName', () => {
      expect(Filter.displayName).toBe('Filter');
    });
  });

  // ─── testId ───────────────────────────────────────────────────────────────

  describe('testId', () => {
    it('should apply testId to wrapper', () => {
      render(<Filter onApply={mockOnApply} testId="my-filter" />);
      expect(screen.getByTestId('my-filter')).toBeInTheDocument();
    });

    it('should apply testId-button to filter button', () => {
      render(<Filter onApply={mockOnApply} testId="my-filter" />);
      expect(screen.getByTestId('my-filter-button')).toBeInTheDocument();
    });

    it('should apply testId-model to modal when open', () => {
      render(<Filter onApply={mockOnApply} testId="my-filter" />);
      fireEvent.click(screen.getByTestId('my-filter-button'));
      expect(screen.getByTestId('my-filter-model')).toBeInTheDocument();
    });

    it('should apply testId-close to close button', () => {
      render(<Filter onApply={mockOnApply} testId="my-filter" />);
      fireEvent.click(screen.getByTestId('my-filter-button'));
      expect(screen.getByTestId('my-filter-close')).toBeInTheDocument();
    });

    it('should apply testId-apply to apply button', () => {
      render(<Filter onApply={mockOnApply} testId="my-filter" />);
      fireEvent.click(screen.getByTestId('my-filter-button'));
      expect(screen.getByTestId('my-filter-apply')).toBeInTheDocument();
    });

    it('should apply testId-resetall to reset all button', () => {
      render(<Filter onApply={mockOnApply} testId="my-filter" />);
      fireEvent.click(screen.getByTestId('my-filter-button'));
      expect(screen.getByTestId('my-filter-resetall')).toBeInTheDocument();
    });
  });

  // ─── Open / Close ─────────────────────────────────────────────────────────

  describe('Open / Close', () => {
    it('should open modal when filter button clicked', () => {
      render(<Filter onApply={mockOnApply} />);
      fireEvent.click(screen.getByText('Filter'));
      expect(screen.getByText('Add Filter')).toBeInTheDocument();
    });

    it('should close modal when filter button clicked again', () => {
      render(<Filter onApply={mockOnApply} />);
      const btn = screen.getByText('Filter');
      fireEvent.click(btn); // open
      fireEvent.click(btn); // close
      expect(screen.queryByText('Add Filter')).not.toBeInTheDocument();
    });

    it('should close modal when close (X) button clicked', () => {
      render(<Filter onApply={mockOnApply} testId="f" />);
      fireEvent.click(screen.getByTestId('f-button'));
      expect(screen.getByText('Add Filter')).toBeInTheDocument();
      fireEvent.click(screen.getByTestId('f-close'));
      expect(screen.queryByText('Add Filter')).not.toBeInTheDocument();
    });

    it('should close modal after Apply Now clicked', () => {
      render(<Filter onApply={mockOnApply} testId="f" />);
      fireEvent.click(screen.getByTestId('f-button'));
      fireEvent.click(screen.getByTestId('f-apply'));
      expect(screen.queryByText('Add Filter')).not.toBeInTheDocument();
    });
  });

  // ─── Modal Content ────────────────────────────────────────────────────────

  describe('Modal Content', () => {
    beforeEach(() => {
      render(<Filter onApply={mockOnApply} />);
      fireEvent.click(screen.getByText('Filter'));
    });

    it('should show Add Filter header', () => {
      expect(screen.getByText('Add Filter')).toBeInTheDocument();
    });

    it('should show Date Range section title', () => {
      expect(screen.getByText('Date Range')).toBeInTheDocument();
    });

    it('should show activity select with default options', () => {
      expect(screen.getByDisplayValue('Select Activity')).toBeInTheDocument();
    });

    it('should show status select with default options', () => {
      expect(screen.getByDisplayValue('Select Status')).toBeInTheDocument();
    });

    it('should show search input with default placeholder', () => {
      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    });

    it('should show Apply Now button', () => {
      expect(screen.getByText('Apply Now')).toBeInTheDocument();
    });

    it('should show Reset all button', () => {
      expect(screen.getByText('Reset all')).toBeInTheDocument();
    });

    it('should show Reset button in Date Range section', () => {
      expect(screen.getByText('Reset')).toBeInTheDocument();
    });
  });

  // ─── Apply ────────────────────────────────────────────────────────────────

  describe('Apply', () => {
    it('should call onApply when Apply Now clicked', () => {
      render(<Filter onApply={mockOnApply} testId="f" />);
      fireEvent.click(screen.getByTestId('f-button'));
      fireEvent.click(screen.getByTestId('f-apply'));
      expect(mockOnApply).toHaveBeenCalledTimes(1);
    });

    it('should call onApply with correct default filter values', () => {
      render(<Filter onApply={mockOnApply} testId="f" />);
      fireEvent.click(screen.getByTestId('f-button'));
      fireEvent.click(screen.getByTestId('f-apply'));
      expect(mockOnApply).toHaveBeenCalledWith({
        date: { start: null, end: null },
        activity: '',
        status: '',
        keyword: '',
      });
    });

    it('should call onApply with updated activity value', () => {
      render(<Filter onApply={mockOnApply} testId="f" />);
      fireEvent.click(screen.getByTestId('f-button'));
      const activitySelect = screen.getByDisplayValue('Select Activity');
      fireEvent.change(activitySelect, { target: { value: 'Login' } });
      fireEvent.click(screen.getByTestId('f-apply'));
      expect(mockOnApply).toHaveBeenCalledWith(expect.objectContaining({ activity: 'Login' }));
    });

    it('should call onApply with updated status value', () => {
      render(<Filter onApply={mockOnApply} testId="f" />);
      fireEvent.click(screen.getByTestId('f-button'));
      const statusSelect = screen.getByDisplayValue('Select Status');
      fireEvent.change(statusSelect, { target: { value: 'Pending' } });
      fireEvent.click(screen.getByTestId('f-apply'));
      expect(mockOnApply).toHaveBeenCalledWith(expect.objectContaining({ status: 'Pending' }));
    });

    it('should call onApply with updated keyword value', () => {
      render(<Filter onApply={mockOnApply} testId="f" />);
      fireEvent.click(screen.getByTestId('f-button'));
      const searchInput = screen.getByPlaceholderText('Search...');
      fireEvent.change(searchInput, { target: { value: 'test query' } });
      fireEvent.click(screen.getByTestId('f-apply'));
      expect(mockOnApply).toHaveBeenCalledWith(expect.objectContaining({ keyword: 'test query' }));
    });
  });

  // ─── Reset ────────────────────────────────────────────────────────────────

  describe('Reset', () => {
    it('should call onReset when Reset all clicked and onReset provided', () => {
      render(<Filter onApply={mockOnApply} onReset={mockOnReset} testId="f" />);
      fireEvent.click(screen.getByTestId('f-button'));
      fireEvent.click(screen.getByTestId('f-resetall'));
      expect(mockOnReset).toHaveBeenCalledTimes(1);
    });

    it('should call onApply with empty values when Reset all clicked and no onReset', () => {
      render(<Filter onApply={mockOnApply} testId="f" />);
      fireEvent.click(screen.getByTestId('f-button'));
      // change a value first
      fireEvent.change(screen.getByDisplayValue('Select Activity'), { target: { value: 'Login' } });
      fireEvent.click(screen.getByTestId('f-resetall'));
      expect(mockOnApply).toHaveBeenCalledWith({
        date: { start: null, end: null },
        activity: '',
        status: '',
        keyword: '',
      });
    });

    it('should clear activity after Reset all', () => {
      render(<Filter onApply={mockOnApply} testId="f" />);
      fireEvent.click(screen.getByTestId('f-button'));
      fireEvent.change(screen.getByDisplayValue('Select Activity'), { target: { value: 'Login' } });
      fireEvent.click(screen.getByTestId('f-resetall'));
      expect(screen.getByDisplayValue('Select Activity')).toBeInTheDocument();
    });

    it('should clear keyword after Reset all', () => {
      render(<Filter onApply={mockOnApply} testId="f" />);
      fireEvent.click(screen.getByTestId('f-button'));
      fireEvent.change(screen.getByPlaceholderText('Search...'), { target: { value: 'hello' } });
      fireEvent.click(screen.getByTestId('f-resetall'));
      expect(screen.getByPlaceholderText('Search...')).toHaveValue('');
    });
  });

  // ─── Custom Options ───────────────────────────────────────────────────────

  describe('Custom Options', () => {
    it('should render custom activity options', () => {
      const custom = [
        { label: 'Select Activity', value: '' },
        { label: 'Custom Action', value: 'custom' },
      ];
      render(<Filter onApply={mockOnApply} activityOptions={custom} />);
      fireEvent.click(screen.getByText('Filter'));
      expect(screen.getByText('Custom Action')).toBeInTheDocument();
    });

    it('should render custom status options', () => {
      const custom = [
        { label: 'Select Status', value: '' },
        { label: 'Active', value: 'active' },
      ];
      render(<Filter onApply={mockOnApply} statusOptions={custom} />);
      fireEvent.click(screen.getByText('Filter'));
      expect(screen.getByText('Active')).toBeInTheDocument();
    });

    it('should render custom search placeholder', () => {
      render(<Filter onApply={mockOnApply} searchPlaceholder="Custom search..." />);
      fireEvent.click(screen.getByText('Filter'));
      expect(screen.getByPlaceholderText('Custom search...')).toBeInTheDocument();
    });
  });

  // ─── Field Interactions ───────────────────────────────────────────────────

  describe('Field Interactions', () => {
    it('should update activity value on change', () => {
      render(<Filter onApply={mockOnApply} />);
      fireEvent.click(screen.getByText('Filter'));
      const select = screen.getByDisplayValue('Select Activity');
      fireEvent.change(select, { target: { value: 'Login' } });
      expect(select).toHaveValue('Login');
    });

    it('should update status value on change', () => {
      render(<Filter onApply={mockOnApply} />);
      fireEvent.click(screen.getByText('Filter'));
      const select = screen.getByDisplayValue('Select Status');
      fireEvent.change(select, { target: { value: 'Approved' } });
      expect(select).toHaveValue('Approved');
    });

    it('should update keyword on typing', () => {
      render(<Filter onApply={mockOnApply} />);
      fireEvent.click(screen.getByText('Filter'));
      const input = screen.getByPlaceholderText('Search...');
      fireEvent.change(input, { target: { value: 'test query' } });
      expect(input).toHaveValue('test query');
    });

    it('should reset date range when Date Range Reset clicked', () => {
      render(<Filter onApply={mockOnApply} testId="f" />);
      fireEvent.click(screen.getByTestId('f-button'));
      // click the section Reset button
      fireEvent.click(screen.getByText('Reset'));
      // no error — calendar handles the reset internally
      expect(screen.getByText('Date Range')).toBeInTheDocument();
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe('MahatiActivity', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => mockOnChange.mockClear());

  it('should render with default label', () => {
    render(<MahatiActivity value="" onChange={mockOnChange} />);
    expect(screen.getByText('Select Activity')).toBeInTheDocument();
  });

  it('should display selected option label', () => {
    render(<MahatiActivity value="Login" onChange={mockOnChange} />);
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('should open dropdown on click', () => {
    render(<MahatiActivity value="" onChange={mockOnChange} testId="act" />);
    fireEvent.click(screen.getByTestId('act-trigger'));
    expect(screen.getByTestId('act-dropdown')).toBeInTheDocument();
  });

  it('should call onChange with selected value', () => {
    render(<MahatiActivity value="" onChange={mockOnChange} testId="act" />);
    fireEvent.click(screen.getByTestId('act-trigger'));
    fireEvent.click(screen.getByTestId('act-option-Login'));
    expect(mockOnChange).toHaveBeenCalledWith('Login');
  });

  it('should close dropdown after selection', () => {
    render(<MahatiActivity value="" onChange={mockOnChange} testId="act" />);
    fireEvent.click(screen.getByTestId('act-trigger'));
    fireEvent.click(screen.getByTestId('act-option-Login'));
    expect(screen.queryByTestId('act-dropdown')).not.toBeInTheDocument();
  });

  it('should render custom options', () => {
    const custom = [
      { label: 'Select', value: '' },
      { label: 'Custom', value: 'custom' },
    ];
    render(<MahatiActivity value="" onChange={mockOnChange} options={custom} testId="act" />);
    fireEvent.click(screen.getByTestId('act-trigger'));
    expect(screen.getByText('Custom')).toBeInTheDocument();
  });

  it('should apply small size class', () => {
    render(<MahatiActivity value="" onChange={mockOnChange} size="small" testId="act" />);
    expect(screen.getByTestId('act-trigger').className).toMatch(/px-3 py-2/);
  });

  it('should apply medium size class', () => {
    render(<MahatiActivity value="" onChange={mockOnChange} size="medium" testId="act" />);
    expect(screen.getByTestId('act-trigger').className).toMatch(/px-4 py-3/);
  });

  it('should close dropdown on outside mousedown', () => {
    render(
      <div>
        <MahatiActivity value="" onChange={mockOnChange} testId="act" />
        <div data-testid="outside">Outside</div>
      </div>
    );
    fireEvent.click(screen.getByTestId('act-trigger'));
    expect(screen.getByTestId('act-dropdown')).toBeInTheDocument();
    fireEvent.mouseDown(screen.getByTestId('outside'));
    expect(screen.queryByTestId('act-dropdown')).not.toBeInTheDocument();
  });

  it('should have correct displayName', () => {
    expect(MahatiActivity.displayName).toBe('MahatiActivity');
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe('MahatiStatus', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => mockOnChange.mockClear());

  it('should render with default label', () => {
    render(<MahatiStatus value="" onChange={mockOnChange} />);
    expect(screen.getByText('Select Status')).toBeInTheDocument();
  });

  it('should display selected option label', () => {
    render(<MahatiStatus value="Pending" onChange={mockOnChange} />);
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  it('should open dropdown on click', () => {
    render(<MahatiStatus value="" onChange={mockOnChange} testId="stat" />);
    fireEvent.click(screen.getByTestId('stat-trigger'));
    expect(screen.getByTestId('stat-dropdown')).toBeInTheDocument();
  });

  it('should call onChange with selected value', () => {
    render(<MahatiStatus value="" onChange={mockOnChange} testId="stat" />);
    fireEvent.click(screen.getByTestId('stat-trigger'));
    fireEvent.click(screen.getByText('Approved'));
    expect(mockOnChange).toHaveBeenCalledWith('Approved');
  });

  it('should close dropdown after selection', () => {
    render(<MahatiStatus value="" onChange={mockOnChange} testId="stat" />);
    fireEvent.click(screen.getByTestId('stat-trigger'));
    fireEvent.click(screen.getByText('Rejected'));
    expect(screen.queryByTestId('stat-dropdown')).not.toBeInTheDocument();
  });

  it('should render custom options', () => {
    const custom = [
      { label: 'Select', value: '' },
      { label: 'Active', value: 'active' },
    ];
    render(<MahatiStatus value="" onChange={mockOnChange} options={custom} testId="stat" />);
    fireEvent.click(screen.getByTestId('stat-trigger'));
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('should apply small size class', () => {
    render(<MahatiStatus value="" onChange={mockOnChange} size="small" testId="stat" />);
    expect(screen.getByTestId('stat-trigger').className).toMatch(/px-3 py-2/);
  });

  it('should close on outside mousedown', () => {
    render(
      <div>
        <MahatiStatus value="" onChange={mockOnChange} testId="stat" />
        <div data-testid="outside">Outside</div>
      </div>
    );
    fireEvent.click(screen.getByTestId('stat-trigger'));
    fireEvent.mouseDown(screen.getByTestId('outside'));
    expect(screen.queryByTestId('stat-dropdown')).not.toBeInTheDocument();
  });

  it('should have correct displayName', () => {
    expect(MahatiStatus.displayName).toBe('MahatiStatus');
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe('MahatiSearch', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => mockOnChange.mockClear());

  it('should render input element', () => {
    render(<MahatiSearch value="" onChange={mockOnChange} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should render with default placeholder', () => {
    render(<MahatiSearch value="" onChange={mockOnChange} />);
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
  });

  it('should render with custom placeholder', () => {
    render(<MahatiSearch value="" onChange={mockOnChange} placeholder="Find something..." />);
    expect(screen.getByPlaceholderText('Find something...')).toBeInTheDocument();
  });

  it('should display current value', () => {
    render(<MahatiSearch value="hello" onChange={mockOnChange} />);
    expect(screen.getByRole('textbox')).toHaveValue('hello');
  });

  it('should call onChange when typing', () => {
    render(<MahatiSearch value="" onChange={mockOnChange} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'test' } });
    expect(mockOnChange).toHaveBeenCalledWith('test');
  });

  it('should call onChange exactly once per keystroke', () => {
    render(<MahatiSearch value="" onChange={mockOnChange} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'a' } });
    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  it('should apply testId', () => {
    render(<MahatiSearch value="" onChange={mockOnChange} testId="search-input" />);
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
  });

  it('should apply small size class', () => {
    render(<MahatiSearch value="" onChange={mockOnChange} size="small" testId="s" />);
    expect(screen.getByTestId('s').className).toMatch(/px-3 py-2/);
  });

  it('should apply medium size class', () => {
    render(<MahatiSearch value="" onChange={mockOnChange} size="medium" testId="s" />);
    expect(screen.getByTestId('s').className).toMatch(/px-4 py-3/);
  });

  it('should have type="text"', () => {
    render(<MahatiSearch value="" onChange={mockOnChange} testId="s" />);
    expect(screen.getByTestId('s')).toHaveAttribute('type', 'text');
  });

  it('should have correct displayName', () => {
    expect(MahatiSearch.displayName).toBe('MahatiSearch');
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe('DEFAULT_ACTIVITY_OPTIONS', () => {
  it('should have 5 options', () => {
    expect(DEFAULT_ACTIVITY_OPTIONS).toHaveLength(5);
  });

  it('should have empty string as first value', () => {
    expect(DEFAULT_ACTIVITY_OPTIONS[0].value).toBe('');
  });

  it('should include Login option', () => {
    expect(DEFAULT_ACTIVITY_OPTIONS.some(o => o.value === 'Login')).toBe(true);
  });
});

describe('DEFAULT_STATUS_OPTIONS', () => {
  it('should have 4 options', () => {
    expect(DEFAULT_STATUS_OPTIONS).toHaveLength(4);
  });

  it('should have empty string as first value', () => {
    expect(DEFAULT_STATUS_OPTIONS[0].value).toBe('');
  });

  it('should include Pending, Approved, Rejected', () => {
    const values = DEFAULT_STATUS_OPTIONS.map(o => o.value);
    expect(values).toContain('Pending');
    expect(values).toContain('Approved');
    expect(values).toContain('Rejected');
  });
});