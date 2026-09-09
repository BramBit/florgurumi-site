import { useState } from 'react'
import { useGetProductsQuery } from '@/modules/products'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'
import { Input } from '@/shared/ui/input'
import { Button } from '@/shared/ui/button'
import type { CartItem } from '../domain/types'

interface ProductPickerProps {
  onAdd: (item: CartItem) => void
}

export function ProductPicker({ onAdd }: ProductPickerProps) {
  const { data: products } = useGetProductsQuery()
  const [productId, setProductId] = useState('')
  const [quantity, setQuantity] = useState(1)

  const selectedProduct = (products ?? []).find((p) => p.id === productId)

  const handleAdd = () => {
    if (!selectedProduct || quantity < 1) return
    onAdd({
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      unitPrice: selectedProduct.price,
      quantity,
      availableStock: selectedProduct.stock,
    })
    setProductId('')
    setQuantity(1)
  }

  return (
    <div className="flex items-end gap-2">
      <div className="flex-1">
        <Select value={productId} onValueChange={setProductId}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un producto" />
          </SelectTrigger>
          <SelectContent>
            {(products ?? []).map((product) => (
              <SelectItem key={product.id} value={product.id}>
                {product.name} — {product.lineName} (stock: {product.stock})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="w-24">
        <Input
          type="number"
          min={1}
          max={selectedProduct?.stock}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
      </div>
      <Button type="button" onClick={handleAdd} disabled={!productId}>
        Agregar
      </Button>
    </div>
  )
}
