import { describe, expect, it, vi } from 'vitest'
import { usePartsFilter } from '~/composables/usePartsFilter'

// Stub route/router — usePartsFilter uses Nuxt auto-imported composables which proxy vue-router.
// We test reactive filter logic rather than URL-based initialisation (that's covered by e2e).
vi.mock('vue-router', async (importOriginal) => {
    const actual = await importOriginal<typeof import('vue-router')>()
    return {
        ...actual,
        useRoute: () => ({ query: {} }),
        useRouter: () => ({ replace: vi.fn().mockResolvedValue(undefined) }),
    }
})

describe('usePartsFilter', () => {
    it('initialises with empty filter values', () => {
        const { search, brands, condition, category, sort } = usePartsFilter()
        expect(search.value).toBe('')
        expect(brands.value).toEqual([])
        expect(condition.value).toBe('')
        expect(category.value).toBe('')
        expect(sort.value).toBe('')
    })

    it('filterParams is empty when nothing is set', () => {
        const { filterParams } = usePartsFilter()
        expect(filterParams.value).toEqual({})
    })

    it('filterParams reflects search term reactively', () => {
        const { search, filterParams } = usePartsFilter()
        search.value = 'pump'
        expect(filterParams.value).toMatchObject({ search: 'pump' })
    })

    it('filterParams reflects brands as comma-joined string', () => {
        const { brands, filterParams } = usePartsFilter()
        brands.value = ['DAF', 'MAN']
        expect(filterParams.value).toMatchObject({ brand: 'DAF,MAN' })
    })

    it('filterParams omits keys whose value is empty', () => {
        const { search, condition, filterParams } = usePartsFilter()
        search.value = 'drum'
        condition.value = ''
        expect(filterParams.value).not.toHaveProperty('condition')
    })

    it('filterParams reflects condition and category', () => {
        const { condition, category, filterParams } = usePartsFilter()
        condition.value = 'new'
        category.value = 'Engine'
        expect(filterParams.value).toMatchObject({ condition: 'new', category: 'Engine' })
    })

    it('clearFilters resets all values to empty', () => {
        const { search, brands, condition, category, sort, clearFilters } = usePartsFilter()
        search.value = 'drum'
        brands.value = ['DAF']
        condition.value = 'used'
        category.value = 'Brakes'
        sort.value = 'price-asc'
        clearFilters()
        expect(search.value).toBe('')
        expect(brands.value).toEqual([])
        expect(condition.value).toBe('')
        expect(category.value).toBe('')
        expect(sort.value).toBe('')
    })
})
