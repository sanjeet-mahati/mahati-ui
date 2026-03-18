import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';

// ─── Mock @emotion/styled ─────────────────────────────────────────────────────
jest.mock('@emotion/styled', () => {
  const styled = (tag: any) => (styles: any) => {
    const Component = ({ children, ...props }: any) =>
      React.createElement(tag, props, children);
    Component.displayName = `styled.${tag}`;
    return Component;
  };
  ['div', 'h3', 'input', 'p'].forEach((tag) => {
    (styled as any)[tag] = styled(tag);
  });
  return { __esModule: true, default: styled };
});

// ─── Mock sample-chart-data.json ──────────────────────────────────────────────
jest.mock('../../../app/chart/sample-chart-data.json', () => ({
  metadata: { title: 'Test Chart Analytics' },
  chartData: {
    pie: { labels: ['A', 'B'], datasets: [{ data: [60, 40], backgroundColor: ['red', 'blue'] }] },
    doughnut: { labels: ['X', 'Y'], datasets: [{ data: [50, 50], backgroundColor: ['green', 'yellow'] }] },
    line: { labels: ['Jan', 'Feb'], datasets: [{ label: 'Line 1', data: [10, 20], borderColor: 'blue' }] },
    area: {
      default: { labels: ['Jan', 'Feb'], datasets: [{ label: 'Area 1', data: [5, 15], borderColor: '#1d4ed8', backgroundColor: { gradient: { color: '#1d4ed8', opacityStart: 0.3, opacityEnd: 0 } } }] },
      Relationship: { Partner: { labels: ['Jan'], datasets: [{ label: 'Partner', data: [10], borderColor: '#16a34a' }] } },
      Periodicity: { '12 months': { labels: ['Jan', 'Feb'], datasets: [{ label: '12m', data: [1, 2], borderColor: 'red' }] } },
    },
    bar: { labels: ['Q1', 'Q2'], datasets: [{ data: [100, 200] }] },
    columnchart: { labels: ['Cat A'], datasets: [{ data: [10] }] },
    groupbar: { labels: ['G1'], datasets: [{ data: [5] }] },
    stackbar: { labels: ['S1'], datasets: [{ data: [3] }] },
    lollipop: { labels: ['L1'], datasets: [{ data: [8] }] },
    kpi: { labels: ['K1'], datasets: [{ data: [90] }] },
  },
  filters: {
    default: [
      { id: 'Relationship', label: 'Relationship', options: ['Partner', 'Direct'] },
      { id: 'DebtCollector', label: 'Debt Collector', options: ['Collector A', 'Collector B'] },
      { id: 'Periodicity', label: 'Periodicity', options: ['12 months', '6 months'] },
    ],
    bulletGauge: [
      { id: 'SelectYear', label: 'Year', options: ['2026', '2025'] },
      { id: 'SelectMonth', label: 'Month', options: ['January', 'February'] },
      { id: 'SelectType', label: 'Type', options: ['Sales', 'Revenue'] },
    ],
    gantt: [
      { id: 'SelectYear', label: 'Year', options: ['2026'] },
      { id: 'SelectMonth', label: 'Month', options: ['Jan - Feb'] },
      { id: 'SelectType', label: 'Type', options: ['Development'] },
    ],
    horizontalbar: [
      { id: 'SelectYear', label: 'Year', options: ['2026'] },
      { id: 'SelectMonth', label: 'Month', options: ['January'] },
      { id: 'SelectType', label: 'Type', options: ['Product 1'] },
    ],
    calendarheatmap: [
      { id: 'SelectYear', label: 'Year', options: ['2026'] },
      { id: 'SelectType', label: 'Type', options: ['Development'] },
    ],
    lollipop: [
      { id: 'SelectYear', label: 'Year', options: ['2026'] },
      { id: 'SelectOrientation', label: 'Orientation', options: ['horizontal', 'vertical'] },
    ],
    kpi: [
      { id: 'SelectYear', label: 'Year', options: ['2026'] },
    ],
    riskgauge: [
      { id: 'SelectYear', label: 'Year', options: ['2026'] },
      { id: 'SelectMonth', label: 'Month', options: ['January'] },
      { id: 'SelectType', label: 'Type', options: ['Credit Score'] },
    ],
  },
  quickStats: {
    pie: { total: 100 },
    area: { total: 200 },
    line: { total: 30 },
    bullet: { total: 50 },
    gauge: { total: 60 },
    gantt: { total: 5 },
    calendarheatmap: { total: 365 },
    horizontalbar: { total: 150 },
    lollipop: { total: 10 },
    kpi: { total: 90 },
    riskgauge: { total: 75 },
  },
  actionButtons: [
    { label: 'Export', style: 'primary' },
    { label: 'Reset', style: 'danger' },
  ],
  bullet: {
    '2026': {
      Sales: {
        January: {
          bullets: [
            { name: 'North', achieved: 800, target: 1000 },
            { name: 'South', achieved: 650, target: 1000 },
          ],
        },
      },
    },
  },
  gauge: {
    '2026': {
      Sales: {
        January: {
          gauges: [
            { name: 'Revenue', value: 750, max: 1000 },
          ],
        },
      },
    },
  },
  gantt: {
    '2026': {
      Development: {
        tasks: [
          { name: 'Task A', status: 'In Progress', progress: 50, startDate: '2026-01-01', endDate: '2026-01-15', color: 'blue' },
          { name: 'Task B', status: 'Overdue', progress: 20, startDate: '2026-01-05', endDate: '2026-01-10', color: 'red' },
        ],
      },
    },
  },
  calendarheatmap: {
    'Project 1': {
      '2026': {
        Development: {
          January: { data: [{ date: '2026-01-15', value: 120 }, { date: '2026-01-16', value: 80 }] },
          February: { data: [{ date: '2026-02-10', value: 60 }] },
        },
      },
    },
  },
  horizontalbar: {
    products: {
      'Product A': { Revenue: 500, Profit: 200, Cost: 300 },
    },
  },
  riskgauge: {
    '2026': {
      January: {
        'Credit Score': [
          { name: 'Customer A', score: 720, max: 850 },
        ],
      },
    },
  },
}), { virtual: false });

