import { endOfLocalDay, startOfLocalDay, toDateKey } from '@/lib/dates'
import { scheduledDoses } from '@/lib/gamification/dayStats'
import type { DoseLog } from '@/types/dose'

/** Minutes before scheduled time still counted as on time. */
export const TIMING_EARLY_TOLERANCE_MINUTES = 30

/** Minutes after scheduled time still counted as on time. */
export const TIMING_LATE_TOLERANCE_MINUTES = 90

export type DoseTimingClass =
  | 'on_time'
  | 'early'
  | 'late'
  | 'unknown'
  | 'missed'
  | 'planned'

export function classifyDoseTiming(log: DoseLog): DoseTimingClass {
  if (log.source === 'prn') return 'on_time'
  if (log.status === 'planned') return 'planned'
  if (log.status === 'missed' || log.status === 'skipped') return 'missed'
  if (log.status !== 'taken') return 'missed'
  if (!log.takenAt) return 'unknown'

  const scheduledMs = new Date(log.scheduledAt).getTime()
  const takenMs = new Date(log.takenAt).getTime()
  const diffMinutes = (takenMs - scheduledMs) / 60_000

  if (diffMinutes < -TIMING_EARLY_TOLERANCE_MINUTES) return 'early'
  if (diffMinutes > TIMING_LATE_TOLERANCE_MINUTES) return 'late'
  return 'on_time'
}

export interface DoseTimingCounts {
  onTime: number
  early: number
  late: number
  unknown: number
  missed: number
  planned: number
  totalScheduled: number
}

export function emptyTimingCounts(): DoseTimingCounts {
  return {
    onTime: 0,
    early: 0,
    late: 0,
    unknown: 0,
    missed: 0,
    planned: 0,
    totalScheduled: 0,
  }
}

export function accumulateTimingCounts(
  counts: DoseTimingCounts,
  log: DoseLog,
): DoseTimingCounts {
  if (log.source === 'prn') return counts
  const next = { ...counts, totalScheduled: counts.totalScheduled + 1 }
  const kind = classifyDoseTiming(log)
  switch (kind) {
    case 'on_time':
      next.onTime += 1
      break
    case 'early':
      next.early += 1
      break
    case 'late':
      next.late += 1
      break
    case 'unknown':
      next.unknown += 1
      break
    case 'planned':
      next.planned += 1
      break
    case 'missed':
      next.missed += 1
      break
  }
  return next
}

export function timingCountsForLogs(logs: DoseLog[]): DoseTimingCounts {
  return scheduledDoses(logs).reduce(accumulateTimingCounts, emptyTimingCounts())
}

export function logsInLocalDateRange(
  logs: DoseLog[],
  from: Date,
  to: Date,
): DoseLog[] {
  const start = startOfLocalDay(from).getTime()
  const end = endOfLocalDay(to).getTime()
  return logs.filter((log) => {
    const t = new Date(log.scheduledAt).getTime()
    return t >= start && t <= end
  })
}

export function timingCountsForRange(
  logs: DoseLog[],
  from: Date,
  to: Date,
): DoseTimingCounts {
  return timingCountsForLogs(logsInLocalDateRange(logs, from, to))
}

/** Share of taken doses (incl. unknown) that were on time. */
export function onTimeRateAmongTaken(counts: DoseTimingCounts): number {
  const taken =
    counts.onTime + counts.early + counts.late + counts.unknown
  if (taken === 0) return 0
  return counts.onTime / taken
}

/** Share of scheduled doses marked taken (same basis as the day ring). */
export function takenAdherenceRate(counts: DoseTimingCounts): number {
  if (counts.totalScheduled === 0) return 0
  const taken =
    counts.onTime + counts.early + counts.late + counts.unknown
  return taken / counts.totalScheduled
}

export function isDayFullyOnTime(dayLogs: DoseLog[]): boolean {
  const counts = timingCountsForLogs(dayLogs)
  if (counts.missed > 0) return false
  if (counts.early + counts.late + counts.unknown > 0) return false
  const taken = counts.onTime + counts.early + counts.late + counts.unknown
  if (taken === 0) return false
  return counts.onTime === taken
}

export function formatTimingDeltaMinutes(log: DoseLog): string | null {
  if (log.status !== 'taken' || !log.takenAt) return null
  const diffMinutes = Math.round(
    (new Date(log.takenAt).getTime() - new Date(log.scheduledAt).getTime()) /
      60_000,
  )
  if (diffMinutes === 0) return '0 min'
  if (diffMinutes > 0) return `+${diffMinutes} min`
  return `${diffMinutes} min`
}

export function timingLabelForLog(
  log: DoseLog,
  labels: {
    onTime: string
    early: string
    late: string
    unknown: string
    missed: string
    planned: string
  },
): string {
  const kind = classifyDoseTiming(log)
  switch (kind) {
    case 'on_time':
      return labels.onTime
    case 'early':
      return labels.early
    case 'late':
      return labels.late
    case 'unknown':
      return labels.unknown
    case 'planned':
      return labels.planned
    case 'missed':
      return labels.missed
  }
}

export interface DayTimingRow {
  dateKey: string
  counts: DoseTimingCounts
}

export function lastDayTimingRows(
  logs: DoseLog[],
  referenceDate: Date,
  dayCount: number,
): DayTimingRow[] {
  const rows: DayTimingRow[] = []
  for (let i = dayCount - 1; i >= 0; i--) {
    const day = new Date(referenceDate)
    day.setDate(day.getDate() - i)
    const key = toDateKey(day)
    const dayLogs = logs.filter(
      (l) => toDateKey(new Date(l.scheduledAt)) === key,
    )
    rows.push({ dateKey: key, counts: timingCountsForLogs(dayLogs) })
  }
  return rows
}
