import {
  SNAPSHOT_VERSION,
  validateAppSnapshot,
  type AppSnapshot,
  type UserSettings,
} from '@mediapp/core'

import { getDb } from '../database'
import { doseLogToRow } from '../mappers/doseLogMapper'
import {
  gamificationToRow,
  type GamificationRow,
} from '../mappers/gamificationMapper'
import {
  medicationEntryToRow,
  type MedicationRow,
} from '../mappers/medicationMapper'
import { settingsToRow, type SettingsRow } from '../mappers/settingsMapper'
import { getAllDoseLogs } from '../repositories/doseLogRepository'
import { getGamificationState } from '../repositories/gamificationRepository'
import { listMedications } from '../repositories/medicationRepository'
import { getSettings } from '../repositories/settingsRepository'
import {
  normalizeGamificationFromSnapshot,
  normalizeSettingsFromSnapshot,
} from './snapshotNormalize'

const INSERT_MED = `
INSERT OR REPLACE INTO medications (
  id, name, kind, form, form_other_label, dose_text, on_empty_stomach, meal_timing,
  times_json, schedule_json, date_range_json, purpose_label, color, icon, user_note,
  stock_remaining, stock_units_per_intake, reminders_enabled, created_at, updated_at
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`

const INSERT_DOSE = `
INSERT OR REPLACE INTO dose_logs (
  id, medication_id, scheduled_at, status, skip_reason, taken_at, last_notified_at, source
) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`

const INSERT_SETTINGS = `
INSERT OR REPLACE INTO settings (
  id, theme, font_scale, onboarding_completed,
  privacy_policy_version_accepted, privacy_consent_at, special_category_consent_at,
  notifications_enabled, snooze_minutes_default, persistent_alarm_enabled,
  snooze_until_by_log_id_json
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`

const INSERT_GAMIFICATION = `
INSERT OR REPLACE INTO gamification (
  id, current_streak, shield_available, badges_json,
  day_ring_progress, month_rate, taken_total, today_taken, today_total
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`

function medRowToBind(row: MedicationRow): (string | number | null)[] {
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

function settingsRowToBind(row: SettingsRow): (string | number | null)[] {
  return [
    row.id,
    row.theme,
    row.font_scale,
    row.onboarding_completed,
    row.privacy_policy_version_accepted,
    row.privacy_consent_at,
    row.special_category_consent_at,
    row.notifications_enabled,
    row.snooze_minutes_default,
    row.persistent_alarm_enabled,
    row.snooze_until_by_log_id_json,
  ]
}

function gamificationRowToBind(row: GamificationRow): (string | number | null)[] {
  return [
    row.id,
    row.current_streak,
    row.shield_available,
    row.badges_json,
    row.day_ring_progress,
    row.month_rate,
    row.taken_total,
    row.today_taken,
    row.today_total,
  ]
}

export async function exportAppSnapshot(): Promise<AppSnapshot> {
  const [medications, doseLogs, settings, gamification] = await Promise.all([
    listMedications(),
    getAllDoseLogs(),
    getSettings(),
    getGamificationState(),
  ])

  return {
    version: SNAPSHOT_VERSION,
    exportedAt: new Date().toISOString(),
    medications,
    doseLogs,
    medicationNotes: [],
    settings: [settings],
    gamification: [gamification],
  }
}

export async function importAppSnapshot(raw: unknown): Promise<UserSettings> {
  const snapshot = validateAppSnapshot(raw)
  const settings = normalizeSettingsFromSnapshot(snapshot.settings)
  const gamification = normalizeGamificationFromSnapshot(snapshot.gamification)

  const db = getDb()
  await db.withTransactionAsync(async () => {
    await db.execAsync(`
      DELETE FROM medications;
      DELETE FROM dose_logs;
      DELETE FROM settings;
      DELETE FROM gamification;
    `)

    for (const med of snapshot.medications) {
      const row = medicationEntryToRow(med)
      await db.runAsync(INSERT_MED, medRowToBind(row))
    }

    for (const log of snapshot.doseLogs) {
      const row = doseLogToRow(log)
      await db.runAsync(INSERT_DOSE, [
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

    const settingsRow = settingsToRow(settings)
    await db.runAsync(INSERT_SETTINGS, settingsRowToBind(settingsRow))

    const gamRow = gamificationToRow(gamification)
    await db.runAsync(INSERT_GAMIFICATION, gamificationRowToBind(gamRow))
  })

  return settings
}
