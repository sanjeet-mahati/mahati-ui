import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// ─── Mock @heroicons ──────────────────────────────────────────────────────────
jest.mock('@heroicons/react/24/solid', () => ({
  InformationCircleIcon:  ({ className }: any) => <svg data-testid="info-icon"      className={className} />,
  UserIcon:               ({ className }: any) => <svg data-testid="user-icon"      className={className} />,
  ExclamationTriangleIcon:({ className }: any) => <svg data-testid="warning-icon"   className={className} />,
  SparklesIcon:           ({ className }: any) => <svg data-testid="sparkles-icon"  className={className} />,
}));

// ─── Mock @mahatisystems/mahati-ui-components ─────────────────────────────────────────────────────────
jest.mock('@mahatisystems/mahati-ui-components', () => ({
  MahatiTooltip: ({ text, position, variant, image, animation, children, testId }: any) => (
    <div
      data-testid={testId || 'mahati-tooltip'}
      data-position={position}
      data-variant={variant}
      data-has-image={!!image}
      data-has-animation={!!animation}
    >
      {children}
      {text && <span data-testid="tooltip-text">{text}</span>}
    </div>
  ),
  MahatiConfettiExplosion: (props: any) => (
    <div data-testid="confetti-explosion" {...props} />
  ),
  MahatiRealisticConfetti: (props: any) => (
    <div data-testid="realistic-confetti" {...props} />
  ),
}));

// ─── Mock CodePreview ─────────────────────────────────────────────────────────
// From src/__tests__/app/tooltip/, CodePreview lives at src/app/CodePreview
// Use @/ alias so moduleNameMapper handles it correctly
jest.mock('@/app/CodePreview', () => ({
  CodePreview: ({ title, preview, code, description }: any) => (
    <div data-testid={`code-preview-${title?.toLowerCase().replace(/[\s&/]+/g, '-').replace(/[^a-z0-9-]/g, '')}`}>
      <h3>{title}</h3>
      {description && <p data-testid="section-description">{description}</p>}
      <div data-testid="preview-area">{preview}</div>
      <pre data-testid="code-block">{code}</pre>
    </div>
  ),
}));

