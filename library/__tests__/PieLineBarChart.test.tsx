import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PieLineBarChart, makeAreaDataStraight, PieLineBarChartType } from '../src/components/PieLineBarChart';
import { ChartData } from 'chart.js';

// ─── MOCK CHART.JS ───────────────────────────────────────────────────────────
// chart.js renders onto canvas which is unavailable in jsdom — mock react-chartjs-2

jest.mock('react-chartjs-2', () => ({
  Doughnut: ({ data }: any) => <canvas data-testid="doughnut-chart" aria-label="doughnut" />,
  Line:     ({ data }: any) => <canvas data-testid="line-chart"     aria-label="line" />,
  Bar:      ({ data }: any) => <canvas data-testid="bar-chart"      aria-label="bar" />,
}));

// ─── SHARED DATA ─────────────────────────────────────────────────────────────

const pieData: ChartData<'doughnut'> = {
  labels: ['Category A', 'Category B', 'Category C'],
  datasets: [
    {
      data: [40, 30, 30],
      backgroundColor: ['#4CAF50', '#2196F3', '#FF9800'],
    },
  ],
};

const lineData: ChartData<'line'> = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr'],
  datasets: [
    {
      label: 'Values',
      data: [100, 150, 120, 180],
      borderColor: '#4CAF50',
      backgroundColor: 'rgba(76,175,80,0.1)',
      fill: true,
    },
  ],
};

const barData: ChartData<'bar'> = {
  labels: ['Q1', 'Q2', 'Q3', 'Q4'],
  datasets: [
    {
      label: 'Revenue',
      data: [200, 250, 180, 300],
      backgroundColor: '#2196F3',
    },
  ],
};

// ─── RENDER ──────────────────────────────────────────────────────────────────

