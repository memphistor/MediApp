import { describe, expect, it } from 'vitest'
import { isFullDay } from '@/lib/gamification/dayStats'
import { computeGamification } from '@/lib/gamification/computeGamification'
import { computeStreak } from '@/lib/gamification/streak'
import { groupLogsByDateKey as group } from '@/lib/gamification/dayStats'
import type { DoseLog } from '@/types/dose'

function log(
  day: string,
  hour: number,
  status: DoseLog['status'],
): DoseLog {
  const d = new Date(`${day}T${String(hour).padStart(2, '0')}:00:00`)
  return {
    id: `${day}-${hour}`,
    medicationId: 'm1',
    scheduledAt: d.toISOString(),
    status,
  }
}

describe('isFullDay', () => {
  it('requires all taken', () => {
    expect(isFullDay([log('2026-03-10', 8, 'taken')])).toBe(true)
    expect(
      isFullDay([log('2026-03-10', 8, 'taken'), log('2026-03-10', 20, 'missed')]),
    ).toBe(false)
  })
})

describe('computeStreak', () => {
  it('counts consecutive full days', () => {
    const logs = [
      log('2026-03-09', 8, 'taken'),
      log('2026-03-08', 8, 'taken'),
    ]
    const byDay = group(logs)
    const today = new Date(2026, 2, 10)
    const r = computeStreak(byDay, today, true)
    expect(r.currentStreak).toBe(2)
  })

  it('shield absorbs one imperfect day', () => {
    const logs = [
      log('2026-03-09', 8, 'missed'),
      log('2026-03-08', 8, 'taken'),
      log('2026-03-07', 8, 'taken'),
    ]
    const byDay = group(logs)
    const today = new Date(2026, 2, 10)
    const r = computeStreak(byDay, today, true)
    expect(r.currentStreak).toBe(2)
    expect(r.shieldAvailable).toBe(false)
  })
})

describe('computeGamification', () => {
  it('awards taken_100 badge', () => {
    const logs: DoseLog[] = []
    for (let i = 0; i < 100; i++) {
      logs.push(log('2026-01-15', 8, 'taken'))
    }
    const state = computeGamification(logs, undefined, new Date(2026, 2, 10))
    expect(state.takenTotal).toBe(100)
    expect(state.badges.find((b) => b.id === 'taken_100')?.earnedAt).toBeDefined()
  })

  it('ignores as-needed logs in the day ring and taken total', () => {
    const planned = log('2026-03-10', 8, 'taken')
    const prn: DoseLog = {
      ...log('2026-03-10', 12, 'taken'),
      id: 'prn',
      source: 'prn',
    }
    const state = computeGamification(
      [planned, prn],
      undefined,
      new Date(2026, 2, 10),
    )
    expect(state.todayTotal).toBe(1)
    expect(state.takenTotal).toBe(1)
  })
})
