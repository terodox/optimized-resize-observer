import {
    afterEach,
    beforeEach,
    describe,
    expect,
    MockedFunction,
    test,
    vi,
} from 'vitest';
import * as LoopAllEntriesModule from './loop-all-entries';
import { debouncedResizeObserver } from './index';
import { ResizeObserverSingleEntryCallback } from './resize-observer-single-entry-callback';

describe('debounced resize observer', () => {
    let singleEntryCallback: ResizeObserverSingleEntryCallback;

    beforeEach(() => {
        vi.useFakeTimers();

        // Resize observer appears to missing from JsDom?
        // @ts-ignore global not defined
        global.ResizeObserver = vi.fn();
        singleEntryCallback = vi.fn();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    describe('resize observer function', () => {
        let debounceTimeInMs: number;
        let resizeCallbackFunction: Function;
        beforeEach(() => {
            debounceTimeInMs = 100;
            debouncedResizeObserver({ singleEntryCallback, debounceTimeInMs });

            // @ts-ignore global not defined
            resizeCallbackFunction = global.ResizeObserver.mock.calls[0][0];

            vi.spyOn(LoopAllEntriesModule, 'loopAllEntries');
            (LoopAllEntriesModule.loopAllEntries as MockedFunction).mockReset();
        });

        test('should not execute immediately', () => {
            resizeCallbackFunction([]);

            expect(LoopAllEntriesModule.loopAllEntries).not.toHaveBeenCalled();
        });

        test('should execute once after debounceTimeInMs', () => {
            resizeCallbackFunction([]);
            vi.advanceTimersByTime(debounceTimeInMs + 1);

            expect(LoopAllEntriesModule.loopAllEntries).toHaveBeenCalledTimes(
                1
            );
        });

        test('should execute once even if multiple invocations occur debounceTimeInMs has expired', () => {
            resizeCallbackFunction([]);
            vi.advanceTimersByTime(debounceTimeInMs - 10);
            resizeCallbackFunction([]);
            vi.advanceTimersByTime(debounceTimeInMs - 10);
            resizeCallbackFunction([]);
            vi.advanceTimersByTime(debounceTimeInMs);

            expect(LoopAllEntriesModule.loopAllEntries).toHaveBeenCalledTimes(
                1
            );
        });

        test('should pass all entries received during debounce time to loopAllEntries', () => {
            expect.assertions(1);

            const entryOne = { target: 'one' };
            const entryTwo = { target: 'two' };
            const entryThree = { target: 'three' };
            (
                LoopAllEntriesModule.loopAllEntries as MockedFunction
            ).mockImplementation(({ entries }: { entries: any[] }) => {
                expect([...entries]).toEqual([entryOne, entryTwo, entryThree]);
            });

            resizeCallbackFunction([entryOne]);
            vi.advanceTimersByTime(debounceTimeInMs - 10);
            resizeCallbackFunction([entryTwo]);
            vi.advanceTimersByTime(debounceTimeInMs - 10);
            resizeCallbackFunction([entryThree]);
            vi.advanceTimersByTime(debounceTimeInMs);
        });

        test('should pass along the provided singleEntryCallback', () => {
            resizeCallbackFunction([]);
            vi.advanceTimersByTime(debounceTimeInMs);

            expect(LoopAllEntriesModule.loopAllEntries).toHaveBeenCalledWith(
                expect.objectContaining({
                    singleEntryCallback,
                })
            );
        });
    });
});
