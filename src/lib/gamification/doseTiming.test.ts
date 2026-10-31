import { describe, expect, it } from 'vitest'
import {
  classifyDoseTiming,
  isDayFullyOnTime,
  onTimeRateAmongTaken,
  timingCountsForLogs,
  TIMING_EARLY_TOLERANCE_MINUTES,
  TIMING_LATE_TOLERANCE_MINUTES,
} from '@/lib/gamification/doseTiming'
import type { DoseLog } from '@/types/dose'

function dose(
  scheduled: string,
  status: DoseLog['status'],
  takenAt?: string,
): DoseLog {
  return {
    id: '1',
    medicationId: 'm',
    scheduledAt: scheduled,
    status,
    takenAt,
  }
}

describe('classifyDoseTiming', () => {
  it('treats intake within late window as on time', () => {
    const scheduled = '2026-03-10T08:00:00.000Z'
    const takenAt = new Date(
      new Date(scheduled).getTime() + TIMING_LATE_TOLERANCE_MINUTES * 60_000,
    ).toISOString()
    expect(classifyDoseTiming(dose(scheduled, 'taken', takenAt))).toBe('on_time')
  })

  it('marks intake beyond late window as late', () => {
    const scheduled = '2026-03-10T08:00:00.000Z'
    const takenAt = new Date(
      new Date(scheduled).getTime() +
        (TIMING_LATE_TOLERANCE_MINUTES + 1) * 60_000,
    ).toISOString()
    expect(classifyDoseTiming(dose(scheduled, 'taken', takenAt))).toBe('late')
  })

  it('marks intake too early', () => {
    const scheduled = '2026-03-10T08:00:00.000Z'
    const takenAt = new Date(
      new Date(scheduled).getTime() -
        (TIMING_EARLY_TOLERANCE_MINUTES + 1) * 60_000,
    ).toISOString()
    expect(classifyDoseTiming(dose(scheduled, 'taken', takenAt))).toBe('early')
  })
})

describe('timingCountsForLogs', () => {
  it('computes on-time rate among taken doses', () => {
    const scheduled = '2026-03-10T08:00:00.000Z'
    const counts = timingCountsForLogs([
      dose(scheduled, 'taken', scheduled),
      dose('2026-03-10T20:00:00.000Z', 'missed'),
    ])
    expect(counts.onTime).toBe(1)
    expect(counts.missed).toBe(1)
    expect(onTimeRateAmongTaken(counts)).toBe(1)
  })
})

describe('isDayFullyOnTime', () => {
  it('requires all taken doses on time and none missed', () => {
    const s1 = '2026-03-10T08:00:00.000Z'
    const s2 = '2026-03-10T20:00:00.000Z'
    expect(
      isDayFullyOnTime([
        dose(s1, 'taken', s1),
        dose(s2, 'taken', s2),
      ]),
    ).toBe(true)
    expect(
      isDayFullyOnTime([
        dose(s1, 'taken', s1),
        dose(s2, 'missed'),
      ]),
    ).toBe(false)
  })
})
