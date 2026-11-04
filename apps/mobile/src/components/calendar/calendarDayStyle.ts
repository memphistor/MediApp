import type { DayComplianceTone } from '@mediapp/core'

import type { ThemePalette } from '@/src/theme/colors'

export type CalendarDayStyle = {
  backgroundColor: string
  borderColor: string
  borderWidth: number
  textColor: string
  fontWeight: '400' | '500' | '600'
}

export function calendarDayStyle(
  tone: DayComplianceTone,
  c: ThemePalette,
): CalendarDayStyle {
  const stone = c.scheme === 'dark' ? '#1e293b' : '#f1f5f9'
  const stoneText = c.scheme === 'dark' ? '#cbd5e1' : '#475569'

  switch (tone) {
    case 'full':
      return {
        backgroundColor: `${c.brand}24`,
        borderColor: 'transparent',
        borderWidth: 0,
        textColor: c.brand,
        fontWeight: '600',
      }
    case 'partial':
      return {
        backgroundColor: `${c.brand}14`,
        borderColor: 'transparent',
        borderWidth: 0,
        textColor: c.brand,
        fontWeight: '500',
      }
    case 'missed':
      return {
        backgroundColor: stone,
        borderColor: 'transparent',
        borderWidth: 0,
        textColor: stoneText,
        fontWeight: '500',
      }
    case 'planned':
      return {
        backgroundColor: c.surfaceElevated,
        borderColor: c.border,
        borderWidth: 1,
        textColor: c.text,
        fontWeight: '400',
      }
    case 'empty':
    default:
      return {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        borderWidth: 0,
        textColor: c.textMuted,
        fontWeight: '400',
      }
  }
}
