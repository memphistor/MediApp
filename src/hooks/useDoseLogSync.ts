import { useEffect, useState } from 'react'
import { syncAllDoseLogs } from '@/services/syncDoseLogs'

export function useDoseLogSync(): { syncing: boolean; ready: boolean } {
  const [syncing, setSyncing] = useState(true)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    void (async () => {
      setSyncing(true)
      try {
        await syncAllDoseLogs()
      } finally {
        if (!cancelled) {
          setSyncing(false)
          setReady(true)
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return { syncing, ready }
}
