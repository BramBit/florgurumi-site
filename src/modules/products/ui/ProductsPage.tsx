import { Button } from '@/shared/ui/button'
import { ProductFormDialog } from './ProductFormDialog'
import { ProductsTable } from './ProductsTable'

export function ProductsPage() {
  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Productos</h1>
        <ProductFormDialog trigger={<Button>+ Nuevo producto</Button>} />
      </div>
      <ProductsTable />
    </div>
  )
}
