import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/ui/dialog'
import { CustomerForm } from './CustomerForm'
import type { Customer } from '../domain/types'

interface CustomerFormDialogProps {
  customer?: Customer
  trigger: React.ReactNode
}

export function CustomerFormDialog({ customer, trigger }: CustomerFormDialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{customer ? 'Editar cliente' : 'Nuevo cliente'}</DialogTitle>
        </DialogHeader>
        <CustomerForm customer={customer} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
