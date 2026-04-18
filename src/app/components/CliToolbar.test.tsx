import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

const TERMINAL_USERNAME_STORAGE_KEY = 'cli-portfolio:terminal-username';

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
        localStorage.clear();
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

    it('redirects to leafy when command is cd leafy and Enter is pressed', () => {
        render(<CliToolbar />);
        fireEvent.click(screen.getByLabelText('Activate command line'));
        const input = screen.getByLabelText('Portfolio CLI command');

        fireEvent.change(input, { target: { value: 'cd "LEAFY"' } });
        fireEvent.keyDown(input, { key: 'Enter' });

        expect(openMock).toHaveBeenCalledWith('https://leafy.yohanncch.studio/', '_self');
    });

    it('shows a git bash style listing when ls is entered', () => {
        render(<CliToolbar />);
        fireEvent.click(screen.getByLabelText('Activate command line'));
        const input = screen.getByLabelText('Portfolio CLI command');

        fireEvent.change(input, { target: { value: 'ls' } });
        fireEvent.keyDown(input, { key: 'Enter' });

        expect(screen.getByRole('region', { name: 'Terminal output' })).toBeInTheDocument();
        expect(screen.getByText('projects/')).toBeInTheDocument();
        expect(screen.getByText('iteria/')).toBeInTheDocument();
        expect(screen.getByText('leafy/')).toBeInTheDocument();
    });

    it('creates and persists a fake terminal username in localStorage', () => {
        render(<CliToolbar />);

        const storedUsername = localStorage.getItem(TERMINAL_USERNAME_STORAGE_KEY);

        expect(storedUsername).toBeTruthy();
        expect(storedUsername).toMatch(/^[a-z]+_[a-z]+\d{2}$/);
    });

    it('uses the stored terminal username in the listing header', () => {
        localStorage.setItem(TERMINAL_USERNAME_STORAGE_KEY, 'neo_vector42');

        render(<CliToolbar />);
        fireEvent.click(screen.getByLabelText('Activate command line'));
        const input = screen.getByLabelText('Portfolio CLI command');

        fireEvent.change(input, { target: { value: 'ls' } });
        fireEvent.keyDown(input, { key: 'Enter' });

        expect(screen.getByText('neo_vector42')).toBeInTheDocument();
    });

    it('closes terminal output when close button is clicked', () => {
        render(<CliToolbar />);
        fireEvent.click(screen.getByLabelText('Activate command line'));
        const input = screen.getByLabelText('Portfolio CLI command');

        fireEvent.change(input, { target: { value: 'ls' } });
        fireEvent.keyDown(input, { key: 'Enter' });

        fireEvent.click(screen.getByLabelText('Close terminal output'));

        expect(screen.queryByRole('region', { name: 'Terminal output' })).not.toBeInTheDocument();
    });

    it('closes terminal output when clicking outside of it', () => {
        render(<CliToolbar />);
        fireEvent.click(screen.getByLabelText('Activate command line'));
        const input = screen.getByLabelText('Portfolio CLI command');

        fireEvent.change(input, { target: { value: 'ls' } });
        fireEvent.keyDown(input, { key: 'Enter' });

        fireEvent.pointerDown(document.body);

        expect(screen.queryByRole('region', { name: 'Terminal output' })).not.toBeInTheDocument();
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
