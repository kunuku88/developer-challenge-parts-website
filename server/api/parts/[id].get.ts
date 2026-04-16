import type { Part } from '#shared/types'

import partsData from '../../data/parts.json'

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  const part = (partsData as Part[]).find((p) => p.id === id)

  if (!part) {
    throw createError({ statusCode: 404, message: `Part "${id}" not found` })
  }

  return part
})
