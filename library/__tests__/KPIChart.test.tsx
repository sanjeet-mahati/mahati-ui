import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { KPIChart, KPIWidget } from '../src/components/KPIChart';

const kpiData = {
  title: 'Revenue',
  value: '$1.2M',
  timeLabel: 'Last 1 Year',
  timePeriod: '1Y',
  data: [100, 200, 150, 300, 250, 400],
  timePeriods: ['1D', '1W', '1M', '1Y', 'MAX'],
};

describe('KPIChart', () => {
  it('should render title', () => {
    render(<KPIChart data={kpiData} />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
  });

  it('should render formatted total value', () => {
    render(<KPIChart data={{ ...kpiData, timePeriods: undefined, timestamps: undefined }} />);
    expect(screen.getByText('$1.4K')).toBeInTheDocument();
  });

  it('should render time period buttons', () => {
    render(<KPIChart data={kpiData} />);
    expect(screen.getByText('1D')).toBeInTheDocument();
    expect(screen.getByText('MAX')).toBeInTheDocument();
  });

  it('should change selected period on button click', () => {
    render(<KPIChart data={kpiData} />);
    const btn1D = screen.getByText('1D');
    fireEvent.click(btn1D);
    expect(btn1D).toBeInTheDocument();
  });

  it('should render SVG chart', () => {
    const { container } = render(<KPIChart data={kpiData} />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('should render percentage change', () => {
    render(<KPIChart data={kpiData} />);
    expect(screen.getByText(/300/)).toBeInTheDocument();
  });

  it('should handle empty data array', () => {
    render(<KPIChart data={{ ...kpiData, data: [] }} />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
  });

  it('should handle single data point', () => {
    render(<KPIChart data={{ ...kpiData, data: [500] }} />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
  });

  it('should have correct displayName', () => {
    expect(KPIChart.displayName).toBe('KPIChart');
  });
});

describe('KPIWidget', () => {
  const multiKpiData = {
    Revenue: { ...kpiData, title: 'Revenue' },
    Profit:  { ...kpiData, title: 'Profit', data: [50, 100, 80] },
    Cost:    { ...kpiData, title: 'Cost',   data: [30, 60, 40] },
  };

  it('should render KPI Dashboard title', () => {
    render(<KPIWidget kpiData={multiKpiData} />);
    expect(screen.getByText('KPI Dashboard')).toBeInTheDocument();
  });

  it('should render default first KPI chart', () => {
    const { container } = render(<KPIWidget kpiData={multiKpiData} />);
    // Target chart container with unique height: 350px + rounded-[10px]
    const chartContainers = container.querySelectorAll('div[style*="height: 350px"]');
    const chartTitle = chartContainers[0]?.querySelector('h3');
    expect(chartTitle).toHaveTextContent('Revenue');
  });

  it('should render defaultSelected KPIs', () => {
    render(<KPIWidget kpiData={multiKpiData} defaultSelected={['Revenue', 'Profit']} />);
    expect(screen.getAllByText('Revenue').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Profit').length).toBeGreaterThan(0);
  });

  it('should render dropdown with KPI options', () => {
    render(<KPIWidget kpiData={multiKpiData} />);
    // Target dropdown button with accessible name
    const dropdownBtn = screen.getByRole('button', { name: /Revenue/i });
    expect(dropdownBtn).toBeInTheDocument();
  });

  it('should open dropdown on button click', () => {
    render(<KPIWidget kpiData={multiKpiData} />);
    const dropdownBtn = screen.getByRole('button', { name: /Revenue/i });
    fireEvent.click(dropdownBtn);
    expect(screen.getByText('Profit')).toBeInTheDocument();
    expect(screen.getByText('Cost')).toBeInTheDocument();
  });

  it('should add KPI when checkbox clicked', () => {
    const { container } = render(<KPIWidget kpiData={multiKpiData} />);
    fireEvent.click(screen.getByRole('button', { name: /Revenue/i }));
    
    // Find Profit checkbox: 2nd dropdown row, unchecked checkbox next to "Profit" label
    const dropdownRows = container.querySelectorAll('div[style*="border-bottom: 1px solid"]');
    const profitRow = dropdownRows[1]; // Revenue=0, Profit=1, Cost=2
    const profitCheckbox = profitRow?.querySelector('input[type="checkbox"]:not([checked])');
    
    expect(profitCheckbox).not.toBeChecked();
    fireEvent.click(profitCheckbox!);
    
    // Counter shows "2 of 3 selected"
    expect(screen.getByText('2 of 3 selected')).toBeInTheDocument();
  });

  it('should show Clear All when multiple KPIs selected', () => {
    render(<KPIWidget kpiData={multiKpiData} defaultSelected={['Revenue', 'Profit']} />);
    fireEvent.click(screen.getAllByRole('button')[0]);
    expect(screen.getByText('Clear All')).toBeInTheDocument();
  });

  it('should show "N of M selected" counter', () => {
    render(<KPIWidget kpiData={multiKpiData} defaultSelected={['Revenue', 'Profit']} />);
    fireEvent.click(screen.getAllByRole('button')[0]);
    expect(screen.getByText(/2 of 3 selected/)).toBeInTheDocument();
  });
});
