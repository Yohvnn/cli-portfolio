import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ScrollProgress } from './ScrollProgress';

describe('ScrollProgress', () => {
    it('renders a progressbar element', () => {
        render(<ScrollProgress />);
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('has accessible label', () => {
        render(<ScrollProgress />);
        expect(screen.getByLabelText('Page scroll progress')).toBeInTheDocument();
    });

    it('has aria-valuemin and aria-valuemax', () => {
        render(<ScrollProgress />);
        const bar = screen.getByRole('progressbar');
        expect(bar).toHaveAttribute('aria-valuemin', '0');
        expect(bar).toHaveAttribute('aria-valuemax', '100');
    });

    it('renders with fixed positioning classes', () => {
        render(<ScrollProgress />);
        const bar = screen.getByRole('progressbar');
        expect(bar).toHaveClass('fixed');
        expect(bar).toHaveClass('top-0');
        expect(bar).toHaveClass('left-0');
        expect(bar).toHaveClass('right-0');
    });

    it('uses accent background color', () => {
        render(<ScrollProgress />);
        const bar = screen.getByRole('progressbar');
        expect(bar).toHaveClass('bg-accent');
    });
});
