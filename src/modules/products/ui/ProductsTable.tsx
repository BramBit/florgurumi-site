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
import { useGetProductsQuery, useArchiveProductMutation } from '../api/productsApi'
import { isLowStock } from '../domain/rules'
import { ProductFormDialog } from './ProductFormDialog'

export function ProductsTable() {
  const { data: products, isLoading } = useGetProductsQuery()
  const [archiveProduct] = useArchiveProductMutation()

  const handleArchive = async (id: string) => {
    try {
      await archiveProduct(id).unwrap()
      toast.success('Producto archivado')
    } catch {
      toast.error('No se pudo archivar el producto')
    }
  }

  if (isLoading) return <p className="text-sm text-muted-foreground">Cargando productos...</p>

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Línea</TableHead>
          <TableHead>Precio</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {(products ?? []).map((product) => (
          <TableRow key={product.id}>
            <TableCell>{product.name}</TableCell>
            <TableCell>{product.lineName}</TableCell>
            <TableCell>${product.price.toFixed(2)}</TableCell>
            <TableCell className={isLowStock(product) ? 'text-destructive font-medium' : ''}>
              {product.stock}
            </TableCell>
            <TableCell className="flex justify-end gap-2">
              <ProductFormDialog
                product={product}
                trigger={
                  <Button variant="outline" size="sm">
                    Editar
                  </Button>
                }
              />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    Archivar
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Archivar este producto?</AlertDialogTitle>
                    <AlertDialogDescription>
                      El producto dejará de aparecer en el catálogo, pero su historial de ventas se conserva.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleArchive(product.id)}>Archivar</AlertDialogAction>
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
