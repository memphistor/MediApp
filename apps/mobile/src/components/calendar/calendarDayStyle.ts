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
        backgroundColor: c.brand,
        borderColor: 'transparent',
        borderWidth: 0,
        textColor: '#ffffff',
        fontWeight: '500',
      }
    case 'partial':
      return {
        backgroundColor: c.partialFill,
        borderColor: 'transparent',
        borderWidth: 0,
        textColor: c.partialText,
        fontWeight: '500',
      }
    case 'missed':
      return {
        backgroundColor: c.missedDayFill,
        borderColor: 'transparent',
        borderWidth: 0,
        textColor: c.missedDayText,
        fontWeight: '500',
      }
    case 'planned':
      return {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        borderWidth: 0,
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
