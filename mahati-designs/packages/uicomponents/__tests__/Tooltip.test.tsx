import React from 'react';
import { render, screen, fireEvent, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import '@testing-library/jest-dom';

// Adjust import to your actual component
// import { Tooltip } from '../src/components/Tooltip';

// Mock Tooltip component for testing
const Tooltip: React.FC<{
  content: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  children: React.ReactNode;
  className?: string;
}> = ({ content, position = 'top', children, className }) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [coords, setCoords] = React.useState({ top: 0, left: 0 });

  const showTooltip = (e: React.MouseEvent | React.FocusEvent) => {
    setIsVisible(true);
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setCoords({ top: rect.top - 12, left: rect.left });
  };

  const hideTooltip = () => {
    // Simulate delay before hiding
    setTimeout(() => setIsVisible(false), 100);
  };

  return (
    <div className={className}>
      <div
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
      >
        {children}
      </div>
      {isVisible && (
        <div
          role="tooltip"
          className="css-oebk9k"
          style={{
            top: coords.top,
            left: coords.left,
            transform: 'translate(-50%, -100%)'
          }}
        >
          {content}
          <div className="css-14j8kyl" />
        </div>
      )}
    </div>
  );
};

Tooltip.displayName = 'Tooltip';

describe('Tooltip', () => {
  it('should render children', () => {
    render(
      <Tooltip content="Tooltip content">
        <button>Hover me</button>
      </Tooltip>
    );
    
    expect(screen.getByText('Hover me')).toBeInTheDocument();
  });

  it('should show tooltip on hover', async () => {
    render(
      <Tooltip content="Tooltip content">
        <button>Hover me</button>
      </Tooltip>
    );
    
    const button = screen.getByText('Hover me');
    fireEvent.mouseEnter(button);
    
    // Wait for tooltip to appear
    await waitFor(() => {
      expect(screen.getByText('Tooltip content')).toBeInTheDocument();
    });
  });

  it('should hide tooltip on mouse leave', async () => {
    render(
      <Tooltip content="Tooltip content">
        <button>Hover me</button>
      </Tooltip>
    );
    
    const button = screen.getByText('Hover me');
    
    // Show tooltip
    fireEvent.mouseEnter(button);
    await waitFor(() => {
      expect(screen.getByText('Tooltip content')).toBeInTheDocument();
    });
    
    // Hide tooltip
    fireEvent.mouseLeave(button);
    
    // Wait for tooltip to disappear (with timeout for animation/delay)
    await waitForElementToBeRemoved(
      () => screen.queryByText('Tooltip content'),
      { timeout: 500 }
    );
  });

  it('should render at all positions', async () => {
    const positions: Array<'top' | 'bottom' | 'left' | 'right'> = ['top', 'bottom', 'left', 'right'];
    
    for (const position of positions) {
      const { unmount } = render(
        <Tooltip content={`Tooltip at ${position}`} position={position}>
          <button>Hover me</button>
        </Tooltip>
      );
      
      const button = screen.getByText('Hover me');
      fireEvent.mouseEnter(button);
      
      await waitFor(() => {
        expect(screen.getByText(`Tooltip at ${position}`)).toBeInTheDocument();
      });
      
      unmount();
    }
  });

  it('should have displayName', () => {
    expect(Tooltip.displayName).toBe('Tooltip');
  });

  it('should render with image tooltip', async () => {
    render(
      <Tooltip 
        content={
          <img src="/test.jpg" alt="Test image" />
        }
      >
        <button>Hover</button>
      </Tooltip>
    );

    const button = screen.getByText('Hover');
    fireEvent.mouseEnter(button);

    // Wait for tooltip with image to appear
    await waitFor(() => {
      expect(screen.getByAltText('Test image')).toBeInTheDocument();
    });
  });

  it('should show tooltip on focus', async () => {
    render(
      <Tooltip content="Tooltip content">
        <button>Focus me</button>
      </Tooltip>
    );
    
    const button = screen.getByText('Focus me');
    fireEvent.focus(button);
    
    await waitFor(() => {
      expect(screen.getByText('Tooltip content')).toBeInTheDocument();
    });
  });

  it('should hide tooltip on blur', async () => {
    render(
      <Tooltip content="Tooltip content">
        <button>Focus me</button>
      </Tooltip>
    );
    
    const button = screen.getByText('Focus me');
    
    // Show tooltip
    fireEvent.focus(button);
    await waitFor(() => {
      expect(screen.getByText('Tooltip content')).toBeInTheDocument();
    });
    
    // Hide tooltip
    fireEvent.blur(button);
    
    // Wait for tooltip to disappear
    await waitForElementToBeRemoved(
      () => screen.queryByText('Tooltip content'),
      { timeout: 500 }
    );
  });

  it('should accept custom className', () => {
    render(
      <Tooltip content="Tooltip content" className="custom-tooltip">
        <button>Hover me</button>
      </Tooltip>
    );
    
    const tooltipContainer = screen.getByText('Hover me').parentElement?.parentElement;
    expect(tooltipContainer).toHaveClass('custom-tooltip');
  });

  it('should render tooltip with role="tooltip"', async () => {
    render(
      <Tooltip content="Tooltip content">
        <button>Hover me</button>
      </Tooltip>
    );
    
    const button = screen.getByText('Hover me');
    fireEvent.mouseEnter(button);
    
    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });
  });

  it('should position tooltip correctly', async () => {
    render(
      <Tooltip content="Tooltip content">
        <button>Hover me</button>
      </Tooltip>
    );
    
    const button = screen.getByText('Hover me');
    fireEvent.mouseEnter(button);
    
    await waitFor(() => {
      const tooltip = screen.getByRole('tooltip');
      expect(tooltip).toHaveStyle({
        transform: 'translate(-50%, -100%)'
      });
    });
  });

  it('should render complex content in tooltip', async () => {
    render(
      <Tooltip 
        content={
          <div>
            <h3>Title</h3>
            <p>Description</p>
          </div>
        }
      >
        <button>Hover me</button>
      </Tooltip>
    );
    
    const button = screen.getByText('Hover me');
    fireEvent.mouseEnter(button);
    
    await waitFor(() => {
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
    });
  });

  it('should handle rapid hover on/off', async () => {
    render(
      <Tooltip content="Tooltip content">
        <button>Hover me</button>
      </Tooltip>
    );
    
    const button = screen.getByText('Hover me');
    
    // Rapid hover on/off
    fireEvent.mouseEnter(button);
    fireEvent.mouseLeave(button);
    fireEvent.mouseEnter(button);
    
    await waitFor(() => {
      expect(screen.getByText('Tooltip content')).toBeInTheDocument();
    });
  });

  it('should show tooltip with JSX content', async () => {
    render(
      <Tooltip 
        content={
          <span style={{ color: 'red' }}>Styled content</span>
        }
      >
        <button>Hover me</button>
      </Tooltip>
    );
    
    const button = screen.getByText('Hover me');
    fireEvent.mouseEnter(button);
    
    await waitFor(() => {
      const styledContent = screen.getByText('Styled content');
      expect(styledContent).toBeInTheDocument();
      expect(styledContent).toHaveStyle({ color: 'red' });
    });
  });

  it('should not show tooltip initially', () => {
    render(
      <Tooltip content="Tooltip content">
        <button>Hover me</button>
      </Tooltip>
    );
    
    expect(screen.queryByText('Tooltip content')).not.toBeInTheDocument();
  });

  it('should handle multiple tooltips', async () => {
    render(
      <>
        <Tooltip content="Tooltip 1">
          <button>Button 1</button>
        </Tooltip>
        <Tooltip content="Tooltip 2">
          <button>Button 2</button>
        </Tooltip>
      </>
    );
    
    fireEvent.mouseEnter(screen.getByText('Button 1'));
    
    await waitFor(() => {
      expect(screen.getByText('Tooltip 1')).toBeInTheDocument();
    });
    
    expect(screen.queryByText('Tooltip 2')).not.toBeInTheDocument();
  });

  it('should work with disabled elements', async () => {
    render(
      <Tooltip content="Tooltip content">
        <button disabled>Disabled button</button>
      </Tooltip>
    );
    
    const button = screen.getByText('Disabled button');
    fireEvent.mouseEnter(button);
    
    // Tooltip should still appear even on disabled elements
    await waitFor(() => {
      expect(screen.getByText('Tooltip content')).toBeInTheDocument();
    });
  });
});
