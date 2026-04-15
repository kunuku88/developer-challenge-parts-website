export default defineNuxtPlugin(() => {
  const quote = useQuoteStore()
  quote.hydrate()
})
