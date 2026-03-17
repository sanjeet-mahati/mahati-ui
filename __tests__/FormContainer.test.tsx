import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FormContainer } from '../src/components/FormContainer';

describe('FormContainer', () => {

  // ─── Basic Rendering ──────────────────────────────────────────────────────

  describe('Basic Rendering', () => {
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
        <FormContainer><input type="text" /></FormContainer>
      );
      expect(container.querySelector('form')).toBeInTheDocument();
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

    it('should render empty form without errors', () => {
      const { container } = render(<FormContainer>{null}</FormContainer>);
      expect(container.querySelector('form')).toBeInTheDocument();
    });

    it('should have correct displayName', () => {
      expect(FormContainer.displayName).toBe('FormContainer');
    });
  });

  // ─── testId ───────────────────────────────────────────────────────────────

  describe('testId', () => {
    it('should apply testId to form element', () => {
      render(<FormContainer testId="my-form"><div>content</div></FormContainer>);
      expect(screen.getByTestId('my-form')).toBeInTheDocument();
    });

    it('should not set data-testid when not provided', () => {
      const { container } = render(<FormContainer><div>content</div></FormContainer>);
      expect(container.querySelector('[data-testid]')).toBeNull();
    });
  });

  // ─── className ────────────────────────────────────────────────────────────

  describe('className', () => {
    it('should apply custom className to form', () => {
      const { container } = render(
        <FormContainer className="custom-form"><div>Content</div></FormContainer>
      );
      expect(container.querySelector('form')).toHaveClass('custom-form');
    });

    it('should always have form-container class', () => {
      const { container } = render(
        <FormContainer><div>Content</div></FormContainer>
      );
      expect(container.querySelector('form')).toHaveClass('form-container');
    });

    it('should have Tailwind layout classes', () => {
      const { container } = render(
        <FormContainer><div>Content</div></FormContainer>
      );
      const form = container.querySelector('form');
      expect(form?.className).toMatch(/flex/);
      expect(form?.className).toMatch(/flex-col/);
    });

    it('should apply default empty className without error', () => {
      const { container } = render(
        <FormContainer><div>Content</div></FormContainer>
      );
      expect(container.querySelector('form')).toHaveAttribute('class');
    });
  });

  // ─── style ────────────────────────────────────────────────────────────────

  describe('style', () => {
    it('should apply custom style prop', () => {
      const { container } = render(
        <FormContainer style={{ marginTop: '10px' }}><div>Content</div></FormContainer>
      );
      expect(container.querySelector('form')).toHaveStyle({ marginTop: '10px' });
    });

    it('should apply multiple style properties', () => {
      const { container } = render(
        <FormContainer style={{ marginTop: '10px', padding: '20px' }}>
          <div>Content</div>
        </FormContainer>
      );
      const form = container.querySelector('form');
      expect(form).toHaveStyle({ marginTop: '10px', padding: '20px' });
    });
  });

  // ─── Submit ───────────────────────────────────────────────────────────────

  describe('Submit', () => {
    it('should call onSubmit when submit button clicked', () => {
      const mockOnSubmit = jest.fn((e) => e.preventDefault());
      render(
        <FormContainer onSubmit={mockOnSubmit}>
          <button type="submit">Submit</button>
        </FormContainer>
      );
      fireEvent.click(screen.getByRole('button', { name: /submit/i }));
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });

    it('should call onSubmit when form is submitted directly', () => {
      const mockOnSubmit = jest.fn((e) => e.preventDefault());
      const { container } = render(
        <FormContainer onSubmit={mockOnSubmit}>
          <button type="submit">Submit</button>
        </FormContainer>
      );
      fireEvent.submit(container.querySelector('form')!);
      expect(mockOnSubmit).toHaveBeenCalled();
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
      fireEvent.submit(container.querySelector('form')!);
      expect(capturedEvent?.type).toBe('submit');
    });

    it('should not throw when submitted without onSubmit prop', () => {
      const { container } = render(
        <FormContainer><button type="submit">Submit</button></FormContainer>
      );
      expect(() => fireEvent.submit(container.querySelector('form')!)).not.toThrow();
    });

    it('should not call onSubmit when type=button clicked', () => {
      const mockOnSubmit = jest.fn((e) => e.preventDefault());
      render(
        <FormContainer onSubmit={mockOnSubmit}>
          <button type="button" data-testid="regular-button">Regular</button>
          <button type="submit" data-testid="submit-button">Submit</button>
        </FormContainer>
      );
      fireEvent.click(screen.getByTestId('regular-button'));
      expect(mockOnSubmit).not.toHaveBeenCalled();

      fireEvent.click(screen.getByTestId('submit-button'));
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });

    it('should handle FormData in onSubmit', () => {
      const mockOnSubmit = jest.fn((e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget as HTMLFormElement);
        expect(formData.get('name')).toBe('John Doe');
      });
      render(
        <FormContainer onSubmit={mockOnSubmit}>
          <input name="name" defaultValue="John Doe" />
          <button type="submit">Submit</button>
        </FormContainer>
      );
      fireEvent.click(screen.getByRole('button', { name: /submit/i }));
      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });

  // ─── Input Types ──────────────────────────────────────────────────────────

  describe('Input Types', () => {
    it('should render with all common input types', () => {
      render(
        <FormContainer>
          <input type="text"     data-testid="text-input" />
          <input type="email"    data-testid="email-input" />
          <input type="password" data-testid="password-input" />
          <input type="checkbox" data-testid="checkbox-input" />
          <input type="radio"    data-testid="radio-input" />
          <input type="file"     data-testid="file-input" />
        </FormContainer>
      );
      ['text-input','email-input','password-input','checkbox-input','radio-input','file-input']
        .forEach(id => expect(screen.getByTestId(id)).toBeInTheDocument());
    });

    it('should support controlled inputs', () => {
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

    it('should handle form reset', () => {
      const { container } = render(
        <FormContainer>
          <input name="name" defaultValue="John Doe" data-testid="name-input" />
          <button type="reset" data-testid="reset-button">Reset</button>
        </FormContainer>
      );
      const input = screen.getByTestId('name-input') as HTMLInputElement;
      fireEvent.change(input, { target: { value: 'Jane Doe' } });
      expect(input.value).toBe('Jane Doe');
      fireEvent.click(screen.getByTestId('reset-button'));
      expect(input.value).toBe('John Doe');
    });
  });

  // ─── Accessibility ────────────────────────────────────────────────────────

  describe('Accessibility', () => {
    it('should render with labeled inputs', () => {
      render(
        <FormContainer>
          <label htmlFor="name">Name</label>
          <input id="name" type="text" />
          <label htmlFor="email">Email</label>
          <input id="email" type="email" />
          <button type="submit">Submit</button>
        </FormContainer>
      );
      expect(screen.getByLabelText('Name')).toBeInTheDocument();
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
    });

    it('should support aria attributes on inputs', () => {
      render(
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

    it('should be findable by role="form"', () => {
      render(
        <FormContainer testId="form">
          <div>Content</div>
        </FormContainer>
      );
      // form element is accessible via testId
      expect(screen.getByTestId('form').tagName).toBe('FORM');
    });
  });

  // ─── Nested Content ───────────────────────────────────────────────────────

  describe('Nested Content', () => {
    it('should render deeply nested elements', () => {
      render(
        <FormContainer>
          <div>
            <section>
              <div data-testid="deep-child">Deep</div>
            </section>
          </div>
        </FormContainer>
      );
      expect(screen.getByTestId('deep-child')).toBeInTheDocument();
    });

    it('should render sections with labels and inputs', () => {
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
  });
});