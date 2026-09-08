export interface Customer {
  id: string
  name: string
  phone: string | null
  email: string | null
  birthday: string | null
  notes: string | null
}

export interface CustomerInput {
  name: string
  phone?: string
  email?: string
  birthday?: string
  notes?: string
}
