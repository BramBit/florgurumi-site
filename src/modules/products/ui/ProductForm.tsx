import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { useAppSelector } from '@/shared/lib/hooks'
import { LineSelect } from '@/modules/business-lines'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { Textarea } from '@/shared/ui/textarea'
import { useCreateProductMutation, useUpdateProductMutation } from '../api/productsApi'
import type { Product } from '../domain/types'

const productSchema = z.object({
  lineId: z.string().min(1, 'Selecciona una línea'),
  name: z.string().min(1, 'Requerido'),
  description: z.string().optional(),
  price: z.coerce.number().min(0, 'Debe ser mayor o igual a 0'),
  cost: z.coerce.number().min(0).optional(),
  stock: z.coerce.number().int().min(0, 'Debe ser mayor o igual a 0'),
})

type ProductFormInput = z.input<typeof productSchema>
type ProductFormOutput = z.output<typeof productSchema>

interface ProductFormProps {
  product?: Product
  onSuccess: () => void
}

export function ProductForm({ product, onSuccess }: ProductFormProps) {
  const staff = useAppSelector((state) => state.auth.staff)
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation()
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation()
  const isLoading = isCreating || isUpdating

  const allowedLineIds = staff?.isSuperAdmin ? undefined : staff?.lines.map((l) => l.lineId)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormInput, unknown, ProductFormOutput>({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? {
          lineId: product.lineId,
          name: product.name,
          description: product.description ?? '',
          price: product.price,
          cost: product.cost ?? undefined,
          stock: product.stock,
        }
      : undefined,
  })

  const lineId = watch('lineId')

  const onSubmit = async (values: ProductFormOutput) => {
    try {
      if (product) {
        await updateProduct({ id: product.id, ...values }).unwrap()
        toast.success('Producto actualizado')
      } else {
        await createProduct(values).unwrap()
        toast.success('Producto creado')
      }
      onSuccess()
    } catch {
      toast.error('No se pudo guardar el producto')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label>Línea de negocio</Label>
        <LineSelect
          value={lineId}
          onChange={(value) => setValue('lineId', value, { shouldValidate: true })}
          allowedLineIds={allowedLineIds}
        />
        {errors.lineId && <p className="text-sm text-destructive">{errors.lineId.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="name">Nombre</Label>
        <Input id="name" {...register('name')} />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea id="description" {...register('description')} />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Precio</Label>
          <Input id="price" type="number" step="0.01" {...register('price')} />
          {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="cost">Costo</Label>
          <Input id="cost" type="number" step="0.01" {...register('cost')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="stock">Stock</Label>
          <Input id="stock" type="number" {...register('stock')} />
          {errors.stock && <p className="text-sm text-destructive">{errors.stock.message}</p>}
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Guardando...' : product ? 'Guardar cambios' : 'Crear producto'}
      </Button>
    </form>
  )
}
