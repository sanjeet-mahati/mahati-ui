import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Button } from '../src/components/Button';

describe('Button', () => {
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
      render(
        <Button>
          <span>Child content</span>
        </Button>
      );
      expect(screen.getByText('Child content')).toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('should render default variant', () => {
      render(<Button variant="default">Default</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render destructive variant', () => {
      render(<Button variant="destructive">Delete</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render outline variant', () => {
      render(<Button variant="outline">Outline</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render secondary variant', () => {
      render(<Button variant="secondary">Secondary</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render ghost variant', () => {
      render(<Button variant="ghost">Ghost</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render link variant', () => {
      render(<Button variant="link">Link</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render danger variant', () => {
      render(<Button variant="danger">Danger</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render dotted variant', () => {
      render(<Button variant="dotted">Dotted</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render pill variant', () => {
      render(<Button variant="pill">Pill</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('Sizes', () => {
    it('should render default size', () => {
      render(<Button size="default">Default Size</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render small size', () => {
      render(<Button size="sm">Small</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render medium size', () => {
      render(<Button size="md">Medium</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render large size', () => {
      render(<Button size="lg">Large</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render icon size', () => {
      render(<Button size="icon">🔔</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('Color Names', () => {
    it('should render with blue color', () => {
      render(<Button name="blue">Blue Button</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render with green color', () => {
      render(<Button name="green">Green Button</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render with red color', () => {
      render(<Button name="red">Red Button</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render with orange color', () => {
      render(<Button name="orange">Orange Button</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render with purple color', () => {
      render(<Button name="purple">Purple Button</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render with yellow color', () => {
      render(<Button name="yellow">Yellow Button</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render with pink color', () => {
      render(<Button name="pink">Pink Button</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render with teal color', () => {
      render(<Button name="teal">Teal Button</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render with indigo color', () => {
      render(<Button name="indigo">Indigo Button</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render with primary color', () => {
      render(<Button name="primary">Primary Button</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render with secondary color', () => {
      render(<Button name="secondary">Secondary Button</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render with success color', () => {
      render(<Button name="success">Success Button</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render with danger color', () => {
      render(<Button name="danger">Danger Button</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render with warning color', () => {
      render(<Button name="warning">Warning Button</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render with info color', () => {
      render(<Button name="info">Info Button</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('Icon Button', () => {
    it('should render as icon button', () => {
      render(<Button iconButton>🔔</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render icon button with custom height', () => {
      render(<Button iconButton iconButtonHeightClass="h-12">Icon</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render icon button with custom width', () => {
      render(<Button iconButton iconButtonWidthClass="w-12">Icon</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render icon button with custom background', () => {
      render(<Button iconButton iconButtonBgClass="bg-[rgba(255,0,0,0.2)]">Icon</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render icon button with custom radius', () => {
      render(<Button iconButton iconButtonRadiusClass="rounded-full">Icon</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render icon button with custom padding', () => {
      render(<Button iconButton iconButtonBgPaddingClass="p-[4px]">Icon</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render icon button with hover background', () => {
      render(<Button iconButton iconButtonHoverBgClass="hover:bg-[rgba(0,0,255,0.3)]">Icon</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render icon button with hover intensity', () => {
      render(<Button iconButton iconButtonHoverIntensity={50}>Icon</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render icon button with SVG', () => {
      render(
        <Button iconButton>
          <svg data-testid="test-icon" width="16" height="16">
            <circle cx="8" cy="8" r="8" />
          </svg>
        </Button>
      );
      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    });

    it('should render icon button with name color', () => {
      render(<Button iconButton name="blue">Icon</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

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
  });

  describe('Disabled State', () => {
    it('should render disabled button', () => {
      render(<Button disabled>Disabled</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should have reduced opacity when disabled', () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveStyle({ opacity: '0.5' });
    });

    it('should have pointer-events none when disabled', () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveStyle({ pointerEvents: 'none' });
    });
  });

  describe('HTML Attributes', () => {
    it('should accept type attribute', () => {
      render(<Button type="submit">Submit</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
    });

    it('should accept custom className', () => {
      render(<Button className="custom-class">Button</Button>);
      expect(screen.getByRole('button')).toHaveClass('custom-class');
    });

    it('should accept id attribute', () => {
      render(<Button id="my-button">Button</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('id', 'my-button');
    });

    it('should accept data attributes', () => {
      render(<Button data-testid="test-button">Button</Button>);
      expect(screen.getByTestId('test-button')).toBeInTheDocument();
    });

    it('should accept aria-label', () => {
      render(<Button aria-label="Close dialog">×</Button>);
      expect(screen.getByLabelText('Close dialog')).toBeInTheDocument();
    });
  });

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

    it('should not be focusable when disabled', () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole('button');
      
      button.focus();
      expect(button).not.toHaveFocus();
    });

    it('should support aria-disabled', () => {
      render(<Button aria-disabled="true">Disabled</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'true');
    });
  });

  describe('Display Name', () => {
    it('should have correct display name', () => {
      expect(Button.displayName).toBe('Button');
    });
  });

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

    it('should render IconButtonGroup with row direction', () => {
      const { container } = render(
        <Button.IconButtonGroup direction="row">
          <Button iconButton>1</Button>
          <Button iconButton>2</Button>
        </Button.IconButtonGroup>
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render IconButtonGroup with column direction', () => {
      const { container } = render(
        <Button.IconButtonGroup direction="col">
          <Button iconButton>1</Button>
          <Button iconButton>2</Button>
        </Button.IconButtonGroup>
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render IconButtonGroup with custom gap', () => {
      const { container } = render(
        <Button.IconButtonGroup gapClass="gap-4">
          <Button iconButton>1</Button>
          <Button iconButton>2</Button>
        </Button.IconButtonGroup>
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should have correct display name', () => {
      expect(Button.IconButtonGroup.displayName).toBe('IconButtonGroup');
    });
  });

  describe('Edge Cases', () => {
    it('should render with empty children', () => {
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
      render(
        <Button>
          <span>Icon</span>
          <span>Text</span>
        </Button>
      );
      expect(screen.getByText('Icon')).toBeInTheDocument();
      expect(screen.getByText('Text')).toBeInTheDocument();
    });

    it('should handle undefined variant', () => {
      render(<Button variant={undefined}>Button</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should handle undefined size', () => {
      render(<Button size={undefined}>Button</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should handle invalid color name', () => {
      render(<Button name="invalidcolor">Button</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('Combination Tests', () => {
    it('should render variant and size together', () => {
      render(<Button variant="outline" size="lg">Large Outline</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render variant with color name', () => {
      render(<Button variant="outline" name="blue">Blue Outline</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render size with color name', () => {
      render(<Button size="lg" name="green">Large Green</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
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
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

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
  });
});
