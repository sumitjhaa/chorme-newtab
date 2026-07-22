
/**
  * @fileoverview Debounce and throttle utility functions for rate-limiting function calls.
  */

/**
  * Debounce: delays execution until after `delay` ms of inactivity.
  * @typeParam T - The type of the function to debounce.
  * @param fn - The function to debounce.
  * @param delay - The delay in milliseconds before `fn` is called.
  * @returns A debounced version of `fn` with an attached `cancel` method.
  */
export function debounce<T extends (...args: any[]) => any>(
    fn: T,
    delay: number
): T & { cancel: () => void; flush: () => void } {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const debounced = function (this: any, ...args: any[]) {
        if (timeoutId !== null) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            fn.apply(this, args);
            timeoutId = null;
        }, delay);
    } as T & { cancel: () => void; flush: () => void };

    debounced.cancel = () => {
        if (timeoutId !== null) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }
    };

    debounced.flush = () => {
        if (timeoutId !== null) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }
    };

    return debounced;
}

/**
  * Throttle: executes at most once every `limit` ms.
  * @typeParam T - The type of the function to throttle.
  * @param fn - The function to throttle.
  * @param limit - The minimum interval in milliseconds between calls.
  * @returns A throttled version of `fn` with an attached `cancel` method.
  */
export function throttle<T extends (...args: any[]) => any>(
    fn: T,
    limit: number
): T & { cancel: () => void } {
    let lastCallTime = 0;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const throttled = function (this: any, ...args: any[]) {
        const now = Date.now();
        const elapsed = now - lastCallTime;

        if (elapsed >= limit) {
            lastCallTime = now;
            fn.apply(this, args);
        } else if (timeoutId === null) {
            timeoutId = setTimeout(() => {
                lastCallTime = Date.now();
                fn.apply(this, args);
                timeoutId = null;
            }, limit - elapsed);
        }
    } as T & { cancel: () => void };

    throttled.cancel = () => {
        if (timeoutId !== null) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }
        lastCallTime = 0;
    };

    return throttled;
}
