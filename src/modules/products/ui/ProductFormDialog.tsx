import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/ui/dialog'
import { ProductForm } from './ProductForm'
import type { Product } from '../domain/types'

interface ProductFormDialogProps {
  product?: Product
  trigger: React.ReactNode
}

export function ProductFormDialog({ product, trigger }: ProductFormDialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{product ? 'Editar producto' : 'Nuevo producto'}</DialogTitle>
        </DialogHeader>
        <ProductForm product={product} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
