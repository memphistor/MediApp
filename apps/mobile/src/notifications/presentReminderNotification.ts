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

export async function presentReminderNotification(
  group: ReminderGroup,
  persistent: boolean,
): Promise<void> {
  const isGroup = group.logIds.length > 1
  const categoryIdentifier = isGroup
    ? REMINDER_CATEGORY_GROUP
    : REMINDER_CATEGORY_SINGLE

  await Notifications.scheduleNotificationAsync({
    content: {
      title: group.title,
      body: group.body,
      data: {
        logIds: group.logIds,
        groupKey: group.groupKey,
      },
      categoryIdentifier,
      ...(Platform.OS === 'android'
        ? { channelId: REMINDER_CHANNEL_ID }
        : {}),
      ...(persistent ? { sticky: true } : {}),
    },
    trigger: null,
  })
}

export async function scheduleReminderAtTime(
  group: ReminderGroup,
  identifier: string,
  date: Date,
): Promise<void> {
  const isGroup = group.logIds.length > 1
  const categoryIdentifier = isGroup
    ? REMINDER_CATEGORY_GROUP
    : REMINDER_CATEGORY_SINGLE

  await Notifications.scheduleNotificationAsync({
    identifier,
    content: {
      title: group.title,
      body: group.body,
      data: {
        logIds: group.logIds,
        groupKey: group.groupKey,
      },
      categoryIdentifier,
      ...(Platform.OS === 'android'
        ? { channelId: REMINDER_CHANNEL_ID }
        : {}),
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date,
      channelId: REMINDER_CHANNEL_ID,
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
