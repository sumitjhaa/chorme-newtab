import { useState } from 'react'

export default function HelpTip({ text }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="help-tip">
      <button className="help-tip-btn" onClick={() => setOpen((v) => !v)}>?</button>
      {open && (
        <span className="help-tip-text">{text}</span>
      )}
    </div>
  )
}
