import { describe, it, expect } from 'vitest';
import config from '../../postcss.config.mjs';

describe('postcss.config.mjs', () => {
    it('exports a configuration object', () => {
        expect(config).toBeDefined();
        expect(typeof config).toBe('object');
    });

    it('configuration is empty or contains plugins array', () => {
        if (config.plugins) {
            expect(Array.isArray(config.plugins)).toBe(true);
        }
    });
});
