import { format } from 'date-fns'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table'
import { useGetSalesQuery } from '../api/salesApi'

export function SalesHistoryTable() {
  const { data: sales, isLoading } = useGetSalesQuery()

  if (isLoading) return <p className="text-sm text-muted-foreground">Cargando ventas...</p>

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Fecha</TableHead>
          <TableHead>Cliente</TableHead>
          <TableHead>Productos</TableHead>
          <TableHead className="text-right">Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {(sales ?? []).map((sale) => (
          <TableRow key={sale.id}>
            <TableCell>{format(new Date(sale.createdAt), 'dd/MM/yyyy HH:mm')}</TableCell>
            <TableCell>{sale.customerName ?? 'Cliente ocasional'}</TableCell>
            <TableCell>{sale.items.map((i) => `${i.quantity}x ${i.productName}`).join(', ')}</TableCell>
            <TableCell className="text-right">${sale.totalAmount.toFixed(2)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
