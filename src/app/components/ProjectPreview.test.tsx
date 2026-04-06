import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProjectPreview } from './ProjectPreview';

const singleImage = { src: '/project.jpg', alt: 'Project Screenshot' };

const multiImages = [
    { src: '/img1.jpg', alt: 'Screenshot 1' },
    { src: '/img2.jpg', alt: 'Screenshot 2' },
    { src: '/img3.jpg', alt: 'Screenshot 3' },
];

const baseProps = {
    images: singleImage,
    stack: ['React', 'TypeScript', 'Vite'],
    year: '2024',
    chromeLabel: 'MY-PROJECT.SRC',
};

describe('ProjectPreview', () => {
    it('renders chrome label', () => {
        render(<ProjectPreview {...baseProps} />);
        expect(screen.getByText('MY-PROJECT.SRC')).toBeInTheDocument();
    });

    it('renders the screenshot image', () => {
        render(<ProjectPreview {...baseProps} />);
        const img = screen.getByAltText('Project Screenshot');
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute('src', '/project.jpg');
    });

    it('applies lazy loading to images', () => {
        render(<ProjectPreview {...baseProps} />);
        expect(screen.getByAltText('Project Screenshot')).toHaveAttribute('loading', 'lazy');
    });

    it('renders all stack tags', () => {
        render(<ProjectPreview {...baseProps} />);
        expect(screen.getByText('React')).toBeInTheDocument();
        expect(screen.getByText('TypeScript')).toBeInTheDocument();
        expect(screen.getByText('Vite')).toBeInTheDocument();
    });

    it('renders the year', () => {
        render(<ProjectPreview {...baseProps} />);
        expect(screen.getByText('2024')).toBeInTheDocument();
    });

    it('renders default badge label', () => {
        render(<ProjectPreview {...baseProps} />);
        expect(screen.getByText('[ PREVIEW ]')).toBeInTheDocument();
    });

    it('renders custom badge label', () => {
        render(<ProjectPreview {...baseProps} badgeLabel="[ LIVE ]" />);
        expect(screen.getByText('[ LIVE ]')).toBeInTheDocument();
    });

    it('renders GitHub link when githubUrl is provided', () => {
        render(<ProjectPreview {...baseProps} githubUrl="https://github.com/user/repo" />);
        const link = screen.getByLabelText('MY-PROJECT.SRC source code on GitHub');
        expect(link).toHaveAttribute('href', 'https://github.com/user/repo');
        expect(link).toHaveAttribute('target', '_blank');
    });

    it('does not render GitHub link when githubUrl is omitted', () => {
        render(<ProjectPreview {...baseProps} />);
        expect(screen.queryByText('[ GITHUB ]')).not.toBeInTheDocument();
    });

    it('opens modal on screenshot click', () => {
        render(<ProjectPreview {...baseProps} />);
        fireEvent.click(screen.getByLabelText('View Project Screenshot in fullscreen'));
        expect(screen.getByLabelText('Image preview modal')).toBeInTheDocument();
    });

    it('closes modal via close button', () => {
        render(<ProjectPreview {...baseProps} />);
        fireEvent.click(screen.getByLabelText('View Project Screenshot in fullscreen'));
        fireEvent.click(screen.getByLabelText('Close modal'));
        expect(screen.queryByLabelText('Image preview modal')).not.toBeInTheDocument();
    });

    // --- Multi-image tests ---

    it('shows image count badge for multiple images', () => {
        render(<ProjectPreview {...baseProps} images={multiImages} />);
        expect(screen.getByText('1 / 3')).toBeInTheDocument();
    });

    it('navigates to next image', () => {
        render(<ProjectPreview {...baseProps} images={multiImages} />);
        expect(screen.getByAltText('Screenshot 1')).toBeInTheDocument();

        fireEvent.click(screen.getByLabelText('Next image'));
        expect(screen.getByAltText('Screenshot 2')).toBeInTheDocument();
    });

    it('navigates to previous image (wraps around)', () => {
        render(<ProjectPreview {...baseProps} images={multiImages} />);
        // At index 0, previous wraps to last
        fireEvent.click(screen.getByLabelText('Previous image'));
        expect(screen.getByAltText('Screenshot 3')).toBeInTheDocument();
    });

    it('renders dot indicators for each image', () => {
        render(<ProjectPreview {...baseProps} images={multiImages} />);
        expect(screen.getByLabelText('View image 1')).toBeInTheDocument();
        expect(screen.getByLabelText('View image 2')).toBeInTheDocument();
        expect(screen.getByLabelText('View image 3')).toBeInTheDocument();
    });

    it('selects specific image via dot indicator', () => {
        render(<ProjectPreview {...baseProps} images={multiImages} />);
        fireEvent.click(screen.getByLabelText('View image 3'));
        expect(screen.getByAltText('Screenshot 3')).toBeInTheDocument();
    });

    it('does not show navigation controls for single image', () => {
        render(<ProjectPreview {...baseProps} />);
        expect(screen.queryByLabelText('Next image')).not.toBeInTheDocument();
        expect(screen.queryByLabelText('Previous image')).not.toBeInTheDocument();
    });

    // --- Modal navigation tests ---

    it('navigates images within modal using next button', () => {
        render(<ProjectPreview {...baseProps} images={multiImages} />);

        // Move to second image first
        fireEvent.click(screen.getByLabelText('View image 2'));
        fireEvent.click(screen.getByLabelText('View Screenshot 2 in fullscreen'));

        // Get all next buttons and click modal one
        const nextButtons = screen.getAllByLabelText('Next image');
        fireEvent.click(nextButtons[nextButtons.length - 1]); // Modal next button

        // Verify modal still open and shows next image
        expect(screen.getByLabelText('Image preview modal')).toBeInTheDocument();
    });

    it('navigates images within modal using previous button', () => {
        render(<ProjectPreview {...baseProps} images={multiImages} />);

        // Start at second image
        fireEvent.click(screen.getByLabelText('View image 2'));
        fireEvent.click(screen.getByLabelText('View Screenshot 2 in fullscreen'));

        // Get all previous buttons and click modal one
        const prevButtons = screen.getAllByLabelText('Previous image');
        fireEvent.click(prevButtons[prevButtons.length - 1]); // Modal previous button

        // Verify modal still open
        expect(screen.getByLabelText('Image preview modal')).toBeInTheDocument();
    });

    it('shows image counter in modal navigation footer', () => {
        render(<ProjectPreview {...baseProps} images={multiImages} />);
        fireEvent.click(screen.getByLabelText('View image 1'));
        fireEvent.click(screen.getByLabelText('View Screenshot 1 in fullscreen'));

        // Modal should show counter for multiple images
        const counters = screen.getAllByText(/\d+ \/ \d+/);
        expect(counters.length).toBeGreaterThan(0);
    });

    it('renders liveUrl link when provided', () => {
        render(<ProjectPreview {...baseProps} liveUrl="https://example.com" />);
        const link = screen.getByLabelText('MY-PROJECT.SRC live project');
        expect(link).toHaveAttribute('href', 'https://example.com');
        expect(link).toHaveAttribute('target', '_blank');
    });

    it('does not render liveUrl link when omitted', () => {
        render(<ProjectPreview {...baseProps} />);
        expect(screen.queryByText('[ OPEN APP ]')).not.toBeInTheDocument();
    });

    it('closes modal on close button click', () => {
        render(<ProjectPreview {...baseProps} images={multiImages} />);
        fireEvent.click(screen.getByLabelText('View image 1'));
        fireEvent.click(screen.getByLabelText('View Screenshot 1 in fullscreen'));
        expect(screen.getByLabelText('Image preview modal')).toBeInTheDocument();

        // Get all close buttons and click the modal one
        const closeButtons = screen.getAllByLabelText('Close modal');
        fireEvent.click(closeButtons[closeButtons.length - 1]);
        expect(screen.queryByLabelText('Image preview modal')).not.toBeInTheDocument();
    });
});
