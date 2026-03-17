import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// ─── Mock @mahatisystems/mahati-ui-components ─────────────────────────────────
jest.mock("@mahatisystems/mahati-ui-components", () => ({
  // ✅ Must match the ACTUAL export names from the library
  MahatiSearchableDropdown: ({ label, placeholder, options, value, onChange, testId }: any) => (
    <div data-testid={testId || 'searchable-dropdown'}>
      {label && <label>{label}</label>}
      <button onClick={() => onChange && onChange(options?.[0]?.value)}>
        {value || placeholder || 'search here'}
      </button>
      {options?.map((o: any) => (
        <div key={o.value} onClick={() => onChange?.(o.value)}>{o.label}</div>
      ))}
    </div>
  ),
  MahatiMultiSelectDropdown: ({ label, options, values, onChange, testId }: any) => (
    <div data-testid={testId || 'multi-select-dropdown'}>
      {label && <label>{label}</label>}
      <button onClick={() => onChange?.([...(values || []), options?.[0]?.value])}>
        Multi Select
      </button>
      {options?.map((o: any) => (
        <div key={o.value} onClick={() => onChange?.([o.value])}>{o.label}</div>
      ))}
    </div>
  ),
  MahatiCascadingDropdown: ({ label, value, onChange, testId }: any) => (
    <div data-testid={testId || 'cascading-dropdown'}>
      {label && <label>{label}</label>}
      <button onClick={() => onChange?.({ level1: 'india' })}>Select location</button>
    </div>
  ),
  MahatiAvatarDropdown: ({ label, options, value, onChange, testId }: any) => (
    <div data-testid={testId || 'avatar-dropdown'}>
      {label && <label>{label}</label>}
      <button onClick={() => onChange?.(options?.[0]?.value)}>
        {value || 'Choose user'}
      </button>
    </div>
  ),
  MahatiAvatarMultiSelectDropdown: ({ label, options, values, onChange, testId }: any) => (
    <div data-testid={testId || 'avatar-multi-select'}>
      {label && <label>{label}</label>}
      <button onClick={() => onChange?.([options?.[0]?.value])}>Select users</button>
    </div>
  ),
  MahatiGroupedDropdown: ({ label, groups, values, onChange, testId }: any) => (
    <div data-testid={testId || 'grouped-dropdown'}>
      {label && <label>{label}</label>}
      <button onClick={() => onChange?.({ section: groups?.[0]?.label, values: [groups?.[0]?.options?.[0]?.value] })}>
        Select options
      </button>
    </div>
  ),
  MahatiAsyncDropdown: ({ label, placeholder, value, disabled, onChange, loadOptions, testId }: any) => (
    <div data-testid={testId || 'async-dropdown'}>
      {label && <label>{label}</label>}
      <button
        disabled={disabled}
        onClick={async () => {
          const opts = await loadOptions?.('');
          if (opts?.[0]) onChange?.(opts[0].value);
        }}
      >
        {value || placeholder || 'Search...'}
      </button>
    </div>
  ),
}));

