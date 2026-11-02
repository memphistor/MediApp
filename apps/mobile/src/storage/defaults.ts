import type { GamificationState, UserSettings } from '@mediapp/core'

export const DEFAULT_SETTINGS: UserSettings = {
  id: 'default',
  theme: 'system',
  fontScale: 'normal',
  onboardingCompleted: false,
  privacyPolicyVersionAccepted: null,
  privacyConsentAt: null,
  specialCategoryConsentAt: null,
  notificationsEnabled: false,
  snoozeMinutesDefault: 10,
  persistentAlarmEnabled: false,
  snoozeUntilByLogId: {},
}

export const DEFAULT_GAMIFICATION: GamificationState = {
  id: 'default',
  currentStreak: 0,
  shieldAvailable: true,
  badges: [],
  dayRingProgress: 0,
  monthRate: 0,
  takenTotal: 0,
  todayTaken: 0,
  todayTotal: 0,
}
