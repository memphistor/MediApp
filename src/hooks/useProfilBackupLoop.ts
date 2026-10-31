import { useEffect } from 'react'
import { getActiveProfilId } from '@/db/database'
import {
  scheduleProfilBackup,
  writeLocalProfilBackup,
} from '@/services/profilBackup'

/** Periodic local backup when a profil link is active (same browser, survives app updates). */
export function useProfilBackupLoop() {
  const profilId = getActiveProfilId()

  useEffect(() => {
    if (!profilId) return
    void writeLocalProfilBackup(profilId)
    scheduleProfilBackup()

    const interval = window.setInterval(() => {
      void writeLocalProfilBackup(profilId)
    }, 60_000)

    const onHide = () => {
      if (document.visibilityState === 'hidden') {
        void writeLocalProfilBackup(profilId)
      }
    }
    document.addEventListener('visibilitychange', onHide)

    return () => {
      window.clearInterval(interval)
      document.removeEventListener('visibilitychange', onHide)
    }
  }, [profilId])
}