describe('PieLineBarChart — Render', () => {
  it('renders without crashing for "pie" type', () => {
    const { container } = render(<PieLineBarChart chartType="pie" data={pieData} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders without crashing for "doughnut" type', () => {
    const { container } = render(<PieLineBarChart chartType="doughnut" data={pieData} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders without crashing for "line" type', () => {
    const { container } = render(<PieLineBarChart chartType="line" data={lineData} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders without crashing for "area" type', () => {
    const { container } = render(<PieLineBarChart chartType="area" data={lineData} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders without crashing for "bar" type', () => {
    const { container } = render(<PieLineBarChart chartType="bar" data={barData} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('has correct displayName', () => {
    expect(PieLineBarChart.displayName).toBe('PieLineBarChart');
  });
});

// ─── CHART TYPE ROUTING ──────────────────────────────────────────────────────

describe('PieLineBarChart — Chart Type Routing', () => {
  it('renders a Doughnut canvas for "pie"', () => {
    render(<PieLineBarChart chartType="pie" data={pieData} />);
    expect(screen.getByTestId('doughnut-chart')).toBeInTheDocument();
  });

  it('renders a Doughnut canvas for "doughnut"', () => {
    render(<PieLineBarChart chartType="doughnut" data={pieData} />);
    expect(screen.getByTestId('doughnut-chart')).toBeInTheDocument();
  });

  it('renders a Line canvas for "line"', () => {
    render(<PieLineBarChart chartType="line" data={lineData} />);
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
  });

  it('renders a Line canvas for "area"', () => {
    render(<PieLineBarChart chartType="area" data={lineData} />);
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
  });

  it('renders a Bar canvas for "bar"', () => {
    render(<PieLineBarChart chartType="bar" data={barData} />);
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });

  it('does NOT render a Line chart for "pie" type', () => {
    render(<PieLineBarChart chartType="pie" data={pieData} />);
    expect(screen.queryByTestId('line-chart')).not.toBeInTheDocument();
  });

  it('does NOT render a Bar chart for "line" type', () => {
    render(<PieLineBarChart chartType="line" data={lineData} />);
    expect(screen.queryByTestId('bar-chart')).not.toBeInTheDocument();
  });

  it('does NOT render a Doughnut chart for "bar" type', () => {
    render(<PieLineBarChart chartType="bar" data={barData} />);
    expect(screen.queryByTestId('doughnut-chart')).not.toBeInTheDocument();
  });
});

// ─── WRAPPER STRUCTURE ───────────────────────────────────────────────────────

describe('PieLineBarChart — Wrapper Structure', () => {
  it('root div has w-full class', () => {
    const { container } = render(<PieLineBarChart chartType="bar" data={barData} />);
    expect(container.firstElementChild).toHaveClass('w-full');
  });

  it('root div has h-full class', () => {
    const { container } = render(<PieLineBarChart chartType="bar" data={barData} />);
    expect(container.firstElementChild).toHaveClass('h-full');
  });

  it('root div has flex class', () => {
    const { container } = render(<PieLineBarChart chartType="bar" data={barData} />);
    expect(container.firstElementChild).toHaveClass('flex');
  });

  it('root div centers content with items-center and justify-center', () => {
    const { container } = render(<PieLineBarChart chartType="pie" data={pieData} />);
    const root = container.firstElementChild;
    expect(root).toHaveClass('items-center');
    expect(root).toHaveClass('justify-center');
  });
});

// ─── CUSTOM OPTIONS ──────────────────────────────────────────────────────────

describe('PieLineBarChart — Custom Options', () => {
  it('accepts and applies custom options without crashing', () => {
    const customOptions = {
      responsive: true,
      plugins: { legend: { display: true } },
    };
    const { container } = render(
      <PieLineBarChart chartType="bar" data={barData} options={customOptions} />
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('uses default options when options prop is not provided', () => {
    const { container } = render(<PieLineBarChart chartType="line" data={lineData} />);
    expect(container.firstChild).toBeInTheDocument();
  });
});

// ─── makeAreaDataStraight HELPER ─────────────────────────────────────────────

describe('makeAreaDataStraight', () => {
  it('returns a new object (does not mutate the original)', () => {
    const original: ChartData<any> = {
      labels: ['Jan', 'Feb'],
      datasets: [{ data: [1, 2], label: 'Test' }],
    };
    const result = makeAreaDataStraight(original);
    expect(result).not.toBe(original);
  });

  it('preserves labels', () => {
    const data: ChartData<any> = {
      labels: ['Jan', 'Feb', 'Mar'],
      datasets: [{ data: [1, 2, 3] }],
    };
    const result = makeAreaDataStraight(data);
    expect(result.labels).toEqual(['Jan', 'Feb', 'Mar']);
  });

  it('sets tension to 0 on all datasets', () => {
    const data: ChartData<any> = {
      labels: ['Jan'],
      datasets: [
        { data: [1], tension: 0.4 },
        { data: [2], tension: 0.2 },
      ],
    };
    const result = makeAreaDataStraight(data);
    result.datasets.forEach((ds: any) => {
      expect(ds.tension).toBe(0);
    });
  });

  it('sets cubicInterpolationMode to "default" on all datasets', () => {
    const data: ChartData<any> = {
      labels: ['Jan'],
      datasets: [{ data: [1] }],
    };
    const result = makeAreaDataStraight(data);
    result.datasets.forEach((ds: any) => {
      expect(ds.cubicInterpolationMode).toBe('default');
    });
  });

  it('preserves other dataset properties', () => {
    const data: ChartData<any> = {
      labels: ['Jan'],
      datasets: [{ data: [42], label: 'Revenue', backgroundColor: '#fff' }],
    };
    const result = makeAreaDataStraight(data);
    expect(result.datasets[0].label).toBe('Revenue');
    expect(result.datasets[0].backgroundColor).toBe('#fff');
    expect((result.datasets[0] as any).data).toEqual([42]);
  });

  it('handles empty datasets array gracefully', () => {
    const data: ChartData<any> = { labels: [], datasets: [] };
    const result = makeAreaDataStraight(data);
    expect(result.datasets).toHaveLength(0);
  });

  it('handles missing datasets key gracefully', () => {
    const data = { labels: ['Jan'] } as any;
    expect(() => makeAreaDataStraight(data)).not.toThrow();
  });
});

// ─── SNAPSHOT ────────────────────────────────────────────────────────────────

describe('PieLineBarChart — Snapshot', () => {
  it('matches snapshot for pie type', () => {
    const { container } = render(<PieLineBarChart chartType="pie" data={pieData} />);
    expect(container).toMatchSnapshot();
  });

  it('matches snapshot for line type', () => {
    const { container } = render(<PieLineBarChart chartType="line" data={lineData} />);
    expect(container).toMatchSnapshot();
  });

  it('matches snapshot for bar type', () => {
    const { container } = render(<PieLineBarChart chartType="bar" data={barData} />);
    expect(container).toMatchSnapshot();
  });

  it('matches snapshot for area type', () => {
    const { container } = render(<PieLineBarChart chartType="area" data={lineData} />);
    expect(container).toMatchSnapshot();
  });
});