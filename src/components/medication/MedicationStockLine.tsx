import type { MedicationEntry } from '@/types/medication'
import { pl } from '@/i18n/pl'

type MedicationStockLineProps = {
  medication: MedicationEntry
  compact?: boolean
}

export function MedicationStockLine({
  medication,
  compact = false,
}: MedicationStockLineProps) {
  if (medication.stockRemaining == null) return null
  const low = medication.stockRemaining <= 3
  const text = pl.stock.remaining.replace(
    '{n}',
    String(medication.stockRemaining),
  )
  return (
    <p
      className={`${compact ? 'text-xs' : 'text-sm'} ${
        low
          ? 'font-medium text-amber-800 dark:text-amber-200'
          : 'text-[var(--color-text-muted)]'
      }`}
    >
      {text}
      {low ? ` · ${pl.stock.low}` : ''}
    </p>
  )
}
