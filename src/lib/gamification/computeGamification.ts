import { toDateKey } from '@/lib/dates'
import { mergeBadges } from '@/lib/gamification/badges'
import {
  dayRingProgress,
  groupLogsByDateKey,
  scheduledDoses,
} from '@/lib/gamification/dayStats'
import { monthCompletionRate } from '@/lib/gamification/monthStats'
import { computeStreak } from '@/lib/gamification/streak'
import type { DoseLog } from '@/types/dose'
import type { GamificationState } from '@/types/gamification'

export function computeGamification(
  logs: DoseLog[],
  existing: GamificationState | undefined,
  referenceDate = new Date(),
): GamificationState {
  const planned = scheduledDoses(logs)
  const logsByDay = groupLogsByDateKey(planned)
  const todayKey = toDateKey(referenceDate)
  const todayLogs = logsByDay.get(todayKey) ?? []

  const ring = dayRingProgress(todayLogs)
  const takenTotal = planned.filter((l) => l.status === 'taken').length

  const { currentStreak, shieldAvailable } = computeStreak(
    logsByDay,
    referenceDate,
    true,
  )

  const year = referenceDate.getFullYear()
  const month = referenceDate.getMonth()
  const monthRate = monthCompletionRate(planned, year, month)

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
