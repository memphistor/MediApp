import { useColorScheme as useRNColorScheme } from 'react-native'

import { useSettings } from '@/src/context/SettingsContext'

export function useAppColorScheme(): 'light' | 'dark' {
  const system = useRNColorScheme()
  const { settings } = useSettings()
  if (settings.theme === 'light') return 'light'
  if (settings.theme === 'dark') return 'dark'
  return system === 'dark' ? 'dark' : 'light'
}

/** Respects user theme preference from settings. */
export const useColorScheme = useAppColorScheme
