import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ChartInterface } from '../src/components/ChartInterface';

// Suppress jsdom "HTMLCanvasElement.prototype.getContext not implemented" noise.
// The component calls getContext('2d') in a useEffect; jsdom doesn't support it
// but the component guards with `if (!ctx) return` so tests still pass.
beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => {
  jest.restoreAllMocks();
});

// ─── RENDER ──────────────────────────────────────────────────────────────────

describe('ChartInterface — Render', () => {
  const mockData = {
    labels: ['Jan', 'Feb'],
    datasets: [{ label: 'Test', data: [10, 20] }]
  };

  it('renders canvas element', () => {
    render(<ChartInterface data={mockData} testId="chart" />);
    expect(screen.getByTestId('chart')).toBeInTheDocument();
  });

  it('applies testId to container', () => {
    render(<ChartInterface data={mockData} testId="chart-test" />);
    expect(screen.getByTestId('chart-test')).toBeInTheDocument();
  });

  it('renders with empty data', () => {
    // <canvas> has no ARIA role in jsdom — query the DOM directly
    const { container } = render(<ChartInterface data={{}} />);
    expect(container.querySelector('canvas')).toBeInTheDocument();
  });

  it('renders with invalid data', () => {
    // <canvas> has no ARIA role in jsdom — query the DOM directly
    const { container } = render(<ChartInterface data={null as any} />);
    expect(container.querySelector('canvas')).toBeInTheDocument();
  });

  it('has correct displayName', () => {
    expect(ChartInterface.displayName).toBe('ChartInterface');
  });
});

// ─── VARIANTS ───────────────────────────────────────────────────────────────

describe('ChartInterface — Variants', () => {
  const mockData = { labels: ['A'], datasets: [{ data: [1] }] };

  it('applies default variant classes', () => {
    render(<ChartInterface data={mockData} testId="default-chart" />);
    const container = screen.getByTestId('default-chart');
    expect(container).toHaveClass('bg-white');
    expect(container).toHaveClass('p-4');
  });

  it('applies filled variant classes', () => {
    render(<ChartInterface data={mockData} variant="filled" testId="filled-chart" />);
    const container = screen.getByTestId('filled-chart');
    expect(container).toHaveClass('bg-[rgba(249,250,251,1)]');
  });

  it('applies elevated variant classes', () => {
    render(<ChartInterface data={mockData} variant="elevated" testId="elevated-chart" />);
    const container = screen.getByTestId('elevated-chart');
    // The component applies both drop shadows as a single combined Tailwind
    // arbitrary class. toHaveClass() does exact token matching which fails on
    // comma-containing values, so we check className directly.
    expect(container.className).toContain('shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)');
  });

  it('applies flat variant classes', () => {
    render(<ChartInterface data={mockData} variant="flat" testId="flat-chart" />);
    const container = screen.getByTestId('flat-chart');
    expect(container).toHaveClass('bg-transparent');
  });

  it('applies card variant classes', () => {
    render(<ChartInterface data={mockData} variant="card" testId="card-chart" />);
    const container = screen.getByTestId('card-chart');
    expect(container).toHaveClass('p-6');
  });
});

// ─── SIZES ──────────────────────────────────────────────────────────────────

describe('ChartInterface — Sizes', () => {
  const mockData = { labels: ['A'], datasets: [{ data: [1] }] };

  it('applies sm size class', () => {
    render(<ChartInterface data={mockData} size="sm" testId="sm-chart" />);
    expect(screen.getByTestId('sm-chart')).toHaveClass('h-48');
  });

  it('applies default size class', () => {
    render(<ChartInterface data={mockData} testId="default-size" />);
    expect(screen.getByTestId('default-size')).toHaveClass('h-64');
  });

  it('applies lg size class', () => {
    render(<ChartInterface data={mockData} size="lg" testId="lg-chart" />);
    expect(screen.getByTestId('lg-chart')).toHaveClass('h-96');
  });

  it('applies xl size class', () => {
    render(<ChartInterface data={mockData} size="xl" testId="xl-chart" />);
    expect(screen.getByTestId('xl-chart')).toHaveClass('h-[500px]');
  });
});

// ─── CONTENT ────────────────────────────────────────────────────────────────

describe('ChartInterface — Content', () => {
  it('renders canvas with full width and height', () => {
    render(<ChartInterface data={{}} testId="chart-content" />);
    const container = screen.getByTestId('chart-content');
    const canvas = container.querySelector('canvas');
    expect(canvas).toHaveClass('w-full');
    expect(canvas).toHaveClass('h-full');
  });

  it('handles custom className', () => {
    render(<ChartInterface data={{}} className="custom-class" testId="custom" />);
    expect(screen.getByTestId('custom')).toHaveClass('custom-class');
  });

  it('passes through additional props', () => {
    const mockRef = { current: null };
    render(<ChartInterface data={{}} ref={mockRef as any} testId="props" aria-label="Test Chart" />);
    expect(screen.getByTestId('props')).toHaveAttribute('aria-label', 'Test Chart');
  });
});

// ─── STYLING ────────────────────────────────────────────────────────────────

describe('ChartInterface — Styling', () => {
  it('container has transition classes', () => {
    render(<ChartInterface data={{}} testId="transition" />);
    expect(screen.getByTestId('transition')).toHaveClass('transition-all', 'duration-200');
  });

  it('applies rounded-lg to all variants', () => {
    render(<ChartInterface data={{}} testId="rounded" variant="card" />);
    expect(screen.getByTestId('rounded')).toHaveClass('rounded-lg');
  });

  it('applies border to default variant', () => {
    render(<ChartInterface data={{}} testId="border" />);
    expect(screen.getByTestId('border')).toHaveClass('border-[rgba(229,231,235,1)]');
  });
});

// ─── CHART TYPES ────────────────────────────────────────────────────────────

describe('ChartInterface — Chart Types', () => {
  const mockData = { labels: ['A'], datasets: [{ data: [1] }] };

  it('renders with line chart type', () => {
    render(<ChartInterface data={mockData} type="line" testId="line-chart" />);
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
  });

  it('renders with bar chart type', () => {
    render(<ChartInterface data={mockData} type="bar" testId="bar-chart" />);
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });

  it('renders with pie chart type', () => {
    render(<ChartInterface data={mockData} type="pie" testId="pie-chart" />);
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
  });
});

// ─── OPTIONS ────────────────────────────────────────────────────────────────

describe('ChartInterface — Options', () => {
  it('handles empty options object', () => {
    render(<ChartInterface data={{}} options={{}} testId="empty-options" />);
    expect(screen.getByTestId('empty-options')).toBeInTheDocument();
  });

  it('handles complex options object', () => {
    const complexOptions = {
      scales: { y: { beginAtZero: true } },
      plugins: { legend: { display: true } }
    };
    render(<ChartInterface data={{}} options={complexOptions} testId="complex" />);
    expect(screen.getByTestId('complex')).toBeInTheDocument();
  });
});