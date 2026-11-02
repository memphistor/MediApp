import {
  getMedicationById,
  updateMedication,
} from '../repositories/medicationRepository'
import { isStockTracked, unitsPerIntake } from '@mediapp/core'

export { isStockTracked, unitsPerIntake }

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

export async function consumeStockForIntake(
  medicationId: string,
): Promise<void> {
  const med = await getMedicationById(medicationId)
  if (!isStockTracked(med)) return
  await adjustMedicationStock(medicationId, -unitsPerIntake(med))
}

export async function restoreStockForIntake(
  medicationId: string,
): Promise<void> {
  const med = await getMedicationById(medicationId)
  if (!isStockTracked(med)) return
  await adjustMedicationStock(medicationId, unitsPerIntake(med))
}
