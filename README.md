# New Tab Wallpaper Chrome Extension

A beautiful new tab page with wallpaper switching and Google search.

## Features

- **Random Wallpapers** from Wallhaven and Pixabay
- **Search** with Google, DuckDuckGo, or Bing
- **Auto-refresh** wallpapers every 30 minutes
- **Settings sidebar** - Press Esc to open/close

## Installation

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (top right toggle)
3. Click "Load unpacked"
4. Select the `dist/` folder from this project

## Usage

- Type in the search box and press Enter to search
- Click the refresh button (bottom center) for a new wallpaper
- Use the dropdown to switch wallpaper sources
- Hover over search bar to change search engine
- Press Esc to open settings

## Build

```bash
npm install
npm run build
```

The built extension will be in the `dist/` folder.
