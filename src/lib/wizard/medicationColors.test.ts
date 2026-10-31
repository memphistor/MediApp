import { describe, expect, it } from 'vitest'
import {
  DEFAULT_MEDICATION_COLOR,
  medicationColorChoices,
  normalizeMedicationColor,
} from './medicationColors'

describe('medicationColors', () => {
  it('offers six presets when current is a preset', () => {
    expect(medicationColorChoices(DEFAULT_MEDICATION_COLOR)).toHaveLength(6)
  })

  it('prepends legacy custom color', () => {
    const choices = medicationColorChoices('#112233')
    expect(choices[0]).toBe('#112233')
    expect(choices).toHaveLength(7)
  })

  it('falls back to default for invalid hex', () => {
    expect(normalizeMedicationColor('')).toBe(DEFAULT_MEDICATION_COLOR)
    expect(normalizeMedicationColor('not-a-color')).toBe(DEFAULT_MEDICATION_COLOR)
  })
})
