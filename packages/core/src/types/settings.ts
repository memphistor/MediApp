export type ThemePreference = 'light' | 'dark' | 'system'
export type FontScale = 'normal' | 'large'

export interface UserSettings {
  id: 'default'
  theme: ThemePreference
  fontScale: FontScale
  onboardingCompleted: boolean
  privacyPolicyVersionAccepted: string | null
  privacyConsentAt: string | null
  specialCategoryConsentAt: string | null
  notificationsEnabled: boolean
  snoozeMinutesDefault: number
  persistentAlarmEnabled: boolean
  snoozeUntilByLogId: Record<string, string>
}
