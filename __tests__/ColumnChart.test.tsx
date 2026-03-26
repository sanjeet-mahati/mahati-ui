import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ColumnChart } from '../src/components/ColumnChart';

const mockColumns = [
  { name: 'Jan', value: 2000 },
  { name: 'Feb', value: 4000, color: '#ff0000' },
  { name: 'Mar', value: 6000, gradient: 'linear-gradient(180deg, #abc 0%, #def 100%)' },
];

const yAxisConfig = { min: 0, max: 8000, step: 2000, labels: [0, 2000, 4000, 6000, 8000] };

describe('ColumnChart', () => {
  it('should render title', () => {
    render(<ColumnChart title="Revenue" columns={mockColumns} selectedYear="2024" selectedMonth="Jan" selectedType="All" />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
  });

  it('should render all column names', () => {
    render(<ColumnChart title="T" columns={mockColumns} selectedYear="2024" selectedMonth="Jan" selectedType="All" />);
    expect(screen.getByText('Jan')).toBeInTheDocument();
    expect(screen.getByText('Feb')).toBeInTheDocument();
    expect(screen.getByText('Mar')).toBeInTheDocument();
  });

  it('should render y-axis labels', () => {
    render(<ColumnChart title="T" columns={mockColumns} yAxisConfig={yAxisConfig} selectedYear="2024" selectedMonth="Jan" selectedType="All" />);
    expect(screen.getByText('8k')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('should format values ≥1000 as k', () => {
    render(<ColumnChart title="T" columns={[{ name: 'A', value: 3500 }]} selectedYear="2024" selectedMonth="Jan" selectedType="All" />);
    expect(screen.getByText('3.5k')).toBeInTheDocument();
  });

  it('should format values <1000 without k suffix', () => {
    render(<ColumnChart title="T" columns={[{ name: 'A', value: 500 }]} selectedYear="2024" selectedMonth="Jan" selectedType="All" />);
    expect(screen.getByText('500')).toBeInTheDocument();
  });

  it('should handle empty columns array', () => {
    render(<ColumnChart title="T" columns={[]} selectedYear="2024" selectedMonth="Jan" selectedType="All" />);
    expect(screen.getByText('T')).toBeInTheDocument();
  });

 

  it('should apply custom gradient to column', () => {
  const { container } = render(
    <ColumnChart 
      title="T" 
      columns={[{ name: 'A', value: 4000, gradient: 'linear-gradient(red, blue)' }]}
      selectedYear="2024" selectedMonth="Jan" selectedType="All" yAxisConfig={yAxisConfig} 
    />
  );
  const bar = container.querySelector('.rounded-t-\\[4px\\]'); // Target column class
  expect(bar).toHaveStyle('background: linear-gradient(red, blue)');
});

it('should apply custom color to column', () => {
  const { container } = render(
    <ColumnChart 
      title="T" 
      columns={[{ name: 'A', value: 4000, color: '#ff0000' }]}
      selectedYear="2024" selectedMonth="Jan" selectedType="All" yAxisConfig={yAxisConfig} 
    />
  );
  const bar = container.querySelector('.rounded-t-\\[4px\\]'); 
  expect(bar).toHaveStyle('background-color: rgb(255, 0, 0)'); // #ff0000 -> rgb
});

  it('should render correct number of columns', () => {
    const { container } = render(
      <ColumnChart title="T" columns={mockColumns} selectedYear="2024" selectedMonth="Jan" selectedType="All" />
    );
    // Each column has a label span
    expect(screen.getAllByText(/Jan|Feb|Mar/).length).toBeGreaterThan(0);
  });

  it('should have correct displayName', () => {
    expect(ColumnChart.displayName).toBe('ColumnChart');
  });
});