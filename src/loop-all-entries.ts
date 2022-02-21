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
            console.log('still calling');
            singleEntryCallback({ entry });
        } catch (error) {
            console.log('ohs nos');
            throw error;
        }
    }
}
