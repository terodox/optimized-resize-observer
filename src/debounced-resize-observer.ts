import { loopAllEntries } from './loop-all-entries.js';
import { ResizeObserverSingleEntryCallback } from './resize-observer-single-entry-callback.js';

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
