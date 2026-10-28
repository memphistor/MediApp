export type DoseStatus = 'planned' | 'taken' | 'skipped' | 'missed'

export type DoseSource = 'schedule' | 'prn'

export interface DoseLog {
  id: string
  medicationId: string
  scheduledAt: string
  status: DoseStatus
  skipReason?: string
  takenAt?: string
  lastNotifiedAt?: string
  /** Absent or `schedule` = planned dose. `prn` = ad-hoc as-needed intake. */
  source?: DoseSource
}
