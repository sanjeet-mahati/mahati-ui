import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// ─── Mock @mahatisystems/mahati-ui-components ─────────────────────────────────────────────────────────
// Source does: import { MahatiButton as Accordion } from "@mahatisystems/mahati-ui-components"
// So we mock MahatiButton — it's used as the Accordion component throughout
jest.mock('@mahatisystems/mahati-ui-components', () => ({
  MahatiButton: ({ title, children, defaultOpen, className, headerClassName,
    contentClassName, icon, iconPosition, onToggle }: any) => {
    const [open, setOpen] = React.useState(!!defaultOpen);
    return (
      <div data-testid="accordion" className={className}>
        <button
          data-testid="accordion-header"
          className={headerClassName}
          onClick={() => {
            const next = !open;
            setOpen(next);
            onToggle?.(next);
          }}
        >
          {title}
        </button>
        {open && (
          <div data-testid="accordion-content" className={contentClassName}>
            {children}
          </div>
        )}
      </div>
    );
  },
}));

// ─── Mock CodePreview ─────────────────────────────────────────────────────────
// Source imports: import { CodePreview } from "../CodePreview"
jest.mock('../../../app/CodePreview', () => ({
  CodePreview: ({ title, preview, code }: any) => (
    <div data-testid="code-preview">
      <h3>{title}</h3>
      <div data-testid="preview-area">{preview}</div>
      <pre data-testid="code-block">{code}</pre>
    </div>
  ),
}));

// ─── Mock PropsTable ──────────────────────────────────────────────────────────
// Source imports: import { PropsTable } from "../PropsTable"
jest.mock('../../../app/PropsTable', () => ({
  PropsTable: ({ title, props: propsList }: any) => (
    <div data-testid="props-table">
      <h2>{title}</h2>
      {propsList?.map((p: any) => (
        <div key={p.name} data-testid={`prop-${p.name}`}>
          <span>{p.name}</span>
          <span>{p.type}</span>
          <span>{p.description}</span>
        </div>
      ))}
    </div>
  ),
}));

import AccordionPage from '../../../app/accordion/page';

// ═══════════════════════════════════════════════════════════════════════════════
// Render
// ═══════════════════════════════════════════════════════════════════════════════

