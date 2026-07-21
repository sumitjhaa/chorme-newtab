export function parseMd(md) {
  if (!md) return ''
  let html = md
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  html = html
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/~~(.+?)~~/g, '<del>$1</del>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')

  const lines = html.split('\n')
  let inList = false
  const out = []
  for (const line of lines) {
    const isItem = /^[-*] (.+)$/.test(line)
    if (isItem && !inList) { out.push('<ul>'); inList = true }
    if (!isItem && inList) { out.push('</ul>'); inList = false }
    out.push(isItem ? `<li>${line.replace(/^[-*] (.+)$/, '$1')}</li>` : line.trim() === '' ? '<br/>' : line)
  }
  if (inList) out.push('</ul>')
  return out.join('\n')
}
