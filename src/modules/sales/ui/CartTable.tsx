import { X } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table'
import { calculateCartTotal } from '../domain/rules'
import type { CartItem } from '../domain/types'

interface CartTableProps {
  items: CartItem[]
  onRemove: (productId: string) => void
}

export function CartTable({ items, onRemove }: CartTableProps) {
  const total = calculateCartTotal(items)

  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">Aún no has agregado productos.</p>
  }

  return (
    <div className="space-y-2">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Producto</TableHead>
            <TableHead>Cantidad</TableHead>
            <TableHead>Precio unit.</TableHead>
            <TableHead>Subtotal</TableHead>
            <TableHead className="text-right">Quitar</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.productId}>
              <TableCell>{item.productName}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>${item.unitPrice.toFixed(2)}</TableCell>
              <TableCell>${(item.unitPrice * item.quantity).toFixed(2)}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" onClick={() => onRemove(item.productId)}>
                  <X className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="text-right text-lg font-semibold">Total: ${total.toFixed(2)}</div>
    </div>
  )
}
