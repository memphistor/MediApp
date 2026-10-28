import { db } from '@/db/database'
import { updateDoseStatus } from '@/repositories/doseLogRepository'
import type { UserSettings } from '@/types/settings'

export type ReminderAction = 'taken' | 'skip' | 'snooze' | 'taken-all' | 'open'

export async function applyReminderAction(
  action: ReminderAction,
  logIds: string[],
  settings: UserSettings,
): Promise<UserSettings> {
  const now = new Date().toISOString()

  if (action === 'taken' || action === 'taken-all') {
    for (const id of logIds) {
      await updateDoseStatus(id, 'taken', { takenAt: now })
    }
    return settings
  }

  if (action === 'skip') {
    for (const id of logIds) {
      await updateDoseStatus(id, 'skipped')
    }
    return settings
  }

  if (action === 'snooze') {
    const minutes = settings.snoozeMinutesDefault || 10
    const until = new Date(Date.now() + minutes * 60_000).toISOString()
    const snoozeUntilByLogId = { ...settings.snoozeUntilByLogId }
    for (const id of logIds) {
      snoozeUntilByLogId[id] = until
    }
    const next = { ...settings, snoozeUntilByLogId }
    await db.settings.put(next)
    return next
  }

  return settings
}

export async function markLogsNotified(logIds: string[]): Promise<void> {
  const now = new Date().toISOString()
  for (const id of logIds) {
    const log = await db.doseLogs.get(id)
    if (log && log.status === 'planned') {
      await db.doseLogs.put({ ...log, lastNotifiedAt: now })
    }
  }
}
