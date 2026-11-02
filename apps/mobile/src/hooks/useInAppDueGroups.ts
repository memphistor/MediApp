import { useEffect, useState } from 'react'
import * as Notifications from 'expo-notifications'

import { useSettings } from '@/src/context/SettingsContext'
import { useStorage } from '@/src/context/StorageContext'
import { getInAppDueGroups } from '@/src/notifications/reminderEngine'
import type { ReminderGroup } from '@mediapp/core'

export function useInAppDueGroups(): ReminderGroup[] {
  const { settings } = useSettings()
  const { refreshKey } = useStorage()
  const [groups, setGroups] = useState<ReminderGroup[]>([])
  const [permissionGranted, setPermissionGranted] = useState(false)

  useEffect(() => {
    void Notifications.getPermissionsAsync().then(({ status }) => {
      setPermissionGranted(status === 'granted')
    })
  }, [refreshKey])

  const showInApp =
    !settings.notificationsEnabled || !permissionGranted

  useEffect(() => {
    if (!showInApp) {
      setGroups([])
      return
    }

    let cancelled = false
    const load = async () => {
      const result = await getInAppDueGroups(settings)
      if (!cancelled) setGroups(result)
    }
    void load()
    const id = setInterval(() => void load(), 30_000)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [settings, showInApp, refreshKey])

  if (!showInApp) return []
  return groups
}
