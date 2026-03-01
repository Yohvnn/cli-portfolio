import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';

const mockIsReturning = vi.fn().mockReturnValue(false);
vi.mock('./useReturningVisitor', () => ({
  useReturningVisitor: () => mockIsReturning(),
}));

import { useGreeting } from './useGreeting';

describe('useGreeting', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  const cases: [number, boolean, string][] = [
    [6,  false, 'profile.nameMorning'],
    [14, false, 'profile.nameAfternoon'],
    [19, false, 'profile.nameEvening'],
    [2,  false, 'profile.nameNight'],
    [6,  true,  'profile.nameMorningReturning'],
    [14, true,  'profile.nameAfternoonReturning'],
    [19, true,  'profile.nameEveningReturning'],
    [2,  true,  'profile.nameNightReturning'],
  ];

  it.each(cases)('hour=%i returning=%s → %s', (hour, returning, expected) => {
    vi.setSystemTime(new Date(2026, 0, 1, hour, 0, 0));
    mockIsReturning.mockReturnValue(returning);
    const { result } = renderHook(() => useGreeting());
    expect(result.current).toBe(expected);
  });
});
