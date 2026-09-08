import { apiSlice } from '@/shared/api/apiSlice'
import { supabase } from '@/shared/lib/supabaseClient'
import type { Product, ProductWithLine, ProductInput } from '../domain/types'

interface ProductRow {
  id: string
  line_id: string
  name: string
  description: string | null
  price: number
  cost: number | null
  stock: number
  active: boolean
}

interface ProductWithLineRow extends ProductRow {
  business_lines: { name: string }[] | null
}

function mapProductRow(row: ProductRow): Product {
  return {
    id: row.id,
    lineId: row.line_id,
    name: row.name,
    description: row.description,
    price: row.price,
    cost: row.cost,
    stock: row.stock,
    active: row.active,
  }
}

export const productsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<ProductWithLine[], void>({
      queryFn: async () => {
        const { data, error } = await supabase
          .from('products')
          .select('id, line_id, name, description, price, cost, stock, active, business_lines(name)')
          .eq('active', true)
          .order('name')

        if (error) return { error: { status: 'CUSTOM_ERROR', error: error.message } }

        const products: ProductWithLine[] = ((data ?? []) as unknown as ProductWithLineRow[]).map((row) => ({
          ...mapProductRow(row),
          lineName: row.business_lines?.[0]?.name ?? '',
        }))

        return { data: products }
      },
      providesTags: ['Product'],
    }),
    createProduct: builder.mutation<Product, ProductInput>({
      queryFn: async (input) => {
        const { data, error } = await supabase
          .from('products')
          .insert({
            line_id: input.lineId,
            name: input.name,
            description: input.description ?? null,
            price: input.price,
            cost: input.cost ?? null,
            stock: input.stock,
          })
          .select('id, line_id, name, description, price, cost, stock, active')
          .single()

        if (error) return { error: { status: 'CUSTOM_ERROR', error: error.message } }
        return { data: mapProductRow(data as ProductRow) }
      },
      invalidatesTags: ['Product'],
    }),
    updateProduct: builder.mutation<Product, { id: string } & ProductInput>({
      queryFn: async ({ id, ...input }) => {
        const { data, error } = await supabase
          .from('products')
          .update({
            line_id: input.lineId,
            name: input.name,
            description: input.description ?? null,
            price: input.price,
            cost: input.cost ?? null,
            stock: input.stock,
          })
          .eq('id', id)
          .select('id, line_id, name, description, price, cost, stock, active')
          .single()

        if (error) return { error: { status: 'CUSTOM_ERROR', error: error.message } }
        return { data: mapProductRow(data as ProductRow) }
      },
      invalidatesTags: ['Product'],
    }),
    archiveProduct: builder.mutation<void, string>({
      queryFn: async (id) => {
        const { error } = await supabase.from('products').update({ active: false }).eq('id', id)
        if (error) return { error: { status: 'CUSTOM_ERROR', error: error.message } }
        return { data: undefined }
      },
      invalidatesTags: ['Product'],
    }),
  }),
})

export const {
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useArchiveProductMutation,
} = productsApi
