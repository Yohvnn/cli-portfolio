import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TypingCursor } from './TypingCursor';

describe('TypingCursor', () => {
    it('renders an underscore', () => {
        render(<TypingCursor />);
        expect(screen.getByText('_')).toBeInTheDocument();
    });

    it('is hidden from accessibility tree', () => {
        const { container } = render(<TypingCursor />);
        const span = container.querySelector('span');
        expect(span).toHaveAttribute('aria-hidden', 'true');
    });

    it('has the typing-cursor class', () => {
        const { container } = render(<TypingCursor />);
        const span = container.querySelector('span');
        expect(span).toHaveClass('typing-cursor');
    });
});
