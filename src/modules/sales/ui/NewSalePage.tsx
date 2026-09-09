import { useState } from 'react'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/shared/ui/button'
import { Label } from '@/shared/ui/label'
import { ProductPicker } from './ProductPicker'
import { CartTable } from './CartTable'
import { CustomerPicker } from './CustomerPicker'
import { useCreateSaleMutation } from '../api/salesApi'
import type { CartItem } from '../domain/types'

export function NewSalePage() {
  const [items, setItems] = useState<CartItem[]>([])
  const [customerId, setCustomerId] = useState<string | null>(null)
  const [createSale, { isLoading }] = useCreateSaleMutation()
  const navigate = useNavigate()

  const handleAdd = (item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === item.productId)
      if (existing) {
        return prev.map((i) =>
          i.productId === item.productId ? { ...i, quantity: i.quantity + item.quantity } : i
        )
      }
      return [...prev, item]
    })
  }

  const handleRemove = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId))
  }

  const handleConfirm = async () => {
    if (items.length === 0) return
    try {
      await createSale({
        customerId,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
      }).unwrap()
      toast.success('Venta registrada')
      navigate('/ventas')
    } catch (err) {
      const message =
        typeof err === 'object' && err !== null && 'error' in err
          ? String((err as { error: unknown }).error)
          : 'No se pudo registrar la venta'
      toast.error(message)
    }
  }

  return (
    <div className="space-y-6 p-8">
      <h1 className="text-2xl font-semibold">Nueva venta</h1>
      <div className="space-y-2">
        <Label>Cliente</Label>
        <CustomerPicker value={customerId} onChange={setCustomerId} />
      </div>
      <div className="space-y-2">
        <Label>Agregar producto</Label>
        <ProductPicker onAdd={handleAdd} />
      </div>
      <CartTable items={items} onRemove={handleRemove} />
      <Button onClick={handleConfirm} disabled={items.length === 0 || isLoading} className="w-full">
        {isLoading ? 'Registrando...' : 'Confirmar venta'}
      </Button>
    </div>
  )
}
