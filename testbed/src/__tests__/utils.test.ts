import { describe, it, expect } from '@jest/globals';
import { cn } from '../lib/utils';

describe('cn utility function', () => {
  it('should merge class names correctly', () => {
    const result = cn('bg-blue-500', 'text-white', 'p-4');
    expect(result).toBe('bg-blue-500 text-white p-4');
  });

  it('should handle conditional classes', () => {
    const result = cn('base-class', true && 'conditional-class', false && 'hidden-class');
    expect(result).toBe('base-class conditional-class');
  });

  it('should merge conflicting tailwind classes', () => {
    // twMerge should handle conflicting classes
    const result = cn('bg-red-500', 'bg-blue-500');
    expect(result).toBe('bg-blue-500');
  });

  it('should handle arrays of classes', () => {
    const result = cn(['class1', 'class2'], 'class3');
    expect(result).toBe('class1 class2 class3');
  });

  it('should handle empty or undefined inputs', () => {
    expect(cn()).toBe('');
    expect(cn('')).toBe('');
    expect(cn(null)).toBe('');
    expect(cn(undefined)).toBe('');
  });

  it('should handle objects with boolean values', () => {
    const result = cn({
      'always-applied': true,
      'never-applied': false,
      'conditionally-applied': true
    });
    expect(result).toBe('always-applied conditionally-applied');
  });
});