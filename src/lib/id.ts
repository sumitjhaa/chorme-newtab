/**
 * @fileoverview Unique ID generation utilities.
 */

/**
 * Generates a unique ID using timestamp + random.
 * Combines `Date.now()` in base-36 with a random base-36 suffix for
 * collision-resistant, compact identifiers.
 * @returns A unique string ID (e.g. `"ltxk2b3a7f1z0m"`).
 */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
