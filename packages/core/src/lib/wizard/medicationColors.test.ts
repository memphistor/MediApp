import { describe, expect, it } from 'vitest'
import {
  DEFAULT_MEDICATION_COLOR,
  MEDICATION_COLOR_OPTIONS,
  medicationColorChoices,
  normalizeMedicationColor,
} from './medicationColors'

describe('medicationColors', () => {
  it('offers six presets when current is a preset', () => {
    expect(medicationColorChoices(DEFAULT_MEDICATION_COLOR)).toHaveLength(6)
  })

  it('keeps six presets when the saved color is outside the palette', () => {
    const choices = medicationColorChoices('#112233')
    expect(choices).toEqual([...MEDICATION_COLOR_OPTIONS])
    expect(choices).not.toContain('#112233')
  })

  it('falls back to default for invalid hex', () => {
    expect(normalizeMedicationColor('')).toBe(DEFAULT_MEDICATION_COLOR)
    expect(normalizeMedicationColor('not-a-color')).toBe(DEFAULT_MEDICATION_COLOR)
  })
})
