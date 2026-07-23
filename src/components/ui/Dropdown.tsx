import { useState, useRef, useEffect, useCallback, memo } from 'react'

interface DropdownProps {
    value: string
    options: { value: string; label: string }[]
    onChange: (value: string) => void
    className?: string
    width?: number | string
}

function Dropdown({ value, options, onChange, className = '', width }: DropdownProps) {
    const [open, setOpen] = useState(false)
    const [highlight, setHighlight] = useState(-1)
    const triggerRef = useRef<HTMLButtonElement>(null)
    const listRef = useRef<HTMLDivElement>(null)

    const selected = options.find(o => o.value === value)
    const displayLabel = selected?.label ?? value

    const close = useCallback(() => { setOpen(false); setHighlight(-1) }, [])

    useEffect(() => {
        if (!open) return
        const handle = (e: MouseEvent) => {
            if (
                triggerRef.current && !triggerRef.current.contains(e.target as Node) &&
                listRef.current && !listRef.current.contains(e.target as Node)
            ) close()
        }
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') { close(); triggerRef.current?.focus() }
            if (e.key === 'ArrowDown') { e.preventDefault(); setHighlight(h => Math.min(h + 1, options.length - 1)) }
            if (e.key === 'ArrowUp') { e.preventDefault(); setHighlight(h => Math.max(h - 1, 0)) }
            if (e.key === 'Enter' && highlight >= 0) { e.preventDefault(); onChange(options[highlight].value); close(); triggerRef.current?.focus() }
        }
        document.addEventListener('mousedown', handle)
        document.addEventListener('keydown', handleKey)
        return () => { document.removeEventListener('mousedown', handle); document.removeEventListener('keydown', handleKey) }
    }, [open, highlight, options, onChange, close])

    useEffect(() => {
        if (highlight < 0 || !listRef.current) return
        const items = listRef.current.children
        if (items[highlight]) (items[highlight] as HTMLElement).scrollIntoView({ block: 'nearest' })
    }, [highlight])

    const select = useCallback((val: string) => { onChange(val); close(); triggerRef.current?.focus() }, [onChange, close])

    const style = width ? { width, minWidth: width, maxWidth: width } : undefined

    return (
        <div className={`dd ${className}`} style={style}>
            <button
                ref={triggerRef}
                type="button"
                className="dd-trigger"
                onClick={() => setOpen(o => !o)}
                aria-haspopup="listbox"
                aria-expanded={open}
            >
                <span className="dd-trigger-label">{displayLabel}</span>
                <span className="dd-trigger-chevron" />
            </button>
            {open && (
                <div ref={listRef} className="dd-menu" role="listbox">
                    {options.map((opt, i) => (
                        <button
                            key={opt.value}
                            type="button"
                            className={`dd-item${opt.value === value ? ' selected' : ''}${i === highlight ? ' highlighted' : ''}`}
                            role="option"
                            aria-selected={opt.value === value}
                            onMouseEnter={() => setHighlight(i)}
                            onClick={() => select(opt.value)}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

export default memo(Dropdown)
