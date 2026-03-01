import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Gallery } from './Gallery';

const mockPhotos = [
    {
        url: '/test1.jpg',
        thumb: '/thumb1.jpg',
        title: 'Test Photo 1',
        location: 'Paris, France',
        date: '2024-01-15',
    },
    {
        url: '/test2.jpg',
        title: 'Test Photo 2',
        location: 'Tokyo, Japan',
        date: '2024-02-20',
    },
];

describe('Gallery Component', () => {
    it('renders title and photos', () => {
        render(<Gallery photos={mockPhotos} title="My Gallery" subtitle="A collection" />);

        expect(screen.getByText('// My Gallery')).toBeInTheDocument();
        expect(screen.getByText('A collection')).toBeInTheDocument();
        expect(screen.getByAltText('Test Photo 1')).toBeInTheDocument();
        expect(screen.getByAltText('Test Photo 2')).toBeInTheDocument();
    });

    it('formats and renders metadata', () => {
        render(<Gallery photos={mockPhotos} title="Gallery" />);

        expect(screen.getByText('Paris, France')).toBeInTheDocument();
        expect(screen.getByText('15.01.2024')).toBeInTheDocument();
        expect(screen.getByText('01 / 02')).toBeInTheDocument();
    });

    it('opens and closes dialog', () => {
        render(<Gallery photos={mockPhotos} title="Gallery" />);

        fireEvent.click(screen.getByLabelText('View Test Photo 1'));
        expect(screen.getByRole('dialog')).toBeInTheDocument();

        fireEvent.click(screen.getByLabelText('Close'));
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
});
