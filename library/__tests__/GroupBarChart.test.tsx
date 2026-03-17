import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { GroupBarChart } from '../src/components/GroupBarChart';

// ─── SHARED DATA ─────────────────────────────────────────────────────────────

const groups = [
  { name: 'Q1', revenue: 100, cost: 60 },
  { name: 'Q2', revenue: 80, cost: 50, profitOrLoss: 20 },
];

const yAxisConfig = {
  min: 0,
  max: 125,
  step: 25,
  labels: [0, 25, 50, 75, 100, 125],
};

const legends = [
  { key: 'revenue', label: 'Revenue', color: '#abc123' },
  { key: 'profit',  label: 'Profit',  color: '#def456' },
  { key: 'cost',    label: 'Cost',    color: '#789abc' },
];

// ─── RENDER ──────────────────────────────────────────────────────────────────

describe('GroupBarChart — Render', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <GroupBarChart title="T" groups={groups} selectedYear="2024" selectedMonth="Jan" />
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders the title', () => {
    render(<GroupBarChart title="Revenue" groups={groups} selectedYear="2024" selectedMonth="Jan" />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
  });

  it('has correct displayName', () => {
    expect(GroupBarChart.displayName).toBe('GroupBarChart');
  });
});

// ─── X-AXIS / GROUP NAMES ────────────────────────────────────────────────────

describe('GroupBarChart — X-Axis Labels', () => {
  it('renders group names on x-axis', () => {
    render(<GroupBarChart title="T" groups={groups} selectedYear="2024" selectedMonth="Jan" />);
    expect(screen.getByText('Q1')).toBeInTheDocument();
    expect(screen.getByText('Q2')).toBeInTheDocument();
  });

  it('renders all group names when more than two groups', () => {
    const threeGroups = [
      { name: 'Q1', revenue: 10, cost: 5 },
      { name: 'Q2', revenue: 20, cost: 8 },
      { name: 'Q3', revenue: 30, cost: 12 },
    ];
    render(<GroupBarChart title="T" groups={threeGroups} selectedYear="2024" selectedMonth="Jan" />);
    expect(screen.getByText('Q1')).toBeInTheDocument();
    expect(screen.getByText('Q2')).toBeInTheDocument();
    expect(screen.getByText('Q3')).toBeInTheDocument();
  });

  it('handles empty groups gracefully', () => {
    render(<GroupBarChart title="T" groups={[]} selectedYear="2024" selectedMonth="Jan" />);
    expect(screen.getByText('T')).toBeInTheDocument();
  });
});

// ─── Y-AXIS LABELS ───────────────────────────────────────────────────────────

