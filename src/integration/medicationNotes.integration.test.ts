import 'fake-indexeddb/auto'
import { beforeEach, describe, expect, it } from 'vitest'
import { db, resetAppStorageForTests } from '@/db/database'
import { createMedicationNote } from '@/repositories/medicationNoteRepository'
import { buildMedicationFromWizard, type WizardFormState } from '@/lib/wizard/buildMedication'
import { createMedication } from '@/repositories/medicationRepository'

const validWizard: WizardFormState = {
  name: 'Notatki test',
  kind: 'otc',
  form: 'tablet',
  doseText: '1',
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
  color: '#16a34a',
  icon: 'pill-teal',
  trackStock: false,
  stockRemaining: 30,
  stockUnitsPerIntake: 1,
}

describe('medication notes', () => {
  beforeEach(async () => {
    await resetAppStorageForTests()
    await db.delete()
    await db.open()
  })

  it('stores note with recordedAt timestamp', async () => {
    const entry = buildMedicationFromWizard(validWizard)
    await createMedication(entry)
    const recordedAt = '2026-04-01T14:30:00.000Z'
    const note = await createMedicationNote({
      medicationId: entry.id,
      body: 'Lekkie zmęczenie',
      recordedAt,
    })
    const stored = await db.medicationNotes.get(note.id)
    expect(stored?.body).toBe('Lekkie zmęczenie')
    expect(stored?.recordedAt).toBe(recordedAt)
  })
})
