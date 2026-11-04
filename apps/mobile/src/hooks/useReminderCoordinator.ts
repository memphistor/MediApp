import * as Haptics from 'expo-haptics'
import * as Notifications from 'expo-notifications'
import { router } from 'expo-router'
import { useEffect, useRef } from 'react'
import { AppState, type AppStateStatus } from 'react-native'

import { useSettings } from '@/src/context/SettingsContext'
import { useStorage } from '@/src/context/StorageContext'
import { reminderActionFromResponse } from '@/src/notifications/presentReminderNotification'
import {
  applyReminderAction,
  type ReminderAction,
} from '@/src/notifications/reminderActions'
import { requestReminderRescheduleImmediate } from '@/src/notifications/reminderReschedule'
import { runReminderTick } from '@/src/notifications/reminderEngine'
import { ensureNotificationsSetup } from '@/src/notifications/setup'

function parseLogIds(data: unknown): string[] {
  if (!data || typeof data !== 'object') return []
  const logIds = (data as { logIds?: unknown }).logIds
  if (!Array.isArray(logIds)) return []
  return logIds.filter((id): id is string => typeof id === 'string')
}

function focusDose(logIds: string[]): void {
  const id = logIds[0]
  if (!id) return
  router.push({ pathname: '/', params: { focusLog: id } })
}

export function useReminderCoordinator(): void {
  const { settings, ready: settingsReady, replaceSettings } = useSettings()
  const { ready: storageReady, bumpRefresh } = useStorage()
  const settingsRef = useRef(settings)
  settingsRef.current = settings

  const handleResponse = async (
    response: Notifications.NotificationResponse,
  ) => {
    const data = response.notification.request.content.data
    const logIds = parseLogIds(data)
    if (!logIds.length) return

    const action = reminderActionFromResponse(
      response.actionIdentifier,
    ) as ReminderAction

    if (action === 'open') {
      focusDose(logIds)
      return
    }

    const next = await applyReminderAction(
      action,
      logIds,
      settingsRef.current,
    )
    replaceSettings(next)
    await requestReminderRescheduleImmediate(next)
    bumpRefresh()

    if (action === 'taken' || action === 'taken-all') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    }
  }

  useEffect(() => {
    if (!settingsReady || !storageReady) return

    void ensureNotificationsSetup().then(() =>
      requestReminderRescheduleImmediate(settingsRef.current),
    )
  }, [settingsReady, storageReady])

  useEffect(() => {
    if (!settingsReady || !storageReady) return

    void Notifications.getLastNotificationResponseAsync().then((response) => {
      if (response) void handleResponse(response)
    })

    const sub = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        void handleResponse(response)
      },
    )
    return () => sub.remove()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- handleResponse uses refs
  }, [settingsReady, storageReady, replaceSettings, bumpRefresh])

  useEffect(() => {
    if (!settingsReady || !storageReady) return
    if (!settings.notificationsEnabled) return

    const tick = () => {
      void runReminderTick(settingsRef.current)
    }
    tick()
    const id = setInterval(tick, 30_000)
    const onChange = (state: AppStateStatus) => {
      if (state === 'active') tick()
    }
    const sub = AppState.addEventListener('change', onChange)
    return () => {
      clearInterval(id)
      sub.remove()
    }
  }, [
    settingsReady,
    storageReady,
    settings.notificationsEnabled,
    settings.persistentAlarmEnabled,
    settings.snoozeMinutesDefault,
    settings.snoozeUntilByLogId,
  ])
}
