import { describe, expect, it } from 'vitest'
import { buildReminderGroups } from '@/services/reminders/reminderGroups'
import type { DoseLog } from '@/types/dose'
import type { MedicationEntry } from '@/types/medication'

const med: MedicationEntry = {
  id: 'm1',
  name: 'TestMed',
  kind: 'otc',
  form: 'tablet',
  doseText: '1',
  onEmptyStomach: 'na',
  times: ['08:00'],
  schedule: { type: 'daily' },
  color: '#000',
  icon: '💊',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
}

describe('buildReminderGroups', () => {
  it('groups logs at same scheduledAt', () => {
    const at = '2026-03-10T07:00:00.000Z'
    const logs: DoseLog[] = [
      {
        id: '1',
        medicationId: 'm1',
        scheduledAt: at,
        status: 'planned',
      },
      {
        id: '2',
        medicationId: 'm1',
        scheduledAt: at,
        status: 'planned',
      },
    ]
    const groups = buildReminderGroups(
      logs,
      [med],
      new Date('2026-03-10T08:00:00.000Z'),
      {},
      false,
      300_000,
    )
    expect(groups).toHaveLength(1)
    expect(groups[0].logIds).toHaveLength(2)
  })

  it('respects snooze', () => {
    const logs: DoseLog[] = [
      {
        id: '1',
        medicationId: 'm1',
        scheduledAt: '2026-03-10T07:00:00.000Z',
        status: 'planned',
      },
    ]
    const groups = buildReminderGroups(
      logs,
      [med],
      new Date('2026-03-10T08:00:00.000Z'),
      { '1': '2026-03-10T12:00:00.000Z' },
      false,
      300_000,
    )
    expect(groups).toHaveLength(0)
  })
})
