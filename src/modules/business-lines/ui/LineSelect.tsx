import { useGetBusinessLinesQuery } from '../api/businessLinesApi'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'

interface LineSelectProps {
  value: string | undefined
  onChange: (lineId: string) => void
  disabled?: boolean
  allowedLineIds?: string[]
}

export function LineSelect({ value, onChange, disabled, allowedLineIds }: LineSelectProps) {
  const { data: lines, isLoading } = useGetBusinessLinesQuery()

  const visibleLines = allowedLineIds
    ? (lines ?? []).filter((line) => allowedLineIds.includes(line.id))
    : (lines ?? [])

  return (
    <Select value={value} onValueChange={onChange} disabled={disabled || isLoading}>
      <SelectTrigger>
        <SelectValue placeholder={isLoading ? 'Cargando líneas...' : 'Selecciona una línea'} />
      </SelectTrigger>
      <SelectContent>
        {visibleLines.map((line) => (
          <SelectItem key={line.id} value={line.id}>
            {line.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
