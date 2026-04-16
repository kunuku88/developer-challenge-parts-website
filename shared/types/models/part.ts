export interface Part {
  id: string
  name: string
  oem: string
  brand: string
  condition: 'new' | 'used' | 'refurbished'
  price: number
  inStock: boolean
  category: string
  image: string
  description: string
  availableColors?: string[]
  weight?: string
  dimensions?: string
  compatibleModels?: string[]
}
