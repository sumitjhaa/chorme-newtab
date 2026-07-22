// @ts-nocheck
import '@testing-library/jest-dom'

// Mock chrome.storage API for tests
globalThis.chrome = {
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
