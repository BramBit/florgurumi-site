import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { StaffProfile } from '../domain/types'

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated'

interface AuthState {
  status: AuthStatus
  userId: string | null
  email: string | null
  staff: StaffProfile | null
  error: string | null
}

const initialState: AuthState = {
  status: 'idle',
  userId: null,
  email: null,
  staff: null,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthLoading: (state) => {
      state.status = 'loading'
      state.error = null
    },
    setAuthenticated: (state, action: PayloadAction<{ userId: string; email: string }>) => {
      state.status = 'authenticated'
      state.userId = action.payload.userId
      state.email = action.payload.email
      state.error = null
    },
    setStaffProfile: (state, action: PayloadAction<StaffProfile>) => {
      state.staff = action.payload
    },
    setUnauthenticated: (state) => {
      state.status = 'unauthenticated'
      state.userId = null
      state.email = null
      state.staff = null
      state.error = null
    },
    setAuthError: (state, action: PayloadAction<string>) => {
      state.status = 'unauthenticated'
      state.error = action.payload
    },
  },
})

export const { setAuthLoading, setAuthenticated, setStaffProfile, setUnauthenticated, setAuthError } = authSlice.actions
export default authSlice.reducer
