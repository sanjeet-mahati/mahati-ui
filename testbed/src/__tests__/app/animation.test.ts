import { describe, it, expect } from '@jest/globals';
import { fadeInUp, fadeInDown, fadeIn, staggerContainer } from '../../utils/animation';

describe('Animation configurations', () => {
  describe('fadeInUp', () => {
    it('should have correct initial state', () => {
      expect(fadeInUp.initial).toEqual({ opacity: 0, y: 20 });
    });

    it('should have correct animate state', () => {
      expect(fadeInUp.animate).toEqual({ opacity: 1, y: 0 });
    });

    it('should have correct transition duration', () => {
      expect(fadeInUp.transition).toEqual({ duration: 0.5 });
    });
  });

  describe('fadeInDown', () => {
    it('should have correct initial state', () => {
      expect(fadeInDown.initial).toEqual({ opacity: 0, y: -20 });
    });

    it('should have correct animate state', () => {
      expect(fadeInDown.animate).toEqual({ opacity: 1, y: 0 });
    });

    it('should have correct transition duration', () => {
      expect(fadeInDown.transition).toEqual({ duration: 0.5 });
    });
  });

  describe('fadeIn', () => {
    it('should have correct initial state', () => {
      expect(fadeIn.initial).toEqual({ opacity: 0 });
    });

    it('should have correct animate state', () => {
      expect(fadeIn.animate).toEqual({ opacity: 1 });
    });

    it('should have correct transition duration', () => {
      expect(fadeIn.transition).toEqual({ duration: 0.5 });
    });
  });

  describe('staggerContainer', () => {
    it('should have animate property', () => {
      expect(staggerContainer).toHaveProperty('animate');
      expect(typeof staggerContainer.animate).toBe('object');
    });
  });
});