export function useQuote() {
  const store = useQuoteStore()

  onMounted(() => store.hydrate())

  function isInQuote(partId: string) {
    return store.items.some((i) => i.part.id === partId)
  }

  return {
    ...store,
    isInQuote,
  }
}
