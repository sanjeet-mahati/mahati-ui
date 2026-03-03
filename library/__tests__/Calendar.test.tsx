import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Calendar, CalendarDate, CalendarTime, CalendarDateRange } from '../src/components/Calendar';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

describe('Calendar Component', () => {
  describe('Basic Rendering', () => {
    it('renders with default props', () => {
      render(<Calendar />);
      const input = screen.getByPlaceholderText('Select date');
      expect(input).toBeInTheDocument();
    });

    it('renders with custom placeholder', () => {
      render(<Calendar placeholder="Pick a date" />);
      expect(screen.getByPlaceholderText('Pick a date')).toBeInTheDocument();
    });

    // FIX 1: Look for SVG icon instead of inline pointer-events style
    it('shows calendar icon by default', () => {
      const { container } = render(<Calendar />);
      const icon = container.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    it('hides icon when showIcon is false', () => {
      const { container } = render(<Calendar showIcon={false} />);
      const icon = container.querySelector('svg');
      expect(icon).not.toBeInTheDocument();
    });

    it('renders with custom icon', () => {
      const CustomIcon = () => <span data-testid="custom-icon">📅</span>;
      render(<Calendar icon={<CustomIcon />} />);
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });

    it('renders disabled state correctly', () => {
      render(<Calendar disabled />);
      const input = screen.getByPlaceholderText('Select date');
      expect(input).toBeDisabled();
    });
  });

  describe('Calendar Dropdown', () => {
    it('opens calendar dropdown when input is clicked', async () => {
      render(<Calendar />);
      const input = screen.getByPlaceholderText('Select date');
      
      fireEvent.click(input);
      
      await waitFor(() => {
        expect(screen.getByText('Select Date & Time')).toBeInTheDocument();
      });
    });

    it('does not open when disabled', () => {
      render(<Calendar disabled />);
      const input = screen.getByPlaceholderText('Select date');
      
      fireEvent.click(input);
      
      expect(screen.queryByText('Select Date & Time')).not.toBeInTheDocument();
    });

    it('closes calendar when clicking outside', async () => {
      render(
        <div>
          <Calendar />
          <button>Outside</button>
        </div>
      );
      
      const input = screen.getByPlaceholderText('Select date');
      fireEvent.click(input);
      
      await waitFor(() => {
        expect(screen.getByText('Select Date & Time')).toBeInTheDocument();
      });
      
      const outsideButton = screen.getByText('Outside');
      fireEvent.mouseDown(outsideButton);
      
      await waitFor(() => {
        expect(screen.queryByText('Select Date & Time')).not.toBeInTheDocument();
      });
    });

    it('calls onShow when calendar opens', async () => {
      const onShow = jest.fn();
      render(<Calendar onShow={onShow} />);
      
      const input = screen.getByPlaceholderText('Select date');
      fireEvent.click(input);
      
      await waitFor(() => {
        expect(onShow).toHaveBeenCalledTimes(1);
      });
    });

    it('calls onHide when calendar closes', async () => {
      const onHide = jest.fn();
      render(<Calendar onHide={onHide} />);
      
      const input = screen.getByPlaceholderText('Select date');
      fireEvent.click(input);
      
      await waitFor(() => {
        expect(screen.getByText('Select Date & Time')).toBeInTheDocument();
      });
      
      fireEvent.click(input);
      
      await waitFor(() => {
        expect(onHide).toHaveBeenCalled();
      });
    });
  });

  describe('Date Selection', () => {
    it('selects a date when day is clicked', async () => {
      const onChange = jest.fn();
      render(<Calendar onChange={onChange} />);
      
      const input = screen.getByPlaceholderText('Select date');
      fireEvent.click(input);
      
      await waitFor(() => {
        const day15 = screen.getByText('15');
        fireEvent.click(day15);
      });
      
      expect(onChange).toHaveBeenCalled();
    });

    it('displays selected date in input field', async () => {
      const selectedDate: CalendarDate = {
        year: 2024,
        month: 0,
        day: 15
      };
      
      render(<Calendar value={selectedDate} />);
      
      const input = screen.getByPlaceholderText('Select date') as HTMLInputElement;
      expect(input.value).toContain('15');
      expect(input.value).toContain('2024');
    });

    it('highlights selected date in calendar', async () => {
      const selectedDate: CalendarDate = {
        year: 2026,
        month: 1, // February  
        day: 15
      };
      
      const { container } = render(<Calendar value={selectedDate} />);
      
      const input = screen.getByPlaceholderText('Select date');
      fireEvent.click(input);
      
      await waitFor(() => {
        const day15Button = screen.getByText('15').closest('button');
        // Check for selected state using the actual class applied
        expect(day15Button).toHaveClass('css-mxn723');
      });
    });

    it('auto-hides calendar after selection when autoHide is true', async () => {
      render(<Calendar autoHide />);
      
      const input = screen.getByPlaceholderText('Select date');
      fireEvent.click(input);
      
      await waitFor(() => {
        const day15 = screen.getByText('15');
        fireEvent.click(day15);
      });
      
      await waitFor(() => {
        expect(screen.queryByText('Select Date & Time')).not.toBeInTheDocument();
      });
    });
  });

  describe('Month Navigation', () => {
    // FIX 2: Set a specific initial date to ensure predictable month display
    it('navigates to next month', async () => {
      const testDate: CalendarDate = { year: 2026, month: 0, day: 15 }; // January 2026
      render(<Calendar value={testDate} />);
      
      const input = screen.getByPlaceholderText('Select date');
      fireEvent.click(input);
      
      await waitFor(() => {
        expect(screen.getByText('January 2026')).toBeInTheDocument();
      });

      const nextButton = screen.getByLabelText('Next month');
      fireEvent.click(nextButton);
      
      await waitFor(() => {
        expect(screen.getByText('February 2026')).toBeInTheDocument();
      });
    });

  
    it('navigates to previous month', async () => {
  const testDate: CalendarDate = { year: 2026, month: 1, day: 15 }; // February 2026

  render(<Calendar value={testDate} />);

  const input = screen.getByPlaceholderText('Select date');
  fireEvent.click(input);

  await waitFor(() => {
    expect(screen.getByText(/February\s+2026/)).toBeInTheDocument();
  });

  const nextButton = screen.getByLabelText('Next month');
  fireEvent.click(nextButton);

  await waitFor(() => {
    expect(screen.getByText(/March\s+2026/)).toBeInTheDocument();
  });

  const prevButton = screen.getByLabelText('Previous month');
  fireEvent.click(prevButton);

  await waitFor(() => {
    expect(screen.getByText(/February\s+2026/)).toBeInTheDocument();
  });
});



    it('wraps to next year when going from December to January', async () => {
      const decemberDate: CalendarDate = { year: 2025, month: 11, day: 15 };
      render(<Calendar value={decemberDate} />);
      
      const input = screen.getByPlaceholderText('Select date');
      fireEvent.click(input);
      
      await waitFor(() => {
        expect(screen.getByText('December 2025')).toBeInTheDocument();
        
        const nextButton = screen.getByLabelText('Next month');
        fireEvent.click(nextButton);
        
        expect(screen.getByText('January 2026')).toBeInTheDocument();
      });
    });

    it('wraps to previous year when going from January to December', async () => {
      const januaryDate: CalendarDate = { year: 2026, month: 0, day: 15 };
      render(<Calendar value={januaryDate} />);
      
      const input = screen.getByPlaceholderText('Select date');
      fireEvent.click(input);
      
      await waitFor(() => {
        expect(screen.getByText('January 2026')).toBeInTheDocument();
        
        const prevButton = screen.getByLabelText('Previous month');
        fireEvent.click(prevButton);
        
        expect(screen.getByText('December 2025')).toBeInTheDocument();
      });
    });
  });

  describe('Today Button', () => {
    it('renders today button when showTodayButton is true', async () => {
      render(<Calendar showTodayButton />);
      
      const input = screen.getByPlaceholderText('Select date');
      fireEvent.click(input);
      
      await waitFor(() => {
        expect(screen.getByText('Today')).toBeInTheDocument();
      });
    });

    it('selects today when today button is clicked', async () => {
      const onChange = jest.fn();
      render(<Calendar showTodayButton onChange={onChange} />);
      
      const input = screen.getByPlaceholderText('Select date');
      fireEvent.click(input);
      
      await waitFor(() => {
        const todayButton = screen.getByText('Today');
        fireEvent.click(todayButton);
      });
      
      const today = new Date();
      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          year: today.getFullYear(),
          month: today.getMonth(),
          day: today.getDate()
        }),
        expect.any(String)
      );
    });
  });

  describe('Clear Button', () => {
    it('renders clear button when showClearButton is true', async () => {
      render(<Calendar showClearButton />);
      
      const input = screen.getByPlaceholderText('Select date');
      fireEvent.click(input);
      
      await waitFor(() => {
        expect(screen.getByText('Clear')).toBeInTheDocument();
      });
    });

    it('clears selection when clear button is clicked', async () => {
      const onChange = jest.fn();
      const selectedDate: CalendarDate = { year: 2024, month: 0, day: 15 };
      
      render(<Calendar value={selectedDate} onChange={onChange} showClearButton />);
      
      const input = screen.getByPlaceholderText('Select date');
      fireEvent.click(input);
      
      await waitFor(() => {
        const clearButton = screen.getByText('Clear');
        fireEvent.click(clearButton);
      });
      
      expect(onChange).toHaveBeenCalledWith(null, '');
    });
  });

  describe('Range Selection', () => {
    it('enables range selection mode', async () => {
      render(<Calendar enableRangeSelection />);
      
      const input = screen.getByPlaceholderText('Select date');
      fireEvent.click(input);
      
      await waitFor(() => {
        expect(screen.getByText('Select Date Range')).toBeInTheDocument();
        expect(screen.getByText('From Date')).toBeInTheDocument();
        expect(screen.getByText('To Date')).toBeInTheDocument();
      });
    });

    it('selects start and end dates in range mode', async () => {
      const onRangeChange = jest.fn();
      render(<Calendar enableRangeSelection onRangeChange={onRangeChange} />);
      
      const input = screen.getByPlaceholderText('Select date');
      fireEvent.click(input);
      
      await waitFor(() => {
        const day10 = screen.getByText('10');
        fireEvent.click(day10);
      });

      await waitFor(() => {
        expect(onRangeChange).toHaveBeenCalledWith(
          expect.objectContaining({
            start: expect.objectContaining({ day: 10 }),
            end: null
          })
        );
      });
      
      const day20 = screen.getByText('20');
      fireEvent.click(day20);
      
      await waitFor(() => {
        expect(onRangeChange).toHaveBeenCalledWith(
          expect.objectContaining({
            start: expect.objectContaining({ day: 10 }),
            end: expect.objectContaining({ day: 20 })
          })
        );
      });
    });

    it('swaps dates if end date is before start date', async () => {
      const onRangeChange = jest.fn();
      
      render(
        <Calendar 
          enableRangeSelection 
          onRangeChange={onRangeChange} 
        />
      );
      
      const input = screen.getByPlaceholderText('Select date');
      fireEvent.click(input);
      
      // First, select day 20 as start date
      await waitFor(() => {
        const day20 = screen.getByText('20');
        fireEvent.click(day20);
      });

      await waitFor(() => {
        expect(onRangeChange).toHaveBeenCalledWith(
          expect.objectContaining({
            start: expect.objectContaining({ day: 20 }),
            end: null
          })
        );
      });

      // Now click on "To Date" field to switch to end selection
      const toDateButton = screen.getByText('To Date').closest('button');
      if (toDateButton) {
        fireEvent.click(toDateButton);
      }

      // Then select day 10 as end date (which is before start date)
      await waitFor(() => {
        const day10 = screen.getByText('10');
        fireEvent.click(day10);
      });

      // Should swap dates so start=10, end=20
      await waitFor(() => {
        expect(onRangeChange).toHaveBeenLastCalledWith(
          expect.objectContaining({
            start: expect.objectContaining({ day: 10 }),
            end: expect.objectContaining({ day: 20 })
          })
        );
      });
    });
  });

  describe('Time Selection', () => {
    it('shows time selector when enableTimeSelection is true', async () => {
      render(<Calendar enableTimeSelection />);
      
      const input = screen.getByPlaceholderText('Select date');
      fireEvent.click(input);
      
      await waitFor(() => {
        expect(screen.getByText('Choose Time')).toBeInTheDocument();
      });
    });

    it('toggles between date and time selectors', async () => {
      render(<Calendar enableTimeSelection />);
      
      const input = screen.getByPlaceholderText('Select date');
      fireEvent.click(input);
      
      await waitFor(() => {
        const timeButton = screen.getByText('Choose Time');
        fireEvent.click(timeButton);
      });

      await waitFor(() => {
        expect(screen.getByText('Time Select')).toBeInTheDocument();
      });
      
      const dateButton = screen.getByText(/Choose Date/);
      fireEvent.click(dateButton);
      
      await waitFor(() => {
        expect(screen.queryByText('Time Select')).not.toBeInTheDocument();
      });
    });

    it('confirms time selection', async () => {
      const onTimeChange = jest.fn();
      render(<Calendar enableTimeSelection onTimeChange={onTimeChange} />);
      
      const input = screen.getByPlaceholderText('Select date');
      fireEvent.click(input);
      
      await waitFor(() => {
        const timeButton = screen.getByText('Choose Time');
        fireEvent.click(timeButton);
      });

      await waitFor(() => {
        const confirmButton = screen.getByText('Confirm Time');
        fireEvent.click(confirmButton);
      });

      await waitFor(() => {
        expect(onTimeChange).toHaveBeenCalled();
      });
    });
  });

  describe('Time Format Toggle', () => {
    it('shows time format toggle when showTimeFormatToggle is true', async () => {
      render(<Calendar enableTimeSelection showTimeFormatToggle />);
      
      const input = screen.getByPlaceholderText('Select date');
      fireEvent.click(input);
      
      await waitFor(() => {
        const timeButton = screen.getByText('Choose Time');
        fireEvent.click(timeButton);
      });

      await waitFor(() => {
        expect(screen.getByText('12h')).toBeInTheDocument();
        expect(screen.getByText('24h')).toBeInTheDocument();
      });
    });

    it('toggles between 12h and 24h format', async () => {
      const onTimeFormatChange = jest.fn();
      render(
        <Calendar 
          enableTimeSelection 
          showTimeFormatToggle 
          onTimeFormatChange={onTimeFormatChange}
        />
      );
      
      const input = screen.getByPlaceholderText('Select date');
      fireEvent.click(input);
      
      await waitFor(() => {
        const timeButton = screen.getByText('Choose Time');
        fireEvent.click(timeButton);
      });

      await waitFor(() => {
        const toggle = screen.getByRole('switch');
        fireEvent.click(toggle);
      });

      await waitFor(() => {
        expect(onTimeFormatChange).toHaveBeenCalledWith('24h');
      });
    });
  });

  describe('Year Dropdown', () => {
    it('shows year dropdown when enableYearDropdown is true', async () => {
      render(<Calendar enableYearDropdown />);
      
      const input = screen.getByPlaceholderText('Select date');
      fireEvent.click(input);
      
      await waitFor(() => {
        const monthYearButton = screen.getByText(/January|February|March/);
        fireEvent.click(monthYearButton);
      });

      await waitFor(() => {
        // Check for multiple years to ensure dropdown is showing
        expect(screen.getByText('2023')).toBeInTheDocument();
        expect(screen.getByText('2024')).toBeInTheDocument();
        expect(screen.getByText('2025')).toBeInTheDocument();
      });
    });

    it('selects year from dropdown', async () => {
      const { container } = render(<Calendar enableYearDropdown />);
      
      const input = screen.getByPlaceholderText('Select date');
      fireEvent.click(input);
      
      await waitFor(() => {
        const monthYearButton = screen.getByText(/2026/);
        fireEvent.click(monthYearButton);
      });
      
      await waitFor(() => {
        // Find all elements with text 2025 and click the one in the dropdown
        const year2025Elements = screen.getAllByText('2025');
        const year2025InDropdown = year2025Elements.find(el => el.tagName === 'BUTTON');
        if (year2025InDropdown) {
          fireEvent.click(year2025InDropdown);
        }
      });

      await waitFor(() => {
        expect(screen.getByText(/2025/)).toBeInTheDocument();
      });
    });
  });

  describe('Blocked Dates', () => {
    // FIX 3: Use the correct year (2026) and month to match what's being rendered
    // it('blocks dates within specified range', async () => {
    //   const blockConfig = {
    //     startDate: { year: 2026, month: 1, day: 10 }, // February 2026
    //     days: 5 // Blocks Feb 10-14
    //   };
      
    //   render(<Calendar blockDateConfig={blockConfig} />);
      
    //   const input = screen.getByPlaceholderText('Select date');
    //   fireEvent.click(input);
      
    //   await waitFor(() => {
    //     const day12 = screen.getByText('12').closest('button');
    //     // Check if the button has disabled class or is not clickable
    //     expect(day12).toBeDisabled();
    //   });
    // });
    it('blocks dates within specified range', async () => {
  const blockConfig = {
    startDate: { year: 2026, month: 1, day: 10 }, // Feb 2026
    days: 5
  };

  const testDate = { year: 2026, month: 1, day: 1 };

  render(
    <Calendar
      value={testDate}
      blockDateConfig={blockConfig}
    />
  );

  const input = screen.getByPlaceholderText("Select date");
  fireEvent.click(input);

 expect(screen.getByText(/February\s+2026/)).toBeInTheDocument();

  const day12 = screen.getByText("12").closest("button");

  expect(day12).toBeDisabled();
});

    it('allows selection of unblocked dates', async () => {
      const onChange = jest.fn();
      const blockConfig = {
        startDate: { year: 2024, month: 0, day: 10 },
        days: 5
      };
      
      //render(<Calendar blockDateConfig={blockConfig} onChange={onChange} />);
      const testDate = { year: 2024, month: 0, day: 1 }; // Feb 2026

render(
  <Calendar
    value={testDate}
    blockDateConfig={blockConfig}
    onChange={onChange}
  />
);
      
      const input = screen.getByPlaceholderText('Select date');
      fireEvent.click(input);
      
      await waitFor(() => {
        const day20 = screen.getByText('20');
        fireEvent.click(day20);
        
        expect(onChange).toHaveBeenCalled();
      });
    });
  });

  describe('Date Format Selector', () => {
    it('shows date format selector when enabled', async () => {
      render(<Calendar enableTimeSelection showDateFormatSelector />);
      
      const input = screen.getByPlaceholderText('Select date');
      fireEvent.click(input);
      
      await waitFor(() => {
        const timeButton = screen.getByText('Choose Time');
        fireEvent.click(timeButton);
      });
      
      await waitFor(() => {
        expect(screen.getByText('Date Format')).toBeInTheDocument();
      });
    });

    it('changes date format', async () => {
      const onDateFormatChange = jest.fn();
      render(
        <Calendar 
          enableTimeSelection 
          showDateFormatSelector 
          onDateFormatChange={onDateFormatChange}
        />
      );
      
      const input = screen.getByPlaceholderText('Select date');
      fireEvent.click(input);
      
      await waitFor(() => {
        const timeButton = screen.getByText('Choose Time');
        fireEvent.click(timeButton);
      });
      
      await waitFor(() => {
        const formatSelects = screen.getAllByDisplayValue('none');
        const dateFormatSelect = formatSelects[0]; // First one should be date format
        fireEvent.change(dateFormatSelect, { target: { value: 'MM/DD/YYYY' } });
      });

      await waitFor(() => {
        expect(onDateFormatChange).toHaveBeenCalledWith('MM/DD/YYYY');
      });
    });
  });

  describe('Size Variants', () => {
    it('renders small size correctly', () => {
      const { container } = render(<Calendar size="small" />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders medium size correctly', () => {
      const { container } = render(<Calendar size="medium" />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders large size correctly', () => {
      const { container } = render(<Calendar size="large" />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders extra-large size correctly (default)', () => {
      const { container } = render(<Calendar size="extra-large" />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels for navigation buttons', async () => {
      render(<Calendar />);
      
      const input = screen.getByPlaceholderText('Select date');
      fireEvent.click(input);
      
      await waitFor(() => {
        const prevButton = screen.getByLabelText('Previous month');
        const nextButton = screen.getByLabelText('Next month');
        expect(prevButton).toBeInTheDocument();
        expect(nextButton).toBeInTheDocument();
      });
    });

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<Calendar />);
      
      const input = screen.getByPlaceholderText('Select date');
      await user.click(input);
      
      await waitFor(() => {
        expect(screen.getByText('Select Date & Time')).toBeInTheDocument();
      });
    });

    it('has role="switch" for time format toggle', async () => {
      render(<Calendar enableTimeSelection showTimeFormatToggle />);
      
      const input = screen.getByPlaceholderText('Select date');
      fireEvent.click(input);
      
      await waitFor(() => {
        const timeButton = screen.getByText('Choose Time');
        fireEvent.click(timeButton);
      });

      await waitFor(() => {
        expect(screen.getByRole('switch')).toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles null value gracefully', () => {
      render(<Calendar value={null} />);
      const input = screen.getByPlaceholderText('Select date') as HTMLInputElement;
      expect(input.value).toBe('');
    });

    it('handles undefined onChange gracefully', async () => {
      render(<Calendar />);
      
      const input = screen.getByPlaceholderText('Select date');
      fireEvent.click(input);
      
      await waitFor(() => {
        const day15 = screen.getByText('15');
        expect(() => fireEvent.click(day15)).not.toThrow();
      });
    });

    it('handles leap year correctly', async () => {
      const februaryDate: CalendarDate = { year: 2024, month: 1, day: 1 };
      render(<Calendar value={februaryDate} />);
      
      const input = screen.getByPlaceholderText('Select date');
      fireEvent.click(input);
      
      await waitFor(() => {
        expect(screen.getByText('29')).toBeInTheDocument();
      });
    });

    it('handles non-leap year February correctly', async () => {
      const februaryDate: CalendarDate = { year: 2026, month: 1, day: 1 };
      render(<Calendar value={februaryDate} />);
      
      const input = screen.getByPlaceholderText('Select date');
      fireEvent.click(input);
      
      await waitFor(() => {
        expect(screen.queryByText('29')).not.toBeInTheDocument();
        expect(screen.getByText('28')).toBeInTheDocument();
      });
    });
  });

  describe('Responsive Behavior', () => {
    it('adjusts scale based on window width', () => {
      global.innerWidth = 500;
      global.dispatchEvent(new Event('resize'));
      
      const { container } = render(<Calendar />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('positions dropdown above input when no space below', async () => {
      // Mock getBoundingClientRect
      const mockGetBoundingClientRect = jest.fn(() => ({
        bottom: window.innerHeight - 50,
        top: 600,
        left: 0,
        right: 400,
        width: 400,
        height: 40,
        x: 0,
        y: 600,
        toJSON: () => {}
      }));

      Object.defineProperty(HTMLElement.prototype, 'getBoundingClientRect', {
        value: mockGetBoundingClientRect
      });

      render(<Calendar />);
      
      const input = screen.getByPlaceholderText('Select date');
      fireEvent.click(input);
      
      await waitFor(() => {
        expect(screen.getByText('Select Date & Time')).toBeInTheDocument();
      });
    });
  });
});
