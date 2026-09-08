import { apiSlice } from '@/shared/api/apiSlice'
import { supabase } from '@/shared/lib/supabaseClient'
import type { BusinessLine } from '../domain/types'

interface BusinessLineRow {
  id: string
  name: string
  slug: string
  active: boolean
}

export const businessLinesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBusinessLines: builder.query<BusinessLine[], void>({
      queryFn: async () => {
        const { data, error } = await supabase
          .from('business_lines')
          .select('id, name, slug, active')
          .eq('active', true)
          .order('name')

        if (error) return { error: { status: 'CUSTOM_ERROR', error: error.message } }

        const lines: BusinessLine[] = ((data ?? []) as BusinessLineRow[]).map((row) => ({
          id: row.id,
          name: row.name,
          slug: row.slug,
          active: row.active,
        }))

        return { data: lines }
      },
      providesTags: ['BusinessLine'],
    }),
  }),
})

export const { useGetBusinessLinesQuery } = businessLinesApi
