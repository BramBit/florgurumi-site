import { format } from 'date-fns'
import { toast } from 'sonner'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table'
import { Button } from '@/shared/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/shared/ui/alert-dialog'
import { useGetExpensesQuery, useDeleteExpenseMutation } from '../api/expensesApi'

export function ExpensesTable() {
  const { data: expenses, isLoading } = useGetExpensesQuery()
  const [deleteExpense] = useDeleteExpenseMutation()

  const handleDelete = async (id: string) => {
    try {
      await deleteExpense(id).unwrap()
      toast.success('Gasto eliminado')
    } catch {
      toast.error('No se pudo eliminar el gasto')
    }
  }

  if (isLoading) return <p className="text-sm text-muted-foreground">Cargando gastos...</p>

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Fecha</TableHead>
          <TableHead>Línea</TableHead>
          <TableHead>Descripción</TableHead>
          <TableHead>Monto</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {(expenses ?? []).map((expense) => (
          <TableRow key={expense.id}>
            <TableCell>{format(new Date(expense.expenseDate), 'dd/MM/yyyy')}</TableCell>
            <TableCell>{expense.lineName ?? 'General'}</TableCell>
            <TableCell>{expense.description}</TableCell>
            <TableCell>${expense.amount.toFixed(2)}</TableCell>
            <TableCell className="text-right">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    Eliminar
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Eliminar este gasto?</AlertDialogTitle>
                    <AlertDialogDescription>Esta acción no se puede deshacer.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(expense.id)}>Eliminar</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