describe('GroupBarChart — Y-Axis Labels', () => {
  it('renders all custom yAxis labels', () => {
    render(
      <GroupBarChart title="T" groups={[{name:'Q1', revenue:10, cost:5}]} yAxisConfig={yAxisConfig} selectedYear="2024" selectedMonth="Jan" />
    );
    // Target Y-axis spans only (width:40px container, specific styling)
    const yAxisContainer = screen.getByText('125').closest('div')?.querySelectorAll('span.sm\\:text-xs');
    expect(yAxisContainer).toHaveLength(6);
    expect(screen.getByText('125')).toBeInTheDocument(); // Top label
    expect(screen.getByText('0')).toBeInTheDocument();   // Bottom label
  });

  it('renders the max label', () => {
    render(<GroupBarChart title="T" groups={groups} yAxisConfig={yAxisConfig} selectedYear="2024" selectedMonth="Jan" />);
    expect(screen.getByText('125')).toBeInTheDocument();
  });

  it('renders the zero label', () => {
    render(<GroupBarChart title="T" groups={groups} yAxisConfig={yAxisConfig} selectedYear="2024" selectedMonth="Jan" />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('renders default y-axis labels when yAxisConfig not provided', () => {
    render(<GroupBarChart title="T" groups={groups} selectedYear="2024" selectedMonth="Jan" />);
    expect(screen.getByText('125')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });
});

// ─── BAR VALUE LABELS ────────────────────────────────────────────────────────

describe('GroupBarChart — Bar Value Labels', () => {
  it('renders revenue values as bar labels', () => {
    render(<GroupBarChart title="T" groups={groups} selectedYear="2024" selectedMonth="Jan" />);
    // Values appear above bars; may also appear in y-axis — getAllByText is safe
    expect(screen.getAllByText('100').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('80').length).toBeGreaterThanOrEqual(1);
  });

  it('renders cost values as bar labels', () => {
    render(<GroupBarChart title="T" groups={groups} selectedYear="2024" selectedMonth="Jan" />);
    expect(screen.getAllByText('60').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('50').length).toBeGreaterThanOrEqual(1);
  });

  it('uses profitOrLoss value when explicitly provided', () => {
    // Q2 has profitOrLoss: 20 explicitly set
    render(<GroupBarChart title="T" groups={groups} selectedYear="2024" selectedMonth="Jan" />);
    expect(screen.getAllByText('20').length).toBeGreaterThanOrEqual(1);
  });

  it('computes profit/loss from revenue - cost when profitOrLoss not provided', () => {
    // revenue 100 - cost 60 = 40
    render(
      <GroupBarChart
        title="T"
        groups={[{ name: 'X', revenue: 100, cost: 60 }]}
        selectedYear="2024"
        selectedMonth="Jan"
      />
    );
    expect(screen.getAllByText('40').length).toBeGreaterThanOrEqual(1);
  });

  it('renders absolute value for negative profitOrLoss', () => {
    // Component renders Math.abs(profitOrLoss) = Math.abs(-30) = 30
    const lossGroup = [{ name: 'X', revenue: 50, cost: 80, profitOrLoss: -30 }];
    render(<GroupBarChart title="T" groups={lossGroup} selectedYear="2024" selectedMonth="Jan" />);
    expect(screen.getAllByText('30').length).toBeGreaterThanOrEqual(1);
  });

  it('renders 0 values', () => {
    const zeroGroup = [{ name: 'X', revenue: 0, cost: 0 }];
    render(<GroupBarChart title="T" groups={zeroGroup} selectedYear="2024" selectedMonth="Jan" />);
    expect(screen.getAllByText('0').length).toBeGreaterThanOrEqual(1);
  });
});

// ─── COLORS ──────────────────────────────────────────────────────────────────
describe('GroupBarChart — Colors', () => {
  it('applies custom revenue color via inline background style', () => {
    const { container } = render(
      <GroupBarChart title="T" groups={[{name:'Q1', revenue:100, cost:60}]} legends={[{key:'revenue', label:'Rev', color:'#abc123'}]} selectedYear="2024" selectedMonth="Jan" />
    );
    const revenueBar = container.querySelector('.w-full.rounded-t.min-h-\\[2px\\]');
    expect(revenueBar).toHaveStyle('background-color: rgb(171, 193, 35)');
  });

  it('applies custom profit color via inline background style', () => {
    const { container } = render(
      <GroupBarChart title="T" groups={[{name:'Q1', revenue:100, cost:60}]} legends={[{key:'profit', label:'Profit', color:'#def456'}]} selectedYear="2024" selectedMonth="Jan" />
    );
    const bars = container.querySelectorAll('.w-full.rounded-t.min-h-\\[2px\\]');
    expect(bars[1]).toHaveStyle('background-color: rgb(222, 244, 86)'); // #def456
  });

  it('applies custom cost color via inline background style', () => {
    const { container } = render(
      <GroupBarChart title="T" groups={[{name:'Q1', revenue:100, cost:60}]} legends={[{key:'cost', label:'Cost', color:'#789abc'}]} selectedYear="2024" selectedMonth="Jan" />
    );
    const bars = container.querySelectorAll('.w-full.rounded-t.min-h-\\[2px\\]');
    expect(bars[2]).toHaveStyle('background-color: rgb(120, 154, 188)'); // #789abc
  });

  it('uses default revenue color when no legends provided', () => {
    const { container } = render(<GroupBarChart title="T" groups={groups} selectedYear="2024" selectedMonth="Jan" />);
    const revenueBar = container.querySelector('.w-full.rounded-t.min-h-\\[2px\\]');
    expect(revenueBar).toHaveStyle('background-color: rgb(23, 97, 163)');
  });

  it('uses default profit color for positive profit/loss', () => {
    const { container } = render(<GroupBarChart title="T" groups={[{name:'X', revenue:100, cost:50}]} selectedYear="2024" selectedMonth="Jan" />);
    const bars = container.querySelectorAll('.w-full.rounded-t.min-h-\\[2px\\]');
    expect(bars[1]).toHaveStyle('background-color: rgb(77, 175, 131)');
  });

  it('uses default loss color (red) for negative profit/loss', () => {
    const { container } = render(<GroupBarChart title="T" groups={[{name:'X', revenue:50, cost:80}]} selectedYear="2024" selectedMonth="Jan" />);
    const bars = container.querySelectorAll('.w-full.rounded-t.min-h-\\[2px\\]');
    expect(bars[1]).toHaveStyle('background-color: rgb(220, 38, 38)');
  });

  it('uses default cost color when no legends provided', () => {
    const { container } = render(<GroupBarChart title="T" groups={groups} selectedYear="2024" selectedMonth="Jan" />);
    const bars = container.querySelectorAll('.w-full.rounded-t.min-h-\\[2px\\]');
    expect(bars[2]).toHaveStyle('background-color: rgb(47, 164, 169)');
  });
});


// ─── MENU BUTTON ─────────────────────────────────────────────────────────────

describe('GroupBarChart — Menu Button', () => {
  it('renders a menu button', () => {
    render(<GroupBarChart title="T" groups={groups} selectedYear="2024" selectedMonth="Jan" />);
    expect(screen.getAllByRole('button').length).toBeGreaterThanOrEqual(1);
  });

  it('menu button contains 3 dot spans', () => {
    render(<GroupBarChart title="T" groups={groups} selectedYear="2024" selectedMonth="Jan" />);
    const menuBtn = screen.getAllByRole('button')[0];
    const dots = menuBtn.querySelectorAll('span');
    expect(dots).toHaveLength(3);
  });
});

// ─── BAR COUNT / STRUCTURE ───────────────────────────────────────────────────

describe('GroupBarChart — Bar Structure', () => {
  it('renders 3 bars per group (revenue, profit/loss, cost)', () => {
    const { container } = render(
      <GroupBarChart title="T" groups={[groups[0]]} selectedYear="2024" selectedMonth="Jan" />
    );
    const bars = container.querySelectorAll('.rounded-t');
    expect(bars).toHaveLength(3);
  });

  it('renders correct total bars for multiple groups (n groups × 3)', () => {
    const { container } = render(
      <GroupBarChart title="T" groups={groups} selectedYear="2024" selectedMonth="Jan" />
    );
    // 2 groups × 3 bars = 6
    const bars = container.querySelectorAll('.rounded-t');
    expect(bars).toHaveLength(6);
  });

  it('renders grid lines container', () => {
    const { container } = render(
      <GroupBarChart title="T" groups={groups} selectedYear="2024" selectedMonth="Jan" />
    );
    expect(container.querySelector('.pointer-events-none')).toBeInTheDocument();
  });
});

