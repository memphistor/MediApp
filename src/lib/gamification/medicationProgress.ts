import type { DoseLog } from '@/types/dose'
import {
  type ProgressPeriod,
  periodBounds,
} from '@/lib/gamification/progressPeriods'

export function logsForMedicationInPeriod(
  logs: DoseLog[],
  medicationId: string,
  period: ProgressPeriod,
  referenceDate = new Date(),
): DoseLog[] {
  const { from, to } = periodBounds(period, referenceDate)
  const start = from.getTime()
  const end = to.getTime()
  return logs
    .filter((l) => l.medicationId === medicationId)
    .filter((l) => {
      const t = new Date(l.scheduledAt).getTime()
      return t >= start && t <= end
    })
    .sort(
      (a, b) =>
        new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime(),
    )
}
