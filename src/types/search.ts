// @ts-nocheck
export interface SearchResult {
  title: string
  url: string
  description?: string
}

export interface SearchSuggestion {
  text: string
  url: string
}

export interface SearchEngine {
  name: string
  url: string
}
