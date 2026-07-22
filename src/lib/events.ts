/**
  * @fileoverview Typed event bus for cross-component and cross-tab communication.
  */

type EventMap = Record<string, any>;

/**
  * Create a simple typed event emitter for cross-component communication.
  * All handlers are invoked synchronously. The returned `on` function returns
  * an unsubscribe function for easy cleanup.
  * @typeParam T - A record mapping event names to their payload types.
  * @returns An object with `emit` and `on` methods.
  */
export function createEventBus<T extends EventMap>(): {
    emit: <K extends keyof T>(event: K, data: T[K]) => void
    on: <K extends keyof T>(event: K, handler: (data: T[K]) => void) => () => void
} {
    const listeners = new Map<keyof T, Set<(data: any) => void>>();

    return {
        emit<K extends keyof T>(event: K, data: T[K]) {
            const handlers = listeners.get(event);
            if (handlers) {
                for (const handler of handlers) {
                    handler(data);
                }
            }
        },

        on<K extends keyof T>(event: K, handler: (data: T[K]) => void): () => void {
            if (!listeners.has(event)) {
                listeners.set(event, new Set());
            }
            listeners.get(event)!.add(handler);

            return () => {
                listeners.get(event)?.delete(handler);
            };
        },
    };
}

/**
  * The app's global event bus for cross-tab and cross-component sync.
  * Uses `window.dispatchEvent(new CustomEvent(...))` for same-tab communication
  * and `BroadcastChannel` for cross-tab communication.
  * @returns An object with `emit` and `on` methods. `on` returns an unsubscribe function.
  */
export const appEvents = (() => {
    const bus = createEventBus<Record<string, any>>();
    let channel: BroadcastChannel | null = null;

    try {
        channel = new BroadcastChannel('app-events');
    } catch {
        // BroadcastChannel not supported; fall back to same-tab only.
    }

    if (channel) {
        channel.onmessage = (e: MessageEvent) => {
            if (e.data && typeof e.data.event === 'string') {
                bus.emit(e.data.event, e.data.data);
            }
        };
    }

    return {
        emit(event: string, data?: any) {
            // Same-tab via CustomEvent
            window.dispatchEvent(
                new CustomEvent(event, { detail: data })
            );

            // Cross-tab via BroadcastChannel
            if (channel) {
                channel.postMessage({ event, data });
            }
        },

        on(event: string, handler: (data?: any) => void): () => void {
            // Listen on the internal bus (fed by BroadcastChannel messages)
            const unsubBus = bus.on(event, handler);

            // Also listen on window CustomEvents (same-tab)
            const windowHandler = ((e: CustomEvent) => {
                handler(e.detail);
            }) as EventListener;
            window.addEventListener(event, windowHandler);

            return () => {
                unsubBus();
                window.removeEventListener(event, windowHandler);
            };
        },
    };
})();
