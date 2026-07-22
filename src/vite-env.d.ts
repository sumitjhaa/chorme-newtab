/**
 * @fileoverview Vite environment type declarations and Chrome API types.
 */

/// <reference types="vite/client" />

/** CSS module declaration */
declare module '*.css' {
  const content: Record<string, string>
  export default content
}

/** Chrome extension API declaration */
declare const chrome: {
  runtime: {
    sendMessage(message: unknown, callback?: (response: unknown) => void): void
    lastError: { message: string } | null
    onMessage: {
      addListener(
        callback: (
          message: unknown,
          sender: chrome.runtime.MessageSender,
          sendResponse: (response: unknown) => void,
        ) => boolean | void,
      ): void
      removeListener(
        callback: (
          message: unknown,
          sender: chrome.runtime.MessageSender,
          sendResponse: (response: unknown) => void,
        ) => boolean | void,
      ): void
    }
  }
  storage: {
    local: {
      get(keys?: string | string[]): Promise<Record<string, unknown>>
      set(items: Record<string, unknown>): Promise<void>
    }
    onChanged: {
      addListener(
        callback: (
          changes: { [key: string]: { newValue?: unknown; oldValue?: unknown } },
          areaName: string,
        ) => void,
      ): void
      removeListener(
        callback: (
          changes: { [key: string]: { newValue?: unknown; oldValue?: unknown } },
          areaName: string,
        ) => void,
      ): void
    }
  }
}

/** Chrome runtime namespace */
declare namespace chrome.runtime {
  interface MessageSender {
    id?: string
    url?: string
    tab?: unknown
  }
}
