import { loopAllEntries } from './loop-all-entries.js';
import { ResizeObserverSingleEntryCallback } from './resize-observer-single-entry-callback.js';

export { ResizeObserverSingleEntryCallback } from './resize-observer-single-entry-callback.js';

/**
 * A function to push out the execution of any callbacks until a resize event has not occurred on any observed element for the provided debounceTimeInMs
 *
 * @param {object} options - Options object, see below
 * @param {ResizeObserverSingleEntryCallback} options.singleEntryCallback - The callback function that will be provided each element that was resized
 * @param {number} options.debounceTimeInMs - The number of milliseconds that must elapse without a resize event on any observed elements before the callback will be invoked
 *
 * @returns {ResizeObserver} The resize observer that was created with debounce handling
 */
export function debouncedResizeObserver({
    singleEntryCallback,
    debounceTimeInMs,
}: {
    singleEntryCallback: ResizeObserverSingleEntryCallback;
    debounceTimeInMs: number;
}) {
    const accumulatedEntries = new Map<Element, ResizeObserverEntry>();
    let timerId: number;

    return new ResizeObserver((entries) => {
        if (timerId) {
            clearTimeout(timerId);
        }

        entries.forEach((entry) => accumulatedEntries.set(entry.target, entry));

        timerId = setTimeout(() => {
            loopAllEntries({
                entries: accumulatedEntries.values(),
                singleEntryCallback,
            });
            accumulatedEntries.clear();
        }, debounceTimeInMs);
    });
}

/**
 * A function to limit the number of executions of the callback that can be invoked in a given period of time (throttleTimeInMs). This will execute on both the leading and trailing edge of the throttle window. This means that a single resize event will result in 2 executions. Without this a given element would either "lag behind"
 *
 * @param {object} options - Options object, see below
 * @param {ResizeObserverSingleEntryCallback} options.singleEntryCallback - The callback function that will be provided each element that was resized
 * @param {number} options.throttleTimeInMs - The number of milliseconds that will elapse between allowing execution of the provided callback
 *
 * @returns {ResizeObserver} The resize observer that was created with throttled callbacks
 */
export function throttledResizeObserver({
    singleEntryCallback,
    throttleTimeInMs,
}: {
    singleEntryCallback: ResizeObserverSingleEntryCallback;
    throttleTimeInMs: number;
}) {
    const accumulatedEntries = new Map<Element, ResizeObserverEntry>();
    let timerId: number;

    return new ResizeObserver((entries) => {
        entries.forEach((entry) => accumulatedEntries.set(entry.target, entry));

        if (timerId) {
            return;
        }

        loopAllEntries({
            entries,
            singleEntryCallback,
        });

        timerId = setTimeout(() => {
            loopAllEntries({
                entries: accumulatedEntries.values(),
                singleEntryCallback,
            });
            accumulatedEntries.clear();
            timerId = 0;
        }, throttleTimeInMs);
    });
}
