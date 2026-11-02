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
import { groupNotificationId } from './notificationIds'
import { scheduleReminderAtTime } from './presentReminderNotification'
import { ensureNotificationsSetup } from './setup'

export { cancelGroupNotification } from './cancelNotifications'

export async function rescheduleAllNotifications(
  settings: UserSettings,
): Promise<void> {
  await ensureNotificationsSetup()
  await cancelAllMediAppScheduledNotifications()

  if (!settings.notificationsEnabled) return

  const { status } = await Notifications.getPermissionsAsync()
  if (status !== 'granted') return

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

  for (const [scheduledAt, groupLogs] of byTime) {
    const groups = buildReminderGroups(
      groupLogs,
      medications,
      new Date(new Date(scheduledAt).getTime() + 1000),
      {},
      false,
      PERSISTENT_REMINDER_MS,
    )
    const group = groups[0]
    if (!group) continue
    const triggerDate = new Date(scheduledAt)
    if (triggerDate.getTime() <= nowMs) continue
    await scheduleReminderAtTime(
      group,
      groupNotificationId(scheduledAt),
      triggerDate,
    )
  }
}
