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
import type { FontScale, ThemePreference, UserSettings } from '@mediapp/core'

interface SettingsContextValue {
  settings: UserSettings
  ready: boolean
  completeOnboarding: () => void
  replaceSettings: (next: UserSettings) => void
  deleteAllData: () => Promise<void>
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

  const replaceSettings = useCallback(
    (next: UserSettings) => {
      void persist(next)
    },
    [persist],
  )

  const deleteAllData = useCallback(async () => {
    await clearAllUserData()
    setSettings(DEFAULT_SETTINGS)
  }, [])

  const value = useMemo(
    () => ({
      settings,
      ready,
      completeOnboarding,
      replaceSettings,
      deleteAllData,
    }),
    [settings, ready, completeOnboarding, replaceSettings, deleteAllData],
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
