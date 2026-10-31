import type { Badge } from '@/types/gamification'

export const BADGE_DEFINITIONS = [
  { id: 'streak_7', label: 'Tydzień pełnego planu' },
  { id: 'streak_30', label: 'Miesiąc pełnego planu' },
  { id: 'taken_100', label: '100 przyjętych dawek' },
] as const

export interface BadgeQualification {
  streak: number
  takenTotal: number
}

export function mergeBadges(
  existing: Badge[],
  qual: BadgeQualification,
  earnedAt: string,
): Badge[] {
  const byId = new Map(existing.map((b) => [b.id, b]))
  const toAward: string[] = []
  if (qual.streak >= 7) toAward.push('streak_7')
  if (qual.streak >= 30) toAward.push('streak_30')
  if (qual.takenTotal >= 100) toAward.push('taken_100')

  for (const id of toAward) {
    if (!byId.has(id)) {
      const def = BADGE_DEFINITIONS.find((d) => d.id === id)
      if (def) {
        byId.set(id, { id, label: def.label, earnedAt })
      }
    }
  }

  return BADGE_DEFINITIONS.map((d) => byId.get(d.id) ?? { id: d.id, label: d.label })
}
