/**
 * File: src/__tests__/app/accordion/page.test.tsx
 *
 * Goal:
 * - Test Accordion demo page: src/app/accordion/page.tsx
 * - Mock Accordion/CodePreview/PropsTable
 * - Keep it brittle so changes to the demo require test updates.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// -------------------- Mocks --------------------

// The page imports:
//   import { Accordion } from "@/components/accordion";
// Jest in testbed might not resolve that alias to the library, so use a VIRTUAL mock.
jest.mock(
  '@/components/accordion',
  () => {
    const React = require('react');

    const Accordion = ({ title, defaultOpen, children }: any) => {
      return (
        <div
          data-testid="accordion"
          data-title={String(title)}
          data-defaultopen={String(!!defaultOpen)}
        >
          <div data-testid="accordion-title">{title}</div>
          <div data-testid="accordion-children">{children}</div>
        </div>
      );
    };

    return { __esModule: true, Accordion };
  },
  { virtual: true }
);

// Capture PropsTable props so we can assert the exact contract.
type PropsTableCapture = { title?: string; props?: any[] };
const propsTableCalls: PropsTableCapture[] = [];

jest.mock('../../../app/PropsTable', () => {
  const React = require('react');

  const PropsTable = (props: any) => {
    propsTableCalls.push({ title: props?.title, props: props?.props });
    return <div data-testid="props-table" data-title={String(props?.title ?? '')} />;
  };

  return { __esModule: true, PropsTable };
});

// Capture CodePreview calls AND render preview so Accordion JSX actually appears in the DOM.
type CodePreviewCapture = { title?: string; code?: string; preview?: any };
const codePreviewCalls: CodePreviewCapture[] = [];

jest.mock('../../../app/CodePreview', () => {
  const React = require('react');

  const CodePreview = (props: any) => {
    codePreviewCalls.push({ title: props?.title, code: props?.code, preview: props?.preview });

    return (
      <div data-testid="code-preview" data-title={String(props?.title ?? '')}>
        {/* Render preview so nested components (Accordion) appear */}
        <div data-testid="code-preview-preview">{props?.preview}</div>
      </div>
    );
  };

  return { __esModule: true, CodePreview };
});

// -------------------- Module Under Test --------------------
import AccordionPage from '../../../app/accordion/page';

