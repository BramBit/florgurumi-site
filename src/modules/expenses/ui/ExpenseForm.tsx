import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { useAppSelector } from '@/shared/lib/hooks'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { ExpenseLineSelect } from './ExpenseLineSelect'
import { useCreateExpenseMutation } from '../api/expensesApi'

const expenseSchema = z.object({
  description: z.string().min(1, 'Requerido'),
  amount: z.coerce.number().min(0, 'Debe ser mayor o igual a 0'),
  expenseDate: z.string().min(1, 'Requerido'),
})

type ExpenseFormInput = z.input<typeof expenseSchema>
type ExpenseFormOutput = z.output<typeof expenseSchema>

interface ExpenseFormProps {
  onSuccess: () => void
}

export function ExpenseForm({ onSuccess }: ExpenseFormProps) {
  const staff = useAppSelector((state) => state.auth.staff)
  const [lineId, setLineId] = useState<string | null>(null)
  const [createExpense, { isLoading }] = useCreateExpenseMutation()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ExpenseFormInput, unknown, ExpenseFormOutput>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      expenseDate: new Date().toISOString().slice(0, 10),
    },
  })

  const onSubmit = async (values: ExpenseFormOutput) => {
    if (!staff?.isSuperAdmin && lineId === null) {
      toast.error('Selecciona una línea')
      return
    }
    try {
      await createExpense({ ...values, lineId }).unwrap()
      toast.success('Gasto registrado')
      onSuccess()
    } catch {
      toast.error('No se pudo registrar el gasto')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label>Línea</Label>
        <ExpenseLineSelect value={lineId} onChange={setLineId} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Input id="description" {...register('description')} />
        {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Monto</Label>
          <Input id="amount" type="number" step="0.01" {...register('amount')} />
          {errors.amount && <p className="text-sm text-destructive">{errors.amount.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="expenseDate">Fecha</Label>
          <Input id="expenseDate" type="date" {...register('expenseDate')} />
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Guardando...' : 'Registrar gasto'}
      </Button>
    </form>
  )
}
