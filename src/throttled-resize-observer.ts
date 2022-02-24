import { loopAllEntries } from './loop-all-entries.js';
import { ResizeObserverSingleEntryCallback } from './resize-observer-single-entry-callback.js';

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
    let timerId: ReturnType<typeof setTimeout>;

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
            clearTimeout(timerId);
        }, throttleTimeInMs);
    });
}
