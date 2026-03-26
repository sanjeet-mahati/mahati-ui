import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// ✅ Mock ChartInterface with CORRECT relative path from test location
jest.mock('../src/components/ChartInterface', () => ({
  ChartInterface: ({ type, data }: any) => (
    <canvas 
      data-testid="chart-interface" 
      data-type={type}
      aria-label={`Mock ${type} chart`}
    />
  ),
}));

// ✅ Import the actual exported component name
import { MahatiPieAnalyticsWidget as MahatiPieChart } from '../src/components/MahatiPieChart';

const pieData = {
  labels: ['Alpha', 'Beta', 'Gamma'],
  datasets: [{
    data: [40, 30, 30],
    backgroundColor: ['#abcdef', '#ff0000', '#f59e0b'],
    borderWidth: 2
  }]
};

const details = [
  { label: 'Alpha', value: '40', color: '#abcdef' },
  { label: 'Beta', value: '30', color: '#ff0000' },
  { label: 'Gamma', value: '30', color: '#f59e0b' }
];

describe('MahatiPieChart', () => {
  it('should render title', () => {
    render(<MahatiPieChart title="Revenue" data={pieData} details={details} />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
  });

  it('should render legend labels', () => {
    render(<MahatiPieChart title="T" data={pieData} details={details} />);
    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.getByText('Beta')).toBeInTheDocument();
    expect(screen.getByText('Gamma')).toBeInTheDocument();
  });

  it('should render legend values', () => {
    const { container } = render(<MahatiPieChart title="T" data={pieData} details={details} />);
    const valueSpans = container.querySelectorAll('span[class*="font-semibold"]');
    expect(valueSpans).toHaveLength(3);
    expect(valueSpans[0]).toHaveTextContent('40');
    expect(valueSpans[1]).toHaveTextContent('30');
    expect(valueSpans[2]).toHaveTextContent('30');
  });

  it('should render pie chart canvas', () => {
    const { getByTestId } = render(<MahatiPieChart title="T" data={pieData} details={details} />);
    expect(getByTestId('chart-interface')).toBeInTheDocument();
  });


  it('should render menu button', () => {
    const { container } = render(<MahatiPieChart title="T" data={pieData} details={details} />);
    const menuButton = container.querySelector('button[class*="p-1"]');
    expect(menuButton).toBeInTheDocument();
  });

  it('should handle empty data gracefully', () => {
    render(<MahatiPieChart title="T" data={pieData} details={[]} />);
    expect(screen.getByText('T')).toBeInTheDocument();
  });

  it('should have correct displayName', () => {
    expect(MahatiPieChart.displayName).toBe('MahatiPieAnalyticsWidget');
  });
});
