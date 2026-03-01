import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock components that have complex dependencies
vi.mock('./components/CliToolbar', () => ({
    CliToolbar: () => <nav>Mocked CliToolbar</nav>,
}));

vi.mock('./components/Gallery', () => ({
    Gallery: ({ title, subtitle }: any) => (
        <div>
            <h2>{title}</h2>
            <p>{subtitle}</p>
        </div>
    ),
}));

// Mock dependencies
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string, options?: any) => {
            const translations: Record<string, any> = {
                'profile.name': 'Yohann',
                'profile.title': 'Full-stack Developer',
                'profile.location': 'Berlin, Germany',
                'home.aboutText': 'Passionate about building digital experiences',
                'home.educationTitle': 'EDUCATION',
                'home.workTitle': 'WORK',
                'home.skillsTitle': 'SKILLS',
                'gallery.title': 'PHOTOGRAPHY',
                'gallery.subtitle': 'A collection of moments',
                'toolbox.title': 'PROJECTS',
                'toolbox.subtitle': 'Tools and explorations',
                'profile.locationTitle': 'LOCATION',
                'about.contactTitle': 'CONTACT',
                'about.description': 'About me description',
                'home.copyright': `© ${new Date().getFullYear()} Yohann`,
                'skills.programming': ['JavaScript', 'TypeScript', 'React'],
                'skills.database': ['PostgreSQL', 'MongoDB'],
                'skills.web': ['Next.js', 'Vue'],
                'skills.media': ['Figma', 'Blender'],
                'skills.titles.programming': 'PROGRAMMING',
                'skills.titles.database': 'DATABASE',
                'skills.titles.web': 'WEB',
                'skills.titles.media': 'MEDIA',
                'education.items': [
                    { date: '2020-2022', title: 'BS Computer Science', org: 'TU Berlin' }
                ],
                'work.items': [
                    { date: '2023-2024', title: 'Senior Developer', org: 'Tech Corp', description: 'Built scalable systems' }
                ],
                'toolbox.hawkMcp.title': 'HAWK MCP',
                'toolbox.hawkMcp.desc': 'Terminal assistant',
                'toolbox.hawkMcp.github': 'https://github.com/Yohvnn/hawk-mcp',
                'toolbox.hawkMcp.comingSoon': 'READY',
                'toolbox.hawkMobile.title': 'HAWK Mobile',
                'toolbox.hawkMobile.desc': 'Mobile chat app',
                'toolbox.hawkMobile.github': 'https://github.com/Yohvnn/hawk-mobile',
                'toolbox.hawkMobile.comingSoon': 'READY',
                'toolbox.pixelWidgets.title': 'Pixel Widgets',
                'toolbox.pixelWidgets.desc': 'Android widgets',
                'toolbox.pixelWidgets.github': 'https://github.com/Yohvnn/pixel-widgets',
                'toolbox.pixelWidgets.comingSoon': 'READY',
                'toolbox.pdf.title': 'PDF Tool',
                'toolbox.pdf.desc': 'PDF processing',
                'toolbox.pdf.comingSoon': 'COMING SOON',
                'toolbox.tictactoe.title': 'Tic Tac Toe',
                'toolbox.tictactoe.desc': 'Game',
                'toolbox.tictactoe.comingSoon': 'COMING SOON',
                'toolbox.flipcoin.title': 'Flip Coin',
                'toolbox.flipcoin.desc': 'Coin flip',
                'toolbox.flipcoin.comingSoon': 'COMING SOON',
                'toolbox.rag.title': 'RAG Chatbot',
                'toolbox.rag.desc': 'RAG system',
                'toolbox.rag.comingSoon': 'COMING SOON',
            };

            if (options?.returnObjects) {
                return translations[key] || [];
            }
            return translations[key] || key;
        },
    }),
}));

vi.mock('./hooks/useTypingEffect', () => ({
    useTypingEffect: (text: string) => text,
}));

vi.mock('../../public/gallery/index.json', () => ({
    default: [
        { src: '/gallery/photo1.jpg', alt: 'Photo 1' },
        { src: '/gallery/photo2.jpg', alt: 'Photo 2' },
    ],
}));

