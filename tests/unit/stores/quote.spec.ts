import { setActivePinia, createPinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useQuoteStore } from '~/stores/quote'

// Provide a localStorage stub so persist() doesn't throw in the test environment
const storage: Record<string, string> = {}
vi.stubGlobal('localStorage', {
    getItem: (key: string) => storage[key] ?? null,
    setItem: (key: string, value: string) => {
        storage[key] = value
    },
    removeItem: (key: string) => {
        delete storage[key]
    },
})
import type { Part } from '#shared/types'

const mockPart = (id: string, price = 99.99): Part => ({
    id,
    name: `Part ${id}`,
    oem: `OEM-${id}`,
    brand: 'DAF',
    condition: 'new',
    price,
    inStock: true,
    category: 'engine',
    image: '/img/parts/placeholder.jpg',
    description: 'Test part',
})

describe('useQuoteStore', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
    })

    it('starts empty', () => {
        const store = useQuoteStore()
        expect(store.items).toHaveLength(0)
        expect(store.itemCount).toBe(0)
        expect(store.totalPrice).toBe(0)
    })

    it('addItem adds a new part with quantity 1', () => {
        const store = useQuoteStore()
        store.addItem(mockPart('p1'))
        expect(store.items).toHaveLength(1)
        expect(store.items[0]?.quantity).toBe(1)
        expect(store.itemCount).toBe(1)
    })

    it('addItem increments quantity when same part added twice', () => {
        const store = useQuoteStore()
        store.addItem(mockPart('p1'))
        store.addItem(mockPart('p1'))
        expect(store.items).toHaveLength(1)
        expect(store.items[0]?.quantity).toBe(2)
        expect(store.itemCount).toBe(2)
    })

    it('removeItem removes the correct part', () => {
        const store = useQuoteStore()
        store.addItem(mockPart('p1'))
        store.addItem(mockPart('p2'))
        store.removeItem('p1')
        expect(store.items).toHaveLength(1)
        expect(store.items[0]?.part.id).toBe('p2')
    })

    it('updateQuantity sets the correct quantity', () => {
        const store = useQuoteStore()
        store.addItem(mockPart('p1'))
        store.updateQuantity('p1', 5)
        expect(store.items[0]?.quantity).toBe(5)
    })

    it('updateQuantity clamps to minimum 1', () => {
        const store = useQuoteStore()
        store.addItem(mockPart('p1'))
        store.updateQuantity('p1', 0)
        expect(store.items[0]?.quantity).toBe(1)
    })

    it('clearQuote empties all items', () => {
        const store = useQuoteStore()
        store.addItem(mockPart('p1'))
        store.addItem(mockPart('p2'))
        store.clearQuote()
        expect(store.items).toHaveLength(0)
        expect(store.itemCount).toBe(0)
    })

    it('totalPrice sums price × quantity correctly', () => {
        const store = useQuoteStore()
        store.addItem(mockPart('p1', 10))
        store.addItem(mockPart('p2', 20))
        store.updateQuantity('p1', 3)
        // 10 * 3 + 20 * 1 = 50
        expect(store.totalPrice).toBe(50)
    })
})
