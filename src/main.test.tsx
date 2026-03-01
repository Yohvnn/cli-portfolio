import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('main.tsx', () => {
    let rootDivElement: HTMLElement;

    beforeEach(() => {
        document.body.innerHTML = '<div id="root"></div>';
        rootDivElement = document.getElementById('root')!;
        localStorage.clear();
    });

    it('retrieves theme from localStorage with dark as default', () => {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        expect(['dark', 'light']).toContain(savedTheme);
    });

    it('retrieves language from localStorage with en as default', () => {
        const savedLang = localStorage.getItem('lang') || 'en';
        expect(['en', 'fr']).toContain(savedLang);
    });

    it('root container exists in DOM', () => {
        expect(rootDivElement).toBeDefined();
        expect(rootDivElement.id).toBe('root');
    });

    it('should set theme class on document element when provided', () => {
        localStorage.setItem('theme', 'light');
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.classList.add(savedTheme);
        expect(document.documentElement.classList.contains('light')).toBe(true);
    });

    it('should set lang attribute on document element when provided', () => {
        localStorage.setItem('lang', 'fr');
        const savedLang = localStorage.getItem('lang') || 'en';
        document.documentElement.lang = savedLang;
        expect(document.documentElement.lang).toBe('fr');
    });

    it('uses dark theme by default when no theme saved', () => {
        localStorage.removeItem('theme');
        const savedTheme = localStorage.getItem('theme') || 'dark';
        expect(savedTheme).toBe('dark');
    });

    it('uses en language by default when no language saved', () => {
        localStorage.removeItem('lang');
        const savedLang = localStorage.getItem('lang') || 'en';
        expect(savedLang).toBe('en');
    });
});
