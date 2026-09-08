import { toast } from 'sonner'
import { format } from 'date-fns'
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
import { useGetCustomersQuery, useDeleteCustomerMutation } from '../api/customersApi'
import { CustomerFormDialog } from './CustomerFormDialog'

export function CustomersTable() {
  const { data: customers, isLoading } = useGetCustomersQuery()
  const [deleteCustomer] = useDeleteCustomerMutation()

  const handleDelete = async (id: string) => {
    try {
      await deleteCustomer(id).unwrap()
      toast.success('Cliente eliminado')
    } catch (err) {
      const message =
        typeof err === 'object' && err !== null && 'error' in err
          ? String((err as { error: unknown }).error)
          : 'No se pudo eliminar el cliente'
      toast.error(message)
    }
  }

  if (isLoading) return <p className="text-sm text-muted-foreground">Cargando clientes...</p>

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Teléfono</TableHead>
          <TableHead>Correo</TableHead>
          <TableHead>Cumpleaños</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {(customers ?? []).map((customer) => (
          <TableRow key={customer.id}>
            <TableCell>{customer.name}</TableCell>
            <TableCell>{customer.phone ?? '—'}</TableCell>
            <TableCell>{customer.email ?? '—'}</TableCell>
            <TableCell>{customer.birthday ? format(new Date(customer.birthday), 'dd/MM/yyyy') : '—'}</TableCell>
            <TableCell className="flex justify-end gap-2">
              <CustomerFormDialog
                customer={customer}
                trigger={
                  <Button variant="outline" size="sm">
                    Editar
                  </Button>
                }
              />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    Eliminar
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Eliminar este cliente?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción no se puede deshacer. Si el cliente tiene ventas registradas, no se podrá
                      eliminar.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(customer.id)}>Eliminar</AlertDialogAction>
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
