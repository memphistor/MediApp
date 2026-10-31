import { Link } from 'react-router-dom'
import { useMemo } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { ProgressBadges } from '@/components/gamification/ProgressBadges'
import { WeekProgressCard } from '@/components/gamification/WeekProgressCard'
import { plantEmojiForStreak } from '@/lib/gamification/plantStage'
import {
  takenAdherenceRate,
  timingCountsForRange,
} from '@/lib/gamification/doseTiming'
import { periodBounds } from '@/lib/gamification/progressPeriods'
import { useProgressLogs } from '@/hooks/useProgressLogs'
import { appPath } from '@/lib/profil/profilNavigation'
import { db, DEFAULT_GAMIFICATION } from '@/db/database'
import { pl } from '@/i18n/pl'

function pct(rate: number): number {
  return Math.round(rate * 100)
}

export function ProgressView() {
  const state = useLiveQuery(
    () => db.gamification.get('default'),
    [],
    DEFAULT_GAMIFICATION,
  )

  const gam = state ?? DEFAULT_GAMIFICATION
  const logs = useProgressLogs() ?? []

  const monthSummary = useMemo(() => {
    const { from, to } = periodBounds('month')
    const counts = timingCountsForRange(logs, from, to)
    const taken =
      counts.onTime + counts.early + counts.late + counts.unknown
    return {
      taken,
      due: counts.totalScheduled,
      pct: pct(takenAdherenceRate(counts)),
    }
  }, [logs])

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">{pl.progress.title}</h2>
          <p className="mt-1 text-2xl" aria-hidden>
            {plantEmojiForStreak(gam.currentStreak)}
          </p>
        </div>
      </div>

      <ProgressBadges gam={gam} />

      <WeekProgressCard logs={logs} />

      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-4">
        <p className="font-semibold">{pl.progress.streak}</p>
        <p className="mt-1 text-lg font-semibold text-brand">
          {pl.progress.streakDays.replace('{n}', String(gam.currentStreak))}
        </p>
        <p className="mt-2 text-xs text-[var(--color-text-muted)]">
          {gam.shieldAvailable
            ? pl.progress.shieldActive
            : pl.progress.shieldRecharge}
        </p>
      </div>

      <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-4">
        <p className="font-semibold">{pl.progress.overviewTitle}</p>
        {monthSummary.due > 0 ? (
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            {pl.progress.overviewMonth
              .replace('{pct}', String(monthSummary.pct))
              .replace('{taken}', String(monthSummary.taken))
              .replace('{due}', String(monthSummary.due))}
          </p>
        ) : (
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            {pl.progress.overviewEmpty}
          </p>
        )}
        <Link
          to={appPath('/progress/analytics')}
          className="mt-4 flex min-h-11 items-center justify-center rounded-xl bg-brand px-4 text-sm font-semibold text-white"
        >
          {pl.progress.analyticsCta}
        </Link>
        <p className="mt-2 text-center text-xs text-[var(--color-text-muted)]">
          {pl.progress.analyticsHint}
        </p>
      </section>
    </div>
  )
}
