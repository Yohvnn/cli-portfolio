import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Divider } from './Divider';

describe('Divider', () => {
    it('renders an hr element', () => {
        const { container } = render(<Divider />);
        const hr = container.querySelector('hr');
        expect(hr).toBeInTheDocument();
    });

    it('applies border classes', () => {
        const { container } = render(<Divider />);
        const hr = container.querySelector('hr');
        expect(hr).toHaveClass('border-t');
        expect(hr).toHaveClass('border-border');
    });
});
