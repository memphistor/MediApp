import { describe, expect, it } from 'vitest'

import {
  groupNotificationId,
  isMediAppNotificationId,
  scheduledAtFromNotificationId,
} from './notificationIds'

describe('notificationIds', () => {
  it('builds stable group id', () => {
    const at = '2026-03-10T07:00:00.000Z'
    expect(groupNotificationId(at)).toBe(`mediapp-group:${at}`)
    expect(isMediAppNotificationId(groupNotificationId(at))).toBe(true)
    expect(scheduledAtFromNotificationId(groupNotificationId(at))).toBe(at)
  })
})
