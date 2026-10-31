import { describe, expect, it } from 'vitest'
import { isPlannedUpcoming, splitHistoryLogs } from './historySections'
import type { DoseLog } from '@/types/dose'

const now = new Date('2026-10-31T12:00:00.000Z')

function log(partial: Partial<DoseLog> & Pick<DoseLog, 'id' | 'scheduledAt' | 'status'>): DoseLog {
  return {
    medicationId: 'm1',
    ...partial,
  }
}

describe('historySections', () => {
  it('treats future planned as upcoming', () => {
    const l = log({
      id: '1',
      scheduledAt: '2026-11-01T08:00:00.000Z',
      status: 'planned',
    })
    expect(isPlannedUpcoming(l, now)).toBe(true)
  })

  it('past includes taken, missed, and overdue planned', () => {
    const logs = [
      log({ id: 'f', scheduledAt: '2026-11-05T08:00:00.000Z', status: 'planned' }),
      log({ id: 't', scheduledAt: '2026-10-01T08:00:00.000Z', status: 'taken' }),
      log({ id: 'p', scheduledAt: '2026-10-30T08:00:00.000Z', status: 'planned' }),
    ]
    const { past, planned } = splitHistoryLogs(logs, now)
    expect(planned.map((x) => x.id)).toEqual(['f'])
    expect(past.map((x) => x.id)).toEqual(['p', 't'])
  })
})
