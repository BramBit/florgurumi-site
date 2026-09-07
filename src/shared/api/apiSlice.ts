import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Product', 'Customer', 'Sale', 'Expense', 'BusinessLine', 'Staff', 'Session'],
  endpoints: () => ({}),
})