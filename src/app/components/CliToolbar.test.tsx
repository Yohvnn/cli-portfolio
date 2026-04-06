import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock hooks before importing the component
const mockToggleTheme = vi.fn();
const mockToggleLang = vi.fn();

vi.mock('../hooks/useDarkMode', () => ({
    useDarkMode: () => ({ isDark: true, toggle: mockToggleTheme }),
}));

vi.mock('../hooks/useLanguage', () => ({
    useLanguage: () => ({ lang: 'en', toggle: mockToggleLang }),
}));

vi.mock('../hooks/useClock', () => ({
    useClock: () => ({ time: '14:30', tick: true }),
}));

vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string, fallback?: string) => fallback ?? key,
    }),
}));

import { CliToolbar } from './CliToolbar';

describe('CliToolbar', () => {
    let openMock: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        vi.clearAllMocks();
        openMock = vi.fn();
        vi.stubGlobal('open', openMock);
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('renders as a nav with CLI controls label', () => {
        render(<CliToolbar />);
        expect(screen.getByRole('navigation', { name: 'CLI controls' })).toBeInTheDocument();
    });

    it('shows the prompt prefix', () => {
        render(<CliToolbar />);
        expect(screen.getByText('~/ycch $')).toBeInTheDocument();
    });

    it('shows DARK label when isDark is true', () => {
        render(<CliToolbar />);
        expect(screen.getByText('nav.darkButton')).toBeInTheDocument();
    });

    it('shows EN label when lang is en', () => {
        render(<CliToolbar />);
        expect(screen.getByText('EN')).toBeInTheDocument();
    });

    it('calls toggleTheme on theme button click', () => {
        render(<CliToolbar />);
        fireEvent.click(screen.getByTitle('app.toggleDarkMode'));
        expect(mockToggleTheme).toHaveBeenCalledOnce();
    });

    it('calls toggleLang on language button click', () => {
        render(<CliToolbar />);
        fireEvent.click(screen.getByTitle('app.toggleLanguage'));
        expect(mockToggleLang).toHaveBeenCalledOnce();
    });

    it('hides scroll-to-top button initially (scrollY = 0)', () => {
        render(<CliToolbar />);
        const topButton = screen.getByTitle('Scroll to top');
        expect(topButton.className).toContain('opacity-0');
    });

    it('reveals scroll-to-top after scroll > 300', () => {
        render(<CliToolbar />);
        // Simulate scroll
        Object.defineProperty(globalThis, 'scrollY', { value: 400, writable: true });
        fireEvent.scroll(globalThis);
        const topButton = screen.getByTitle('Scroll to top');
        expect(topButton.className).not.toContain('opacity-0');
    });

    it('redirects to iteria when command is cd iteria and Enter is pressed', () => {
        render(<CliToolbar />);
        fireEvent.click(screen.getByLabelText('Activate command line'));
        const input = screen.getByLabelText('Portfolio CLI command');

        fireEvent.change(input, { target: { value: 'cd ITERIA' } });
        fireEvent.keyDown(input, { key: 'Enter' });

        expect(openMock).toHaveBeenCalledWith('https://iteria.yohanncch.studio/', '_self');
    });

    it('does not redirect for unknown commands', () => {
        render(<CliToolbar />);
        fireEvent.click(screen.getByLabelText('Activate command line'));
        const input = screen.getByLabelText('Portfolio CLI command');

        fireEvent.change(input, { target: { value: 'cd nothing' } });
        fireEvent.keyDown(input, { key: 'Enter' });

        expect(openMock).not.toHaveBeenCalled();
    });

    it('closes terminal on Escape key', () => {
        render(<CliToolbar />);
        fireEvent.click(screen.getByLabelText('Activate command line'));
        let input = screen.getByLabelText('Portfolio CLI command');
        expect(input).toBeInTheDocument();

        fireEvent.keyDown(input, { key: 'Escape' });

        // Input should no longer be visible, clock should show
        expect(screen.getByText('14')).toBeInTheDocument();
    });

    it('closes terminal on blur when input is empty', () => {
        render(<CliToolbar />);
        fireEvent.click(screen.getByLabelText('Activate command line'));
        const input = screen.getByLabelText('Portfolio CLI command') as HTMLInputElement;

        fireEvent.change(input, { target: { value: '' } });
        fireEvent.blur(input);

        // Should show clock indicator
        expect(screen.getByText('14')).toBeInTheDocument();
    });

    it('keeps terminal active on blur when input has text', () => {
        render(<CliToolbar />);
        fireEvent.click(screen.getByLabelText('Activate command line'));
        const input = screen.getByLabelText('Portfolio CLI command');

        fireEvent.change(input, { target: { value: 'cd iteria' } });
        fireEvent.blur(input);

        // Input should still be visible 
        expect(screen.getByLabelText('Portfolio CLI command')).toBeInTheDocument();
    });

    it('scrolls to top when scroll-to-top button is clicked', () => {
        const scrollToMock = vi.fn();
        vi.stubGlobal('scrollTo', scrollToMock);

        render(<CliToolbar />);

        // Simulate scroll to make button visible
        Object.defineProperty(globalThis, 'scrollY', { value: 400, writable: true });
        fireEvent.scroll(globalThis);

        const topButton = screen.getByTitle('Scroll to top');
        fireEvent.click(topButton);

        expect(scrollToMock).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });

        vi.unstubAllGlobals();
    });

    it('displays clock when terminal is not active', () => {
        render(<CliToolbar />);
        expect(screen.getByText('14')).toBeInTheDocument();
        expect(screen.getByText('30')).toBeInTheDocument();
    });

    it('clears command and focuses input on activation', () => {
        render(<CliToolbar />);
        fireEvent.click(screen.getByLabelText('Activate command line'));

        const input = screen.getByLabelText('Portfolio CLI command') as HTMLInputElement;
        expect(input).toHaveFocus();
    });
});
