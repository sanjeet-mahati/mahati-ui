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

export interface MahatiChartAnalyticsWidgetProps {
    title: string;
    chartTypes: ChartType[];
    initialChartType: ChartType;
    filters: Filter[];
    initialFilters: Record<string, string>;
    chartDataMap: Record<ChartType, ChartData<any>>;
    onApplyFilters?: (filters: Record<string, string>) => void;
    quickStats: {
        // This can be made more dynamic in the parent component
        totalVolume: { value: string; change: string; description: string; };
        transactions: { value: string; description: string; };
    };
    actionButtons: { label: string; style: 'danger' | 'primary' | 'success'; onClick: () => void; }[];
}
 const MahatiChartAnalyticsWidget: React.FC<MahatiChartAnalyticsWidgetProps> = ({
    title,
    chartTypes,
    initialChartType,
    filters,
    initialFilters,
    chartDataMap,
    onApplyFilters,
    quickStats,
    actionButtons,
    onChartTypeChange
}) => {
    const [chartType, setChartType] = useState<ChartType>(initialChartType);
    const [selectedFilters, setSelectedFilters] = useState(initialFilters);

    const currentData = useMemo(() => {
        return chartDataMap[chartType];
    }, [chartDataMap, chartType]);


    const chartOptions: ChartOptions<any> = useMemo(() => ({
        responsive: true,
        maintainAspectRatio: false,
        cutout: chartType === 'pie' || chartType === 'doughnut' ? '42%' : undefined,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        let label = context.dataset.label || context.label || '';
                        let value = context.parsed?.y ?? context.parsed;
                        return label + ': ' + value + (chartType === 'pie' || chartType === 'doughnut' ? '%' : '');
                    }
                }
            }
        }
    }), [chartType]);

    const details = useMemo(() => {
        if (!currentData) return [];
        if (chartType === 'line') {
            return currentData.datasets.map((dataset: any) => ({
                label: dataset.label || '',
                value: dataset.data[dataset.data.length - 1],
                color: dataset.borderColor,
                description: 'Enter your description here'
            }));
        } else {
            return (currentData.labels || []).map((label: any, index: number) => ({
                label,
                value: `${currentData.datasets[0].data[index]}%`,
                color: Array.isArray(currentData.datasets[0].backgroundColor)
                    ? currentData.datasets[0].backgroundColor[index]
                    : currentData.datasets[0].backgroundColor,
                description: 'Enter your description here'
            }));
        }
    }, [chartType, currentData]);

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
        danger: "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100",
        primary: "bg-blue-50 text-gray-800 border border-gray-200 hover:bg-blue-100",
        success: "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100",
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <h1 className="text-2xl font-semibold text-blue-600">{title}</h1>
            </div>

            <div className="px-6 py-4 flex gap-2">
                {chartTypes.map(type => (
                    <button
                        key={type}
                        onClick={() => {
                            setChartType(type);
                            onChartTypeChange?.(type);
                        }}
                        className={`px-4 py-2 rounded font-medium ${chartType === type ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    >
                        {type.charAt(0).toUpperCase() + type.slice(1)} Chart
                    </button>
                ))}
            </div>

            <div className="px-6 py-4 bg-white border-b border-gray-200">
                <div className="flex gap-4 items-center flex-wrap">
                    {filters.map(filter => (
                        <React.Fragment key={filter.id}>
                            <span className="text-sm text-gray-600">{filter.label}</span>
                            <select
                                className="px-3 py-1.5 border border-gray-300 rounded"
                                value={selectedFilters[filter.id]}
                                onChange={(e) => setSelectedFilters({ ...selectedFilters, [filter.id]: e.target.value })}
                            >
                                {filter.options.map(opt => <option key={opt}>{opt}</option>)}
                            </select>
                        </React.Fragment>
                    ))}
                    <button onClick={() => onApplyFilters?.(selectedFilters)} className="px-6 py-1.5 bg-teal-500 text-white rounded font-medium hover:bg-teal-600">
                        Apply
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-b from-gray-50 to-teal-50 border border-gray-300 rounded-2xl p-6 shadow-md">
                        <div className="h-72 flex items-center justify-center mb-4">{renderChart()}</div>
                        <div className="mt-4 space-y-2 text-sm">
                            {details.map((item, index) => (
                                <div key={index} className="flex items-center">
                                    <span className="w-5 h-2.5 rounded mr-4" style={{ backgroundColor: item.color as string }}></span>
                                    <span className="flex-1 text-gray-700">{item.label}</span>
                                    <span className="font-semibold text-black">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gradient-to-b from-gray-50 to-teal-50 border border-gray-300 rounded-2xl p-6 shadow-md">
                        <h3 className="text-lg font-semibold text-gray-800 mb-6">Details</h3>
                        <div className="space-y-5">
                            {details.map((item, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <div className="w-2/12"><span className="inline-block w-8 h-8 rounded" style={{ backgroundColor: item.color as string }}></span></div>
                                    <div className="w-8/12">
                                        <div className="font-semibold text-gray-800">{item.label}</div>
                                        <div className="text-sm text-gray-500">{item.description}</div>
                                    </div>
                                    <div className="w-2/12 text-right font-semibold">{item.value}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="bg-gradient-to-b from-gray-50 to-teal-50 border border-gray-300 rounded-2xl p-4 shadow-md">
                            <div className="text-gray-800 font-semibold">Total Volume</div>
                            <div className="mt-6 text-2xl font-bold">
                                {quickStats.totalVolume.value} <span className="text-sm text-green-500 font-medium">{quickStats.totalVolume.change}</span>
                            </div>
                            <div className="text-sm text-gray-400 mt-2">{quickStats.totalVolume.description}</div>
                        </div>
                        <div className="bg-gradient-to-b from-gray-50 to-teal-50 border border-gray-300 rounded-2xl p-4 shadow-md">
                            <div className="text-gray-800 font-semibold">Transactions</div>
                            <div className="mt-6 text-2xl font-bold">{quickStats.transactions.value}</div>
                            <div className="text-sm text-gray-400 mt-2">{quickStats.transactions.description}</div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    {actionButtons.map(btn => (
                        <button key={btn.label} onClick={btn.onClick} className={`px-4 py-2 rounded-lg font-semibold ${buttonStyles[btn.style]}`}>
                            {btn.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
MahatiChartAnalyticsWidget.displayName = "MahatiChartAnalyticsWidget";

export { MahatiChartAnalyticsWidget };