import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useClock } from './useClock';

describe('useClock', () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    it('returns current time as HH:MM', () => {
        vi.setSystemTime(new Date(2026, 0, 1, 14, 30, 0));
        const { result } = renderHook(() => useClock());
        expect(result.current.time).toBe('14:30');
    });

    it('tick is true on even seconds', () => {
        vi.setSystemTime(new Date(2026, 0, 1, 14, 30, 4)); // second=4, even
        const { result } = renderHook(() => useClock());
        expect(result.current.tick).toBe(true);
    });

    it('tick is false on odd seconds', () => {
        vi.setSystemTime(new Date(2026, 0, 1, 14, 30, 3)); // second=3, odd
        const { result } = renderHook(() => useClock());
        expect(result.current.tick).toBe(false);
    });

    it('updates time after one tick', () => {
        vi.setSystemTime(new Date(2026, 0, 1, 14, 30, 0));
        const { result } = renderHook(() => useClock());
        act(() => {
            vi.setSystemTime(new Date(2026, 0, 1, 14, 31, 0));
            vi.advanceTimersByTime(1000);
        });
        expect(result.current.time).toBe('14:31');
    });

    it('cleans up interval on unmount', () => {
        const clearSpy = vi.spyOn(global, 'clearInterval');
        const { unmount } = renderHook(() => useClock());
        unmount();
        expect(clearSpy).toHaveBeenCalled();
    });
});
