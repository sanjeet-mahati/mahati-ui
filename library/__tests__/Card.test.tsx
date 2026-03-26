import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Card } from '../src/components/card';

describe('Card', () => {

  // ─── Basic Rendering ────────────────────────────────────────────────────────

  describe('Basic Rendering', () => {
    it('should render with title', () => {
      render(<Card title="Test Title" />);
      expect(screen.getByText('Test Title')).toBeInTheDocument();
    });

    it('should render children', () => {
      render(<Card><div>Card Content</div></Card>);
      expect(screen.getByText('Card Content')).toBeInTheDocument();
    });

    it('should render cardContent prop', () => {
      render(<Card cardContent={<div>Prop Content</div>} />);
      expect(screen.getByText('Prop Content')).toBeInTheDocument();
    });

    it('should prefer cardContent over children when both provided', () => {
      render(<Card cardContent={<span>Card Prop</span>}>Children</Card>);
      // cardContent takes priority: mainContent = cardContent || children
      expect(screen.getByText('Card Prop')).toBeInTheDocument();
    });

    it('should render without title', () => {
      const { container } = render(<Card>Content</Card>);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render with no content', () => {
      const { container } = render(<Card title="Title Only" />);
      expect(screen.getByText('Title Only')).toBeInTheDocument();
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should have correct displayName', () => {
      expect(Card.displayName).toBe('Card');
    });
  });

  // ─── testId ─────────────────────────────────────────────────────────────────

  describe('testId', () => {
    it('should apply testId as data-testid on inner card div', () => {
      render(<Card testId="my-card">Content</Card>);
      expect(screen.getByTestId('my-card')).toBeInTheDocument();
    });

    it('should not set data-testid when not provided', () => {
      const { container } = render(<Card>Content</Card>);
      // the inner div has no data-testid attribute
      const inner = container.querySelector('[data-testid]');
      expect(inner).toBeNull();
    });
  });

  // ─── Variants ────────────────────────────────────────────────────────────────

  describe('Variants', () => {
    const variants = ['default', 'elevated', 'outlined', 'subtle', 'figma'] as const;

    variants.forEach(variant => {
      it(`should render ${variant} variant`, () => {
        const { container } = render(<Card variant={variant}>Content</Card>);
        expect(container.firstChild).toBeInTheDocument();
      });
    });

    it('should apply default variant class bg-white', () => {
      render(<Card variant="default" testId="card">Content</Card>);
      expect(screen.getByTestId('card').className).toMatch(/bg-white/);
    });

    it('should apply elevated variant class', () => {
      render(<Card variant="elevated" testId="card">Content</Card>);
      expect(screen.getByTestId('card').className).toMatch(/shadow-md/);
    });

    it('should apply outlined variant class', () => {
      render(<Card variant="outlined" testId="card">Content</Card>);
      expect(screen.getByTestId('card').className).toMatch(/border-slate-200/);
    });

    it('should apply subtle variant class', () => {
      render(<Card variant="subtle" testId="card">Content</Card>);
      expect(screen.getByTestId('card').className).toMatch(/bg-slate-50/);
    });

    it('should apply figma variant border', () => {
      render(<Card variant="figma" testId="card">Content</Card>);
      expect(screen.getByTestId('card').className).toMatch(/border-\[#1761A3\]/);
    });

    it('should default to default variant when not specified', () => {
      render(<Card testId="card">Content</Card>);
      expect(screen.getByTestId('card').className).toMatch(/bg-white/);
    });
  });

  // ─── Sizes ──────────────────────────────────────────────────────────────────

  describe('Sizes', () => {
    const sizes = ['default', 'sm', 'lg', 'figma'] as const;

    sizes.forEach(size => {
      it(`should render ${size} size`, () => {
        const { container } = render(<Card size={size}>Content</Card>);
        expect(container.firstChild).toBeInTheDocument();
      });
    });

    it('should apply sm size class p-4', () => {
      render(<Card size="sm" testId="card">Content</Card>);
      expect(screen.getByTestId('card').className).toMatch(/p-4/);
    });

    it('should apply lg size class p-8', () => {
      render(<Card size="lg" testId="card">Content</Card>);
      expect(screen.getByTestId('card').className).toMatch(/p-8/);
    });

    it('should apply default size class p-6', () => {
      render(<Card size="default" testId="card">Content</Card>);
      expect(screen.getByTestId('card').className).toMatch(/p-6/);
    });

    it('should apply figma size class p-5', () => {
      render(<Card size="figma" testId="card">Content</Card>);
      expect(screen.getByTestId('card').className).toMatch(/p-5/);
    });
  });

  // ─── Collapsible ─────────────────────────────────────────────────────────────

  describe('Collapsible', () => {
    it('should render collapse button when collapsible and has title', () => {
      render(<Card title="Title" collapsible>Content</Card>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should show Hide content aria-label when open', () => {
      render(<Card title="Title" collapsible defaultOpen={true}>Content</Card>);
      expect(screen.getByLabelText('Hide content')).toBeInTheDocument();
    });

    it('should show Show content aria-label when closed', () => {
      render(<Card title="Title" collapsible defaultOpen={false}>Content</Card>);
      expect(screen.getByLabelText('Show content')).toBeInTheDocument();
    });

    it('should toggle aria-label on click', () => {
      render(<Card title="Title" collapsible defaultOpen={true}>Content</Card>);
      const button = screen.getByLabelText('Hide content');
      fireEvent.click(button);
      expect(screen.getByLabelText('Show content')).toBeInTheDocument();
    });

    it('should set aria-expanded=true when open', () => {
      render(<Card title="Title" collapsible defaultOpen={true}>Content</Card>);
      expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
    });

    it('should set aria-expanded=false when closed', () => {
      render(<Card title="Title" collapsible defaultOpen={false}>Content</Card>);
      expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false');
    });

    it('should toggle aria-expanded on click', () => {
      render(<Card title="Title" collapsible defaultOpen={true}>Content</Card>);
      fireEvent.click(screen.getByRole('button'));
      expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false');
    });

    it('should show content by default (defaultOpen=true)', () => {
      render(<Card title="Title" collapsible defaultOpen={true}>Content</Card>);
      const content = screen.getByText('Content');
      // content is in DOM, parent has opacity-100 class
      expect(content.closest('[class*="grid"]')?.className).toMatch(/opacity-100/);
    });

    it('should hide content when defaultOpen=false', () => {
      render(<Card title="Title" collapsible defaultOpen={false}>Content</Card>);
      const content = screen.getByText('Content');
      expect(content.closest('[class*="grid"]')?.className).toMatch(/opacity-0/);
    });

    it('should toggle content visibility on click', () => {
      render(<Card title="Title" collapsible defaultOpen={true}>Content</Card>);
      const btn = screen.getByRole('button');
      // open → click → closed
      fireEvent.click(btn);
      expect(screen.getByText('Content').closest('[class*="grid"]')?.className).toMatch(/opacity-0/);
      // closed → click → open
      fireEvent.click(btn);
      expect(screen.getByText('Content').closest('[class*="grid"]')?.className).toMatch(/opacity-100/);
    });

    it('should not render collapse button without title', () => {
      render(<Card collapsible>Content</Card>);
      expect(screen.queryByRole('button')).toBeNull();
    });
  });

  // ─── Flippable ───────────────────────────────────────────────────────────────

  describe('Flippable', () => {
    it('should render front content', () => {
      render(
        <Card flippable cardContent={<div>Front</div>} cardBackContent={<div>Back</div>} />
      );
      expect(screen.getByText('Front')).toBeInTheDocument();
    });

    it('should render back content in DOM', () => {
      render(
        <Card flippable cardContent={<div>Front</div>} cardBackContent={<div>Back</div>} />
      );
      expect(screen.getByText('Back')).toBeInTheDocument();
    });

    it('should call onFlip with true on first click', () => {
      const handleFlip = jest.fn();
      const { container } = render(
        <Card flippable onFlip={handleFlip} cardContent={<div>Front</div>} cardBackContent={<div>Back</div>} />
      );
      fireEvent.click(container.firstChild!);
      expect(handleFlip).toHaveBeenCalledWith(true);
    });

    it('should call onFlip with false on second click', () => {
      const handleFlip = jest.fn();
      const { container } = render(
        <Card flippable onFlip={handleFlip} cardContent={<div>Front</div>} cardBackContent={<div>Back</div>} />
      );
      fireEvent.click(container.firstChild!);
      fireEvent.click(container.firstChild!);
      expect(handleFlip).toHaveBeenNthCalledWith(2, false);
    });

    it('should add cursor-pointer class when flippable', () => {
      render(<Card flippable testId="card" cardContent={<div>Front</div>} />);
      expect(screen.getByTestId('card').className).toMatch(/cursor-pointer/);
    });

    it('should not add cursor-pointer when not flippable', () => {
      render(<Card testId="card">Content</Card>);
      expect(screen.getByTestId('card').className).not.toMatch(/cursor-pointer/);
    });

    it('should not render back face when cardBackContent not provided', () => {
      render(<Card flippable cardContent={<div>Front</div>} />);
      expect(screen.queryByText('Back')).toBeNull();
    });

    it('should not flip when flippable is false', () => {
      const handleFlip = jest.fn();
      const { container } = render(
        <Card onFlip={handleFlip} cardContent={<div>Front</div>} />
      );
      fireEvent.click(container.firstChild!);
      expect(handleFlip).not.toHaveBeenCalled();
    });
  });

  // ─── Custom Styles ───────────────────────────────────────────────────────────

  describe('Custom Styles', () => {
    it('should apply backgroundColor as inline style', () => {
      render(<Card backgroundColor="#ff0000" testId="card">Content</Card>);
      expect(screen.getByTestId('card')).toHaveStyle({ backgroundColor: '#ff0000' });
    });

    it('should apply figma default background when no backgroundColor', () => {
      render(<Card variant="figma" testId="card">Content</Card>);
      const card = screen.getByTestId('card');
      expect(card.style.backgroundColor).toContain('rgba(77, 175, 131, 0.1');
    });

    it('should apply borderRadius inline style', () => {
      render(<Card borderRadius="20px" testId="card">Content</Card>);
      expect(screen.getByTestId('card')).toHaveStyle({ borderRadius: '20px' });
    });

    it('should use default borderRadius 14px when not provided', () => {
      render(<Card testId="card">Content</Card>);
      expect(screen.getByTestId('card')).toHaveStyle({ borderRadius: '14px' });
    });

    it('should accept custom className', () => {
      const { container } = render(<Card className="custom-class">Content</Card>);
      expect(container.querySelector('.custom-class')).toBeInTheDocument();
    });

    it('should pass through custom style prop', () => {
      render(<Card style={{ margin: '10px' }} testId="card">Content</Card>);
      expect(screen.getByTestId('card')).toHaveStyle({ margin: '10px' });
    });
  });

  // ─── defaultOpen ─────────────────────────────────────────────────────────────

  describe('defaultOpen', () => {
    it('should be open by default', () => {
      render(<Card title="T" collapsible>Content</Card>);
      expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
    });

    it('should respect defaultOpen=false', () => {
      render(<Card title="T" collapsible defaultOpen={false}>Content</Card>);
      expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false');
    });
  });

  // ─── HTML Attributes ─────────────────────────────────────────────────────────

  describe('HTML Attributes', () => {
    it('should pass through id attribute', () => {
      render(<Card testId="card" id="my-card">Content</Card>);
      expect(screen.getByTestId('card')).toHaveAttribute('id', 'my-card');
    });

    it('should pass through aria-label', () => {
      render(<Card testId="card" aria-label="info card">Content</Card>);
      expect(screen.getByTestId('card')).toHaveAttribute('aria-label', 'info card');
    });

    it('should pass through role attribute', () => {
      render(<Card testId="card" role="region">Content</Card>);
      expect(screen.getByRole('region')).toBeInTheDocument();
    });
  });

  // ─── Edge Cases ──────────────────────────────────────────────────────────────

  describe('Edge Cases', () => {
    it('should render with no props', () => {
      const { container } = render(<Card />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render complex nested children', () => {
      render(
        <Card>
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
          </ul>
        </Card>
      );
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
    });

    it('should render multiple cards independently', () => {
      render(
        <>
          <Card title="Card 1" collapsible defaultOpen={true}>Content 1</Card>
          <Card title="Card 2" collapsible defaultOpen={false}>Content 2</Card>
        </>
      );
      const buttons = screen.getAllByRole('button');
      // Card 1 open, Card 2 closed
      expect(buttons[0]).toHaveAttribute('aria-expanded', 'true');
      expect(buttons[1]).toHaveAttribute('aria-expanded', 'false');

      // Toggle card 1 — should not affect card 2
      fireEvent.click(buttons[0]);
      expect(buttons[0]).toHaveAttribute('aria-expanded', 'false');
      expect(buttons[1]).toHaveAttribute('aria-expanded', 'false');
    });

    it('should handle long title text', () => {
      const longTitle = 'T'.repeat(100);
      render(<Card title={longTitle} />);
      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });
  });
});