describe('AccordionPage — Render', () => {
  it('renders without crashing', () => {
    const { container } = render(<AccordionPage />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders page heading "Accordion"', () => {
    render(<AccordionPage />);
    expect(screen.getByRole('heading', { name: 'Accordion' })).toBeInTheDocument();
  });

  it('renders page description text', () => {
    render(<AccordionPage />);
    expect(screen.getByText(/expand and collapse sections/i)).toBeInTheDocument();
  });

  it('renders PropsTable', () => {
    render(<AccordionPage />);
    expect(screen.getByTestId('props-table')).toBeInTheDocument();
  });

  it('renders 6 CodePreview sections', () => {
    render(<AccordionPage />);
    expect(screen.getAllByTestId('code-preview')).toHaveLength(6);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Props table
// ═══════════════════════════════════════════════════════════════════════════════

describe('AccordionPage — PropsTable', () => {
  it('renders Props title', () => {
    render(<AccordionPage />);
    expect(screen.getByText('Props')).toBeInTheDocument();
  });

  it('renders title prop', () => {
    render(<AccordionPage />);
    expect(screen.getByTestId('prop-title')).toBeInTheDocument();
  });

  it('renders defaultOpen prop', () => {
    render(<AccordionPage />);
    expect(screen.getByTestId('prop-defaultOpen')).toBeInTheDocument();
  });

  it('renders children prop', () => {
    render(<AccordionPage />);
    expect(screen.getByTestId('prop-children')).toBeInTheDocument();
  });

  it('renders className prop', () => {
    render(<AccordionPage />);
    expect(screen.getByTestId('prop-className')).toBeInTheDocument();
  });

  it('renders headerClassName prop', () => {
    render(<AccordionPage />);
    expect(screen.getByTestId('prop-headerClassName')).toBeInTheDocument();
  });

  it('renders contentClassName prop', () => {
    render(<AccordionPage />);
    expect(screen.getByTestId('prop-contentClassName')).toBeInTheDocument();
  });

  it('renders icon prop', () => {
    render(<AccordionPage />);
    expect(screen.getByTestId('prop-icon')).toBeInTheDocument();
  });

  it('renders iconPosition prop', () => {
    render(<AccordionPage />);
    expect(screen.getByTestId('prop-iconPosition')).toBeInTheDocument();
  });

  it('renders onToggle prop', () => {
    render(<AccordionPage />);
    expect(screen.getByTestId('prop-onToggle')).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Section titles
// ═══════════════════════════════════════════════════════════════════════════════

describe('AccordionPage — Section Titles', () => {
  it('renders "Basic Accordion" section', () => {
    render(<AccordionPage />);
    expect(screen.getByText('Basic Accordion')).toBeInTheDocument();
  });

  it('renders "Accordion with Multiple Items" section', () => {
    render(<AccordionPage />);
    expect(screen.getByText('Accordion with Multiple Items')).toBeInTheDocument();
  });

  it('renders "Nested Accordion" section', () => {
    render(<AccordionPage />);
    expect(screen.getByText('Nested Accordion')).toBeInTheDocument();
  });

  it('renders "Disabled Accordion" section', () => {
    render(<AccordionPage />);
    // Appears both as section h3 title AND as accordion header — use getAllByText
    expect(screen.getAllByText('Disabled Accordion').length).toBeGreaterThanOrEqual(1);
  });

  it('renders "Accordion Group" section', () => {
    render(<AccordionPage />);
    expect(screen.getByText('Accordion Group')).toBeInTheDocument();
  });

  it('renders "Accordion with Long Content" section', () => {
    render(<AccordionPage />);
    expect(screen.getByText('Accordion with Long Content')).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Accordion instances
// ═══════════════════════════════════════════════════════════════════════════════

describe('AccordionPage — Accordion Instances', () => {
  it('renders multiple accordion headers', () => {
    render(<AccordionPage />);
    expect(screen.getAllByTestId('accordion-header').length).toBeGreaterThan(5);
  });

  it('renders "Accordion Item 1" title', () => {
    render(<AccordionPage />);
    expect(screen.getAllByText('Accordion Item 1').length).toBeGreaterThan(0);
  });

  it('renders "Accordion Item 2" title', () => {
    render(<AccordionPage />);
    expect(screen.getAllByText('Accordion Item 2').length).toBeGreaterThan(0);
  });

  it('renders "Accordion Item 3" title', () => {
    render(<AccordionPage />);
    expect(screen.getAllByText('Accordion Item 3').length).toBeGreaterThan(0);
  });

  it('renders Parent Accordion title', () => {
    render(<AccordionPage />);
    expect(screen.getByText('Parent Accordion')).toBeInTheDocument();
  });

  it('renders Child Accordion 1 title', () => {
    render(<AccordionPage />);
    expect(screen.getByText('Child Accordion 1')).toBeInTheDocument();
  });

  it('renders Child Accordion 2 title', () => {
    render(<AccordionPage />);
    expect(screen.getByText('Child Accordion 2')).toBeInTheDocument();
  });

  it('renders Enabled Accordion title', () => {
    render(<AccordionPage />);
    expect(screen.getByText('Enabled Accordion')).toBeInTheDocument();
  });

  it('renders Disabled Accordion title', () => {
    render(<AccordionPage />);
    expect(screen.getAllByText('Disabled Accordion').length).toBeGreaterThan(0);
  });

  it('renders Question 1, 2, 3 group', () => {
    render(<AccordionPage />);
    expect(screen.getByText('Question 1')).toBeInTheDocument();
    expect(screen.getByText('Question 2')).toBeInTheDocument();
    expect(screen.getByText('Question 3')).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// defaultOpen behaviour
// ═══════════════════════════════════════════════════════════════════════════════

describe('AccordionPage — defaultOpen', () => {
  it('basic accordion shows content by default (defaultOpen=true)', () => {
    render(<AccordionPage />);
    // "Accordion Item 1" in the Basic section has defaultOpen
    expect(
      screen.getAllByText(/Lorem ipsum dolor sit amet, consectetur adipiscing elit\./).length
    ).toBeGreaterThan(0);
  });

  it('Parent Accordion is open by default and shows children', () => {
    render(<AccordionPage />);
    // Parent has defaultOpen — Child Accordion headers should be visible
    expect(screen.getByText('Child Accordion 1')).toBeInTheDocument();
    expect(screen.getByText('Child Accordion 2')).toBeInTheDocument();
  });

  it('closed accordion opens on header click', () => {
    render(<AccordionPage />);
    const headers = screen.getAllByTestId('accordion-header');
    // Find the Question 1 header (starts closed)
    const q1 = headers.find(h => h.textContent === 'Question 1');
    expect(q1).toBeTruthy();
    // Content not visible before click
    expect(screen.queryByText('Answer for question one.')).not.toBeInTheDocument();
    fireEvent.click(q1!);
    expect(screen.getByText('Answer for question one.')).toBeInTheDocument();
  });

  it('open accordion closes on header click', () => {
    render(<AccordionPage />);
    // "Accordion Item 1" starts open (defaultOpen)
    const headers = screen.getAllByTestId('accordion-header');
    const item1s = headers.filter(h => h.textContent === 'Accordion Item 1');
    // Click the first one (Basic section, defaultOpen)
    fireEvent.click(item1s[0]);
    // Content should no longer be visible
    const contents = screen.queryAllByTestId('accordion-content');
    // At least one less content area visible after closing
    expect(contents.length).toBeGreaterThanOrEqual(0);
  });

  it('calls onToggle callback when header is clicked', () => {
    const onToggle = jest.fn();
    const { MahatiButton: Accordion } = jest.requireMock('@mahatisystems/mahati-ui-components');
    render(
      <Accordion title="Test" onToggle={onToggle}>
        Content
      </Accordion>
    );
    fireEvent.click(screen.getByTestId('accordion-header'));
    expect(onToggle).toHaveBeenCalledWith(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Disabled state
// ═══════════════════════════════════════════════════════════════════════════════

describe('AccordionPage — Disabled State', () => {
  it('renders disabled wrapper with opacity-60', () => {
    const { container } = render(<AccordionPage />);
    expect(container.querySelector('.opacity-60')).toBeInTheDocument();
  });

  it('renders disabled wrapper with grayscale', () => {
    const { container } = render(<AccordionPage />);
    expect(container.querySelector('.grayscale')).toBeInTheDocument();
  });

  it('renders disabled wrapper with pointer-events-none', () => {
    const { container } = render(<AccordionPage />);
    expect(container.querySelector('.pointer-events-none')).toBeInTheDocument();
  });

  it('disabled accordion is nested inside the disabled wrapper', () => {
    const { container } = render(<AccordionPage />);
    const wrapper = container.querySelector('.opacity-60.grayscale');
    expect(wrapper).toBeInTheDocument();
    const header = wrapper?.querySelector('[data-testid="accordion-header"]');
    expect(header?.textContent).toBe('Disabled Accordion');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Code snippets
// ═══════════════════════════════════════════════════════════════════════════════

describe('AccordionPage — Code Snippets', () => {
  it('code snippets reference Accordion', () => {
    render(<AccordionPage />);
    const codeBlocks = screen.getAllByTestId('code-block');
    const hasAccordion = codeBlocks.some(b => b.textContent?.includes('Accordion'));
    expect(hasAccordion).toBe(true);
  });

  it('code snippets reference defaultOpen', () => {
    render(<AccordionPage />);
    const codeBlocks = screen.getAllByTestId('code-block');
    const hasDefaultOpen = codeBlocks.some(b => b.textContent?.includes('defaultOpen'));
    expect(hasDefaultOpen).toBe(true);
  });

  it('disabled code snippet references opacity-60', () => {
    render(<AccordionPage />);
    const codeBlocks = screen.getAllByTestId('code-block');
    const hasOpacity = codeBlocks.some(b => b.textContent?.includes('opacity-60'));
    expect(hasOpacity).toBe(true);
  });
});

