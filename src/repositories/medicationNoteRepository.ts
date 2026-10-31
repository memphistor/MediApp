import { db } from '@/db/database'
import { scheduleProfilBackup } from '@/services/profilBackup'
import { endOfLocalDay, startOfLocalDay } from '@/lib/dates'
import { createId } from '@/lib/id'
import type { MedicationNote } from '@/types/medicationNote'

export async function createMedicationNote(input: {
  medicationId: string
  body: string
  recordedAt: string
}): Promise<MedicationNote> {
  const trimmed = input.body.trim()
  if (!trimmed) {
    throw new Error('empty note')
  }
  const now = new Date().toISOString()
  const note: MedicationNote = {
    id: createId(),
    medicationId: input.medicationId,
    body: trimmed,
    recordedAt: input.recordedAt,
    createdAt: now,
    updatedAt: now,
  }
  await db.medicationNotes.put(note)
  scheduleProfilBackup()
  return note
}

export async function deleteMedicationNote(id: string): Promise<void> {
  await db.medicationNotes.delete(id)
}

export async function listMedicationNotes(
  medicationId: string,
): Promise<MedicationNote[]> {
  const rows = await db.medicationNotes
    .where('medicationId')
    .equals(medicationId)
    .toArray()
  return rows.sort(
    (a, b) =>
      new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime(),
  )
}

export function filterNotesByLocalRange(
  notes: MedicationNote[],
  from: Date,
  to: Date,
): MedicationNote[] {
  const start = startOfLocalDay(from).getTime()
  const end = endOfLocalDay(to).getTime()
  return notes.filter((n) => {
    const t = new Date(n.recordedAt).getTime()
    return t >= start && t <= end
  })
}

export async function deleteNotesForMedication(
  medicationId: string,
): Promise<void> {
  await db.medicationNotes.where('medicationId').equals(medicationId).delete()
}
