import type { DoseLog } from '../types/dose'
import type { GamificationState } from '../types/gamification'
import type { MedicationEntry } from '../types/medication'
import type { MedicationNote } from '../types/medicationNote'
import type { UserSettings } from '../types/settings'

export const SNAPSHOT_VERSION = 1 as const

export type AppSnapshot = {
  version: typeof SNAPSHOT_VERSION
  exportedAt: string
  medications: MedicationEntry[]
  doseLogs: DoseLog[]
  medicationNotes: MedicationNote[]
  settings: UserSettings[]
  gamification: GamificationState[]
}

export function assertSnapshotVersion(
  snapshot: { version: number },
): asserts snapshot is AppSnapshot {
  if (snapshot.version !== SNAPSHOT_VERSION) {
    throw new Error('Nieobsługiwana wersja kopii.')
  }
}