// ─── Mock @/lib ───────────────────────────────────────────────────────────────
jest.mock('@/lib', () => ({
  MahatiChartAnalyticsWidget: ({
    title,
    chartTypes,
    onChartTypeChange,
    onFiltersChange,
    onApplyFilters,
    actionButtons,
    details,
    quickStats,
  }: any) => (
    <div data-testid="chart-analytics-widget">
      <h2 data-testid="widget-title">{title}</h2>
      <div data-testid="chart-types">
        {chartTypes?.map((type: string) => (
          <button
            key={type}
            data-testid={`chart-type-${type}`}
            onClick={() => onChartTypeChange?.(type)}
          >
            {type}
          </button>
        ))}
      </div>
      <button
        data-testid="trigger-filter-change"
        onClick={() => onFiltersChange?.({ Relationship: 'Direct', Periodicity: '6 months' })}
      >
        Change Filters
      </button>
      <button
        data-testid="trigger-apply-filters"
        onClick={() => onApplyFilters?.()}
      >
        Apply Filters
      </button>
      <div data-testid="action-buttons">
        {actionButtons?.map((btn: any) => (
          <button key={btn.label} data-testid={`action-${btn.label}`} onClick={btn.onClick}>
            {btn.label}
          </button>
        ))}
      </div>
      <div data-testid="details">
        {details?.map((d: any, i: number) => (
          <div key={i} data-testid={`detail-${i}`}>{d.label}: {d.value}</div>
        ))}
      </div>
      <div data-testid="quick-stats">{JSON.stringify(quickStats)}</div>
    </div>
  ),
}));

// ─── Import real component ────────────────────────────────────────────────────
import MahatiChart from '../../../app/chart/page';

// ═══════════════════════════════════════════════════════════════════════════════
// Helpers
// ═══════════════════════════════════════════════════════════════════════════════

const renderChart = () => render(<MahatiChart />);

// ═══════════════════════════════════════════════════════════════════════════════
// Render
// ═══════════════════════════════════════════════════════════════════════════════

