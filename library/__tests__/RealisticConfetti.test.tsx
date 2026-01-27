import React from 'react';
import { render, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { RealisticConfetti } from '../src/components/RealisticConfetti';

// Setup mocks BEFORE any React imports to override globals globally
const originalRAF = global.requestAnimationFrame;
const originalCAF = global.cancelAnimationFrame;

let rafId = 0;
let rafCallbacks = new Map<number, FrameRequestCallback>();

const mockRAF = (callback: FrameRequestCallback) => {
  const id = ++rafId;
  rafCallbacks.set(id, callback);
  setTimeout(() => {
    if (rafCallbacks.has(id)) {
      callback(Date.now());
      rafCallbacks.delete(id);
    }
  }, 16);
  return id;
};

beforeAll(() => {
  jest.useFakeTimers();
  // Global mocks to prevent ReferenceError during cleanup
  global.requestAnimationFrame = jest.fn(mockRAF) as any;
  global.cancelAnimationFrame = jest.fn((id) => {
    rafCallbacks.delete(id);
  }) as any;
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.advanceTimersByTime(1000); // Advance to complete any pending RAF
  rafCallbacks.clear();
});

afterAll(() => {
  jest.useRealTimers();
  global.requestAnimationFrame = originalRAF;
  global.cancelAnimationFrame = originalCAF;
});

describe('RealisticConfetti', () => {
  it('should render confetti container with particles when active', () => {
    const { container } = render(<RealisticConfetti isActive={true} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should create default number of particles', () => {
    const { container, getByRole } = render(<RealisticConfetti isActive={true} />);
    act(() => {
      jest.advanceTimersByTime(100);
    });
    // Particles render as divs
    expect(container.firstChild?.childNodes.length).toBe(200);
  });

  it('should create custom number of particles', () => {
    const { container } = render(<RealisticConfetti isActive={true} particleCount={100} />);
    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(container.firstChild?.childNodes.length).toBe(100);
  });

  it('should accept custom colors', () => {
    const customColors = ['#ff0000', '#00ff00', '#0000ff'];
    const { container } = render(<RealisticConfetti isActive={true} colors={customColors} />);
    const particles = container.querySelectorAll('div');
    expect(particles[0]).toHaveStyle({ backgroundColor: expect.stringMatching(/rgb/)}); // Styled components apply inline styles
  });

  it('should accept custom explosion force', () => {
    const { container } = render(<RealisticConfetti isActive={true} explosionForce={10} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should accept custom wind', () => {
    const { container } = render(<RealisticConfetti isActive={true} wind={0.5} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should accept negative wind (left direction)', () => {
    const { container } = render(<RealisticConfetti isActive={true} wind={-0.3} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should start animation on mount', () => {
    render(<RealisticConfetti isActive={true} />);
    expect(global.requestAnimationFrame).toHaveBeenCalled();
  });

  it('should cleanup animation on unmount', () => {
    const { unmount } = render(<RealisticConfetti isActive={true} />);
    act(() => {
      unmount();
    });
    expect(global.cancelAnimationFrame).toHaveBeenCalled();
  });

  it('should handle zero particles (renders empty container)', () => {
    const { container } = render(<RealisticConfetti isActive={true} particleCount={0} />);
    expect(container.firstChild).toBeNull();
  });

  it('should handle empty colors array', () => {
    const { container } = render(<RealisticConfetti isActive={true} colors={[]} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should not render when isActive is false', () => {
    const { container } = render(<RealisticConfetti isActive={false} />);
    expect(container.firstChild).toBeNull();
  });

  it('should handle isActive toggle', () => {
    const { container, rerender } = render(<RealisticConfetti isActive={false} />);
    expect(container.firstChild).toBeNull();

    act(() => {
      rerender(<RealisticConfetti isActive={true} />);
    });
    expect(container.firstChild).toBeInTheDocument();

    act(() => {
      rerender(<RealisticConfetti isActive={false} />);
    });
    expect(container.firstChild).toBeNull();
  });

  it('should handle duration prop', () => {
    const { container } = render(<RealisticConfetti isActive={true} duration={3000} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should have displayName', () => {
    expect(RealisticConfetti.displayName).toBe('RealisticConfetti');
  });

  it('should apply physics each frame', () => {
    render(<RealisticConfetti isActive={true} />);
    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect((global.requestAnimationFrame as jest.Mock).mock.calls.length).toBeGreaterThan(2);
  });

  it('should handle very large particle count', () => {
    const { container } = render(<RealisticConfetti isActive={true} particleCount={500} />);
    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(container.firstChild?.childNodes.length).toBe(500);
  });

  it('should render with all props', () => {
    const { container } = render(
      <RealisticConfetti
        isActive={true}
        particleCount={50}
        duration={4000}
        colors={['#ff0000', '#00ff00']}
        explosionForce={10}
        wind={0.5}
      />
    );
    expect(container.firstChild).toBeInTheDocument();
  });
});
