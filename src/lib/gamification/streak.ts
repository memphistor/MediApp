import { addDays, toDateKey } from '@/lib/dates'
import { isDayNeutral, isFullDay } from '@/lib/gamification/dayStats'
import type { DoseLog } from '@/types/dose'

export const SHIELD_RECHARGE_DAYS = 7
const MAX_STREAK_LOOKBACK = 400

export interface StreakResult {
  currentStreak: number
  shieldAvailable: boolean
}

export function computeStreak(
  logsByDay: Map<string, DoseLog[]>,
  today: Date,
  initialShieldAvailable: boolean,
): StreakResult {
  let streak = 0
  let shield = initialShieldAvailable
  let shieldUsed = false

  for (let i = 1; i <= MAX_STREAK_LOOKBACK; i++) {
    const day = addDays(today, -i)
    const key = toDateKey(day)
    const dayLogs = logsByDay.get(key) ?? []

    if (isDayNeutral(dayLogs)) continue

    if (isFullDay(dayLogs)) {
      streak++
      continue
    }

    if (shield) {
      shield = false
      shieldUsed = true
      continue
    }
    break
  }

  let consecutiveFull = 0
  for (let i = 1; i <= MAX_STREAK_LOOKBACK; i++) {
    const day = addDays(today, -i)
    const key = toDateKey(day)
    const dayLogs = logsByDay.get(key) ?? []
    if (isDayNeutral(dayLogs)) continue
    if (isFullDay(dayLogs)) {
      consecutiveFull++
    } else {
      break
    }
  }

  const shieldAvailable =
    consecutiveFull >= SHIELD_RECHARGE_DAYS ||
    (initialShieldAvailable && !shieldUsed)

  return { currentStreak: streak, shieldAvailable }
}
