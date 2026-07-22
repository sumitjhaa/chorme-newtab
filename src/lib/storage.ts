
/**
  * @fileoverview localStorage utilities with JSON serialization and typed adapters.
  */

/**
  * Load parsed JSON from localStorage, returning `fallback` on any error.
  * @typeParam T - The expected type of the stored value.
  * @param key - The localStorage key to read.
  * @param fallback - The value returned if parsing or access fails.
  * @returns The parsed value, or `fallback`.
  */
export function loadJSON<T>(key: string, fallback: T): T {
    try {
        const raw = localStorage.getItem(key);
        if (raw === null) return fallback;
        return JSON.parse(raw) as T;
    } catch {
        return fallback;
    }
}

/**
  * Save a value as JSON to localStorage.
  * @typeParam T - The type of the value to store.
  * @param key - The localStorage key to write.
  * @param value - The value to serialize and store.
  */
export function saveJSON<T>(key: string, value: T): void {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch {
        // Silently ignore write errors (e.g. quota exceeded).
    }
}

/**
  * Remove a key from localStorage.
  * @param key - The localStorage key to remove.
  */
export function removeJSON(key: string): void {
    try {
        localStorage.removeItem(key);
    } catch {
        // Silently ignore removal errors.
    }
}

/**
  * Create a typed storage adapter for a specific key with a fallback default.
  * Provides `load`, `save`, and `remove` methods that operate on a single
  * localStorage key with automatic JSON serialization.
  * @typeParam T - The type of the stored value.
  * @param key - The localStorage key this adapter manages.
  * @param fallback - The default value returned by `load` when no value is stored or on error.
  * @returns An object with `load`, `save`, and `remove` methods.
  */
export function createStorageAdapter<T>(key: string, fallback: T): {
    load: () => T
    save: (value: T) => void
    remove: () => void
} {
    return {
        load: () => loadJSON<T>(key, fallback),
        save: (value: T) => saveJSON<T>(key, value),
        remove: () => removeJSON(key),
    };
}
