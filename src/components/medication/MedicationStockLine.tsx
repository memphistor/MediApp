import type { MedicationEntry } from '@/types/medication'
import {
  formatDailyDosesLeft,
  stockAlertLevel,
} from '@/lib/medication/stockAlert'
import { pl } from '@/i18n/pl'

type MedicationStockLineProps = {
  medication: MedicationEntry
  compact?: boolean
}

const toneClass: Record<'ok' | 'warn' | 'critical', string> = {
  ok: 'text-[var(--color-text-muted)]',
  warn: 'font-medium text-amber-800 dark:text-amber-200',
  critical: 'font-semibold text-red-700 dark:text-red-300',
}

export function MedicationStockLine({
  medication,
  compact = false,
}: MedicationStockLineProps) {
  if (medication.stockRemaining == null) return null
  const level = stockAlertLevel(medication) ?? 'ok'
  const daysLeft = formatDailyDosesLeft(medication)
  const text = pl.stock.remaining.replace(
    '{n}',
    String(medication.stockRemaining),
  )
  const suffix =
    level === 'critical'
      ? pl.stock.criticalDays.replace('{n}', String(daysLeft))
      : level === 'warn'
        ? pl.stock.warnDays.replace('{n}', String(daysLeft))
        : null

  return (
    <p className={`${compact ? 'text-xs' : 'text-sm'} ${toneClass[level]}`}>
      {text}
      {suffix ? ` · ${suffix}` : ''}
    </p>
  )
}

export function medicationStockBorderClass(
  medication: MedicationEntry,
): string | undefined {
  const level = stockAlertLevel(medication)
  if (level === 'critical') {
    return 'ring-2 ring-red-500/60 ring-offset-1'
  }
  if (level === 'warn') {
    return 'ring-2 ring-amber-400/70 ring-offset-1'
  }
  return undefined
}
