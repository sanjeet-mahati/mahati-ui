// src/__tests__/app/filter/page.test.tsx

import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';

// ─── Mock @mahatisystems/mahati-ui-components ─────────────────────────────────
jest.mock('@mahatisystems/mahati-ui-components', () => ({
  MahatiButton: ({ onClick, children, className }: any) => (
    <button data-testid="mahati-button" onClick={onClick} className={className}>
      {children}
    </button>
  ),
  MahatiCalendar: ({ value, onChange, placeholder, showTodayButton, showClearButton }: any) => (
    <div data-testid="mahati-calendar">
      <input
        data-testid="calendar-input"
        placeholder={placeholder || 'Select date'}
        value={value ? `${value.year}-${value.month}-${value.day}` : ''}
        onChange={(e) => {
          const [year, month, day] = e.target.value.split('-').map(Number);
          onChange?.({ year, month, day });
        }}
      />
      {showTodayButton && (
        <button onClick={() => onChange?.({ year: 2026, month: 3, day: 18 })}>Today</button>
      )}
      {showClearButton && <button onClick={() => onChange?.(null)}>Clear</button>}
    </div>
  ),
  MahatiActivity: ({ value, onChange }: any) => (
    <div data-testid="mahati-activity">
      <select
        data-testid="activity-select"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      >
        <option value="Activity List">Activity List</option>
        <option value="Login">Login</option>
        <option value="Update">Update</option>
        <option value="Delete">Delete</option>
      </select>
    </div>
  ),
  MahatiStatus: ({ value, onChange }: any) => (
    <div data-testid="mahati-status">
      <select
        data-testid="status-select"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      >
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
        <option value="Pending">Pending</option>
      </select>
    </div>
  ),
  MahatiSearch: ({ value, onChange, placeholder }: any) => (
    <div data-testid="mahati-search">
      <input
        data-testid="search-input"
        value={value}
        placeholder={placeholder || 'Search...'}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  ),
}));

// ─── Mock CodePreview ─────────────────────────────────────────────────────────
jest.mock('@/app/CodePreview', () => ({
  CodePreview: ({ title, preview, code }: any) => (
    <div data-testid={`code-preview-${title?.toLowerCase().replace(/\s+/g, '-')}`}>
      <h3>{title}</h3>
      <div data-testid="preview-area">{preview}</div>
      <pre data-testid={`code-${title?.toLowerCase().replace(/\s+/g, '-')}`}>{code}</pre>
    </div>
  ),
}));

// ─── Mock PropsTable ──────────────────────────────────────────────────────────
jest.mock('@/app/PropsTable', () => ({
  PropsTable: ({ title, props: propsList }: any) => (
    <div data-testid="props-table">
      <h2>{title}</h2>
      {propsList?.map((p: any) => (
        <div key={p.name} data-testid={`prop-${p.name}`}>{p.name}</div>
      ))}
    </div>
  ),
}));

import FilterPage from '../../../app/filter/page';

// ─── Helper: get the modal element ───────────────────────────────────────────
// The modal lives inside the Basic Filter CodePreview's preview-area.
// We scope queries to it to avoid conflicts with standalone filter components.
const getModal = () =>
  screen.getByTestId('code-preview-basic-filter').querySelector('.fixed') as HTMLElement;

const getBasicFilterPreview = () =>
  screen.getByTestId('code-preview-basic-filter');

// ═══════════════════════════════════════════════════════════════════════════════
// Render
// ═══════════════════════════════════════════════════════════════════════════════

describe('FilterPage — Render', () => {
  it('renders without crashing', () => {
    const { container } = render(<FilterPage />);
    expect(container.firstChild).toBeInTheDocument();
  });

  // ✅ Use role query to target <h1> specifically
  it('renders the page heading', () => {
    render(<FilterPage />);
    expect(screen.getByRole('heading', { name: 'Filter', level: 1 })).toBeInTheDocument();
  });

  it('renders the page description', () => {
    render(<FilterPage />);
    expect(screen.getByText(/Filters allow users to narrow down data/)).toBeInTheDocument();
  });

  it('renders the PropsTable', () => {
    render(<FilterPage />);
    expect(screen.getByTestId('props-table')).toBeInTheDocument();
  });

  it('renders Basic Filter section', () => {
    render(<FilterPage />);
    // "Basic Filter" only appears as the CodePreview h3 title
    expect(screen.getByText('Basic Filter')).toBeInTheDocument();
  });

  it('renders Date / Time Filter section', () => {
    render(<FilterPage />);
    expect(screen.getByText('Date / Time Filter')).toBeInTheDocument();
  });

  it('renders Activity Filter section', () => {
    render(<FilterPage />);
    expect(screen.getByText('Activity Filter')).toBeInTheDocument();
  });

  it('renders Status Filter section', () => {
    render(<FilterPage />);
    expect(screen.getByText('Status Filter')).toBeInTheDocument();
  });

  it('renders Search Filter section', () => {
    render(<FilterPage />);
    expect(screen.getByText('Search Filter')).toBeInTheDocument();
  });
});
// ═══════════════════════════════════════════════════════════════════════════════
// PropsTable entries
// ═══════════════════════════════════════════════════════════════════════════════

