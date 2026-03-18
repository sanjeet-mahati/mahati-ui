import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// ─── Mock @heroicons ──────────────────────────────────────────────────────────
jest.mock('@heroicons/react/24/solid', () => ({
  HomeIcon:    ({ className }: any) => <svg data-testid="home-icon"     className={className} />,
  UserIcon:    ({ className }: any) => <svg data-testid="user-icon"     className={className} />,
  Cog6ToothIcon: ({ className }: any) => <svg data-testid="cog-icon"   className={className} />,
}));

// ─── Mock MahatiTabbedInterface ───────────────────────────────────────────────
jest.mock('@mahatisystems/mahati-ui-components', () => ({
  MahatiTabbedInterface: ({ tabs, variant, orientation, verticalPosition }: any) => (
    <div
      data-testid="mahati-tabbed-interface"
      data-variant={variant || 'underline'}
      data-orientation={orientation || 'horizontal'}
      data-vertical-position={verticalPosition}
    >
      {tabs?.map((tab: any, i: number) => (
        <div key={i} data-testid={`tab-${tab.label?.toLowerCase().replace(/\s+/g, '-')}`}>
          <span>{tab.label}</span>
          <div>{tab.icon}</div>
          <div data-testid={`tab-content-${i}`}>{tab.content}</div>
        </div>
      ))}
    </div>
  ),
}));

// ─── Mock CodePreview ─────────────────────────────────────────────────────────
jest.mock('../CodePreview', () => ({
  CodePreview: ({ title, preview, code }: any) => (
    <div data-testid={`code-preview-${title?.toLowerCase().replace(/\s+/g, '-')}`}>
      <h3>{title}</h3>
      <div data-testid="preview-area">{preview}</div>
      <pre>{code}</pre>
    </div>
  ),
}));

import TabDemoPage from '../../../app/tab/page';

// ═══════════════════════════════════════════════════════════════════════════════
// Render
// ═══════════════════════════════════════════════════════════════════════════════

