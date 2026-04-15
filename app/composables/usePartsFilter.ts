export function usePartsFilter() {
  const route = useRoute()
  const router = useRouter()

  const search = ref(String(route.query['search'] ?? ''))
  const brands = ref<string[]>(
    route.query['brand'] ? String(route.query['brand']).split(',').filter(Boolean) : [],
  )
  const condition = ref(String(route.query['condition'] ?? ''))
  const category = ref(String(route.query['category'] ?? ''))
  const sort = ref(String(route.query['sort'] ?? ''))

  const filterParams = computed(() => ({
    ...(search.value ? { search: search.value } : {}),
    ...(brands.value.length ? { brand: brands.value.join(',') } : {}),
    ...(condition.value ? { condition: condition.value } : {}),
    ...(category.value ? { category: category.value } : {}),
    ...(sort.value ? { sort: sort.value } : {}),
  }))

  function syncToUrl() {
    void router.replace({ query: filterParams.value })
  }

  let debounceTimer: ReturnType<typeof setTimeout> | undefined
  const debouncedSync = () => {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(syncToUrl, 300)
  }

  watch(search, () => debouncedSync())
  watch([brands, condition, category, sort], syncToUrl)

  // Sync from URL on navigation (browser back/forward)
  watch(
    () => route.query,
    (q) => {
      search.value = String(q['search'] ?? '')
      brands.value = q['brand'] ? String(q['brand']).split(',').filter(Boolean) : []
      condition.value = String(q['condition'] ?? '')
      category.value = String(q['category'] ?? '')
      sort.value = String(q['sort'] ?? '')
    },
  )

  function clearFilters() {
    search.value = ''
    brands.value = []
    condition.value = ''
    category.value = ''
    sort.value = ''
  }

  return { search, brands, condition, category, sort, filterParams, clearFilters }
}
