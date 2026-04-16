import { describe, expect, it, beforeEach, vi } from 'vitest'
import { useRecentlyViewed } from '~/composables/useRecentlyViewed'

// Stub import.meta.client so the composable's guards pass in the test environment
vi.stubGlobal('import.meta', { client: true })

// Lightweight localStorage stub
const storage: Record<string, string> = {}
const localStorageMock = {
    getItem: (key: string) => storage[key] ?? null,
    setItem: (key: string, value: string) => {
        storage[key] = value
    },
    removeItem: (key: string) => {
        delete storage[key]
    },
}
vi.stubGlobal('localStorage', localStorageMock)

describe('useRecentlyViewed', () => {
    beforeEach(() => {
        // Clear storage between tests
        for (const key of Object.keys(storage)) {
            delete storage[key]
        }
    })

    it('starts with empty list', () => {
        const { recentPartIds } = useRecentlyViewed()
        expect(recentPartIds.value).toEqual([])
    })

    it('addViewed adds a part id', () => {
        const { recentPartIds, addViewed } = useRecentlyViewed()
        addViewed('p1')
        expect(recentPartIds.value).toContain('p1')
    })

    it('addViewed prepends — most recent is first', () => {
        const { recentPartIds, addViewed } = useRecentlyViewed()
        addViewed('p1')
        addViewed('p2')
        expect(recentPartIds.value[0]).toBe('p2')
        expect(recentPartIds.value[1]).toBe('p1')
    })

    it('addViewed deduplicates — revisiting moves to front', () => {
        const { recentPartIds, addViewed } = useRecentlyViewed()
        addViewed('p1')
        addViewed('p2')
        addViewed('p1')
        expect(recentPartIds.value[0]).toBe('p1')
        expect(recentPartIds.value).toHaveLength(2)
    })

    it('enforces MAX_ITEMS (10) limit', () => {
        const { recentPartIds, addViewed } = useRecentlyViewed()
        for (let i = 1; i <= 12; i++) {
            addViewed(`p${i}`)
        }
        expect(recentPartIds.value).toHaveLength(10)
        // Oldest items are evicted
        expect(recentPartIds.value).not.toContain('p1')
        expect(recentPartIds.value).not.toContain('p2')
    })

    it('persists to localStorage on addViewed', () => {
        const { addViewed } = useRecentlyViewed()
        addViewed('p1')
        const stored = JSON.parse(localStorage.getItem('recently-viewed') ?? '[]') as string[]
        expect(stored).toContain('p1')
    })

    it('clearHistory empties the list and removes from localStorage', () => {
        const { recentPartIds, addViewed, clearHistory } = useRecentlyViewed()
        addViewed('p1')
        clearHistory()
        expect(recentPartIds.value).toHaveLength(0)
        expect(localStorage.getItem('recently-viewed')).toBeNull()
    })
})
