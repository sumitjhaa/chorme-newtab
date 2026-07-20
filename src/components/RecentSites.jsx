import { useState, useEffect, memo } from 'react'

const DEFAULTS = [
  { url: 'https://www.google.com', title: 'Google' },
  { url: 'https://www.youtube.com', title: 'YouTube' },
  { url: 'https://github.com', title: 'GitHub' },
  { url: 'https://www.reddit.com', title: 'Reddit' },
  { url: 'https://www.wikipedia.org', title: 'Wikipedia' },
  { url: 'https://news.ycombinator.com', title: 'Hacker News' },
]

function loadSites() {
  try {
    const data = JSON.parse(localStorage.getItem('newtab_recent_sites') || '[]')
    return data.length ? data : DEFAULTS
  } catch {
    return DEFAULTS
  }
}

function RecentSites() {
  const [sites, setSites] = useState(loadSites)

  useEffect(() => {
    function handleStorage() {
      setSites(loadSites())
    }
    window.addEventListener('storage', handleStorage)
    const interval = setInterval(handleStorage, 1000)
    return () => {
      window.removeEventListener('storage', handleStorage)
      clearInterval(interval)
    }
  }, [])

  return (
    <div className="recents-widget">
      {sites.slice(0, 8).map((site) => (
        <a
          key={site.url}
          className="recents-item"
          href={site.url}
          target="_blank"
          rel="noopener noreferrer"
          title={site.url}
        >
          <div className="recents-favicon">
            <img src={`https://www.google.com/s2/favicons?domain=${new URL(site.url).hostname}&sz=32`} alt="" />
          </div>
          <span className="recents-title">{site.title}</span>
        </a>
      ))}
    </div>
  )
}

export default memo(RecentSites)
