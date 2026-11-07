import type { UserSettings } from '@mediapp/core'

import { rescheduleAllNotifications } from './notificationScheduler'

let pendingSettings: UserSettings | null = null
let flushTimer: ReturnType<typeof setTimeout> | null = null

export async function requestReminderReschedule(
  settings: UserSettings,
): Promise<void> {
  pendingSettings = settings
  if (flushTimer) clearTimeout(flushTimer)
  flushTimer = setTimeout(() => {
    flushTimer = null
    const s = pendingSettings
    pendingSettings = null
    if (s) void rescheduleAllNotifications(s)
  }, 300)
}

export async function requestReminderRescheduleImmediate(
  settings: UserSettings,
): Promise<void> {
  if (flushTimer) {
    clearTimeout(flushTimer)
    flushTimer = null
  }
  pendingSettings = null
  await rescheduleAllNotifications(settings)
}
