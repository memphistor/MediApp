import { getDb, getActiveProfilId } from '@/db/database'
import {
  exportAppSnapshot,
  importAppSnapshot,
  localBackupKey,
  type AppSnapshot,
} from '@/lib/profil/appSnapshot'

let backupTimer: ReturnType<typeof setTimeout> | null = null

export function scheduleProfilBackup(): void {
  const profilId = getActiveProfilId()
  if (!profilId) return
  if (backupTimer) clearTimeout(backupTimer)
  backupTimer = setTimeout(() => {
    backupTimer = null
    void writeLocalProfilBackup(profilId)
  }, 1500)
}

export async function writeLocalProfilBackup(profilId: string): Promise<void> {
  try {
    const snapshot = await exportAppSnapshot(getDb())
    localStorage.setItem(localBackupKey(profilId), JSON.stringify(snapshot))
  } catch {
    /* quota / private mode */
  }
}

export async function restoreLocalProfilBackupIfEmpty(
  profilId: string,
): Promise<boolean> {
  const medCount = await getDb().medications.count()
  if (medCount > 0) return false
  let raw: string | null = null
  try {
    raw = localStorage.getItem(localBackupKey(profilId))
  } catch {
    return false
  }
  if (!raw) return false
  try {
    const snapshot = JSON.parse(raw) as AppSnapshot
    await importAppSnapshot(getDb(), snapshot)
    return true
  } catch {
    return false
  }
}
