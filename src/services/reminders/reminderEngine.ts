import { db } from '@/db/database'
import {
  buildReminderGroups,
  PERSISTENT_REMINDER_MS,
} from '@/services/reminders/reminderGroups'
import {
  applyReminderAction,
  markLogsNotified,
  type ReminderAction,
} from '@/services/reminders/reminderActions'
import { showReminderNotification } from '@/services/reminders/showReminderNotification'
import type { UserSettings } from '@/types/settings'

let ticking = false

export async function runReminderTick(
  settings: UserSettings,
): Promise<UserSettings> {
  if (ticking) return settings
  if (!settings.notificationsEnabled) return settings
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return settings
  }

  ticking = true
  try {
    const [logs, medications] = await Promise.all([
      db.doseLogs.toArray(),
      db.medications.toArray(),
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
      await showReminderNotification(group, settings.persistentAlarmEnabled)
      await markLogsNotified(group.logIds)
    }
  } finally {
    ticking = false
  }
  return settings
}

export async function handleReminderActionMessage(
  action: string,
  logIds: string[],
  settings: UserSettings,
  onSettingsChange: (s: UserSettings) => void,
): Promise<void> {
  if (!logIds.length || action === 'open') return
  const mapped = (action === 'taken-all'
    ? 'taken-all'
    : action) as ReminderAction
  const next = await applyReminderAction(mapped, logIds, settings)
  onSettingsChange(next)
}

export async function getInAppDueGroups(settings: UserSettings) {
  const [logs, medications] = await Promise.all([
    db.doseLogs.toArray(),
    db.medications.toArray(),
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
