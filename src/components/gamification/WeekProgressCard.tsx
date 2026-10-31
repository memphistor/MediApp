import { useMemo } from 'react'
import { DayRing } from '@/components/gamification/DayRing'
import {
  addDays,
  startOfWeekMonday,
  toDateKey,
  weekDayKeys,
} from '@/lib/dates'
import {
  dayComplianceTone,
  dayRingProgress,
  groupLogsByDateKey,
  scheduledDoses,
} from '@/lib/gamification/dayStats'
import { dayComplianceToneClass } from '@/lib/calendar/dayComplianceStyles'
import { logsInLocalDateRange } from '@/lib/gamification/doseTiming'
import { calendarWeekBounds, weekPlanProgress } from '@/lib/gamification/weekProgress'
import type { DoseLog } from '@/types/dose'
import { pl } from '@/i18n/pl'

const WEEKDAY_LABELS = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'] as const

type WeekProgressCardProps = {
  logs: DoseLog[]
  referenceDate?: Date
}

export function WeekProgressCard({
  logs,
  referenceDate = new Date(),
}: WeekProgressCardProps) {
  const weekMonday = startOfWeekMonday(referenceDate)
  const dayKeys = weekDayKeys(weekMonday)
  const todayKey = toDateKey(referenceDate)

  const byDay = useMemo(() => {
    const { from, to } = calendarWeekBounds(referenceDate)
    return groupLogsByDateKey(logsInLocalDateRange(logs, from, to))
  }, [logs, referenceDate])

  const { taken, total, progress } = useMemo(
    () => weekPlanProgress(logs, referenceDate),
    [logs, referenceDate],
  )

  const weekRangeLabel = `${weekMonday.toLocaleDateString('pl-PL', {
    day: 'numeric',
    month: 'short',
  })} – ${addDays(weekMonday, 6).toLocaleDateString('pl-PL', {
    day: 'numeric',
    month: 'short',
  })}`

  return (
    <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-sm font-semibold">{pl.progress.weekRing}</h3>
        <p className="text-xs text-[var(--color-text-muted)]">{weekRangeLabel}</p>
      </div>
      <DayRing
        progress={progress}
        taken={taken}
        total={total}
        sublabel={pl.progress.weekCount
          .replace('{taken}', String(taken))
          .replace('{total}', String(total))}
      />
      <div className="mt-4 grid grid-cols-7 gap-1" aria-label={pl.progress.weekDaysAria}>
        {dayKeys.map((key, index) => {
          const date = addDays(weekMonday, index)
          const planned = scheduledDoses(byDay.get(key) ?? [])
          const tone = dayComplianceTone(planned)
          const ring = dayRingProgress(planned)
          const isToday = key === todayKey
          return (
            <div
              key={key}
              className={`flex flex-col items-center gap-0.5 rounded-lg px-0.5 py-1.5 text-center ${dayComplianceToneClass[tone]} ${
                isToday ? 'outline outline-1 outline-brand/50' : ''
              }`}
              title={`${WEEKDAY_LABELS[index]} ${date.getDate()}`}
            >
              <span className="text-[10px] font-medium leading-none">
                {WEEKDAY_LABELS[index]}
              </span>
              <span className="text-xs leading-none">{date.getDate()}</span>
              <span className="text-[9px] leading-tight opacity-90">
                {planned.length === 0
                  ? '—'
                  : tone === 'full'
                    ? '✓'
                    : `${ring.taken}/${ring.total}`}
              </span>
            </div>
          )
        })}
      </div>
    </section>
  )
}
