import { defineStore } from 'pinia'

import type { Part } from '#shared/types'
import type { QuoteItem } from '#shared/types'

export const useQuoteStore = defineStore('quote', () => {
  const items = ref<QuoteItem[]>([])

  const itemCount = computed(() => items.value.reduce((sum, i) => sum + i.quantity, 0))

  const totalPrice = computed(() =>
    items.value.reduce((sum, i) => sum + i.part.price * i.quantity, 0),
  )

  function addItem(part: Part) {
    const existing = items.value.find((i) => i.part.id === part.id)
    if (existing) {
      existing.quantity++
    } else {
      items.value.push({ part, quantity: 1, addedAt: new Date().toISOString() })
    }
    persist()
  }

  function removeItem(partId: string) {
    items.value = items.value.filter((i) => i.part.id !== partId)
    persist()
  }

  function updateQuantity(partId: string, qty: number) {
    const item = items.value.find((i) => i.part.id === partId)
    if (item) {
      item.quantity = Math.max(1, qty)
      persist()
    }
  }

  function clearQuote() {
    items.value = []
    persist()
  }

  function persist() {
    if (import.meta.client) {
      localStorage.setItem('quote-items', JSON.stringify(items.value))
    }
  }

  function hydrate() {
    if (import.meta.client) {
      const saved = localStorage.getItem('quote-items')
      if (saved) {
        try {
          items.value = JSON.parse(saved) as QuoteItem[]
        } catch {
          // ignore corrupt data
        }
      }
    }
  }

  return { items, itemCount, totalPrice, addItem, removeItem, updateQuantity, clearQuote, hydrate }
})
