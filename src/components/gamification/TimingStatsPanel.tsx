import { useMemo } from 'react'
import { CollapsibleSection } from '@/components/layout/CollapsibleSection'
import { addDays, toDateKey } from '@/lib/dates'
import {
  lastDayTimingRows,
  onTimeRateAmongTaken,
  takenAdherenceRate,
  timingCountsForRange,
  type DoseTimingCounts,
} from '@/lib/gamification/doseTiming'
import type { DoseLog } from '@/types/dose'
import { pl } from '@/i18n/pl'

type TimingStatsPanelProps = {
  logs: DoseLog[]
  referenceDate?: Date
  embedded?: boolean
}

function pct(n: number): number {
  return Math.round(n * 100)
}

function StatBar({
  label,
  value,
  max,
  tone = 'brand',
}: {
  label: string
  value: number
  max: number
  tone?: 'brand' | 'amber' | 'muted'
}) {
  const width = max > 0 ? Math.min(100, (value / max) * 100) : 0
  const barClass =
    tone === 'amber'
      ? 'bg-amber-500'
      : tone === 'muted'
        ? 'bg-[var(--color-text-muted)]'
        : 'bg-brand'
  return (
    <div>
      <div className="flex justify-between text-xs">
        <span>{label}</span>
        <span className="text-[var(--color-text-muted)]">{value}</span>
      </div>
      <div className="mt-1 h-2 overflow-hidden rounded-full bg-[var(--color-border)]">
        <div className={`h-full ${barClass}`} style={{ width: `${width}%` }} />
      </div>
    </div>
  )
}

function SummaryLine({
  title,
  counts,
}: {
  title: string
  counts: DoseTimingCounts
}) {
  const onTimePct = pct(onTimeRateAmongTaken(counts))
  const adherencePct = pct(takenAdherenceRate(counts))
  const taken =
    counts.onTime + counts.early + counts.late + counts.unknown

  return (
    <div className="rounded-xl border border-[var(--color-border)] px-3 py-2">
      <p className="text-sm font-medium">{title}</p>
      {counts.totalScheduled === 0 ? (
        <p className="mt-1 text-xs text-[var(--color-text-muted)]">
          {pl.progress.timing.noData}
        </p>
      ) : (
        <p className="mt-1 text-xs text-[var(--color-text-muted)]">
          {pl.progress.timing.summaryLine
            .replace('{onTime}', String(counts.onTime))
            .replace('{taken}', String(taken))
            .replace('{onTimePct}', String(onTimePct))
            .replace('{adherencePct}', String(adherencePct))}
        </p>
      )}
    </div>
  )
}

export function TimingStatsPanel({
  logs,
  referenceDate = new Date(),
  embedded = false,
}: TimingStatsPanelProps) {
  const dateKey = toDateKey(referenceDate)

  const { todayCounts, weekCounts, monthCounts, dayRows } = useMemo(() => {
    const weekStart = addDays(referenceDate, -6)
    const monthStart = new Date(
      referenceDate.getFullYear(),
      referenceDate.getMonth(),
      1,
    )
    return {
      todayCounts: timingCountsForRange(logs, referenceDate, referenceDate),
      weekCounts: timingCountsForRange(logs, weekStart, referenceDate),
      monthCounts: timingCountsForRange(logs, monthStart, referenceDate),
      dayRows: lastDayTimingRows(logs, referenceDate, 7),
    }
  }, [logs, dateKey, referenceDate])

  const breakdown = todayCounts
  const breakdownMax = Math.max(
    breakdown.onTime,
    breakdown.early,
    breakdown.late,
    breakdown.missed,
    breakdown.unknown,
    1,
  )

  const shellClass = embedded
    ? 'space-y-4 p-4 pt-3'
    : 'space-y-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-4'

  return (
    <section className={shellClass}>
      <div>
        <h3 className="font-semibold">{pl.progress.timing.title}</h3>
        <p className="mt-1 text-xs leading-relaxed text-[var(--color-text-muted)]">
          {pl.progress.timing.hint}
        </p>
      </div>

      <SummaryLine title={pl.progress.timing.today} counts={todayCounts} />
      <SummaryLine title={pl.progress.timing.last7Days} counts={weekCounts} />
      <SummaryLine title={pl.progress.timing.thisMonth} counts={monthCounts} />

      {breakdown.totalScheduled > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">{pl.progress.timing.todayBreakdown}</p>
          <StatBar
            label={pl.progress.timing.onTime}
            value={breakdown.onTime}
            max={breakdownMax}
          />
          <StatBar
            label={pl.progress.timing.early}
            value={breakdown.early}
            max={breakdownMax}
            tone="amber"
          />
          <StatBar
            label={pl.progress.timing.late}
            value={breakdown.late}
            max={breakdownMax}
            tone="amber"
          />
          <StatBar
            label={pl.progress.timing.unknown}
            value={breakdown.unknown}
            max={breakdownMax}
            tone="muted"
          />
          <StatBar
            label={pl.progress.timing.missed}
            value={breakdown.missed}
            max={breakdownMax}
            tone="amber"
          />
        </div>
      )}

      <CollapsibleSection title={pl.progress.timing.dailyTitle} defaultOpen={false}>
        <ul className="space-y-1 px-4 py-3">
          {dayRows.map(({ dateKey, counts }) => {
            const label = new Date(dateKey + 'T12:00:00').toLocaleDateString(
              'pl-PL',
              { weekday: 'short', day: 'numeric', month: 'short' },
            )
            let status: string = pl.progress.timing.dayNoPlan
            if (counts.totalScheduled > 0) {
              if (counts.missed > 0) {
                status = pl.progress.timing.dayMissed
              } else if (
                counts.early + counts.late + counts.unknown >
                0
              ) {
                status = pl.progress.timing.dayOffTime
                  .replace('{onTime}', String(counts.onTime))
                  .replace(
                    '{taken}',
                    String(
                      counts.onTime +
                        counts.early +
                        counts.late +
                        counts.unknown,
                    ),
                  )
              } else if (counts.onTime > 0) {
                status = pl.progress.timing.dayAllOnTime
              } else if (counts.planned === counts.totalScheduled) {
                status = pl.progress.timing.dayPending
              }
            }
            return (
              <li
                key={dateKey}
                className="flex items-center justify-between gap-2 text-xs"
              >
                <span className="capitalize text-[var(--color-text-muted)]">
                  {label}
                </span>
                <span className="text-right font-medium">{status}</span>
              </li>
            )
          })}
        </ul>
      </CollapsibleSection>
    </section>
  )
}
