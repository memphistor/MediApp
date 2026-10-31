import 'fake-indexeddb/auto'
import { beforeEach, describe, expect, it } from 'vitest'
import {
  db,
  openAppDatabase,
  resetAppStorageForTests,
} from '@/db/database'
import { exportAppSnapshot, importAppSnapshot } from '@/lib/profil/appSnapshot'
import { buildMedicationFromWizard, type WizardFormState } from '@/lib/wizard/buildMedication'
import { createMedication } from '@/repositories/medicationRepository'

const minimalWizard: WizardFormState = {
  name: 'Profil test',
  kind: 'otc',
  form: 'tablet',
  doseText: '1',
  emptyStomach: 'na',
  meal: '',
  timesRaw: '08:00',
  scheduleType: 'daily',
  weekdayDays: [1],
  everyNInterval: 2,
  weeklyDay: 1,
  monthlyDay: 1,
  cycleActive: 21,
  cycleBreak: 7,
  dateStart: '',
  dateEnd: '',
  purpose: '',
  note: '',
  color: '#2563eb',
  icon: '💊',
  trackStock: false,
  stockRemaining: 30,
  stockUnitsPerIntake: 1,
}

describe('profil vault (IndexedDB)', () => {
  beforeEach(async () => {
    await resetAppStorageForTests()
    await db.delete()
    await db.open()
  })

  it('keeps separate data per profil id', async () => {
    const entry = buildMedicationFromWizard(minimalWizard)
    await createMedication(entry)
    expect(await db.medications.count()).toBe(1)

    openAppDatabase('vaultb')
    await db.delete()
    await db.open()
    expect(await db.medications.count()).toBe(0)

    openAppDatabase(null)
    await db.open()
    expect(await db.medications.count()).toBe(1)
  })

  it('roundtrips snapshot export/import', async () => {
    await createMedication(buildMedicationFromWizard(minimalWizard))
    const snap = await exportAppSnapshot(db)
    openAppDatabase('other')
    await db.delete()
    await db.open()
    await importAppSnapshot(db, snap)
    expect(await db.medications.count()).toBe(1)
  })
})
