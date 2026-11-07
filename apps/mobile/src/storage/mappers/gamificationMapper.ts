import type { GamificationState } from '@mediapp/core'

export interface GamificationRow {
  id: string
  current_streak: number
  shield_available: number
  badges_json: string
  day_ring_progress: number
  month_rate: number
  taken_total: number
  today_taken: number
  today_total: number
}

export function gamificationToRow(state: GamificationState): GamificationRow {
  return {
    id: state.id,
    current_streak: state.currentStreak,
    shield_available: state.shieldAvailable ? 1 : 0,
    badges_json: JSON.stringify(state.badges),
    day_ring_progress: state.dayRingProgress,
    month_rate: state.monthRate,
    taken_total: state.takenTotal,
    today_taken: state.todayTaken,
    today_total: state.todayTotal,
  }
}

export function rowToGamification(row: GamificationRow): GamificationState {
  return {
    id: 'default',
    currentStreak: row.current_streak,
    shieldAvailable: row.shield_available === 1,
    badges: JSON.parse(row.badges_json) as GamificationState['badges'],
    dayRingProgress: row.day_ring_progress,
    monthRate: row.month_rate,
    takenTotal: row.taken_total,
    todayTaken: row.today_taken,
    todayTotal: row.today_total,
  }
}
