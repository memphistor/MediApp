import * as Notifications from 'expo-notifications'
import { Platform } from 'react-native'

import { pl } from '@/src/i18n/pl'

export const REMINDER_CHANNEL_ID = 'reminders'

export const REMINDER_CATEGORY_SINGLE = 'REMINDER_SINGLE'
export const REMINDER_CATEGORY_GROUP = 'REMINDER_GROUP'

export const ACTION_TAKEN = 'taken'
export const ACTION_SNOOZE = 'snooze'
export const ACTION_SKIP = 'skip'
export const ACTION_TAKEN_ALL = 'taken-all'

let setupDone = false

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
})

function alertsAllowed(
  response: Notifications.NotificationPermissionsStatus,
): boolean {
  if (!response.granted && response.status !== 'granted') return false
  if (Platform.OS !== 'ios') return true
  const ios = response.ios
  if (!ios) return true
  if (ios.status === Notifications.IosAuthorizationStatus.PROVISIONAL) return false
  return ios.allowsAlert !== false
}

export async function ensureNotificationPermission(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync()
  if (alertsAllowed(current)) return true
  const next = await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: true,
      allowSound: true,
    },
  })
  return alertsAllowed(next)
}

export async function ensureNotificationsSetup(): Promise<void> {
  if (setupDone) return

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(REMINDER_CHANNEL_ID, {
      name: 'Przypomnienia',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#0f766e',
    })
  }

  await Notifications.setNotificationCategoryAsync(REMINDER_CATEGORY_SINGLE, [
    {
      identifier: ACTION_TAKEN,
      buttonTitle: pl.reminder.taken,
      options: { opensAppToForeground: true },
    },
    {
      identifier: ACTION_SNOOZE,
      buttonTitle: pl.reminder.snooze,
      options: { opensAppToForeground: false },
    },
    {
      identifier: ACTION_SKIP,
      buttonTitle: pl.reminder.skip,
      options: { opensAppToForeground: false },
    },
  ])

  await Notifications.setNotificationCategoryAsync(REMINDER_CATEGORY_GROUP, [
    {
      identifier: ACTION_TAKEN_ALL,
      buttonTitle: pl.reminder.takeAll,
      options: { opensAppToForeground: true },
    },
    {
      identifier: ACTION_SNOOZE,
      buttonTitle: pl.reminder.snooze,
      options: { opensAppToForeground: false },
    },
    {
      identifier: ACTION_SKIP,
      buttonTitle: pl.reminder.skip,
      options: { opensAppToForeground: false },
    },
  ])

  setupDone = true
}
