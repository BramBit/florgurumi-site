import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { Textarea } from '@/shared/ui/textarea'
import { useCreateCustomerMutation, useUpdateCustomerMutation } from '../api/customersApi'
import type { Customer } from '../domain/types'

const customerSchema = z.object({
  name: z.string().min(1, 'Requerido'),
  phone: z.string().optional(),
  email: z.string().email('Correo inválido').optional().or(z.literal('')),
  birthday: z.string().optional(),
  notes: z.string().optional(),
})

type CustomerFormValues = z.infer<typeof customerSchema>

interface CustomerFormProps {
  customer?: Customer
  onSuccess: () => void
}

export function CustomerForm({ customer, onSuccess }: CustomerFormProps) {
  const [createCustomer, { isLoading: isCreating }] = useCreateCustomerMutation()
  const [updateCustomer, { isLoading: isUpdating }] = useUpdateCustomerMutation()
  const isLoading = isCreating || isUpdating

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: customer
      ? {
          name: customer.name,
          phone: customer.phone ?? '',
          email: customer.email ?? '',
          birthday: customer.birthday ?? '',
          notes: customer.notes ?? '',
        }
      : undefined,
  })

  const onSubmit = async (values: CustomerFormValues) => {
    try {
      if (customer) {
        await updateCustomer({ id: customer.id, ...values }).unwrap()
        toast.success('Cliente actualizado')
      } else {
        await createCustomer(values).unwrap()
        toast.success('Cliente creado')
      }
      onSuccess()
    } catch {
      toast.error('No se pudo guardar el cliente')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre</Label>
        <Input id="name" {...register('name')} />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Teléfono</Label>
          <Input id="phone" {...register('phone')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Correo</Label>
          <Input id="email" type="email" {...register('email')} />
          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="birthday">Cumpleaños</Label>
        <Input id="birthday" type="date" {...register('birthday')} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="notes">Notas</Label>
        <Textarea id="notes" {...register('notes')} />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Guardando...' : customer ? 'Guardar cambios' : 'Crear cliente'}
      </Button>
    </form>
  )
}
