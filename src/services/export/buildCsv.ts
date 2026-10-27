import type { DoseLog } from '@/types/dose'
import type { MedicationEntry } from '@/types/medication'

export const CSV_BOM = '\uFEFF'
export const CSV_SEP = ';'

export function escapeCsvCell(value: string): string {
  if (value.includes('"') || value.includes(CSV_SEP) || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

function row(cells: string[]): string {
  return cells.map(escapeCsvCell).join(CSV_SEP)
}

export function buildMedicationsCsv(medications: MedicationEntry[]): string {
  const lines = [
    row([
      'id',
      'name',
      'kind',
      'form',
      'dose_text',
      'schedule_type',
      'times',
      'purpose_label',
      'user_note',
      'created_at',
    ]),
  ]
  for (const m of medications) {
    lines.push(
      row([
        m.id,
        m.name,
        m.kind,
        m.form,
        m.doseText,
        m.schedule.type,
        m.times.join(', '),
        m.purposeLabel ?? '',
        m.userNote ?? '',
        m.createdAt,
      ]),
    )
  }
  return CSV_BOM + lines.join('\n')
}

export function buildDoseLogsCsv(
  logs: DoseLog[],
  nameById: Map<string, string>,
): string {
  const lines = [
    row([
      'id',
      'medication_name',
      'scheduled_at',
      'status',
      'taken_at',
      'skip_reason',
    ]),
  ]
  for (const log of logs) {
    lines.push(
      row([
        log.id,
        nameById.get(log.medicationId) ?? '',
        log.scheduledAt,
        log.status,
        log.takenAt ?? '',
        log.skipReason ?? '',
      ]),
    )
  }
  return CSV_BOM + lines.join('\n')
}
