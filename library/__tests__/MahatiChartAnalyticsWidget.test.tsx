// __tests__/MahatiChartAnalyticsWidget.test.tsx

import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// ─── Mock Chart.js canvas (jsdom has no canvas support) ───────────────────────
jest.mock("react-chartjs-2", () => ({
  Bar: ({ data }: any) => <div data-testid="bar-chart">{JSON.stringify(data?.labels)}</div>,
  Line: ({ data }: any) => <div data-testid="line-chart">{JSON.stringify(data?.labels)}</div>,
  Pie: ({ data }: any) => <div data-testid="pie-chart">{JSON.stringify(data?.labels)}</div>,
  Doughnut: ({ data }: any) => <div data-testid="doughnut-chart">{JSON.stringify(data?.labels)}</div>,
}));

import { MahatiChartAnalyticsWidget } from "../src/components/MahatiChartAnalyticsWidget";

// ─── Shared base props (bar layout) ───────────────────────────────────────────
const baseProps: any = {
  title: "Analytics",
  chartTypes: ["bar"],
  initialChartType: "bar",
  filters: [],
  selectedFilters: {},
  chartFilters: {},
  chartDataMap: {
    bar: {
      labels: ["Jan", "Feb", "Mar"],
      datasets: [
        {
          label: "Revenue",
          data: [100, 200, 150],
          backgroundColor: "#2094F3",
        },
      ],
    },
  },
  bulletData: undefined,
  gaugeData: undefined,
  horizontalBarData: undefined,
  columnChartData: undefined,
  groupBarData: undefined,
  stackBarData: undefined,
  lollipopData: undefined,
  kpiData: undefined,
  riskGaugeData: undefined,
  ganttData: undefined,
  heatmapData: undefined,
  calendarheatmapData: undefined,
  details: [
    {
      label: "Revenue",
      value: "$10,000",
      color: "#2094F3",
      description: "Total revenue this month",
    },
    {
      label: "Profit",
      value: "$3,500",
      color: "#10B981",
      description: "Net profit this month",
    },
  ],
  quickStats: {
    totalVolume: {
      value: "$33,850",
      change: "+12%",
      description: "vs last month",
    },
    transactions: {
      value: "1,240",
      description: "Total transactions",
    },
  },
  actionButtons: [],
  onApplyFilters: jest.fn(),
  onChartTypeChange: jest.fn(),
  onFiltersChange: jest.fn(),
};