describe('App Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders main content section', () => {
        render(<App></App>);
        const main = screen.getByRole('main');
        expect(main).toBeInTheDocument();
    });

    it('renders skip navigation link', () => {
        render(<App></App>);
        const skipLink = screen.getByText('[ SKIP TO CONTENT ]');
        expect(skipLink).toBeInTheDocument();
        expect(skipLink).toHaveClass('sr-only');
    });

    it('renders profile section with name', () => {
        render(<App></App>);
        const heading = screen.getByRole('heading', { level: 1 });
        expect(heading).toBeInTheDocument();
        expect(heading.textContent).toContain('Yohann');
    });

    it('renders profile image', () => {
        render(<App></App>);
        const img = screen.getByAltText(/profile/i);
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute('src', '/my-notion-face-transparent.png');
    });

    it('renders education section header', () => {
        render(<App></App>);
        const educationHeaders = screen.getAllByText((_, el) => el?.textContent?.includes('EDUCATION') || false);
        expect(educationHeaders.length).toBeGreaterThan(0);
    });

    it('renders education items from i18n', () => {
        render(<App></App>);
        expect(screen.getByText('BS Computer Science')).toBeInTheDocument();
        expect(screen.getByText('TU Berlin')).toBeInTheDocument();
    });

    it('renders work section header', () => {
        render(<App></App>);
        const workHeaders = screen.getAllByText((_, el) => el?.textContent?.includes('WORK') || false);
        expect(workHeaders.length).toBeGreaterThan(0);
    });

    it('renders work items from i18n', () => {
        render(<App></App>);
        expect(screen.getByText('Senior Developer')).toBeInTheDocument();
        expect(screen.getByText('Tech Corp')).toBeInTheDocument();
    });

    it('renders skills section header', () => {
        render(<App></App>);
        const skillsHeaders = screen.getAllByText((_, el) => el?.textContent?.includes('SKILLS') || false);
        expect(skillsHeaders.length).toBeGreaterThan(0);
    });

    it('renders skill categories', () => {
        render(<App></App>);
        expect(screen.getByText('PROGRAMMING')).toBeInTheDocument();
        expect(screen.getByText('DATABASE')).toBeInTheDocument();
        expect(screen.getByText('WEB')).toBeInTheDocument();
        expect(screen.getByText('MEDIA')).toBeInTheDocument();
    });

    it('renders individual skills', () => {
        render(<App></App>);
        expect(screen.getByText('JavaScript')).toBeInTheDocument();
        expect(screen.getByText('TypeScript')).toBeInTheDocument();
        expect(screen.getByText('React')).toBeInTheDocument();
        expect(screen.getByText('PostgreSQL')).toBeInTheDocument();
    });

    it('renders gallery section', () => {
        render(<App></App>);
        const galleryTitle = screen.getByText('PHOTOGRAPHY');
        expect(galleryTitle).toBeInTheDocument();
    });

    it('renders toolbox section with projects header', () => {
        render(<App></App>);
        const projectHeaders = screen.getAllByText((_, el) => el?.textContent?.includes('PROJECTS') || false);
        expect(projectHeaders.length).toBeGreaterThan(0);
    });

    it('renders location section', () => {
        render(<App></App>);
        expect(screen.getByText(/LOCATION/)).toBeInTheDocument();
        expect(screen.getByText('Berlin, Germany')).toBeInTheDocument();
    });

    it('renders contact section with links', () => {
        render(<App></App>);
        const contactHeaders = screen.getAllByText((_, el) => el?.textContent?.includes('CONTACT') || false);
        expect(contactHeaders.length).toBeGreaterThan(0);
        const emailLink = screen.getByRole('link', { name: /Send email/i });
        expect(emailLink).toHaveAttribute('href', 'mailto:hello@yohanncch.studio');
    });

    it('renders GitHub contact link', () => {
        render(<App></App>);
        const githubLink = screen.getByRole('link', { name: /GitHub profile/i });
        expect(githubLink).toHaveAttribute('href', 'https://github.com/Yohvnn');
        expect(githubLink).toHaveAttribute('target', '_blank');
    });

    it('renders LinkedIn contact link', () => {
        render(<App></App>);
        const linkedInLink = screen.getByRole('link', { name: /LinkedIn profile/i });
        expect(linkedInLink).toHaveAttribute('href', 'https://linkedin.com/in/yohann-ccw');
        expect(linkedInLink).toHaveAttribute('target', '_blank');
    });

    it('renders copyright footer with current year', () => {
        render(<App></App>);
        const currentYear = new Date().getFullYear();
        // Use getAllByText since the year might appear multiple times
        const yearElements = screen.getAllByText(new RegExp(currentYear.toString()));
        expect(yearElements.length).toBeGreaterThan(0);
    });

    it('renders scroll progress bar', () => {
        render(<App></App>);
        const progressBar = screen.getByRole('progressbar');
        expect(progressBar).toBeInTheDocument();
    });

    it('renders mocked CLI toolbar', () => {
        render(<App></App>);
        const nav = screen.getByText('Mocked CliToolbar');
        expect(nav).toBeInTheDocument();
    });

    it('renders tools with proper numbering', () => {
        render(<App></App>);
        expect(screen.getByText('01')).toBeInTheDocument();
        expect(screen.getByText('02')).toBeInTheDocument();
    });

    it('renders coming soon tools', () => {
        render(<App></App>);
        const comingSoonBadges = screen.getAllByText('COMING SOON');
        expect(comingSoonBadges.length).toBeGreaterThan(0);
    });

    it('renders tool GitHub links for tools with GitHub URLs', () => {
        render(<App></App>);
        const githubLinks = screen.getAllByText('[ GITHUB ]');
        expect(githubLinks.length).toBeGreaterThan(0);
    });

    it('renders about section', () => {
        render(<App></App>);
        expect(screen.getByText('About me description')).toBeInTheDocument();
    });

    it('has accessible skip navigation functionality', () => {
        render(<App></App>);
        const skipLink = screen.getByText('[ SKIP TO CONTENT ]');
        expect(skipLink).toHaveAttribute('href', '#main-content');
    });

    it('renders structure with proper semantic HTML', () => {
        render(<App></App>);
        const main = screen.getByRole('main');
        expect(main).toHaveAttribute('id', 'main-content');
    });

    it('renders Strava contact link', () => {
        render(<App></App>);
        const stravaLink = screen.getByRole('link', { name: /Strava profile/i });
        expect(stravaLink).toHaveAttribute('href', 'https://www.strava.com/athletes/yohanncch');
        expect(stravaLink).toHaveAttribute('target', '_blank');
    });

    it('renders container with background and text styles', () => {
        const { container } = render(<App></App>);
        const div = container.firstChild as HTMLElement;
        expect(div).toHaveClass('bg-background', 'text-foreground');
    });
});
