import React from 'react';

const ChartInterface = ({ type, data }: any) => (
  <canvas 
    data-testid="chart-interface" 
    data-type={type}
    style={{ width: '100%', height: '100%' }}
    aria-label={`Mock ${type} chart`}
  />
);

export { ChartInterface };