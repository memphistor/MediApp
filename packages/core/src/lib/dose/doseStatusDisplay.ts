import type { DoseLog, DoseStatus } from '@/types/dose'
import type { MedicationEntry, MedicationKind } from '@/types/medication'

const takenGreen = '#16a34a'
const missedRed = '#dc2626'
const skippedYellow = '#ca8a04'
const skippedRed = '#dc2626'

export type DoseStatusDisplayContext = {
  medicationKind?: MedicationKind
  scheduleType?: MedicationEntry['schedule']['type']
  source?: DoseLog['source']
}

export function isAsNeededMedication(
  med: Pick<MedicationEntry, 'schedule'> | undefined,
): boolean {
  return med?.schedule.type === 'asNeeded'
}

export function isAsNeededDoseContext(ctx: DoseStatusDisplayContext): boolean {
  if (ctx.source === 'prn') return true
  if (ctx.scheduleType === 'asNeeded') return true
  return false
}

export function doseStatusPillStyle(
  status: DoseStatus,
  ctx: DoseStatusDisplayContext = {},
): { backgroundColor: string; color: string } {
  const asNeeded = isAsNeededDoseContext(ctx)

  if (status === 'taken') {
    return pill(takenGreen)
  }

  if (asNeeded && status === 'skipped') {
    return pill(takenGreen)
  }

  switch (status) {
    case 'missed':
      return pill(missedRed)
    case 'skipped':
      if (ctx.medicationKind === 'supplement') {
        return pill(skippedYellow)
      }
      return pill(skippedRed)
    case 'planned':
    default:
      return {
        backgroundColor:
          'color-mix(in srgb, var(--color-text-muted) 12%, transparent)',
        color: 'var(--color-text-muted)',
      }
  }
}

function pill(color: string): { backgroundColor: string; color: string } {
  return {
    backgroundColor: `color-mix(in srgb, ${color} 20%, transparent)`,
    color,
  }
}

export function doseStatusContextFromLog(
  log: DoseLog,
  med?: MedicationEntry,
): DoseStatusDisplayContext {
  return {
    medicationKind: med?.kind,
    scheduleType: med?.schedule.type,
    source: log.source,
  }
}
