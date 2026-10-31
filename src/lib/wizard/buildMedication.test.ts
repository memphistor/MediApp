import { describe, expect, it } from 'vitest'
import {
  firstWizardStepWithErrors,
  validateWizard,
  validateWizardStep,
  type WizardFormState,
} from '@/lib/wizard/buildMedication'

const validBase: WizardFormState = {
  name: 'Test',
  kind: 'otc',
  form: 'tablet',
  doseText: '1 szt.',
  emptyStomach: 'na',
  meal: '',
  timesRaw: '08:00',
  scheduleType: 'daily',
  weekdayDays: [1, 2, 3, 4, 5],
  everyNInterval: 2,
  weeklyDay: 1,
  monthlyDay: 1,
  cycleActive: 21,
  cycleBreak: 7,
  dateStart: '',
  dateEnd: '',
  purpose: '',
  note: '',
  color: '#000',
  icon: 'pill-teal',
  trackStock: false,
  stockRemaining: 30,
  stockUnitsPerIntake: 1,
}

describe('validateWizardStep', () => {
  it('wymaga pól z kroku 1', () => {
    const errors = validateWizardStep(1, { ...validBase, name: '', kind: '' })
    expect(errors.name).toBeTruthy()
    expect(errors.kind).toBeTruthy()
    expect(errors.doseText).toBeUndefined()
  })

  it('wymaga pól z kroku 3', () => {
    const errors = validateWizardStep(3, {
      ...validBase,
      scheduleType: '',
      timesRaw: '',
    })
    expect(errors.scheduleType).toBeTruthy()
    expect(errors.times).toBeTruthy()
  })

  it('pomija godziny dla asNeeded', () => {
    const errors = validateWizardStep(3, {
      ...validBase,
      scheduleType: 'asNeeded',
      timesRaw: '',
    })
    expect(errors.times).toBeUndefined()
  })
})

describe('firstWizardStepWithErrors', () => {
  it('wskazuje najwcześniejszy krok z błędem', () => {
    const errors = validateWizard({ ...validBase, name: '', timesRaw: '' })
    expect(firstWizardStepWithErrors(errors)).toBe(1)
  })

  it('zwraca null gdy brak błędów', () => {
    expect(firstWizardStepWithErrors(validateWizard(validBase))).toBeNull()
  })
})
