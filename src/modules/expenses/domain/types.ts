export interface Expense {
  id: string
  lineId: string | null
  lineName: string | null
  description: string
  amount: number
  expenseDate: string
}

export interface ExpenseInput {
  lineId: string | null
  description: string
  amount: number
  expenseDate: string
}
