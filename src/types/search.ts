/**
  * @fileoverview Type definitions for search functionality.
  */

/** A search result from the search engine */
export interface SearchResult {
    /** Result title */
    title: string
    /** Result URL */
    url: string
    /** Result description snippet */
    description?: string
}

/** A search suggestion for autocomplete */
export interface SearchSuggestion {
    /** Suggestion text */
    text: string
    /** Suggestion URL */
    url: string
}

/** Search engine configuration */
export interface SearchEngine {
    /** Display name */
    name: string
    /** Search URL template */
    url: string
}
