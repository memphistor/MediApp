import type { UserSettings } from '@mediapp/core'

import { DEFAULT_SETTINGS, getDb } from '../database'
import {
  rowToSettings,
  settingsToRow,
  type SettingsRow,
} from '../mappers/settingsMapper'
import { scheduleProfilBackup } from '../services/profilBackup'

export async function getSettings(): Promise<UserSettings> {
  const row = await getDb().getFirstAsync<SettingsRow>(
    'SELECT * FROM settings WHERE id = ?',
    ['default'],
  )
  if (!row) return DEFAULT_SETTINGS
  return { ...DEFAULT_SETTINGS, ...rowToSettings(row) }
}

export async function upsertSettings(settings: UserSettings): Promise<void> {
  const row = settingsToRow(settings)
  await getDb().runAsync(
    `INSERT OR REPLACE INTO settings (
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
  scheduleProfilBackup()
}
