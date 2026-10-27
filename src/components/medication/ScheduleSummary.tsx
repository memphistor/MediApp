import type { Schedule } from '@/types/medication'
import { pl } from '@/i18n/pl'

const DAY_LABELS = ['Nd', 'Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So']

export function ScheduleSummary({
  schedule,
  compact = false,
}: {
  schedule: Schedule
  compact?: boolean
}) {
  let text: string
  switch (schedule.type) {
    case 'daily':
      text = pl.wizard.schedules.daily
      break
    case 'weekdays':
      text = `${pl.wizard.schedules.weekdays}: ${schedule.days.map((d) => DAY_LABELS[d]).join(', ')}`
      break
    case 'everyNDays':
      text = `Co ${schedule.interval} dni`
      break
    case 'weekly':
      text = `${pl.wizard.schedules.weekly} (${DAY_LABELS[schedule.weekday]})`
      break
    case 'monthly':
      text = `${pl.wizard.schedules.monthly} (dzień ${schedule.dayOfMonth})`
      break
    case 'cycle':
      text = `Cykl ${schedule.activeDays}/${schedule.breakDays}`
      break
    case 'asNeeded':
      text = pl.wizard.schedules.asNeeded
      break
    default:
      text = pl.wizard.notSelected
  }

  return (
    <span
      className={
        compact
          ? 'text-xs text-[var(--color-text-muted)]'
          : 'text-sm text-[var(--color-text)]'
      }
    >
      {text}
    </span>
  )
}