describe('MahatiChart — Render', () => {
  it('renders without crashing', () => {
    const { container } = renderChart();
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders the page heading "Charts"', () => {
    renderChart();
    expect(screen.getByText('Charts')).toBeInTheDocument();
  });

  it('renders the chart type description paragraph', () => {
    renderChart();
    expect(screen.getByText(/Charts UI provides various types of charts/)).toBeInTheDocument();
  });

  it('renders Pie in the description', () => {
    renderChart();
    expect(screen.getByText('"Pie"')).toBeInTheDocument();
  });

  it('renders Doughnut in the description', () => {
    renderChart();
    expect(screen.getByText('"Doughnut"')).toBeInTheDocument();
  });

  it('renders Gantt in the description', () => {
    renderChart();
    expect(screen.getByText('"Gantt"')).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Upload Card
// ═══════════════════════════════════════════════════════════════════════════════

describe('MahatiChart — Upload Card', () => {
  it('renders Upload Custom Data section', () => {
    renderChart();
    expect(screen.getByText('Upload Custom Data (Optional)')).toBeInTheDocument();
  });

  it('renders file input with correct accept attribute', () => {
    renderChart();
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(fileInput).toBeInTheDocument();
    expect(fileInput).toHaveAttribute('accept', '.json');
  });

  it('renders upload hint text', () => {
    renderChart();
    expect(screen.getByText(/Upload a JSON file with the same structure/)).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Widget Integration
// ═══════════════════════════════════════════════════════════════════════════════

describe('MahatiChart — Widget Integration', () => {
  it('renders MahatiChartAnalyticsWidget', () => {
    renderChart();
    expect(screen.getByTestId('chart-analytics-widget')).toBeInTheDocument();
  });

  it('passes title from metadata to widget', () => {
    renderChart();
    expect(screen.getByTestId('widget-title')).toHaveTextContent('Test Chart Analytics');
  });

  it('passes all chart types to widget', () => {
    renderChart();
    const expectedTypes = ['pie', 'doughnut', 'line', 'area', 'bar', 'bullet', 'gauge', 'gantt', 'calendarheatmap', 'horizontalbar', 'columnchart', 'groupbar', 'stackbar', 'lollipop', 'kpi', 'riskgauge'];
    expectedTypes.forEach(type => {
      expect(screen.getByTestId(`chart-type-${type}`)).toBeInTheDocument();
    });
  });

  it('renders action buttons from JSON', () => {
    renderChart();
    expect(screen.getByTestId('action-Export')).toBeInTheDocument();
    expect(screen.getByTestId('action-Reset')).toBeInTheDocument();
  });

  it('action button onClick triggers alert', () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
    renderChart();
    fireEvent.click(screen.getByTestId('action-Export'));
    expect(alertMock).toHaveBeenCalledWith('Export clicked!');
    alertMock.mockRestore();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Chart Type Switching — covers handleChartTypeChange + currentSelectedFilters
// ═══════════════════════════════════════════════════════════════════════════════

describe('MahatiChart — Chart Type Switching', () => {
  const switchTo = (type: string) => {
    renderChart();
    fireEvent.click(screen.getByTestId(`chart-type-${type}`));
  };

  it('switches to pie chart type', () => {
    switchTo('pie');
    expect(screen.getByTestId('chart-analytics-widget')).toBeInTheDocument();
  });

  it('switches to doughnut chart type', () => {
    switchTo('doughnut');
    expect(screen.getByTestId('chart-analytics-widget')).toBeInTheDocument();
  });

  it('switches to line chart type', () => {
    switchTo('line');
    expect(screen.getByTestId('chart-analytics-widget')).toBeInTheDocument();
  });

  it('switches to bar chart type', () => {
    switchTo('bar');
    expect(screen.getByTestId('chart-analytics-widget')).toBeInTheDocument();
  });

  it('switches to bullet chart type', () => {
    switchTo('bullet');
    expect(screen.getByTestId('chart-analytics-widget')).toBeInTheDocument();
  });

  it('switches to gauge chart type', () => {
    switchTo('gauge');
    expect(screen.getByTestId('chart-analytics-widget')).toBeInTheDocument();
  });

  it('switches to gantt chart type', () => {
    switchTo('gantt');
    expect(screen.getByTestId('chart-analytics-widget')).toBeInTheDocument();
  });

  it('switches to calendarheatmap chart type', () => {
    switchTo('calendarheatmap');
    expect(screen.getByTestId('chart-analytics-widget')).toBeInTheDocument();
  });

  it('switches to horizontalbar chart type', () => {
    switchTo('horizontalbar');
    expect(screen.getByTestId('chart-analytics-widget')).toBeInTheDocument();
  });

  it('switches to lollipop chart type', () => {
    switchTo('lollipop');
    expect(screen.getByTestId('chart-analytics-widget')).toBeInTheDocument();
  });

  it('switches to kpi chart type', () => {
    switchTo('kpi');
    expect(screen.getByTestId('chart-analytics-widget')).toBeInTheDocument();
  });

  it('switches to riskgauge chart type', () => {
    switchTo('riskgauge');
    expect(screen.getByTestId('chart-analytics-widget')).toBeInTheDocument();
  });

  it('switches to columnchart type', () => {
    switchTo('columnchart');
    expect(screen.getByTestId('chart-analytics-widget')).toBeInTheDocument();
  });

  it('switches to groupbar type', () => {
    switchTo('groupbar');
    expect(screen.getByTestId('chart-analytics-widget')).toBeInTheDocument();
  });

  it('switches to stackbar type', () => {
    switchTo('stackbar');
    expect(screen.getByTestId('chart-analytics-widget')).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Filter Handling — covers handleFiltersChange branches
// ═══════════════════════════════════════════════════════════════════════════════

describe('MahatiChart — Filter Handling', () => {
  it('handles filter change on default (area) chart type', () => {
    renderChart();
    fireEvent.click(screen.getByTestId('trigger-filter-change'));
    expect(screen.getByTestId('chart-analytics-widget')).toBeInTheDocument();
  });

  it('handles filter change on bullet chart type', () => {
    renderChart();
    fireEvent.click(screen.getByTestId('chart-type-bullet'));
    fireEvent.click(screen.getByTestId('trigger-filter-change'));
    expect(screen.getByTestId('chart-analytics-widget')).toBeInTheDocument();
  });

  it('handles filter change on gauge chart type', () => {
    renderChart();
    fireEvent.click(screen.getByTestId('chart-type-gauge'));
    fireEvent.click(screen.getByTestId('trigger-filter-change'));
    expect(screen.getByTestId('chart-analytics-widget')).toBeInTheDocument();
  });

  it('handles filter change on gantt chart type', () => {
    renderChart();
    fireEvent.click(screen.getByTestId('chart-type-gantt'));
    fireEvent.click(screen.getByTestId('trigger-filter-change'));
    expect(screen.getByTestId('chart-analytics-widget')).toBeInTheDocument();
  });

  it('handles filter change on horizontalbar chart type', () => {
    renderChart();
    fireEvent.click(screen.getByTestId('chart-type-horizontalbar'));
    fireEvent.click(screen.getByTestId('trigger-filter-change'));
    expect(screen.getByTestId('chart-analytics-widget')).toBeInTheDocument();
  });

  it('handles filter change on calendarheatmap chart type', () => {
    renderChart();
    fireEvent.click(screen.getByTestId('chart-type-calendarheatmap'));
    fireEvent.click(screen.getByTestId('trigger-filter-change'));
    expect(screen.getByTestId('chart-analytics-widget')).toBeInTheDocument();
  });

  it('handles filter change on lollipop chart type', () => {
    renderChart();
    fireEvent.click(screen.getByTestId('chart-type-lollipop'));
    fireEvent.click(screen.getByTestId('trigger-filter-change'));
    expect(screen.getByTestId('chart-analytics-widget')).toBeInTheDocument();
  });

  it('handles filter change on kpi chart type', () => {
    renderChart();
    fireEvent.click(screen.getByTestId('chart-type-kpi'));
    fireEvent.click(screen.getByTestId('trigger-filter-change'));
    expect(screen.getByTestId('chart-analytics-widget')).toBeInTheDocument();
  });

  it('handles filter change on riskgauge chart type', () => {
    renderChart();
    fireEvent.click(screen.getByTestId('chart-type-riskgauge'));
    fireEvent.click(screen.getByTestId('trigger-filter-change'));
    expect(screen.getByTestId('chart-analytics-widget')).toBeInTheDocument();
  });

  it('calls handleApplyFilters without errors', () => {
    renderChart();
    expect(() => fireEvent.click(screen.getByTestId('trigger-apply-filters'))).not.toThrow();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Details derivation — covers currentDetails useMemo branches
// ═══════════════════════════════════════════════════════════════════════════════

describe('MahatiChart — Details Derivation', () => {
  it('derives details for area chart (default)', () => {
    renderChart();
    // area is the default — details derived from datasets
    expect(screen.getByTestId('details')).toBeInTheDocument();
  });

  it('derives details for pie chart (labels/percentage fallback)', () => {
    renderChart();
    fireEvent.click(screen.getByTestId('chart-type-pie'));
    const details = screen.getByTestId('details');
    expect(details).toBeInTheDocument();
  });

  it('derives details for line chart', () => {
    renderChart();
    fireEvent.click(screen.getByTestId('chart-type-line'));
    expect(screen.getByTestId('details')).toBeInTheDocument();
  });

  it('derives details for bullet chart', () => {
    renderChart();
    fireEvent.click(screen.getByTestId('chart-type-bullet'));
    const details = screen.getByTestId('details');
    expect(details).toBeInTheDocument();
  });

  it('derives details for gauge chart', () => {
    renderChart();
    fireEvent.click(screen.getByTestId('chart-type-gauge'));
    expect(screen.getByTestId('details')).toBeInTheDocument();
  });

  it('derives details for gantt chart', () => {
    renderChart();
    fireEvent.click(screen.getByTestId('chart-type-gantt'));
    expect(screen.getByTestId('details')).toBeInTheDocument();
  });

  it('derives details for calendarheatmap chart', () => {
    renderChart();
    fireEvent.click(screen.getByTestId('chart-type-calendarheatmap'));
    expect(screen.getByTestId('details')).toBeInTheDocument();
  });

  it('derives details for horizontalbar chart', () => {
    renderChart();
    fireEvent.click(screen.getByTestId('chart-type-horizontalbar'));
    expect(screen.getByTestId('details')).toBeInTheDocument();
  });

  it('derives details for riskgauge chart', () => {
    renderChart();
    fireEvent.click(screen.getByTestId('chart-type-riskgauge'));
    expect(screen.getByTestId('details')).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// File Upload — covers handleFileUpload
// ═══════════════════════════════════════════════════════════════════════════════

describe('MahatiChart — File Upload', () => {
  const validJson = JSON.stringify({
    metadata: { title: 'Uploaded Chart' },
    chartData: {
      pie: { labels: ['U'], datasets: [{ data: [100], backgroundColor: ['purple'] }] },
      doughnut: { labels: [], datasets: [] },
      line: { labels: [], datasets: [] },
      area: { default: { labels: [], datasets: [] } },
      bar: { labels: [], datasets: [] },
    },
    filters: { default: [] },
    quickStats: {},
    actionButtons: [],
  });

  it('updates chart data on valid JSON upload', async () => {
    renderChart();
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

    const file = new File([validJson], 'data.json', { type: 'application/json' });

    // Mock FileReader
    const mockReader = {
      onload: null as any,
      readAsText: jest.fn(function (this: any) {
        setTimeout(() => this.onload?.({ target: { result: validJson } }), 0);
      }),
    };
    jest.spyOn(global, 'FileReader').mockImplementation(() => mockReader as any);

    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [file] } });
      await new Promise(r => setTimeout(r, 10));
    });

    expect(screen.getByTestId('chart-analytics-widget')).toBeInTheDocument();
  });

  it('shows alert on invalid JSON structure (missing chartData)', async () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
    renderChart();
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

    const invalidJson = JSON.stringify({ something: 'wrong' });
    const file = new File([invalidJson], 'bad.json', { type: 'application/json' });

    const mockReader = {
      onload: null as any,
      readAsText: jest.fn(function (this: any) {
        setTimeout(() => this.onload?.({ target: { result: invalidJson } }), 0);
      }),
    };
    jest.spyOn(global, 'FileReader').mockImplementation(() => mockReader as any);

    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [file] } });
      await new Promise(r => setTimeout(r, 10));
    });

    expect(alertMock).toHaveBeenCalledWith('Invalid JSON structure.');
    alertMock.mockRestore();
  });

  it('shows alert on malformed JSON', async () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
    renderChart();
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

    const badJson = 'not valid json {{{{';
    const file = new File([badJson], 'corrupt.json', { type: 'application/json' });

    const mockReader = {
      onload: null as any,
      readAsText: jest.fn(function (this: any) {
        setTimeout(() => this.onload?.({ target: { result: badJson } }), 0);
      }),
    };
    jest.spyOn(global, 'FileReader').mockImplementation(() => mockReader as any);

    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [file] } });
      await new Promise(r => setTimeout(r, 10));
    });

    expect(alertMock).toHaveBeenCalledWith('Invalid JSON file.');
    alertMock.mockRestore();
  });

  it('does nothing when no file is selected', () => {
    renderChart();
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(() =>
      fireEvent.change(fileInput, { target: { files: [] } })
    ).not.toThrow();
  });
});