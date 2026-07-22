import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock chrome.storage API for tests
;(globalThis as Record<string, unknown>).chrome = {
    storage: {
        local: {
            get: vi.fn(() => Promise.resolve({})),
            set: vi.fn(() => Promise.resolve()),
        },
    },
    runtime: {
        sendMessage: vi.fn(),
        lastError: null,
    },
}
