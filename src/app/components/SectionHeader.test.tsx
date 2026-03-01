import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SectionHeader } from './SectionHeader';

describe('SectionHeader', () => {
    it('renders children with // prefix', () => {
        render(<SectionHeader>ABOUT</SectionHeader>);
        const h2 = screen.getByRole('heading', { level: 2 });
        expect(h2.textContent).toContain('//');
        expect(h2.textContent).toContain('ABOUT');
    });

    it('renders as an h2 element', () => {
        render(<SectionHeader>TITLE</SectionHeader>);
        expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    });

    it('applies section header styling classes', () => {
        render(<SectionHeader>EDUCATION</SectionHeader>);
        const heading = screen.getByRole('heading', { level: 2 });
        expect(heading).toHaveClass('uppercase');
        expect(heading).toHaveClass('text-accent');
        expect(heading).toHaveClass('mb-8');
    });

    it('renders complex children', () => {
        render(
            <SectionHeader>
                <span data-testid="inner">PROJECTS</span>
            </SectionHeader>,
        );
        expect(screen.getByTestId('inner')).toBeInTheDocument();
    });
});
