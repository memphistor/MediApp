import { computeGamification } from '@mediapp/core'
import type { GamificationState } from '@mediapp/core'

import { DEFAULT_GAMIFICATION, getDb } from '../database'
import {
  rowToDoseLog,
  type DoseLogRow,
} from '../mappers/doseLogMapper'
import {
  gamificationToRow,
  rowToGamification,
  type GamificationRow,
} from '../mappers/gamificationMapper'

export async function getGamificationState(): Promise<GamificationState> {
  const row = await getDb().getFirstAsync<GamificationRow>(
    'SELECT * FROM gamification WHERE id = ?',
    ['default'],
  )
  return row ? rowToGamification(row) : DEFAULT_GAMIFICATION
}

export async function saveGamificationState(
  state: GamificationState,
): Promise<void> {
  const row = gamificationToRow(state)
  await getDb().runAsync(
    `INSERT OR REPLACE INTO gamification (
      id, current_streak, shield_available, badges_json,
      day_ring_progress, month_rate, taken_total, today_taken, today_total
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      row.id,
      row.current_streak,
      row.shield_available,
      row.badges_json,
      row.day_ring_progress,
      row.month_rate,
      row.taken_total,
      row.today_taken,
      row.today_total,
    ],
  )
}

async function loadAllDoseLogs() {
  const rows = await getDb().getAllAsync<DoseLogRow>(
    'SELECT * FROM dose_logs ORDER BY scheduled_at',
  )
  return rows.map(rowToDoseLog)
}

export async function recalculateAndSave(
  referenceDate = new Date(),
): Promise<GamificationState> {
  const logs = await loadAllDoseLogs()
  const existing = await getGamificationState()
  const next = computeGamification(logs, existing, referenceDate)
  await saveGamificationState(next)
  return next
}