describe('TabDemoPage — Render', () => {
  it('renders without crashing', () => {
    const { container } = render(<TabDemoPage />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders page heading "Tabs"', () => {
    render(<TabDemoPage />);
    expect(screen.getByText('Tabs')).toBeInTheDocument();
  });

  it('renders page description text', () => {
    render(<TabDemoPage />);
    expect(screen.getByText(/UI navigation pattern/i)).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// CodePreview sections
// ═══════════════════════════════════════════════════════════════════════════════

describe('TabDemoPage — Sections', () => {
  it('renders Basic Tabs section', () => {
    render(<TabDemoPage />);
    expect(screen.getByText('Basic Tabs')).toBeInTheDocument();
  });

  it('renders Outline Tabs section', () => {
    render(<TabDemoPage />);
    expect(screen.getByText('Outline Tabs')).toBeInTheDocument();
  });

  it('renders Pill Tabs section', () => {
    render(<TabDemoPage />);
    expect(screen.getByText('Pill Tabs')).toBeInTheDocument();
  });

  it('renders Dark Tabs section', () => {
    render(<TabDemoPage />);
    expect(screen.getByText('Dark Tabs')).toBeInTheDocument();
  });

  it('renders Underline Tabs section', () => {
    render(<TabDemoPage />);
    expect(screen.getByText('Underline Tabs')).toBeInTheDocument();
  });

  it('renders Shadow Tabs section', () => {
    render(<TabDemoPage />);
    expect(screen.getByText('Shadow Tabs')).toBeInTheDocument();
  });

  it('renders Glass Tabs section', () => {
    render(<TabDemoPage />);
    expect(screen.getByText('Glass Tabs')).toBeInTheDocument();
  });

  it('renders Gradient Tabs section', () => {
    render(<TabDemoPage />);
    expect(screen.getByText('Gradient Tabs')).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Description texts
// ═══════════════════════════════════════════════════════════════════════════════

describe('TabDemoPage — Section Descriptions', () => {
  it('renders description for basic tabs', () => {
    render(<TabDemoPage />);
    expect(screen.getByText(/Simple horizontal tabs/i)).toBeInTheDocument();
  });

  it('renders description for outline tabs', () => {
    render(<TabDemoPage />);
    expect(screen.getByText(/thin borders/i)).toBeInTheDocument();
  });

  it('renders description for pill tabs', () => {
    render(<TabDemoPage />);
    expect(screen.getByText(/pill-shaped button/i)).toBeInTheDocument();
  });

  it('renders description for dark tabs', () => {
    render(<TabDemoPage />);
    expect(screen.getByText(/dark-themed dashboards/i)).toBeInTheDocument();
  });

  it('renders description for underline tabs', () => {
    render(<TabDemoPage />);
    expect(screen.getByText(/smooth underline animation/i)).toBeInTheDocument();
  });

  it('renders description for shadow tabs', () => {
    render(<TabDemoPage />);
    expect(screen.getByText(/uses shadows to create depth/i)).toBeInTheDocument();
  });

  it('renders description for glass tabs', () => {
    render(<TabDemoPage />);
    expect(screen.getByText(/frosted glass style/i)).toBeInTheDocument();
  });

  it('renders description for gradient tabs', () => {
    render(<TabDemoPage />);
    expect(screen.getByText(/gradient background/i)).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// TabbedInterface instances
// ═══════════════════════════════════════════════════════════════════════════════

describe('TabDemoPage — TabbedInterface Instances', () => {
  it('renders multiple MahatiTabbedInterface instances', () => {
    render(<TabDemoPage />);
    const instances = screen.getAllByTestId('mahati-tabbed-interface');
    // 8 sections + basic tabs = at least 8
    expect(instances.length).toBeGreaterThanOrEqual(8);
  });

  it('renders outline variant', () => {
    render(<TabDemoPage />);
    const instances = screen.getAllByTestId('mahati-tabbed-interface');
    const outlineInstance = instances.find(el => el.getAttribute('data-variant') === 'outline');
    expect(outlineInstance).toBeInTheDocument();
  });

  it('renders pill variant', () => {
    render(<TabDemoPage />);
    const instances = screen.getAllByTestId('mahati-tabbed-interface');
    const pillInstance = instances.find(el => el.getAttribute('data-variant') === 'pill');
    expect(pillInstance).toBeInTheDocument();
  });

  it('renders dark variant', () => {
    render(<TabDemoPage />);
    const instances = screen.getAllByTestId('mahati-tabbed-interface');
    const darkInstance = instances.find(el => el.getAttribute('data-variant') === 'dark');
    expect(darkInstance).toBeInTheDocument();
  });

  it('renders underline variant', () => {
    render(<TabDemoPage />);
    const instances = screen.getAllByTestId('mahati-tabbed-interface');
    const underlineInstance = instances.find(el => el.getAttribute('data-variant') === 'underline');
    expect(underlineInstance).toBeInTheDocument();
  });

  it('renders shadow variant', () => {
    render(<TabDemoPage />);
    const instances = screen.getAllByTestId('mahati-tabbed-interface');
    const shadowInstance = instances.find(el => el.getAttribute('data-variant') === 'shadow');
    expect(shadowInstance).toBeInTheDocument();
  });

  it('renders glass variant', () => {
    render(<TabDemoPage />);
    const instances = screen.getAllByTestId('mahati-tabbed-interface');
    const glassInstance = instances.find(el => el.getAttribute('data-variant') === 'glass');
    expect(glassInstance).toBeInTheDocument();
  });

  it('renders gradient variant', () => {
    render(<TabDemoPage />);
    const instances = screen.getAllByTestId('mahati-tabbed-interface');
    const gradientInstance = instances.find(el => el.getAttribute('data-variant') === 'gradient');
    expect(gradientInstance).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Tab data
// ═══════════════════════════════════════════════════════════════════════════════

describe('TabDemoPage — Tab Content', () => {
  it('renders Tab 1 label', () => {
    render(<TabDemoPage />);
    expect(screen.getAllByText('Tab 1').length).toBeGreaterThan(0);
  });

  it('renders Tab 2 label', () => {
    render(<TabDemoPage />);
    expect(screen.getAllByText('Tab 2').length).toBeGreaterThan(0);
  });

  it('renders Tab 3 label', () => {
    render(<TabDemoPage />);
    expect(screen.getAllByText('Tab 3').length).toBeGreaterThan(0);
  });

  it('renders Home tab in basic tabs section', () => {
    render(<TabDemoPage />);
    expect(screen.getAllByText('Home').length).toBeGreaterThan(0);
  });

  it('renders User tab in basic tabs section', () => {
    render(<TabDemoPage />);
    expect(screen.getAllByText('User').length).toBeGreaterThan(0);
  });

  it('renders Settings tab in basic tabs section', () => {
    render(<TabDemoPage />);
    expect(screen.getAllByText('Settings').length).toBeGreaterThan(0);
  });

  it('renders hero icons', () => {
    render(<TabDemoPage />);
    expect(screen.getAllByTestId('home-icon').length).toBeGreaterThan(0);
    expect(screen.getAllByTestId('user-icon').length).toBeGreaterThan(0);
    expect(screen.getAllByTestId('cog-icon').length).toBeGreaterThan(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Code snippets
// ═══════════════════════════════════════════════════════════════════════════════

describe('TabDemoPage — Code Snippets', () => {
  it('renders MahatiTabbedInterface in code snippets', () => {
    render(<TabDemoPage />);
    expect(screen.getAllByText(/MahatiTabbedInterface/).length).toBeGreaterThan(0);
  });

  it('renders variant="outline" in code snippet', () => {
    render(<TabDemoPage />);
    expect(screen.getByText(/variant="outline"/)).toBeInTheDocument();
  });

  it('renders variant="pill" in code snippet', () => {
    render(<TabDemoPage />);
    expect(screen.getByText(/variant="pill"/)).toBeInTheDocument();
  });

  it('renders variant="dark" in code snippet', () => {
    render(<TabDemoPage />);
    expect(screen.getByText(/variant="dark"/)).toBeInTheDocument();
  });

  it('renders variant="gradient" in code snippet', () => {
    render(<TabDemoPage />);
    expect(screen.getByText(/variant="gradient"/)).toBeInTheDocument();
  });
});