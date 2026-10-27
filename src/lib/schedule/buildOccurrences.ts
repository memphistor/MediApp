import { addDays, combineDateAndTime, startOfLocalDay, toDateKey } from '@/lib/dates'
import { isMedicationActiveOnDate } from '@/lib/schedule/isActiveOnDate'
import type { MedicationEntry } from '@/types/medication'

export interface DoseOccurrence {
  medicationId: string
  scheduledAt: string
}

export function buildOccurrencesForMedication(
  entry: MedicationEntry,
  rangeStart: Date,
  rangeEnd: Date,
): DoseOccurrence[] {
  if (entry.schedule.type === 'asNeeded' || entry.times.length === 0) {
    return []
  }

  const out: DoseOccurrence[] = []
  let cursor = startOfLocalDay(rangeStart)
  const end = startOfLocalDay(rangeEnd)

  while (cursor <= end) {
    if (isMedicationActiveOnDate(cursor, entry)) {
      for (const time of entry.times) {
        const at = combineDateAndTime(cursor, time)
        out.push({
          medicationId: entry.id,
          scheduledAt: at.toISOString(),
        })
      }
    }
    cursor = addDays(cursor, 1)
  }

  return out
}

export function doseLogId(medicationId: string, scheduledAt: string): string {
  return `${medicationId}:${scheduledAt}`
}

export function buildOccurrencesForAll(
  entries: MedicationEntry[],
  rangeStart: Date,
  rangeEnd: Date,
): DoseOccurrence[] {
  return entries.flatMap((e) => buildOccurrencesForMedication(e, rangeStart, rangeEnd))
}

export { toDateKey }
