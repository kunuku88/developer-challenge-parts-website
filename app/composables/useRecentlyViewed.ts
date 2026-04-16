const STORAGE_KEY = 'recently-viewed'
const MAX_ITEMS = 10

export function useRecentlyViewed() {
  const recentPartIds = ref<string[]>([])

  function load() {
    if (!import.meta.client) return
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        recentPartIds.value = JSON.parse(saved) as string[]
      } catch {
        recentPartIds.value = []
      }
    }
  }

  function addViewed(partId: string) {
    if (!import.meta.client) return
    const ids = recentPartIds.value.filter((id) => id !== partId)
    ids.unshift(partId)
    recentPartIds.value = ids.slice(0, MAX_ITEMS)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recentPartIds.value))
  }

  function clearHistory() {
    recentPartIds.value = []
    if (import.meta.client) {
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  onMounted(load)

  return { recentPartIds, addViewed, clearHistory }
}
