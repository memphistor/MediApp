import Dexie, { type EntityTable } from 'dexie'
import type { MedicationEntry } from '@/types/medication'
import type { DoseLog } from '@/types/dose'
import type { UserSettings } from '@/types/settings'
import type { GamificationState } from '@/types/gamification'

export class MediAppDatabase extends Dexie {
  medications!: EntityTable<MedicationEntry, 'id'>
  doseLogs!: EntityTable<DoseLog, 'id'>
  settings!: EntityTable<UserSettings, 'id'>
  gamification!: EntityTable<GamificationState, 'id'>

  constructor() {
    super('MediAppDB')
    this.version(1).stores({
      medications: 'id, name, updatedAt',
      doseLogs: 'id, medicationId, scheduledAt, status',
      settings: 'id',
      gamification: 'id',
    })
  }
}

export const db = new MediAppDatabase()

export async function clearAllUserData(): Promise<void> {
  await db.transaction(
    'rw',
    db.medications,
    db.doseLogs,
    db.settings,
    db.gamification,
    async () => {
      await db.medications.clear()
      await db.doseLogs.clear()
      await db.settings.clear()
      await db.gamification.clear()
    },
  )
}

export const DEFAULT_SETTINGS: UserSettings = {
  id: 'default',
  theme: 'system',
  fontScale: 'normal',
  onboardingCompleted: false,
  snoozeMinutesDefault: 10,
  persistentAlarmEnabled: false,
}

export const DEFAULT_GAMIFICATION: GamificationState = {
  id: 'default',
  currentStreak: 0,
  shieldAvailable: true,
  badges: [],
  dayRingProgress: 0,
}
