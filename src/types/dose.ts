export type DoseStatus = 'planned' | 'taken' | 'skipped' | 'missed'

export interface DoseLog {
  id: string
  medicationId: string
  scheduledAt: string
  status: DoseStatus
  skipReason?: string
  takenAt?: string
  lastNotifiedAt?: string
}
