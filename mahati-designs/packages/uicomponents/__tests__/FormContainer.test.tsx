import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FormContainer } from '../src/components/FormContainer';

describe('FormContainer', () => {
  it('should render children correctly', () => {
    render(
      <FormContainer>
        <div data-testid="test-child">Test Content</div>
      </FormContainer>
    );
    
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should render as a form element', () => {
    const { container } = render(
      <FormContainer>
        <input type="text" />
      </FormContainer>
    );
    
    const form = container.querySelector('form');
    expect(form).toBeInTheDocument();
  });

  it('should call onSubmit when form is submitted', () => {
    const mockOnSubmit = jest.fn((e) => e.preventDefault());
    
    render(
      <FormContainer onSubmit={mockOnSubmit}>
        <button type="submit">Submit</button>
      </FormContainer>
    );
    
    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);
    
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });

  it('should prevent default form submission when onSubmit provided', () => {
    const mockOnSubmit = jest.fn((e) => e.preventDefault());
    
    const { container } = render(
      <FormContainer onSubmit={mockOnSubmit}>
        <button type="submit">Submit</button>
      </FormContainer>
    );
    
    const form = container.querySelector('form');
    fireEvent.submit(form!);
    
    expect(mockOnSubmit).toHaveBeenCalled();
  });

  it('should apply custom className', () => {
    const { container } = render(
      <FormContainer className="custom-form">
        <div>Content</div>
      </FormContainer>
    );
    
    const form = container.querySelector('form');
    expect(form).toHaveClass('custom-form');
  });

  it('should work without onSubmit prop', () => {
    const { container } = render(
      <FormContainer>
        <input type="text" />
      </FormContainer>
    );
    
    const form = container.querySelector('form');
    expect(form).toBeInTheDocument();
    
    // Should not throw error when submitting without onSubmit
    expect(() => fireEvent.submit(form!)).not.toThrow();
  });

  it('should render multiple children', () => {
    render(
      <FormContainer>
        <input data-testid="input-1" type="text" />
        <input data-testid="input-2" type="email" />
        <button data-testid="button-1">Submit</button>
      </FormContainer>
    );
    
    expect(screen.getByTestId('input-1')).toBeInTheDocument();
    expect(screen.getByTestId('input-2')).toBeInTheDocument();
    expect(screen.getByTestId('button-1')).toBeInTheDocument();
  });

  it('should have correct display name', () => {
    expect(FormContainer.displayName).toBe('FormContainer');
  });

  it('should apply styled-components styles', () => {
    const { container } = render(
      <FormContainer>
        <div>Content</div>
      </FormContainer>
    );
    
    const form = container.querySelector('form');
    expect(form).toHaveAttribute('class');
    
    // Check that emotion/styled-components classes are applied
    const className = form?.className || '';
    expect(className).toMatch(/css-/);
  });

  it('should handle form with multiple input types', () => {
    render(
      <FormContainer>
        <input type="text" data-testid="text-input" />
        <input type="email" data-testid="email-input" />
        <input type="password" data-testid="password-input" />
        <input type="checkbox" data-testid="checkbox-input" />
        <input type="radio" data-testid="radio-input" />
        <input type="file" data-testid="file-input" />
      </FormContainer>
    );
    
    expect(screen.getByTestId('text-input')).toBeInTheDocument();
    expect(screen.getByTestId('email-input')).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
    expect(screen.getByTestId('checkbox-input')).toBeInTheDocument();
    expect(screen.getByTestId('radio-input')).toBeInTheDocument();
    expect(screen.getByTestId('file-input')).toBeInTheDocument();
  });

  it('should pass form event to onSubmit handler', () => {
    let capturedEvent: React.FormEvent | null = null;
    const mockOnSubmit = jest.fn((e: React.FormEvent) => {
      e.preventDefault();
      capturedEvent = e;
    });
    
    const { container } = render(
      <FormContainer onSubmit={mockOnSubmit}>
        <button type="submit">Submit</button>
      </FormContainer>
    );
    
    const form = container.querySelector('form');
    fireEvent.submit(form!);
    
    expect(mockOnSubmit).toHaveBeenCalled();
    expect(capturedEvent).toBeTruthy();
    expect(capturedEvent?.type).toBe('submit');
  });

  it('should render with nested form elements', () => {
    render(
      <FormContainer>
        <div>
          <label htmlFor="name">Name</label>
          <input id="name" type="text" />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" />
        </div>
        <button type="submit">Submit</button>
      </FormContainer>
    );
    
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('should handle complex form submission with validation', () => {
    const mockOnSubmit = jest.fn((e: React.FormEvent) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget as HTMLFormElement);
      const name = formData.get('name');
      const email = formData.get('email');
      
      expect(name).toBeTruthy();
      expect(email).toBeTruthy();
    });
    
    render(
      <FormContainer onSubmit={mockOnSubmit}>
        <input name="name" defaultValue="John Doe" />
        <input name="email" type="email" defaultValue="john@example.com" />
        <button type="submit">Submit</button>
      </FormContainer>
    );
    
    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);
    
    expect(mockOnSubmit).toHaveBeenCalled();
  });

  it('should render empty form without errors', () => {
    const { container } = render(<FormContainer>{null}</FormContainer>);
    
    const form = container.querySelector('form');
    expect(form).toBeInTheDocument();
    expect(form?.children.length).toBe(0);
  });

  it('should handle form reset', () => {
    const { container } = render(
      <FormContainer>
        <input name="name" defaultValue="John Doe" data-testid="name-input" />
        <button type="reset" data-testid="reset-button">Reset</button>
      </FormContainer>
    );
    
    const input = screen.getByTestId('name-input') as HTMLInputElement;
    const resetButton = screen.getByTestId('reset-button');
    
    // Change input value
    fireEvent.change(input, { target: { value: 'Jane Doe' } });
    expect(input.value).toBe('Jane Doe');
    
    // Reset form
    fireEvent.click(resetButton);
    
    // Value should be reset to default
    expect(input.value).toBe('John Doe');
  });

  it('should support form accessibility attributes', () => {
    const { container } = render(
      <FormContainer>
        <label htmlFor="test-input">Test Label</label>
        <input 
          id="test-input" 
          type="text"
          aria-label="Test Input"
          aria-required="true"
        />
      </FormContainer>
    );
    
    const input = screen.getByLabelText('Test Label');
    expect(input).toHaveAttribute('aria-label', 'Test Input');
    expect(input).toHaveAttribute('aria-required', 'true');
  });

  it('should apply default className as empty string when not provided', () => {
    const { container } = render(
      <FormContainer>
        <div>Content</div>
      </FormContainer>
    );
    
    const form = container.querySelector('form');
    // Should have emotion class but custom className should be handled
    expect(form).toHaveAttribute('class');
  });

  it('should render with controlled inputs', () => {
    const TestComponent = () => {
      const [value, setValue] = React.useState('');
      
      return (
        <FormContainer>
          <input 
            data-testid="controlled-input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </FormContainer>
      );
    };
    
    render(<TestComponent />);
    
    const input = screen.getByTestId('controlled-input') as HTMLInputElement;
    
    fireEvent.change(input, { target: { value: 'test value' } });
    expect(input.value).toBe('test value');
  });

  it('should handle form with button types correctly', () => {
    const mockOnSubmit = jest.fn((e) => e.preventDefault());
    
    render(
      <FormContainer onSubmit={mockOnSubmit}>
        <button type="button" data-testid="regular-button">Regular</button>
        <button type="submit" data-testid="submit-button">Submit</button>
        <button type="reset" data-testid="reset-button">Reset</button>
      </FormContainer>
    );
    
    // Clicking regular button should not submit
    fireEvent.click(screen.getByTestId('regular-button'));
    expect(mockOnSubmit).not.toHaveBeenCalled();
    
    // Clicking submit button should submit
    fireEvent.click(screen.getByTestId('submit-button'));
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });
});
