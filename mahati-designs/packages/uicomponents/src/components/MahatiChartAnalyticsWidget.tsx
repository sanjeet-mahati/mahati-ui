"use client";
import React, { useState, useMemo } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ChartData, ChartOptions } from 'chart.js';
import { Doughnut, Line, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement);

type ChartType = 'pie' | 'doughnut' | 'line' | 'bar';

interface Filter {
    id: string;
    label: string;
    options: string[];
}

interface DetailItem {
    label: string;
    value: string;
    color: string;
    description: string;
}

interface MahatiChartAnalyticsWidgetProps {
    title: string;
    chartTypes: ChartType[];
    initialChartType: ChartType;
    filters: Filter[];
    selectedFilters: Record<string, string>;
    chartDataMap: Record<ChartType, ChartData<any>>;
    onApplyFilters?: (filters: Record<string, string>) => void;
    onChartTypeChange?: (chartType: ChartType) => void;
    onFiltersChange: (filters: Record<string, string>) => void;
    details: DetailItem[];
    quickStats: {
        totalVolume: { value: string; change: string; description: string; };
        transactions: { value: string; description: string; };
    };
    actionButtons: { label: string; style: 'mahati'; onClick: () => void; }[];
}

const MahatiChartAnalyticsWidget: React.FC<MahatiChartAnalyticsWidgetProps> = ({
    title,
    chartTypes,
    initialChartType,
    filters,
    selectedFilters,
    chartDataMap,
    onApplyFilters,
    quickStats,
    actionButtons,
    onChartTypeChange,
    onFiltersChange,
    details
}) => {
    const [chartType, setChartType] = useState<ChartType>(initialChartType);
    
    const currentData = useMemo(() => {
        return chartDataMap[chartType];
    }, [chartDataMap, chartType]);

    const chartOptions: ChartOptions<any> = useMemo(() => {
        if (chartType === 'line') {
            return {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: '#1F2937',
                        bodyColor: '#6B7280',
                        borderColor: '#E5E7EB',
                        borderWidth: 1,
                        padding: 12,
                        displayColors: true,
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: true,
                            color: '#E5E7EB',
                            drawBorder: false,
                        },
                        ticks: {
                            font: { size: 11, family: 'Inter, system-ui, sans-serif' },
                            color: '#6B7280',
                        }
                    },
                    y: {
                        grid: {
                            display: true,
                            color: '#E5E7EB',
                            drawBorder: false,
                        },
                        ticks: {
                            font: { size: 11, family: 'Inter, system-ui, sans-serif' },
                            color: '#6B7280',
                        },
                        min: 40,
                        max: 90,
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                }
            };
        } else {
            return {
                responsive: true,
                maintainAspectRatio: false,
                cutout: chartType === 'pie' || chartType === 'doughnut' ? '50%' : undefined,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                let label = context.label || '';
                                let value = context.parsed;
                                return label + ': ' + value + '%';
                            }
                        }
                    }
                }
            };
        }
    }, [chartType]);

    const renderChart = () => {
        if (!currentData) return null;
        switch (chartType) {
            case 'line': return <Line data={currentData} options={chartOptions} />;
            case 'bar': return <Bar data={currentData} options={chartOptions} />;
            case 'pie':
            case 'doughnut': return <Doughnut data={currentData} options={chartOptions} />;
            default: return null;
        }
    };

    const buttonStyles = {
        danger: "px-4 py-2 rounded-lg font-semibold bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors",
        primary: "px-4 py-2 rounded-lg font-semibold bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200 transition-colors",
        success: "px-4 py-2 rounded-lg font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors",
        mhati: "px-4 py-2 rounded-lg font-semibold text-white bg-[linear-gradient(90deg,#1761A3_0%,#4DAF83_100%)] border border-solid border-[#1761A3] hover:opacity-90 transition-opacity"
    };

    const isLineChart = chartType === 'line';

    return (
        <div className="min-h-screen bg-white">

            {/* Chart Type Tabs */}
            <div className="bg-white px-8 py-4">
                <div className="flex gap-0">
                    {chartTypes.map((type, index) => (
                        <button
                            key={type}
                            onClick={() => {
                                setChartType(type);
                                onChartTypeChange?.(type);
                            }}
                            className={`px-6 py-2.5 font-medium text-sm transition-all `}
                        >
                            {type.charAt(0).toUpperCase() + type.slice(1)} Chart
                        </button>
                    ))}
                </div>
            </div>

            {/* Filters */}
            <div className="px-8 py-4">
                <div className="flex gap-4 items-center flex-wrap">
                    {filters.map(filter => ( 
                      <div className="relative">
                                <select
                                    id={filter.id}
                                    className="px-4 py-2 pr-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent font-medium text-gray-900 text-sm appearance-none cursor-pointer"
                                    style={{background:`linear-gradient(180deg, rgba(23, 97, 163, 0.07) 0%, rgba(77, 175, 131, 0.07) 100%)`}}
                                    value={selectedFilters[filter.id]}
                                    onChange={(e) => onFiltersChange({ ...selectedFilters, [filter.id]: e.target.value })}
                                >
                                    {filter.options.map(opt => <option key={opt}>{opt}</option>)}
                                </select>
                                
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <svg className="w-3 h-3 text-gray-700" fill="currentColor" viewBox="0 0 12 12">
                                        <path d="M6 9L1 4h10z"/>
                                    </svg>
                                </div>
                            </div>
                    ))}
                      <button onClick={() => onApplyFilters?.(selectedFilters)} className="px-6 py-1.5 bg-teal-500 text-white rounded font-medium hover:bg-teal-600">
                        Apply
                    </button>
                </div>
            </div>
            {/* Main Content */}
            <div className="px-8 py-4">
                <div className={`grid gap-6 ${isLineChart ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 lg:grid-cols-3'}`}>
                    
                    {/* Left: Chart Card */}
                 {/* Left: Chart Card */}
{/* Left: Chart Card */}
<div className="bg-white border border-gray-300 rounded-2xl p-6 shadow-sm" style={{background:`linear-gradient(180deg, rgba(23, 97, 163, 0.07) 0%, rgba(77, 175, 131, 0.07) 100%)`}}>
    <div className="flex items-center justify-between mb-4">
        <div></div>
        <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors">
            <div className="flex gap-1">
                <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
            </div>
        </button>
    </div>

    {/* Chart with gradient background */}
    <div 
        className={`${isLineChart ? 'h-80' : 'h-64'} p-2 rounded-2xl`}
       
    >
        {renderChart()}
    </div>

    {/* Legend OUTSIDE and BELOW the gradient box */}
    {!isLineChart && (
        <div className="mt-6 space-y-3 text-sm">
            {details.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span 
                            className="w-5 h-2.5 rounded" 
                            style={{ backgroundColor: item.color }}
                        ></span>
                        <span className="text-gray-700 text-xs">{item.label}</span>
                    </div>
                    <span className="font-semibold text-black text-sm">{item.value}</span>
                </div>
            ))}
        </div>
    )}
    
    {/* For Line Chart - show below */}
    {isLineChart && (
        <div className="mt-6 space-y-3 text-sm">
            {details.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">{item.label}</span>
                    <span className="font-semibold text-black">{item.value}</span>
                </div>
            ))}
        </div>
    )}