// -------------------- Tests --------------------
describe('app/accordion/page.tsx (Accordion demo)', () => {
  beforeEach(() => {
    propsTableCalls.length = 0;
    codePreviewCalls.length = 0;
  });

  it('renders the page header (stable text)', () => {
    render(<AccordionPage />);

    expect(screen.getByRole('heading', { name: 'Accordion' })).toBeInTheDocument();
    expect(
      screen.getByText('Accordions allow users to expand and collapse sections of related content.')
    ).toBeInTheDocument();
  });

  it('renders PropsTable with the exact props contract (brittle on purpose)', () => {
    render(<AccordionPage />);

    expect(screen.getAllByTestId('props-table')).toHaveLength(1);
    expect(propsTableCalls).toHaveLength(1);

    const call = propsTableCalls[0];
    expect(call.title).toBe('Props');
    expect(Array.isArray(call.props)).toBe(true);

    expect(call.props).toEqual([
      { name: 'title', type: 'string', default: '-', description: 'Accordion header title' },
      {
        name: 'defaultOpen',
        type: 'boolean',
        default: 'false',
        description: 'Opens the accordion by default',
      },
      { name: 'children', type: 'ReactNode', default: '-', description: 'Content displayed inside the accordion' },
      { name: 'className', type: 'string', default: '-', description: 'Custom class name for styling the accordion' },
      {
        name: 'headerClassName',
        type: 'string',
        default: '-',
        description: 'Custom class name for the accordion header',
      },
      {
        name: 'contentClassName',
        type: 'string',
        default: '-',
        description: 'Custom class name for the accordion content',
      },
      { name: 'icon', type: 'ReactNode', default: '-', description: 'Custom icon displayed in the accordion header' },
      {
        name: 'iconPosition',
        type: `"left" | "right"`,
        default: `"right"`,
        description: 'Position of the accordion icon',
      },
      {
        name: 'onToggle',
        type: '(open: boolean) => void',
        default: '-',
        description: 'Callback triggered when accordion is opened or closed',
      },
    ]);
  });

  it('renders the expected CodePreview sections (stable titles + code strings)', () => {
    render(<AccordionPage />);

    const previews = screen.getAllByTestId('code-preview');
    expect(previews).toHaveLength(6);
    expect(codePreviewCalls).toHaveLength(6);

    const titles = codePreviewCalls.map((c) => c.title);
    expect(titles).toEqual([
      'Basic Accordion',
      'Accordion with Multiple Items',
      'Nested Accordion',
      'Disabled Accordion',
      'Accordion Group',
      'Accordion with Long Content',
    ]);

    const codeStrings = codePreviewCalls.map((c) => String(c.code ?? '').trim());

    expect(codeStrings[0]).toBe(
      `
<Accordion title="Accordion Item 1" defaultOpen>
  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
</Accordion>
        `.trim()
    );

    expect(codeStrings[1]).toBe(
      `
<Accordion title="Accordion Item 1" defaultOpen />
<Accordion title="Accordion Item 2" />
<Accordion title="Accordion Item 3" />
<Accordion title="Accordion Item 4" />
        `.trim()
    );

    expect(codeStrings[2]).toBe(
      `
<Accordion title="Parent Accordion" defaultOpen>
  <Accordion title="Child 1" />
  <Accordion title="Child 2" />
</Accordion>
        `.trim()
    );

    expect(codeStrings[3]).toBe(
      `
<Accordion title="Enabled Accordion">
  This accordion is enabled.
</Accordion>
 
<div className="opacity-60 grayscale cursor-not-allowed">
<Accordion title="Disabled Accordion">
  This accordion is disabled.
</Accordion>
</div>
`.trim()
    );

    expect(codeStrings[4]).toBe(
      `
<Accordion title="Question 1">Answer 1</Accordion>
<Accordion title="Question 2">Answer 2</Accordion>
<Accordion title="Question 3">Answer 3</Accordion>
`.trim()
    );

    expect(codeStrings[5]).toBe(
      `
<Accordion title="accordion">
  Long content goes here...
</Accordion>
`.trim()
    );
  });

  it('smoke-checks that preview JSX creates expected Accordion titles', () => {
    render(<AccordionPage />);

    const allAccordions = screen.getAllByTestId('accordion');
    expect(allAccordions.length).toBeGreaterThanOrEqual(10);

    const titles = allAccordions.map((el) => el.getAttribute('data-title'));

    expect(titles).toEqual(expect.arrayContaining(['Accordion Item 1']));
    expect(titles).toEqual(expect.arrayContaining(['Accordion Item 2']));
    expect(titles).toEqual(expect.arrayContaining(['Accordion Item 3']));
    expect(titles).toEqual(expect.arrayContaining(['Parent Accordion']));
    expect(titles).toEqual(expect.arrayContaining(['Child Accordion 1']));
    expect(titles).toEqual(expect.arrayContaining(['Child Accordion 2']));
    expect(titles).toEqual(expect.arrayContaining(['Enabled Accordion']));
    expect(titles).toEqual(expect.arrayContaining(['Disabled Accordion']));
    expect(titles).toEqual(expect.arrayContaining(['Question 1']));
    expect(titles).toEqual(expect.arrayContaining(['Question 2']));
    expect(titles).toEqual(expect.arrayContaining(['Question 3']));
    expect(titles).toEqual(expect.arrayContaining(['Accordion']));
  });

  it('ensures defaultOpen is used where expected (brittle)', () => {
    render(<AccordionPage />);

    const accordions = screen.getAllByTestId('accordion');

    const byTitle = (t: string) => accordions.filter((el) => el.getAttribute('data-title') === t);

    // "Accordion Item 1" appears more than once; at least one must be defaultOpen=true.
    const item1 = byTitle('Accordion Item 1');
    expect(item1.length).toBeGreaterThan(0);
    expect(item1.some((el) => el.getAttribute('data-defaultopen') === 'true')).toBe(true);

    const parent = byTitle('Parent Accordion')[0];
    expect(parent).toBeTruthy();
    expect(parent.getAttribute('data-defaultopen')).toBe('true');

    const enabled = byTitle('Enabled Accordion')[0];
    expect(enabled).toBeTruthy();
    expect(enabled.getAttribute('data-defaultopen')).toBe('false');
  });
});