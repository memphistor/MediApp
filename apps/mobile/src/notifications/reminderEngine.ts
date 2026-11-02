import {
  buildReminderGroups,
  PERSISTENT_REMINDER_MS,
  type UserSettings,
} from '@mediapp/core'
import * as Notifications from 'expo-notifications'

import { getAllDoseLogs } from '@/src/storage/repositories/doseLogRepository'
import { listMedications } from '@/src/storage/repositories/medicationRepository'

import { presentReminderNotification } from './presentReminderNotification'
import { markLogsNotified } from './reminderActions'

let ticking = false

export async function runReminderTick(
  settings: UserSettings,
): Promise<UserSettings> {
  if (ticking) return settings
  if (!settings.notificationsEnabled) return settings

  const { status } = await Notifications.getPermissionsAsync()
  if (status !== 'granted') return settings

  ticking = true
  try {
    const [logs, medications] = await Promise.all([
      getAllDoseLogs(),
      listMedications(),
    ])
    const groups = buildReminderGroups(
      logs,
      medications,
      new Date(),
      settings.snoozeUntilByLogId ?? {},
      settings.persistentAlarmEnabled,
      PERSISTENT_REMINDER_MS,
    )

    for (const group of groups) {
      await presentReminderNotification(
        group,
        settings.persistentAlarmEnabled,
      )
      await markLogsNotified(group.logIds)
    }
  } finally {
    ticking = false
  }
  return settings
}

export async function getInAppDueGroups(settings: UserSettings) {
  const [logs, medications] = await Promise.all([
    getAllDoseLogs(),
    listMedications(),
  ])
  return buildReminderGroups(
    logs,
    medications,
    new Date(),
    settings.snoozeUntilByLogId ?? {},
    false,
    PERSISTENT_REMINDER_MS,
  )
}
