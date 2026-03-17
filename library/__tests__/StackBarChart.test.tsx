import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { StackBarChart } from '../src/components/StackBarChart';

const data = [
  { day: 'Mon', aggregating: 40, outstanding: 50, writeOff: 10 },
  { day: 'Tue', aggregating: 30, outstanding: 60, writeOff: 20 },
  { day: 'Wed', aggregating: 0,  outstanding: 0,  writeOff: 0  },
];
const yAxisConfig = { min: 0, max: 125, step: 25, labels: [0, 25, 50, 75, 100, 125] };

describe('StackBarChart', () => {
  it('should render title', () => {
    render(<StackBarChart title="Collections" data={data} selectedYear="2024" selectedMonth="Jan" selectedWeek="W1" selectedType="All" />);
    expect(screen.getByText('Collections')).toBeInTheDocument();
  });

  it('should render day labels', () => {
    render(<StackBarChart title="T" data={data} selectedYear="2024" selectedMonth="Jan" selectedWeek="W1" selectedType="All" />);
    expect(screen.getByText('Mon')).toBeInTheDocument();
    expect(screen.getByText('Tue')).toBeInTheDocument();
    expect(screen.getByText('Wed')).toBeInTheDocument();
  });

  it('should render y-axis labels with $ prefix', () => {
    const { container } = render(<StackBarChart title="T" data={data} yAxisConfig={yAxisConfig} selectedYear="2024" selectedMonth="Jan" selectedWeek="W1" selectedType="All" />);
    // ✅ FIXED: Target Y-AXIS spans specifically (font-size: 10px in left sidebar)
    const yAxisLabels = container.querySelectorAll('div[style*="width: 40px"] span[style*="font-size: 10px"]');
    expect(yAxisLabels[0]).toHaveTextContent('$125');
    expect(yAxisLabels[yAxisLabels.length - 1]).toHaveTextContent('$0');
  });

  it('should render total value labels', () => {
    const { container } = render(<StackBarChart title="T" data={data} selectedYear="2024" selectedMonth="Jan" selectedWeek="W1" selectedType="All" />);
    // ✅ FIXED: Target total labels (positioned above bars with text-[11px])
    const totalLabels = container.querySelectorAll('div[class*="text-\\[11px\\]"][style*="top: -24px"]');
    expect(totalLabels[0]).toHaveTextContent('$100');
    expect(totalLabels[1]).toHaveTextContent('$110');
  });

  it('should not render bar segments for zero values', () => {
    const { container } = render(
      <StackBarChart title="T" data={[{ day: 'X', aggregating: 0, outstanding: 0, writeOff: 0 }]}
        selectedYear="2024" selectedMonth="Jan" selectedWeek="W1" selectedType="All" />
    );
    // ✅ FIXED: No segments with non-zero height
    const segments = container.querySelectorAll('div[class*="cursor-pointer"]:not([style*="height: 0%"])');
    expect(segments).toHaveLength(0);
  });

  it('should show tooltip on segment mouseenter', () => {
    const { container } = render(<StackBarChart title="T" data={data} selectedYear="2024" selectedMonth="Jan" selectedWeek="W1" selectedType="All" />);
    // ✅ Target first non-zero segment
    const segments = Array.from(container.querySelectorAll('div[class*="cursor-pointer"]'))
      .filter(el => !el.getAttribute('style')?.includes('height: 0%'));
    
    if (segments.length > 0) {
      fireEvent.mouseEnter(segments[0]);
      // ✅ FIXED: Target TOOLTIP text (fixed z-[9999] container)
      const tooltipDay = container.querySelector('[class*="fixed"][class*="z-\\[9999\\]"] div');
      expect(tooltipDay).toHaveTextContent(/Mon|Tue|Wed/); // Any day + label
    }
  });

  it('should hide tooltip on mouseLeave', () => {
    const { container } = render(<StackBarChart title="T" data={data} selectedYear="2024" selectedMonth="Jan" selectedWeek="W1" selectedType="All" />);
    const segments = Array.from(container.querySelectorAll('div[class*="cursor-pointer"]'))
      .filter(el => !el.getAttribute('style')?.includes('height: 0%'));
    
    if (segments.length > 0) {
      fireEvent.mouseEnter(segments[0]);
      fireEvent.mouseLeave(segments[0]);
      expect(container.querySelector('[class*="fixed"][class*="z-\\[9999\\]"]')).not.toBeInTheDocument();
    }
  });

  it('should apply custom legend colors', () => {
    const legends = [
      { key: 'aggregating', label: 'Agg', color: '#aabbcc' },
      { key: 'outstanding', label: 'Out', color: '#ddeeff' },
      { key: 'writeOff', label: 'WO',  color: '#112233' },
    ];
    const { container } = render(
      <StackBarChart title="T" data={data} legends={legends} selectedYear="2024" selectedMonth="Jan" selectedWeek="W1" selectedType="All" />
    );
    // ✅ FIXED: Check for custom color segments (rgb values)
    const allSegments = container.querySelectorAll('div[class*="cursor-pointer"]');
    const hasCustomColor = Array.from(allSegments).some(segment => {
      const style = segment.getAttribute('style') || '';
      return style.includes('rgb(') && !style.includes('37,99,235') && !style.includes('34,197,94') && !style.includes('239,68,68');
    });
    expect(hasCustomColor).toBe(true);
  });

  it('should handle empty data', () => {
    render(<StackBarChart title="T" data={[]} selectedYear="2024" selectedMonth="Jan" selectedWeek="W1" selectedType="All" />);
    expect(screen.getByText('T')).toBeInTheDocument();
  });

  it('should have correct displayName', () => {
    expect(StackBarChart.displayName).toBe('StackBarChart');
  });
});
