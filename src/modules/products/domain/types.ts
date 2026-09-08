export interface Product {
  id: string
  lineId: string
  name: string
  description: string | null
  price: number
  cost: number | null
  stock: number
  active: boolean
}

export interface ProductWithLine extends Product {
  lineName: string
}

export interface ProductInput {
  lineId: string
  name: string
  description?: string
  price: number
  cost?: number
  stock: number
}
