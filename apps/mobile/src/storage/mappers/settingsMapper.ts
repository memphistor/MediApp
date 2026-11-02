import type { UserSettings } from '@mediapp/core'

export interface SettingsRow {
  id: string
  theme: string
  font_scale: string
  onboarding_completed: number
  privacy_policy_version_accepted: string | null
  privacy_consent_at: string | null
  special_category_consent_at: string | null
  notifications_enabled: number
  snooze_minutes_default: number
  persistent_alarm_enabled: number
  snooze_until_by_log_id_json: string
}

export function settingsToRow(settings: UserSettings): SettingsRow {
  return {
    id: settings.id,
    theme: settings.theme,
    font_scale: settings.fontScale,
    onboarding_completed: settings.onboardingCompleted ? 1 : 0,
    privacy_policy_version_accepted: settings.privacyPolicyVersionAccepted,
    privacy_consent_at: settings.privacyConsentAt,
    special_category_consent_at: settings.specialCategoryConsentAt,
    notifications_enabled: settings.notificationsEnabled ? 1 : 0,
    snooze_minutes_default: settings.snoozeMinutesDefault,
    persistent_alarm_enabled: settings.persistentAlarmEnabled ? 1 : 0,
    snooze_until_by_log_id_json: JSON.stringify(settings.snoozeUntilByLogId),
  }
}

export function rowToSettings(row: SettingsRow): UserSettings {
  return {
    id: 'default',
    theme: row.theme as UserSettings['theme'],
    fontScale: row.font_scale as UserSettings['fontScale'],
    onboardingCompleted: row.onboarding_completed === 1,
    privacyPolicyVersionAccepted: row.privacy_policy_version_accepted,
    privacyConsentAt: row.privacy_consent_at,
    specialCategoryConsentAt: row.special_category_consent_at,
    notificationsEnabled: row.notifications_enabled === 1,
    snoozeMinutesDefault: row.snooze_minutes_default,
    persistentAlarmEnabled: row.persistent_alarm_enabled === 1,
    snoozeUntilByLogId: JSON.parse(row.snooze_until_by_log_id_json) as Record<
      string,
      string
    >,
  }
}
