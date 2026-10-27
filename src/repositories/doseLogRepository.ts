import { db } from '@/db/database'
import { endOfLocalDay, startOfLocalDay, toDateKey } from '@/lib/dates'
import type { DoseLog, DoseStatus } from '@/types/dose'

export async function getDoseLogsForDay(day: Date): Promise<DoseLog[]> {
  const start = startOfLocalDay(day).toISOString()
  const end = endOfLocalDay(day).toISOString()
  return db.doseLogs
    .where('scheduledAt')
    .between(start, end, true, true)
    .toArray()
}

export async function getRecentDoseLogs(limit = 50): Promise<DoseLog[]> {
  return db.doseLogs.orderBy('scheduledAt').reverse().limit(limit).toArray()
}

export async function getDoseLogsBetween(
  start: Date,
  end: Date,
): Promise<DoseLog[]> {
  return db.doseLogs
    .where('scheduledAt')
    .between(start.toISOString(), end.toISOString(), true, true)
    .toArray()
}

export async function upsertPlanned(log: DoseLog): Promise<void> {
  const existing = await db.doseLogs.get(log.id)
  if (!existing) {
    await db.doseLogs.put(log)
    return
  }
  if (existing.status === 'planned') {
    await db.doseLogs.put({ ...existing, scheduledAt: log.scheduledAt })
  }
}

export async function updateDoseStatus(
  id: string,
  status: DoseStatus,
  extra?: { skipReason?: string; takenAt?: string },
): Promise<void> {
  const existing = await db.doseLogs.get(id)
  if (!existing) return
  await db.doseLogs.put({
    ...existing,
    status,
    skipReason: extra?.skipReason,
    takenAt: extra?.takenAt,
  })
}

export async function getDoseLogById(id: string): Promise<DoseLog | undefined> {
  return db.doseLogs.get(id)
}

export function dayBoundsFromDateKey(key: string): { start: Date; end: Date } {
  const [y, m, d] = key.split('-').map(Number)
  const start = new Date(y, m - 1, d)
  return { start: startOfLocalDay(start), end: endOfLocalDay(start) }
}

export async function getDoseLogsForMonth(year: number, month: number): Promise<DoseLog[]> {
  const start = new Date(year, month, 1)
  const end = endOfLocalDay(new Date(year, month + 1, 0))
  return getDoseLogsBetween(start, end)
}

export { toDateKey }
