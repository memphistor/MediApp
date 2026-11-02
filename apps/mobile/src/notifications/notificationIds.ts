export const NOTIFICATION_ID_PREFIX = 'mediapp-group:'

export function groupNotificationId(scheduledAt: string): string {
  return `${NOTIFICATION_ID_PREFIX}${scheduledAt}`
}

export function isMediAppNotificationId(id: string): boolean {
  return id.startsWith(NOTIFICATION_ID_PREFIX)
}

export function scheduledAtFromNotificationId(id: string): string | undefined {
  if (!isMediAppNotificationId(id)) return undefined
  return id.slice(NOTIFICATION_ID_PREFIX.length)
}
