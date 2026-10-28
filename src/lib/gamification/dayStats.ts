import { toDateKey } from '@/lib/dates'
import type { DoseLog } from '@/types/dose'

export function isScheduledDose(log: DoseLog): boolean {
  return log.source !== 'prn'
}

export function scheduledDoses(logs: DoseLog[]): DoseLog[] {
  return logs.filter(isScheduledDose)
}

export function groupLogsByDateKey(logs: DoseLog[]): Map<string, DoseLog[]> {
  const map = new Map<string, DoseLog[]>()
  for (const log of logs) {
    const key = toDateKey(new Date(log.scheduledAt))
    const list = map.get(key) ?? []
    list.push(log)
    map.set(key, list)
  }
  return map
}

export function getLogsForDateKey(
  logs: DoseLog[],
  dateKey: string,
): DoseLog[] {
  return logs.filter(
    (l) => toDateKey(new Date(l.scheduledAt)) === dateKey,
  )
}

export function isFullDay(dayLogs: DoseLog[]): boolean {
  if (dayLogs.length === 0) return false
  return dayLogs.every((l) => l.status === 'taken')
}

export function isDayNeutral(dayLogs: DoseLog[]): boolean {
  return dayLogs.length === 0
}

export function isDayResolved(dayLogs: DoseLog[]): boolean {
  if (dayLogs.length === 0) return false
  return dayLogs.every((l) => l.status !== 'planned')
}

export function dayRingProgress(dayLogs: DoseLog[]): {
  progress: number
  taken: number
  total: number
} {
  const total = dayLogs.length
  if (total === 0) {
    return { progress: 0, taken: 0, total: 0 }
  }
  const taken = dayLogs.filter((l) => l.status === 'taken').length
  return { progress: taken / total, taken, total }
}
