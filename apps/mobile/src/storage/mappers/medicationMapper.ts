import type { MedicationEntry } from '@mediapp/core'

export interface MedicationRow {
  id: string
  name: string
  kind: string
  form: string
  form_other_label: string | null
  dose_text: string
  on_empty_stomach: string
  meal_timing: string | null
  times_json: string
  schedule_json: string
  date_range_json: string | null
  purpose_label: string | null
  color: string
  icon: string
  user_note: string | null
  stock_remaining: number | null
  stock_units_per_intake: number | null
  reminders_enabled: number | null
  created_at: string
  updated_at: string
}

export function medicationEntryToRow(entry: MedicationEntry): MedicationRow {
  return {
    id: entry.id,
    name: entry.name,
    kind: entry.kind,
    form: entry.form,
    form_other_label: entry.formOtherLabel ?? null,
    dose_text: entry.doseText,
    on_empty_stomach: entry.onEmptyStomach,
    meal_timing: entry.mealTiming ?? null,
    times_json: JSON.stringify(entry.times),
    schedule_json: JSON.stringify(entry.schedule),
    date_range_json: entry.dateRange ? JSON.stringify(entry.dateRange) : null,
    purpose_label: entry.purposeLabel ?? null,
    color: entry.color,
    icon: entry.icon,
    user_note: entry.userNote ?? null,
    stock_remaining: entry.stockRemaining ?? null,
    stock_units_per_intake: entry.stockUnitsPerIntake ?? null,
    reminders_enabled:
      entry.remindersEnabled === undefined
        ? null
        : entry.remindersEnabled
          ? 1
          : 0,
    created_at: entry.createdAt,
    updated_at: entry.updatedAt,
  }
}

export function rowToMedicationEntry(row: MedicationRow): MedicationEntry {
  const remindersEnabled =
    row.reminders_enabled === null ? undefined : row.reminders_enabled === 1

  return {
    id: row.id,
    name: row.name,
    kind: row.kind as MedicationEntry['kind'],
    form: row.form as MedicationEntry['form'],
    formOtherLabel: row.form_other_label ?? undefined,
    doseText: row.dose_text,
    onEmptyStomach: row.on_empty_stomach as MedicationEntry['onEmptyStomach'],
    mealTiming: (row.meal_timing as MedicationEntry['mealTiming']) ?? undefined,
    times: JSON.parse(row.times_json) as string[],
    schedule: JSON.parse(row.schedule_json) as MedicationEntry['schedule'],
    dateRange: row.date_range_json
      ? (JSON.parse(row.date_range_json) as MedicationEntry['dateRange'])
      : undefined,
    purposeLabel: row.purpose_label ?? undefined,
    color: row.color,
    icon: row.icon,
    userNote: row.user_note ?? undefined,
    stockRemaining: row.stock_remaining ?? undefined,
    stockUnitsPerIntake: row.stock_units_per_intake ?? undefined,
    remindersEnabled,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}
