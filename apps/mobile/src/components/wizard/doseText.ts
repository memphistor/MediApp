import type { MedicationForm } from '@mediapp/core'

import { pl } from '@/src/i18n/pl'

export function doseUnit(form: MedicationForm | ''): string {
  if (!form) return pl.wizard.doseUnits.other
  return pl.wizard.doseUnits[form]
}

export function fallbackDose(form: MedicationForm | ''): string {
  return `1 ${doseUnit(form)}`
}
