import {
  getMedicationById,
  updateMedication,
} from '@/repositories/medicationRepository'

export function isStockTracked(
  med: { stockRemaining?: number } | undefined,
): med is { stockRemaining: number; stockUnitsPerIntake?: number } {
  return med != null && typeof med.stockRemaining === 'number'
}

export function unitsPerIntake(med: {
  stockUnitsPerIntake?: number
}): number {
  const n = med.stockUnitsPerIntake ?? 1
  return Number.isFinite(n) && n >= 1 ? Math.floor(n) : 1
}

export async function adjustMedicationStock(
  medicationId: string,
  deltaUnits: number,
): Promise<void> {
  if (deltaUnits === 0) return
  const med = await getMedicationById(medicationId)
  if (!isStockTracked(med)) return
  const next = Math.max(0, med.stockRemaining + deltaUnits)
  await updateMedication({
    ...med,
    stockRemaining: next,
    updatedAt: new Date().toISOString(),
  })
}

/** Call when a dose becomes taken. */
export async function consumeStockForIntake(
  medicationId: string,
): Promise<void> {
  const med = await getMedicationById(medicationId)
  if (!isStockTracked(med)) return
  await adjustMedicationStock(medicationId, -unitsPerIntake(med))
}

/** Call when a previously taken dose is un-marked (skip / missed). */
export async function restoreStockForIntake(
  medicationId: string,
): Promise<void> {
  const med = await getMedicationById(medicationId)
  if (!isStockTracked(med)) return
  await adjustMedicationStock(medicationId, unitsPerIntake(med))
}

export async function addMedicationStock(
  medicationId: string,
  amount: number,
): Promise<void> {
  if (!Number.isFinite(amount) || amount <= 0) return
  const med = await getMedicationById(medicationId)
  if (!med) return
  const added = Math.floor(amount)
  if (!isStockTracked(med)) {
    await updateMedication({
      ...med,
      stockRemaining: added,
      stockUnitsPerIntake: med.stockUnitsPerIntake ?? 1,
      updatedAt: new Date().toISOString(),
    })
    return
  }
  await adjustMedicationStock(medicationId, added)
}
