import { useState, useCallback, useRef, memo } from 'react'
import {
    searchWallhaven,
    CATEGORIES, PURITIES, SORTING_OPTIONS, TOP_RANGES, RATIOS, COLORS, RESOLUTIONS,
    type WallhavenSearchParams, type WallhavenWallpaper,
} from '../../helpers/wallhaven'
import { setSearchPool, clearSearchPool } from '../../helpers/wallpaperStore'
import { SettingSelect } from '../ui/SettingSelect'

const PER_PAGE = 18

interface FilterProps {
    label: string
    value: string
    options: { value: string; label: string }[]
    onChange: (v: string) => void
}

function Filter({ label, value, options, onChange }: FilterProps) {
    return (
        <div className="wb-filter">
            <span className="wb-filter-label">{label}</span>
            <SettingSelect value={value} options={options} onChange={onChange} />
        </div>
    )
}

interface WallpaperBrowserProps {
    onSelect: (wallpaper: WallhavenWallpaper) => void
}

function WallpaperBrowser({ onSelect }: WallpaperBrowserProps) {
    const [query, setQuery] = useState('')
    const [category, setCategory] = useState('010')
    const [purity, setPurity] = useState('100')
    const [sorting, setSorting] = useState('date_added')
    const [order, setOrder] = useState('desc')
    const [topRange, setTopRange] = useState('1M')
    const [ratio, setRatio] = useState('')
    const [color, setColor] = useState('')
    const [resolution, setResolution] = useState('')

    const [visible, setVisible] = useState<WallhavenWallpaper[]>([])
    const [page, setPage] = useState(0)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [hasSearched, setHasSearched] = useState(false)
    const [ended, setEnded] = useState(false)

    const bufferRef = useRef<WallhavenWallpaper[]>([])
    const apiPageRef = useRef(0)
    const totalApiPagesRef = useRef(0)
    const seedRef = useRef<string | null>(null)
    const fetchingRef = useRef(false)

    const buildParams = useCallback((p: number): WallhavenSearchParams => {
        const params: WallhavenSearchParams = {
            q: query || undefined,
            categories: category,
            purity,
            sorting,
            order,
            page: p,
        }
        if (sorting === 'toplist') params.topRange = topRange
        if (sorting === 'random' && seedRef.current && p > 1) params.seed = seedRef.current
        if (ratio) params.ratios = ratio
        if (color) params.color = color
        if (resolution) params.resolutions = resolution
        return params
    }, [query, category, purity, sorting, order, topRange, ratio, color, resolution])

    const fetchFromBuffer = useCallback(async (targetPage: number) => {
        const buffer = bufferRef.current

        if (buffer.length >= PER_PAGE) {
            setVisible(buffer.splice(0, PER_PAGE))
            setPage(targetPage)
            setEnded(false)
            return
        }

        if (fetchingRef.current) return
        fetchingRef.current = true
        setLoading(true)
        setError('')
        try {
            const nextPage = apiPageRef.current + 1
            if (nextPage > totalApiPagesRef.current && totalApiPagesRef.current > 0) {
                const remaining = buffer.splice(0, buffer.length)
                setVisible(remaining)
                setPage(targetPage)
                setEnded(true)
                fetchingRef.current = false
                setLoading(false)
                return
            }

            const res = await searchWallhaven(buildParams(nextPage))
            apiPageRef.current = nextPage
            totalApiPagesRef.current = res.meta.last_page
            if (res.meta.seed) seedRef.current = res.meta.seed
            buffer.push(...res.data)
            setSearchPool([...buffer])

            setVisible(buffer.splice(0, Math.min(PER_PAGE, buffer.length)))
            setPage(targetPage)
            setEnded(false)
            setHasSearched(true)
        } catch {
            setError('Failed to fetch wallpapers')
        } finally {
            setLoading(false)
            fetchingRef.current = false
        }
    }, [buildParams])

    const doSearch = useCallback(async () => {
        bufferRef.current = []
        apiPageRef.current = 0
        totalApiPagesRef.current = 0
        seedRef.current = null
        fetchingRef.current = false
        setPage(0)
        setVisible([])
        setEnded(false)
        clearSearchPool()
        await fetchFromBuffer(0)
    }, [fetchFromBuffer])

    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault()
        doSearch()
    }, [doSearch])

    const goNext = useCallback(() => fetchFromBuffer(page + 1), [page, fetchFromBuffer])

    const goPrev = useCallback(() => {
        if (page > 0) setPage(p => p - 1)
    }, [page])

    return (
        <div className="wallpaper-browser">
            <form onSubmit={handleSubmit} className="wb-search-form">
                <input
                    type="text"
                    className="setting-input wb-search-input"
                    placeholder="Search wallpapers..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button
                    type="button"
                    className={`wb-order-btn ${order === 'asc' ? 'flipped' : ''}`}
                    onClick={() => setOrder(o => o === 'desc' ? 'asc' : 'desc')}
                    title={order === 'desc' ? 'Descending' : 'Ascending'}
                />
                <button type="submit" className="wb-search-btn" disabled={loading}>
                    {loading ? '...' : 'Search'}
                </button>
            </form>

            <div className="wb-filters">
                <Filter label="Category" value={category} options={CATEGORIES} onChange={setCategory} />
                <Filter label="Purity" value={purity} options={PURITIES} onChange={setPurity} />
                <Filter label="Sort" value={sorting} options={SORTING_OPTIONS} onChange={setSorting} />
                {sorting === 'toplist' && (
                    <Filter label="Top Range" value={topRange} options={TOP_RANGES} onChange={setTopRange} />
                )}
                <Filter label="Resolution" value={resolution} options={[{ value: '', label: 'Any' }, ...RESOLUTIONS]} onChange={setResolution} />
                <Filter label="Ratio" value={ratio} options={[{ value: '', label: 'Any' }, ...RATIOS]} onChange={setRatio} />
                <Filter label="Color" value={color} options={COLORS} onChange={setColor} />
            </div>

            {error && <div className="wb-error">{error}</div>}

            {visible.length > 0 && (
                <>
                    <div className="wb-grid">
                        {visible.map((wp) => (
                            <button
                                key={wp.id}
                                className="wb-thumb"
                                onClick={() => onSelect(wp)}
                                title={`${wp.resolution} | ${wp.category} | ${wp.purity}`}
                            >
                                <img src={wp.thumbs.large} alt="" loading="lazy" />
                                <span className="wb-thumb-info">{wp.resolution}</span>
                            </button>
                        ))}
                    </div>

                    <div className="wb-pagination">
                        <button disabled={page <= 0 || loading} onClick={goPrev}>Prev</button>
                        <span>{page + 1}</span>
                        <button disabled={ended || loading} onClick={goNext}>Next</button>
                    </div>
                </>
            )}

            {hasSearched && visible.length === 0 && !loading && (
                <div className="wb-empty">No wallpapers found</div>
            )}
        </div>
    )
}

export default memo(WallpaperBrowser)
