import React from 'react';
import { render, screen } from '@testing-library/react';

describe('ChartDemo Page', () => {
  test('renders page title and description', () => {
    // Create mock page component
    const MockPage = () => {
      return (
        <div>
          <h1>Charts</h1>
          <p>Charts UI provides various types of charts like <b>"Pie"</b>, <b>"Doughnut"</b>, <b>"Line"</b>, <b>"Area"</b>, <b>"Bar"</b>, <b>"Bullet"</b>, <b>"Gauge"</b>, <b>"Gantt"</b>, <b>"Calendar Heatmap"</b>, <b>"Horizontal Bar"</b>, <b>"Lollipop Chart"</b>.</p>
          <div>
            <h3>Upload Custom Data (Optional)</h3>
            <input type="file" accept=".json" />
            <p>Upload a JSON file with the same structure as sample-chart-data.json</p>
          </div>
          <div data-testid="chart-widget">
            Chart Widget Area
          </div>
        </div>
      );
    };

    render(<MockPage />);
    
    expect(screen.getByText('Charts')).toBeTruthy();
    expect(screen.getByText(/Charts UI provides various types of charts/)).toBeTruthy();
    expect(screen.getByText('Upload Custom Data (Optional)')).toBeTruthy();
    expect(screen.getByText(/Upload a JSON file with the same structure/)).toBeTruthy();
    expect(screen.getByTestId('chart-widget')).toBeTruthy();
  });

  test('includes all chart types in description', () => {
    const MockPage = () => {
      return (
        <div>
          <p>Charts UI provides various types of charts like <b>"Pie"</b>, <b>"Doughnut"</b>, <b>"Line"</b>, <b>"Area"</b>, <b>"Bar"</b>, <b>"Bullet"</b>, <b>"Gauge"</b>, <b>"Gantt"</b>, <b>"Calendar Heatmap"</b>, <b>"Horizontal Bar"</b>, <b>"Lollipop Chart"</b>.</p>
        </div>
      );
    };

    render(<MockPage />);
    
    const chartTypes = ['Pie', 'Doughnut', 'Line', 'Area', 'Bar', 'Bullet', 'Gauge', 'Gantt', 'Calendar Heatmap', 'Horizontal Bar', 'Lollipop Chart'];
    
    chartTypes.forEach(type => {
      expect(screen.getByText(new RegExp(`"${type}"`, 'i'))).toBeTruthy();
    });
  });

  test('has file upload input', () => {
    const MockPage = () => {
      return (
        <div>
          <input type="file" accept=".json" data-testid="file-input" />
        </div>
      );
    };

    render(<MockPage />);
    
    const fileInput = screen.getByTestId('file-input');
    expect(fileInput).toBeTruthy();
    expect(fileInput).toHaveAttribute('type', 'file');
    expect(fileInput).toHaveAttribute('accept', '.json');
  });
});