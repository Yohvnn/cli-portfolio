import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTypingEffect } from './useTypingEffect';

describe('useTypingEffect Hook', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('starts with empty string', () => {
        const { result } = renderHook(() => useTypingEffect('Hello', 50, 0));
        expect(result.current).toBe('');
    });

    it('types characters over time', () => {
        const { result } = renderHook(() => useTypingEffect('Hey', 50, 0));

        act(() => {
            vi.advanceTimersByTime(50);
        });
        expect(result.current).toBe('H');

        act(() => {
            vi.advanceTimersByTime(100);
        });
        expect(result.current).toBe('Hey');
    });

    it('respects initial delay', () => {
        const { result } = renderHook(() => useTypingEffect('Hi', 50, 200));

        act(() => {
            vi.advanceTimersByTime(150);
        });
        expect(result.current).toBe('');

        act(() => {
            vi.advanceTimersByTime(100);
        });
        expect(result.current).toBe('H');
    });

    it('restarts typing when text changes', () => {
        const { result, rerender } = renderHook(
            ({ text }) => useTypingEffect(text, 50, 0),
            { initialProps: { text: 'Old' } },
        );

        act(() => {
            vi.advanceTimersByTime(100);
        });
        expect(result.current).toBe('Ol');

        rerender({ text: 'New' });
        expect(result.current).toBe('');
    });
});
