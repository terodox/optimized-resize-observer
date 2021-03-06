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
import { throttledResizeObserver } from './index';
import { ResizeObserverSingleEntryCallback } from './resize-observer-single-entry-callback';

declare global {}

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
        let throttleTimeInMs: number;
        let resizeCallbackFunction: Function;
        beforeEach(() => {
            throttleTimeInMs = 100;
            throttledResizeObserver({ singleEntryCallback, throttleTimeInMs });

            // @ts-ignore global not defined
            resizeCallbackFunction = global.ResizeObserver.mock.calls[0][0];

            vi.spyOn(LoopAllEntriesModule, 'loopAllEntries');
            (
                LoopAllEntriesModule.loopAllEntries as MockedFunction<Function>
            ).mockReset();
        });

        test('should execute immediately on leading edge of throttle window to ensure first actions are not missed', () => {
            resizeCallbackFunction([]);

            expect(LoopAllEntriesModule.loopAllEntries).toHaveBeenCalledTimes(
                1
            );
        });

        test('should execute twice per throttleTimeInMs window, once for leading edge and once for trailing edge', () => {
            resizeCallbackFunction([]);
            vi.advanceTimersByTime(throttleTimeInMs + 1);

            expect(LoopAllEntriesModule.loopAllEntries).toHaveBeenCalledTimes(
                2
            );
        });

        test('should execute twice (leading edge/trailing edge) even if multiple invocations occur within throttle time window', () => {
            resizeCallbackFunction([]);
            vi.advanceTimersByTime(throttleTimeInMs / 4);
            resizeCallbackFunction([]);
            vi.advanceTimersByTime(throttleTimeInMs / 4);
            resizeCallbackFunction([]);
            vi.advanceTimersByTime(throttleTimeInMs);

            expect(LoopAllEntriesModule.loopAllEntries).toHaveBeenCalledTimes(
                2
            );
        });

        test('should pass all entries received during throttle time to loopAllEntries', () => {
            expect.assertions(2);

            const entryOne = { target: 'one' };
            const entryTwo = { target: 'two' };
            const entryThree = { target: 'three' };
            let callCount = 0;
            (
                LoopAllEntriesModule.loopAllEntries as MockedFunction<Function>
            ).mockImplementation(({ entries }: { entries: any[] }) => {
                if (callCount === 0) {
                    expect([...entries]).toEqual([entryOne]);
                } else {
                    expect([...entries]).toEqual([
                        entryOne,
                        entryTwo,
                        entryThree,
                    ]);
                }
                callCount++;
            });

            resizeCallbackFunction([entryOne]);
            vi.advanceTimersByTime(throttleTimeInMs / 4);
            resizeCallbackFunction([entryTwo]);
            vi.advanceTimersByTime(throttleTimeInMs / 4);
            resizeCallbackFunction([entryThree]);
            vi.advanceTimersByTime(throttleTimeInMs);
        });

        test('should pass along the provided singleEntryCallback', () => {
            resizeCallbackFunction([]);
            vi.advanceTimersByTime(throttleTimeInMs);

            expect(LoopAllEntriesModule.loopAllEntries).toHaveBeenCalledWith(
                expect.objectContaining({
                    singleEntryCallback,
                })
            );
        });
    });
});
