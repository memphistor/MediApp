import { describe, expect, it } from 'vitest'
import { periodBounds } from '@/lib/gamification/progressPeriods'
import { toDateKey } from '@/lib/dates'

describe('periodBounds', () => {
  const ref = new Date(2026, 5, 15, 12, 0, 0)

  it('day is single calendar day', () => {
    const { from, to } = periodBounds('day', ref)
    expect(toDateKey(from)).toBe('2026-06-15')
    expect(toDateKey(to)).toBe('2026-06-15')
  })

  it('month starts at first of month', () => {
    const { from } = periodBounds('month', ref)
    expect(toDateKey(from)).toBe('2026-06-01')
  })

  it('days100 spans 100 days inclusive', () => {
    const { from } = periodBounds('days100', ref)
    expect(toDateKey(from)).toBe('2026-03-08')
  })
})
