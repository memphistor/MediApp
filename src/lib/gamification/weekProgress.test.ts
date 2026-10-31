import { describe, expect, it } from 'vitest'
import { weekPlanProgress } from './weekProgress'
import type { DoseLog } from '@/types/dose'

describe('weekPlanProgress', () => {
  it('counts taken vs total in ISO week', () => {
    const ref = new Date('2026-10-31T12:00:00.000Z')
    const logs: DoseLog[] = [
      {
        id: '1',
        medicationId: 'm',
        scheduledAt: '2026-10-31T08:00:00.000Z',
        status: 'taken',
        takenAt: '2026-10-31T08:05:00.000Z',
      },
      {
        id: '2',
        medicationId: 'm',
        scheduledAt: '2026-10-31T20:00:00.000Z',
        status: 'planned',
      },
    ]
    const r = weekPlanProgress(logs, ref)
    expect(r.taken).toBe(1)
    expect(r.total).toBe(2)
    expect(r.progress).toBe(0.5)
  })
})