// ─── Mock CodePreview ─────────────────────────────────────────────────────────
jest.mock('@/app/CodePreview', () => ({
  CodePreview: ({ title, preview, code }: any) => (
    <div data-testid={`code-preview-${title?.toLowerCase().replace(/\s+/g, '-')}`}>
      <h3>{title}</h3>
      <div data-testid="preview-area">{preview}</div>
      <pre>{code}</pre>
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

// ─── Mock fetch ───────────────────────────────────────────────────────────────
global.fetch = jest.fn().mockResolvedValue({
  json: jest.fn().mockResolvedValue({
    data: [
      { name: 'India', iso2: 'IN' },
      { name: 'USA', iso2: 'US' },
    ],
  }),
}) as any;

import SearchableDropdownPage from '../../../app/dropdown/nesteddropdown/nestedropdowndemo';

// ═══════════════════════════════════════════════════════════════════════════════
// Render
// ═══════════════════════════════════════════════════════════════════════════════

describe('SearchableDropdownPage — Render', () => {
  it('renders without crashing', () => {
    const { container } = render(<SearchableDropdownPage />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders the PropsTable', () => {
    render(<SearchableDropdownPage />);
    expect(screen.getByTestId('props-table')).toBeInTheDocument();
  });

  it('renders Searchable Dropdown section', () => {
    render(<SearchableDropdownPage />);
    expect(screen.getAllByText('Searchable Dropdown').length).toBeGreaterThan(0);
  });

  it('renders Multi Select Dropdown section', () => {
    render(<SearchableDropdownPage />);
    expect(screen.getAllByText('Multi Select Dropdown').length).toBeGreaterThan(0);
  });

  it('renders Cascading Dropdown section', () => {
    render(<SearchableDropdownPage />);
    expect(screen.getByText('Cascading / Nested Dropdown')).toBeInTheDocument();
  });

  it('renders Avatar Dropdown section', () => {
    render(<SearchableDropdownPage />);
    expect(screen.getAllByText('Avatar Dropdown').length).toBeGreaterThan(0);
  });

  it('renders Avatar Multi Select Dropdown section', () => {
    render(<SearchableDropdownPage />);
    expect(screen.getByText('Avatar Multi Select Dropdown')).toBeInTheDocument();
  });

  it('renders Grouped Dropdown section', () => {
    render(<SearchableDropdownPage />);
    expect(screen.getAllByText('Grouped Dropdown').length).toBeGreaterThan(0);
  });

  it('renders Async Dropdown section', () => {
    render(<SearchableDropdownPage />);
    expect(screen.getAllByText('Async Dropdown').length).toBeGreaterThan(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Props table entries
// ═══════════════════════════════════════════════════════════════════════════════

describe('SearchableDropdownPage — PropsTable', () => {
  it('shows label prop in props table', () => {
    render(<SearchableDropdownPage />);
    expect(screen.getByTestId('prop-label')).toBeInTheDocument();
  });

  it('shows placeholder prop in props table', () => {
    render(<SearchableDropdownPage />);
    expect(screen.getByTestId('prop-placeholder')).toBeInTheDocument();
  });

  it('shows options prop in props table', () => {
    render(<SearchableDropdownPage />);
    expect(screen.getByTestId('prop-options')).toBeInTheDocument();
  });

  it('shows value prop in props table', () => {
    render(<SearchableDropdownPage />);
    expect(screen.getByTestId('prop-value')).toBeInTheDocument();
  });

  it('shows onChange prop in props table', () => {
    render(<SearchableDropdownPage />);
    expect(screen.getByTestId('prop-onChange')).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Searchable Dropdown preview
// ═══════════════════════════════════════════════════════════════════════════════

describe('SearchableDropdownPage — Searchable Dropdown Preview', () => {
  it('renders the SearchableDropdown component in preview', () => {
    render(<SearchableDropdownPage />);
    expect(screen.getAllByTestId('searchable-dropdown').length).toBeGreaterThan(0);
  });

  it('renders options inside searchable dropdown', () => {
    render(<SearchableDropdownPage />);
    expect(screen.getAllByText('Country').length).toBeGreaterThan(0);
  });

  it('renders the "Searchable Dropdown" h3 heading', () => {
    render(<SearchableDropdownPage />);
    expect(screen.getAllByText('Searchable Dropdown').length).toBeGreaterThanOrEqual(2);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Multi Select Dropdown preview
// ═══════════════════════════════════════════════════════════════════════════════

describe('SearchableDropdownPage — Multi Select Dropdown Preview', () => {
  it('renders MultiSelectDropdown in preview', () => {
    render(<SearchableDropdownPage />);
    expect(screen.getByTestId('multi-select-dropdown')).toBeInTheDocument();
  });

  it('renders Multi Select label', () => {
    render(<SearchableDropdownPage />);
    expect(screen.getAllByText('Multi Select').length).toBeGreaterThan(0);
  });

  it('renders Dashboard option in multi select', () => {
    render(<SearchableDropdownPage />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Avatar Dropdown preview
// ═══════════════════════════════════════════════════════════════════════════════

describe('SearchableDropdownPage — Avatar Dropdown Preview', () => {
  it('renders AvatarDropdown in preview', () => {
    render(<SearchableDropdownPage />);
    expect(screen.getByTestId('avatar-dropdown')).toBeInTheDocument();
  });

  it('renders AvatarMultiSelectDropdown in preview', () => {
    render(<SearchableDropdownPage />);
    expect(screen.getByTestId('avatar-multi-select')).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Grouped Dropdown preview
// ═══════════════════════════════════════════════════════════════════════════════

describe('SearchableDropdownPage — Grouped Dropdown Preview', () => {
  it('renders GroupedDropdown in preview', () => {
    render(<SearchableDropdownPage />);
    expect(screen.getByTestId('grouped-dropdown')).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Async Dropdown preview
// ═══════════════════════════════════════════════════════════════════════════════

describe('SearchableDropdownPage — Async Dropdown Preview', () => {
  it('renders AsyncDropdown components in preview', () => {
    render(<SearchableDropdownPage />);
    expect(screen.getAllByTestId('async-dropdown').length).toBeGreaterThanOrEqual(3);
  });

  it('renders Country async dropdown', () => {
    render(<SearchableDropdownPage />);
    expect(screen.getAllByText('Country').length).toBeGreaterThan(0);
  });

  it('renders State async dropdown', () => {
    render(<SearchableDropdownPage />);
    expect(screen.getAllByText('State').length).toBeGreaterThan(0);
  });

  it('renders City async dropdown', () => {
    render(<SearchableDropdownPage />);
    expect(screen.getAllByText('City').length).toBeGreaterThan(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Code snippets
// ═══════════════════════════════════════════════════════════════════════════════

describe('SearchableDropdownPage — Code Snippets', () => {
  it('renders code snippet for SearchableDropdown', () => {
    render(<SearchableDropdownPage />);
    expect(screen.getAllByText(/SearchableDropdown/).length).toBeGreaterThan(0);
  });

  it('renders code snippet for MultiSelectDropdown', () => {
    render(<SearchableDropdownPage />);
    expect(screen.getAllByText(/MultiSelectDropdown/).length).toBeGreaterThan(0);
  });

  it('renders code snippet for AvatarDropdown', () => {
    render(<SearchableDropdownPage />);
    expect(screen.getAllByText(/AvatarDropdown/).length).toBeGreaterThan(0);
  });

  it('renders code snippet for GroupedDropdown', () => {
    render(<SearchableDropdownPage />);
    expect(screen.getAllByText(/GroupedDropdown/).length).toBeGreaterThan(0);
  });

  it('renders code snippet for AsyncDropdown', () => {
    render(<SearchableDropdownPage />);
    expect(screen.getAllByText(/AsyncDropdown/).length).toBeGreaterThan(0);
  });
});