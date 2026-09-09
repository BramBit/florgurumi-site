export interface CartItem {
  productId: string
  productName: string
  unitPrice: number
  quantity: number
  availableStock: number
}

export interface SaleItemDetail {
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

export interface Sale {
  id: string
  customerId: string | null
  customerName: string | null
  totalAmount: number
  createdAt: string
  items: SaleItemDetail[]
}
