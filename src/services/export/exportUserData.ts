import { addDays, startOfLocalDay } from '@/lib/dates'
import { listMedications } from '@/repositories/medicationRepository'
import { db } from '@/db/database'
import type { DoseLog } from '@/types/dose'
import type { MedicationEntry } from '@/types/medication'

export type ExportRange = 'all' | '30' | '90'

export interface ExportBundle {
  medications: MedicationEntry[]
  doseLogs: DoseLog[]
  nameById: Map<string, string>
}

export async function loadExportBundle(
  range: ExportRange,
): Promise<ExportBundle> {
  const medications = await listMedications()
  const nameById = new Map(medications.map((m) => [m.id, m.name]))

  let doseLogs = await db.doseLogs.orderBy('scheduledAt').toArray()

  if (range !== 'all') {
    const days = range === '30' ? 30 : 90
    const from = startOfLocalDay(addDays(new Date(), -days)).toISOString()
    doseLogs = doseLogs.filter((l) => l.scheduledAt >= from)
  }

  doseLogs.sort(
    (a, b) =>
      new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime(),
  )

  return { medications, doseLogs, nameById }
}

export function bundleIsEmpty(bundle: ExportBundle): boolean {
  return bundle.medications.length === 0 && bundle.doseLogs.length === 0
}
