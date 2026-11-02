import type { Schedule } from '@mediapp/core'

const DAY_LABELS = ['Nd', 'Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So']

/** Pure helper for tests and ScheduleSummary UI. */
export function scheduleSummaryText(
  schedule: Schedule,
  pl: {
    wizard: {
      schedules: Record<string, string>
      notSelected: string
    }
  },
): string {
  switch (schedule.type) {
    case 'daily':
      return pl.wizard.schedules.daily
    case 'weekdays':
      return `${pl.wizard.schedules.weekdays}: ${schedule.days.map((d) => DAY_LABELS[d]).join(', ')}`
    case 'everyNDays':
      return `Co ${schedule.interval} dni`
    case 'weekly':
      return `${pl.wizard.schedules.weekly} (${DAY_LABELS[schedule.weekday]})`
    case 'monthly':
      return `${pl.wizard.schedules.monthly} (dzień ${schedule.dayOfMonth})`
    case 'cycle':
      return `Cykl ${schedule.activeDays}/${schedule.breakDays}`
    case 'asNeeded':
      return pl.wizard.schedules.asNeeded
    default:
      return pl.wizard.notSelected
  }
}
