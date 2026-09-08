import { apiSlice } from '@/shared/api/apiSlice'
import { supabase } from '@/shared/lib/supabaseClient'
import type { Customer, CustomerInput } from '../domain/types'

interface CustomerRow {
  id: string
  name: string
  phone: string | null
  email: string | null
  birthday: string | null
  notes: string | null
}

function mapCustomerRow(row: CustomerRow): Customer {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    email: row.email,
    birthday: row.birthday,
    notes: row.notes,
  }
}

function toPayload(input: CustomerInput) {
  return {
    name: input.name,
    phone: input.phone || null,
    email: input.email || null,
    birthday: input.birthday || null,
    notes: input.notes || null,
  }
}

export const customersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCustomers: builder.query<Customer[], void>({
      queryFn: async () => {
        const { data, error } = await supabase
          .from('customers')
          .select('id, name, phone, email, birthday, notes')
          .order('name')

        if (error) return { error: { status: 'CUSTOM_ERROR', error: error.message } }
        return { data: ((data ?? []) as CustomerRow[]).map(mapCustomerRow) }
      },
      providesTags: ['Customer'],
    }),
    createCustomer: builder.mutation<Customer, CustomerInput>({
      queryFn: async (input) => {
        const { data, error } = await supabase
          .from('customers')
          .insert(toPayload(input))
          .select('id, name, phone, email, birthday, notes')
          .single()

        if (error) return { error: { status: 'CUSTOM_ERROR', error: error.message } }
        return { data: mapCustomerRow(data as CustomerRow) }
      },
      invalidatesTags: ['Customer'],
    }),
    updateCustomer: builder.mutation<Customer, { id: string } & CustomerInput>({
      queryFn: async ({ id, ...input }) => {
        const { data, error } = await supabase
          .from('customers')
          .update(toPayload(input))
          .eq('id', id)
          .select('id, name, phone, email, birthday, notes')
          .single()

        if (error) return { error: { status: 'CUSTOM_ERROR', error: error.message } }
        return { data: mapCustomerRow(data as CustomerRow) }
      },
      invalidatesTags: ['Customer'],
    }),
    deleteCustomer: builder.mutation<void, string>({
      queryFn: async (id) => {
        const { error } = await supabase.from('customers').delete().eq('id', id)

        if (error) {
          if (error.code === '23503') {
            return {
              error: {
                status: 'CUSTOM_ERROR',
                error: 'No se puede eliminar: este cliente tiene ventas registradas.',
              },
            }
          }
          return { error: { status: 'CUSTOM_ERROR', error: error.message } }
        }
        return { data: undefined }
      },
      invalidatesTags: ['Customer'],
    }),
  }),
})

export const {
  useGetCustomersQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} = customersApi
