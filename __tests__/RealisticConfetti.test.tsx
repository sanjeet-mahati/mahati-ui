import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
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

const tickRAF = () => {
  act(() => {
    const cb = Array.from(rafCallbacks.values())[0];
    if (cb) cb(performance.now());
  });
};

// ─────────────────────────────────────────────────────────────────────────────

describe('RealisticConfetti', () => {

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

  describe('Particles', () => {
    it('should render default 150 particles', () => {
      const { container } = render(<RealisticConfetti isActive={true} />);
      expect((container.firstChild as HTMLElement).childNodes.length).toBe(150);
    });

    it('should render custom particleCount', () => {
      const { container } = render(<RealisticConfetti isActive={true} particleCount={30} />);
      expect((container.firstChild as HTMLElement).childNodes.length).toBe(30);
    });

    it('particles start at bottom (style.bottom = 100%)', () => {
      const { container } = render(<RealisticConfetti isActive={true} particleCount={5} />);
      const wrapper = container.firstChild as HTMLElement;
      Array.from(wrapper.children).forEach((p) => {
        expect((p as HTMLElement).style.bottom).toBe('100%');
      });
    });

    it('particles start at x=0% or x=100%', () => {
      const { container } = render(<RealisticConfetti isActive={true} particleCount={30} />);
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
      expect(w).toBeGreaterThanOrEqual(8);
      expect(w).toBeLessThanOrEqual(24);
    });

    it('should handle empty colors array without crash', () => {
      const { container } = render(
        <RealisticConfetti isActive={true} colors={[]} particleCount={5} />
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('circle particles should have rounded-full class', () => {
      const { container } = render(<RealisticConfetti isActive={true} particleCount={100} />);
      const wrapper = container.firstChild as HTMLElement;
      const hasCircle = Array.from(wrapper.children).some(p => p.classList.contains('rounded-full'));
      expect(hasCircle).toBe(true);
    });

    it('star particles should have clipPath polygon style', () => {
      const { container } = render(<RealisticConfetti isActive={true} particleCount={100} />);
      const wrapper = container.firstChild as HTMLElement;
      const hasStar = Array.from(wrapper.children).some(
        p => (p as HTMLElement).style.clipPath.includes('polygon')
      );
      expect(hasStar).toBe(true);
    });
  });

  describe('Container', () => {
    it('should apply testId', () => {
      render(<RealisticConfetti isActive={true} particleCount={5} testId="rc" />);
      expect(screen.getByTestId('rc')).toBeInTheDocument();
    });

    it('should apply stageHeight as inline style', () => {
      const { container } = render(
        <RealisticConfetti isActive={true} particleCount={5} stageHeight={500} />
      );
      expect((container.firstChild as HTMLElement).style.height).toBe('500px');
    });

    it('should have fixed class', () => {
      const { container } = render(<RealisticConfetti isActive={true} particleCount={5} />);
      expect(container.firstChild).toHaveClass('fixed');
    });

    it('should have pointer-events-none class', () => {
      const { container } = render(<RealisticConfetti isActive={true} particleCount={5} />);
      expect(container.firstChild).toHaveClass('pointer-events-none');
    });
  });

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
      const { container } = render(<RealisticConfetti isActive={true} particleCount={5} />);
      tickRAF();
      expect(container.firstChild).not.toBeNull();
    });
  });

  describe('Props', () => {
    it('should accept force prop without crash', () => {
      const { container } = render(<RealisticConfetti isActive={true} force={2} particleCount={5} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should accept duration prop without crash', () => {
      const { container } = render(<RealisticConfetti isActive={true} duration={2000} particleCount={5} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should handle rapid toggle', () => {
      const { rerender, container } = render(<RealisticConfetti isActive={false} />);
      rerender(<RealisticConfetti isActive={true} particleCount={5} />);
      expect(container.firstChild).toBeInTheDocument();
      rerender(<RealisticConfetti isActive={false} />);
      expect(container.firstChild).toBeNull();
    });

    it('should render with all props combined', () => {
      const { container } = render(
        <RealisticConfetti
          isActive={true} particleCount={20} duration={3000}
          colors={['#ff0000', '#00ff00']} force={1} particleSize={10}
          stageHeight={600} testId="rc-all"
        />
      );
      expect(screen.getByTestId('rc-all')).toBeInTheDocument();
      expect((container.firstChild as HTMLElement).childNodes.length).toBe(20);
    });
  });
});