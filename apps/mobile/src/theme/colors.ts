/** Design tokens aligned with web `src/styles/index.css` */
export const colors = {
  brand: '#0f766e',
  brandMuted: '#14b8a6',
  light: {
    surface: '#f8fafc',
    surfaceElevated: '#ffffff',
    text: '#0f172a',
    textMuted: '#64748b',
    border: '#e2e8f0',
  },
  dark: {
    surface: '#0f172a',
    surfaceElevated: '#1e293b',
    text: '#f1f5f9',
    textMuted: '#94a3b8',
    border: '#334155',
  },
} as const

export type ThemePalette = {
  brand: string
  brandMuted: string
  surface: string
  surfaceElevated: string
  text: string
  textMuted: string
  border: string
}

export function themeColors(scheme: 'light' | 'dark'): ThemePalette {
  const base = scheme === 'dark' ? colors.dark : colors.light
  return { ...base, brand: colors.brand, brandMuted: colors.brandMuted }
}
