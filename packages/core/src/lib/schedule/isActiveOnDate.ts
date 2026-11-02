import { daysBetweenCalendar, parseDateKey, startOfLocalDay } from '@/lib/dates'
import type { DateRange, MedicationEntry, Schedule } from '@/types/medication'

export interface ScheduleContext {
  schedule: Schedule
  dateRange?: DateRange
  anchorDate: string
}

function isWithinDateRange(day: Date, range?: DateRange): boolean {
  if (!range?.start) return true
  const start = startOfLocalDay(parseDateKey(range.start))
  if (day < start) return false
  if (range.end) {
    const end = startOfLocalDay(parseDateKey(range.end))
    if (day > end) return false
  }
  return true
}

function isScheduleActiveOnDay(day: Date, schedule: Schedule, anchor: Date): boolean {
  switch (schedule.type) {
    case 'asNeeded':
      return false
    case 'daily':
      return true
    case 'weekdays':
      return schedule.days.includes(day.getDay())
    case 'everyNDays': {
      const diff = daysBetweenCalendar(anchor, day)
      return diff >= 0 && diff % schedule.interval === 0
    }
    case 'weekly':
      return day.getDay() === schedule.weekday
    case 'monthly':
      return day.getDate() === schedule.dayOfMonth
    case 'cycle': {
      const diff = daysBetweenCalendar(anchor, day)
      if (diff < 0) return false
      const cycleLen = schedule.activeDays + schedule.breakDays
      const pos = diff % cycleLen
      return pos < schedule.activeDays
    }
    default:
      return false
  }
}

export function getScheduleAnchor(entry: Pick<MedicationEntry, 'dateRange' | 'createdAt'>): Date {
  const key = entry.dateRange?.start ?? entry.createdAt.slice(0, 10)
  return startOfLocalDay(parseDateKey(key))
}

export function isActiveOnDate(
  day: Date,
  ctx: ScheduleContext,
): boolean {
  const localDay = startOfLocalDay(day)
  if (!isWithinDateRange(localDay, ctx.dateRange)) return false
  const anchor = startOfLocalDay(parseDateKey(ctx.anchorDate))
  return isScheduleActiveOnDay(localDay, ctx.schedule, anchor)
}

export function isEntryInDateRange(day: Date, entry: MedicationEntry): boolean {
  return isWithinDateRange(startOfLocalDay(day), entry.dateRange)
}

export function isMedicationActiveOnDate(
  day: Date,
  entry: MedicationEntry,
): boolean {
  return isActiveOnDate(day, {
    schedule: entry.schedule,
    dateRange: entry.dateRange,
    anchorDate: entry.dateRange?.start ?? entry.createdAt.slice(0, 10),
  })
}
