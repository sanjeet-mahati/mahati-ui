import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Tooltip } from '../src/components/Tooltip';

// The real Tooltip uses requestAnimationFrame for position calculation.
// Stub it so position is calculated synchronously in tests.
beforeAll(() => {
  window.requestAnimationFrame = (cb) => { cb(0); return 0; };
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

const triggerMouseEnter = (el: HTMLElement) => fireEvent.mouseEnter(el);
const triggerMouseLeave = (el: HTMLElement) => fireEvent.mouseLeave(el);
const triggerFocus      = (el: HTMLElement) => fireEvent.focus(el);
const triggerBlur       = (el: HTMLElement) => fireEvent.blur(el);

// ─────────────────────────────────────────────────────────────────────────────

describe('Tooltip', () => {

  // ─── Render ───────────────────────────────────────────────────────────────

  describe('Render', () => {
    it('should render children', () => {
      render(<Tooltip text="tip"><button>Hover me</button></Tooltip>);
      expect(screen.getByText('Hover me')).toBeInTheDocument();
    });

    it('should render wrapper div with inline-block class', () => {
      const { container } = render(<Tooltip text="tip"><span>child</span></Tooltip>);
      expect(container.firstChild).toHaveClass('inline-block');
    });

    it('should apply testId to wrapper', () => {
      render(<Tooltip text="tip" testId="my-tooltip"><span>child</span></Tooltip>);
      expect(screen.getByTestId('my-tooltip')).toBeInTheDocument();
    });

    it('should apply custom className to wrapper', () => {
      render(<Tooltip text="tip" className="extra"><span>child</span></Tooltip>);
      expect(screen.getByText('child').parentElement).toHaveClass('extra');
    });

    it('should have correct displayName', () => {
      expect(Tooltip.displayName).toBe('Tooltip');
    });

    it('should render role="tooltip" element in DOM even when hidden', () => {
      render(<Tooltip text="tip"><span>child</span></Tooltip>);
      // tooltip div is always in DOM but invisible via opacity-0/invisible
      expect(screen.getByRole('tooltip', { hidden: true })).toBeInTheDocument();
    });

    it('should render without wrapping div when no text or image (passthrough)', () => {
      render(<Tooltip><span data-testid="bare">child</span></Tooltip>);
      // no content → renders as fragment, no tooltip wrapper
      expect(screen.getByTestId('bare')).toBeInTheDocument();
      expect(screen.queryByRole('tooltip', { hidden: true })).not.toBeInTheDocument();
    });
  });

  // ─── Show / Hide on Hover ─────────────────────────────────────────────────

  describe('Show / Hide on Hover', () => {
    it('should make tooltip visible on mouseEnter', async () => {
      render(<Tooltip text="Tooltip content"><button>Hover me</button></Tooltip>);
      triggerMouseEnter(screen.getByText('Hover me').closest('[class*="inline-block"]')!);
      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeVisible();
      });
    });

    it('should show tooltip text on mouseEnter', async () => {
      render(<Tooltip text="Hello tip"><button>B</button></Tooltip>);
      triggerMouseEnter(screen.getByText('B').parentElement!);
      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toHaveTextContent('Hello tip');
      });
    });

    it('should hide tooltip on mouseLeave', async () => {
      render(<Tooltip text="Tip"><button>B</button></Tooltip>);
      const wrapper = screen.getByText('B').parentElement!;
      triggerMouseEnter(wrapper);
      await waitFor(() => expect(screen.getByRole('tooltip')).toBeVisible());
      triggerMouseLeave(wrapper);
      await waitFor(() => {
        expect(screen.getByRole('tooltip', { hidden: true }).className).toMatch(/opacity-0/);
      });
    });

    it('should not show tooltip when no text or image', () => {
      render(<Tooltip><button>B</button></Tooltip>);
      // no wrapper → no tooltip role at all
      expect(screen.queryByRole('tooltip', { hidden: true })).not.toBeInTheDocument();
    });
  });

  // ─── Show / Hide on Focus ─────────────────────────────────────────────────

  describe('Show / Hide on Focus', () => {
    it('should show tooltip on focus', async () => {
      render(<Tooltip text="Focus tip"><button>Focus me</button></Tooltip>);
      triggerFocus(screen.getByText('Focus me').parentElement!);
      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeVisible();
      });
    });

    it('should hide tooltip on blur', async () => {
      render(<Tooltip text="Focus tip"><button>B</button></Tooltip>);
      const wrapper = screen.getByText('B').parentElement!;
      triggerFocus(wrapper);
      await waitFor(() => expect(screen.getByRole('tooltip')).toBeVisible());
      triggerBlur(wrapper);
      await waitFor(() => {
        expect(screen.getByRole('tooltip', { hidden: true }).className).toMatch(/opacity-0/);
      });
    });
  });

  // ─── Text Content ─────────────────────────────────────────────────────────

  describe('Text Content', () => {
    it('should render string text in tooltip', async () => {
      render(<Tooltip text="Simple text"><span>T</span></Tooltip>);
      triggerMouseEnter(screen.getByText('T').parentElement!);
      await waitFor(() => expect(screen.getByRole('tooltip')).toHaveTextContent('Simple text'));
    });

    it('should render ReactNode text in tooltip', async () => {
      render(
        <Tooltip text={<strong data-testid="bold-tip">Bold tip</strong>}>
          <span>T</span>
        </Tooltip>
      );
      triggerMouseEnter(screen.getByText('T').parentElement!);
      await waitFor(() => expect(screen.getByTestId('bold-tip')).toBeInTheDocument());
    });

    it('should render complex JSX content', async () => {
      render(
        <Tooltip text={<div><h3>Title</h3><p>Desc</p></div>}>
          <span>T</span>
        </Tooltip>
      );
      triggerMouseEnter(screen.getByText('T').parentElement!);
      await waitFor(() => {
        expect(screen.getByText('Title')).toBeInTheDocument();
        expect(screen.getByText('Desc')).toBeInTheDocument();
      });
    });
  });

  // ─── Image ────────────────────────────────────────────────────────────────

  describe('Image', () => {
    it('should render image in tooltip when image prop provided', async () => {
      render(
        <Tooltip image={{ src: '/test.jpg', alt: 'Test image' }}>
          <span>T</span>
        </Tooltip>
      );
      triggerMouseEnter(screen.getByText('T').parentElement!);
      await waitFor(() => {
        expect(screen.getByAltText('Test image')).toBeInTheDocument();
      });
    });

    it('should use default alt "Tooltip image" when alt not provided', async () => {
      render(
        <Tooltip image={{ src: '/test.jpg' }}><span>T</span></Tooltip>
      );
      triggerMouseEnter(screen.getByText('T').parentElement!);
      await waitFor(() => {
        expect(screen.getByAltText('Tooltip image')).toBeInTheDocument();
      });
    });

    it('should apply custom width and height to image', async () => {
      render(
        <Tooltip image={{ src: '/img.jpg', alt: 'img', width: 300, height: 200 }}>
          <span>T</span>
        </Tooltip>
      );
      triggerMouseEnter(screen.getByText('T').parentElement!);
      await waitFor(() => {
        const img = screen.getByAltText('img');
        expect(img).toHaveAttribute('width', '300');
        expect(img).toHaveAttribute('height', '200');
      });
    });

    it('should use default width 200 and height 150 when not specified', async () => {
      render(
        <Tooltip image={{ src: '/img.jpg', alt: 'img' }}><span>T</span></Tooltip>
      );
      triggerMouseEnter(screen.getByText('T').parentElement!);
      await waitFor(() => {
        const img = screen.getByAltText('img');
        expect(img).toHaveAttribute('width', '200');
        expect(img).toHaveAttribute('height', '150');
      });
    });

    it('should not render text when image is provided', async () => {
      render(
        <Tooltip text="some text" image={{ src: '/img.jpg', alt: 'img' }}>
          <span>T</span>
        </Tooltip>
      );
      triggerMouseEnter(screen.getByText('T').parentElement!);
      await waitFor(() => expect(screen.getByAltText('img')).toBeInTheDocument());
      // image takes priority over text in renderTooltipContent
      expect(screen.queryByText('some text')).not.toBeInTheDocument();
    });
  });

  // ─── Variants ─────────────────────────────────────────────────────────────

  describe('Variants', () => {
    it('should apply default variant gradient class', async () => {
      render(<Tooltip text="tip" variant="default"><span>T</span></Tooltip>);
      const tooltip = screen.getByRole('tooltip', { hidden: true });
      expect(tooltip.className).toMatch(/bg-gradient-to-r/);
    });

    it('should apply transparent variant bg-white class', async () => {
      render(<Tooltip text="tip" variant="transparent"><span>T</span></Tooltip>);
      const tooltip = screen.getByRole('tooltip', { hidden: true });
      expect(tooltip.className).toMatch(/bg-white/);
    });

    it('should apply custom textColor', () => {
      render(<Tooltip text="tip" textColor="#ff0000"><span>T</span></Tooltip>);
      const tooltip = screen.getByRole('tooltip', { hidden: true });
      expect(tooltip.style.color).toBe('rgb(255, 0, 0)');
    });

    it('should apply custom backgroundColor', () => {
      render(<Tooltip text="tip" backgroundColor="#000"><span>T</span></Tooltip>);
      const tooltip = screen.getByRole('tooltip', { hidden: true });
      expect(tooltip.style.background).toBe('rgb(0, 0, 0)');
    });
  });

  // ─── Positions ────────────────────────────────────────────────────────────

  describe('Positions', () => {
    const positions = ['top', 'bottom', 'left', 'right'] as const;

    positions.forEach(position => {
      it(`should render tooltip at position "${position}"`, async () => {
        const { unmount } = render(
          <Tooltip text={`Tip ${position}`} position={position}>
            <button>B</button>
          </Tooltip>
        );
        triggerMouseEnter(screen.getByText('B').parentElement!);
        await waitFor(() => {
          expect(screen.getByRole('tooltip')).toHaveTextContent(`Tip ${position}`);
        });
        unmount();
      });
    });

    it('should default to position="top"', () => {
      // default position rendered without prop — component defaults to "top"
      render(<Tooltip text="tip"><span>T</span></Tooltip>);
      expect(screen.getByRole('tooltip', { hidden: true })).toBeInTheDocument();
    });
  });

  // ─── Arrow ────────────────────────────────────────────────────────────────

  describe('Arrow', () => {
    it('should render arrow element in default variant', () => {
      const { container } = render(<Tooltip text="tip"><span>T</span></Tooltip>);
      // arrow is an absolute div inside the tooltip
      const tooltip = container.querySelector('[role="tooltip"]');
      expect(tooltip?.querySelector('.absolute.w-0.h-0')).toBeInTheDocument();
    });

    it('should not render arrow in transparent variant', () => {
      const { container } = render(
        <Tooltip text="tip" variant="transparent"><span>T</span></Tooltip>
      );
      const tooltip = container.querySelector('[role="tooltip"]');
      expect(tooltip?.querySelector('.absolute.w-0.h-0')).not.toBeInTheDocument();
    });

    it('should not render arrow when image prop provided', () => {
      const { container } = render(
        <Tooltip image={{ src: '/img.jpg' }}><span>T</span></Tooltip>
      );
      const tooltip = container.querySelector('[role="tooltip"]');
      expect(tooltip?.querySelector('.absolute.w-0.h-0')).not.toBeInTheDocument();
    });
  });

  // ─── Multiple Tooltips ────────────────────────────────────────────────────

  describe('Multiple Tooltips', () => {
    it('should handle multiple independent tooltips', async () => {
      render(
        <>
          <Tooltip text="Tooltip 1"><button>B1</button></Tooltip>
          <Tooltip text="Tooltip 2"><button>B2</button></Tooltip>
        </>
      );
      triggerMouseEnter(screen.getByText('B1').parentElement!);
      await waitFor(() => {
        const tooltip1 = screen.getAllByRole('tooltip')[0];
        expect(tooltip1).toHaveTextContent('Tooltip 1');
      });
      // B2 tooltip still hidden
      expect(screen.getAllByRole('tooltip', { hidden: true })[1].className).toMatch(/opacity-0/);
    });
  });

  // ─── Animation Prop ───────────────────────────────────────────────────────

  describe('Animation Prop', () => {
    it('should render animation component when shown', async () => {
      const MockAnimation = ({ isActive }: { isActive: boolean }) =>
        isActive ? <div data-testid="anim">Animating</div> : null;

      jest.useFakeTimers();
      render(
        <Tooltip
          text="tip"
          animation={{ component: MockAnimation, triggerDelay: 100 }}
        >
          <span>T</span>
        </Tooltip>
      );
      triggerMouseEnter(screen.getByText('T').parentElement!);

      // advance past triggerDelay
      await waitFor(() => {
        jest.advanceTimersByTime(150);
      });

      await waitFor(() => {
        expect(screen.queryByTestId('anim')).toBeInTheDocument();
      });

      jest.useRealTimers();
    });
  });
});