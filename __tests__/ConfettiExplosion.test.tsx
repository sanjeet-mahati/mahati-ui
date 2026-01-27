import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ConfettiExplosion } from '../src/components/ConfettiExplosion';

// Mock requestAnimationFrame and cancelAnimationFrame
let animationFrameId = 0;
const animationFrameCallbacks = new Map();

beforeAll(() => {
  global.requestAnimationFrame = jest.fn((callback) => {
    const id = ++animationFrameId;
    animationFrameCallbacks.set(id, callback);
    return id;
  });

  global.cancelAnimationFrame = jest.fn((id) => {
    animationFrameCallbacks.delete(id);
  });
});

afterEach(() => {
  animationFrameCallbacks.clear();
  animationFrameId = 0;
  jest.clearAllMocks();
});

describe('ConfettiExplosion', () => {
  it('should render container when active', () => {
    const { container } = render(<ConfettiExplosion isActive={true} />);
    
    // Check for the styled Container component
    const confettiContainer = container.querySelector('div[class*="css-"]');
    expect(confettiContainer).toBeInTheDocument();
  });

  it('should not render when inactive', () => {
    const { container } = render(<ConfettiExplosion isActive={false} />);
    
    // Should render empty
    expect(container).toBeEmptyDOMElement();
  });

  it('should render correct number of particles', () => {
    const { container } = render(<ConfettiExplosion isActive={true} particleCount={50} />);
    
    // Count particle elements (divs with color attribute)
    const particles = container.querySelectorAll('div[color]');
    expect(particles.length).toBe(50);
  });

  it('should render particles with custom colors', () => {
    const customColors = ['#ff0000', '#00ff00', '#0000ff'];
    const { container } = render(
      <ConfettiExplosion isActive={true} colors={customColors} particleCount={10} />
    );
    
    const particles = container.querySelectorAll('div[color]');
    expect(particles.length).toBe(10);
    
    // Check that particles use the custom colors
    particles.forEach(particle => {
      const color = particle.getAttribute('color');
      expect(customColors.map(c => c.toUpperCase())).toContain(color?.toUpperCase());
    });
  });

  it('should not cause infinite re-renders with array props', () => {
    const colors = ['#ff0000', '#00ff00', '#0000ff'];
    
    const { rerender, container } = render(
      <ConfettiExplosion isActive={true} colors={colors} particleCount={10} />
    );
    
    const initialParticles = container.querySelectorAll('div[color]');
    expect(initialParticles.length).toBe(10);
    
    // This should not cause infinite loop
    rerender(<ConfettiExplosion isActive={true} colors={colors} particleCount={10} />);
    rerender(<ConfettiExplosion isActive={true} colors={['#ff0000', '#00ff00', '#0000ff']} particleCount={10} />);
    
    const finalParticles = container.querySelectorAll('div[color]');
    expect(finalParticles.length).toBeGreaterThan(0);
  });

  it('should clean up animation on unmount', () => {
    const { unmount } = render(<ConfettiExplosion isActive={true} />);
    
    expect(global.requestAnimationFrame).toHaveBeenCalled();
    
    unmount();
    
    expect(global.cancelAnimationFrame).toHaveBeenCalled();
  });

  it('should clear particles when isActive becomes false', () => {
    const { rerender, container } = render(
      <ConfettiExplosion isActive={true} particleCount={50} />
    );
    
    let particles = container.querySelectorAll('div[color]');
    expect(particles.length).toBe(50);
    
    rerender(<ConfettiExplosion isActive={false} particleCount={50} />);
    
    // Container should be empty when inactive
    expect(container).toBeEmptyDOMElement();
  });

  it('should apply custom particle size', () => {
    const { container } = render(
      <ConfettiExplosion isActive={true} particleSize={20} particleCount={5} />
    );
    
    const particles = container.querySelectorAll('div[size]');
    expect(particles.length).toBe(5);
    
    // Particles should have sizes based on the particleSize prop
    particles.forEach(particle => {
      const size = parseFloat(particle.getAttribute('size') || '0');
      // Size should be between particleSize/2 and particleSize*1.5
      expect(size).toBeGreaterThanOrEqual(10);
      expect(size).toBeLessThanOrEqual(30);
    });
  });

  it('should use default colors when not provided', () => {
    const { container } = render(<ConfettiExplosion isActive={true} particleCount={10} />);
    
    const particles = container.querySelectorAll('div[color]');
    expect(particles.length).toBe(10);
  });

  it('should handle stage dimensions', () => {
    const { container } = render(
      <ConfettiExplosion 
        isActive={true} 
        stageHeight={600} 
        particleCount={10}
      />
    );
    
    // Check that container exists
    const confettiContainer = container.querySelector('div[class*="css-"]');
    expect(confettiContainer).toBeInTheDocument();
  });

  it('should animate particles on each frame', () => {
    const { container } = render(<ConfettiExplosion isActive={true} particleCount={5} />);
    
    const initialParticles = container.querySelectorAll('div[color]');
    expect(initialParticles.length).toBe(5);

    // Trigger one animation frame
    act(() => {
      const firstCallback = Array.from(animationFrameCallbacks.values())[0];
      if (firstCallback) firstCallback(performance.now());
    });

    // Particles should still be rendered
    const updatedParticles = container.querySelectorAll('div[color]');
    expect(updatedParticles.length).toBeGreaterThan(0);
  });

  it('should create particles with different shapes', () => {
    const { container } = render(<ConfettiExplosion isActive={true} particleCount={20} />);
    
    const particles = container.querySelectorAll('div[shape]');
    expect(particles.length).toBe(20);
    
    // Check that different shapes are used
    const shapes = Array.from(particles).map(p => p.getAttribute('shape'));
    const uniqueShapes = new Set(shapes);
    
    // Should have at least 2 different shapes (statistically likely with 20 particles)
    expect(uniqueShapes.size).toBeGreaterThan(1);
  });

  it('should handle force parameter', () => {
    const { container } = render(
      <ConfettiExplosion isActive={true} force={2} particleCount={10} />
    );
    
    const particles = container.querySelectorAll('div[color]');
    expect(particles.length).toBe(10);
  });

  it('should not crash with zero particles', () => {
    const { container } = render(<ConfettiExplosion isActive={true} particleCount={0} />);
    
    const particles = container.querySelectorAll('div[color]');
    expect(particles.length).toBe(0);
  });

  it('should handle rapid activation/deactivation', () => {
    const { rerender, container } = render(<ConfettiExplosion isActive={false} />);
    
    expect(container).toBeEmptyDOMElement();
    
    rerender(<ConfettiExplosion isActive={true} />);
    let confettiContainer = container.querySelector('div[class*="css-"]');
    expect(confettiContainer).toBeInTheDocument();
    
    rerender(<ConfettiExplosion isActive={false} />);
    expect(container).toBeEmptyDOMElement();
    
    rerender(<ConfettiExplosion isActive={true} />);
    confettiContainer = container.querySelector('div[class*="css-"]');
    expect(confettiContainer).toBeInTheDocument();
  });

  it('should render particles with correct attributes', () => {
    const { container } = render(<ConfettiExplosion isActive={true} particleCount={5} />);
    
    const particles = container.querySelectorAll('div[color]');
    
    particles.forEach(particle => {
      // Check required attributes
      expect(particle).toHaveAttribute('color');
      expect(particle).toHaveAttribute('opacity');
      expect(particle).toHaveAttribute('shape');
      expect(particle).toHaveAttribute('size');
      expect(particle).toHaveAttribute('x');
      expect(particle).toHaveAttribute('y');
    });
  });

  it('should start particles from correct positions', () => {
    const { container } = render(<ConfettiExplosion isActive={true} particleCount={20} />);
    
    const particles = container.querySelectorAll('div[x]');
    
    particles.forEach(particle => {
      const x = parseFloat(particle.getAttribute('x') || '0');
      // Particles should start from either 0 or 100 (left or right edge)
      expect([0, 100]).toContain(x);
      
      const y = parseFloat(particle.getAttribute('y') || '0');
      // Particles should start from bottom (y=100)
      expect(y).toBe(100);
    });
  });
});
