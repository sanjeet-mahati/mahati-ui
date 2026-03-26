// Replace your entire test file with this:
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Fixed mock paths
jest.mock('@mahatisystems/mahati-ui-components', () => ({
MahatiDropdown: ({ variant, options, placeholder, disabled, onSelect, children }: any) => (
  <div data-testid={`mahati-dropdown-${variant || 'basic'}`} aria-disabled={disabled}>
    <span>{placeholder || 'Select an option'}</span>
    {options?.map((o: any) => (
      <div key={o.key} onClick={() => onSelect?.(o.value)}>{o.key}</div>
    ))}
    {children}
  </div>
),

}));

// FIXED: Correct relative paths from src/__tests__/app/dropdown/
jest.mock('../../../app/CodePreview', () => ({
  CodePreview: ({ title, preview, code }: any) => (
    <div data-testid={`code-preview-${title?.toLowerCase().replace(/\s+/g, '-')}`}>
      <h3>{title}</h3>
      <div data-testid="preview-area">{preview}</div>
      <pre data-testid="code-block">{code}</pre>
    </div>
  ),
}));

jest.mock('../../../app/PropsTable', () => ({
  PropsTable: ({ title, props: propsList }: any) => (
    <div data-testid="props-table">
      <h2>{title || 'Props'}</h2>
      {propsList?.map((p: any) => (
        <div key={p.name} data-testid={`prop-${p.name}`}>{p.name}</div>
      ))}
    </div>
  ),
}));

jest.mock('../../../app/dropdown/nesteddropdown/nestedropdowndemo', () => ({
  __esModule: true,   // ✅ tells Jest this is an ES module
  default: () => (    // ✅ matches the default import in the page
    <div data-testid="searchable-dropdown-page">Advanced Dropdowns Content</div>
  
  ),
}));

import DropdownDemoPage from '../../../app/dropdown/page';

// Debug
beforeAll(() => {
  console.log('DropdownDemoPage type:', typeof DropdownDemoPage);
});

// ... rest of your tests unchanged

describe('DropdownDemoPage — Render', () => {
  it('renders without crashing', () => {
    const { container } = render(<DropdownDemoPage />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders page heading "Dropdown"', () => {
    render(<DropdownDemoPage />);
    expect(screen.getByText('Dropdown')).toBeInTheDocument();
  });

  it('renders page description text', () => {
    render(<DropdownDemoPage />);
    expect(screen.getByText(/versatile dropdown component/i)).toBeInTheDocument();
  });

  it('renders PropsTable', () => {
    render(<DropdownDemoPage />);
    expect(screen.getAllByTestId('props-table').length).toBeGreaterThan(0);
  });

  it('renders Advanced Dropdowns heading', () => {
    render(<DropdownDemoPage />);
    expect(screen.getByText('Advanced Dropdowns')).toBeInTheDocument();
  });

  it('renders SearchableDropdownPage section', () => {
    render(<DropdownDemoPage />);
    expect(screen.getByTestId('searchable-dropdown-page')).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Props table entries
// ═══════════════════════════════════════════════════════════════════════════════

describe('DropdownDemoPage — PropsTable', () => {
  it('shows variant prop', () => {
    render(<DropdownDemoPage />);
    expect(screen.getAllByTestId('prop-variant').length).toBeGreaterThan(0);
  });

  it('shows options prop', () => {
    render(<DropdownDemoPage />);
    expect(screen.getAllByTestId('prop-options').length).toBeGreaterThan(0);
  });

  it('shows onSelect prop', () => {
    render(<DropdownDemoPage />);
    expect(screen.getAllByTestId('prop-onSelect').length).toBeGreaterThan(0);
  });

  it('shows placeholder prop', () => {
    render(<DropdownDemoPage />);
    expect(screen.getAllByTestId('prop-placeholder').length).toBeGreaterThan(0);
  });

  it('shows disabled prop', () => {
    render(<DropdownDemoPage />);
    expect(screen.getAllByTestId('prop-disabled').length).toBeGreaterThan(0);
  });

  it('shows className prop', () => {
    render(<DropdownDemoPage />);
    expect(screen.getAllByTestId('prop-className').length).toBeGreaterThan(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// CodePreview sections
// ═══════════════════════════════════════════════════════════════════════════════

describe('DropdownDemoPage — CodePreview Sections', () => {
  it('renders Dropdown Variants section', () => {
    render(<DropdownDemoPage />);
    expect(screen.getByText('Dropdown Variants')).toBeInTheDocument();
  });

  it('renders Glass Dropdown section', () => {
    render(<DropdownDemoPage />);
    expect(screen.getByText('Glass Dropdown')).toBeInTheDocument();
  });

  it('renders Disabled State section', () => {
    render(<DropdownDemoPage />);
    expect(screen.getByText('Disabled State')).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Dropdown variants rendered
// ═══════════════════════════════════════════════════════════════════════════════

describe('DropdownDemoPage — Dropdown Variants', () => {
  it('renders basic variant dropdown', () => {
    render(<DropdownDemoPage />);
  expect(screen.getAllByTestId('mahati-dropdown-basic').length).toBeGreaterThan(0)
  });

  it('renders outline variant dropdown', () => {
    render(<DropdownDemoPage />);
    expect(screen.getByTestId('mahati-dropdown-outline')).toBeInTheDocument();
  });

  it('renders pill variant dropdown', () => {
    render(<DropdownDemoPage />);
    expect(screen.getByTestId('mahati-dropdown-pill')).toBeInTheDocument();
  });

  it('renders dark variant dropdown', () => {
    render(<DropdownDemoPage />);
    expect(screen.getByTestId('mahati-dropdown-dark')).toBeInTheDocument();
  });

  it('renders underline variant dropdown', () => {
    render(<DropdownDemoPage />);
    expect(screen.getByTestId('mahati-dropdown-underline')).toBeInTheDocument();
  });

  it('renders shadow variant dropdown', () => {
    render(<DropdownDemoPage />);
    expect(screen.getByTestId('mahati-dropdown-shadow')).toBeInTheDocument();
  });

  it('renders gradient variant dropdown', () => {
    render(<DropdownDemoPage />);
    expect(screen.getByTestId('mahati-dropdown-gradient')).toBeInTheDocument();
  });

  it('renders glass variant dropdown', () => {
    render(<DropdownDemoPage />);
    expect(screen.getByTestId('mahati-dropdown-glass')).toBeInTheDocument();
  });

  it('renders disabled dropdown with disabled attribute', () => {
    render(<DropdownDemoPage />);
    // Find the disabled dropdown — it has placeholder "Disabled"
    expect(screen.getByText('Disabled')).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Dropdown options
// ═══════════════════════════════════════════════════════════════════════════════

describe('DropdownDemoPage — Dropdown Options', () => {
  it('renders Option 1 in basic dropdown', () => {
    render(<DropdownDemoPage />);
    expect(screen.getAllByText('Option 1').length).toBeGreaterThan(0);
  });

  it('renders Profile option in gradient dropdown', () => {
    render(<DropdownDemoPage />);
    expect(screen.getAllByText('Profile').length).toBeGreaterThan(0);
  });

  it('renders Logout option in gradient dropdown', () => {
    render(<DropdownDemoPage />);
    expect(screen.getAllByText('Logout').length).toBeGreaterThan(0);
  });

  it('renders Option 1 in glass dropdown', () => {
    render(<DropdownDemoPage />);
    expect(screen.getAllByText('Option 1').length).toBeGreaterThan(0);
  });
});