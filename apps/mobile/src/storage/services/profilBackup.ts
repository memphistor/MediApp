import AsyncStorage from '@react-native-async-storage/async-storage'

import { exportAppSnapshot, importAppSnapshot } from './appSnapshot'
import { countMedications } from '../repositories/medicationRepository'

const LOCAL_BACKUP_KEY = 'mediapp-local-backup-v1'

let backupTimer: ReturnType<typeof setTimeout> | null = null

export function scheduleProfilBackup(): void {
  if (backupTimer) clearTimeout(backupTimer)
  backupTimer = setTimeout(() => {
    backupTimer = null
    void writeLocalBackup()
  }, 1500)
}

export async function writeLocalBackup(): Promise<void> {
  try {
    const snapshot = await exportAppSnapshot()
    await AsyncStorage.setItem(LOCAL_BACKUP_KEY, JSON.stringify(snapshot))
  } catch {
    /* quota / unavailable */
  }
}

export async function restoreLocalBackupIfEmpty(): Promise<boolean> {
  const medCount = await countMedications()
  if (medCount > 0) return false

  let raw: string | null = null
  try {
    raw = await AsyncStorage.getItem(LOCAL_BACKUP_KEY)
  } catch {
    return false
  }
  if (!raw) return false

  try {
    const snapshot = JSON.parse(raw) as unknown
    await importAppSnapshot(snapshot)
    return true
  } catch {
    return false
  }
}
