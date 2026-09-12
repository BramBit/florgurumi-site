import { apiSlice } from '@/shared/api/apiSlice'
import { supabase } from '@/shared/lib/supabaseClient'
import type { Expense, ExpenseInput } from '../domain/types'

interface ExpenseRow {
  id: string
  line_id: string | null
  description: string
  amount: number
  expense_date: string
  business_lines: { name: string }[] | null
}

function mapExpenseRow(row: ExpenseRow): Expense {
  return {
    id: row.id,
    lineId: row.line_id,
    lineName: row.business_lines?.[0]?.name ?? null,
    description: row.description,
    amount: row.amount,
    expenseDate: row.expense_date,
  }
}

export const expensesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getExpenses: builder.query<Expense[], void>({
      queryFn: async () => {
        const { data, error } = await supabase
          .from('expenses')
          .select('id, line_id, description, amount, expense_date, business_lines(name)')
          .order('expense_date', { ascending: false })

        if (error) return { error: { status: 'CUSTOM_ERROR', error: error.message } }
        return { data: ((data ?? []) as unknown as ExpenseRow[]).map(mapExpenseRow) }
      },
      providesTags: ['Expense'],
    }),
    createExpense: builder.mutation<Expense, ExpenseInput>({
      queryFn: async (input) => {
        const { data: userData } = await supabase.auth.getUser()
        const { data, error } = await supabase
          .from('expenses')
          .insert({
            line_id: input.lineId,
            description: input.description,
            amount: input.amount,
            expense_date: input.expenseDate,
            created_by: userData.user?.id ?? null,
          })
          .select('id, line_id, description, amount, expense_date, business_lines(name)')
          .single()

        if (error) return { error: { status: 'CUSTOM_ERROR', error: error.message } }
        return { data: mapExpenseRow(data as unknown as ExpenseRow) }
      },
      invalidatesTags: ['Expense'],
    }),
    deleteExpense: builder.mutation<void, string>({
      queryFn: async (id) => {
        const { error } = await supabase.from('expenses').delete().eq('id', id)
        if (error) return { error: { status: 'CUSTOM_ERROR', error: error.message } }
        return { data: undefined }
      },
      invalidatesTags: ['Expense'],
    }),
  }),
})

export const { useGetExpensesQuery, useCreateExpenseMutation, useDeleteExpenseMutation } = expensesApi
