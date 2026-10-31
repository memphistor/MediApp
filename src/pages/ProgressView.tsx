import { useMemo } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { DayRing } from '@/components/gamification/DayRing'
import { MedicationProgressPanel } from '@/components/gamification/MedicationProgressPanel'
import { PeriodAdherencePanel } from '@/components/gamification/PeriodAdherencePanel'
import { TimingStatsPanel } from '@/components/gamification/TimingStatsPanel'
import { BADGE_DEFINITIONS } from '@/lib/gamification/badges'
import { plantEmojiForStreak } from '@/lib/gamification/plantStage'
import { db, DEFAULT_GAMIFICATION } from '@/db/database'
import { pl } from '@/i18n/pl'
import { addDays, startOfLocalDay } from '@/lib/dates'

export function ProgressView() {
  const state = useLiveQuery(
    () => db.gamification.get('default'),
    [],
    DEFAULT_GAMIFICATION,
  )

  const gam = state ?? DEFAULT_GAMIFICATION
  const earnedIds = new Set(
    gam.badges.filter((b) => b.earnedAt).map((b) => b.id),
  )

  const progressLogs = useLiveQuery(async () => {
    const from = startOfLocalDay(addDays(new Date(), -364))
    return db.doseLogs
      .where('scheduledAt')
      .above(from.toISOString())
      .toArray()
  }, [])

  const medications = useLiveQuery(() => db.medications.toArray(), [])

  const medOptions = useMemo(
    () =>
      (medications ?? [])
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name, 'pl'))
        .map((m) => ({ id: m.id, name: m.name, icon: m.icon })),
    [medications],
  )

  const logs = progressLogs ?? []

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">{pl.progress.title}</h2>

      <p className="text-center text-4xl" aria-hidden>
        {plantEmojiForStreak(gam.currentStreak)}
      </p>

      <DayRing
        progress={gam.dayRingProgress}
        taken={gam.todayTaken}
        total={gam.todayTotal}
        label={pl.progress.dayRing}
        sublabel={pl.progress.todayCount
          .replace('{taken}', String(gam.todayTaken))
          .replace('{total}', String(gam.todayTotal))}
      />

      <PeriodAdherencePanel logs={logs} />

      <MedicationProgressPanel logs={logs} medications={medOptions} />

      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-4">
        <p className="font-semibold">{pl.progress.streak}</p>
        <p className="mt-1 text-3xl font-bold text-brand">
          {pl.progress.streakDays.replace('{n}', String(gam.currentStreak))}
        </p>
        <p className="mt-2 text-xs text-[var(--color-text-muted)]">
          {gam.shieldAvailable
            ? `${pl.progress.shieldActive} 🛡️`
            : pl.progress.shieldRecharge}
        </p>
      </div>

      <TimingStatsPanel logs={logs} />

      <div>
        <p className="font-semibold">{pl.progress.badges}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {BADGE_DEFINITIONS.map((def) => {
            const earned = earnedIds.has(def.id)
            const stored = gam.badges.find((b) => b.id === def.id)
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
                {stored?.label ?? def.label}
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
}
