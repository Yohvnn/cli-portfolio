import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useReturningVisitor } from './useReturningVisitor';

describe('useReturningVisitor', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns false on first visit', () => {
    const { result } = renderHook(() => useReturningVisitor());
    expect(result.current).toBe(false);
  });

  it('sets the visited flag in localStorage on first visit', () => {
    renderHook(() => useReturningVisitor());
    expect(localStorage.getItem('cli-portfolio:visited')).toBe('1');
  });

  it('returns true when visited flag is already set', () => {
    localStorage.setItem('cli-portfolio:visited', '1');
    const { result } = renderHook(() => useReturningVisitor());
    expect(result.current).toBe(true);
  });
});
