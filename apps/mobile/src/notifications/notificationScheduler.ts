import {
  buildReminderGroups,
  isMedicationRemindersEnabled,
  PERSISTENT_REMINDER_MS,
  type UserSettings,
} from '@mediapp/core'
import type { DoseLog } from '@mediapp/core'
import * as Notifications from 'expo-notifications'

import { getAllDoseLogs } from '@/src/storage/repositories/doseLogRepository'
import { listMedications } from '@/src/storage/repositories/medicationRepository'
import { getSyncWindow } from '@/src/storage/services/syncDoseLogs'

import { cancelAllMediAppScheduledNotifications } from './cancelNotifications'
import { groupNotificationId, isMediAppNotificationId } from './notificationIds'
import { scheduleReminderAtTime } from './presentReminderNotification'
import {
  ensureNotificationPermission,
  ensureNotificationsSetup,
} from './setup'

export { cancelGroupNotification } from './cancelNotifications'

export async function rescheduleAllNotifications(
  settings: UserSettings,
): Promise<void> {
  await ensureNotificationsSetup()

  if (!settings.notificationsEnabled) {
    await cancelAllMediAppScheduledNotifications()
    return
  }

  const allowed = await ensureNotificationPermission()
  if (!allowed) return

  const now = new Date()
  const nowMs = now.getTime()
  const { start, end } = getSyncWindow(now)
  const snooze = settings.snoozeUntilByLogId ?? {}

  const [logs, medications] = await Promise.all([
    getAllDoseLogs(),
    listMedications(),
  ])
  const medById = new Map(medications.map((m) => [m.id, m]))

  const plannedInWindow = logs.filter((log) => {
    if (log.status !== 'planned') return false
    const t = new Date(log.scheduledAt).getTime()
    if (t < start.getTime() || t > end.getTime()) return false
    if (t <= nowMs) return false
    const med = medById.get(log.medicationId)
    if (med && !isMedicationRemindersEnabled(med)) return false
    const snoozeUntil = snooze[log.id]
    if (snoozeUntil && new Date(snoozeUntil).getTime() > nowMs) return false
    return true
  })

  const byTime = new Map<string, DoseLog[]>()
  for (const log of plannedInWindow) {
    const list = byTime.get(log.scheduledAt) ?? []
    list.push(log)
    byTime.set(log.scheduledAt, list)
  }

  const planned = [...byTime.entries()]
    .map(([scheduledAt, groupLogs]) => ({
      scheduledAt,
      groupLogs,
      triggerDate: new Date(scheduledAt),
    }))
    .filter((item) => item.triggerDate.getTime() > nowMs)
    .sort((a, b) => a.triggerDate.getTime() - b.triggerDate.getTime())
    .slice(0, 60)

  const keep = new Set<string>()
  for (const { scheduledAt, groupLogs, triggerDate } of planned) {
    const groups = buildReminderGroups(
      groupLogs,
      medications,
      new Date(triggerDate.getTime() + 60_000),
      {},
      true,
      0,
    )
    const group = groups[0]
    if (!group) continue
    const identifier = groupNotificationId(scheduledAt)
    try {
      await scheduleReminderAtTime(group, identifier, triggerDate)
      keep.add(identifier)
    } catch (err) {
      console.warn('Nie udało się zaplanować przypomnienia', identifier, err)
    }
  }

  const existing = await Notifications.getAllScheduledNotificationsAsync()
  await Promise.all(
    existing
      .filter(
        (notification) =>
          isMediAppNotificationId(notification.identifier) &&
          !keep.has(notification.identifier),
      )
      .map((notification) =>
        Notifications.cancelScheduledNotificationAsync(
          notification.identifier,
        ).catch(() => undefined),
      ),
  )
}
