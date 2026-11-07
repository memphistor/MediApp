import {
  addDays,
  buildOccurrencesForMedication,
  doseLogId,
  endOfLocalDay,
  startOfLocalDay,
} from '@mediapp/core'
import type { DoseLog } from '@mediapp/core'

import {
  deleteDoseLog,
  getDoseLogsForMedication,
  getPlannedDoseLogs,
  updateDoseStatus,
  upsertPlanned,
} from '../repositories/doseLogRepository'
import { getMedicationById, listMedications } from '../repositories/medicationRepository'

import { recalculateAndSave } from '../repositories/gamificationRepository'

const PAST_DAYS = 1
const FUTURE_DAYS = 35

export function getSyncWindow(reference = new Date()): { start: Date; end: Date } {
  const start = startOfLocalDay(addDays(reference, -PAST_DAYS))
  const end = endOfLocalDay(addDays(reference, FUTURE_DAYS))
  return { start, end }
}

async function markMissedPlannedLogs(now = new Date()): Promise<void> {
  const planned = await getPlannedDoseLogs()
  for (const log of planned) {
    const scheduled = new Date(log.scheduledAt)
    const dayEnd = endOfLocalDay(scheduled)
    if (now > dayEnd) {
      await updateDoseStatus(log.id, 'missed', undefined, {
        skipGamification: true,
      })
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
  const nowMs = reference.getTime()
  const existingBefore = await getDoseLogsForMedication(medicationId)
  const existingIds = new Set(existingBefore.map((log) => log.id))
  const keep = new Set<string>()
  for (const occ of occurrences) {
    const id = doseLogId(occ.medicationId, occ.scheduledAt)
    // Godzina już minęła w momencie zapisu — nie tworzymy nowej dawki,
    // żeby nie odpalać od razu powiadomienia. Następny termin zostaje.
    if (new Date(occ.scheduledAt).getTime() <= nowMs && !existingIds.has(id)) {
      continue
    }
    keep.add(id)
    const log: DoseLog = {
      id,
      medicationId: occ.medicationId,
      scheduledAt: occ.scheduledAt,
      status: 'planned',
    }
    await upsertPlanned(log)
  }
  const startIso = start.toISOString()
  const endIso = end.toISOString()
  const existing = await getDoseLogsForMedication(medicationId)
  for (const log of existing) {
    if (log.source === 'prn' || log.status !== 'planned') continue
    if (log.scheduledAt < startIso || log.scheduledAt > endIso) continue
    if (!keep.has(log.id)) await deleteDoseLog(log.id)
  }
  await markMissedPlannedLogs(reference)
  await recalculateAndSave(reference)
}

export async function syncAllDoseLogs(reference = new Date()): Promise<void> {
  const meds = await listMedications()
  const { start, end } = getSyncWindow(reference)
  for (const entry of meds) {
    const occurrences = buildOccurrencesForMedication(entry, start, end)
    for (const occ of occurrences) {
      if (new Date(occ.scheduledAt).getTime() <= reference.getTime()) continue
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
  await recalculateAndSave(reference)
}
