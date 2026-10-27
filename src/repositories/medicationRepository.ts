import { db } from '@/db/database'
import type { MedicationEntry } from '@/types/medication'

export async function createMedication(
  entry: MedicationEntry,
): Promise<void> {
  await db.medications.put(entry)
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
  await db.transaction('rw', db.medications, db.doseLogs, async () => {
    await db.doseLogs.where('medicationId').equals(id).delete()
    await db.medications.delete(id)
  })
}
