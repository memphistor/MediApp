import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  db,
  DEFAULT_SETTINGS,
  DEFAULT_GAMIFICATION,
  clearAllUserData,
} from '@/db/database'
import { scheduleProfilBackup } from '@/services/profilBackup'
import type { FontScale, ThemePreference, UserSettings } from '@/types/settings'

interface SettingsContextValue {
  settings: UserSettings
  setTheme: (theme: ThemePreference) => void
  setFontScale: (scale: FontScale) => void
  completeOnboarding: () => void
  resetOnboarding: () => void
  setNotificationsEnabled: (enabled: boolean) => Promise<boolean>
  setSnoozeMinutesDefault: (minutes: number) => void
  setPersistentAlarmEnabled: (enabled: boolean) => void
  replaceSettings: (next: UserSettings) => void
  deleteAllData: () => Promise<void>
  ready: boolean
}

const SettingsContext = createContext<SettingsContextValue | null>(null)

function applyTheme(theme: ThemePreference) {
  const root = document.documentElement
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const dark = theme === 'dark' || (theme === 'system' && prefersDark)
  root.classList.toggle('dark', dark)
}

function applyFontScale(scale: FontScale) {
  document.documentElement.classList.toggle('font-large', scale === 'large')
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    void (async () => {
      const existing = await db.settings.get('default')
      const merged: UserSettings = {
        ...DEFAULT_SETTINGS,
        ...existing,
      }
      if (!existing) {
        await db.settings.put(merged)
      }
      setSettings(merged)
      applyTheme(merged.theme)
      applyFontScale(merged.fontScale)
      setReady(true)
    })()
  }, [])

  const persist = useCallback(async (next: UserSettings) => {
    setSettings(next)
    applyTheme(next.theme)
    applyFontScale(next.fontScale)
    await db.settings.put(next)
    scheduleProfilBackup()
  }, [])

  const setTheme = useCallback(
    (theme: ThemePreference) => {
      void persist({ ...settings, theme })
    },
    [persist, settings],
  )

  const setFontScale = useCallback(
    (scale: FontScale) => {
      void persist({ ...settings, fontScale: scale })
    },
    [persist, settings],
  )

  const completeOnboarding = useCallback(() => {
    void persist({ ...settings, onboardingCompleted: true })
  }, [persist, settings])

  const resetOnboarding = useCallback(() => {
    void persist({ ...settings, onboardingCompleted: false })
  }, [persist, settings])

  const replaceSettings = useCallback(
    (next: UserSettings) => {
      void persist(next)
    },
    [persist],
  )

  const setNotificationsEnabled = useCallback(
    async (enabled: boolean): Promise<boolean> => {
      if (enabled && 'Notification' in window) {
        const perm = await Notification.requestPermission()
        if (perm !== 'granted') {
          void persist({ ...settings, notificationsEnabled: false })
          return false
        }
      }
      void persist({ ...settings, notificationsEnabled: enabled })
      return enabled
    },
    [persist, settings],
  )

  const setSnoozeMinutesDefault = useCallback(
    (minutes: number) => {
      void persist({
        ...settings,
        snoozeMinutesDefault: Math.max(1, Math.min(120, minutes)),
      })
    },
    [persist, settings],
  )

  const setPersistentAlarmEnabled = useCallback(
    (enabled: boolean) => {
      void persist({ ...settings, persistentAlarmEnabled: enabled })
    },
    [persist, settings],
  )

  const deleteAllData = useCallback(async () => {
    await clearAllUserData()
    await db.settings.put(DEFAULT_SETTINGS)
    await db.gamification.put(DEFAULT_GAMIFICATION)
    setSettings(DEFAULT_SETTINGS)
    applyTheme(DEFAULT_SETTINGS.theme)
    applyFontScale(DEFAULT_SETTINGS.fontScale)
  }, [])

  const value = useMemo(
    () => ({
      settings,
      setTheme,
      setFontScale,
      completeOnboarding,
      resetOnboarding,
      setNotificationsEnabled,
      setSnoozeMinutesDefault,
      setPersistentAlarmEnabled,
      replaceSettings,
      deleteAllData,
      ready,
    }),
    [
      settings,
      setTheme,
      setFontScale,
      completeOnboarding,
      resetOnboarding,
      setNotificationsEnabled,
      setSnoozeMinutesDefault,
      setPersistentAlarmEnabled,
      replaceSettings,
      deleteAllData,
      ready,
    ],
  )

  return (
    <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
  )
}

export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider')
  return ctx
}
