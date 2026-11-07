import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { AppState, type AppStateStatus } from 'react-native'

import type { UserSettings } from '@mediapp/core'

import { ensureDemoMedicationIfEmpty } from '@/src/dev/seedDemoMedication'
import { requestReminderRescheduleImmediate } from '@/src/notifications/reminderReschedule'
import { initializeAppStorage } from '@/src/storage/database'
import { getSettings } from '@/src/storage/repositories/settingsRepository'
import { importAppSnapshot } from '@/src/storage/services/appSnapshot'
import { restoreLocalBackupIfEmpty, writeLocalBackup } from '@/src/storage/services/profilBackup'
import { syncAllDoseLogs } from '@/src/storage/services/syncDoseLogs'

interface StorageContextValue {
  ready: boolean
  syncing: boolean
  bumpRefresh: () => void
  refreshKey: number
  importSnapshot: (raw: unknown) => Promise<UserSettings>
}

const StorageContext = createContext<StorageContextValue | null>(null)

export function StorageProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)
  const [syncing, setSyncing] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  const bumpRefresh = useCallback(() => {
    setRefreshKey((k) => k + 1)
  }, [])

  const runSync = useCallback(async () => {
    setSyncing(true)
    try {
      await syncAllDoseLogs()
      bumpRefresh()
      const settings = await getSettings()
      await requestReminderRescheduleImmediate(settings)
    } finally {
      setSyncing(false)
    }
  }, [bumpRefresh])

  const importSnapshot = useCallback(
    async (raw: unknown): Promise<UserSettings> => {
      setSyncing(true)
      try {
        const settings = await importAppSnapshot(raw)
        await syncAllDoseLogs()
        bumpRefresh()
        await requestReminderRescheduleImmediate(settings)
        void writeLocalBackup()
        return settings
      } finally {
        setSyncing(false)
      }
    },
    [bumpRefresh],
  )

  useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        await initializeAppStorage()
        await restoreLocalBackupIfEmpty()
        await ensureDemoMedicationIfEmpty()
        await syncAllDoseLogs()
        const settings = await getSettings()
        await requestReminderRescheduleImmediate(settings)
        if (!cancelled) {
          setReady(true)
          setRefreshKey((k) => k + 1)
        }
      } finally {
        if (!cancelled) setSyncing(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const onChange = (state: AppStateStatus) => {
      if (state === 'active' && ready) {
        void runSync()
      }
    }
    const sub = AppState.addEventListener('change', onChange)
    return () => sub.remove()
  }, [ready, runSync])

  const value = useMemo(
    () => ({ ready, syncing, bumpRefresh, refreshKey, importSnapshot }),
    [ready, syncing, bumpRefresh, refreshKey, importSnapshot],
  )

  if (!ready) return null

  return (
    <StorageContext.Provider value={value}>{children}</StorageContext.Provider>
  )
}

export function useStorage(): StorageContextValue {
  const ctx = useContext(StorageContext)
  if (!ctx) {
    throw new Error('useStorage wymaga StorageProvider')
  }
  return ctx
}
