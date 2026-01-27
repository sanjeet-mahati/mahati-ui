import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Dropdown } from '../src/components/Dropdown';

describe('Dropdown', () => {
  const mockOptions = [
    { key: 'Option 1', value: 1 },
    { key: 'Option 2', value: 2 },
    { key: 'Option 3', value: 3 },
  ];

  const mockOnSelect = jest.fn();

  beforeEach(() => {
    mockOnSelect.mockClear();
  });

  it('should render dropdown button', () => {
    render(<Dropdown options={mockOptions} onSelect={mockOnSelect} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should render with placeholder', () => {
    render(<Dropdown options={mockOptions} onSelect={mockOnSelect} placeholder="Select option" />);
    expect(screen.getByText('Select option')).toBeInTheDocument();
  });

  it('should open menu when clicked', () => {
    render(<Dropdown options={mockOptions} onSelect={mockOnSelect} />);
    
    fireEvent.click(screen.getByRole('button'));
    
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  it('should call onSelect when option clicked', () => {
    render(<Dropdown options={mockOptions} onSelect={mockOnSelect} />);
    
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('Option 2'));
    
    expect(mockOnSelect).toHaveBeenCalledWith(2);
  });

  it('should render with all variants', () => {
    const variants = ['basic', 'outline', 'pill', 'dark', 'underline', 'shadow', 'glass', 'gradient'];
    
    variants.forEach(variant => {
      const { unmount } = render(
        <Dropdown options={mockOptions} onSelect={mockOnSelect} variant={variant as any} />
      );
      expect(screen.getByRole('button')).toBeInTheDocument();
      unmount();
    });
  });

  it('should render disabled state', () => {
    render(<Dropdown options={mockOptions} onSelect={mockOnSelect} disabled />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should display selected value', () => {
    render(<Dropdown options={mockOptions} onSelect={mockOnSelect} value={2} />);
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  it('should accept className', () => {
    const { container } = render(
      <Dropdown options={mockOptions} onSelect={mockOnSelect} className="custom-class" />
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('should handle empty options array', () => {
    render(<Dropdown options={[]} onSelect={mockOnSelect} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
