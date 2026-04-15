import { defineStore } from 'pinia'

import type { Part } from '#shared/types'

const MAX_COMPARE = 3

export const useComparisonStore = defineStore('comparison', () => {
  const selectedParts = ref<Part[]>([])

  const isFull = computed(() => selectedParts.value.length >= MAX_COMPARE)

  function isSelected(partId: string) {
    return selectedParts.value.some((p) => p.id === partId)
  }

  function addToCompare(part: Part) {
    if (isFull.value) return
    if (!isSelected(part.id)) {
      selectedParts.value.push(part)
    }
  }

  function removeFromCompare(partId: string) {
    selectedParts.value = selectedParts.value.filter((p) => p.id !== partId)
  }

  function clearComparison() {
    selectedParts.value = []
  }

  return { selectedParts, isFull, isSelected, addToCompare, removeFromCompare, clearComparison }
})
