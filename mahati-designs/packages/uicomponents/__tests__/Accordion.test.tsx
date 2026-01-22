import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Accordion } from '../src/components/accordion';

describe('Accordion', () => {
  it('should render with title', () => {
    render(<Accordion title="Test Title">Content</Accordion>);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('should not show content when closed by default', () => {
    render(<Accordion title="Title">Hidden Content</Accordion>);
    expect(screen.queryByText('Hidden Content')).not.toBeInTheDocument();
  });

  it('should show content when defaultOpen is true', () => {
    render(<Accordion title="Title" defaultOpen={true}>Visible Content</Accordion>);
    expect(screen.getByText('Visible Content')).toBeInTheDocument();
  });

  it('should toggle content when clicked', () => {
    render(<Accordion title="Title">Toggle Content</Accordion>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Toggle Content')).toBeInTheDocument();
    
    fireEvent.click(screen.getByRole('button'));
    expect(screen.queryByText('Toggle Content')).not.toBeInTheDocument();
  });

  it('should render as a button', () => {
    render(<Accordion title="Title">Content</Accordion>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should have displayName', () => {
    expect(Accordion.displayName).toBe('Accordion');
  });

  it('should render icon', () => {
    const { container } = render(<Accordion title="Title">Content</Accordion>);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('should handle complex content', () => {
    render(
      <Accordion title="Title" defaultOpen={true}>
        <div><h3>Heading</h3><p>Paragraph</p></div>
      </Accordion>
    );
    expect(screen.getByText('Heading')).toBeInTheDocument();
    expect(screen.getByText('Paragraph')).toBeInTheDocument();
  });
});
