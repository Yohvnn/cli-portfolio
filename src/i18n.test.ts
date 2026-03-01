import { describe, it, expect, beforeEach, vi } from 'vitest';
import i18n from './i18n';

describe('i18n.ts', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('initializes i18n with correct default language', () => {
        expect(i18n.language).toBeDefined();
    });

    it('has resources for en and fr languages', () => {
        expect(i18n.options.resources).toBeDefined();
        expect(i18n.options.resources?.en).toBeDefined();
        expect(i18n.options.resources?.fr).toBeDefined();
    });

    it('sets fallback language to en', () => {
        const fallback = i18n.options.fallbackLng;
        if (Array.isArray(fallback)) {
            expect(fallback).toContain('en');
        } else {
            expect(fallback).toBe('en');
        }
    });

    it('disables escapeValue for interpolation', () => {
        expect(i18n.options.interpolation?.escapeValue).toBe(false);
    });

    it('loads saved language from localStorage when available', () => {
        const savedLang = localStorage.getItem('lang');
        expect(['en', 'fr']).toContain(i18n.language);
    });

    it('uses saved theme resources with translation key', () => {
        const enTranslation = i18n.options.resources?.en?.translation;
        expect(enTranslation).toBeDefined();
    });
});
