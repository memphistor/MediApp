import Dexie, { type EntityTable } from 'dexie'
import type { MedicationEntry } from '@/types/medication'
import type { DoseLog } from '@/types/dose'
import type { UserSettings } from '@/types/settings'
import type { GamificationState } from '@/types/gamification'
import type { MedicationNote } from '@/types/medicationNote'
import { DB_NAME, DB_VERSION, STORE_DEFINITIONS } from '@/db/schema'
import {
  exportAppSnapshot,
  importAppSnapshot,
  readKopiaFromLocationHash,
} from '@/lib/profil/appSnapshot'
import {
  getStoredProfilId,
  readProfilIdFromLocation,
  setStoredProfilId,
} from '@/lib/profil/profilId'
import { restoreLocalProfilBackupIfEmpty } from '@/services/profilBackup'

export class MediAppDatabase extends Dexie {
  medications!: EntityTable<MedicationEntry, 'id'>
  doseLogs!: EntityTable<DoseLog, 'id'>
  medicationNotes!: EntityTable<MedicationNote, 'id'>
  settings!: EntityTable<UserSettings, 'id'>
  gamification!: EntityTable<GamificationState, 'id'>

  constructor(databaseName: string = DB_NAME) {
    super(databaseName)
    this.version(1).stores({
      medications: STORE_DEFINITIONS.medications,
      doseLogs: STORE_DEFINITIONS.doseLogs,
      settings: STORE_DEFINITIONS.settings,
      gamification: STORE_DEFINITIONS.gamification,
    })
    this.version(DB_VERSION).stores({ ...STORE_DEFINITIONS })
  }
}

let dbInstance: MediAppDatabase | null = null
let activeProfilId: string | null = null

export function databaseNameForProfil(profilId: string | null): string {
  if (!profilId) return DB_NAME
  return `${DB_NAME}__${profilId}`
}

export function getActiveProfilId(): string | null {
  return activeProfilId
}

export function openAppDatabase(profilId: string | null): MediAppDatabase {
  const normalized = profilId?.toLowerCase() ?? null
  if (dbInstance && activeProfilId === normalized) {
    return dbInstance
  }
  if (dbInstance) {
    dbInstance.close()
    dbInstance = null
  }
  activeProfilId = normalized
  dbInstance = new MediAppDatabase(databaseNameForProfil(normalized))
  return dbInstance
}

export function getDb(): MediAppDatabase {
  if (!dbInstance) {
    throw new Error('Baza nie została zainicjowana — wywołaj initializeAppStorage().')
  }
  return dbInstance
}

/** Backwards-compatible singleton access after initializeAppStorage(). */
export const db = new Proxy({} as MediAppDatabase, {
  get(_target, prop) {
    const instance = getDb()
    const value = Reflect.get(instance, prop, instance)
    if (typeof value === 'function') {
      return value.bind(instance)
    }
    return value
  },
})

async function copyLegacyDefaultDbInto(target: MediAppDatabase): Promise<boolean> {
  const targetCount = await target.medications.count()
  if (targetCount > 0) return false

  const legacy = new MediAppDatabase(DB_NAME)
  await legacy.open()
  try {
    const legacyCount = await legacy.medications.count()
    if (legacyCount === 0) return false

    const snapshot = await exportAppSnapshot(legacy)
    await importAppSnapshot(target, snapshot)
    return true
  } finally {
    legacy.close()
  }
}

async function applyKopiaFromHashIfNeeded(): Promise<boolean> {
  const kopia = readKopiaFromLocationHash(window.location.hash)
  if (!kopia) return false
  const medCount = await getDb().medications.count()
  if (medCount > 0) return false
  await importAppSnapshot(getDb(), kopia)
  return true
}

export async function initializeAppStorage(): Promise<{
  profilId: string | null
}> {
  const fromUrl = readProfilIdFromLocation(window.location)
  if (fromUrl) {
    setStoredProfilId(fromUrl)
  }
  const profilId = fromUrl ?? getStoredProfilId()

  openAppDatabase(profilId)
  await getDb().open()

  if (profilId) {
    await copyLegacyDefaultDbInto(getDb())
    await restoreLocalProfilBackupIfEmpty(profilId)
  }

  await applyKopiaFromHashIfNeeded()

  return { profilId }
}

/** Tests: reset singleton between cases. */
export async function resetAppStorageForTests(): Promise<void> {
  if (dbInstance) {
    dbInstance.close()
    dbInstance = null
  }
  activeProfilId = null
  openAppDatabase(null)
  await getDb().open()
}

export async function clearAllUserData(): Promise<void> {
  await db.transaction(
    'rw',
    db.medications,
    db.doseLogs,
    db.medicationNotes,
    db.settings,
    db.gamification,
    async () => {
      await db.medications.clear()
      await db.doseLogs.clear()
      await db.medicationNotes.clear()
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
  privacyPolicyVersionAccepted: null,
  privacyConsentAt: null,
  specialCategoryConsentAt: null,
  notificationsEnabled: false,
  snoozeMinutesDefault: 10,
  persistentAlarmEnabled: false,
  snoozeUntilByLogId: {},
}

export const DEFAULT_GAMIFICATION: GamificationState = {
  id: 'default',
  currentStreak: 0,
  shieldAvailable: true,
  badges: [],
  dayRingProgress: 0,
  monthRate: 0,
  takenTotal: 0,
  todayTaken: 0,
  todayTotal: 0,
}
