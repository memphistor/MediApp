import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import { clearAllUserData, DEFAULT_SETTINGS } from '@/src/storage/database'
import {
  getSettings,
  upsertSettings,
} from '@/src/storage/repositories/settingsRepository'
import { cancelAllMediAppScheduledNotifications } from '@/src/notifications/cancelNotifications'
import { requestReminderRescheduleImmediate } from '@/src/notifications/reminderReschedule'
import { ensureNotificationPermission } from '@/src/notifications/setup'
import type { FontScale, ThemePreference, UserSettings } from '@mediapp/core'

interface SettingsContextValue {
  settings: UserSettings
  ready: boolean
  completeOnboarding: () => void
  resetOnboarding: () => void
  replaceSettings: (next: UserSettings) => void
  deleteAllData: () => Promise<void>
  setTheme: (theme: ThemePreference) => void
  setFontScale: (scale: FontScale) => void
  setNotificationsEnabled: (enabled: boolean) => Promise<boolean>
  setSnoozeMinutesDefault: (minutes: number) => void
  setPersistentAlarmEnabled: (enabled: boolean) => void
}

const SettingsContext = createContext<SettingsContextValue | null>(null)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    void (async () => {
      const loaded = await getSettings()
      setSettings(loaded)
      setReady(true)
    })()
  }, [])

  const persist = useCallback(async (next: UserSettings) => {
    setSettings(next)
    await upsertSettings(next)
  }, [])

  const completeOnboarding = useCallback(() => {
    void persist({ ...settings, onboardingCompleted: true })
  }, [persist, settings])

  const resetOnboarding = useCallback(() => {
    void persist({ ...settings, onboardingCompleted: false })
  }, [persist, settings])

  const setTheme = useCallback(
    (theme: ThemePreference) => {
      void persist({ ...settings, theme })
    },
    [persist, settings],
  )

  const setFontScale = useCallback(
    (fontScale: FontScale) => {
      void persist({ ...settings, fontScale })
    },
    [persist, settings],
  )

  const replaceSettings = useCallback(
    (next: UserSettings) => {
      void persist(next)
    },
    [persist],
  )

  const deleteAllData = useCallback(async () => {
    await clearAllUserData()
    await cancelAllMediAppScheduledNotifications()
    setSettings(DEFAULT_SETTINGS)
    await requestReminderRescheduleImmediate(DEFAULT_SETTINGS)
  }, [])

  const setNotificationsEnabled = useCallback(
    async (enabled: boolean): Promise<boolean> => {
      if (enabled) {
        const allowed = await ensureNotificationPermission()
        if (!allowed) {
          const next = { ...settings, notificationsEnabled: false }
          await persist(next)
          return false
        }
      }
      const next = { ...settings, notificationsEnabled: enabled }
      await persist(next)
      await requestReminderRescheduleImmediate(next)
      return enabled
    },
    [persist, settings],
  )

  const setSnoozeMinutesDefault = useCallback(
    (minutes: number) => {
      const next = {
        ...settings,
        snoozeMinutesDefault: Math.max(1, Math.min(120, minutes)),
      }
      void persist(next).then(() => requestReminderRescheduleImmediate(next))
    },
    [persist, settings],
  )

  const setPersistentAlarmEnabled = useCallback(
    (enabled: boolean) => {
      const next = { ...settings, persistentAlarmEnabled: enabled }
      void persist(next).then(() => requestReminderRescheduleImmediate(next))
    },
    [persist, settings],
  )

  const value = useMemo(
    () => ({
      settings,
      ready,
      completeOnboarding,
      resetOnboarding,
      replaceSettings,
      deleteAllData,
      setTheme,
      setFontScale,
      setNotificationsEnabled,
      setSnoozeMinutesDefault,
      setPersistentAlarmEnabled,
    }),
    [
      settings,
      ready,
      completeOnboarding,
      resetOnboarding,
      replaceSettings,
      deleteAllData,
      setTheme,
      setFontScale,
      setNotificationsEnabled,
      setSnoozeMinutesDefault,
      setPersistentAlarmEnabled,
    ],
  )

  if (!ready) return null

  return (
    <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
  )
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext)
  if (!ctx) {
    throw new Error('useSettings wymaga SettingsProvider')
  }
  return ctx
}

export type { ThemePreference, FontScale }
