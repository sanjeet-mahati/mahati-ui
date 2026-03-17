import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Input } from '../src/components/Input';

describe('Input', () => {

  // ─── Basic Rendering ──────────────────────────────────────────────────────

  describe('Basic Rendering', () => {
    it('should render input element', () => {
      render(<Input />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should render with placeholder', () => {
      render(<Input placeholder="Enter text" />);
      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    });

    it('should render with value', () => {
      render(<Input value="Test value" onChange={() => {}} />);
      expect(screen.getByRole('textbox')).toHaveValue('Test value');
    });

    it('should render inside a div wrapper', () => {
      const { container } = render(<Input />);
      expect(container.querySelector('div')).toBeInTheDocument();
      expect(container.querySelector('input')).toBeInTheDocument();
    });

    it('should have correct displayName', () => {
      expect(Input.displayName).toBe('Input');
    });
  });

  // ─── testId ───────────────────────────────────────────────────────────────

  describe('testId', () => {
    it('should apply testId to wrapper div', () => {
      render(<Input testId="my-input" />);
      expect(screen.getByTestId('my-input')).toBeInTheDocument();
    });

    it('should apply testId-input to input element', () => {
      render(<Input testId="my-input" />);
      expect(screen.getByTestId('my-input-input')).toBeInTheDocument();
    });

    it('should apply testId-error to error span when error shown', () => {
      render(<Input testId="my-input" hasError errorMessage="Error!" />);
      expect(screen.getByTestId('my-input-error')).toBeInTheDocument();
    });

    it('should not set data-testid when not provided', () => {
      const { container } = render(<Input />);
      expect(container.querySelector('[data-testid]')).toBeNull();
    });
  });

  // ─── Input Types ──────────────────────────────────────────────────────────

  describe('Input Types', () => {
    it('should render text input', () => {
      render(<Input type="text" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text');
    });

    it('should render email input', () => {
      render(<Input type="email" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');
    });

    it('should render password input', () => {
      render(<Input type="password" />);
      expect(document.querySelector('input[type="password"]')).toBeInTheDocument();
    });

    it('should render number input', () => {
      render(<Input type="number" />);
      expect(document.querySelector('input[type="number"]')).toBeInTheDocument();
    });

    it('should render search input', () => {
      render(<Input type="search" />);
      expect(document.querySelector('input[type="search"]')).toBeInTheDocument();
    });

    it('should render file input', () => {
      render(<Input type="file" />);
      expect(document.querySelector('input[type="file"]')).toBeInTheDocument();
    });
  });

  // ─── Error State ──────────────────────────────────────────────────────────

  describe('Error State', () => {
    it('should show error message when hasError=true and errorMessage provided', () => {
      render(<Input hasError errorMessage="This field is required" />);
      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });

    it('should not show error message when hasError=false', () => {
      render(<Input hasError={false} errorMessage="Error message" />);
      expect(screen.queryByText('Error message')).not.toBeInTheDocument();
    });

    it('should not show error span when errorMessage is empty string', () => {
      const { container } = render(<Input hasError errorMessage="" />);
      expect(container.querySelector('span')).not.toBeInTheDocument();
    });

    it('should not show error span when hasError=false even with errorMessage', () => {
      const { container } = render(<Input hasError={false} errorMessage="Some error" />);
      expect(container.querySelector('span')).not.toBeInTheDocument();
    });

    it('should apply red border class when hasError=true', () => {
      const { container } = render(<Input hasError />);
      expect(container.querySelector('input')?.className).toMatch(/border-red-500/);
    });

    it('should apply default border class when hasError=false', () => {
      const { container } = render(<Input />);
      expect(container.querySelector('input')?.className).toMatch(/border-\[#D9D9D9\]/);
    });

    it('should show error span with correct text color class', () => {
      render(<Input hasError errorMessage="Oops" />);
      const span = screen.getByText('Oops');
      expect(span.className).toMatch(/text-red-500/);
    });
  });

  // ─── Dimensions (Tailwind classes, not inline styles) ─────────────────────

  describe('Dimensions', () => {
    it('should have h-[44px] class', () => {
      const { container } = render(<Input />);
      expect(container.querySelector('input')?.className).toMatch(/h-\[44px\]/);
    });

    it('should have w-full class', () => {
      const { container } = render(<Input />);
      expect(container.querySelector('input')?.className).toMatch(/w-full/);
    });

    it('should have rounded-md class', () => {
      const { container } = render(<Input />);
      expect(container.querySelector('input')?.className).toMatch(/rounded-md/);
    });
  });

  // ─── User Interactions ────────────────────────────────────────────────────

  describe('User Interactions', () => {
    it('should handle onChange event', () => {
      const handleChange = jest.fn();
      render(<Input onChange={handleChange} />);
      fireEvent.change(screen.getByRole('textbox'), { target: { value: 'New value' } });
      expect(handleChange).toHaveBeenCalled();
    });

    it('should pass new value to onChange handler', () => {
      const handleChange = jest.fn();
      render(<Input onChange={handleChange} />);
      fireEvent.change(screen.getByRole('textbox'), { target: { value: 'hello' } });
      expect(handleChange).toHaveBeenCalledWith(expect.objectContaining({
        target: expect.objectContaining({ value: 'hello' }),
      }));
    });

    it('should handle onFocus event', () => {
      const handleFocus = jest.fn();
      render(<Input onFocus={handleFocus} />);
      fireEvent.focus(screen.getByRole('textbox'));
      expect(handleFocus).toHaveBeenCalled();
    });

    it('should handle onBlur event', () => {
      const handleBlur = jest.fn();
      render(<Input onBlur={handleBlur} />);
      fireEvent.blur(screen.getByRole('textbox'));
      expect(handleBlur).toHaveBeenCalled();
    });

    it('should handle onKeyDown event', () => {
      const handleKeyDown = jest.fn();
      render(<Input onKeyDown={handleKeyDown} />);
      fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter' });
      expect(handleKeyDown).toHaveBeenCalled();
    });

    it('should update displayed value on change', () => {
      const TestComponent = () => {
        const [val, setVal] = React.useState('');
        return <Input value={val} onChange={(e) => setVal(e.target.value)} />;
      };
      render(<TestComponent />);
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'typed text' } });
      expect(input).toHaveValue('typed text');
    });
  });

  // ─── Disabled State ───────────────────────────────────────────────────────

  describe('Disabled State', () => {
    it('should render disabled input', () => {
      render(<Input disabled />);
      expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('should have disabled attribute', () => {
      render(<Input disabled />);
      expect(screen.getByRole('textbox')).toHaveAttribute('disabled');
    });

    it('should not call onChange when disabled and fireEvent.change fired', () => {
      const handleChange = jest.fn();
      render(<Input disabled onChange={handleChange} />);
      // The component's handleChange checks disabled and skips calling onChange
      fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Test' } });
      expect(handleChange).not.toHaveBeenCalled();
    });

    it('should apply disabled Tailwind classes', () => {
      const { container } = render(<Input disabled />);
      expect(container.querySelector('input')?.className).toMatch(/disabled:bg-gray-100/);
      expect(container.querySelector('input')?.className).toMatch(/disabled:cursor-not-allowed/);
    });
  });

  // ─── className ────────────────────────────────────────────────────────────

  describe('className', () => {
    it('should apply custom className to input', () => {
      render(<Input className="custom-class" />);
      expect(screen.getByRole('textbox')).toHaveClass('custom-class');
    });

    it('should keep default classes alongside custom className', () => {
      render(<Input className="custom-class" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('custom-class');
      expect(input.className).toMatch(/rounded-md/);
    });
  });

  // ─── HTML Attributes ──────────────────────────────────────────────────────

  describe('HTML Attributes', () => {
    it('should accept id attribute', () => {
      render(<Input id="test-input" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('id', 'test-input');
    });

    it('should accept name attribute', () => {
      render(<Input name="email" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('name', 'email');
    });

    it('should accept maxLength attribute', () => {
      render(<Input maxLength={50} />);
      expect(screen.getByRole('textbox')).toHaveAttribute('maxlength', '50');
    });

    it('should accept required attribute', () => {
      render(<Input required />);
      expect(screen.getByRole('textbox')).toBeRequired();
    });

    it('should accept autoComplete attribute', () => {
      render(<Input autoComplete="email" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('autocomplete', 'email');
    });

    it('should accept aria-label', () => {
      render(<Input aria-label="Email address" />);
      expect(screen.getByRole('textbox', { name: 'Email address' })).toBeInTheDocument();
    });

    it('should accept tabIndex', () => {
      render(<Input tabIndex={0} />);
      expect(screen.getByRole('textbox')).toHaveAttribute('tabindex', '0');
    });
  });

  // ─── Accessibility ────────────────────────────────────────────────────────

  describe('Accessibility', () => {
    it('should have textbox role', () => {
      render(<Input />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should support keyboard focus', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      input.focus();
      expect(input).toHaveFocus();
    });

    it('should not be focusable when disabled', () => {
      render(<Input disabled />);
      // disabled inputs can't receive focus via keyboard
      expect(screen.getByRole('textbox')).toBeDisabled();
    });
  });

  // ─── Ref Forwarding ───────────────────────────────────────────────────────

  describe('Ref Forwarding', () => {
    it('should forward ref to input element', () => {
      const ref = React.createRef<HTMLInputElement>();
      render(<Input ref={ref} />);
      expect(ref.current).not.toBeNull();
      expect(ref.current?.tagName).toBe('INPUT');
    });

    it('should allow imperative focus via ref', () => {
      const ref = React.createRef<HTMLInputElement>();
      render(<Input ref={ref} />);
      ref.current?.focus();
      expect(screen.getByRole('textbox')).toHaveFocus();
    });
  });
});