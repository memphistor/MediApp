import type { MediAppDatabase } from '@/db/database'
import type { DoseLog } from '@/types/dose'
import type { GamificationState } from '@/types/gamification'
import type { MedicationEntry } from '@/types/medication'
import type { MedicationNote } from '@/types/medicationNote'
import type { UserSettings } from '@/types/settings'

export type AppSnapshot = {
  version: 1
  exportedAt: string
  medications: MedicationEntry[]
  doseLogs: DoseLog[]
  medicationNotes: MedicationNote[]
  settings: UserSettings[]
  gamification: GamificationState[]
}

export async function exportAppSnapshot(
  database: MediAppDatabase,
): Promise<AppSnapshot> {
  const [
    medications,
    doseLogs,
    medicationNotes,
    settings,
    gamification,
  ] = await Promise.all([
    database.medications.toArray(),
    database.doseLogs.toArray(),
    database.medicationNotes.toArray(),
    database.settings.toArray(),
    database.gamification.toArray(),
  ])
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    medications,
    doseLogs,
    medicationNotes,
    settings,
    gamification,
  }
}

export async function importAppSnapshot(
  database: MediAppDatabase,
  snapshot: AppSnapshot,
): Promise<void> {
  if (snapshot.version !== 1) {
    throw new Error('Nieobsługiwana wersja kopii.')
  }
  await database.transaction(
    'rw',
    database.medications,
    database.doseLogs,
    database.medicationNotes,
    database.settings,
    database.gamification,
    async () => {
      await database.medications.clear()
      await database.doseLogs.clear()
      await database.medicationNotes.clear()
      await database.settings.clear()
      await database.gamification.clear()
      if (snapshot.medications.length) {
        await database.medications.bulkPut(snapshot.medications)
      }
      if (snapshot.doseLogs.length) {
        await database.doseLogs.bulkPut(snapshot.doseLogs)
      }
      if (snapshot.medicationNotes.length) {
        await database.medicationNotes.bulkPut(snapshot.medicationNotes)
      }
      if (snapshot.settings.length) {
        await database.settings.bulkPut(snapshot.settings)
      }
      if (snapshot.gamification.length) {
        await database.gamification.bulkPut(snapshot.gamification)
      }
    },
  )
}

const KOPIA_HASH_PARAM = 'kopia'

export function encodeSnapshotForHash(snapshot: AppSnapshot): string {
  const json = JSON.stringify(snapshot)
  const b64 = btoa(unescape(encodeURIComponent(json)))
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export function decodeSnapshotFromHash(encoded: string): AppSnapshot | null {
  try {
    let b64 = encoded.replace(/-/g, '+').replace(/_/g, '/')
    while (b64.length % 4) b64 += '='
    const json = decodeURIComponent(escape(atob(b64)))
    const parsed = JSON.parse(json) as AppSnapshot
    if (parsed?.version !== 1 || !Array.isArray(parsed.medications)) return null
    return parsed
  } catch {
    return null
  }
}

export function readKopiaFromLocationHash(
  hash: string,
): AppSnapshot | null {
  const body = hash.startsWith('#') ? hash.slice(1) : hash
  if (!body) return null
  const encoded = new URLSearchParams(body).get(KOPIA_HASH_PARAM)
  if (!encoded) return null
  return decodeSnapshotFromHash(encoded)
}

export function buildHashWithKopia(snapshot: AppSnapshot): string {
  const encoded = encodeSnapshotForHash(snapshot)
  const params = new URLSearchParams()
  params.set(KOPIA_HASH_PARAM, encoded)
  return `#${params.toString()}`
}

export function localBackupKey(profilId: string): string {
  return `mediapp-local-backup__${profilId.toLowerCase()}`
}
