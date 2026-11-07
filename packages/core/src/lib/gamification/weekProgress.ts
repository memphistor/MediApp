import { addDays, endOfLocalDay, startOfWeekMonday } from '@/lib/dates'
import {
  logsInLocalDateRange,
  takenAdherenceRate,
  timingCountsForLogs,
} from '@/lib/gamification/doseTiming'
import type { DoseLog } from '@/types/dose'

export function calendarWeekBounds(reference = new Date()): {
  from: Date
  to: Date
} {
  const from = startOfWeekMonday(reference)
  const to = endOfLocalDay(addDays(from, 6))
  return { from, to }
}

export function weekPlanProgress(
  logs: DoseLog[],
  reference = new Date(),
): {
  taken: number
  total: number
  progress: number
  adherencePct: number
} {
  const { from, to: weekEnd } = calendarWeekBounds(reference)
  const todayEnd = endOfLocalDay(reference)
  const to = todayEnd.getTime() < weekEnd.getTime() ? todayEnd : weekEnd
  const counts = timingCountsForLogs(logsInLocalDateRange(logs, from, to))
  const taken =
    counts.onTime + counts.early + counts.late + counts.unknown
  const total = counts.totalScheduled
  return {
    taken,
    total,
    progress: total > 0 ? taken / total : 0,
    adherencePct: Math.round(takenAdherenceRate(counts) * 100),
  }
}
