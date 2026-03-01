import { describe, it, expect } from 'vitest';
import {
    TYPING_SPEED,
    TYPING_DELAY_START,
    MOTION,
    MAX_CONTENT_WIDTH,
    TEXT,
    ROW_CLASS,
} from './ui';

describe('UI Constants', () => {
    describe('TYPING_SPEED', () => {
        it('defines speed for name, subtitle, and about', () => {
            expect(TYPING_SPEED.name).toBeTypeOf('number');
            expect(TYPING_SPEED.subtitle).toBeTypeOf('number');
            expect(TYPING_SPEED.about).toBeTypeOf('number');
        });

        it('name is slower than subtitle, subtitle slower than about', () => {
            expect(TYPING_SPEED.name).toBeGreaterThan(TYPING_SPEED.subtitle);
            expect(TYPING_SPEED.subtitle).toBeGreaterThan(TYPING_SPEED.about);
        });
    });

    describe('TYPING_DELAY_START', () => {
        it('is a positive number', () => {
            expect(TYPING_DELAY_START).toBeGreaterThan(0);
        });
    });

    describe('MOTION', () => {
        it('heroFade has initial/animate/transition', () => {
            expect(MOTION.heroFade.initial).toHaveProperty('opacity');
            expect(MOTION.heroFade.animate).toHaveProperty('opacity');
            expect(MOTION.heroFade.transition).toHaveProperty('duration');
        });

        it('listItem returns staggered animation props', () => {
            const item0 = MOTION.listItem(0);
            const item2 = MOTION.listItem(2);
            expect(item0.transition.delay).toBeLessThan(item2.transition.delay);
            expect(item0.initial).toHaveProperty('opacity');
            expect(item0.whileInView).toHaveProperty('opacity');
        });

        it('gridItem has initial/whileInView/transition', () => {
            expect(MOTION.gridItem.initial).toHaveProperty('y');
            expect(MOTION.gridItem.whileInView).toHaveProperty('y', 0);
        });

        it('toolItem returns staggered animation props', () => {
            const item0 = MOTION.toolItem(0);
            const item3 = MOTION.toolItem(3);
            expect(item0.transition.delay).toBe(0);
            expect(item3.transition.delay).toBeGreaterThan(0);
        });

        it('sectionFade has required motion properties', () => {
            expect(MOTION.sectionFade).toHaveProperty('initial');
            expect(MOTION.sectionFade).toHaveProperty('whileInView');
            expect(MOTION.sectionFade).toHaveProperty('transition');
        });
    });

    describe('MAX_CONTENT_WIDTH', () => {
        it('contains max-w and mx-auto', () => {
            expect(MAX_CONTENT_WIDTH).toContain('max-w-');
            expect(MAX_CONTENT_WIDTH).toContain('mx-auto');
        });
    });

    describe('TEXT', () => {
        it('defines all expected text style keys', () => {
            const expectedKeys = [
                'sectionHeader',
                'metaLabel',
                'rowTitle',
                'rowSub',
                'chip',
                'mutedParagraph',
                'footer',
                'contactLink',
            ];
            expectedKeys.forEach((key) => {
                expect(TEXT).toHaveProperty(key);
                expect(typeof (TEXT as Record<string, string>)[key]).toBe('string');
            });
        });

        it('sectionHeader includes uppercase and tracking', () => {
            expect(TEXT.sectionHeader).toContain('uppercase');
            expect(TEXT.sectionHeader).toContain('tracking-');
        });
    });

    describe('ROW_CLASS', () => {
        it('contains border and hover classes', () => {
            expect(ROW_CLASS).toContain('border-t');
            expect(ROW_CLASS).toContain('hover:border-accent');
            expect(ROW_CLASS).toContain('transition-colors');
        });
    });
});
