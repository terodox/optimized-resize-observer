import { beforeEach, describe, expect, fail, test, vi } from 'vitest';
import { loopAllEntries } from './loop-all-entries.js';

describe('loop all entries', () => {
    let entries: ResizeObserverEntry[];

    beforeEach(() => {
        entries = [
            <any>{ one: 'for the money' },
            <any>{ two: 'for the show' },
            <any>{ three: 'to get ready' },
        ];
    });

    test('should loop invoke callback once per entry provided', () => {
        const singleEntryCallback = vi.fn();

        loopAllEntries({ entries, singleEntryCallback });

        expect(singleEntryCallback).toHaveBeenCalledWith({ entry: entries[0] });
        expect(singleEntryCallback).toHaveBeenCalledWith({ entry: entries[1] });
        expect(singleEntryCallback).toHaveBeenCalledWith({ entry: entries[2] });
        expect(singleEntryCallback).toHaveBeenCalledTimes(3);
    });

    test('should continue to loop even if a callback throws', () => {
        let callCount = 0;
        const singleEntryCallback = vi.fn().mockImplementation(() => {
            callCount++;
            console.log(callCount);
            if (callCount === 2) {
                console.log('Boom');
                throw new Error('this one fails!');
            }
        });

        // For some reason expect().not.toThrow() was not working.
        try {
            loopAllEntries({ entries, singleEntryCallback });
        } catch (error) {
            fail('this should not throw');
        }
    });
});
