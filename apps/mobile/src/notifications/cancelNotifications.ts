import * as Notifications from 'expo-notifications'

import {
  groupNotificationId,
  isMediAppNotificationId,
} from './notificationIds'

export async function cancelGroupNotification(
  scheduledAt: string,
): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(
      groupNotificationId(scheduledAt),
    )
  } catch {
    // already cancelled
  }
}

export async function cancelAllMediAppScheduledNotifications(): Promise<void> {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync()
  await Promise.all(
    scheduled
      .filter((n) => isMediAppNotificationId(n.identifier))
      .map((n) =>
        Notifications.cancelScheduledNotificationAsync(n.identifier),
      ),
  )
}
