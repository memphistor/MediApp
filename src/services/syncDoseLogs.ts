import { addDays, endOfLocalDay, startOfLocalDay } from '@/lib/dates'
import {
  buildOccurrencesForMedication,
  doseLogId,
} from '@/lib/schedule/buildOccurrences'
import { listMedications, getMedicationById } from '@/repositories/medicationRepository'
import { upsertPlanned, updateDoseStatus } from '@/repositories/doseLogRepository'
import { db } from '@/db/database'
import type { DoseLog } from '@/types/dose'

const PAST_DAYS = 1
const FUTURE_DAYS = 35

export function getSyncWindow(reference = new Date()): { start: Date; end: Date } {
  const start = startOfLocalDay(addDays(reference, -PAST_DAYS))
  const end = endOfLocalDay(addDays(reference, FUTURE_DAYS))
  return { start, end }
}

async function markMissedPlannedLogs(now = new Date()): Promise<void> {
  const planned = await db.doseLogs.where('status').equals('planned').toArray()
  for (const log of planned) {
    const scheduled = new Date(log.scheduledAt)
    const dayEnd = endOfLocalDay(scheduled)
    if (now > dayEnd) {
      await updateDoseStatus(log.id, 'missed')
    }
  }
}

export async function syncDoseLogsForMedication(
  medicationId: string,
  reference = new Date(),
): Promise<void> {
  const entry = await getMedicationById(medicationId)
  if (!entry) return
  const { start, end } = getSyncWindow(reference)
  const occurrences = buildOccurrencesForMedication(entry, start, end)
  for (const occ of occurrences) {
    const id = doseLogId(occ.medicationId, occ.scheduledAt)
    const log: DoseLog = {
      id,
      medicationId: occ.medicationId,
      scheduledAt: occ.scheduledAt,
      status: 'planned',
    }
    await upsertPlanned(log)
  }
  await markMissedPlannedLogs(reference)
}

export async function syncAllDoseLogs(reference = new Date()): Promise<void> {
  const meds = await listMedications()
  const { start, end } = getSyncWindow(reference)
  for (const entry of meds) {
    const occurrences = buildOccurrencesForMedication(entry, start, end)
    for (const occ of occurrences) {
      const id = doseLogId(occ.medicationId, occ.scheduledAt)
      await upsertPlanned({
        id,
        medicationId: occ.medicationId,
        scheduledAt: occ.scheduledAt,
        status: 'planned',
      })
    }
  }
  await markMissedPlannedLogs(reference)
}
