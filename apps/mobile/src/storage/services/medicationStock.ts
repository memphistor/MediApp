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