</div>
                    {/* Middle: Details Card */}
                    <div className="bg-white border border-gray-300 rounded-2xl p-6 shadow-sm" style={{background:`linear-gradient(180deg, rgba(23, 97, 163, 0.07) 0%, rgba(77, 175, 131, 0.07) 100%)`}}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">Details</h3>
                            <div className="relative group">
                                <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors">
                                    <div className="flex gap-1">
                                        <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                                        <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                                        <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                                    </div>
                                </button>
                            </div>
                        </div>

                        <div className="space-y-5"  >
                            {details.map((item, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <div className="flex-shrink-0 mt-1">
                                        <span 
                                            className="inline-block w-8 h-8 rounded" 
                                            style={{ backgroundColor: item.color }}
                                        ></span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-semibold text-gray-900 text-sm">{item.label}</div>
                                        <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
                                    </div>
                                    <div className="flex-shrink-0 text-right font-bold text-gray-900">{item.value}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Quick Stats */}
                    <div className="flex flex-col gap-4">
                        <div className="bg-white border border-gray-300 rounded-2xl p-4 shadow-sm" style={{background:`linear-gradient(180deg, rgba(23, 97, 163, 0.07) 0%, rgba(77, 175, 131, 0.07) 100%)`}}>
                            <div className="flex items-center justify-between mb-3">
                                <div className="text-gray-800 font-semibold text-sm">Total Volume</div>
                                <button className="text-gray-400 hover:text-gray-600">
                                    <div className="flex gap-1">
                                        <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                                        <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                                        <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                                    </div>
                                </button>
                            </div>
                            <div className="text-3xl font-bold text-gray-900 mt-4">
                                {quickStats.totalVolume.value}
                            </div>
                            <div className={`text-sm font-medium mt-1 ${quickStats.totalVolume.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                                {quickStats.totalVolume.change}
                            </div>
                            <div className="text-xs text-gray-500 mt-2">{quickStats.totalVolume.description}</div>
                        </div>

                        <div className="bg-white border border-gray-300 rounded-2xl p-4 shadow-sm" style={{background:`linear-gradient(180deg, rgba(23, 97, 163, 0.07) 0%, rgba(77, 175, 131, 0.07) 100%)`}}>
                            <div className="flex items-center justify-between mb-3">
                                <div className="text-gray-800 font-semibold text-sm">Transactions</div>
                                <button className="text-gray-400 hover:text-gray-600">
                                    <div className="flex gap-1">
                                        <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                                        <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                                        <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                                    </div>
                                </button>
                            </div>
                            <div className="text-3xl font-bold text-gray-900 mt-4">{quickStats.transactions.value}</div>
                            <div className="text-xs text-gray-500 mt-3">{quickStats.transactions.description}</div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 mt-8" >
                    {actionButtons.map(btn => (
                        <button key={btn.label} onClick={btn.onClick} className={buttonStyles[btn.style]}>
                            {btn.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Demo Data
const pieChartData: ChartData<'doughnut'> = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [{
    data: [15, 16, 18, 19, 15, 16],
    backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#6366F1'],
    borderColor: '#ffffff',
    borderWidth: 2
  }]
};

const lineChartData: ChartData<'line'> = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Aggregating Amount',
      data: [65, 70, 75, 75, 62, 81, 66, 82, 73, 78, 80, 71],
      borderColor: '#3B82F6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      borderWidth: 2,
      tension: 0.4,
      pointRadius: 3,
      pointHoverRadius: 5,
    },
    {
      label: 'Outstanding Amount',
      data: [55, 63, 62, 61, 45, 51, 55, 55, 51, 58, 68, 57],
      borderColor: '#10B981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      borderWidth: 2,
      tension: 0.4,
      pointRadius: 3,
      pointHoverRadius: 5,
    },
    {
      label: 'Write-Off Amount',
      data: [43, 42, 43, 44, 42, 43, 42, 45, 43, 43, 45, 45],
      borderColor: '#EF4444',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      borderWidth: 2,
      tension: 0.4,
      pointRadius: 3,
      pointHoverRadius: 5,
    }
  ]
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

const barChartData: ChartData<'bar'> = {
  labels: ['Q1', 'Q2', 'Q3', 'Q4'],
  datasets: [{
    data: [250, 310, 280, 400],
    backgroundColor: ['#3b82f6', '#10b981', '#ef4444', '#f97316'],
    borderColor: "#fff",
    borderWidth: 1,
  }]
};

// Demo Component
export default function DemoMahatiChart() {
  const [chartType, setChartType] = useState<ChartType>('line');
  const [selectedFilters, setSelectedFilters] = useState({
    Relationship: 'Partner',
    DebtCollector: 'Collector B',
    CollectionAgency: 'Agency B',
    Periodicity: '12 months'
  });

  const chartDataMap = { 
    pie: pieChartData, 
    doughnut: doughnutData, 
    line: lineChartData, 
    bar: barChartData 
  };

  const quickStatsData = {
    pie: {
      totalVolume: { value: '$33,850.00', change: '+2%', description: 'Increased by $290 from yesterday' },
      transactions: { value: '2,230', description: 'Total Transactions from yesterday' },
    },
    line: {
      totalVolume: { value: '$98,500.00', change: '-1%', description: 'Decreased by $500 from yesterday' },
      transactions: { value: '8,450', description: 'Total Transactions from yesterday' },
    },
    doughnut: {
      totalVolume: { value: '$45,120.00', change: '+5%', description: 'Increased by $1,200 from yesterday' },
      transactions: { value: '3,100', description: 'Total Transactions from yesterday' },
    },
    bar: {
      totalVolume: { value: '$12,300.00', change: '+10%', description: 'Increased by $1,100 from yesterday' },
      transactions: { value: '1,200', description: 'Total Transactions from yesterday' },
    }
  };

  const currentDetails: DetailItem[] = useMemo(() => {
    const data = chartDataMap[chartType];
    if (!data || !data.datasets || data.datasets.length === 0) return [];

    if (chartType === 'line') {
      return data.datasets.map((dataset: any) => ({
        label: dataset.label || '',
        value: `${dataset.data[dataset.data.length - 1]}`,
        color: dataset.borderColor,
        description: `Represents ${dataset.label}`
      }));
    } else {
      const total = data.datasets[0].data.reduce((sum: number, val: number) => sum + val, 0);
      return (data.labels || []).map((label: any, index: number) => {
        const value = data.datasets[0].data[index];
        const percentage = total > 0 ? ((value / total) * 100).toFixed(0) : 0;
        const colors = data.datasets[0].backgroundColor;
        const color = Array.isArray(colors) ? colors[index] : (colors as string);
        return {
          label: label,
          value: `${percentage}%`,
          description: `Represents ${label}`,
          color: color,
        };
      });
    }
  }, [chartType]);

  return (
    <MahatiChartAnalyticsWidget 
      title="Mahati Systems UI Components"
      chartTypes={['pie', 'doughnut', 'line', 'bar']}
      initialChartType={'line'}
      filters={[
        { id: 'Relationship', label: 'Relationship', options: ['Partner', 'Client'] },
        { id: 'DebtCollector', label: 'Debt Collector', options: ['Collector B', 'Collector A'] },
        { id: 'CollectionAgency', label: 'Collection Agency', options: ['Agency B', 'Agency A'] },
        { id: 'Periodicity', label: 'Periodicity', options: ['12 months', '30 days', '7 days'] },
      ]}
      selectedFilters={selectedFilters}
      chartDataMap={chartDataMap}
      onApplyFilters={() => console.log('Applied')}
      onFiltersChange={setSelectedFilters}
      details={currentDetails}
      quickStats={quickStatsData[chartType]}
      onChartTypeChange={setChartType}
      actionButtons={[
        { label: 'Remove Chart', style: 'danger', onClick: () => alert('Remove Chart') },
        { label: 'Add Chart', style: 'primary', onClick: () => alert('Add Chart') },
        { label: 'Save Layout', style: 'success', onClick: () => alert('Save Layout') },
      ]}
    />
  );
}
MahatiChartAnalyticsWidget.displayName = "MahatiChartAnalyticsWidget";

export { MahatiChartAnalyticsWidget };