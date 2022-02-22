import { ResizeObserverSingleEntryCallback } from './resize-observer-single-entry-callback';

export function loopAllEntries({
    entries,
    singleEntryCallback,
}: {
    entries: Iterable<ResizeObserverEntry>;
    singleEntryCallback: ResizeObserverSingleEntryCallback;
}): void {
    for (const entry of entries) {
        try {
            singleEntryCallback({ entry });
        } catch (error) {
            console.warn(
                `optimizedResizeObserver: failed attempting to invoke singleEntryCallback with entry: ${JSON.stringify(
                    entry,
                    null,
                    2
                )}`
            );
        }
    }
}
