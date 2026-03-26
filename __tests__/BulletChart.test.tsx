import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BulletChart } from '../src/components/BulletChart';

// ─── RENDER ──────────────────────────────────────────────────────────────────

describe('BulletChart — Render', () => {
  it('renders the title', () => {
    render(<BulletChart title="Revenue" bullets={[]} />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
  });

  it('renders bullet container div', () => {
    render(<BulletChart title="Test" bullets={[]} testId="bulletchart-root" />);
    expect(screen.getByTestId('bulletchart-root')).toBeInTheDocument();
  });

  it('renders without bullets', () => {
    render(<BulletChart title="No Bullets" bullets={[]} />);
    expect(screen.getByText('No Bullets')).toBeInTheDocument();
  });

  it('renders with empty title', () => {
    render(<BulletChart title="" bullets={[{name: 'Test', achieved: 100, target: 200, marker: 150}]} testId="bulletchart-root" />);
    expect(screen.getByTestId('bulletchart-root')).toBeInTheDocument();
  });

  it('renders long title', () => {
    const longTitle = 'A'.repeat(100);
    render(<BulletChart title={longTitle} bullets={[]} />);
    expect(screen.getByText(longTitle)).toBeInTheDocument();
  });

  it('has correct displayName', () => {
    expect(BulletChart.displayName).toBe('BulletChart');
  });
});

// ─── BULLET CONTENT ──────────────────────────────────────────────────────────

describe('BulletChart — Content', () => {
  const sampleBullets = [
    { name: 'Revenue', achieved: 7500, target: 10000, marker: 8000 },
    { name: 'Sales',   achieved: 4500, target: 6000,  marker: 5000 },
  ];

  it('renders bullet name', () => {
    render(<BulletChart title="Test" bullets={sampleBullets} testId="bulletchart-root" />);
    expect(screen.getByTestId('bulletchart-root-item-Revenue')).toBeInTheDocument();
    expect(screen.getByText('Revenue')).toBeInTheDocument();
  });

  it('renders value label Achieved/Target', () => {
    render(<BulletChart title="Test" bullets={sampleBullets} testId="bulletchart-root" />);
    expect(screen.getByText('$7,500/$10,000')).toBeInTheDocument();
  });

 // ✅ Fix — use Array.from + .find on className string directly
it('renders bar background', () => {
  render(<BulletChart title="Test" bullets={sampleBullets} testId="bulletchart-root" />);
  const container = screen.getByTestId('bulletchart-root');
  const backgrounds = Array.from(container.querySelectorAll('div')).filter(
    el => el.className.includes('bg-[rgba(183,232,214')
  );
  expect(backgrounds).toHaveLength(2);
});

  it('renders bar fill with correct width', () => {
    render(<BulletChart title="Test" bullets={[{name: 'Test', achieved: 5000, target: 10000, marker: 6000}]} testId="bulletchart-root" />);
    const bar = screen.getByTestId('bulletchart-root-bar-Test');
    expect(bar).toHaveStyle({ width: '50%' });
  });

  it('renders marker at correct position', () => {
    render(<BulletChart title="Test" bullets={[{name: 'Test', achieved: 5000, target: 10000, marker: 7000}]} testId="bulletchart-root" />);
    const marker = screen.getByTestId('bulletchart-root-marker-Test');
    expect(marker).toHaveStyle({ left: '70%' });
  });

  it('renders axis labels 0 2k 4k 6k 8k 10k', () => {
    render(<BulletChart title="Test" bullets={sampleBullets} />);
    // Each bullet renders its own axis row, so labels appear once per bullet.
    // Use getAllByText since sampleBullets has 2 items → 2 sets of axis labels.
    expect(screen.getAllByText('0').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('2k').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('4k').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('6k').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('8k').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('10k').length).toBeGreaterThanOrEqual(1);
  });

  it('renders percentage text', () => {
    render(<BulletChart title="Test" bullets={[{name: 'Test', achieved: 7500, target: 10000, marker: 8000}]} testId="bulletchart-root" />);
    expect(screen.getByTestId('bulletchart-root-percentage-Test')).toBeInTheDocument();
    expect(screen.getByText('75% of target achieved')).toBeInTheDocument();
  });

  it('handles multiple bullets', () => {
    render(<BulletChart title="Test" bullets={sampleBullets} testId="bulletchart-root" />);
    expect(screen.getAllByTestId(/bulletchart-root-item-/)).toHaveLength(2);
  });

  it('handles 100% achievement', () => {
    render(<BulletChart title="Test" bullets={[{name: 'Full', achieved: 10000, target: 10000, marker: 10000}]} testId="bulletchart-root" />);
    const bar = screen.getByTestId('bulletchart-root-bar-Full');
    expect(bar).toHaveStyle({ width: '100%' });
  });

  it('caps bar at 100%', () => {
    render(<BulletChart title="Test" bullets={[{name: 'Over', achieved: 12000, target: 10000, marker: 11000}]} testId="bulletchart-root" />);
    const bar = screen.getByTestId('bulletchart-root-bar-Over');
    expect(bar).toHaveStyle({ width: '100%' });
  });
});

// ─── BULLET TEST IDS ─────────────────────────────────────────────────────────

describe('BulletChart — TestIds', () => {
  it('applies testId to root div', () => {
    render(<BulletChart title="Test" bullets={[]} testId="chart" />);
    expect(screen.getByTestId('chart')).toBeInTheDocument();
  });

  it('applies item testId to bullet container', () => {
    render(<BulletChart title="Test" bullets={[{name: 'Item1', achieved: 100, target: 200, marker: 150}]} testId="chart" />);
    expect(screen.getByTestId('chart-item-Item1')).toBeInTheDocument();
  });

  it('applies bar testId to fill bar', () => {
    render(<BulletChart title="Test" bullets={[{name: 'Bar', achieved: 100, target: 200, marker: 150}]} testId="chart" />);
    expect(screen.getByTestId('chart-bar-Bar')).toBeInTheDocument();
  });

  it('applies marker testId to marker div', () => {
    render(<BulletChart title="Test" bullets={[{name: 'Marker', achieved: 100, target: 200, marker: 150}]} testId="chart" />);
    expect(screen.getByTestId('chart-marker-Marker')).toBeInTheDocument();
  });

  it('applies percentage testId to percentage text', () => {
    render(<BulletChart title="Test" bullets={[{name: 'Pct', achieved: 100, target: 200, marker: 150}]} testId="chart" />);
    expect(screen.getByTestId('chart-percentage-Pct')).toBeInTheDocument();
  });
});

// ─── BULLET STYLING ──────────────────────────────────────────────────────────

describe('BulletChart — Styling', () => {
  it('root has flex-col class', () => {
    render(<BulletChart title="Test" bullets={[]} testId="root" />);
    expect(screen.getByTestId('root')).toHaveClass('flex', 'flex-col');
  });

  it('title has correct color class', () => {
    render(<BulletChart title="Test" bullets={[]} testId="root" />);
    const title = screen.getByText('Test');
    expect(title).toHaveClass('text-[rgba(23,97,163,1)]');
  });

  it('bar fill has gradient', () => {
    render(<BulletChart title="Test" bullets={[{name: 'Test', achieved: 100, target: 200, marker: 150}]} testId="root" />);
    const bar = screen.getByTestId('root-bar-Test');
    expect(bar.className).toMatch(/from-\[rgba\(23,97,163/);
  });

  it('bar background has correct color', () => {
    render(<BulletChart title="Test" bullets={[{name: 'Test', achieved: 100, target: 200, marker: 150}]} testId="root" />);
    const item = screen.getByTestId('root-item-Test');
    // CSS attribute selector breaks on square brackets in class values.
    // Check className string directly instead.
    const allDivs = item.querySelectorAll('div');
    const bgDiv = Array.from(allDivs).find(el =>
      el.className.includes('bg-[rgba(183,232,214')
    );
    expect(bgDiv).toBeInTheDocument();
  });
});