import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LollipopChart } from '../src/components/LollipopChart';

const items = [
  { label: 'Alpha', value: 80 },
  { label: 'Beta',  value: 50, color: '#ff0000' },
  { label: 'Gamma', value: 30 },
];

describe('LollipopChart', () => {
  describe('No data', () => {
    it('should render "No data available" when items is empty', () => {
      render(<LollipopChart title="T" items={[]} selectedYear="2024" selectedMonth="Jan" selectedCategory="All" />);
      expect(screen.getByText('No data available')).toBeInTheDocument();
    });

    it('should still render title when items is empty', () => {
      render(<LollipopChart title="Sales" items={[]} selectedYear="2024" selectedMonth="Jan" selectedCategory="All" />);
      expect(screen.getByText('Sales')).toBeInTheDocument();
    });
  });

  describe('With data', () => {
    it('should render title', () => {
      render(<LollipopChart title="KPIs" items={items} selectedYear="2024" selectedMonth="Jan" selectedCategory="All" />);
      expect(screen.getByText('KPIs')).toBeInTheDocument();
    });

    it('should render item labels', () => {
      render(<LollipopChart title="T" items={items} selectedYear="2024" selectedMonth="Jan" selectedCategory="All" />);
      expect(screen.getByText('Alpha')).toBeInTheDocument();
      expect(screen.getByText('Beta')).toBeInTheDocument();
      expect(screen.getByText('Gamma')).toBeInTheDocument();
    });

    it('should render item values', () => {
      const { container } = render(<LollipopChart title="T" items={items} selectedYear="2024" selectedMonth="Jan" selectedCategory="All" />);
      // Target value spans with specific font-semibold + ml-4 styling (distinguishes from axis labels)
      const valueSpans = container.querySelectorAll('span.ml-4.min-w-\\[50px\\].font-semibold');
      expect(valueSpans).toHaveLength(3);
      expect(valueSpans[0]).toHaveTextContent('80');
      expect(valueSpans[1]).toHaveTextContent('50');
      expect(valueSpans[2]).toHaveTextContent('30');
    });

    it('should apply custom item color', () => {
      const { container } = render(
        <LollipopChart title="T" items={[{ label: 'A', value: 50, color: '#abcdef' }]}
          selectedYear="2024" selectedMonth="Jan" selectedCategory="All" />
      );
      // JSDOM converts hex to rgb(171, 205, 239)
      const bar = container.querySelector('div.relative.rounded-\\[2px\\]');
      const circle = container.querySelector('div.absolute.right-\\[-10px\\]');
      expect(circle).toHaveStyle('background: rgb(171, 205, 239)');
    });

    it('should render in horizontal orientation by default', () => {
      const { container } = render(
        <LollipopChart title="T" items={items} selectedYear="2024" selectedMonth="Jan" selectedCategory="All" />
      );
      // Horizontal has pl-[140px] + flex-col structure
      expect(container.querySelector('div[class*="pl-\\[140px\\]"]')).toBeInTheDocument();
    });

    it('should render in vertical orientation', () => {
      const { container } = render(
        <LollipopChart title="T" items={items} orientation="vertical" selectedYear="2024" selectedMonth="Jan" selectedCategory="All" />
      );
      // Vertical has pb-[60px] + pl-[50px] structure
      expect(container.querySelector('div[class*="pb-\\[60px\\]"]')).toBeInTheDocument();
    });

    it('should render axis labels based on max value', () => {
      render(<LollipopChart title="T" items={[{ label: 'A', value: 100 }]}
        selectedYear="2024" selectedMonth="Jan" selectedCategory="All" />);
      // Axis labels are in flex justify-between mt-2 pl-[140px] container (small font)
      const axisContainer = screen.getByText('0').closest('div[class*="pl-\\[140px\\]"]');
      expect(axisContainer).toHaveTextContent('100');
      expect(axisContainer).toHaveTextContent('0');
    });

    it('should use DEFAULT_COLORS for items without color', () => {
      const { container } = render(
        <LollipopChart title="T" items={[{ label: 'A', value: 50 }]}
          selectedYear="2024" selectedMonth="Jan" selectedCategory="All" />
      );
      // First default color: rgba(37,99,235,1) → rgb(37, 99, 235)
      const firstBar = container.querySelector('div.relative.rounded-\\[2px\\]');
      const firstCircle = container.querySelector('div.absolute.right-\\[-10px\\]');
      expect(firstCircle).toHaveStyle('background: rgb(37, 99, 235)');
    });
  });

  it('should have correct displayName', () => {
    expect(LollipopChart.displayName).toBe('LollipopChart');
  });
});
