import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TableWithTab } from '../src/components/TableWithTab';

describe('TableWithTab', () => {
  const mockHeaders = [
    { label: 'Name', key: 'name' },
    { label: 'Email', key: 'email' },
  ];

  const mockData = [
    { name: 'John Doe', email: 'john@example.com' },
    { name: 'Jane Smith', email: 'jane@example.com' },
  ];

  it('should render table', () => {
    render(<TableWithTab tableProps={{ headers: mockHeaders, data: mockData }} />);
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('should render title', () => {
    render(<TableWithTab tableProps={{ headers: mockHeaders, data: mockData }} title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('should render description', () => {
    render(
      <TableWithTab 
        tableProps={{ headers: mockHeaders, data: mockData }} 
        description="Test Description" 
      />
    );
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('should open tab when row clicked', () => {
    render(<TableWithTab tableProps={{ headers: mockHeaders, data: mockData }} />);
    
    const rows = screen.getAllByRole('row');
    fireEvent.click(rows[1]); // Click first data row
    
    // Tab interface should be visible
    expect(screen.getAllByText('John Doe').length).toBeGreaterThan(1);
  });

  it('should have displayName', () => {
    expect(TableWithTab.displayName).toBe('TableWithTab');
  });

  it('should render with rearrange enabled', () => {
    render(<TableWithTab tableProps={{ headers: mockHeaders, data: mockData }} rearrange={true} />);
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('should render with custom tabLabelKey', () => {
    render(<TableWithTab tableProps={{ headers: mockHeaders, data: mockData }} tabLabelKey="email" />);
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('should accept tabProps', () => {
    render(
      <TableWithTab 
        tableProps={{ headers: mockHeaders, data: mockData }} 
        tabProps={{ variant: 'gradient' }}
      />
    );
    expect(screen.getByRole('table')).toBeInTheDocument();
  });
});
