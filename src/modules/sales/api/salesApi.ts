import { apiSlice } from '@/shared/api/apiSlice'
import { supabase } from '@/shared/lib/supabaseClient'
import type { Sale, SaleItemDetail } from '../domain/types'

interface CreateSaleItemInput {
  productId: string
  quantity: number
  unitPrice: number
}

interface CreateSaleArgs {
  customerId: string | null
  items: CreateSaleItemInput[]
}

interface SaleItemRow {
  product_id: string
  quantity: number
  unit_price: number
  total_price: number
  products: { name: string }[] | null
}

interface SaleRow {
  id: string
  customer_id: string | null
  total_amount: number
  created_at: string
  customers: { name: string }[] | null
  sale_items: SaleItemRow[]
}

export const salesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createSale: builder.mutation<string, CreateSaleArgs>({
      queryFn: async ({ customerId, items }) => {
        const { data: userData } = await supabase.auth.getUser()
        const soldBy = userData.user?.id ?? null

        const { data, error } = await supabase.rpc('create_sale_with_items', {
          p_customer_id: customerId,
          p_sold_by: soldBy,
          p_items: items.map((item) => ({
            product_id: item.productId,
            quantity: item.quantity,
            unit_price: item.unitPrice,
          })),
        })

        if (error) return { error: { status: 'CUSTOM_ERROR', error: error.message } }
        return { data: data as string }
      },
      invalidatesTags: ['Sale', 'Product'],
    }),
    getSales: builder.query<Sale[], void>({
      queryFn: async () => {
        const { data, error } = await supabase
          .from('sales')
          .select(
            'id, customer_id, total_amount, created_at, customers(name), sale_items(product_id, quantity, unit_price, total_price, products(name))'
          )
          .order('created_at', { ascending: false })

        if (error) return { error: { status: 'CUSTOM_ERROR', error: error.message } }

        const sales: Sale[] = ((data ?? []) as unknown as SaleRow[]).map((row) => ({
          id: row.id,
          customerId: row.customer_id,
          customerName: row.customers?.[0]?.name ?? null,
          totalAmount: row.total_amount,
          createdAt: row.created_at,
          items: (row.sale_items ?? []).map(
            (item): SaleItemDetail => ({
              productId: item.product_id,
              productName: item.products?.[0]?.name ?? '',
              quantity: item.quantity,
              unitPrice: item.unit_price,
              totalPrice: item.total_price,
            })
          ),
        }))

        return { data: sales }
      },
      providesTags: ['Sale'],
    }),
  }),
})

export const { useCreateSaleMutation, useGetSalesQuery } = salesApi
