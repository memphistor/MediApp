import { describe, expect, it } from 'vitest'
import {
  defaultRemindersEnabled,
  isMedicationRemindersEnabled,
} from './medicationReminders'
import type { MedicationEntry } from '@/types/medication'

const base: MedicationEntry = {
  id: '1',
  name: 'X',
  kind: 'otc',
  form: 'tablet',
  doseText: '1',
  onEmptyStomach: 'na',
  times: ['08:00'],
  schedule: { type: 'daily' },
  color: '#000',
  icon: '💊',
  createdAt: '',
  updatedAt: '',
}

describe('medicationReminders', () => {
  it('defaults on for scheduled times', () => {
    expect(defaultRemindersEnabled(base)).toBe(true)
    expect(isMedicationRemindersEnabled(base)).toBe(true)
  })

  it('defaults off for as needed', () => {
    const med = {
      ...base,
      times: [],
      schedule: { type: 'asNeeded' as const },
    }
    expect(defaultRemindersEnabled(med)).toBe(false)
  })

  it('respects explicit false', () => {
    expect(
      isMedicationRemindersEnabled({ ...base, remindersEnabled: false }),
    ).toBe(false)
  })
})
