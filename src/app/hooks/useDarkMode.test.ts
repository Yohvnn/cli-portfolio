import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDarkMode } from './useDarkMode';

describe('useDarkMode Hook', () => {
    beforeEach(() => {
        localStorage.clear();
        document.documentElement.className = '';
    });

    it('defaults to dark mode', () => {
        const { result } = renderHook(() => useDarkMode());
        expect(result.current.isDark).toBe(true);
        expect(localStorage.getItem('theme')).toBe('dark');
    });

    it('reads saved value', () => {
        localStorage.setItem('theme', 'light');
        const { result } = renderHook(() => useDarkMode());
        expect(result.current.isDark).toBe(false);
    });

    it('toggles theme and updates classes', () => {
        const { result } = renderHook(() => useDarkMode());

        act(() => {
            result.current.toggle();
        });

        expect(result.current.isDark).toBe(false);
        expect(document.documentElement.classList.contains('light')).toBe(true);
        expect(localStorage.getItem('theme')).toBe('light');
    });
});
