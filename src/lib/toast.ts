/**
  * @fileoverview Toast notification system with flavours, icons, stacking, and timer.
  */

export type ToastFlavour = 'info' | 'success' | 'error' | 'warning'

const DURATION: Record<ToastFlavour, number> = {
    info: 3000,
    success: 2500,
    error: 4000,
    warning: 3500,
}

const ICONS: Record<ToastFlavour, string> = {
    info: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`,
    success: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
    error: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
    warning: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
}

const MAX_VISIBLE = 5

let container: HTMLDivElement | null = null
let count = 0

function getContainer(): HTMLDivElement {
    if (!container) {
        container = document.createElement('div')
        container.className = 'toast-container'
        document.body.appendChild(container)
    }
    return container
}

/**
  * Show a toast notification.
  * @param message - Text to display
  * @param flavour - Visual style: info | success | error | warning
  * @param duration - Override auto-dismiss time (ms). Omit for flavour default.
  */
export function showToast(message: string, flavour: ToastFlavour = 'info', duration?: number): void {
    const ms = duration ?? DURATION[flavour]
    const toastEl = document.createElement('div')
    toastEl.className = `toast toast-${flavour}`

    toastEl.innerHTML = `
        <span class="toast-icon">${ICONS[flavour]}</span>
        <span class="toast-message">${message}</span>
        <button class="toast-close" aria-label="Dismiss">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
        <div class="toast-timer" style="animation-duration: ${ms}ms"></div>
    `

    // Dismiss on close click
    toastEl.querySelector('.toast-close')!.addEventListener('click', () => dismiss(toastEl))

    // Pause timer on hover
    const timer = toastEl.querySelector('.toast-timer') as HTMLDivElement
    toastEl.addEventListener('mouseenter', () => { timer.style.animationPlayState = 'paused' })
    toastEl.addEventListener('mouseleave', () => { timer.style.animationPlayState = 'running' })

    const c = getContainer()
    c.appendChild(toastEl)
    count++

    // Enforce max visible — remove oldest
    while (count > MAX_VISIBLE && c.firstChild) {
        dismiss(c.firstChild as HTMLElement)
    }

    requestAnimationFrame(() => toastEl.classList.add('toast-visible'))

    setTimeout(() => dismiss(toastEl), ms)
}

function dismiss(el: HTMLElement) {
    if (!el.parentNode) return
    el.classList.remove('toast-visible')
    el.addEventListener('transitionend', () => { el.remove(); count-- }, { once: true })
    // Fallback removal if transitionend doesn't fire
    setTimeout(() => { if (el.parentNode) { el.remove(); count-- } }, 400)
}
