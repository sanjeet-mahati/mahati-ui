import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { HorizontalBarChart } from '../src/components/HorizontalBarChart';

const bars = [
  { name: 'Product A', value: 100, color: '#ff0000' },
  { name: 'Product B', value: 200, color: '#00ff00' },
  { name: 'Product C', value: 50,  color: '#0000ff' },
];
const xAxisConfig = { min: 0, max: 250, step: 50, labels: [0, 50, 100, 150, 200, 250] };

describe('HorizontalBarChart', () => {
  it('should render title', () => {
    render(<HorizontalBarChart title="Sales" bars={bars} selectedYear="2024" selectedMonth="Jan" selectedType="All" />);
    expect(screen.getByText('Sales')).toBeInTheDocument();
  });

  it('should render all bar labels', () => {
    render(<HorizontalBarChart title="T" bars={bars} selectedYear="2024" selectedMonth="Jan" selectedType="All" />);
    expect(screen.getByText('Product A')).toBeInTheDocument();
    expect(screen.getByText('Product B')).toBeInTheDocument();
    expect(screen.getByText('Product C')).toBeInTheDocument();
  });

  it('should render x-axis labels', () => {
    render(<HorizontalBarChart title="T" bars={bars} xAxisConfig={xAxisConfig} selectedYear="2024" selectedMonth="Jan" selectedType="All" />);
    expect(screen.getByText('250')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('should apply testId', () => {
    render(<HorizontalBarChart title="T" bars={bars} testId="hbc" selectedYear="2024" selectedMonth="Jan" selectedType="All" />);
    expect(screen.getByTestId('hbc')).toBeInTheDocument();
  });

  it('should apply testId-title', () => {
    render(<HorizontalBarChart title="Sales" bars={bars} testId="hbc" selectedYear="2024" selectedMonth="Jan" selectedType="All" />);
    expect(screen.getByTestId('hbc-title')).toHaveTextContent('Sales');
  });

  it('should apply testId-bar-N to each bar', () => {
    render(<HorizontalBarChart title="T" bars={bars} testId="hbc" xAxisConfig={xAxisConfig} selectedYear="2024" selectedMonth="Jan" selectedType="All" />);
    expect(screen.getByTestId('hbc-bar-0')).toBeInTheDocument();
    expect(screen.getByTestId('hbc-bar-1')).toBeInTheDocument();
    expect(screen.getByTestId('hbc-bar-2')).toBeInTheDocument();
  });

  it('should apply bar color from bar.color prop', () => {
    render(<HorizontalBarChart title="T" bars={bars} testId="hbc" xAxisConfig={xAxisConfig} selectedYear="2024" selectedMonth="Jan" selectedType="All" />);
    expect(screen.getByTestId('hbc-bar-0')).toHaveStyle({ background: '#ff0000' });
  });

  it('should calculate bar width proportional to value', () => {
    render(<HorizontalBarChart title="T" bars={bars} testId="hbc" xAxisConfig={xAxisConfig} selectedYear="2024" selectedMonth="Jan" selectedType="All" />);
    const bar0 = screen.getByTestId('hbc-bar-0') as HTMLElement;
    const bar1 = screen.getByTestId('hbc-bar-1') as HTMLElement;
    // bar1 (200) should be wider than bar0 (100)
    const w0 = parseFloat(bar0.style.width);
    const w1 = parseFloat(bar1.style.width);
    expect(w1).toBeGreaterThan(w0);
  });

  it('should handle empty bars', () => {
    render(<HorizontalBarChart title="T" bars={[]} selectedYear="2024" selectedMonth="Jan" selectedType="All" />);
    expect(screen.getByText('T')).toBeInTheDocument();
  });

  it('should have correct displayName', () => {
    expect(HorizontalBarChart.displayName).toBe('HorizontalBarChart');
  });
});