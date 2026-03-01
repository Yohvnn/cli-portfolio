import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

const mockChangeLanguage = vi.fn();

vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        i18n: {
            language: 'en',
            changeLanguage: mockChangeLanguage,
        },
    }),
}));

import { useLanguage } from './useLanguage';

describe('useLanguage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        document.documentElement.lang = 'en';
    });

    it('returns current language', () => {
        const { result } = renderHook(() => useLanguage());
        expect(result.current.lang).toBe('en');
    });

    it('provides a toggle function', () => {
        const { result } = renderHook(() => useLanguage());
        expect(typeof result.current.toggle).toBe('function');
    });

    it('calls changeLanguage with "fr" when current is "en"', () => {
        const { result } = renderHook(() => useLanguage());

        act(() => {
            result.current.toggle();
        });

        expect(mockChangeLanguage).toHaveBeenCalledWith('fr');
    });

    it('saves new language to localStorage', () => {
        const { result } = renderHook(() => useLanguage());

        act(() => {
            result.current.toggle();
        });

        expect(localStorage.getItem('lang')).toBe('fr');
    });

    it('updates document.documentElement.lang', () => {
        const { result } = renderHook(() => useLanguage());

        act(() => {
            result.current.toggle();
        });

        expect(document.documentElement.lang).toBe('fr');
    });
});
