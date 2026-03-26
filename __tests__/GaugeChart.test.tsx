import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { GaugeChart, RiskGaugeChart } from '../src/components/GaugeChart';

const gauges = [
  { name: 'Revenue', value: 7500, max: 10000 },
  { name: 'Profit',  value: 3000, max: 5000  },
];

describe('GaugeChart', () => {
  it('should render title', () => {
    render(<GaugeChart title="Performance" gauges={gauges} />);
    expect(screen.getByText('Performance')).toBeInTheDocument();
  });

  it('should apply testId', () => {
    render(<GaugeChart title="T" gauges={gauges} testId="gc" />);
    expect(screen.getByTestId('gc')).toBeInTheDocument();
  });

  it('should render percentage score in SVG', () => {
    render(<GaugeChart title="T" gauges={[{ name: 'X', value: 5000, max: 10000 }]} />);
    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  it('should render 100% when value equals max', () => {
    render(<GaugeChart title="T" gauges={[{ name: 'X', value: 10000, max: 10000 }]} />);
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('should clamp percentage to 100 even when value > max', () => {
    render(<GaugeChart title="T" gauges={[{ name: 'X', value: 15000, max: 10000 }]} />);
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('should render Target and Achieved labels', () => {
    render(<GaugeChart title="T" gauges={gauges} />);
    expect(screen.getAllByText('Target').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Achieved').length).toBeGreaterThan(0);
  });

  it('should render max value as target', () => {
    render(<GaugeChart title="T" gauges={[{ name: 'X', value: 7500, max: 10000 }]} />);
    expect(screen.getByText('10,000')).toBeInTheDocument();
  });

  it('should render value as achieved', () => {
    render(<GaugeChart title="T" gauges={[{ name: 'X', value: 7500, max: 10000 }]} />);
    expect(screen.getByText('7,500')).toBeInTheDocument();
  });

  it('should render completion text', () => {
    render(<GaugeChart title="T" gauges={[{ name: 'X', value: 5000, max: 10000 }]} />);
    expect(screen.getByText(/completed 50% of the total target/)).toBeInTheDocument();
  });

  it('should render multiple gauges', () => {
    render(<GaugeChart title="T" gauges={gauges} />);
    expect(screen.getByText('75%')).toBeInTheDocument();
    expect(screen.getByText('60%')).toBeInTheDocument();
  });

  it('should render scale labels 0 25 50 75 100', () => {
    render(<GaugeChart title="T" gauges={[{ name: 'X', value: 5000, max: 10000 }]} />);
    expect(screen.getAllByText('0').length).toBeGreaterThan(0);
    expect(screen.getAllByText('50').length).toBeGreaterThan(0);
    expect(screen.getAllByText('100').length).toBeGreaterThan(0);
  });

  it('should have correct displayName', () => {
    expect(GaugeChart.displayName).toBe('GaugeChart');
  });
});

describe('RiskGaugeChart', () => {
  const riskGauges = [
    { name: 'Credit', score: 60, max: 100 },
    { name: 'Market', score: 80, max: 100 },
  ];

  it('should render title', () => {
    render(<RiskGaugeChart title="Risk Assessment" gauges={riskGauges} />);
    expect(screen.getByText('Risk Assessment')).toBeInTheDocument();
  });

  it('should render score percentage', () => {
    render(<RiskGaugeChart title="T" gauges={[{ name: 'X', score: 60, max: 100 }]} />);
    expect(screen.getByText('60%')).toBeInTheDocument();
  });

  it('should render Maximum and Current Score labels', () => {
    render(<RiskGaugeChart title="T" gauges={riskGauges} />);
    expect(screen.getAllByText('Maximum').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Current Score').length).toBeGreaterThan(0);
  });

  it('should render current status text', () => {
    render(<RiskGaugeChart title="T" gauges={[{ name: 'X', score: 60, max: 100 }]} />);
    expect(screen.getByText(/Current Status:/)).toBeInTheDocument();
  });

it('should render risk gauge with custom bands', () => {
  render(<RiskGaugeChart title="T" gauges={[{ name: 'X', score: 60, max: 100 }]} />);
  
  // Test the score and status
  expect(screen.getByText('60')).toBeInTheDocument();
  expect(screen.getByText('60%')).toBeInTheDocument();
  expect(screen.getByText('Stable')).toBeInTheDocument();
  
  // Test custom risk bands are present
  expect(screen.getByText('Critical Risk')).toBeInTheDocument();
  expect(screen.getByText('High Risk')).toBeInTheDocument();
  expect(screen.getByText('Stable')).toBeInTheDocument();
  expect(screen.getByText('Strong')).toBeInTheDocument();
  expect(screen.getByText('Top Performer')).toBeInTheDocument();
});


  it('should render custom bands', () => {
    const customBands = [
      { label: 'Safe', rangeStart: 0, rangeEnd: 50, color: '#00ff00' },
      { label: 'Danger', rangeStart: 51, rangeEnd: 100, color: '#ff0000' },
    ];
    render(<RiskGaugeChart title="T" gauges={[{ name: 'X', score: 30, max: 100, bands: customBands }]} />);
    expect(screen.getByText('Safe')).toBeInTheDocument();
    expect(screen.getByText('Danger')).toBeInTheDocument();
  });

  it('should have correct displayName', () => {
    expect(RiskGaugeChart.displayName).toBe('RiskGaugeChart');
  });
});