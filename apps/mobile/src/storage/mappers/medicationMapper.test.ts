import { describe, expect, it } from 'vitest'
import type { MedicationEntry } from '@mediapp/core'

import {
  medicationEntryToRow,
  rowToMedicationEntry,
} from './medicationMapper'

const sample: MedicationEntry = {
  id: 'm1',
  name: 'Test',
  kind: 'otc',
  form: 'tablet',
  doseText: '1 szt.',
  onEmptyStomach: 'na',
  times: ['08:00'],
  schedule: { type: 'daily' },
  color: '#0f766e',
  icon: '💊',
  remindersEnabled: true,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-02T00:00:00.000Z',
}

describe('medicationMapper', () => {
  it('roundtrips entry through row', () => {
    const row = medicationEntryToRow(sample)
    const back = rowToMedicationEntry(row)
    expect(back).toEqual(sample)
  })

  it('parses JSON schedule and times', () => {
    const row = medicationEntryToRow({
      ...sample,
      schedule: { type: 'weekdays', days: [1, 3, 5] },
      times: ['08:00', '20:00'],
    })
    expect(JSON.parse(row.schedule_json)).toEqual({ type: 'weekdays', days: [1, 3, 5] })
    expect(JSON.parse(row.times_json)).toEqual(['08:00', '20:00'])
  })
})
