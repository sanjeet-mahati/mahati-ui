import { render, screen } from '@testing-library/react';
import Table from '../components/Table';

describe('Table', () => {
  it('renders table headers and data', () => {
    const headers = [
      { label: 'Name', key: 'name' },
      { label: 'Age', key: 'age' },
    ];
    const data = [
      { name: 'Alice', age: 25 },
      { name: 'Bob', age: 30 },
    ];
    render(<Table headers={headers} data={data} />);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });
});
