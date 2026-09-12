import { Button } from '@/shared/ui/button'
import { ExpenseFormDialog } from './ExpenseFormDialog'
import { ExpensesTable } from './ExpensesTable'

export function ExpensesPage() {
  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Gastos</h1>
        <ExpenseFormDialog trigger={<Button>+ Nuevo gasto</Button>} />
      </div>
      <ExpensesTable />
    </div>
  )
}
