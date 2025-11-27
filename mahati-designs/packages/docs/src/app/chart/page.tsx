"use client";
import React, { useState } from 'react';
import { ChartData } from 'chart.js';
import { MahatiChartAnalyticsWidget } from '@/components';

// Chart data configurations
const pieChartData: ChartData<'doughnut'> = {
  labels: [
    'Total amount still outstanding',
    'Average amount collected per business day',
    'Total fee waiting to be settled',
    'Total fee processed and settled',
    'Total amount already collected'
  ],
  datasets: [{
    data: [50, 7, 10, 20, 13],
    backgroundColor: ['#7DCFAF', '#F28A18', '#2094F3', '#909592', '#BCC6CB'],
    borderColor: '#ffffff',
    borderWidth: 4
  }]
};

const doughnutData: ChartData<'doughnut'> = {
  labels: ["Outstanding", "Collected", "Pending"],
  datasets: [{
    data: [40, 35, 25],
    backgroundColor: ["#3b82f6", "#10b981", "#ef4444"],
    borderColor: "#fff",
    borderWidth: 2,
  }]
};

const lineChartData: ChartData<'line'> = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Outstanding',
      data: [65, 70, 75, 81, 65, 70],
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      borderColor: '#3b82f6',
      borderWidth: 2,
    },
    {
      label: 'Collected',
      data: [55, 63, 62, 46, 55, 57],
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      borderColor: '#10b981',
      borderWidth: 2,
    },
    {
      label: 'Pending',
      data: [42, 41, 44, 42, 40, 44],
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      borderColor: '#ef4444',
      borderWidth: 2,
    }
  ]
};

const barChartData: ChartData<'bar'> = {
  labels: ['Q1', 'Q2', 'Q3', 'Q4'],
  datasets: [{
    data: [250, 310, 280, 400],
    backgroundColor: ['#3b82f6', '#10b981', '#ef4444', '#f97316'],
    borderColor: "#fff",
    borderWidth: 1,
  }]
};

const chartDataMap = { pie: pieChartData, doughnut: doughnutData, line: lineChartData, bar: barChartData };

// --- Create alternate data to show when filters are applied ---
const pieChartDataClient: ChartData<'doughnut'> = {
  labels: [ 'Client Outstanding', 'Client Collected', 'Client Pending' ],
  datasets: [{
    data: [25, 45, 30], // Different data for demonstration
    backgroundColor: ['#7DCFAF', '#F28A18', '#2094F3'],
    borderColor: '#ffffff',
    borderWidth: 4
  }]
};

const chartDataMapClient = { ...chartDataMap, pie: pieChartDataClient };
// ---

// Define different stats for each chart type
const quickStatsData = {
  pie: {
    totalVolume: { value: '$33,850.00', change: '+2%', description: 'Increased by $290 from yesterday' },
    transactions: { value: '2,230', description: 'Total Transactions from yesterday' },
  },
  doughnut: {
    totalVolume: { value: '$45,120.00', change: '+5%', description: 'Increased by $1,200 from yesterday' },
    transactions: { value: '3,100', description: 'Total Transactions from yesterday' },
  },
  line: {
    totalVolume: { value: '$98,500.00', change: '-1%', description: 'Decreased by $500 from yesterday' },
    transactions: { value: '8,450', description: 'Total Transactions from yesterday' },
  },
  bar: {
    totalVolume: { value: '$12,300.00', change: '+10%', description: 'Increased by $1,100 from yesterday' },
    transactions: { value: '1,200', description: 'Total Transactions from yesterday' },
  }
};

export default function MahatiChart() {
  const [activeChartData, setActiveChartData] = useState(chartDataMap);
  const [currentStats, setCurrentStats] = useState(quickStatsData.pie);

  const handleChartTypeChange = (chartType: 'pie' | 'doughnut' | 'line' | 'bar') => {
    setCurrentStats(quickStatsData[chartType]);
  };

  const handleApplyFilters = (filters: Record<string, string>) => {
    //console.log("Applying filters:", filters);
    // Example logic: If Relationship is 'Client', show different data. Otherwise, show default.
    // if (filters.Relationship === 'Client') {
    //   setActiveChartData(chartDataMapClient);
    // } else {
    //   setActiveChartData(chartDataMap);
    // }
    //alert('Filters applied! The data for the Pie chart will change if you selected "Client".');
    setActiveChartData(chartDataMapClient);
  };

  return (
    <MahatiChartAnalyticsWidget 
    title="Mahati Systems UI Components"
    chartTypes={['pie', 'doughnut', 'line', 'bar'] as const}
    initialChartType={'pie' as const}
    filters={[
      { id: 'Relationship', label: 'Relationship', options: ['Partner', 'Client'] },
      { id: 'DebtCollector', label: 'Debt Collector', options: ['Collector B', 'Collector A'] },
      { id: 'CollectionAgency', label: 'Collection Agency', options: ['Agency B', 'Agency A'] },
      { id: 'Periodicity', label: 'Periodicity', options: ['12 months', '30 days', '7 days'] },
    ]}
    initialFilters={{
      Relationship: 'Partner',
      DebtCollector: 'Collector B',
      CollectionAgency: 'Agency B',
      Periodicity: '12 months'
    }}
    chartDataMap={activeChartData}
    onApplyFilters={handleApplyFilters}
    quickStats={currentStats}
    onChartTypeChange={handleChartTypeChange}
    actionButtons={[
      { label: 'Remove Chart', style: 'danger' as const, onClick: () => alert('Remove Chart clicked!') },
      { label: 'Add Chart', style: 'primary' as const, onClick: () => alert('Add Chart clicked!') },
      { label: 'Save Layout', style: 'success' as const, onClick: () => alert('Save Layout clicked!') },
    ]}
  
    />
  );
}