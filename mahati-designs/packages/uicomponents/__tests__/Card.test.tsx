import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Card } from '../src/components/card';

describe('Card', () => {
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

  it('should render with all variants', () => {
    const variants: Array<'default' | 'elevated' | 'outlined' | 'subtle' | 'figma'> = 
      ['default', 'elevated', 'outlined', 'subtle', 'figma'];
    
    variants.forEach(variant => {
      const { container } = render(<Card variant={variant}>Content</Card>);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  it('should render with all sizes', () => {
    const sizes: Array<'default' | 'sm' | 'lg' | 'figma'> = ['default', 'sm', 'lg', 'figma'];
    
    sizes.forEach(size => {
      const { container } = render(<Card size={size}>Content</Card>);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  it('should render collapsible card', () => {
    render(<Card title="Title" collapsible defaultOpen={true}>Content</Card>);
    expect(screen.getByLabelText(/Hide content|Show content/)).toBeInTheDocument();
  });

  it('should toggle collapsible content', () => {
    render(<Card title="Title" collapsible defaultOpen={true}>Content</Card>);
    
    const button = screen.getByLabelText(/Hide content/);
    fireEvent.click(button);
    
    // Content should be hidden via CSS
    expect(screen.getByText('Content').parentElement).toHaveStyle({ opacity: '0' });
  });

  it('should render flippable card', () => {
    render(<Card flippable cardContent={<div>Front</div>} cardBackContent={<div>Back</div>} />);
    expect(screen.getByText('Front')).toBeInTheDocument();
  });

  it('should flip card on click', () => {
    const handleFlip = jest.fn();
    const { container } = render(
      <Card flippable onFlip={handleFlip} cardContent={<div>Front</div>} cardBackContent={<div>Back</div>} />
    );
    
    fireEvent.click(container.firstChild!);
    expect(handleFlip).toHaveBeenCalledWith(true);
  });

  it('should have displayName', () => {
    expect(Card.displayName).toBe('Card');
  });

  it('should accept backgroundColor prop', () => {
    render(<Card backgroundColor="#ff0000">Content</Card>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('should accept className', () => {
    const { container } = render(<Card className="custom-class">Content</Card>);
    expect(container.querySelector('.custom-class')).toBeInTheDocument();
  });
});
