/** Light palette follows the v2 screen mockups. Dark keeps the same roles. */
export const colors = {
  brand: '#0B877B',
  brandDark: '#086A61',
  brandMuted: '#1AA394',
  light: {
    surface: '#F5F8F8',
    surfaceElevated: '#FFFFFF',
    text: '#16252C',
    textMuted: '#74838C',
    border: '#EDF1F2',
    tint: '#E6F4F2',
    tintStrong: '#CFEBE7',
    faint: '#B3BDC2',
    line: '#EDF1F2',
    track: '#E8EEEF',
    ringTrack: '#EAF0F1',
    missedFill: '#E3E9EC',
    missedText: '#4B5A63',
    partialFill: '#F3C14B',
    partialText: '#5C4308',
    missedDayFill: '#D64555',
    missedDayText: '#FFFFFF',
  },
  dark: {
    surface: '#10181C',
    surfaceElevated: '#1A2429',
    text: '#F4F7F8',
    textMuted: '#8A979F',
    border: '#2A363C',
    tint: '#14302C',
    tintStrong: '#1C403A',
    faint: '#5C6B73',
    line: '#2A363C',
    track: '#243034',
    ringTrack: '#243034',
    missedFill: '#2A363C',
    missedText: '#C5D0D4',
    partialFill: '#C4922A',
    partialText: '#1A1408',
    missedDayFill: '#C44755',
    missedDayText: '#FFFFFF',
  },
} as const

export type ThemePalette = {
  scheme: 'light' | 'dark'
  brand: string
  brandDark: string
  brandMuted: string
  surface: string
  surfaceElevated: string
  text: string
  textMuted: string
  border: string
  tint: string
  tintStrong: string
  faint: string
  line: string
  track: string
  ringTrack: string
  missedFill: string
  missedText: string
  partialFill: string
  partialText: string
  missedDayFill: string
  missedDayText: string
}

export function themeColors(scheme: 'light' | 'dark'): ThemePalette {
  const base = scheme === 'dark' ? colors.dark : colors.light
  return {
    scheme,
    ...base,
    brand: colors.brand,
    brandDark: colors.brandDark,
    brandMuted: colors.brandMuted,
  }
}

export function statusPillColors(
  status: 'planned' | 'taken' | 'skipped' | 'missed',
  scheme: 'light' | 'dark',
): { backgroundColor: string; color: string } {
  if (scheme === 'dark') {
    switch (status) {
      case 'taken':
        return { backgroundColor: '#143528', color: '#8EE0B0' }
      case 'skipped':
        return { backgroundColor: '#3A2E14', color: '#F3C98A' }
      case 'missed':
        return { backgroundColor: '#3A1C22', color: '#F3A8B0' }
      default:
        return { backgroundColor: '#243034', color: '#C5D0D4' }
    }
  }
  switch (status) {
    case 'taken':
      return { backgroundColor: '#E2F5E9', color: '#17803D' }
    case 'skipped':
      return { backgroundColor: '#FDF0D3', color: '#A15F08' }
    case 'missed':
      return { backgroundColor: '#FCE3E6', color: '#C22E40' }
    default:
      return { backgroundColor: '#EEF2F3', color: '#5F6E77' }
  }
}
