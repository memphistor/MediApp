import { buildMedicationFromWizard, type WizardFormState } from '@mediapp/core'

import { createMedication, listMedications, updateMedication } from '../storage/repositories/medicationRepository'
import { syncDoseLogsForMedication } from '../storage/services/syncDoseLogs'

const demoWizard: WizardFormState = {
  name: 'Lek demo',
  kind: 'otc',
  form: 'tablet',
  doseText: '1 tabl.',
  emptyStomach: 'na',
  meal: '',
  timesRaw: '08:00, 20:00',
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
  color: '#0f766e',
  icon: '💊',
  trackStock: false,
  stockRemaining: 30,
  stockUnitsPerIntake: 1,
  remindersEnabled: true,
}

/** Inserts a demo medication when DB is empty — __DEV__ only. */
export async function ensureDemoMedicationIfEmpty(): Promise<boolean> {
  if (!__DEV__) return false
  const existing = await listMedications()
  const legacy = existing.find((med) => med.name.includes('(dev)'))
  if (legacy) {
    await updateMedication({
      ...legacy,
      name: legacy.name.replace(/\s*\(dev\)\s*/g, '').trim(),
      updatedAt: new Date().toISOString(),
    })
  }
  if (existing.length > 0) return false

  const entry = buildMedicationFromWizard(demoWizard)
  await createMedication(entry)
  await syncDoseLogsForMedication(entry.id)
  return true
}
