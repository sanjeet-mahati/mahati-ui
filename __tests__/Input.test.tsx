import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Input } from '../src/components/Input';

describe('Input', () => {
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
  });

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
      const input = document.querySelector('input[type="password"]');
      expect(input).toBeInTheDocument();
    });

    it('should render number input', () => {
      render(<Input type="number" />);
      const input = document.querySelector('input[type="number"]');
      expect(input).toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('should show error message when hasError is true', () => {
      render(<Input hasError errorMessage="This field is required" />);
      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });

    it('should not show error message when hasError is false', () => {
      render(<Input hasError={false} errorMessage="Error message" />);
      expect(screen.queryByText('Error message')).not.toBeInTheDocument();
    });

    it('should not show error message when errorMessage is empty', () => {
      const { container } = render(<Input hasError errorMessage="" />);
      const errorSpan = container.querySelector('span');
      expect(errorSpan).not.toBeInTheDocument();
    });
  });

  describe('Dimensions', () => {
    it('should have width of 100%', () => {
      const { container } = render(<Input />);
      const input = container.querySelector('input');
      expect(input).toHaveStyle({ width: '100%' });
    });

    it('should have height of 44px', () => {
      const { container } = render(<Input />);
      const input = container.querySelector('input');
      expect(input).toHaveStyle({ height: '44px' });
    });
  });

  describe('User Interactions', () => {
    it('should handle onChange event', () => {
      const handleChange = jest.fn();
      render(<Input onChange={handleChange} />);
      
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'New value' } });
      
      expect(handleChange).toHaveBeenCalled();
    });

    it('should handle onFocus event', () => {
      const handleFocus = jest.fn();
      render(<Input onFocus={handleFocus} />);
      
      const input = screen.getByRole('textbox');
      fireEvent.focus(input);
      
      expect(handleFocus).toHaveBeenCalled();
    });

    it('should handle onBlur event', () => {
      const handleBlur = jest.fn();
      render(<Input onBlur={handleBlur} />);
      
      const input = screen.getByRole('textbox');
      fireEvent.blur(input);
      
      expect(handleBlur).toHaveBeenCalled();
    });
  });

  describe('Disabled State', () => {
    it('should render disabled input', () => {
      render(<Input disabled />);
      expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('should not trigger onChange when disabled', () => {
      const handleChange = jest.fn();
      render(<Input disabled onChange={handleChange} />);
      
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'Test' } });
      
      expect(handleChange).not.toHaveBeenCalled();
    });
  });

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
  });

  describe('Display Name', () => {
    it('should have correct display name', () => {
      expect(Input.displayName).toBe('Input');
    });
  });

  describe('HTML Attributes', () => {
    it('should accept custom className', () => {
      render(<Input className="custom-class" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('custom-class');
    });

    it('should accept id attribute', () => {
      render(<Input id="test-input" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('id', 'test-input');
    });

    it('should accept name attribute', () => {
      render(<Input name="email" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('name', 'email');
    });
  });
});
