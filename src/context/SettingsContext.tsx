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
  clearAllUserData,
} from '@/db/database'
import type { FontScale, ThemePreference, UserSettings } from '@/types/settings'

interface SettingsContextValue {
  settings: UserSettings
  setTheme: (theme: ThemePreference) => void
  setFontScale: (scale: FontScale) => void
  completeOnboarding: () => void
  resetOnboarding: () => void
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
      const merged = existing ?? DEFAULT_SETTINGS
      if (!existing) {
        await db.settings.put(DEFAULT_SETTINGS)
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

  const deleteAllData = useCallback(async () => {
    await clearAllUserData()
    await db.settings.put(DEFAULT_SETTINGS)
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
      deleteAllData,
      ready,
    }),
    [
      settings,
      setTheme,
      setFontScale,
      completeOnboarding,
      resetOnboarding,
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
