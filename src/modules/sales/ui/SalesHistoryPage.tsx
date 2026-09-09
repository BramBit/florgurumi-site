import { Link } from 'react-router-dom'
import { Button } from '@/shared/ui/button'
import { SalesHistoryTable } from './SalesHistoryTable'

export function SalesHistoryPage() {
  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Ventas</h1>
        <Button asChild>
          <Link to="/ventas/nueva">+ Nueva venta</Link>
        </Button>
      </div>
      <SalesHistoryTable />
    </div>
  )
}
