import { describe, expect, it } from 'vitest'
import { doseStatusPillStyle } from './doseStatusDisplay'

describe('doseStatusPillStyle', () => {
  it('skipped supplement is yellow', () => {
    const style = doseStatusPillStyle('skipped', { medicationKind: 'supplement' })
    expect(style.color).toBe('#ca8a04')
  })

  it('skipped prescription is red', () => {
    const style = doseStatusPillStyle('skipped', { medicationKind: 'prescription' })
    expect(style.color).toBe('#dc2626')
  })

  it('skipped as-needed is green', () => {
    const style = doseStatusPillStyle('skipped', {
      scheduleType: 'asNeeded',
      source: 'prn',
    })
    expect(style.color).toBe('#16a34a')
  })
})
