# Chrome New Tab Extension - Architecture

## Project Overview
A Chrome New Tab extension built with React, TypeScript, and Vite. Features customizable widgets, wallpapers, and search functionality.

## Core Architecture Nodes

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              ENTRY POINTS                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│  index.html ──→ main.tsx ──→ SettingsProvider ──→ App.tsx                   │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CONTEXT & STATE                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│  SettingsContext                                                              │
│    ├── Settings State (React useState)                                      │
│    ├── BroadcastChannel (cross-tab sync)                                    │
│    ├── chrome.storage.local (persistent storage)                            │
│    └── localStorage (fallback)                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           LAYOUT SYSTEM                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│  App.tsx                                                                    │
│    ├── NUM_COLUMNS = 6 (kanban board)                                       │
│    ├── loadLayout() / saveLayout() (localStorage)                           │
│    ├── Draggable wrapper for each widget                                    │
│    └── Widget distribution into columns                                     │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           WIDGET SYSTEM                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   Clock     │  │  Calendar   │  │  Pomodoro   │  │   Weather   │        │
│  │  (lazy)     │  │  (lazy)     │  │  (lazy)     │  │  (lazy)     │        │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘        │
│                                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │  Greeting   │  │ StickyNote  │  │  Whiteboard │  │    Lists    │        │
│  │  (lazy)     │  │  (lazy)     │  │  (lazy)     │  │  (lazy)     │        │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘        │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────┐        │
│  │                      SearchBar (lazy, spans 2 columns)          │        │
│  └─────────────────────────────────────────────────────────────────┘        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           DATA FLOW                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Settings Flow:                                                              │
│    User Action → useSettings hook → SettingsContext.update()                 │
│         → saveSettingsSync() → chrome.storage.local + localStorage          │
│         → BroadcastChannel.postMessage() (cross-tab sync)                   │
│                                                                              │
│  Wallpaper Flow:                                                             │
│    App.loadWallpaper() → api/fetchRandomWallpaper()                         │
│         → chrome.runtime.sendMessage({ type: 'FETCH_WALLPAPER' })           │
│         → background.ts → fetchers[source]() → external APIs                │
│         → setCurrentWallpaper() → applyWallpaperColors()                    │
│                                                                              │
│  Search Flow:                                                                │
│    SearchBar input → chrome.runtime.sendMessage({ type: 'FETCH_SUGGESTIONS' })
│         → background.ts → Google Suggestions API                            │
│         → SuggestionsDropdown display                                        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           HOOKS (Custom React Hooks)                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Settings & Storage:                                                         │
│    useSettings() - Access SettingsContext                                    │
│    useStorageSync() - Chrome storage synchronization                         │
│    useDebouncedUpdate() - Debounced settings updates                         │
│                                                                              │
│  UI & Layout:                                                                │
│    useCSSVariables() - Font & background CSS variables                       │
│    useMediaQuery() - Responsive breakpoints                                  │
│    useClickOutside() - Modal/popup dismiss                                   │
│    useContentEditableFocus() - Text editing focus                            │
│                                                                              │
│  Timer & Intervals:                                                          │
│    useInterval() - setInterval with cleanup                                  │
│    useWallpaperRefresh() - Auto-refresh wallpaper                            │
│                                                                              │
│  Input & Interaction:                                                        │
│    useKeyboardShortcuts() - Global keyboard handlers                         │
│    useTranslation() - i18n text access                                       │
│                                                                              │
│  Widgets:                                                                    │
│    useLists() - Todo list state management                                   │
│    useCanvas() - Whiteboard canvas operations                                │
│    useTools() - Whiteboard tool selection                                    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           EXTERNAL SERVICES                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Wallpaper APIs (via background.ts service worker):                          │
│    ├── Wallhaven API     - wallhaven.cc/api/v1/search                       │
│    ├── Pixabay API       - pixabay.com/api/                                 │
│    ├── Picsum API        - picsum.photos/1920/1080/random                   │
│    └── Catbox API        - catbox.moe/user/api.php                          │
│                                                                              │
│  Search APIs:                                                                │
│    └── Google Suggestions - suggestqueries.google.com/complete/search       │
│                                                                              │
│  Fonts:                                                                      │
│    └── Google Fonts - fonts.googleapis.com (Inter font)                      │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           STORAGE LAYERS                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Layer 1: React State (useSettings)                                         │
│    └── In-memory, immediate updates                                         │
│                                                                              │
│  Layer 2: localStorage (fallback)                                           │
│    ├── newtab_settings - All settings                                        │
│    ├── newtab_layout - Widget positions                                      │
│    ├── currentWallpaper - Current wallpaper data                             │
│    ├── wallpaperSource - Selected wallpaper provider                         │
│    └── searchEngine - Selected search engine                                 │
│                                                                              │
│  Layer 3: chrome.storage.local (persistent)                                 │
│    └── Same keys as localStorage, synced                                    │
│                                                                              │
│  Layer 4: BroadcastChannel (cross-tab)                                      │
│    └── Real-time sync between open tabs                                     │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Key Connections Summary

| Connection | From | To | Mechanism |
|------------|------|-----|-----------|
| Settings Update | Any Widget | SettingsContext | `useSettings().update()` |
| Wallpaper Fetch | App | Background Script | `chrome.runtime.sendMessage()` |
| Search Suggestions | SearchBar | Background Script | `chrome.runtime.sendMessage()` |
| Cross-Tab Sync | SettingsContext | Other Tabs | `BroadcastChannel` |
| Persistent Storage | Settings | Chrome Storage | `chrome.storage.local` |
| Widget Layout | App | Draggable | `handleDrop()` callback |
| Dark Mode | Settings | DOM | `applyDarkMode()` helper |
| CSS Variables | Settings | CSS Root | `useCSSVariables()` hooks |

## File Structure

```
src/
├── main.tsx                    # Entry point
├── App.tsx                     # Main orchestrator
├── background.ts               # Service worker (wallpaper + suggestions)
├── api/
│   └── index.ts                # API client for wallpaper fetching
├── components/
│   ├── Clock.tsx               # Time display widget
│   ├── Calendar.tsx            # Date display widget
│   ├── Pomodoro.tsx            # Focus timer widget
│   ├── Weather.tsx             # Weather display widget
│   ├── Greeting.tsx            # Personalized greeting
│   ├── StickyNote.tsx          # Sticky notes widget
│   ├── SearchBar.tsx           # Search input + suggestions
│   ├── Wallpaper.tsx           # Background image display
│   ├── Draggable.tsx           # Drag-and-drop wrapper
│   ├── Settings.tsx            # Settings panel
│   ├── whiteboard/             # Drawing canvas widget
│   ├── list/                   # Todo list widget
│   ├── search/                 # Search engine grid + suggestions
│   ├── settings/               # Settings sub-panels
│   ├── ui/                     # Reusable UI components
│   └── errors/                 # Error boundaries
├── context/
│   └── SettingsContext.tsx      # Global settings state
├── hooks/                      # Custom React hooks
├── types/                      # TypeScript type definitions
├── utils/
│   ├── defaults.ts             # Default settings values
│   └── storage.ts              # Storage utilities
├── helpers/                    # Utility functions
├── lib/                        # Low-level utilities
├── translations/               # i18n language files
└── styles/                     # CSS modules
```
