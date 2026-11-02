import { describe, expect, it } from 'vitest'
import { isActiveOnDate, isMedicationActiveOnDate } from '@/lib/schedule/isActiveOnDate'
import type { MedicationEntry } from '@/types/medication'

const baseEntry = (overrides: Partial<MedicationEntry> = {}): MedicationEntry => ({
  id: 'm1',
  name: 'Test',
  kind: 'otc',
  form: 'tablet',
  doseText: '1',
  onEmptyStomach: 'na',
  times: ['08:00'],
  schedule: { type: 'daily' },
  color: '#000',
  icon: '💊',
  createdAt: '2026-01-01T10:00:00.000Z',
  updatedAt: '2026-01-01T10:00:00.000Z',
  ...overrides,
})

describe('isActiveOnDate', () => {
  it('daily is active every day in range', () => {
    const day = new Date(2026, 0, 15)
    expect(
      isActiveOnDate(day, {
        schedule: { type: 'daily' },
        anchorDate: '2026-01-01',
      }),
    ).toBe(true)
  })

  it('respects dateRange end', () => {
    const day = new Date(2026, 1, 1)
    expect(
      isActiveOnDate(day, {
        schedule: { type: 'daily' },
        dateRange: { start: '2026-01-01', end: '2026-01-31' },
        anchorDate: '2026-01-01',
      }),
    ).toBe(false)
  })

  it('weekdays only on selected days', () => {
    const monday = new Date(2026, 0, 5)
    const tuesday = new Date(2026, 0, 6)
    const ctx = {
      schedule: { type: 'weekdays' as const, days: [1] },
      anchorDate: '2026-01-01',
    }
    expect(isActiveOnDate(monday, ctx)).toBe(true)
    expect(isActiveOnDate(tuesday, ctx)).toBe(false)
  })

  it('everyNDays from anchor', () => {
    const ctx = {
      schedule: { type: 'everyNDays' as const, interval: 2 },
      anchorDate: '2026-01-01',
    }
    expect(isActiveOnDate(new Date(2026, 0, 1), ctx)).toBe(true)
    expect(isActiveOnDate(new Date(2026, 0, 2), ctx)).toBe(false)
    expect(isActiveOnDate(new Date(2026, 0, 3), ctx)).toBe(true)
  })

  it('cycle active/break pattern', () => {
    const entry = baseEntry({
      schedule: { type: 'cycle', activeDays: 2, breakDays: 1 },
      createdAt: '2026-01-01T00:00:00.000Z',
    })
    expect(isMedicationActiveOnDate(new Date(2026, 0, 1), entry)).toBe(true)
    expect(isMedicationActiveOnDate(new Date(2026, 0, 2), entry)).toBe(true)
    expect(isMedicationActiveOnDate(new Date(2026, 0, 3), entry)).toBe(false)
    expect(isMedicationActiveOnDate(new Date(2026, 0, 4), entry)).toBe(true)
  })

  it('asNeeded never schedules', () => {
    const entry = baseEntry({ schedule: { type: 'asNeeded' } })
    expect(isMedicationActiveOnDate(new Date(2026, 0, 10), entry)).toBe(false)
  })
})
