import type { MedicationEntry } from '@/types/medication'

export function defaultRemindersEnabled(
  entry: Pick<MedicationEntry, 'schedule' | 'times'>,
): boolean {
  if (entry.schedule.type === 'asNeeded') return false
  return entry.times.length > 0
}

export function isMedicationRemindersEnabled(med: MedicationEntry): boolean {
  if (med.remindersEnabled === false) return false
  if (med.remindersEnabled === true) return true
  return defaultRemindersEnabled(med)
}
