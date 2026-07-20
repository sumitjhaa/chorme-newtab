import { useState, useEffect, memo } from 'react'

function loadBookmarks() {
  try {
    const data = JSON.parse(localStorage.getItem('newtab_bookmarks') || '[]')
    return data.length ? data : [
      { url: 'https://www.google.com', title: 'Google' },
      { url: 'https://www.youtube.com', title: 'YouTube' },
      { url: 'https://github.com', title: 'GitHub' },
      { url: 'https://www.reddit.com', title: 'Reddit' },
      { url: 'https://news.ycombinator.com', title: 'Hacker News' },
      { url: 'https://www.wikipedia.org', title: 'Wikipedia' },
      { url: 'https://twitter.com', title: 'X / Twitter' },
      { url: 'https://www.amazon.com', title: 'Amazon' },
    ]
  } catch {
    return []
  }
}

function Bookmark() {
  const [bookmarks, setBookmarks] = useState(loadBookmarks)

  useEffect(() => {
    function handleStorage() {
      setBookmarks(loadBookmarks())
    }
    window.addEventListener('storage', handleStorage)
    const interval = setInterval(handleStorage, 1000)
    return () => {
      window.removeEventListener('storage', handleStorage)
      clearInterval(interval)
    }
  }, [])

  return (
    <div className="bookmark-widget">
      <div className="bookmark-title">Speed Dial</div>
      <div className="bookmark-grid">
        {bookmarks.slice(0, 8).map((bm) => {
          const hostname = new URL(bm.url).hostname.replace(/^www\./, '')
          return (
            <a
              key={bm.url}
              className="bookmark-item"
              href={bm.url}
              target="_blank"
              rel="noopener noreferrer"
              title={bm.title}
            >
              <div className="bookmark-favicon">
                <img src={`https://www.google.com/s2/favicons?domain=${hostname}&sz=64`} alt="" />
              </div>
              <span className="bookmark-name">{hostname}</span>
            </a>
          )
        })}
      </div>
    </div>
  )
}

export default memo(Bookmark)
