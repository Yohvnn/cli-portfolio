/** Centralised UI constants for typing, motion, layout, and typography. */

export const TYPING_SPEED = {
    name: 15,
    subtitle: 8,
    about: 5,
} as const;

export const TYPING_DELAY_START = 100;

export const MOTION = {
    /** Hero fade-in */
    heroFade: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 1, delay: 0.2 },
    },

    /** Staggered slide-in for list rows */
    listItem: (i: number) => ({
        initial: { opacity: 0, x: -20 } as const,
        whileInView: { opacity: 1, x: 0 } as const,
        viewport: { once: true } as const,
        transition: { duration: 0.5, delay: i * 0.1 },
    }),

    /** Fade + rise for grid cards */
    gridItem: {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6 },
    },

    /** Staggered fade for tool rows */
    toolItem: (i: number) => ({
        initial: { opacity: 0 } as const,
        whileInView: { opacity: 1 } as const,
        viewport: { once: true } as const,
        transition: { duration: 0.5, delay: i * 0.08 },
    }),

    /** Section fade-in */
    sectionFade: {
        initial: { opacity: 0 },
        whileInView: { opacity: 1 },
        viewport: { once: true },
        transition: { duration: 0.8 },
    },
} as const;

export const MAX_CONTENT_WIDTH = "max-w-4xl mx-auto w-full";

export const TEXT = {
    sectionHeader: "text-sm md:text-sm uppercase tracking-[0.25em] text-accent mb-8",
    metaLabel: "text-[11px] md:text-sm opacity-70 tracking-wider font-light",
    rowTitle: "text-[11px] sm:text-sm md:text-sm uppercase tracking-wide group-hover:text-accent group-hover:translate-x-1 transition-all duration-300",
    rowSub: "text-[11px] sm:text-sm opacity-70 font-light",
    chip: "text-[11px] sm:text-sm uppercase tracking-wider opacity-70 hover:opacity-100 hover:text-accent hover:translate-x-0.5 transition-all duration-200 cursor-default",
    mutedParagraph: "text-sm sm:text-sm opacity-70 leading-relaxed max-w-lg uppercase tracking-wider",
    footer: "text-sm sm:text-sm opacity-60 tracking-widest uppercase",
    contactLink: "group/link block text-sm sm:text-sm opacity-70 hover:opacity-100 hover:text-accent hover:translate-x-1 transition-all duration-300 uppercase tracking-wider",
} as const;

export const ROW_CLASS =
    "group border-t border-border py-5 md:py-6 hover:border-accent transition-colors duration-300";
