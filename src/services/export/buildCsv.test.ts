import { describe, expect, it } from 'vitest'
import {
  buildDoseLogsCsv,
  buildMedicationsCsv,
  CSV_BOM,
  escapeCsvCell,
} from '@/services/export/buildCsv'
import type { MedicationEntry } from '@/types/medication'

const med: MedicationEntry = {
  id: '1',
  name: 'Test "quoted"',
  kind: 'otc',
  form: 'tablet',
  doseText: '1 szt',
  onEmptyStomach: 'na',
  times: ['08:00'],
  schedule: { type: 'daily' },
  color: '#000',
  icon: '💊',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
}

describe('buildCsv', () => {
  it('adds BOM', () => {
    const csv = buildMedicationsCsv([])
    expect(csv.startsWith(CSV_BOM)).toBe(true)
  })

  it('escapes quotes', () => {
    expect(escapeCsvCell('a"b')).toBe('"a""b"')
  })

  it('includes medication row', () => {
    const csv = buildMedicationsCsv([med])
    expect(csv).toContain('Test ""quoted""')
  })

  it('empty dose logs still has header', () => {
    const csv = buildDoseLogsCsv([], new Map())
    expect(csv).toContain('medication_name')
  })
})
