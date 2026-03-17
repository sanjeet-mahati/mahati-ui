import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ConfettiExplosion } from '../src/components/ConfettiExplosion';
import { RealisticConfetti } from '../src/components/RealisticConfetti';

// ─── RAF mock ─────────────────────────────────────────────────────────────────
let rafId = 0;
const rafCallbacks = new Map<number, FrameRequestCallback>();

beforeAll(() => {
  global.requestAnimationFrame = jest.fn((cb) => {
    const id = ++rafId;
    rafCallbacks.set(id, cb);
    return id;
  });
  global.cancelAnimationFrame = jest.fn((id) => {
    rafCallbacks.delete(id);
  });
});

afterEach(() => {
  rafCallbacks.clear();
  rafId = 0;
  jest.clearAllMocks();
  jest.useRealTimers();
});

// helper: run one RAF tick
const tickRAF = () => {
  act(() => {
    const cb = Array.from(rafCallbacks.values())[0];
    if (cb) cb(performance.now());
  });
};

// ─────────────────────────────────────────────────────────────────────────────

describe('ConfettiExplosion', () => {

  // ─── Visibility ─────────────────────────────────────────────────────────

  describe('Visibility', () => {
    it('should render container when isActive=true', () => {
      const { container } = render(<ConfettiExplosion isActive={true} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should return null when isActive=false', () => {
      const { container } = render(<ConfettiExplosion isActive={false} />);
      expect(container.firstChild).toBeNull();
    });

    it('should return null initially before particles are set (empty state)', () => {
      // isActive=true but particleCount=0 → particles=[] → returns null
      const { container } = render(<ConfettiExplosion isActive={true} particleCount={0} />);
      expect(container.firstChild).toBeNull();
    });

    it('should clear and return null when isActive becomes false', () => {
      const { rerender, container } = render(
        <ConfettiExplosion isActive={true} particleCount={10} />
      );
      expect(container.firstChild).toBeInTheDocument();
      rerender(<ConfettiExplosion isActive={false} particleCount={10} />);
      expect(container.firstChild).toBeNull();
    });

    it('should have correct displayName', () => {
      expect(ConfettiExplosion.displayName).toBe('ConfettiExplosion');
    });
  });

  // ─── Particles ───────────────────────────────────────────────────────────

  describe('Particles', () => {
    it('should render correct number of particle divs', () => {
      const { container } = render(
        <ConfettiExplosion isActive={true} particleCount={20} />
      );
      // wrapper div + N particle divs
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.childNodes.length).toBe(20);
    });

    it('should render default 150 particles', () => {
      const { container } = render(<ConfettiExplosion isActive={true} />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.childNodes.length).toBe(150);
    });

    it('should render 0 particles and return null for particleCount=0', () => {
      const { container } = render(
        <ConfettiExplosion isActive={true} particleCount={0} />
      );
      expect(container.firstChild).toBeNull();
    });

    it('each particle should have inline width/height from particleSize', () => {
      const { container } = render(
        <ConfettiExplosion isActive={true} particleCount={5} particleSize={10} />
      );
      const wrapper = container.firstChild as HTMLElement;
      const particle = wrapper.children[0] as HTMLElement;
      const w = parseFloat(particle.style.width);
      const h = parseFloat(particle.style.height);
      // size = random * particleSize + particleSize/2  →  between 5 and 15
      expect(w).toBeGreaterThanOrEqual(5);
      expect(w).toBeLessThanOrEqual(15);
      expect(h).toBeGreaterThanOrEqual(5);
      expect(h).toBeLessThanOrEqual(15);
    });

    it('each particle should have opacity style', () => {
      const { container } = render(
        <ConfettiExplosion isActive={true} particleCount={5} />
      );
      const wrapper = container.firstChild as HTMLElement;
      Array.from(wrapper.children).forEach((p) => {
        expect((p as HTMLElement).style.opacity).toBeTruthy();
      });
    });

    it('each particle should have transform (rotation)', () => {
      const { container } = render(
        <ConfettiExplosion isActive={true} particleCount={5} />
      );
      const wrapper = container.firstChild as HTMLElement;
      Array.from(wrapper.children).forEach((p) => {
        expect((p as HTMLElement).style.transform).toMatch(/rotate/);
      });
    });

    it('particles should start at y=100 (bottom=%)', () => {
      const { container } = render(
        <ConfettiExplosion isActive={true} particleCount={10} />
      );
      const wrapper = container.firstChild as HTMLElement;
      Array.from(wrapper.children).forEach((p) => {
        expect((p as HTMLElement).style.bottom).toBe('100%');
      });
    });

    it('particles should start at x=0% or x=100% (left/right edge)', () => {
      const { container } = render(
        <ConfettiExplosion isActive={true} particleCount={30} />
      );
      const wrapper = container.firstChild as HTMLElement;
      Array.from(wrapper.children).forEach((p) => {
        const left = (p as HTMLElement).style.left;
        expect(['0%', '100%']).toContain(left);
      });
    });

    it('particles should use colors from the colors prop', () => {
      const customColors = ['#ff0000', '#00ff00', '#0000ff'];
      const { container } = render(
        <ConfettiExplosion isActive={true} particleCount={20} colors={customColors} />
      );
      const wrapper = container.firstChild as HTMLElement;
      Array.from(wrapper.children).forEach((p) => {
        const el = p as HTMLElement;
        // non-star particles have backgroundColor; star particles have background
        const bg = el.style.backgroundColor || el.style.background;
        expect(bg).toBeTruthy();
      });
    });

    it('should use default colors when colors not provided', () => {
      const { container } = render(
        <ConfettiExplosion isActive={true} particleCount={5} />
      );
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.childNodes.length).toBe(5);
    });
  });

  // ─── Shapes ──────────────────────────────────────────────────────────────

  describe('Shapes', () => {
    it('circle particles should have rounded-full class', () => {
      // render many to statistically get a circle
      const { container } = render(
        <ConfettiExplosion isActive={true} particleCount={100} />
      );
      const wrapper = container.firstChild as HTMLElement;
      const hasCircle = Array.from(wrapper.children).some((p) =>
        p.classList.contains('rounded-full')
      );
      expect(hasCircle).toBe(true);
    });

    it('rectangle particles should have rounded-[2px] class', () => {
      const { container } = render(
        <ConfettiExplosion isActive={true} particleCount={100} />
      );
      const wrapper = container.firstChild as HTMLElement;
      const hasRect = Array.from(wrapper.children).some((p) =>
        p.classList.contains('rounded-[2px]')
      );
      expect(hasRect).toBe(true);
    });

    it('star particles should have clipPath style', () => {
      const { container } = render(
        <ConfettiExplosion isActive={true} particleCount={100} />
      );
      const wrapper = container.firstChild as HTMLElement;
      const hasStar = Array.from(wrapper.children).some((p) =>
        (p as HTMLElement).style.clipPath.includes('polygon')
      );
      expect(hasStar).toBe(true);
    });
  });

  // ─── Container styles ────────────────────────────────────────────────────

  describe('Container', () => {
    it('should apply stageHeight as inline style', () => {
      const { container } = render(
        <ConfettiExplosion isActive={true} particleCount={5} stageHeight={600} />
      );
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.style.height).toBe('600px');
    });

    it('should apply testId to wrapper', () => {
      render(<ConfettiExplosion isActive={true} particleCount={5} testId="ce" />);
      expect(screen.getByTestId('ce')).toBeInTheDocument();
    });

    it('should have fixed positioning class', () => {
      const { container } = render(
        <ConfettiExplosion isActive={true} particleCount={5} />
      );
      expect(container.firstChild).toHaveClass('fixed');
    });

    it('should have pointer-events-none class', () => {
      const { container } = render(
        <ConfettiExplosion isActive={true} particleCount={5} />
      );
      expect(container.firstChild).toHaveClass('pointer-events-none');
    });
  });

  // ─── Animation ───────────────────────────────────────────────────────────

  describe('Animation', () => {
    it('should call requestAnimationFrame on mount when active', () => {
      render(<ConfettiExplosion isActive={true} particleCount={5} />);
      expect(global.requestAnimationFrame).toHaveBeenCalled();
    });

    it('should call cancelAnimationFrame on unmount', () => {
      const { unmount } = render(<ConfettiExplosion isActive={true} particleCount={5} />);
      unmount();
      expect(global.cancelAnimationFrame).toHaveBeenCalled();
    });

    it('should not call requestAnimationFrame when inactive', () => {
      render(<ConfettiExplosion isActive={false} />);
      expect(global.requestAnimationFrame).not.toHaveBeenCalled();
    });

    it('should continue animating after one frame tick', () => {
      const { container } = render(
        <ConfettiExplosion isActive={true} particleCount={5} />
      );
      tickRAF();
      // still rendered (particles still alive in first tick)
      expect(container.firstChild).not.toBeNull();
    });
  });

  // ─── Re-render stability ─────────────────────────────────────────────────

  describe('Re-render stability', () => {
    it('should not cause infinite re-renders with stable colors array', () => {
      const colors = ['#ff0000', '#00ff00', '#0000ff'];
      const { rerender, container } = render(
        <ConfettiExplosion isActive={true} colors={colors} particleCount={10} />
      );
      rerender(<ConfettiExplosion isActive={true} colors={colors} particleCount={10} />);
      rerender(<ConfettiExplosion isActive={true} colors={['#ff0000', '#00ff00', '#0000ff']} particleCount={10} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should handle rapid active/inactive toggling', () => {
      const { rerender, container } = render(<ConfettiExplosion isActive={false} />);
      rerender(<ConfettiExplosion isActive={true} particleCount={5} />);
      expect(container.firstChild).toBeInTheDocument();
      rerender(<ConfettiExplosion isActive={false} />);
      expect(container.firstChild).toBeNull();
      rerender(<ConfettiExplosion isActive={true} particleCount={5} />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe('RealisticConfetti', () => {

  // ─── Visibility ─────────────────────────────────────────────────────────

  describe('Visibility', () => {
    it('should render when isActive=true', () => {
      const { container } = render(<RealisticConfetti isActive={true} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should return null when isActive=false', () => {
      const { container } = render(<RealisticConfetti isActive={false} />);
      expect(container.firstChild).toBeNull();
    });

    it('should return null for particleCount=0', () => {
      const { container } = render(<RealisticConfetti isActive={true} particleCount={0} />);
      expect(container.firstChild).toBeNull();
    });

    it('should clear when isActive becomes false', () => {
      const { rerender, container } = render(
        <RealisticConfetti isActive={true} particleCount={10} />
      );
      rerender(<RealisticConfetti isActive={false} />);
      expect(container.firstChild).toBeNull();
    });

    it('should have correct displayName', () => {
      expect(RealisticConfetti.displayName).toBe('RealisticConfetti');
    });
  });

  // ─── Particles ───────────────────────────────────────────────────────────

  describe('Particles', () => {
    it('should render default 150 particles', () => {
      const { container } = render(<RealisticConfetti isActive={true} />);
      expect((container.firstChild as HTMLElement).childNodes.length).toBe(150);
    });

    it('should render custom particleCount', () => {
      const { container } = render(
        <RealisticConfetti isActive={true} particleCount={30} />
      );
      expect((container.firstChild as HTMLElement).childNodes.length).toBe(30);
    });

    it('particles start at bottom (style.bottom = 100%)', () => {
      const { container } = render(
        <RealisticConfetti isActive={true} particleCount={5} />
      );
      const wrapper = container.firstChild as HTMLElement;
      Array.from(wrapper.children).forEach((p) => {
        expect((p as HTMLElement).style.bottom).toBe('100%');
      });
    });

    it('particles start at x=0% or x=100%', () => {
      const { container } = render(
        <RealisticConfetti isActive={true} particleCount={30} />
      );
      const wrapper = container.firstChild as HTMLElement;
      Array.from(wrapper.children).forEach((p) => {
        expect(['0%', '100%']).toContain((p as HTMLElement).style.left);
      });
    });

    it('should apply particleSize to particle width/height', () => {
      const { container } = render(
        <RealisticConfetti isActive={true} particleCount={5} particleSize={16} />
      );
      const wrapper = container.firstChild as HTMLElement;
      const w = parseFloat((wrapper.children[0] as HTMLElement).style.width);
      expect(w).toBeGreaterThanOrEqual(8);   // particleSize/2
      expect(w).toBeLessThanOrEqual(24);     // particleSize*1.5
    });

    it('should handle empty colors array without crash', () => {
      const { container } = render(
        <RealisticConfetti isActive={true} colors={[]} particleCount={5} />
      );
      // colors=[] → stableColors[...] is undefined → backgroundColor = undefined — still renders
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  // ─── Container ───────────────────────────────────────────────────────────

  describe('Container', () => {
    it('should apply testId', () => {
      render(<RealisticConfetti isActive={true} particleCount={5} testId="rc" />);
      expect(screen.getByTestId('rc')).toBeInTheDocument();
    });

    it('should apply stageHeight', () => {
      const { container } = render(
        <RealisticConfetti isActive={true} particleCount={5} stageHeight={500} />
      );
      expect((container.firstChild as HTMLElement).style.height).toBe('500px');
    });

    it('should have fixed class', () => {
      const { container } = render(
        <RealisticConfetti isActive={true} particleCount={5} />
      );
      expect(container.firstChild).toHaveClass('fixed');
    });

    it('should have pointer-events-none class', () => {
      const { container } = render(
        <RealisticConfetti isActive={true} particleCount={5} />
      );
      expect(container.firstChild).toHaveClass('pointer-events-none');
    });
  });

  // ─── Animation ───────────────────────────────────────────────────────────

  describe('Animation', () => {
    it('should call requestAnimationFrame when active', () => {
      render(<RealisticConfetti isActive={true} particleCount={5} />);
      expect(global.requestAnimationFrame).toHaveBeenCalled();
    });

    it('should call cancelAnimationFrame on unmount', () => {
      const { unmount } = render(<RealisticConfetti isActive={true} particleCount={5} />);
      unmount();
      expect(global.cancelAnimationFrame).toHaveBeenCalled();
    });

    it('should not call requestAnimationFrame when inactive', () => {
      render(<RealisticConfetti isActive={false} />);
      expect(global.requestAnimationFrame).not.toHaveBeenCalled();
    });

    it('should still render after one RAF tick', () => {
      const { container } = render(
        <RealisticConfetti isActive={true} particleCount={5} />
      );
      tickRAF();
      expect(container.firstChild).not.toBeNull();
    });
  });

  // ─── Props passthrough ───────────────────────────────────────────────────

  describe('Props', () => {
    it('should accept force prop without crash', () => {
      const { container } = render(
        <RealisticConfetti isActive={true} force={2} particleCount={5} />
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should accept duration prop without crash', () => {
      const { container } = render(
        <RealisticConfetti isActive={true} duration={2000} particleCount={5} />
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should handle rapid toggle', () => {
      const { rerender, container } = render(<RealisticConfetti isActive={false} />);
      rerender(<RealisticConfetti isActive={true} particleCount={5} />);
      expect(container.firstChild).toBeInTheDocument();
      rerender(<RealisticConfetti isActive={false} />);
      expect(container.firstChild).toBeNull();
    });
  });
});