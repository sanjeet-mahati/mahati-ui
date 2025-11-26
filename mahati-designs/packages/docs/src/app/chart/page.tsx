// app/dashboard/page.tsx (COMPLETE FIXED VERSION)
"use client";
import { MahatiAnalyticsWidget } from "@/components";
import { useState, useMemo } from "react";
import type { ChartData, DetailItem } from "../../../../uicomponents/src/components/MahatiPieAnalyticsWidget";

const initialDoughnutData: ChartData = {
  labels: ["Outstanding", "Collected", "Pending"],
  datasets: [{
    data: [40, 35, 25],
    backgroundColor: ["#3b82f6", "#10b981", "#ef4444"],
    borderColor: "#fff",
    borderWidth: 2,
  }]
};

// ✅ FIXED: Line chart now has 3 datasets for 3 lines
const lineChartData: ChartData = {
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

const barChartData: ChartData = {
  labels: ['Q1', 'Q2', 'Q3', 'Q4'],
  datasets: [{
    data: [250, 310, 280, 400],
    backgroundColor: ['#3b82f6', '#10b981', '#ef4444', '#f97316'],
    borderColor: "#fff",
    borderWidth: 1,
  }]
};

export default function Dashboard() {
  const [chartType, setChartType] = useState<'doughnut' | 'line' | 'bar'>('line'); // Changed default to 'line'
  const [chartData, setChartData] = useState<ChartData>(lineChartData); // Changed default to lineChartData

  const isDoughnut = chartType === 'doughnut';

  // This is a mock function. In a real app, you'd fetch data based on filters.
  const handleApplyFilters = (filters: Record<string, string>) => {
    console.log("Applying filters:", filters);

    if (chartType === 'line') {
      // For line charts, update all 3 datasets
      const newData = {
        ...chartData,
        datasets: chartData.datasets.map(dataset => ({
          ...dataset,
          data: Array.from({ length: 6 }, () => Math.floor(Math.random() * 100)),
        })),
      };
      setChartData(newData);
    } else if (chartType === 'doughnut') {
      // For doughnut, update the single dataset
      const newData = {
        ...chartData,
        datasets: [{
          ...chartData.datasets[0],
          data: [
            Math.floor(Math.random() * 100),
            Math.floor(Math.random() * 100),
            Math.floor(Math.random() * 100),
          ],
        }],
      };
      setChartData(newData);
    } else if (chartType === 'bar') {
      // For bar charts
      const newData = {
        ...chartData,
        datasets: [{
          ...chartData.datasets[0],
          data: Array.from({ length: 4 }, () => Math.floor(Math.random() * 500)),
        }],
      };
      setChartData(newData);
    }
  };

  // Dynamically calculate details based on current chartData
  const currentDetails: DetailItem[] = useMemo(() => {
    if (chartType === 'line') {
      // For line charts, calculate percentages from the latest month's values
      const latestValues = chartData.datasets.map(dataset => dataset.data[dataset.data.length - 1]);
      const total = latestValues.reduce((sum, val) => sum + val, 0);
      
      return chartData.datasets.map((dataset, index) => {
        const latestValue = dataset.data[dataset.data.length - 1];
        const percentage = total > 0 ? ((latestValue / total) * 100).toFixed(0) : 0;
        const label = dataset.label || chartData.labels[index] || `Series ${index + 1}`;
        const color = typeof dataset.borderColor === 'string' ? dataset.borderColor : '#CBD5E1';
        
        let description = "";
        if (label === "Outstanding") description = "Amount pending";
        if (label === "Collected") description = "Amount collected";
        if (label === "Pending") description = "Pending settlement";

        return {
          label,
          value: `${percentage}%`,
          description,
          color,
        };
      });
    } else {
      // For doughnut/pie charts, calculate percentages
      const total = isDoughnut ? chartData.datasets[0].data.reduce((sum, val) => sum + val, 0) : 0;
      return chartData.labels.map((label, index) => {
        const value = chartData.datasets[0].data[index];
        const percentage = total > 0 ? ((value / total) * 100).toFixed(0) : 0;
        const colors = chartData.datasets[0].backgroundColor;
        const color = Array.isArray(colors) ? colors[index] : colors;
        
        let description = "";
        if (label === "Outstanding") description = "Amount pending";
        if (label === "Collected") description = "Amount collected";
        if (label === "Pending") description = "Pending settlement";

        return {
          label,
          value: `${percentage}%`,
          description,
          color,
        };
      });
    }
  }, [chartData, chartType, isDoughnut]);

  const handleChartTypeChange = (type: 'doughnut' | 'line' | 'bar') => {
    setChartType(type);
    if (type === 'doughnut') setChartData(initialDoughnutData);
    if (type === 'line') setChartData(lineChartData);
    if (type === 'bar') setChartData(barChartData);
  }

  return (
    <div>
      <div className="mb-4 flex gap-2 p-6">
        <button 
          onClick={() => handleChartTypeChange('doughnut')} 
          className={`px-4 py-2 rounded ${chartType === 'doughnut' ? 'bg-teal-500 text-white' : 'bg-gray-200'}`}
        >
          Doughnut Chart
        </button>
        <button 
          onClick={() => handleChartTypeChange('line')} 
          className={`px-4 py-2 rounded ${chartType === 'line' ? 'bg-teal-500 text-white' : 'bg-gray-200'}`}
        >
          Line Chart
        </button>
        <button 
          onClick={() => handleChartTypeChange('bar')} 
          className={`px-4 py-2 rounded ${chartType === 'bar' ? 'bg-teal-500 text-white' : 'bg-gray-200'}`}
        >
          Bar Chart
        </button>
      </div>

      <MahatiAnalyticsWidget
        title="Collection Status"
        subtitle="Overview of collection performance"
        filters={[
          { key: "Relationship", label: "Relationship", options: ["All", "Partner", "Client"] },
          { key: "DebtCollector", label: "Debt Collector", options: ["All", "Collector A", "Collector B"] },
          { key: "CollectionAgency", label: "Collection Agency", options: ["All", "Agency A", "Agency B"] },
          { key: "Periodicity", label: "Periodicity", options: ["12 months", "30 days", "7 days"] },
        ]}
        selectedFilters={{ Periodicity: "12 months" }}
        onFilterChange={(k, v) => console.log("filter", k, v)}
        onApply={handleApplyFilters}
        chartData={chartData}
        chartType={chartType}
        centerLabel="Total"
        centerValue="$33,850"
        hoverTooltipText="Click to view breakdown"
        details={currentDetails}
        topDropdownOptions={["This month", "Last 30 days", "Custom"]}
        onTopDropdownSelect={(v) => console.log("top dropdown", v)}
        actionMenu={[
          { label: "Export PNG", onClick: () => console.log("export png") },
          { label: "Share", onClick: () => console.log("share") },
        ]}
        quickInsights={[
          { title: "Aggregating Amount", value: "$33,850" }, 
          { title: "Outstanding Amount", value: "$19,000" }
        ]}
        totalVolume={{ value: "$33,850", change: "↑ 5.2%" }}
        transactions={{ value: "2,230", subtitle: "From yesterday" }}
      />
    </div>
  );
}