import { setActivePinia, createPinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

import { useComparisonStore } from '~/stores/comparison'
import type { Part } from '#shared/types'

const mockPart = (id: string): Part => ({
    id,
    name: `Part ${id}`,
    oem: `OEM-${id}`,
    brand: 'Volvo',
    condition: 'used',
    price: 49.99,
    inStock: true,
    category: 'brakes',
    image: '/img/parts/placeholder.jpg',
    description: 'Test part',
})

describe('useComparisonStore', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
    })

    it('starts empty', () => {
        const store = useComparisonStore()
        expect(store.selectedParts).toHaveLength(0)
        expect(store.isFull).toBe(false)
    })

    it('addToCompare adds a part', () => {
        const store = useComparisonStore()
        store.addToCompare(mockPart('p1'))
        expect(store.selectedParts).toHaveLength(1)
        expect(store.isSelected('p1')).toBe(true)
    })

    it('addToCompare does not add the same part twice', () => {
        const store = useComparisonStore()
        store.addToCompare(mockPart('p1'))
        store.addToCompare(mockPart('p1'))
        expect(store.selectedParts).toHaveLength(1)
    })

    it('isFull is true when MAX_COMPARE (3) parts are added', () => {
        const store = useComparisonStore()
        store.addToCompare(mockPart('p1'))
        store.addToCompare(mockPart('p2'))
        store.addToCompare(mockPart('p3'))
        expect(store.isFull).toBe(true)
    })

    it('addToCompare is a no-op when full', () => {
        const store = useComparisonStore()
        store.addToCompare(mockPart('p1'))
        store.addToCompare(mockPart('p2'))
        store.addToCompare(mockPart('p3'))
        store.addToCompare(mockPart('p4'))
        expect(store.selectedParts).toHaveLength(3)
    })

    it('removeFromCompare removes the correct part', () => {
        const store = useComparisonStore()
        store.addToCompare(mockPart('p1'))
        store.addToCompare(mockPart('p2'))
        store.removeFromCompare('p1')
        expect(store.selectedParts).toHaveLength(1)
        expect(store.isSelected('p1')).toBe(false)
        expect(store.isSelected('p2')).toBe(true)
    })

    it('clearComparison empties all parts', () => {
        const store = useComparisonStore()
        store.addToCompare(mockPart('p1'))
        store.addToCompare(mockPart('p2'))
        store.clearComparison()
        expect(store.selectedParts).toHaveLength(0)
        expect(store.isFull).toBe(false)
    })
})
