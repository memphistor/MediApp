import { addDays, startOfLocalDay } from '@/lib/dates'
import { buildOccurrencesForMedication } from '@/lib/schedule/buildOccurrences'
import { unitsPerIntake } from '@/services/medicationStock'
import type { MedicationEntry } from '@/types/medication'

/** Average stock units consumed per calendar day (7-day window). */
export function estimateAverageDailyStockUnits(
  entry: MedicationEntry,
  referenceDate = new Date(),
): number {
  if (entry.schedule.type === 'asNeeded' || entry.times.length === 0) {
    return 0
  }
  const start = startOfLocalDay(referenceDate)
  const end = addDays(start, 6)
  const occurrences = buildOccurrencesForMedication(entry, start, end)
  if (occurrences.length === 0) return 0
  const units = occurrences.length * unitsPerIntake(entry)
  return units / 7
}

export type StockAlertLevel = 'ok' | 'warn' | 'critical'

/**
 * Yellow: under 7 daily doses left; red: 3 or fewer daily doses left.
 * Uses days-of-supply from schedule; falls back to intake count for as-needed.
 */
export function stockAlertLevel(
  entry: MedicationEntry,
  referenceDate = new Date(),
): StockAlertLevel | null {
  if (entry.stockRemaining == null) return null

  const dailyUnits = estimateAverageDailyStockUnits(entry, referenceDate)
  const perIntake = unitsPerIntake(entry)

  let dailyDosesLeft: number
  if (dailyUnits > 0) {
    dailyDosesLeft = entry.stockRemaining / dailyUnits
  } else {
    dailyDosesLeft = entry.stockRemaining / perIntake
  }

  if (dailyDosesLeft <= 3) return 'critical'
  if (dailyDosesLeft < 7) return 'warn'
  return 'ok'
}

export function formatDailyDosesLeft(
  entry: MedicationEntry,
  referenceDate = new Date(),
): number {
  const dailyUnits = estimateAverageDailyStockUnits(entry, referenceDate)
  const perIntake = unitsPerIntake(entry)
  if (dailyUnits > 0) {
    return Math.floor((entry.stockRemaining ?? 0) / dailyUnits)
  }
  return Math.floor((entry.stockRemaining ?? 0) / perIntake)
}
