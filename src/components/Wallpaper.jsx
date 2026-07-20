import { memo } from 'react'

function Wallpaper({ wallpaper, isLoading }) {
  return (
    <div className="wallpaper-container">
      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner" />
        </div>
      )}

      {wallpaper?.url ? (
        <img
          className="wallpaper-image"
          src={wallpaper.url}
          alt="Wallpaper"
          loading="eager"
        />
      ) : (
        <div className="default-background" />
      )}

      <div className="wallpaper-overlay" />
    </div>
  )
}

export default memo(Wallpaper)
