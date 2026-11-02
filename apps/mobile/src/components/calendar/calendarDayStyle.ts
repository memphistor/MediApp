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
  switch (tone) {
    case 'full':
      return {
        backgroundColor: `${c.brand}33`,
        borderColor: 'transparent',
        borderWidth: 0,
        textColor: c.brand,
        fontWeight: '600',
      }
    case 'partial':
      return {
        backgroundColor: `${c.brand}1A`,
        borderColor: 'transparent',
        borderWidth: 0,
        textColor: c.brand,
        fontWeight: '500',
      }
    case 'missed':
      return {
        backgroundColor: c.scheme === 'dark' ? '#78350f' : '#fef3c7',
        borderColor: 'transparent',
        borderWidth: 0,
        textColor: c.scheme === 'dark' ? '#fde68a' : '#92400e',
        fontWeight: '500',
      }
    case 'planned':
      return {
        backgroundColor: c.surfaceElevated,
        borderColor: `${c.brand}66`,
        borderWidth: 1,
        textColor: c.text,
        fontWeight: '400',
      }
    case 'empty':
    default:
      return {
        backgroundColor: c.surfaceElevated,
        borderColor: c.border,
        borderWidth: 1,
        textColor: c.textMuted,
        fontWeight: '400',
      }
  }
}
