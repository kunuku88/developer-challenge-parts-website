import partsData from '../../data/parts.json'
import type { PaginatedResponse, Part } from '#shared/types'

export default defineEventHandler((event) => {
  const query = getQuery(event)

  const search = typeof query['search'] === 'string' ? query['search'].toLowerCase() : ''
  const brands = typeof query['brand'] === 'string' ? query['brand'].split(',').filter(Boolean) : []
  const condition = typeof query['condition'] === 'string' ? query['condition'] : ''
  const category = typeof query['category'] === 'string' ? query['category'] : ''
  const sort = typeof query['sort'] === 'string' ? query['sort'] : ''
  const page = Math.max(1, parseInt(String(query['page'] ?? '1'), 10))
  const pageSize = Math.min(50, Math.max(1, parseInt(String(query['pageSize'] ?? '20'), 10)))

  let results = partsData as Part[]

  if (search) {
    results = results.filter(
      (p) => p.name.toLowerCase().includes(search) || p.oem.toLowerCase().includes(search),
    )
  }

  if (brands.length > 0) {
    results = results.filter((p) => brands.includes(p.brand))
  }

  if (condition) {
    results = results.filter((p) => p.condition === condition)
  }

  if (category) {
    results = results.filter((p) => p.category === category)
  }

  if (sort === 'price_asc') {
    results = [...results].sort((a, b) => a.price - b.price)
  } else if (sort === 'price_desc') {
    results = [...results].sort((a, b) => b.price - a.price)
  }

  const total = results.length
  const data = results.slice((page - 1) * pageSize, page * pageSize)

  return {
    data,
    total,
    page,
    pageSize,
  } satisfies PaginatedResponse<Part>
})
