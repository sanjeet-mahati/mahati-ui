import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Table } from '../src/components/Table';

describe('Table', () => {
  const mockHeaders = [
    { label: 'Name', key: 'name' },
    { label: 'Email', key: 'email' },
    { label: 'Age', key: 'age' },
  ];

  const mockData = [
    { name: 'John Doe', email: 'john@example.com', age: 30 },
    { name: 'Jane Smith', email: 'jane@example.com', age: 25 },
    { name: 'Bob Johnson', email: 'bob@example.com', age: 35 },
  ];

  it('should render table', () => {
    render(<Table headers={mockHeaders} data={mockData} />);
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('should render headers', () => {
    render(<Table headers={mockHeaders} data={mockData} />);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
  });

  it('should render data rows', () => {
    render(<Table headers={mockHeaders} data={mockData} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    expect(screen.getByText('35')).toBeInTheDocument();
  });

  it('should render empty state', () => {
    render(<Table headers={mockHeaders} data={[]} />);
    expect(screen.getByText(/No records found/i)).toBeInTheDocument();
  });

  it('should have displayName', () => {
    expect(Table.displayName).toBe('Table');
  });

  it('should render with pagination', () => {
    render(<Table headers={mockHeaders} data={mockData} paginationRequired={true} />);
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('should handle boolean values', () => {
    const dataWithBoolean = [{ name: 'Test', active: true }];
    const headersWithBoolean = [{ label: 'Name', key: 'name' }, { label: 'Active', key: 'active' }];
    render(<Table headers={headersWithBoolean} data={dataWithBoolean} />);
    expect(screen.getByText('Yes')).toBeInTheDocument();
  });
});
