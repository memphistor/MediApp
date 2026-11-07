import { addDays, endOfLocalDay, startOfLocalDay } from '@/lib/dates'

export type ProgressPeriod = 'day' | 'month' | 'days100' | 'year'

export function periodBounds(
  period: ProgressPeriod,
  referenceDate = new Date(),
): { from: Date; to: Date } {
  const to = endOfLocalDay(referenceDate)
  switch (period) {
    case 'day':
      return { from: startOfLocalDay(referenceDate), to }
    case 'month':
      return {
        from: startOfLocalDay(
          new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1),
        ),
        to,
      }
    case 'days100':
      return { from: startOfLocalDay(addDays(referenceDate, -99)), to }
    case 'year':
      return { from: startOfLocalDay(addDays(referenceDate, -364)), to }
  }
}

export const PROGRESS_PERIODS: ProgressPeriod[] = [
  'day',
  'month',
  'days100',
  'year',
]
