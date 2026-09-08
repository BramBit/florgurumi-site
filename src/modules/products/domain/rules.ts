import type { Product } from './types'

export function isLowStock(product: Pick<Product, 'stock'>, threshold = 5): boolean {
  return product.stock <= threshold
}
