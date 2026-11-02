import type { GamificationState, UserSettings } from '@mediapp/core'

import { DEFAULT_GAMIFICATION, DEFAULT_SETTINGS } from '../defaults'

export function normalizeSettingsFromSnapshot(
  settings: UserSettings[],
): UserSettings {
  const found =
    settings.find((s) => s.id === 'default') ?? settings[0] ?? null
  if (!found) return DEFAULT_SETTINGS
  return {
    ...DEFAULT_SETTINGS,
    ...found,
    id: 'default',
    snoozeUntilByLogId: found.snoozeUntilByLogId ?? {},
  }
}

export function normalizeGamificationFromSnapshot(
  states: GamificationState[],
): GamificationState {
  const found =
    states.find((s) => s.id === 'default') ?? states[0] ?? null
  if (!found) return DEFAULT_GAMIFICATION
  return { ...DEFAULT_GAMIFICATION, ...found, id: 'default' }
}
