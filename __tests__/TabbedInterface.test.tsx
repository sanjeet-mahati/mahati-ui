import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TabbedInterface } from '../src/components/TabbedInterface';

// ─── Shared test data ─────────────────────────────────────────────────────────

const tabs = [
  { label: 'Tab One', content: <div>Content One</div> },
  { label: 'Tab Two', content: <div>Content Two</div> },
  { label: 'Tab Three', content: <div>Content Three</div> },
];

const tabsWithIcons = [
  { label: 'Home', content: <div>Home Content</div>, icon: <span data-testid="icon-home">H</span> },
  { label: 'Settings', content: <div>Settings Content</div>, icon: <span data-testid="icon-settings">S</span> },
];

// ─── Render ───────────────────────────────────────────────────────────────────

describe('TabbedInterface — Render', () => {
  it('renders without crashing', () => {
    const { container } = render(<TabbedInterface tabs={tabs} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders all tab labels', () => {
    render(<TabbedInterface tabs={tabs} />);
    expect(screen.getByText('Tab One')).toBeInTheDocument();
    expect(screen.getByText('Tab Two')).toBeInTheDocument();
    expect(screen.getByText('Tab Three')).toBeInTheDocument();
  });

  it('renders with testId prop', () => {
    render(<TabbedInterface tabs={tabs} testId="tabbed-root" />);
    expect(screen.getByTestId('tabbed-root')).toBeInTheDocument();
  });

  it('renders tab icons when provided', () => {
    render(<TabbedInterface tabs={tabsWithIcons} />);
    expect(screen.getByTestId('icon-home')).toBeInTheDocument();
    expect(screen.getByTestId('icon-settings')).toBeInTheDocument();
  });

  it('renders tab buttons for each tab', () => {
    render(<TabbedInterface tabs={tabs} />);
    const buttons = screen.getAllByRole('button');
    // At least 3 tab buttons
    expect(buttons.length).toBeGreaterThanOrEqual(3);
  });

  it('has correct displayName', () => {
    expect(TabbedInterface.displayName).toBe('TabbedInterface');
  });
});

// ─── Default active tab ───────────────────────────────────────────────────────

describe('TabbedInterface — Default Active Tab', () => {
  it('shows content of first tab by default', () => {
    render(<TabbedInterface tabs={tabs} />);
    expect(screen.getByText('Content One')).toBeInTheDocument();
  });

  it('shows content of specified defaultActiveTab', () => {
    render(<TabbedInterface tabs={tabs} defaultActiveTab={1} />);
    // Tab Two button should be active — content Two is visible
    expect(screen.getByText('Content Two')).toBeInTheDocument();
  });

  it('defaults to tab 0 when defaultActiveTab is 0', () => {
    render(<TabbedInterface tabs={tabs} defaultActiveTab={0} />);
    expect(screen.getByText('Content One')).toBeInTheDocument();
  });
});

// ─── Tab switching ────────────────────────────────────────────────────────────

describe('TabbedInterface — Tab Switching', () => {
  it('switches content when a tab is clicked', () => {
    render(<TabbedInterface tabs={tabs} />);
    fireEvent.click(screen.getByText('Tab Two'));
    expect(screen.getByText('Content Two')).toBeInTheDocument();
  });

  it('switches to third tab on click', () => {
    render(<TabbedInterface tabs={tabs} />);
    fireEvent.click(screen.getByText('Tab Three'));
    expect(screen.getByText('Content Three')).toBeInTheDocument();
  });

  it('calls onTabChange with correct index on click', () => {
    const mockOnTabChange = jest.fn();
    render(<TabbedInterface tabs={tabs} onTabChange={mockOnTabChange} />);
    fireEvent.click(screen.getByText('Tab Two'));
    expect(mockOnTabChange).toHaveBeenCalledWith(1);
  });

  it('calls onTabChange with index 0 when first tab clicked', () => {
    const mockOnTabChange = jest.fn();
    render(<TabbedInterface tabs={tabs} defaultActiveTab={1} onTabChange={mockOnTabChange} />);
    fireEvent.click(screen.getByText('Tab One'));
    expect(mockOnTabChange).toHaveBeenCalledWith(0);
  });

  it('calls onTabChange with index 2 when third tab clicked', () => {
    const mockOnTabChange = jest.fn();
    render(<TabbedInterface tabs={tabs} onTabChange={mockOnTabChange} />);
    fireEvent.click(screen.getByText('Tab Three'));
    expect(mockOnTabChange).toHaveBeenCalledWith(2);
  });
});

// ─── Variants ─────────────────────────────────────────────────────────────────

describe('TabbedInterface — Variants', () => {
  const variants = ['underline', 'pill', 'outline', 'filled', 'gradient', 'shadow', 'glass', 'dark'] as const;

  variants.forEach((variant) => {
    it(`renders without crashing with variant="${variant}"`, () => {
      const { container } = render(<TabbedInterface tabs={tabs} variant={variant} />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  it('defaults to underline variant when none specified', () => {
    const { container } = render(<TabbedInterface tabs={tabs} />);
    // Underline variant renders a scale span for the active indicator
    const underlineEl = container.querySelector('.scale-x-100');
    expect(underlineEl).toBeInTheDocument();
  });
});

// ─── Orientation ──────────────────────────────────────────────────────────────

describe('TabbedInterface — Orientation', () => {
  it('renders horizontal orientation (default)', () => {
    const { container } = render(<TabbedInterface tabs={tabs} orientation="horizontal" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders vertical orientation', () => {
    const { container } = render(<TabbedInterface tabs={tabs} orientation="vertical" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders vertical with verticalPosition="left"', () => {
    const { container } = render(
      <TabbedInterface tabs={tabs} orientation="vertical" verticalPosition="left" />
    );
    expect(container.firstChild).toBeInTheDocument();
    expect(screen.getByText('Tab One')).toBeInTheDocument();
  });

  it('renders vertical with verticalPosition="right"', () => {
    const { container } = render(
      <TabbedInterface tabs={tabs} orientation="vertical" verticalPosition="right" />
    );
    expect(container.firstChild).toBeInTheDocument();
    expect(screen.getByText('Tab One')).toBeInTheDocument();
  });

  it('tabs still work in vertical orientation', () => {
    const mock = jest.fn();
    render(<TabbedInterface tabs={tabs} orientation="vertical" onTabChange={mock} />);
    fireEvent.click(screen.getByText('Tab Two'));
    expect(mock).toHaveBeenCalledWith(1);
  });
});

// ─── Close icon ───────────────────────────────────────────────────────────────

describe('TabbedInterface — Close Icon', () => {
  it('renders close buttons when showTabCloseIconInHeader and onCloseTab are provided', () => {
    const onCloseTab = jest.fn();
    render(
      <TabbedInterface
        tabs={tabs}
        showTabCloseIconInHeader
        onCloseTab={onCloseTab}
      />
    );
    // Close icon buttons — aria-label "Close tab"
    const closeBtns = screen.getAllByRole('button', { name: /close tab/i });
    expect(closeBtns.length).toBe(3);
  });

  it('calls onCloseTab with correct index when close button clicked', () => {
    const onCloseTab = jest.fn();
    render(
      <TabbedInterface
        tabs={tabs}
        showTabCloseIconInHeader
        onCloseTab={onCloseTab}
      />
    );
    const closeBtns = screen.getAllByRole('button', { name: /close tab/i });
    fireEvent.click(closeBtns[1]);
    expect(onCloseTab).toHaveBeenCalledWith(1);
  });

  it('does not render close buttons when showTabCloseIconInHeader is false', () => {
    render(<TabbedInterface tabs={tabs} showTabCloseIconInHeader={false} />);
    expect(screen.queryByRole('button', { name: /close tab/i })).not.toBeInTheDocument();
  });

  it('renders custom close icon content', () => {
    const onCloseTab = jest.fn();
    render(
      <TabbedInterface
        tabs={tabs}
        showTabCloseIconInHeader
        onCloseTab={onCloseTab}
        tabCloseIconContent={<span>X</span>}
      />
    );
    const closeBtns = screen.getAllByRole('button', { name: /close tab/i });
    expect(closeBtns.length).toBeGreaterThan(0);
  });

  it('renders close icon on left when tabCloseIconPosition="left"', () => {
    const onCloseTab = jest.fn();
    const { container } = render(
      <TabbedInterface
        tabs={tabs}
        showTabCloseIconInHeader
        onCloseTab={onCloseTab}
        tabCloseIconPosition="left"
      />
    );
    expect(container.firstChild).toBeInTheDocument();
  });
});

// ─── Draggable tabs ───────────────────────────────────────────────────────────

describe('TabbedInterface — Draggable Tabs', () => {
  it('renders draggable buttons when draggableTabs=true', () => {
    render(<TabbedInterface tabs={tabs} draggableTabs />);
    const buttons = screen.getAllByRole('button');
    const draggable = buttons.filter(b => b.getAttribute('draggable') === 'true');
    expect(draggable.length).toBe(3);
  });

  it('calls onReorderTabs on drop', () => {
    const onReorderTabs = jest.fn();
    render(<TabbedInterface tabs={tabs} draggableTabs onReorderTabs={onReorderTabs} />);
    const buttons = screen.getAllByRole('button');
    fireEvent.dragStart(buttons[0]);
    fireEvent.dragOver(buttons[2]);
    fireEvent.drop(buttons[2]);
    expect(onReorderTabs).toHaveBeenCalledWith(0, 2);
  });

  it('does NOT set draggable when draggableTabs=false', () => {
    render(<TabbedInterface tabs={tabs} draggableTabs={false} />);
    const buttons = screen.getAllByRole('button');
    const draggable = buttons.filter(b => b.getAttribute('draggable') === 'true');
    expect(draggable.length).toBe(0);
  });
});

// ─── Font props ───────────────────────────────────────────────────────────────

describe('TabbedInterface — Font Props', () => {
  it('renders without crashing when tabHeaderFont provided', () => {
    const { container } = render(<TabbedInterface tabs={tabs} tabHeaderFont="Poppins" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders without crashing when tabContentFont provided', () => {
    const { container } = render(<TabbedInterface tabs={tabs} tabContentFont="mono" />);
    expect(container.firstChild).toBeInTheDocument();
  });
});

// ─── Edge cases ───────────────────────────────────────────────────────────────

describe('TabbedInterface — Edge Cases', () => {
  it('handles empty tabs array gracefully', () => {
    const { container } = render(<TabbedInterface tabs={[]} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('handles single tab', () => {
    render(<TabbedInterface tabs={[{ label: 'Only', content: <div>Only Content</div> }]} />);
    expect(screen.getByText('Only')).toBeInTheDocument();
    expect(screen.getByText('Only Content')).toBeInTheDocument();
  });

  it('handles long tab labels without crashing', () => {
    const longTabs = [
      { label: 'A'.repeat(50), content: <div>Long Content</div> },
    ];
    render(<TabbedInterface tabs={longTabs} />);
    expect(screen.getByText('A'.repeat(50))).toBeInTheDocument();
  });

  it('handles tabs with no icon gracefully', () => {
    const noIconTabs = [{ label: 'No Icon', content: <div>No Icon Content</div> }];
    const { container } = render(<TabbedInterface tabs={noIconTabs} />);
    expect(container.firstChild).toBeInTheDocument();
  });
});

// ─── Snapshot ─────────────────────────────────────────────────────────────────

describe('TabbedInterface — Snapshot', () => {
  it('matches snapshot with default props', () => {
    const { container } = render(<TabbedInterface tabs={tabs} />);
    expect(container).toMatchSnapshot();
  });

  it('matches snapshot with pill variant', () => {
    const { container } = render(<TabbedInterface tabs={tabs} variant="pill" />);
    expect(container).toMatchSnapshot();
  });

  it('matches snapshot with vertical orientation', () => {
    const { container } = render(<TabbedInterface tabs={tabs} orientation="vertical" />);
    expect(container).toMatchSnapshot();
  });
});
