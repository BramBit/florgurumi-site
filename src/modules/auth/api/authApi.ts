import { apiSlice } from '@/shared/api/apiSlice'
import { supabase } from '@/shared/lib/supabaseClient'
import type { StaffProfile, StaffLineAssignment } from '../domain/types'

interface LoginArgs {
  email: string
  password: string
}

interface LoginResult {
  userId: string
  email: string
}

interface StaffLineRow {
  line_id: string
  role: 'line_admin' | 'line_employee'
  business_lines: { name: string }[] | null
}

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResult, LoginArgs>({
      queryFn: async ({ email, password }) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) return { error: { status: 'CUSTOM_ERROR', error: error.message } }
        if (!data.user) return { error: { status: 'CUSTOM_ERROR', error: 'No se pudo iniciar sesión' } }
        return { data: { userId: data.user.id, email: data.user.email ?? '' } }
      },
    }),
    logout: builder.mutation<void, void>({
      queryFn: async () => {
        const { error } = await supabase.auth.signOut()
        if (error) return { error: { status: 'CUSTOM_ERROR', error: error.message } }
        return { data: undefined }
      },
    }),
    getStaffProfile: builder.query<StaffProfile, string>({
      queryFn: async (userId) => {
        const { data: staffRow, error: staffError } = await supabase
          .from('staff')
          .select('id, name, is_super_admin, active')
          .eq('id', userId)
          .single()

        if (staffError) return { error: { status: 'CUSTOM_ERROR', error: staffError.message } }
        if (!staffRow) return { error: { status: 'CUSTOM_ERROR', error: 'Perfil de staff no encontrado' } }

        const { data: linesRows, error: linesError } = await supabase
          .from('staff_lines')
          .select('line_id, role, business_lines(name)')
          .eq('staff_id', userId)

        if (linesError) return { error: { status: 'CUSTOM_ERROR', error: linesError.message } }

        const lines: StaffLineAssignment[] = ((linesRows ?? []) as unknown as StaffLineRow[]).map((row) => ({
          lineId: row.line_id,
          lineName: row.business_lines?.[0]?.name ?? '',
          role: row.role,
        }))

        const profile: StaffProfile = {
          id: staffRow.id,
          name: staffRow.name,
          isSuperAdmin: staffRow.is_super_admin,
          active: staffRow.active,
          lines,
        }

        return { data: profile }
      },
      providesTags: ['Session'],
    }),
  }),
})

export const { useLoginMutation, useLogoutMutation, useLazyGetStaffProfileQuery, useGetStaffProfileQuery } = authApi
