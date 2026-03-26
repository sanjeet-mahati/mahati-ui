import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Button } from '../src/components/Button';

describe('Button', () => {

  // ─── Basic Rendering ────────────────────────────────────────────────────────

  describe('Basic Rendering', () => {
    it('should render with text', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole('button')).toHaveTextContent('Click me');
    });

    it('should render as a button element', () => {
      render(<Button>Button</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render children', () => {
      render(<Button><span>Child content</span></Button>);
      expect(screen.getByText('Child content')).toBeInTheDocument();
    });

    it('should have correct displayName', () => {
      expect(Button.displayName).toBe('Button');
    });
  });

  // ─── Variants ───────────────────────────────────────────────────────────────

  describe('Variants', () => {
    const variants = ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link', 'danger', 'dotted', 'pill'] as const;

    variants.forEach(variant => {
      it(`should render ${variant} variant`, () => {
        render(<Button variant={variant}>{variant}</Button>);
        expect(screen.getByRole('button')).toBeInTheDocument();
      });
    });

    it('should apply variant class to button', () => {
      render(<Button variant="secondary">Secondary</Button>);
      const btn = screen.getByRole('button');
      expect(btn.className).toMatch(/bg-\[#3b82f6\]/);
    });

    it('should apply destructive class', () => {
      render(<Button variant="destructive">Delete</Button>);
      expect(screen.getByRole('button').className).toMatch(/bg-\[#ef4444\]/);
    });

    it('should apply outline classes', () => {
      render(<Button variant="outline">Outline</Button>);
      expect(screen.getByRole('button').className).toMatch(/bg-white/);
    });

    it('should default to default variant when not specified', () => {
      render(<Button>Button</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should handle undefined variant gracefully', () => {
      render(<Button variant={undefined}>Button</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  // ─── Sizes ──────────────────────────────────────────────────────────────────

  describe('Sizes', () => {
    const sizes = ['default', 'sm', 'md', 'lg', 'icon'] as const;

    sizes.forEach(size => {
      it(`should render ${size} size`, () => {
        render(<Button size={size}>{size}</Button>);
        expect(screen.getByRole('button')).toBeInTheDocument();
      });
    });

    it('should apply sm size class', () => {
      render(<Button size="sm">Small</Button>);
      expect(screen.getByRole('button').className).toMatch(/h-\[36px\]/);
    });

    it('should apply lg size class', () => {
      render(<Button size="lg">Large</Button>);
      expect(screen.getByRole('button').className).toMatch(/h-\[44px\]/);
    });

    it('should handle undefined size gracefully', () => {
      render(<Button size={undefined}>Button</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  // ─── Color Names ────────────────────────────────────────────────────────────

  describe('Color Names', () => {
    const colors = ['blue', 'green', 'red', 'orange', 'purple', 'yellow', 'pink', 'teal', 'indigo', 'primary', 'secondary', 'success', 'danger', 'warning', 'info'];

    colors.forEach(color => {
      it(`should render with ${color} color`, () => {
        render(<Button name={color}>{color}</Button>);
        expect(screen.getByRole('button')).toBeInTheDocument();
      });
    });

    it('should apply inline background style when name provided', () => {
      render(<Button name="blue">Blue</Button>);
      const btn = screen.getByRole('button');
      expect(btn).toHaveStyle({ background: '#3b82f6' });
    });

    it('should apply white color when name provided', () => {
      render(<Button name="blue">Blue</Button>);
      const btn = screen.getByRole('button');
      expect(btn).toHaveStyle({ color: 'white' });
    });

    it('should apply gradient for primary name', () => {
      render(<Button name="primary">Primary</Button>);
      const btn = screen.getByRole('button');
      expect(btn).toHaveStyle({ background: 'linear-gradient(to right, rgba(23, 97, 163, 1), rgba(77, 175, 131, 1))' });
    });

    it('should fall back to primary gradient for unknown color', () => {
      render(<Button name="unknowncolor123">Fallback</Button>);
      const btn = screen.getByRole('button');
      expect(btn).toHaveStyle({ background: 'linear-gradient(to right, rgba(23, 97, 163, 1), rgba(77, 175, 131, 1))' });
    });
    it('should apply pill borderRadius when name + pill variant', () => {
      render(<Button name="blue" variant="pill">Pill</Button>);
      expect(screen.getByRole('button')).toHaveStyle({ borderRadius: '9999px' });
    });

    it('should apply 6px borderRadius for non-pill variant with name', () => {
      render(<Button name="blue" variant="default">Default</Button>);
      expect(screen.getByRole('button')).toHaveStyle({ borderRadius: '6px' });
    });
  });

  // ─── testId prop ─────────────────────────────────────────────────────────────

  describe('testId prop', () => {
    it('should apply testId as data-testid', () => {
      render(<Button testId="my-btn">Button</Button>);
      expect(screen.getByTestId('my-btn')).toBeInTheDocument();
    });

    it('should not render data-testid when testId not provided', () => {
      render(<Button>Button</Button>);
      const btn = screen.getByRole('button');
      expect(btn).not.toHaveAttribute('data-testid');
    });
  });

  // ─── Icon Button ─────────────────────────────────────────────────────────────

  describe('Icon Button', () => {
    it('should render as icon button', () => {
      render(<Button iconButton>🔔</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should apply default height 36px when no heightClass', () => {
      render(<Button iconButton>Icon</Button>);
      expect(screen.getByRole('button')).toHaveStyle({ height: '36px' });
    });

    it('should apply custom height from iconButtonHeightClass', () => {
      render(<Button iconButton iconButtonHeightClass="h-12">Icon</Button>);
      expect(screen.getByRole('button')).toHaveStyle({ height: '48px' });
    });

    it('should apply custom width from iconButtonWidthClass', () => {
      render(<Button iconButton iconButtonWidthClass="w-10">Icon</Button>);
      expect(screen.getByRole('button')).toHaveStyle({ width: '40px' });
    });

    it('should apply custom radius class', () => {
      render(<Button iconButton iconButtonRadiusClass="rounded-full">Icon</Button>);
      expect(screen.getByRole('button').className).toContain('rounded-full');
    });

    it('should apply custom bg class', () => {
      render(<Button iconButton iconButtonBgClass="bg-red-500">Icon</Button>);
      expect(screen.getByRole('button').className).toContain('bg-red-500');
    });

    it('should apply custom padding class', () => {
      render(<Button iconButton iconButtonBgPaddingClass="p-[4px]">Icon</Button>);
      expect(screen.getByRole('button').className).toContain('p-[4px]');
    });

    it('should apply white color for gradient name', () => {
      render(<Button iconButton name="primary">Icon</Button>);
      expect(screen.getByRole('button')).toHaveStyle({ color: 'white' });
    });

    it('should apply hex color for named color', () => {
      render(<Button iconButton name="blue">Icon</Button>);
      expect(screen.getByRole('button')).toHaveStyle({ color: '#3b82f6' });
    });

    it('should render SVG inside icon button', () => {
      render(
        <Button iconButton>
          <svg data-testid="test-icon" width="16" height="16">
            <circle cx="8" cy="8" r="8" />
          </svg>
        </Button>
      );
      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    });

    it('should default radius to rounded-md when no iconButtonRadiusClass', () => {
      render(<Button iconButton>Icon</Button>);
      expect(screen.getByRole('button').className).toContain('rounded-md');
    });
  });

  // ─── Click Events ────────────────────────────────────────────────────────────

  describe('Click Events', () => {
    it('should handle click events', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click me</Button>);
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when disabled', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick} disabled>Click me</Button>);
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should handle multiple clicks', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click me</Button>);
      const button = screen.getByRole('button');
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalledTimes(3);
    });

    it('should pass event to handler', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click</Button>);
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledWith(expect.any(Object));
    });
  });

  // ─── Disabled State ──────────────────────────────────────────────────────────

  describe('Disabled State', () => {
    it('should render disabled button', () => {
      render(<Button disabled>Disabled</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should have disabled:opacity-50 class when disabled', () => {
      render(<Button disabled>Disabled</Button>);
      // Tailwind disabled: classes are in className, not inline style
      expect(screen.getByRole('button').className).toMatch(/disabled:opacity-50/);
    });

    it('should have disabled:pointer-events-none class when disabled', () => {
      render(<Button disabled>Disabled</Button>);
      expect(screen.getByRole('button').className).toMatch(/disabled:pointer-events-none/);
    });

    it('should have disabled attribute', () => {
      render(<Button disabled>Disabled</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('disabled');
    });
  });

  // ─── HTML Attributes ─────────────────────────────────────────────────────────

  describe('HTML Attributes', () => {
    it('should accept type=submit', () => {
      render(<Button type="submit">Submit</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
    });

    it('should accept type=button', () => {
      render(<Button type="button">Button</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
    });

    it('should accept custom className', () => {
      render(<Button className="custom-class">Button</Button>);
      expect(screen.getByRole('button')).toHaveClass('custom-class');
    });

    it('should accept id attribute', () => {
      render(<Button id="my-button">Button</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('id', 'my-button');
    });

    it('should accept data-testid attribute', () => {
      render(<Button data-testid="test-button">Button</Button>);
      expect(screen.getByTestId('test-button')).toBeInTheDocument();
    });

    it('should accept aria-label', () => {
      render(<Button aria-label="Close dialog">×</Button>);
      expect(screen.getByLabelText('Close dialog')).toBeInTheDocument();
    });

    it('should pass through custom style', () => {
      render(<Button style={{ marginTop: '10px' }}>Button</Button>);
      expect(screen.getByRole('button')).toHaveStyle({ marginTop: '10px' });
    });

    it('should accept tabIndex', () => {
      render(<Button tabIndex={0}>Button</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('tabindex', '0');
    });
  });

  // ─── Accessibility ───────────────────────────────────────────────────────────

  describe('Accessibility', () => {
    it('should have button role', () => {
      render(<Button>Button</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should support keyboard focus', () => {
      render(<Button>Focusable</Button>);
      const button = screen.getByRole('button');
      button.focus();
      expect(button).toHaveFocus();
    });

    it('should support aria-disabled', () => {
      render(<Button aria-disabled="true">Disabled</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'true');
    });

    it('should support aria-pressed', () => {
      render(<Button aria-pressed="true">Pressed</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
    });

    it('should support aria-expanded', () => {
      render(<Button aria-expanded="false">Dropdown</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false');
    });
  });

  // ─── IconButtonGroup ─────────────────────────────────────────────────────────

  describe('IconButtonGroup', () => {
    it('should render IconButtonGroup', () => {
      const { container } = render(
        <Button.IconButtonGroup>
          <Button iconButton>1</Button>
          <Button iconButton>2</Button>
        </Button.IconButtonGroup>
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render with row direction by default', () => {
      const { container } = render(
        <Button.IconButtonGroup>
          <Button iconButton>1</Button>
        </Button.IconButtonGroup>
      );
      expect(container.firstChild).toHaveClass('flex-row');
    });

    it('should render with column direction', () => {
      const { container } = render(
        <Button.IconButtonGroup direction="col">
          <Button iconButton>1</Button>
        </Button.IconButtonGroup>
      );
      expect(container.firstChild).toHaveClass('flex-col');
    });

    it('should apply gap from gapClass', () => {
      const { container } = render(
        <Button.IconButtonGroup gapClass="gap-4">
          <Button iconButton>1</Button>
        </Button.IconButtonGroup>
      );
      expect(container.firstChild).toHaveStyle({ gap: '16px' });
    });

    it('should apply default gap when no gapClass', () => {
      const { container } = render(
        <Button.IconButtonGroup>
          <Button iconButton>1</Button>
        </Button.IconButtonGroup>
      );
      expect(container.firstChild).toHaveStyle({ gap: '8px' });
    });

    it('should accept custom className', () => {
      const { container } = render(
        <Button.IconButtonGroup className="custom-group">
          <Button iconButton>1</Button>
        </Button.IconButtonGroup>
      );
      expect(container.firstChild).toHaveClass('custom-group');
    });

    it('should have correct displayName', () => {
      expect(Button.IconButtonGroup.displayName).toBe('IconButtonGroup');
    });
  });

  // ─── Edge Cases ──────────────────────────────────────────────────────────────

  describe('Edge Cases', () => {
    it('should render with no children', () => {
      render(<Button></Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should handle very long text', () => {
      const longText = 'A'.repeat(100);
      render(<Button>{longText}</Button>);
      expect(screen.getByRole('button')).toHaveTextContent(longText);
    });

    it('should handle special characters', () => {
      render(<Button>{"<>&'\" Test"}</Button>);
      expect(screen.getByRole('button')).toHaveTextContent('<>&\'" Test');
    });

    it('should render with multiple children', () => {
      render(<Button><span>Icon</span><span>Text</span></Button>);
      expect(screen.getByText('Icon')).toBeInTheDocument();
      expect(screen.getByText('Text')).toBeInTheDocument();
    });

    it('should render with null className gracefully', () => {
      render(<Button className={undefined}>Button</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  // ─── Combination Tests ───────────────────────────────────────────────────────

  describe('Combination Tests', () => {
    it('should render variant and size together', () => {
      render(<Button variant="outline" size="lg">Large Outline</Button>);
      const btn = screen.getByRole('button');
      expect(btn.className).toMatch(/h-\[44px\]/);
      expect(btn.className).toMatch(/bg-white/);
    });

  it('should render name overrides variant classes', () => {
  render(<Button variant="outline" name="blue">Blue Outline</Button>);
  const btn = screen.getByRole('button');
  // jsdom converts hex to rgb when reading back style.background
  expect(btn.style.background).toMatch(/#3b82f6|rgb\(59,\s*130,\s*246\)/);
});

    it('should render icon button with all props', () => {
      render(
        <Button
          iconButton
          name="blue"
          iconButtonHeightClass="h-12"
          iconButtonWidthClass="w-12"
          iconButtonRadiusClass="rounded-full"
          iconButtonHoverIntensity={50}
        >
          🔔
        </Button>
      );
      const btn = screen.getByRole('button');
      expect(btn).toHaveStyle({ height: '48px', width: '48px' });
      expect(btn.className).toContain('rounded-full');
    });

    it('should render variant + size + testId', () => {
      render(<Button variant="secondary" size="md" testId="combo-btn">Button</Button>);
      expect(screen.getByTestId('combo-btn')).toBeInTheDocument();
    });
  });

  // ─── Form Integration ────────────────────────────────────────────────────────

  describe('Form Integration', () => {
    it('should work inside a form', () => {
      const handleSubmit = jest.fn((e) => e.preventDefault());
      render(
        <form onSubmit={handleSubmit}>
          <Button type="submit">Submit</Button>
        </form>
      );
      fireEvent.click(screen.getByRole('button'));
      expect(handleSubmit).toHaveBeenCalled();
    });

    it('should not submit form when disabled', () => {
      const handleSubmit = jest.fn((e) => e.preventDefault());
      render(
        <form onSubmit={handleSubmit}>
          <Button type="submit" disabled>Submit</Button>
        </form>
      );
      fireEvent.click(screen.getByRole('button'));
      expect(handleSubmit).not.toHaveBeenCalled();
    });

    it('should work as reset button', () => {
      render(
        <form>
          <Button type="reset">Reset</Button>
        </form>
      );
      expect(screen.getByRole('button')).toHaveAttribute('type', 'reset');
    });
  });
});