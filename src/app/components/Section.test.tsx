import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Section } from './Section';

describe('Section Component', () => {
    it('renders children correctly', () => {
        render(
            <Section>
                <div>Test Content</div>
            </Section>
        );

        expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('applies default classes', () => {
        const { container } = render(
            <Section>
                <div>Content</div>
            </Section>
        );

        const section = container.querySelector('section');
        expect(section).toHaveClass('min-h-screen');
        expect(section).toHaveClass('flex');
        expect(section).toHaveClass('items-center');
        expect(section).toHaveClass('justify-center');
    });

    it('applies custom className', () => {
        const { container } = render(
            <Section className="custom-class">
                <div>Content</div>
            </Section>
        );

        const section = container.querySelector('section');
        expect(section).toHaveClass('custom-class');
        expect(section).toHaveClass('min-h-screen'); // Should still have default classes
    });

    it('renders as a section element', () => {
        const { container } = render(
            <Section>
                <div>Content</div>
            </Section>
        );

        expect(container.querySelector('section')).toBeInTheDocument();
    });

    it('handles multiple children', () => {
        render(
            <Section>
                <h1>Title</h1>
                <p>Paragraph</p>
                <button>Button</button>
            </Section>
        );

        expect(screen.getByText('Title')).toBeInTheDocument();
        expect(screen.getByText('Paragraph')).toBeInTheDocument();
        expect(screen.getByText('Button')).toBeInTheDocument();
    });

    it('applies padding classes', () => {
        const { container } = render(
            <Section>
                <div>Content</div>
            </Section>
        );

        const section = container.querySelector('section');
        expect(section).toHaveClass('px-6');
        expect(section).toHaveClass('py-24');
    });

    it('has relative positioning', () => {
        const { container } = render(
            <Section>
                <div>Content</div>
            </Section>
        );

        const section = container.querySelector('section');
        expect(section).toHaveClass('relative');
    });
});
