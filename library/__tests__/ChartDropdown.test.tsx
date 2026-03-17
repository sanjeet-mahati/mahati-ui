import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ChartDropdown } from '../src/components/ChartDropdown';

// ─── RENDER ──────────────────────────────────────────────────────────────────

describe('ChartDropdown — Render', () => {
  const mockOptions = [
    { key: 'Option 1', value: '1' },
    { key: 'Option 2', value: '2' },
  ];

  it('renders trigger button', () => {
    render(<ChartDropdown options={mockOptions} onSelect={() => {}} testId="dropdown" />);
    expect(screen.getByTestId('dropdown')).toBeInTheDocument();
  });

  it('renders label when provided', () => {
    render(<ChartDropdown options={mockOptions} label="Select Type" onSelect={() => {}} />);
    expect(screen.getByText('Select Type')).toBeInTheDocument();
  });

  it('renders without label', () => {
    render(<ChartDropdown options={mockOptions} onSelect={() => {}} />);
    expect(screen.queryByText(/select type/i)).not.toBeInTheDocument();
  });

  it('renders with empty options array', () => {
    render(<ChartDropdown options={[]} onSelect={() => {}} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('renders long option text', () => {
    const longOption = { key: 'A'.repeat(100), value: 'long' };
    render(<ChartDropdown options={[longOption]} onSelect={() => {}} />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText(longOption.key)).toBeInTheDocument();
  });

  it('has correct displayName', () => {
    expect(ChartDropdown.displayName).toBe('ChartDropdown');
  });
});

// ─── DEFAULT STATE ───────────────────────────────────────────────────────────

describe('ChartDropdown — Default State', () => {
  const mockOptions = [
    { key: 'Option 1', value: '1' },
    { key: 'Option 2', value: '2' },
  ];

  it('dropdown is closed by default', () => {
    render(<ChartDropdown options={mockOptions} onSelect={() => {}} />);
    expect(screen.queryAllByRole('option')).toHaveLength(0);
  });

  it('shows "Select..." when no value selected', () => {
    render(<ChartDropdown options={mockOptions} onSelect={() => {}} />);
    expect(screen.getByText('Select...')).toBeInTheDocument();
  });

  it('shows selected option key when value matches', () => {
    render(<ChartDropdown options={mockOptions} value="1" onSelect={() => {}} />);
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.queryByText('Select...')).not.toBeInTheDocument();
  });
});

// ─── TOGGLE BEHAVIOR ────────────────────────────────────────────────────────

describe('ChartDropdown — Toggle', () => {
  const mockOptions = [
    { key: 'Option 1', value: '1' },
    { key: 'Option 2', value: '2' },
  ];
  const mockOnSelect = jest.fn();

  it('opens dropdown on first button click', async () => {
    render(<ChartDropdown options={mockOptions} onSelect={mockOnSelect} testId="dropdown" />);
    fireEvent.click(screen.getByRole('button'));
    await waitFor(() => {
      expect(screen.getAllByRole('option')).toHaveLength(2);
    });
  });

  it('closes dropdown on second button click', async () => {
    render(<ChartDropdown options={mockOptions} onSelect={mockOnSelect} />);
    fireEvent.click(screen.getByRole('button'));
    await waitFor(() => expect(screen.getAllByRole('option')).toHaveLength(2));
    
    fireEvent.click(screen.getByRole('button'));
    await waitFor(() => {
      expect(screen.queryAllByRole('option')).toHaveLength(0);
    });
  });

  it('toggles multiple times correctly', async () => {
    render(<ChartDropdown options={mockOptions} onSelect={mockOnSelect} />);
    const button = screen.getByRole('button');
    
    for (let i = 0; i < 4; i++) {
      fireEvent.click(button);
      if (i % 2 === 0) {
        await waitFor(() => expect(screen.getAllByRole('option')).toHaveLength(2));
      } else {
        await waitFor(() => expect(screen.queryAllByRole('option')).toHaveLength(0));
      }
    }
  });
});

// ─── SELECTION ──────────────────────────────────────────────────────────────

describe('ChartDropdown — Selection', () => {
  const mockOptions = [
    { key: 'Option 1', value: '1' },
    { key: 'Option 2', value: '2' },
  ];
  const mockOnSelect = jest.fn();

  it('calls onSelect with option value on selection', async () => {
    render(<ChartDropdown options={mockOptions} onSelect={mockOnSelect} />);
    
    fireEvent.click(screen.getByRole('button'));
    await waitFor(() => expect(screen.getAllByRole('option')).toHaveLength(2));
    
    fireEvent.click(screen.getAllByRole('option')[0]);
    expect(mockOnSelect).toHaveBeenCalledWith('1');
  });

  it('closes dropdown after selection', async () => {
    render(<ChartDropdown options={mockOptions} onSelect={mockOnSelect} />);
    
    fireEvent.click(screen.getByRole('button'));
    await waitFor(() => expect(screen.getAllByRole('option')).toHaveLength(2));
    
    fireEvent.click(screen.getAllByRole('option')[0]);
    await waitFor(() => {
      expect(screen.queryAllByRole('option')).toHaveLength(0);
    });
  });

  it('updates button text after selection', async () => {
    render(<ChartDropdown options={mockOptions} onSelect={() => {}} />);
    
    fireEvent.click(screen.getByRole('button'));
    await waitFor(() => expect(screen.getAllByRole('option')).toHaveLength(2));
    
    fireEvent.click(screen.getAllByRole('option')[1]);
    await waitFor(() => {
      expect(screen.getByText('Option 2')).toBeInTheDocument();
    });
  });
});

// ─── TEST IDS ───────────────────────────────────────────────────────────────

describe('ChartDropdown — TestIds', () => {
  const mockOptions = [{ key: 'Test', value: '1' }];

  it('applies testId to root container', () => {
    render(<ChartDropdown options={mockOptions} onSelect={() => {}} testId="dropdown-test" />);
    expect(screen.getByTestId('dropdown-test')).toBeInTheDocument();
  });
});

// ─── VARIANTS ───────────────────────────────────────────────────────────────

describe('ChartDropdown — Variants', () => {
  const mockOptions = [{ key: 'Test', value: '1' }];

  it('applies mahatiFilter variant classes', () => {
    render(<ChartDropdown options={mockOptions} variant="mahatiFilter" onSelect={() => {}} testId="mahati" />);
    const button = screen.getByTestId('mahati').querySelector('button');
    expect(button).toHaveClass('w-[130px]');
    expect(button).toHaveClass('h-[30px]');
  });

  it('applies basic variant classes', () => {
    render(<ChartDropdown options={mockOptions} variant="basic" onSelect={() => {}} testId="basic" />);
    const button = screen.getByTestId('basic').querySelector('button');
    expect(button).toHaveClass('bg-[rgba(37,99,235,1)]');
  });
});

// ─── CLICK OUTSIDE ─────────────────────────────────────────────────────────

describe('ChartDropdown — Click Outside', () => {
  const mockOptions = [{ key: 'Test', value: '1' }];
  const mockOnSelect = jest.fn();

  it('closes dropdown when clicking outside', async () => {
    render(
      <>
        <ChartDropdown options={mockOptions} onSelect={mockOnSelect} testId="dropdown" />
        <div data-testid="outside">Outside Click</div>
      </>
    );
    
    fireEvent.click(screen.getByRole('button'));
    await waitFor(() => expect(screen.getAllByRole('option')).toHaveLength(1));
    
    fireEvent.mouseDown(screen.getByTestId('outside'));
    await waitFor(() => {
      expect(screen.queryAllByRole('option')).toHaveLength(0);
    });
  });
});

// ─── ACCESSIBILITY ──────────────────────────────────────────────────────────

describe('ChartDropdown — Accessibility', () => {
  const mockOptions = [{ key: 'Test', value: '1' }];

  it('button has correct ARIA attributes', async () => {
    render(<ChartDropdown options={mockOptions} onSelect={() => {}} testId="acc" />);
    const button = screen.getByTestId('acc').querySelector('button')!;
    
    expect(button).toHaveAttribute('aria-haspopup', 'listbox');
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('options have correct ARIA roles', async () => {
    render(<ChartDropdown options={mockOptions} onSelect={() => {}} />);
    
    fireEvent.click(screen.getByRole('button'));
    await waitFor(() => {
      const options = screen.getAllByRole('option');
      expect(options[0]).toHaveAttribute('role', 'option');
    });
  });

  it('button is keyboard accessible with Enter', async () => {
    render(<ChartDropdown options={mockOptions} onSelect={() => {}} />);
    const button = screen.getByRole('button');
    
    fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });
    await waitFor(() => expect(screen.getAllByRole('option')).toHaveLength(1));
  });
});
