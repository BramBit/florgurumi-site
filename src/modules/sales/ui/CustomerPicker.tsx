import { useGetCustomersQuery } from '@/modules/customers'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'

interface CustomerPickerProps {
  value: string | null
  onChange: (customerId: string | null) => void
}

const WALK_IN_VALUE = '__walk_in__'

export function CustomerPicker({ value, onChange }: CustomerPickerProps) {
  const { data: customers } = useGetCustomersQuery()

  return (
    <Select value={value ?? WALK_IN_VALUE} onValueChange={(v) => onChange(v === WALK_IN_VALUE ? null : v)}>
      <SelectTrigger>
        <SelectValue placeholder="Cliente ocasional" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={WALK_IN_VALUE}>Cliente ocasional</SelectItem>
        {(customers ?? []).map((customer) => (
          <SelectItem key={customer.id} value={customer.id}>
            {customer.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