describe('FilterPage — PropsTable', () => {
  it('shows open prop', () => {
    render(<FilterPage />);
    expect(screen.getByTestId('prop-open')).toBeInTheDocument();
  });

  it('shows onClose prop', () => {
    render(<FilterPage />);
    expect(screen.getByTestId('prop-onClose')).toBeInTheDocument();
  });

  it('shows fromDate prop', () => {
    render(<FilterPage />);
    expect(screen.getByTestId('prop-fromDate')).toBeInTheDocument();
  });

  it('shows toDate prop', () => {
    render(<FilterPage />);
    expect(screen.getByTestId('prop-toDate')).toBeInTheDocument();
  });

  it('shows activityType prop', () => {
    render(<FilterPage />);
    expect(screen.getByTestId('prop-activityType')).toBeInTheDocument();
  });

  it('shows status prop', () => {
    render(<FilterPage />);
    expect(screen.getByTestId('prop-status')).toBeInTheDocument();
  });

  it('shows keyword prop', () => {
    render(<FilterPage />);
    expect(screen.getByTestId('prop-keyword')).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Basic Filter modal
// ═══════════════════════════════════════════════════════════════════════════════

describe('FilterPage — Basic Filter Modal', () => {
  it('renders the Filter button', () => {
    render(<FilterPage />);
    expect(screen.getByTestId('mahati-button')).toBeInTheDocument();
  });

  it('modal is hidden by default', () => {
    render(<FilterPage />);
    // Modal .fixed div should not exist before opening
    expect(getModal()).toBeFalsy();
  });

  it('opens modal when Filter button is clicked', () => {
    render(<FilterPage />);
    fireEvent.click(screen.getByTestId('mahati-button'));
    expect(getModal()).toBeTruthy();
    expect(within(getModal()).getByText('Add Filter')).toBeInTheDocument();
  });

  it('closes modal when close button is clicked', () => {
    render(<FilterPage />);
    fireEvent.click(screen.getByTestId('mahati-button'));
    expect(getModal()).toBeTruthy();

    const closeBtn = within(getModal()).getByAltText('Close').closest('button')!;
    fireEvent.click(closeBtn);
    expect(getModal()).toBeFalsy();
  });

  it('renders Date Range section inside modal', () => {
    render(<FilterPage />);
    fireEvent.click(screen.getByTestId('mahati-button'));
    expect(within(getModal()).getByText('Date Range')).toBeInTheDocument();
  });

  it('renders Activity Type section inside modal', () => {
    render(<FilterPage />);
    fireEvent.click(screen.getByTestId('mahati-button'));
    expect(within(getModal()).getByText('Activity Type')).toBeInTheDocument();
  });

  it('renders Status section inside modal', () => {
    render(<FilterPage />);
    fireEvent.click(screen.getByTestId('mahati-button'));
    expect(within(getModal()).getByText('Status')).toBeInTheDocument();
  });

  it('renders Keyword search section inside modal', () => {
    render(<FilterPage />);
    fireEvent.click(screen.getByTestId('mahati-button'));
    expect(within(getModal()).getByText('Keyword search')).toBeInTheDocument();
  });

  it('renders Apply Now button inside modal', () => {
    render(<FilterPage />);
    fireEvent.click(screen.getByTestId('mahati-button'));
    expect(within(getModal()).getByText('Apply Now')).toBeInTheDocument();
  });

  it('renders Reset all button inside modal', () => {
    render(<FilterPage />);
    fireEvent.click(screen.getByTestId('mahati-button'));
    expect(within(getModal()).getByText('Reset all')).toBeInTheDocument();
  });

  it('renders From and To calendar inputs inside modal', () => {
    render(<FilterPage />);
    fireEvent.click(screen.getByTestId('mahati-button'));
    const modal = getModal();
    expect(within(modal).getByText('From')).toBeInTheDocument();
    expect(within(modal).getByText('To')).toBeInTheDocument();
  });

  it('renders activity type select with default value inside modal', () => {
    render(<FilterPage />);
    fireEvent.click(screen.getByTestId('mahati-button'));
    // Scope to modal to avoid conflict with standalone MahatiActivity select
    const activitySelects = within(getModal()).getAllByDisplayValue('Activity List');
    expect(activitySelects.length).toBeGreaterThan(0);
  });

  it('renders status select with default value inside modal', () => {
    render(<FilterPage />);
    fireEvent.click(screen.getByTestId('mahati-button'));
    const statusSelects = within(getModal()).getAllByDisplayValue('Active');
    expect(statusSelects.length).toBeGreaterThan(0);
  });

  it('changes activity type on select inside modal', () => {
    render(<FilterPage />);
    fireEvent.click(screen.getByTestId('mahati-button'));
    // The native <select> inside the modal (not the MahatiActivity mock)
    const selects = within(getModal()).getAllByDisplayValue('Activity List');
    fireEvent.change(selects[0], { target: { value: 'Login' } });
    expect(within(getModal()).getAllByDisplayValue('Login').length).toBeGreaterThan(0);
  });

  it('changes status on select inside modal', () => {
    render(<FilterPage />);
    fireEvent.click(screen.getByTestId('mahati-button'));
    const selects = within(getModal()).getAllByDisplayValue('Active');
    fireEvent.change(selects[0], { target: { value: 'Inactive' } });
    expect(within(getModal()).getAllByDisplayValue('Inactive').length).toBeGreaterThan(0);
  });

  it('types into keyword input inside modal', () => {
    render(<FilterPage />);
    fireEvent.click(screen.getByTestId('mahati-button'));
    // Use within(modal) to avoid conflict with standalone MahatiSearch input
    const input = within(getModal()).getByPlaceholderText('Search...');
    fireEvent.change(input, { target: { value: 'test keyword' } });
    expect(input).toHaveValue('test keyword');
  });

  it('resets keyword when its Reset button is clicked', () => {
    render(<FilterPage />);
    fireEvent.click(screen.getByTestId('mahati-button'));
    const modal = getModal();
    const input = within(modal).getByPlaceholderText('Search...');
    fireEvent.change(input, { target: { value: 'abc' } });
    expect(input).toHaveValue('abc');

    const resetButtons = within(modal).getAllByText('Reset');
    fireEvent.click(resetButtons[resetButtons.length - 1]);
    expect(input).toHaveValue('');
  });

  it('resets all fields when Reset all is clicked', () => {
    render(<FilterPage />);
    fireEvent.click(screen.getByTestId('mahati-button'));
    const modal = getModal();

    // Change activity type (native select in modal)
    const activitySelects = within(modal).getAllByDisplayValue('Activity List');
    fireEvent.change(activitySelects[0], { target: { value: 'Login' } });

    // Change status (native select in modal)
    const statusSelects = within(modal).getAllByDisplayValue('Active');
    fireEvent.change(statusSelects[0], { target: { value: 'Inactive' } });

    // Type keyword
    const input = within(modal).getByPlaceholderText('Search...');
    fireEvent.change(input, { target: { value: 'test' } });

    // Reset all
    fireEvent.click(within(modal).getByText('Reset all'));

    expect(within(modal).getAllByDisplayValue('Activity List').length).toBeGreaterThan(0);
    expect(within(modal).getAllByDisplayValue('Active').length).toBeGreaterThan(0);
    expect(input).toHaveValue('');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Date / Time Filter section
// ═══════════════════════════════════════════════════════════════════════════════

describe('FilterPage — Date / Time Filter Section', () => {
  it('renders From Date label', () => {
    render(<FilterPage />);
    expect(screen.getByText('From Date')).toBeInTheDocument();
  });

  it('renders To Date label', () => {
    render(<FilterPage />);
    expect(screen.getByText('To Date')).toBeInTheDocument();
  });

  it('renders MahatiCalendar components', () => {
    render(<FilterPage />);
    expect(screen.getAllByTestId('mahati-calendar').length).toBeGreaterThanOrEqual(2);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Activity Filter section (standalone MahatiActivity)
// ═══════════════════════════════════════════════════════════════════════════════

describe('FilterPage — Activity Filter Section', () => {
  it('renders MahatiActivity component', () => {
    render(<FilterPage />);
    expect(screen.getByTestId('mahati-activity')).toBeInTheDocument();
  });

  it('changes activity value on select', () => {
    render(<FilterPage />);
    const select = screen.getByTestId('activity-select');
    fireEvent.change(select, { target: { value: 'Update' } });
    expect(select).toHaveValue('Update');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Status Filter section (standalone MahatiStatus)
// ═══════════════════════════════════════════════════════════════════════════════

describe('FilterPage — Status Filter Section', () => {
  it('renders MahatiStatus component', () => {
    render(<FilterPage />);
    expect(screen.getByTestId('mahati-status')).toBeInTheDocument();
  });

  it('changes status value on select', () => {
    render(<FilterPage />);
    const select = screen.getByTestId('status-select');
    fireEvent.change(select, { target: { value: 'Pending' } });
    expect(select).toHaveValue('Pending');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Search Filter section (standalone MahatiSearch)
// ═══════════════════════════════════════════════════════════════════════════════

describe('FilterPage — Search Filter Section', () => {
  it('renders MahatiSearch component', () => {
    render(<FilterPage />);
    expect(screen.getByTestId('mahati-search')).toBeInTheDocument();
  });

  it('updates search value on input change', () => {
    render(<FilterPage />);
    // Use testid to target the standalone MahatiSearch, not the modal's native input
    const input = screen.getByTestId('search-input');
    fireEvent.change(input, { target: { value: 'hello' } });
    expect(input).toHaveValue('hello');
  });
});