// ─── Mock PropsTable ──────────────────────────────────────────────────────────
jest.mock('@/app/PropsTable', () => ({
  PropsTable: ({ title, props: propsList }: any) => (
    <div data-testid={`props-table-${title?.toLowerCase().replace(/\s+/g, '-')}`}>
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

// ─── Import page component ────────────────────────────────────────────────────
// From src/__tests__/app/tooltip/, the page is at src/app/tooltip/page
import TooltipDemo from '../../../app/tooltip/page';

// ═══════════════════════════════════════════════════════════════════════════════
// Render
// ═══════════════════════════════════════════════════════════════════════════════

describe('TooltipDemo — Render', () => {
  it('renders without crashing', () => {
    const { container } = render(<TooltipDemo />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders page heading "Tooltips"', () => {
    render(<TooltipDemo />);
    expect(screen.getByText('Tooltips')).toBeInTheDocument();
  });

  it('renders page description text', () => {
    render(<TooltipDemo />);
    expect(screen.getByText(/small contextual information boxes/i)).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Props tables
// ═══════════════════════════════════════════════════════════════════════════════

describe('TooltipDemo — PropsTable', () => {
  it('renders MahatiTooltip Props table', () => {
    render(<TooltipDemo />);
    expect(screen.getByTestId('props-table-mahatitooltip-props')).toBeInTheDocument();
  });

  it('renders MahatiConfettiExplosion Props table', () => {
    render(<TooltipDemo />);
    expect(screen.getByTestId('props-table-mahaticonfettiexplosion-props')).toBeInTheDocument();
  });

  it('renders MahatiRealisticConfetti Props table', () => {
    render(<TooltipDemo />);
   
 expect(screen.getByTestId('props-table-mahatirealisticconfetti-props')).toBeInTheDocument();
  });

  it('shows text prop', () => {
    render(<TooltipDemo />);
    expect(screen.getByTestId('prop-text')).toBeInTheDocument();
  });

  it('shows position prop', () => {
    render(<TooltipDemo />);
    expect(screen.getByTestId('prop-position')).toBeInTheDocument();
  });

  it('shows variant prop', () => {
    render(<TooltipDemo />);
    expect(screen.getByTestId('prop-variant')).toBeInTheDocument();
  });

  it('shows image prop', () => {
    render(<TooltipDemo />);
    expect(screen.getByTestId('prop-image')).toBeInTheDocument();
  });

  it('shows animation prop', () => {
    render(<TooltipDemo />);
    expect(screen.getByTestId('prop-animation')).toBeInTheDocument();
  });

  it('shows children prop', () => {
    render(<TooltipDemo />);
    expect(screen.getByTestId('prop-children')).toBeInTheDocument();
  });

  it('shows particleCount prop', () => {
    render(<TooltipDemo />);
    expect(screen.getAllByTestId('prop-particleCount').length).toBeGreaterThan(0);
  });

  it('shows colors prop', () => {
    render(<TooltipDemo />);
    expect(screen.getAllByTestId('prop-colors').length).toBeGreaterThan(0);
  });

  it('shows explosionForce prop', () => {
    render(<TooltipDemo />);
    expect(screen.getAllByTestId('prop-explosionForce').length).toBeGreaterThan(0);
  });

  it('shows duration prop (MahatiConfettiExplosion)', () => {
    render(<TooltipDemo />);
    expect(screen.getByTestId('prop-duration')).toBeInTheDocument();
  });

  it('shows spread prop (MahatiRealisticConfetti)', () => {
    render(<TooltipDemo />);
    expect(screen.getByTestId('prop-spread')).toBeInTheDocument();
  });

  it('shows size prop (MahatiRealisticConfetti)', () => {
    render(<TooltipDemo />);
    expect(screen.getByTestId('prop-size')).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// CodePreview sections
// ═══════════════════════════════════════════════════════════════════════════════

describe('TooltipDemo — CodePreview Sections', () => {
  it('renders Basic section', () => {
    render(<TooltipDemo />);
    expect(screen.getByText('Basic')).toBeInTheDocument();
  });

  it('renders Transparent Background section', () => {
    render(<TooltipDemo />);
    expect(screen.getByText('Transparent Background')).toBeInTheDocument();
  });

  it('renders Image & GIF section', () => {
    render(<TooltipDemo />);
    expect(screen.getByText('Image & GIF')).toBeInTheDocument();
  });

  it('renders Custom Border section', () => {
    render(<TooltipDemo />);
    expect(screen.getByText('Custom Border')).toBeInTheDocument();
  });

  it('renders Sparkles section', () => {
    render(<TooltipDemo />);
    expect(screen.getByText('Sparkles')).toBeInTheDocument();
  });

  it('renders Positions section', () => {
    render(<TooltipDemo />);
    expect(screen.getByText('Positions')).toBeInTheDocument();
  });

  it('renders Text Content section', () => {
    render(<TooltipDemo />);
    expect(screen.getByText('Text Content')).toBeInTheDocument();
  });

  it('renders Interactive Elements section', () => {
    render(<TooltipDemo />);
    expect(screen.getByText('Interactive Elements')).toBeInTheDocument();
  });

  it('renders Celebration section', () => {
    render(<TooltipDemo />);
    expect(screen.getByText('Celebration')).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// MahatiTooltip instances
// ═══════════════════════════════════════════════════════════════════════════════

describe('TooltipDemo — MahatiTooltip Instances', () => {
  it('renders multiple MahatiTooltip instances', () => {
    render(<TooltipDemo />);
    const tooltips = screen.getAllByTestId('mahati-tooltip');
    expect(tooltips.length).toBeGreaterThan(5);
  });

  it('renders tooltip with top position', () => {
    render(<TooltipDemo />);
    const tooltips = screen.getAllByTestId('mahati-tooltip');
    const topTooltip = tooltips.find(t => t.getAttribute('data-position') === 'top');
    expect(topTooltip).toBeInTheDocument();
  });

  it('renders tooltip with bottom position', () => {
    render(<TooltipDemo />);
    const tooltips = screen.getAllByTestId('mahati-tooltip');
    const bottomTooltip = tooltips.find(t => t.getAttribute('data-position') === 'bottom');
    expect(bottomTooltip).toBeInTheDocument();
  });

  it('renders tooltip with left position', () => {
    render(<TooltipDemo />);
    const tooltips = screen.getAllByTestId('mahati-tooltip');
    const leftTooltip = tooltips.find(t => t.getAttribute('data-position') === 'left');
    expect(leftTooltip).toBeInTheDocument();
  });

  it('renders tooltip with right position', () => {
    render(<TooltipDemo />);
    const tooltips = screen.getAllByTestId('mahati-tooltip');
    const rightTooltip = tooltips.find(t => t.getAttribute('data-position') === 'right');
    expect(rightTooltip).toBeInTheDocument();
  });

  it('renders transparent variant tooltip', () => {
    render(<TooltipDemo />);
    const tooltips = screen.getAllByTestId('mahati-tooltip');
    const transparentTooltip = tooltips.find(t => t.getAttribute('data-variant') === 'transparent');
    expect(transparentTooltip).toBeInTheDocument();
  });

  it('renders tooltip with image prop', () => {
    render(<TooltipDemo />);
    const tooltips = screen.getAllByTestId('mahati-tooltip');
    const imageTooltip = tooltips.find(t => t.getAttribute('data-has-image') === 'true');
    expect(imageTooltip).toBeInTheDocument();
  });

  it('renders tooltip with animation prop (celebration)', () => {
    render(<TooltipDemo />);
    const tooltips = screen.getAllByTestId('mahati-tooltip');
    const animatedTooltip = tooltips.find(t => t.getAttribute('data-has-animation') === 'true');
    expect(animatedTooltip).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Tooltip text content
// ═══════════════════════════════════════════════════════════════════════════════

describe('TooltipDemo — Tooltip Text Content', () => {
  it('renders "This is an information tooltip" text', () => {
    render(<TooltipDemo />);
    expect(screen.getByText('This is an information tooltip')).toBeInTheDocument();
  });

  it('renders "Click to save changes" text', () => {
    render(<TooltipDemo />);
    expect(screen.getByText('Click to save changes')).toBeInTheDocument();
  });

  it('renders "Tooltip on top" text', () => {
    render(<TooltipDemo />);
    expect(screen.getByText('Tooltip on top')).toBeInTheDocument();
  });

  it('renders "Tooltip on bottom" text', () => {
    render(<TooltipDemo />);
    expect(screen.getByText('Tooltip on bottom')).toBeInTheDocument();
  });

  it('renders "Tooltip on left" text', () => {
    render(<TooltipDemo />);
    expect(screen.getByText('Tooltip on left')).toBeInTheDocument();
  });

  it('renders "Tooltip on right" text', () => {
    render(<TooltipDemo />);
    expect(screen.getByText('Tooltip on right')).toBeInTheDocument();
  });

  it('renders birthday celebration tooltip text', () => {
    render(<TooltipDemo />);
    expect(screen.getByText("🎂 Happy Birthday! Let's celebrate!")).toBeInTheDocument();
  });

  it('renders HTML abbreviation tooltip text', () => {
    render(<TooltipDemo />);
    expect(screen.getByText('HyperText Markup Language')).toBeInTheDocument();
  });

  it('renders CSS abbreviation tooltip text', () => {
    render(<TooltipDemo />);
    expect(screen.getByText('Cascading Style Sheets')).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Preview content elements
// ═══════════════════════════════════════════════════════════════════════════════

describe('TooltipDemo — Preview Content', () => {
  it('renders Save button in basic tooltip preview', () => {
    render(<TooltipDemo />);
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('renders Icon Tooltip label', () => {
    render(<TooltipDemo />);
    expect(screen.getByText('Icon Tooltip')).toBeInTheDocument();
  });

  it('renders Button Tooltip label', () => {
    render(<TooltipDemo />);
    expect(screen.getByText('Button Tooltip')).toBeInTheDocument();
  });

  it('renders Top Position label', () => {
    render(<TooltipDemo />);
    expect(screen.getByText('Top Position')).toBeInTheDocument();
  });

  it('renders Bottom Position label', () => {
    render(<TooltipDemo />);
    expect(screen.getByText('Bottom Position')).toBeInTheDocument();
  });

  it('renders Left Position label', () => {
    render(<TooltipDemo />);
    expect(screen.getByText('Left Position')).toBeInTheDocument();
  });

  it('renders Right Position label', () => {
    render(<TooltipDemo />);
    expect(screen.getByText('Right Position')).toBeInTheDocument();
  });

  it('renders Image Tooltip label', () => {
    render(<TooltipDemo />);
    expect(screen.getByText('Image Tooltip')).toBeInTheDocument();
  });

  it('renders HTML abbreviation in text content', () => {
    render(<TooltipDemo />);
    expect(screen.getByText('HTML')).toBeInTheDocument();
  });

  it('renders CSS abbreviation in text content', () => {
    render(<TooltipDemo />);
    expect(screen.getByText('CSS')).toBeInTheDocument();
  });

  it('renders AI abbreviation in text content', () => {
    render(<TooltipDemo />);
    expect(screen.getByText('AI')).toBeInTheDocument();
  });

  it('renders Birthday celebration trigger', () => {
    render(<TooltipDemo />);
    expect(screen.getByText('🎂 Birthday')).toBeInTheDocument();
  });

  it('renders Congratulations button', () => {
    render(<TooltipDemo />);
    expect(screen.getByText('🥳 Congratulations')).toBeInTheDocument();
  });

  it('renders Mahati welcome text', () => {
    render(<TooltipDemo />);
    expect(screen.getAllByText('Mahati').length).toBeGreaterThan(0);
  });

  it('renders Proceed to Payment disabled button', () => {
    render(<TooltipDemo />);
    const btn = screen.getByText('Proceed to Payment').closest('button');
    expect(btn).toBeDisabled();
  });

  it('renders Username form field', () => {
    render(<TooltipDemo />);
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
  });

  it('renders hero icons', () => {
    render(<TooltipDemo />);
    expect(screen.getAllByTestId('info-icon').length).toBeGreaterThan(0);
    expect(screen.getAllByTestId('warning-icon').length).toBeGreaterThan(0);
    expect(screen.getAllByTestId('sparkles-icon').length).toBeGreaterThan(0);
  });
});

describe('TooltipDemo — Code Snippets', () => {
  it('renders MahatiTooltip in basic code snippet', () => {
    render(<TooltipDemo />);
    expect(screen.getAllByText(/MahatiTooltip/).length).toBeGreaterThan(0);
  });

  it('renders position="top" in code snippets', () => {
    render(<TooltipDemo />);
    expect(screen.getAllByText(/position="top"/).length).toBeGreaterThan(0);
  });

  it('renders variant="transparent" in code snippet', () => {
    render(<TooltipDemo />);
    expect(screen.getAllByText(/variant="transparent"/).length).toBeGreaterThan(0);
  });

  it('renders animation config in celebration code snippet', () => {
    render(<TooltipDemo />);
    expect(screen.getAllByText(/MahatiConfettiExplosion/).length).toBeGreaterThan(0);
  });
});

