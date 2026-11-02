import { createId, endOfLocalDay, startOfLocalDay } from '@mediapp/core'
import type { DoseLog, DoseStatus } from '@mediapp/core'

import { getDb } from '../database'
import {
  doseLogToRow,
  rowToDoseLog,
  type DoseLogRow,
} from '../mappers/doseLogMapper'
import { recalculateAndSave } from './gamificationRepository'
import { cancelGroupNotification } from '@/src/notifications/cancelNotifications'
import {
  consumeStockForIntake,
  restoreStockForIntake,
} from '../services/medicationStock'
import { scheduleProfilBackup } from '../services/profilBackup'

const INSERT_DOSE = `
INSERT OR REPLACE INTO dose_logs (
  id, medication_id, scheduled_at, status, skip_reason, taken_at, last_notified_at, source
) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`

export async function getDoseLogsForDay(day: Date): Promise<DoseLog[]> {
  const start = startOfLocalDay(day).toISOString()
  const end = endOfLocalDay(day).toISOString()
  const rows = await getDb().getAllAsync<DoseLogRow>(
    'SELECT * FROM dose_logs WHERE scheduled_at >= ? AND scheduled_at <= ? ORDER BY scheduled_at',
    [start, end],
  )
  return rows.map(rowToDoseLog)
}

export async function getAllDoseLogs(): Promise<DoseLog[]> {
  const rows = await getDb().getAllAsync<DoseLogRow>(
    'SELECT * FROM dose_logs ORDER BY scheduled_at',
  )
  return rows.map(rowToDoseLog)
}

export async function getDoseLogsForMedication(
  medicationId: string,
): Promise<DoseLog[]> {
  const rows = await getDb().getAllAsync<DoseLogRow>(
    'SELECT * FROM dose_logs WHERE medication_id = ?',
    [medicationId],
  )
  return rows.map(rowToDoseLog)
}

export async function getDoseLogById(id: string): Promise<DoseLog | undefined> {
  const row = await getDb().getFirstAsync<DoseLogRow>(
    'SELECT * FROM dose_logs WHERE id = ?',
    [id],
  )
  return row ? rowToDoseLog(row) : undefined
}

export async function upsertPlanned(log: DoseLog): Promise<void> {
  const existing = await getDoseLogById(log.id)
  if (!existing) {
    await insertDoseLog(log)
    return
  }
  if (existing.status === 'planned') {
    await insertDoseLog({ ...existing, scheduledAt: log.scheduledAt })
  }
}

async function insertDoseLog(log: DoseLog): Promise<void> {
  const row = doseLogToRow(log)
  await getDb().runAsync(INSERT_DOSE, [
    row.id,
    row.medication_id,
    row.scheduled_at,
    row.status,
    row.skip_reason,
    row.taken_at,
    row.last_notified_at,
    row.source,
  ])
}

export async function deleteDoseLog(id: string): Promise<void> {
  await getDb().runAsync('DELETE FROM dose_logs WHERE id = ?', [id])
}

export async function updateDoseStatus(
  id: string,
  status: DoseStatus,
  extra?: { skipReason?: string; takenAt?: string },
  options?: { skipGamification?: boolean },
): Promise<void> {
  const existing = await getDoseLogById(id)
  if (!existing) return

  const takenAt =
    status === 'taken'
      ? (extra?.takenAt ?? existing.takenAt ?? new Date().toISOString())
      : undefined

  await insertDoseLog({
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
  if (existing.status === 'planned' && status !== 'planned') {
    await cancelGroupNotification(existing.scheduledAt)
  }
  scheduleProfilBackup()
}

export async function markLogsNotified(logIds: string[]): Promise<void> {
  const now = new Date().toISOString()
  for (const id of logIds) {
    const log = await getDoseLogById(id)
    if (log && log.status === 'planned') {
      await insertDoseLog({ ...log, lastNotifiedAt: now })
    }
  }
}

export async function getPlannedDoseLogs(): Promise<DoseLog[]> {
  const rows = await getDb().getAllAsync<DoseLogRow>(
    "SELECT * FROM dose_logs WHERE status = 'planned'",
  )
  return rows.map(rowToDoseLog)
}

export async function getTodayPrnLogForMedication(
  medicationId: string,
  day: Date = new Date(),
): Promise<DoseLog | undefined> {
  const start = startOfLocalDay(day).toISOString()
  const end = endOfLocalDay(day).toISOString()
  const rows = await getDb().getAllAsync<DoseLogRow>(
    `SELECT * FROM dose_logs
     WHERE medication_id = ? AND source = 'prn'
       AND scheduled_at >= ? AND scheduled_at <= ?`,
    [medicationId, start, end],
  )
  return rows[0] ? rowToDoseLog(rows[0]) : undefined
}

export async function logAsNeededIntake(
  medicationId: string,
): Promise<DoseLog> {
  const now = new Date().toISOString()
  const existing = await getTodayPrnLogForMedication(medicationId)
  if (existing) {
    await updateDoseStatus(existing.id, 'taken', { takenAt: now })
    const updated = await getDoseLogById(existing.id)
    return updated!
  }
  const log: DoseLog = {
    id: createId(),
    medicationId,
    scheduledAt: now,
    status: 'taken',
    takenAt: now,
    source: 'prn',
  }
  await insertDoseLog(log)
  await consumeStockForIntake(medicationId)
  await recalculateAndSave()
  scheduleProfilBackup()
  return log
}
