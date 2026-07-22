/**
  * @fileoverview Hook for focusing contentEditable elements and selecting text.
  */

import { RefObject, useEffect } from 'react'

/**
  * Focuses a contentEditable element and selects all text when trigger changes to true.
  * 
  * @param ref - ref to the contentEditable div
  * @param trigger - boolean that triggers focus (e.g., editing state)
  */
export function useContentEditableFocus(
    ref: RefObject<HTMLDivElement>,
    trigger: boolean
): void {
    useEffect(() => {
        if (!trigger) return

        const el = ref.current
        if (!el) return

        const timer = setTimeout(() => {
            el.focus()
            const selection = window.getSelection()
            if (selection) {
                const range = document.createRange()
                range.selectNodeContents(el)
                selection.removeAllRanges()
                selection.addRange(range)
            }
        }, 0)

        return () => clearTimeout(timer)
    }, [ref, trigger])
}
