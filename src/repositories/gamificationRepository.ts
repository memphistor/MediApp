import { db, DEFAULT_GAMIFICATION } from '@/db/database'
import { computeGamification } from '@/lib/gamification/computeGamification'
import type { GamificationState } from '@/types/gamification'

export async function getGamificationState(): Promise<GamificationState> {
  const existing = await db.gamification.get('default')
  return existing ?? DEFAULT_GAMIFICATION
}

export async function saveGamificationState(
  state: GamificationState,
): Promise<void> {
  await db.gamification.put(state)
}

export async function recalculateAndSave(
  referenceDate = new Date(),
): Promise<GamificationState> {
  const logs = await db.doseLogs.toArray()
  const existing = await db.gamification.get('default')
  const next = computeGamification(logs, existing, referenceDate)
  await db.gamification.put(next)
  return next
}
