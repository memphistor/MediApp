import { toDateKey } from '@/lib/dates'
import { mergeBadges } from '@/lib/gamification/badges'
import { dayRingProgress, groupLogsByDateKey } from '@/lib/gamification/dayStats'
import { monthCompletionRate } from '@/lib/gamification/monthStats'
import { computeStreak } from '@/lib/gamification/streak'
import type { DoseLog } from '@/types/dose'
import type { GamificationState } from '@/types/gamification'

export function computeGamification(
  logs: DoseLog[],
  existing: GamificationState | undefined,
  referenceDate = new Date(),
): GamificationState {
  const logsByDay = groupLogsByDateKey(logs)
  const todayKey = toDateKey(referenceDate)
  const todayLogs = logsByDay.get(todayKey) ?? []

  const ring = dayRingProgress(todayLogs)
  const takenTotal = logs.filter((l) => l.status === 'taken').length

  const initialShield = existing?.shieldAvailable ?? true
  const { currentStreak, shieldAvailable } = computeStreak(
    logsByDay,
    referenceDate,
    initialShield,
  )

  const year = referenceDate.getFullYear()
  const month = referenceDate.getMonth()
  const monthRate = monthCompletionRate(logs, year, month)

  const earnedAt = referenceDate.toISOString()
  const badges = mergeBadges(existing?.badges ?? [], {
    streak: currentStreak,
    takenTotal,
  }, earnedAt)

  return {
    id: 'default',
    currentStreak,
    shieldAvailable,
    badges,
    dayRingProgress: ring.progress,
    monthRate,
    takenTotal,
    todayTaken: ring.taken,
    todayTotal: ring.total,
  }
}
