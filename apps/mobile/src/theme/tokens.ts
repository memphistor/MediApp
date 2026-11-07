import { Platform, type ViewStyle } from 'react-native'

export const space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const

export const radius = {
  control: 29,
  card: 28,
  chip: 23,
  pill: 999,
  icon: 20,
} as const

export const typeBase = {
  title: 34,
  section: 20,
  body: 17,
  secondary: 15,
  caption: 13,
  button: 17,
  metric: 34,
} as const

export const typeLine = {
  title: 40,
  section: 26,
  body: 22,
  secondary: 20,
  caption: 18,
  button: 22,
  metric: 38,
} as const

/** Space reserved so tab content clears the floating tab bar. */
export const TAB_BAR_CLEARANCE = 176

export function cardShadow(scheme: 'light' | 'dark'): ViewStyle {
  if (Platform.OS === 'android') {
    return { elevation: scheme === 'dark' ? 2 : 3 }
  }
  return {
    shadowColor: scheme === 'dark' ? '#000000' : '#14323C',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: scheme === 'dark' ? 0.35 : 0.06,
    shadowRadius: 22,
  }
}

export function softShadow(scheme: 'light' | 'dark'): ViewStyle {
  if (Platform.OS === 'android') {
    return { elevation: 2 }
  }
  return {
    shadowColor: scheme === 'dark' ? '#000000' : '#14323C',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: scheme === 'dark' ? 0.3 : 0.05,
    shadowRadius: 16,
  }
}

export function buttonShadow(): ViewStyle {
  if (Platform.OS === 'android') return { elevation: 4 }
  return {
    shadowColor: '#0B877B',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.26,
    shadowRadius: 16,
  }
}
