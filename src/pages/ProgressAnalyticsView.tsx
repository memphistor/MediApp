import { Link } from 'react-router-dom'
import { useMemo } from 'react'
import { MedicationProgressPanel } from '@/components/gamification/MedicationProgressPanel'
import { PeriodAdherencePanel } from '@/components/gamification/PeriodAdherencePanel'
import { TimingStatsPanel } from '@/components/gamification/TimingStatsPanel'
import { useProgressLogs } from '@/hooks/useProgressLogs'
import { appPath } from '@/lib/profil/profilNavigation'
import { db } from '@/db/database'
import { useLiveQuery } from 'dexie-react-hooks'
import { pl } from '@/i18n/pl'

export function ProgressAnalyticsView() {
  const logs = useProgressLogs() ?? []
  const medications = useLiveQuery(() => db.medications.toArray(), [])

  const medOptions = useMemo(
    () =>
      (medications ?? [])
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name, 'pl'))
        .map((m) => ({
          id: m.id,
          name: m.name,
          icon: m.icon,
          kind: m.kind,
          scheduleType: m.schedule.type,
        })),
    [medications],
  )

  return (
    <div className="space-y-6">
      <Link
        to={appPath('/progress')}
        className="inline-block text-sm font-medium text-brand"
      >
        {pl.progress.analyticsBack}
      </Link>
      <div>
        <h2 className="text-xl font-semibold">{pl.progress.analyticsTitle}</h2>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          {pl.progress.analyticsIntro}
        </p>
      </div>

      <PeriodAdherencePanel logs={logs} />

      <div className="overflow-hidden rounded-2xl border border-brand/25 bg-brand/[0.05]">
        <p className="border-b border-brand/15 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-brand">
          {pl.progress.perMed.kicker}
        </p>
        <MedicationProgressPanel
          logs={logs}
          medications={medOptions}
          embedded
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)]">
        <p className="border-b border-[var(--color-border)] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
          {pl.progress.timing.scopeAll}
        </p>
        <TimingStatsPanel logs={logs} embedded />
      </div>
    </div>
  )
}
