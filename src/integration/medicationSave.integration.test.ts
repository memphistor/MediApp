import 'fake-indexeddb/auto'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '@/db/database'
import {
  buildMedicationFromWizard,
  validateWizard,
  type WizardFormState,
} from '@/lib/wizard/buildMedication'
import { createMedication, getMedicationById } from '@/repositories/medicationRepository'
import { syncDoseLogsForMedication } from '@/services/syncDoseLogs'
import { updateDoseStatus } from '@/repositories/doseLogRepository'

const validWizard: WizardFormState = {
  name: 'Weryfikacja',
  kind: 'otc',
  form: 'tablet',
  doseText: '1 tabl.',
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
  color: '#0f766e',
  icon: '💊',
}

describe('medication save flow (IndexedDB)', () => {
  beforeEach(async () => {
    await db.delete()
    await db.open()
  })

  it('validateWizard accepts typical new entry', () => {
    expect(validateWizard(validWizard)).toEqual({})
  })

  it('createMedication + syncDoseLogs produces today planned dose', async () => {
    const entry = buildMedicationFromWizard(validWizard)
    await createMedication(entry)
    await syncDoseLogsForMedication(entry.id)

    const stored = await getMedicationById(entry.id)
    expect(stored?.name).toBe('Weryfikacja')

    const logs = await db.doseLogs.where('medicationId').equals(entry.id).toArray()
    expect(logs.length).toBeGreaterThan(0)
    expect(logs.some((l) => l.status === 'planned')).toBe(true)
  })

  it('mark dose taken updates log', async () => {
    const entry = buildMedicationFromWizard(validWizard)
    await createMedication(entry)
    await syncDoseLogsForMedication(entry.id)
    const log = await db.doseLogs.where('medicationId').equals(entry.id).first()
    expect(log).toBeDefined()
    await updateDoseStatus(log!.id, 'taken', {
      takenAt: new Date().toISOString(),
    })
    const updated = await db.doseLogs.get(log!.id)
    expect(updated?.status).toBe('taken')
  })
})
