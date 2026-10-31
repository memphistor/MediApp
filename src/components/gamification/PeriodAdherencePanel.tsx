import { useState } from 'react'
import {
  takenAdherenceRate,
  timingCountsForRange,
  type DoseTimingCounts,
} from '@/lib/gamification/doseTiming'
import {
  PROGRESS_PERIODS,
  type ProgressPeriod,
  periodBounds,
} from '@/lib/gamification/progressPeriods'
import type { DoseLog } from '@/types/dose'
import { pl } from '@/i18n/pl'

type PeriodAdherencePanelProps = {
  logs: DoseLog[]
  referenceDate?: Date
}

function pct(rate: number): number {
  return Math.round(rate * 100)
}

function periodSignature(counts: DoseTimingCounts): string {
  const taken =
    counts.onTime + counts.early + counts.late + counts.unknown
  return `${taken}|${counts.totalScheduled}|${counts.onTime}`
}

function PeriodCard({
  period,
  counts,
}: {
  period: ProgressPeriod
  counts: DoseTimingCounts
}) {
  const title = pl.progress.periods[period]
  const taken =
    counts.onTime + counts.early + counts.late + counts.unknown
  const adherence = pct(takenAdherenceRate(counts))

  return (
    <div className="rounded-xl border border-[var(--color-border)] px-3 py-2">
      <p className="text-sm font-medium">{title}</p>
      {counts.totalScheduled === 0 ? (
        <p className="mt-1 text-xs text-[var(--color-text-muted)]">
          {pl.progress.timing.noData}
        </p>
      ) : (
        <>
          <p className="mt-1 text-lg font-semibold text-brand">{adherence}%</p>
          <p className="mt-1 text-xs leading-relaxed text-[var(--color-text-muted)]">
            {pl.progress.periodCardDetail
              .replaceAll('{taken}', String(taken))
              .replace('{due}', String(counts.totalScheduled))
              .replace('{onTime}', String(counts.onTime))}
          </p>
        </>
      )}
    </div>
  )
}

export function PeriodAdherencePanel({
  logs,
  referenceDate = new Date(),
}: PeriodAdherencePanelProps) {
  const [longerPeriod, setLongerPeriod] = useState<ProgressPeriod>('month')
  const cards = PROGRESS_PERIODS.map((period) => {
    const { from, to } = periodBounds(period, referenceDate)
    return {
      period,
      counts: timingCountsForRange(logs, from, to),
    }
  })
  const dayCard = cards.find((card) => card.period === 'day')
  const longer = cards.filter((card) => card.period !== 'day')
  const sameLonger = longer.every(
    (card) => periodSignature(card.counts) === periodSignature(longer[0].counts),
  )
  const visible = sameLonger
    ? [
        dayCard,
        longer.find((card) => card.period === longerPeriod) ?? longer[0],
      ].filter((card): card is (typeof cards)[number] => card != null)
    : cards

  return (
    <section className="space-y-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-4">
      <div>
        <h3 className="font-semibold">{pl.progress.periodTitle}</h3>
        <p className="mt-1 text-xs text-[var(--color-text-muted)]">
          {pl.progress.periodHint}
        </p>
      </div>
      {sameLonger && (
        <label className="block text-sm">
          {pl.progress.perMed.period}
          <select
            className="mt-1 w-full min-h-11 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3"
            value={longerPeriod}
            onChange={(event) =>
              setLongerPeriod(event.target.value as ProgressPeriod)
            }
          >
            {longer.map((card) => (
              <option key={card.period} value={card.period}>
                {pl.progress.periods[card.period]}
              </option>
            ))}
          </select>
        </label>
      )}
      <div className="grid grid-cols-2 gap-2">
        {visible.map(({ period, counts }) => (
          <PeriodCard key={period} period={period} counts={counts} />
        ))}
      </div>
    </section>
  )
}
