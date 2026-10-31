import { describe, expect, it } from 'vitest'
import {
  startOfWeekMonday,
  toDateKey,
  weekDayKeys,
} from '@/lib/dates'
import { dayComplianceTone } from '@/lib/gamification/dayStats'
import type { DoseLog } from '@/types/dose'

function log(status: DoseLog['status']): DoseLog {
  return {
    id: '1',
    medicationId: 'm',
    scheduledAt: '2026-03-10T08:00:00.000Z',
    status,
    source: 'schedule',
  }
}

describe('startOfWeekMonday', () => {
  it('returns Monday for a Wednesday', () => {
    const wed = new Date(2026, 2, 11)
    const mon = startOfWeekMonday(wed)
    expect(mon.getDay()).toBe(1)
    expect(toDateKey(mon)).toBe('2026-03-09')
  })
})

describe('weekDayKeys', () => {
  it('returns seven keys from Monday', () => {
    const mon = new Date(2026, 2, 9)
    expect(weekDayKeys(mon)).toEqual([
      '2026-03-09',
      '2026-03-10',
      '2026-03-11',
      '2026-03-12',
      '2026-03-13',
      '2026-03-14',
      '2026-03-15',
    ])
  })
})

describe('dayComplianceTone', () => {
  it('marks full day when all taken', () => {
    expect(dayComplianceTone([log('taken'), log('taken')])).toBe('full')
  })

  it('ignores prn for compliance', () => {
    expect(
      dayComplianceTone([
        log('taken'),
        { ...log('taken'), source: 'prn', id: '2' },
      ]),
    ).toBe('full')
  })
})
