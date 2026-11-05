import * as Notifications from 'expo-notifications'
import { Platform } from 'react-native'

import type { ReminderGroup } from '@mediapp/core'

import {
  ACTION_SKIP,
  ACTION_SNOOZE,
  ACTION_TAKEN,
  ACTION_TAKEN_ALL,
  REMINDER_CATEGORY_GROUP,
  REMINDER_CATEGORY_SINGLE,
  REMINDER_CHANNEL_ID,
} from './setup'

function reminderContent(
  group: ReminderGroup,
  persistent: boolean,
): Notifications.NotificationContentInput {
  const isGroup = group.logIds.length > 1
  return {
    title: group.title,
    body: group.body,
    sound: true,
    data: {
      logIds: group.logIds,
      groupKey: group.groupKey,
    },
    categoryIdentifier: isGroup
      ? REMINDER_CATEGORY_GROUP
      : REMINDER_CATEGORY_SINGLE,
    ...(Platform.OS === 'android' ? { channelId: REMINDER_CHANNEL_ID } : {}),
    ...(persistent ? { sticky: true } : {}),
  }
}

export async function presentReminderNotification(
  group: ReminderGroup,
  persistent: boolean,
): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: reminderContent(group, persistent),
    trigger: null,
  })
}

export async function scheduleReminderAtTime(
  group: ReminderGroup,
  identifier: string,
  date: Date,
): Promise<void> {
  const seconds = Math.max(1, Math.round((date.getTime() - Date.now()) / 1000))
  await Notifications.scheduleNotificationAsync({
    identifier,
    content: reminderContent(group, false),
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds,
      repeats: false,
      ...(Platform.OS === 'android' ? { channelId: REMINDER_CHANNEL_ID } : {}),
    },
  })
}

export function reminderActionFromResponse(
  actionIdentifier: string | undefined,
): string {
  const action = actionIdentifier ?? 'open'
  if (
    action === ACTION_TAKEN ||
    action === ACTION_SNOOZE ||
    action === ACTION_SKIP ||
    action === ACTION_TAKEN_ALL ||
    action === 'open'
  ) {
    return action
  }
  return 'open'
}
