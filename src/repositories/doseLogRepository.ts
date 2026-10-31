import { db } from '@/db/database'
import { scheduleProfilBackup } from '@/services/profilBackup'
import { recalculateAndSave } from '@/repositories/gamificationRepository'
import {
  consumeStockForIntake,
  restoreStockForIntake,
} from '@/services/medicationStock'
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
  options?: { skipGamification?: boolean },
): Promise<void> {
  const existing = await db.doseLogs.get(id)
  if (!existing) return
  const takenAt =
    status === 'taken'
      ? extra?.takenAt ?? existing.takenAt ?? new Date().toISOString()
      : undefined
  await db.doseLogs.put({
    ...existing,
    status,
    skipReason: extra?.skipReason,
    takenAt,
  })
  if (existing.status !== 'taken' && status === 'taken') {
    await consumeStockForIntake(existing.medicationId)
  } else if (existing.status === 'taken' && status !== 'taken') {
    await restoreStockForIntake(existing.medicationId)
  }
  if (!options?.skipGamification) {
    await recalculateAndSave()
  }
  scheduleProfilBackup()
}

export async function updateDoseTakenAt(
  id: string,
  takenAt: string,
): Promise<boolean> {
  const existing = await db.doseLogs.get(id)
  if (!existing || existing.status !== 'taken') return false
  await db.doseLogs.put({ ...existing, takenAt })
  await recalculateAndSave()
  scheduleProfilBackup()
  return true
}

export async function logAsNeededIntake(medicationId: string): Promise<DoseLog> {
  const now = new Date().toISOString()
  const existing = await getTodayPrnLogForMedication(medicationId)
  if (existing) {
    await updateDoseStatus(existing.id, 'taken', { takenAt: now })
    const updated = await db.doseLogs.get(existing.id)
    return updated!
  }
  const log: DoseLog = {
    id: crypto.randomUUID(),
    medicationId,
    scheduledAt: now,
    status: 'taken',
    takenAt: now,
    source: 'prn',
  }
  await db.doseLogs.put(log)
  await consumeStockForIntake(medicationId)
  await recalculateAndSave()
  scheduleProfilBackup()
  return log
}

export async function logAsNeededSkip(medicationId: string): Promise<DoseLog> {
  const now = new Date().toISOString()
  const existing = await getTodayPrnLogForMedication(medicationId)
  if (existing) {
    await updateDoseStatus(existing.id, 'skipped')
    const updated = await db.doseLogs.get(existing.id)
    return updated!
  }
  const log: DoseLog = {
    id: crypto.randomUUID(),
    medicationId,
    scheduledAt: now,
    status: 'skipped',
    source: 'prn',
  }
  await db.doseLogs.put(log)
  await recalculateAndSave()
  scheduleProfilBackup()
  return log
}

export async function getTodayPrnLogForMedication(
  medicationId: string,
  day: Date = new Date(),
): Promise<DoseLog | undefined> {
  const start = startOfLocalDay(day).toISOString()
  const end = endOfLocalDay(day).toISOString()
  const rows = await db.doseLogs
    .where('medicationId')
    .equals(medicationId)
    .filter(
      (log) =>
        log.source === 'prn' &&
        log.scheduledAt >= start &&
        log.scheduledAt <= end,
    )
    .toArray()
  if (rows.length === 0) return undefined
  return rows.sort(
    (a, b) =>
      new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime(),
  )[0]
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
