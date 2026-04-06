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

    it('navigates to next and previous photo inside dialog', () => {
        render(<Gallery photos={mockPhotos} title="Gallery" />);

        fireEvent.click(screen.getByLabelText('View Test Photo 1'));
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getAllByText('Test Photo 1').length).toBeGreaterThan(0);

        fireEvent.click(screen.getByLabelText('Next photo'));
        expect(screen.getAllByText('Test Photo 2').length).toBeGreaterThan(0);

        fireEvent.click(screen.getByLabelText('Previous photo'));
        expect(screen.getAllByText('Test Photo 1').length).toBeGreaterThan(0);
    });

    it('renders without subtitle when not provided', () => {
        render(<Gallery photos={mockPhotos} title="Gallery" />);

        expect(screen.queryByText('A collection')).not.toBeInTheDocument();
    });

    it('wraps to last photo when navigating previous from first photo', () => {
        render(<Gallery photos={mockPhotos} title="Gallery" />);

        fireEvent.click(screen.getByLabelText('View Test Photo 1'));
        fireEvent.click(screen.getByLabelText('Previous photo'));

        expect(screen.getAllByText('Test Photo 2').length).toBeGreaterThan(0);
    });

    it('wraps to first photo when navigating next from last photo', () => {
        render(<Gallery photos={mockPhotos} title="Gallery" />);

        fireEvent.click(screen.getByLabelText('View Test Photo 2'));
        fireEvent.click(screen.getByLabelText('Next photo'));

        expect(screen.getAllByText('Test Photo 1').length).toBeGreaterThan(0);
    });

    it('renders photo metadata in dialog', () => {
        render(<Gallery photos={mockPhotos} title="Gallery" />);

        fireEvent.click(screen.getByLabelText('View Test Photo 1'));

        // Dialog should be open with content
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getAllByText('Test Photo 1').length).toBeGreaterThan(0);
        // Index counter appears in dialog
        const counters = screen.queryAllByText(/01 \/ 02/);
        expect(counters.length).toBeGreaterThan(0);
    });
});
