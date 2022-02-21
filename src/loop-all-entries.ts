import { ResizeObserverSingleEntryCallback } from './resize-observer-single-entry-callback';

export function loopAllEntries({
    entries,
    singleEntryCallback,
}: {
    entries: Iterable<ResizeObserverEntry>;
    singleEntryCallback: ResizeObserverSingleEntryCallback;
}): void {
    for (const entry of entries) {
        singleEntryCallback({ entry });
    }
}
