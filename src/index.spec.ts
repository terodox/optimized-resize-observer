import { describe, expect, test } from 'vitest';
import { debouncedResizeObserver, throttledResizeObserver } from './index';

describe('publicly exported api', () => {
    test('should export debouncedResizeObserver', () => {
        expect(debouncedResizeObserver).toBeDefined();
    });

    test('should export throttledResizeObserver', () => {
        expect(throttledResizeObserver).toBeDefined();
    });
});
