import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from '@/shared/api/apiSlice'
import uiReducer from '@/shared/state/uiSlice'
import authReducer from '@/modules/auth/state/authSlice'

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    auth: authReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch