export interface StaffLineAssignment {
  lineId: string
  lineName: string
  role: 'line_admin' | 'line_employee'
}

export interface StaffProfile {
  id: string
  name: string
  isSuperAdmin: boolean
  active: boolean
  lines: StaffLineAssignment[]
}
