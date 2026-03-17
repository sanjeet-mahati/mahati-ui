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

  beforeEach(() => mockOnSelect.mockClear());

  // ─── Basic Rendering ──────────────────────────────────────────────────────

  describe('Basic Rendering', () => {
    it('should render dropdown button', () => {
      render(<Dropdown options={mockOptions} onSelect={mockOnSelect} />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render with default placeholder', () => {
      render(<Dropdown options={mockOptions} onSelect={mockOnSelect} />);
      expect(screen.getByText('Select an option')).toBeInTheDocument();
    });

    it('should render with custom placeholder', () => {
      render(<Dropdown options={mockOptions} onSelect={mockOnSelect} placeholder="Select option" />);
      expect(screen.getByText('Select option')).toBeInTheDocument();
    });

    it('should not show options on initial render', () => {
      render(<Dropdown options={mockOptions} onSelect={mockOnSelect} />);
      expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
    });

    it('should have correct displayName', () => {
      expect(Dropdown.displayName).toBe('Dropdown');
    });

    it('should render with empty options array', () => {
      render(<Dropdown options={[]} onSelect={mockOnSelect} />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  // ─── testId ───────────────────────────────────────────────────────────────

  describe('testId', () => {
    it('should apply testId to wrapper div', () => {
      render(<Dropdown options={mockOptions} onSelect={mockOnSelect} testId="my-dropdown" />);
      expect(screen.getByTestId('my-dropdown')).toBeInTheDocument();
    });

    it('should not set data-testid when not provided', () => {
      const { container } = render(<Dropdown options={mockOptions} onSelect={mockOnSelect} />);
      expect(container.querySelector('[data-testid]')).toBeNull();
    });
  });

  // ─── Open / Close ─────────────────────────────────────────────────────────

  describe('Open / Close', () => {
    it('should open menu when button clicked', () => {
      render(<Dropdown options={mockOptions} onSelect={mockOnSelect} />);
      fireEvent.click(screen.getByRole('button'));
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
      expect(screen.getByText('Option 3')).toBeInTheDocument();
    });

    it('should close menu when button clicked again', () => {
      render(<Dropdown options={mockOptions} onSelect={mockOnSelect} />);
      const btn = screen.getByRole('button');
      fireEvent.click(btn); // open
      fireEvent.click(btn); // close
      expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
    });

    it('should close menu after selecting an option', () => {
      render(<Dropdown options={mockOptions} onSelect={mockOnSelect} />);
      fireEvent.click(screen.getByRole('button'));
      fireEvent.click(screen.getByText('Option 1'));
      expect(screen.queryByText('Option 2')).not.toBeInTheDocument();
    });

    it('should close menu when clicking outside', () => {
      render(
        <div>
          <Dropdown options={mockOptions} onSelect={mockOnSelect} />
          <div data-testid="outside">Outside</div>
        </div>
      );
      fireEvent.click(screen.getByRole('button')); // open
      fireEvent.mouseDown(screen.getByTestId('outside')); // click outside
      expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
    });

    it('should render all options when open', () => {
      render(<Dropdown options={mockOptions} onSelect={mockOnSelect} />);
      fireEvent.click(screen.getByRole('button'));
      mockOptions.forEach(opt => {
        expect(screen.getByText(opt.key)).toBeInTheDocument();
      });
    });
  });

  // ─── Selection ────────────────────────────────────────────────────────────

  describe('Selection', () => {
    it('should call onSelect with correct value when option clicked', () => {
      render(<Dropdown options={mockOptions} onSelect={mockOnSelect} />);
      fireEvent.click(screen.getByRole('button'));
      fireEvent.click(screen.getByText('Option 2'));
      expect(mockOnSelect).toHaveBeenCalledWith(2);
    });

    it('should call onSelect with string value', () => {
      const stringOptions = [
        { key: 'Apple', value: 'apple' },
        { key: 'Banana', value: 'banana' },
      ];
      render(<Dropdown options={stringOptions} onSelect={mockOnSelect} />);
      fireEvent.click(screen.getByRole('button'));
      fireEvent.click(screen.getByText('Apple'));
      expect(mockOnSelect).toHaveBeenCalledWith('apple');
    });

    it('should call onSelect exactly once per selection', () => {
      render(<Dropdown options={mockOptions} onSelect={mockOnSelect} />);
      fireEvent.click(screen.getByRole('button'));
      fireEvent.click(screen.getByText('Option 1'));
      expect(mockOnSelect).toHaveBeenCalledTimes(1);
    });

    it('should display selected option key in button (uncontrolled)', () => {
      render(<Dropdown options={mockOptions} onSelect={mockOnSelect} />);
      fireEvent.click(screen.getByRole('button'));
      fireEvent.click(screen.getByText('Option 3'));
      expect(screen.getByRole('button')).toHaveTextContent('Option 3');
    });

    it('should display controlled value in button', () => {
      render(<Dropdown options={mockOptions} onSelect={mockOnSelect} value={2} />);
      expect(screen.getByRole('button')).toHaveTextContent('Option 2');
    });

    it('should show placeholder when controlled value not in options', () => {
      render(<Dropdown options={mockOptions} onSelect={mockOnSelect} value={999} placeholder="Pick one" />);
      expect(screen.getByRole('button')).toHaveTextContent('Pick one');
    });

    it('should allow selecting different options sequentially (uncontrolled)', () => {
      render(<Dropdown options={mockOptions} onSelect={mockOnSelect} />);
      // Select option 1
      fireEvent.click(screen.getByRole('button'));
      fireEvent.click(screen.getByText('Option 1'));
      expect(screen.getByRole('button')).toHaveTextContent('Option 1');
      // Select option 3
      fireEvent.click(screen.getByRole('button'));
      fireEvent.click(screen.getByText('Option 3'));
      expect(screen.getByRole('button')).toHaveTextContent('Option 3');
    });
  });

  // ─── Disabled ─────────────────────────────────────────────────────────────

  describe('Disabled', () => {
    it('should render button as disabled', () => {
      render(<Dropdown options={mockOptions} onSelect={mockOnSelect} disabled />);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should not open menu when disabled', () => {
      render(<Dropdown options={mockOptions} onSelect={mockOnSelect} disabled />);
      fireEvent.click(screen.getByRole('button'));
      expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
    });

    it('should not call onSelect when disabled', () => {
      render(<Dropdown options={mockOptions} onSelect={mockOnSelect} disabled />);
      fireEvent.click(screen.getByRole('button'));
      expect(mockOnSelect).not.toHaveBeenCalled();
    });

    it('should apply disabled classes', () => {
      render(<Dropdown options={mockOptions} onSelect={mockOnSelect} disabled />);
      expect(screen.getByRole('button').className).toMatch(/cursor-not-allowed/);
    });

    it('should apply opacity-50 when disabled', () => {
      render(<Dropdown options={mockOptions} onSelect={mockOnSelect} disabled />);
      expect(screen.getByRole('button').className).toMatch(/opacity-50/);
    });
  });

  // ─── Variants ────────────────────────────────────────────────────────────

  describe('Variants', () => {
    const variants = ['basic', 'outline', 'pill', 'dark', 'underline', 'shadow', 'glass', 'gradient'] as const;

    variants.forEach(variant => {
      it(`should render ${variant} variant`, () => {
        const { unmount } = render(
          <Dropdown options={mockOptions} onSelect={mockOnSelect} variant={variant} />
        );
        expect(screen.getByRole('button')).toBeInTheDocument();
        unmount();
      });
    });

    it('should apply basic variant blue background', () => {
      render(<Dropdown options={mockOptions} onSelect={mockOnSelect} variant="basic" />);
      expect(screen.getByRole('button').className).toMatch(/bg-\[#2563eb\]/);
    });

    it('should apply dark variant dark background', () => {
      render(<Dropdown options={mockOptions} onSelect={mockOnSelect} variant="dark" />);
      expect(screen.getByRole('button').className).toMatch(/bg-\[#1f2937\]/);
    });

    it('should apply pill variant rounded-full', () => {
      render(<Dropdown options={mockOptions} onSelect={mockOnSelect} variant="pill" />);
      expect(screen.getByRole('button').className).toMatch(/rounded-full/);
    });

    it('should default to basic variant when not specified', () => {
      render(<Dropdown options={mockOptions} onSelect={mockOnSelect} />);
      expect(screen.getByRole('button').className).toMatch(/bg-\[#2563eb\]/);
    });

    it('should show glass-style dropdown list when glass variant open', () => {
      render(<Dropdown options={mockOptions} onSelect={mockOnSelect} variant="glass" />);
      fireEvent.click(screen.getByRole('button'));
      expect(screen.getByText('Option 1')).toBeInTheDocument();
    });
  });

  // ─── className ────────────────────────────────────────────────────────────

  describe('className', () => {
    it('should apply custom className to wrapper', () => {
      const { container } = render(
        <Dropdown options={mockOptions} onSelect={mockOnSelect} className="custom-class" />
      );
      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('should keep default classes alongside custom className', () => {
      const { container } = render(
        <Dropdown options={mockOptions} onSelect={mockOnSelect} className="custom-class" />
      );
      expect(container.firstChild).toHaveClass('relative');
      expect(container.firstChild).toHaveClass('custom-class');
    });
  });

  // ─── Controlled vs Uncontrolled ──────────────────────────────────────────

  describe('Controlled vs Uncontrolled', () => {
    it('should use value prop when provided (controlled)', () => {
      const { rerender } = render(
        <Dropdown options={mockOptions} onSelect={mockOnSelect} value={1} />
      );
      expect(screen.getByRole('button')).toHaveTextContent('Option 1');

      rerender(<Dropdown options={mockOptions} onSelect={mockOnSelect} value={3} />);
      expect(screen.getByRole('button')).toHaveTextContent('Option 3');
    });

    it('should use internal state when value not provided (uncontrolled)', () => {
      render(<Dropdown options={mockOptions} onSelect={mockOnSelect} />);
      fireEvent.click(screen.getByRole('button'));
      fireEvent.click(screen.getByText('Option 2'));
      expect(screen.getByRole('button')).toHaveTextContent('Option 2');
    });

    it('should not update internal state when controlled (value provided)', () => {
      render(<Dropdown options={mockOptions} onSelect={mockOnSelect} value={1} />);
      fireEvent.click(screen.getByRole('button'));
      fireEvent.click(screen.getByText('Option 2'));
      // controlled — button still shows value=1 (Option 1) since parent controls it
      expect(screen.getByRole('button')).toHaveTextContent('Option 1');
    });
  });

  // ─── Edge Cases ──────────────────────────────────────────────────────────

  describe('Edge Cases', () => {
    it('should handle options with string values', () => {
      const strOptions = [
        { key: 'Alpha', value: 'alpha' },
        { key: 'Beta', value: 'beta' },
      ];
      render(<Dropdown options={strOptions} onSelect={mockOnSelect} />);
      fireEvent.click(screen.getByRole('button'));
      expect(screen.getByText('Alpha')).toBeInTheDocument();
    });

    it('should handle single option', () => {
      render(<Dropdown options={[{ key: 'Only', value: 1 }]} onSelect={mockOnSelect} />);
      fireEvent.click(screen.getByRole('button'));
      fireEvent.click(screen.getByText('Only'));
      expect(mockOnSelect).toHaveBeenCalledWith(1);
    });

    it('should handle many options', () => {
      const manyOptions = Array.from({ length: 20 }, (_, i) => ({
        key: `Item ${i + 1}`, value: i + 1,
      }));
      render(<Dropdown options={manyOptions} onSelect={mockOnSelect} />);
      fireEvent.click(screen.getByRole('button'));
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 20')).toBeInTheDocument();
    });

    it('should handle options with special characters in key', () => {
      const specialOptions = [{ key: '<Option & "Test">', value: 1 }];
      render(<Dropdown options={specialOptions} onSelect={mockOnSelect} />);
      fireEvent.click(screen.getByRole('button'));
      expect(screen.getByText('<Option & "Test">')).toBeInTheDocument();
    });
  });
});