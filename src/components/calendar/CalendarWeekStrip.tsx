import { useMemo } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/db/database'
import {
  addDays,
  endOfLocalDay,
  startOfLocalDay,
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
import { pl } from '@/i18n/pl'

const WEEKDAY_LABELS = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'] as const

type CalendarWeekStripProps = {
  onSelectDay: (dateKey: string, date: Date) => void
  selectedKey: string | null
}

export function CalendarWeekStrip({
  onSelectDay,
  selectedKey,
}: CalendarWeekStripProps) {
  const todayKey = toDateKey(new Date())
  const weekMonday = startOfWeekMonday(new Date())
  const weekSunday = endOfLocalDay(addDays(weekMonday, 6))
  const weekMondayKey = toDateKey(weekMonday)

  const weekLogs = useLiveQuery(
    () =>
      db.doseLogs
        .where('scheduledAt')
        .between(
          startOfLocalDay(weekMonday).toISOString(),
          weekSunday.toISOString(),
          true,
          true,
        )
        .toArray(),
    [weekMondayKey],
  )

  const byDay = useMemo(
    () => groupLogsByDateKey(weekLogs ?? []),
    [weekLogs],
  )

  const dayKeys = weekDayKeys(weekMonday)

  const weekRangeLabel = `${weekMonday.toLocaleDateString('pl-PL', {
    day: 'numeric',
    month: 'short',
  })} – ${addDays(weekMonday, 6).toLocaleDateString('pl-PL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })}`

  const summary = useMemo(() => {
    let withPlan = 0
    let full = 0
    for (const key of dayKeys) {
      const planned = scheduledDoses(byDay.get(key) ?? [])
      if (planned.length === 0) continue
      withPlan += 1
      if (dayComplianceTone(planned) === 'full') full += 1
    }
    return { full, withPlan }
  }, [byDay, dayKeys])

  return (
    <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-sm font-semibold">{pl.calendar.weekTitle}</h3>
        <p className="text-xs text-[var(--color-text-muted)]">{weekRangeLabel}</p>
      </div>
      <p className="mt-1 text-xs text-[var(--color-text-muted)]">
        {pl.calendar.weekSummary
          .replace('{full}', String(summary.full))
          .replace('{withPlan}', String(summary.withPlan))}
      </p>
      <div className="mt-3 grid grid-cols-7 gap-1">
        {dayKeys.map((key, index) => {
          const date = addDays(weekMonday, index)
          const tone = dayComplianceTone(byDay.get(key) ?? [])
          const ring = dayRingProgress(scheduledDoses(byDay.get(key) ?? []))
          const isToday = key === todayKey
          const selected = selectedKey === key
          let hint: string = pl.calendar.weekDayEmpty
          if (tone === 'full') hint = pl.calendar.weekDayFull
          else if (tone === 'missed') hint = pl.calendar.weekDayMissed
          else if (tone === 'partial' || tone === 'planned') {
            hint = pl.calendar.weekDayProgress
              .replace('{taken}', String(ring.taken))
              .replace('{total}', String(ring.total))
          } else if (key > todayKey) {
            hint = pl.calendar.weekDayFuture
          }

          return (
            <button
              key={key}
              type="button"
              className={`flex flex-col items-center gap-1 rounded-xl px-0.5 py-2 text-center ${dayComplianceToneClass[tone]} ${
                selected ? 'ring-2 ring-brand ring-offset-1' : ''
              } ${isToday ? 'outline outline-1 outline-brand/40' : ''}`}
              aria-label={`${WEEKDAY_LABELS[index]} ${date.getDate()}: ${hint}`}
              onClick={() => onSelectDay(key, date)}
            >
              <span className="text-[10px] font-medium uppercase leading-none">
                {WEEKDAY_LABELS[index]}
              </span>
              <span className="text-base leading-none">{date.getDate()}</span>
              <span className="line-clamp-2 text-[9px] leading-tight opacity-90">
                {tone === 'empty' && key > todayKey
                  ? pl.calendar.weekDayFuture
                  : tone === 'full'
                    ? '✓'
                    : tone === 'empty'
                      ? '—'
                      : `${ring.taken}/${ring.total}`}
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
