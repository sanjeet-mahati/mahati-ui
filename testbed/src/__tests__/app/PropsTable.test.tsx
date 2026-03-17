import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PropsTable } from '../../app/PropsTable';

// ─── Shared data ──────────────────────────────────────────────────────────────

const sampleProps = [
  {
    name: 'variant',
    type: "'primary' | 'secondary'",
    default: "'primary'",
    description: 'The visual style of the component',
  },
  {
    name: 'onClick',
    type: '() => void',
    default: 'undefined',
    description: 'Click handler callback',
    required: true,
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Disables the component when true',
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// Render
// ═══════════════════════════════════════════════════════════════════════════════

describe('PropsTable — Render', () => {
  it('renders without crashing', () => {
    const { container } = render(<PropsTable props={sampleProps} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders default title "Props" when no title provided', () => {
    render(<PropsTable props={sampleProps} />);
    expect(screen.getByText('Props')).toBeInTheDocument();
  });

  it('renders custom title', () => {
    render(<PropsTable props={sampleProps} title="Component API" />);
    expect(screen.getByText('Component API')).toBeInTheDocument();
  });

  it('has correct displayName', () => {
    expect(PropsTable.displayName).toBe('PropsTable');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Table headers
// ═══════════════════════════════════════════════════════════════════════════════

describe('PropsTable — Table Headers', () => {
  it('renders Name column header', () => {
    render(<PropsTable props={sampleProps} />);
    expect(screen.getAllByText('Name').length).toBeGreaterThan(0);
  });

  it('renders Type column header', () => {
    render(<PropsTable props={sampleProps} />);
    expect(screen.getAllByText('Type').length).toBeGreaterThan(0);
  });

  it('renders Default column header', () => {
    render(<PropsTable props={sampleProps} />);
    expect(screen.getAllByText('Default').length).toBeGreaterThan(0);
  });

  it('renders Description column header', () => {
    render(<PropsTable props={sampleProps} />);
    expect(screen.getAllByText('Description').length).toBeGreaterThan(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Prop rows
// ═══════════════════════════════════════════════════════════════════════════════

describe('PropsTable — Prop Rows', () => {
  it('renders all prop names', () => {
    render(<PropsTable props={sampleProps} />);
    expect(screen.getAllByText('variant').length).toBeGreaterThan(0);
    expect(screen.getAllByText('onClick').length).toBeGreaterThan(0);
    expect(screen.getAllByText('disabled').length).toBeGreaterThan(0);
  });

  it('renders all prop types', () => {
    render(<PropsTable props={sampleProps} />);
    expect(screen.getAllByText("'primary' | 'secondary'").length).toBeGreaterThan(0);
    expect(screen.getAllByText('() => void').length).toBeGreaterThan(0);
    expect(screen.getAllByText('boolean').length).toBeGreaterThan(0);
  });

  it('renders all default values', () => {
    render(<PropsTable props={sampleProps} />);
    expect(screen.getAllByText("'primary'").length).toBeGreaterThan(0);
    expect(screen.getAllByText('undefined').length).toBeGreaterThan(0);
    expect(screen.getAllByText('false').length).toBeGreaterThan(0);
  });

  it('renders all descriptions', () => {
    render(<PropsTable props={sampleProps} />);
    expect(screen.getAllByText('The visual style of the component').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Click handler callback').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Disables the component when true').length).toBeGreaterThan(0);
  });

  it('shows "-" for props without a default value', () => {
    const propsWithoutDefault = [
      { name: 'onChange', type: '() => void', description: 'Change handler' },
    ];
    render(<PropsTable props={propsWithoutDefault} />);
    expect(screen.getAllByText('-').length).toBeGreaterThan(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Required indicator
// ═══════════════════════════════════════════════════════════════════════════════

describe('PropsTable — Required Indicator', () => {
  it('renders * for required props', () => {
    render(<PropsTable props={sampleProps} />);
    const requiredMarkers = screen.getAllByText('*');
    // onClick is required — should have asterisk in both desktop and mobile views
    expect(requiredMarkers.length).toBeGreaterThan(0);
  });

  it('does not render * for non-required props', () => {
    const nonRequired = [
      { name: 'variant', type: 'string', default: 'primary', description: 'Style', required: false },
    ];
    render(<PropsTable props={nonRequired} />);
    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });

  it('renders * for multiple required props', () => {
    const multiRequired = [
      { name: 'id', type: 'string', description: 'Unique id', required: true },
      { name: 'label', type: 'string', description: 'Label text', required: true },
      { name: 'optional', type: 'string', description: 'Not required', required: false },
    ];
    render(<PropsTable props={multiRequired} />);
    const markers = screen.getAllByText('*');
    // Each required prop appears in both desktop table and mobile cards = 2 * 2 = 4
    expect(markers.length).toBeGreaterThanOrEqual(2);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Section ID
// ═══════════════════════════════════════════════════════════════════════════════

describe('PropsTable — Section ID', () => {
  it('generates id from title slug when no id prop provided', () => {
    const { container } = render(<PropsTable props={sampleProps} title="Component API" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.id).toBe('component-api');
  });

  it('uses custom id prop when provided', () => {
    const { container } = render(<PropsTable props={sampleProps} id="custom-section" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.id).toBe('custom-section');
  });

  it('defaults id to "props" from default title', () => {
    const { container } = render(<PropsTable props={sampleProps} />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.id).toBe('props');
  });

  it('handles title with spaces and caps in id', () => {
    const { container } = render(<PropsTable props={sampleProps} title="My Cool Props Table" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.id).toBe('my-cool-props-table');
  });

  it('handles title with special characters in id', () => {
    const { container } = render(<PropsTable props={sampleProps} title="Props -- Section!" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.id).toBe('props-section');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Edge cases
// ═══════════════════════════════════════════════════════════════════════════════

describe('PropsTable — Edge Cases', () => {
  it('renders with empty props array gracefully', () => {
    const { container } = render(<PropsTable props={[]} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders with single prop', () => {
    const single = [{ name: 'size', type: 'string', description: 'The size' }];
    render(<PropsTable props={single} />);
    expect(screen.getAllByText('size').length).toBeGreaterThan(0);
  });

  it('renders with many props without crashing', () => {
    const many = Array.from({ length: 20 }, (_, i) => ({
      name: `prop${i}`,
      type: 'string',
      description: `Description ${i}`,
    }));
    const { container } = render(<PropsTable props={many} />);
    expect(container.firstChild).toBeInTheDocument();
    expect(screen.getAllByText('prop0').length).toBeGreaterThan(0);
    expect(screen.getAllByText('prop19').length).toBeGreaterThan(0);
  });

  it('renders long type strings without crashing', () => {
    const longType = [
      {
        name: 'callback',
        type: `(event: React.MouseEvent<HTMLButtonElement>, value: string, index: number) => void`,
        description: 'Complex callback',
      },
    ];
    render(<PropsTable props={longType} />);
    expect(screen.getAllByText('callback').length).toBeGreaterThan(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Mobile layout
// ═══════════════════════════════════════════════════════════════════════════════

describe('PropsTable — Mobile Layout', () => {
  it('renders Type: label in mobile cards', () => {
    render(<PropsTable props={sampleProps} />);
    expect(screen.getAllByText('Type:').length).toBeGreaterThan(0);
  });

  it('renders Default: label in mobile cards', () => {
    render(<PropsTable props={sampleProps} />);
    expect(screen.getAllByText('Default:').length).toBeGreaterThan(0);
  });

  it('renders Description: label in mobile cards', () => {
    render(<PropsTable props={sampleProps} />);
    expect(screen.getAllByText('Description:').length).toBeGreaterThan(0);
  });
});

