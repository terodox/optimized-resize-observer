# optimized-resize-observer

ResizeObservers can be tricky to throttle and debounce. This package delivers both in a very easy to use format!

## debouncedResizeObserver

Debouncing is delaying the execution of a function until a long enough gap in time (the debounce time) has elapsed without any additional interactions.

Usage of the `debouncedResizeObserver`:

```typescript
import { debouncedResizeObserver } from 'optimized-resize-observer';

const resizeObserver = debouncedResizeObserver({
    singleEntryCallback: ({ entry }) => console.log('ResizeObserverEntry', entry),
    debounceTimeInMs: 250
});

resizeObserver.observe(document.querySelector('#my-element-id'));
```

## throttledResizeObserver

Throttling is limiting the number of times a function is executed for a given time interval (throttle time).

For the `throttledResizeObserver` we will execute on both the leading edge of the throttling window, and the trailing edge. In other words, the callback will be invoked immediately as well as at the end of the `throttleTimeInMs`.

There are a few reasons for this:

- If we only invoke on the trailing edge (end of throttle window), then interactions can appear to lag behind
- If we only invoke on the leading edge (immediately on first call), then we could miss some of the changes and have a broken layout

Invoking on both the leading and trailing edge solves both of these issues.

Usage of the `throttledResizeObserver`:

```typescript
import { throttledResizeObserver } from 'optimized-resize-observer';

const resizeObserver = throttledResizeObserver({
    singleEntryCallback: ({ entry }) => console.log('ResizeObserverEntry', entry),
    throttleTimeInMs: 250
});

resizeObserver.observe(document.querySelector('#my-element-id'));
```
