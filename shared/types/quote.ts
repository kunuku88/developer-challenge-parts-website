import type { Part } from './part'

export interface QuoteItem {
  part: Part
  quantity: number
  addedAt: string // ISO 8601
}
