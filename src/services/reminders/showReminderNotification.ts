import type { ReminderGroup } from '@/services/reminders/reminderGroups'
import { pl } from '@/i18n/pl'

export async function showReminderNotification(
  group: ReminderGroup,
  persistent: boolean,
): Promise<void> {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return
  }

  const reg = await navigator.serviceWorker.ready
  const actions =
    group.logIds.length > 1
      ? [
          { action: 'taken-all', title: pl.reminder.takeAll },
          { action: 'snooze', title: pl.reminder.snooze },
          { action: 'skip', title: pl.reminder.skip },
        ]
      : [
          { action: 'taken', title: pl.reminder.taken },
          { action: 'snooze', title: pl.reminder.snooze },
          { action: 'skip', title: pl.reminder.skip },
        ]

  const options = {
    body: group.body,
    tag: `mediapp-${group.groupKey}`,
    requireInteraction: persistent,
    data: { logIds: group.logIds, groupKey: group.groupKey },
    actions,
    icon: `${import.meta.env.BASE_URL}favicon.svg`,
  } as NotificationOptions

  await reg.showNotification(group.title, options)
}
