import type { DoseLog } from '@mediapp/core'

export interface DoseLogRow {
  id: string
  medication_id: string
  scheduled_at: string
  status: string
  skip_reason: string | null
  taken_at: string | null
  last_notified_at: string | null
  source: string | null
}

export function doseLogToRow(log: DoseLog): DoseLogRow {
  return {
    id: log.id,
    medication_id: log.medicationId,
    scheduled_at: log.scheduledAt,
    status: log.status,
    skip_reason: log.skipReason ?? null,
    taken_at: log.takenAt ?? null,
    last_notified_at: log.lastNotifiedAt ?? null,
    source: log.source ?? null,
  }
}

export function rowToDoseLog(row: DoseLogRow): DoseLog {
  return {
    id: row.id,
    medicationId: row.medication_id,
    scheduledAt: row.scheduled_at,
    status: row.status as DoseLog['status'],
    skipReason: row.skip_reason ?? undefined,
    takenAt: row.taken_at ?? undefined,
    lastNotifiedAt: row.last_notified_at ?? undefined,
    source: (row.source as DoseLog['source']) ?? undefined,
  }
}
