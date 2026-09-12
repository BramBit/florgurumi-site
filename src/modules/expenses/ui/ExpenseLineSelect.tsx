import { useAppSelector } from '@/shared/lib/hooks'
import { useGetBusinessLinesQuery } from '@/modules/business-lines'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'

interface ExpenseLineSelectProps {
  value: string | null
  onChange: (lineId: string | null) => void
}

const GENERAL_VALUE = '__general__'

export function ExpenseLineSelect({ value, onChange }: ExpenseLineSelectProps) {
  const staff = useAppSelector((state) => state.auth.staff)
  const { data: lines } = useGetBusinessLinesQuery()

  const allowedLineIds = staff?.isSuperAdmin ? undefined : staff?.lines.map((l) => l.lineId)
  const visibleLines = allowedLineIds ? (lines ?? []).filter((l) => allowedLineIds.includes(l.id)) : lines ?? []

  return (
    <Select value={value ?? GENERAL_VALUE} onValueChange={(v) => onChange(v === GENERAL_VALUE ? null : v)}>
      <SelectTrigger>
        <SelectValue placeholder="Selecciona una línea" />
      </SelectTrigger>
      <SelectContent>
        {staff?.isSuperAdmin && <SelectItem value={GENERAL_VALUE}>General (sin línea)</SelectItem>}
        {visibleLines.map((line) => (
          <SelectItem key={line.id} value={line.id}>
            {line.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
