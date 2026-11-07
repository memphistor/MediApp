import type { MedicationEntry } from '@mediapp/core'

import { getDb } from '../database'
import {
  medicationEntryToRow,
  rowToMedicationEntry,
  type MedicationRow,
} from '../mappers/medicationMapper'
import { scheduleProfilBackup } from '../services/profilBackup'

const INSERT_MED = `
INSERT OR REPLACE INTO medications (
  id, name, kind, form, form_other_label, dose_text, on_empty_stomach, meal_timing,
  times_json, schedule_json, date_range_json, purpose_label, color, icon, user_note,
  stock_remaining, stock_units_per_intake, reminders_enabled, created_at, updated_at
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`

export async function createMedication(entry: MedicationEntry): Promise<void> {
  const row = medicationEntryToRow(entry)
  const db = getDb()
  await db.runAsync(INSERT_MED, rowToBind(row))
  scheduleProfilBackup()
}

export async function updateMedication(entry: MedicationEntry): Promise<void> {
  await createMedication(entry)
}

export async function getMedicationById(
  id: string,
): Promise<MedicationEntry | undefined> {
  const row = await getDb().getFirstAsync<MedicationRow>(
    'SELECT * FROM medications WHERE id = ?',
    [id],
  )
  return row ? rowToMedicationEntry(row) : undefined
}

export async function listMedications(): Promise<MedicationEntry[]> {
  const rows = await getDb().getAllAsync<MedicationRow>(
    'SELECT * FROM medications ORDER BY name COLLATE NOCASE',
  )
  return rows.map(rowToMedicationEntry)
}

export async function countMedications(): Promise<number> {
  const row = await getDb().getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM medications',
  )
  return row?.count ?? 0
}

export async function deleteMedication(id: string): Promise<void> {
  const db = getDb()
  await db.withTransactionAsync(async () => {
    await db.runAsync('DELETE FROM dose_logs WHERE medication_id = ?', [id])
    await db.runAsync('DELETE FROM medications WHERE id = ?', [id])
  })
  scheduleProfilBackup()
}

function rowToBind(row: MedicationRow): (string | number | null)[] {
  return [
    row.id,
    row.name,
    row.kind,
    row.form,
    row.form_other_label,
    row.dose_text,
    row.on_empty_stomach,
    row.meal_timing,
    row.times_json,
    row.schedule_json,
    row.date_range_json,
    row.purpose_label,
    row.color,
    row.icon,
    row.user_note,
    row.stock_remaining,
    row.stock_units_per_intake,
    row.reminders_enabled,
    row.created_at,
    row.updated_at,
  ]
}
