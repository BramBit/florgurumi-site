import { Button } from '@/shared/ui/button'
import { CustomerFormDialog } from './CustomerFormDialog'
import { CustomersTable } from './CustomersTable'

export function CustomersPage() {
  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Clientes</h1>
        <CustomerFormDialog trigger={<Button>+ Nuevo cliente</Button>} />
      </div>
      <CustomersTable />
    </div>
  )
}
