import { BADGE_DEFINITIONS } from '@/lib/gamification/badges'
import type { GamificationState } from '@/types/gamification'
import { pl } from '@/i18n/pl'

type ProgressBadgesProps = {
  gam: GamificationState
}

export function ProgressBadges({ gam }: ProgressBadgesProps) {
  const earnedIds = new Set(
    gam.badges.filter((b) => b.earnedAt).map((b) => b.id),
  )

  return (
    <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-4">
      <p className="font-semibold">{pl.progress.badges}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {BADGE_DEFINITIONS.map((def) => {
          const earned = earnedIds.has(def.id)
          return (
            <span
              key={def.id}
              className={`rounded-full px-3 py-1 text-sm font-medium ${
                earned
                  ? 'bg-brand/15 text-brand'
                  : 'bg-[var(--color-border)] text-[var(--color-text-muted)]'
              }`}
              title={earned ? undefined : pl.progress.badgeLocked}
            >
              {def.label}
            </span>
          )
        })}
      </div>
    </section>
  )
}