// ─── Pie props ────────────────────────────────────────────────────────────────
const pieProps: any = {
  ...baseProps,
  chartTypes: ["pie"],
  initialChartType: "pie",
  chartDataMap: {
    pie: {
      labels: ["Revenue", "Profit"],
      datasets: [
        {
          data: [60, 40],
          backgroundColor: ["#2094F3", "#10B981"],
        },
      ],
    },
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// BAR LAYOUT
// ═══════════════════════════════════════════════════════════════════════════════

describe("MahatiChartAnalyticsWidget — Bar Layout", () => {
  it("renders the bar chart layout without crashing", () => {
    render(<MahatiChartAnalyticsWidget {...baseProps} />);
    expect(screen.getByText("Details")).toBeInTheDocument();
  });

  it("renders legend / summary items", () => {
    render(<MahatiChartAnalyticsWidget {...baseProps} />);
    expect(screen.getAllByText("Revenue").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Profit").length).toBeGreaterThan(0);
  });

  it("renders Details section with item values", () => {
    render(<MahatiChartAnalyticsWidget {...baseProps} />);
    expect(screen.getByText("$10,000")).toBeInTheDocument();
    expect(screen.getByText("$3,500")).toBeInTheDocument();
  });

  it("renders Total Volume and Transactions in Quick Stats", () => {
    render(<MahatiChartAnalyticsWidget {...baseProps} />);

    expect(screen.getByText("Total Volume")).toBeInTheDocument();
    expect(screen.getByText("$33,850")).toBeInTheDocument();
    expect(screen.getByText("vs last month")).toBeInTheDocument();

    expect(screen.getByText("Transactions")).toBeInTheDocument();
    expect(screen.getByText("1,240")).toBeInTheDocument();
    expect(screen.getByText("Total transactions")).toBeInTheDocument();
  });

  it("renders Quick Stats heading", () => {
    render(<MahatiChartAnalyticsWidget {...baseProps} />);
    expect(screen.getByText("Quick Stats")).toBeInTheDocument();
  });

  it("renders detail item descriptions", () => {
    render(<MahatiChartAnalyticsWidget {...baseProps} />);
    expect(screen.getByText("Total revenue this month")).toBeInTheDocument();
    expect(screen.getByText("Net profit this month")).toBeInTheDocument();
  });

  it("renders bar chart canvas", () => {
    render(<MahatiChartAnalyticsWidget {...baseProps} />);
    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// PIE LAYOUT
// ═══════════════════════════════════════════════════════════════════════════════

describe("MahatiChartAnalyticsWidget — Pie Layout", () => {
  it("renders without crashing", () => {
    render(<MahatiChartAnalyticsWidget {...pieProps} />);
    expect(screen.getByText("Details")).toBeInTheDocument();
  });

  it("renders totalVolume change indicator", () => {
    render(<MahatiChartAnalyticsWidget {...pieProps} />);
    // +12% is ONLY rendered in the pie layout quickStats card
    expect(screen.getByText("+12%")).toBeInTheDocument();
  });

  it("renders Total Volume value", () => {
    render(<MahatiChartAnalyticsWidget {...pieProps} />);
    expect(screen.getByText("$33,850")).toBeInTheDocument();
  });

  it("renders Transactions value", () => {
    render(<MahatiChartAnalyticsWidget {...pieProps} />);
    expect(screen.getByText("1,240")).toBeInTheDocument();
  });

  it("renders detail items with labels and values", () => {
    render(<MahatiChartAnalyticsWidget {...pieProps} />);
    expect(screen.getAllByText("Revenue").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Profit").length).toBeGreaterThan(0);
    expect(screen.getAllByText("$10,000").length).toBeGreaterThan(0);
    expect(screen.getAllByText("$3,500").length).toBeGreaterThan(0);
  });

jest.mock("../src/components/PieLineBarChart", () => ({
  PieLineBarChart: ({ chartType, data }: any) => (
    <div data-testid={`${chartType}-chart`}>{JSON.stringify(data?.labels)}</div>
  ),
  makeAreaDataStraight: (data: any) => data,
}));
});

// ═══════════════════════════════════════════════════════════════════════════════
// CHART TYPE SWITCHING
// ═══════════════════════════════════════════════════════════════════════════════

describe("MahatiChartAnalyticsWidget — Chart Type Switching", () => {
  it("calls onChartTypeChange when a tab is clicked", () => {
    const onChartTypeChange = jest.fn();
    const props = {
      ...baseProps,
      chartTypes: ["bar", "line"],
      chartDataMap: {
        bar: {
          labels: ["Jan"],
          datasets: [{ label: "Revenue", data: [100], backgroundColor: "#2094F3" }],
        },
        line: {
          labels: ["Jan"],
          datasets: [{ label: "Revenue", data: [100], backgroundColor: "#2094F3" }],
        },
      },
      onChartTypeChange,
    };

    render(<MahatiChartAnalyticsWidget {...props} />);
    screen.getByText("Line Chart").click();
    expect(onChartTypeChange).toHaveBeenCalledWith("line");
  });

  it("calls onApplyFilters when Apply button is clicked", () => {
    const onApplyFilters = jest.fn();
    render(<MahatiChartAnalyticsWidget {...baseProps} onApplyFilters={onApplyFilters} />);
    screen.getByText("Apply").click();
    expect(onApplyFilters).toHaveBeenCalledWith({});
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// FILTERS
// ═══════════════════════════════════════════════════════════════════════════════

describe("MahatiChartAnalyticsWidget — Filters", () => {
  it("renders filter dropdowns when filters are provided", () => {
    const props = {
      ...baseProps,
      filters: [
        { id: "SelectYear", label: "Year", options: ["2025", "2026"] },
        { id: "SelectMonth", label: "Month", options: ["January", "February"] },
      ],
    };
    render(<MahatiChartAnalyticsWidget {...props} />);
    expect(screen.getAllByText("Year").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Month").length).toBeGreaterThan(0);
  });

  it("renders Apply button", () => {
    render(<MahatiChartAnalyticsWidget {...baseProps} />);
    expect(screen.getByText("Apply")).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// DETAILS — STATUS BADGE
// ═══════════════════════════════════════════════════════════════════════════════

describe("MahatiChartAnalyticsWidget — Details Section", () => {
  it("renders status badges when status is provided in pie layout", () => {
    const props = {
      ...pieProps,
      details: [
        {
          label: "Revenue",
          value: "$10,000",
          color: "#2094F3",
          description: "Total revenue",
          status: "On Target" as const,
        },
      ],
    };
    render(<MahatiChartAnalyticsWidget {...props} />);
    expect(screen.getByText("On Target")).toBeInTheDocument();
  });
});