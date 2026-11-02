import { openDatabaseAsync, type SQLiteDatabase } from 'expo-sqlite'

import { DEFAULT_GAMIFICATION, DEFAULT_SETTINGS } from './defaults'
import {
  gamificationToRow,
  rowToGamification,
  type GamificationRow,
} from './mappers/gamificationMapper'
import {
  rowToSettings,
  settingsToRow,
  type SettingsRow,
} from './mappers/settingsMapper'
import { runMigrations } from './migrations'
import { DB_FILE_NAME } from './schema'

let dbInstance: SQLiteDatabase | null = null

export function getDb(): SQLiteDatabase {
  if (!dbInstance) {
    throw new Error(
      'Baza nie została zainicjowana — wywołaj initializeAppStorage().',
    )
  }
  return dbInstance
}

export async function initializeAppStorage(): Promise<void> {
  if (dbInstance) return

  const db = await openDatabaseAsync(DB_FILE_NAME)
  await runMigrations(db)
  await ensureDefaultSettings(db)
  await ensureDefaultGamification(db)
  dbInstance = db
}

async function ensureDefaultSettings(db: SQLiteDatabase): Promise<void> {
  const existing = await db.getFirstAsync<SettingsRow>(
    'SELECT * FROM settings WHERE id = ?',
    ['default'],
  )
  if (existing) return
  const row = settingsToRow(DEFAULT_SETTINGS)
  await db.runAsync(
    `INSERT INTO settings (
      id, theme, font_scale, onboarding_completed,
      privacy_policy_version_accepted, privacy_consent_at, special_category_consent_at,
      notifications_enabled, snooze_minutes_default, persistent_alarm_enabled,
      snooze_until_by_log_id_json
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
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
    ],
  )
}

async function ensureDefaultGamification(db: SQLiteDatabase): Promise<void> {
  const existing = await db.getFirstAsync<GamificationRow>(
    'SELECT * FROM gamification WHERE id = ?',
    ['default'],
  )
  if (existing) return
  const row = gamificationToRow(DEFAULT_GAMIFICATION)
  await db.runAsync(
    `INSERT INTO gamification (
      id, current_streak, shield_available, badges_json,
      day_ring_progress, month_rate, taken_total, today_taken, today_total
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      row.id,
      row.current_streak,
      row.shield_available,
      row.badges_json,
      row.day_ring_progress,
      row.month_rate,
      row.taken_total,
      row.today_taken,
      row.today_total,
    ],
  )
}

export async function clearAllUserData(): Promise<void> {
  const db = getDb()
  await db.execAsync(`
    DELETE FROM medications;
    DELETE FROM dose_logs;
    DELETE FROM settings;
    DELETE FROM gamification;
  `)
  await ensureDefaultSettings(db)
  await ensureDefaultGamification(db)
}

/** Tests: reset singleton. */
export async function resetAppStorageForTests(): Promise<void> {
  if (dbInstance) {
    await dbInstance.closeAsync()
    dbInstance = null
  }
  await initializeAppStorage()
}

export { DEFAULT_GAMIFICATION, DEFAULT_SETTINGS }
