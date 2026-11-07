export interface MedicationNote {
  id: string
  medicationId: string
  /** When the observation happened (ISO). */
  recordedAt: string
  body: string
  createdAt: string
  updatedAt: string
}
