import { db } from '@/db/database'
import { scheduleProfilBackup } from '@/services/profilBackup'
import { deleteNotesForMedication } from '@/repositories/medicationNoteRepository'
import type { MedicationEntry } from '@/types/medication'

export async function createMedication(
  entry: MedicationEntry,
): Promise<void> {
  await db.medications.put(entry)
  scheduleProfilBackup()
}

export async function updateMedication(
  entry: MedicationEntry,
): Promise<void> {
  await db.medications.put(entry)
  scheduleProfilBackup()
}

export async function getMedicationById(
  id: string,
): Promise<MedicationEntry | undefined> {
  return db.medications.get(id)
}

export async function listMedications(): Promise<MedicationEntry[]> {
  return db.medications.orderBy('name').toArray()
}

export async function deleteMedication(id: string): Promise<void> {
  await db.transaction('rw', db.medications, db.doseLogs, db.medicationNotes, async () => {
    await db.doseLogs.where('medicationId').equals(id).delete()
    await deleteNotesForMedication(id)
    await db.medications.delete(id)
  })
  scheduleProfilBackup()
}
