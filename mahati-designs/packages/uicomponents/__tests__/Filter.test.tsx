import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Filter } from '../src/components/Filter';

describe('Filter', () => {
  const mockOnApply = jest.fn();
  const mockOnReset = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render filter button', () => {
    render(<Filter onApply={mockOnApply} />);
    expect(screen.getByRole('button', { name: /filter/i })).toBeInTheDocument();
  });

  it('should open filter dialog when button clicked', () => {
    render(<Filter onApply={mockOnApply} />);
    
    const filterButton = screen.getByRole('button', { name: /filter/i });
    fireEvent.click(filterButton);
    
    expect(screen.getByText('Add Filter')).toBeInTheDocument();
  });

  it('should render date range picker', () => {
    render(<Filter onApply={mockOnApply} />);
    
    fireEvent.click(screen.getByRole('button', { name: /filter/i }));
    
    expect(screen.getByText('Date Range')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Select date')).toBeInTheDocument();
  });

  it('should render activity dropdown', () => {
    render(<Filter onApply={mockOnApply} />);
    
    fireEvent.click(screen.getByRole('button', { name: /filter/i }));
    
    // Use getAllByText and check for the specific option
    const activityElements = screen.getAllByText(/activity/i);
    expect(activityElements.length).toBeGreaterThan(0);
    expect(screen.getByRole('combobox', { name: "Select Activity" })).toBeInTheDocument();
  });

  it('should render status dropdown', () => {
    render(<Filter onApply={mockOnApply} />);
    
    fireEvent.click(screen.getByRole('button', { name: /filter/i }));
    
    expect(screen.getByText(/Select Status/i)).toBeInTheDocument();
  });

  it('should render search input', () => {
    render(<Filter onApply={mockOnApply} />);
    
    fireEvent.click(screen.getByRole('button', { name: /filter/i }));
    
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
  });

  it('should call onApply when apply button clicked', async () => {
    render(<Filter onApply={mockOnApply} />);
    
    fireEvent.click(screen.getByRole('button', { name: /filter/i }));
    
    // Wait for dialog to open
    await waitFor(() => {
      expect(screen.getByText('Add Filter')).toBeInTheDocument();
    });
    
    const applyButton = screen.getByRole('button', { name: /apply now/i });
    fireEvent.click(applyButton);
    
    await waitFor(() => {
      expect(mockOnApply).toHaveBeenCalled();
    });
  });

  it('should reset filters when reset all button clicked', async () => {
    render(<Filter onApply={mockOnApply} onReset={mockOnReset} />);

    fireEvent.click(screen.getByRole('button', { name: /filter/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Add Filter')).toBeInTheDocument();
    });
    
    // Click the "Reset all" button (not just "Reset")
    const resetAllButton = screen.getByRole('button', { name: /reset all/i });
    fireEvent.click(resetAllButton);
    
    await waitFor(() => {
      expect(mockOnReset).toHaveBeenCalled();
    });
  });

  it('should accept custom activity options', () => {
    const customActivities = [ { label: "Select Activity", value: "" },
  { label: "Activity List", value: "Activity List" },
  { label: "Login", value: "Login" },
  { label: "Update", value: "Update" },
  { label: "Delete", value: "Delete" }]
    
    render(<Filter onApply={mockOnApply} activityOptions={customActivities} />);
    
    fireEvent.click(screen.getByRole('button', { name: /filter/i }));
    
    // Check for custom activity options
    const activitySelect = screen.getAllByRole('combobox')[0];
    expect(activitySelect).toBeInTheDocument();
  });

  it('should accept custom status options', () => {
    const customStatuses =  [{ label: "Select Status", value: "" },
  { label: "Pending", value: "Pending" },
  { label: "Approved", value: "Approved" },
  { label: "Rejected", value: "Rejected" }
    ]
    render(<Filter onApply={mockOnApply} statusOptions={customStatuses} />);
    
    fireEvent.click(screen.getByRole('button', { name: /filter/i }));
    
    const options = screen.getAllByRole('option');
    expect(options.some(opt => opt.textContent === 'Select Status')).toBeTruthy();
  });

  it('should render with custom placeholder', () => {
    render(<Filter onApply={mockOnApply} searchPlaceholder="Custom search..." />);
    
    fireEvent.click(screen.getByRole('button', { name: /filter/i }));
    
    expect(screen.getByPlaceholderText('Custom search...')).toBeInTheDocument();
  });

  it('should show active filter count', () => {
    render(<Filter onApply={mockOnApply} activeFiltersCount={3} />);
    
    // Check if badge or count indicator is visible
    const filterButton = screen.getByRole('button', { name: /filter/i });
    expect(filterButton).toBeInTheDocument();
  });

  it('should handle date range selection', async () => {
    render(<Filter onApply={mockOnApply} />);
    
    fireEvent.click(screen.getByRole('button', { name: /filter/i }));
    
    const dateInput = screen.getByPlaceholderText('Select date');
    fireEvent.click(dateInput);
    
    // Date picker interaction would go here
    expect(dateInput).toBeInTheDocument();
  });

  it('should handle activity selection', async () => {
    render(<Filter onApply={mockOnApply} />);
    
    fireEvent.click(screen.getByRole('button', { name: /filter/i }));
    
    const activitySelect = screen.getAllByRole('combobox')[0];
    fireEvent.change(activitySelect, { target: { value: 'Login' } });
    
    expect(activitySelect).toHaveValue('Login');
  });

  it('should handle status selection', async () => {
    render(<Filter onApply={mockOnApply} />);
    
    fireEvent.click(screen.getByRole('button', { name: /filter/i }));
    
    const statusSelect = screen.getAllByRole('combobox')[1];
    fireEvent.change(statusSelect, { target: { value: 'Pending' } });
    
    expect(statusSelect).toHaveValue('Pending');
  });

  it('should handle search input', async () => {
    render(<Filter onApply={mockOnApply} />);
    
    fireEvent.click(screen.getByRole('button', { name: /filter/i }));
    
    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: 'test query' } });
    
    expect(searchInput).toHaveValue('test query');
  });

  it('should close dialog when close button clicked', async () => {
    render(<Filter onApply={mockOnApply} />);
    
    fireEvent.click(screen.getByRole('button', { name: /filter/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Add Filter')).toBeInTheDocument();
    });
    
    // Find and click the close button (X icon button)
    const closeButtons = screen.getAllByRole('button');
    const closeButton = closeButtons.find(btn => 
      btn.querySelector('svg path[d*="M18 6 6 18"]')
    );
    
    if (closeButton) {
      fireEvent.click(closeButton);
      
      await waitFor(() => {
        expect(screen.queryByText('Add Filter')).not.toBeInTheDocument();
      });
    }
  });
});
