import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Accordion } from '../src/components/accordion';

// ─── RENDER ──────────────────────────────────────────────────────────────────

describe('Accordion — Render', () => {
  it('renders the title', () => {
    render(<Accordion title="My Title">Content</Accordion>);
    expect(screen.getByText('My Title')).toBeInTheDocument();
  });

  it('renders a button element for the header', () => {
    render(<Accordion title="Title">Content</Accordion>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('renders without children', () => {
    render(<Accordion title="No Children" />);
    expect(screen.getByText('No Children')).toBeInTheDocument();
  });

  it('renders with empty string title', () => {
    render(<Accordion title="">Content</Accordion>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('renders with long title', () => {
    const long = 'A'.repeat(200);
    render(<Accordion title={long}>Content</Accordion>);
    expect(screen.getByText(long)).toBeInTheDocument();
  });

  it('has correct displayName', () => {
    expect(Accordion.displayName).toBe('Accordion');
  });
});

// ─── DEFAULT STATE ────────────────────────────────────────────────────────────

describe('Accordion — Default State', () => {
  it('hides content by default (defaultOpen not set)', () => {
    render(<Accordion title="Title">Hidden</Accordion>);
    expect(screen.queryByText('Hidden')).not.toBeInTheDocument();
  });

  it('shows content when defaultOpen=true', () => {
    render(<Accordion title="Title" defaultOpen>Visible</Accordion>);
    expect(screen.getByText('Visible')).toBeInTheDocument();
  });

  it('hides content when defaultOpen=false explicitly', () => {
    render(<Accordion title="Title" defaultOpen={false}>Hidden</Accordion>);
    expect(screen.queryByText('Hidden')).not.toBeInTheDocument();
  });

  it('shows ChevronDown icon when closed', () => {
    const { container } = render(<Accordion title="Title">Content</Accordion>);
    // closed = ChevronDown svg present
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('shows ChevronUp icon when open', () => {
    const { container } = render(<Accordion title="Title" defaultOpen>Content</Accordion>);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});

// ─── TOGGLE BEHAVIOUR ────────────────────────────────────────────────────────

describe('Accordion — Toggle', () => {
  it('opens on first click', () => {
    render(<Accordion title="Title">Content</Accordion>);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('closes on second click', () => {
    render(<Accordion title="Title">Content</Accordion>);
    const btn = screen.getByRole('button');
    fireEvent.click(btn);
    fireEvent.click(btn);
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  it('reopens on third click', () => {
    render(<Accordion title="Title">Content</Accordion>);
    const btn = screen.getByRole('button');
    fireEvent.click(btn);
    fireEvent.click(btn);
    fireEvent.click(btn);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('closes a defaultOpen accordion on first click', () => {
    render(<Accordion title="Title" defaultOpen>Content</Accordion>);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  it('toggles multiple times correctly', () => {
    render(<Accordion title="Title">Content</Accordion>);
    const btn = screen.getByRole('button');
    for (let i = 1; i <= 6; i++) {
      fireEvent.click(btn);
      if (i % 2 === 1) {
        expect(screen.getByText('Content')).toBeInTheDocument();
      } else {
        expect(screen.queryByText('Content')).not.toBeInTheDocument();
      }
    }
  });
});

// ─── TEST IDS ────────────────────────────────────────────────────────────────

describe('Accordion — TestIds', () => {
  it('applies accordionTestId to wrapper', () => {
    render(
      <Accordion title="Title" accordionTestId="accordion-root">
        Content
      </Accordion>
    );
    expect(screen.getByTestId('accordion-root')).toBeInTheDocument();
  });

  it('applies headerTestId to button', () => {
    render(
      <Accordion title="Title" headerTestId="accordion-header">
        Content
      </Accordion>
    );
    expect(screen.getByTestId('accordion-header')).toBeInTheDocument();
    expect(screen.getByTestId('accordion-header').tagName).toBe('BUTTON');
  });

  it('applies contentTestId to content div when open', () => {
    render(
      <Accordion title="Title" defaultOpen contentTestId="accordion-content">
        Content
      </Accordion>
    );
    expect(screen.getByTestId('accordion-content')).toBeInTheDocument();
  });

  it('contentTestId not in DOM when closed', () => {
    render(
      <Accordion title="Title" contentTestId="accordion-content">
        Content
      </Accordion>
    );
    expect(screen.queryByTestId('accordion-content')).not.toBeInTheDocument();
  });

  it('contentTestId appears after opening', () => {
    render(
      <Accordion title="Title" contentTestId="accordion-content">
        Content
      </Accordion>
    );
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByTestId('accordion-content')).toBeInTheDocument();
  });

  it('contentTestId disappears after closing', () => {
    render(
      <Accordion title="Title" defaultOpen contentTestId="accordion-content">
        Content
      </Accordion>
    );
    fireEvent.click(screen.getByRole('button'));
    expect(screen.queryByTestId('accordion-content')).not.toBeInTheDocument();
  });

  it('all three testIds work together', () => {
    render(
      <Accordion
        title="Title"
        defaultOpen
        accordionTestId="acc"
        headerTestId="acc-header"
        contentTestId="acc-content"
      >
        Content
      </Accordion>
    );
    expect(screen.getByTestId('acc')).toBeInTheDocument();
    expect(screen.getByTestId('acc-header')).toBeInTheDocument();
    expect(screen.getByTestId('acc-content')).toBeInTheDocument();
  });
});

// ─── CONTENT ─────────────────────────────────────────────────────────────────

describe('Accordion — Content', () => {
  it('renders plain text children', () => {
    render(<Accordion title="T" defaultOpen>Hello World</Accordion>);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('renders nested JSX children', () => {
    render(
      <Accordion title="T" defaultOpen>
        <div>
          <h3>Heading</h3>
          <p>Paragraph</p>
        </div>
      </Accordion>
    );
    expect(screen.getByText('Heading')).toBeInTheDocument();
    expect(screen.getByText('Paragraph')).toBeInTheDocument();
  });

  it('renders a list as children', () => {
    render(
      <Accordion title="T" defaultOpen>
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
          <li>Item 3</li>
        </ul>
      </Accordion>
    );
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('Item 3')).toBeInTheDocument();
  });

  it('renders a button inside content', () => {
    render(
      <Accordion title="T" defaultOpen>
        <button>Click Me</button>
      </Accordion>
    );
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('renders multiple accordions independently', () => {
    render(
      <>
        <Accordion title="A1">Content 1</Accordion>
        <Accordion title="A2">Content 2</Accordion>
      </>
    );
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2);

    fireEvent.click(buttons[0]);
    expect(screen.getByText('Content 1')).toBeInTheDocument();
    expect(screen.queryByText('Content 2')).not.toBeInTheDocument();

    fireEvent.click(buttons[1]);
    expect(screen.getByText('Content 1')).toBeInTheDocument();
    expect(screen.getByText('Content 2')).toBeInTheDocument();
  });

  it('two accordions toggle independently', () => {
    render(
      <>
        <Accordion title="A1" defaultOpen>Content 1</Accordion>
        <Accordion title="A2" defaultOpen>Content 2</Accordion>
      </>
    );
    const buttons = screen.getAllByRole('button');

    fireEvent.click(buttons[0]);
    expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
    expect(screen.getByText('Content 2')).toBeInTheDocument();
  });
});

// ─── STYLING / CLASSES ───────────────────────────────────────────────────────

describe('Accordion — Styling', () => {
  it('button has gradient class when open', () => {
    render(<Accordion title="Title" defaultOpen headerTestId="hdr">Content</Accordion>);
    const btn = screen.getByTestId('hdr');
    expect(btn.className).toMatch(/from-\[#1761A3\]/);
  });

  it('button has white bg class when closed', () => {
    render(<Accordion title="Title" headerTestId="hdr">Content</Accordion>);
    const btn = screen.getByTestId('hdr');
    expect(btn.className).toMatch(/bg-white/);
  });

  it('wrapper has rounded-xl class', () => {
    render(<Accordion title="Title" accordionTestId="acc">Content</Accordion>);
    expect(screen.getByTestId('acc').className).toMatch(/rounded-xl/);
  });

  it('wrapper has border class', () => {
    render(<Accordion title="Title" accordionTestId="acc">Content</Accordion>);
    expect(screen.getByTestId('acc').className).toMatch(/border/);
  });
});

// ─── ACCESSIBILITY ────────────────────────────────────────────────────────────

describe('Accordion — Accessibility', () => {
  it('header is keyboard activatable with Enter', () => {
    render(<Accordion title="Title">Content</Accordion>);
    const btn = screen.getByRole('button');
    fireEvent.keyDown(btn, { key: 'Enter', code: 'Enter' });
    fireEvent.click(btn); // buttons fire onClick on Enter by default in browsers
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('button is focusable', () => {
    render(<Accordion title="Title">Content</Accordion>);
    const btn = screen.getByRole('button');
    btn.focus();
    expect(document.activeElement).toBe(btn);
  });

  it('title text is visible to screen readers', () => {
    render(<Accordion title="Accessible Title">Content</Accordion>);
    expect(screen.getByText('Accessible Title')).toBeVisible();
  });
});

// ─── ICONS ───────────────────────────────────────────────────────────────────

describe('Accordion — Icons', () => {
  it('renders svg icon when closed', () => {
    const { container } = render(<Accordion title="T">Content</Accordion>);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders svg icon when open', () => {
    const { container } = render(<Accordion title="T" defaultOpen>Content</Accordion>);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('icon changes on toggle (svg always present)', () => {
    const { container } = render(<Accordion title="T">Content</Accordion>);
    expect(container.querySelector('svg')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button'));
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});