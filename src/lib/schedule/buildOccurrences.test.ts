import { describe, expect, it } from 'vitest'
import { buildOccurrencesForMedication, doseLogId } from '@/lib/schedule/buildOccurrences'
import type { MedicationEntry } from '@/types/medication'

const entry: MedicationEntry = {
  id: 'med-1',
  name: 'X',
  kind: 'otc',
  form: 'tablet',
  doseText: '1',
  onEmptyStomach: 'na',
  times: ['09:00', '21:00'],
  schedule: { type: 'daily' },
  color: '#000',
  icon: 'pill-teal',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
}

describe('buildOccurrencesForMedication', () => {
  it('creates two occurrences per active day', () => {
    const start = new Date(2026, 0, 10)
    const end = new Date(2026, 0, 10)
    const occ = buildOccurrencesForMedication(entry, start, end)
    expect(occ).toHaveLength(2)
    expect(occ[0].medicationId).toBe('med-1')
  })

  it('returns empty for asNeeded', () => {
    const occ = buildOccurrencesForMedication(
      { ...entry, schedule: { type: 'asNeeded' }, times: ['09:00'] },
      new Date(2026, 0, 10),
      new Date(2026, 0, 10),
    )
    expect(occ).toHaveLength(0)
  })

  it('stable dose log id', () => {
    const at = '2026-01-10T08:00:00.000Z'
    expect(doseLogId('a', at)).toBe(`a:${at}`)
  })
})
