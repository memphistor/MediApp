import { useMemo, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/db/database'
import { toDateKey } from '@/lib/dates'
import {
  dayComplianceTone,
  scheduledDoses,
} from '@/lib/gamification/dayStats'
import { dayComplianceToneClass } from '@/lib/calendar/dayComplianceStyles'
import { CalendarWeekStrip } from '@/components/calendar/CalendarWeekStrip'
import {
  formatTimingDeltaMinutes,
  timingLabelForLog,
} from '@/lib/gamification/doseTiming'
import { pl } from '@/i18n/pl'
import type { DoseLog } from '@/types/dose'
import type { MedicationEntry } from '@/types/medication'

const WEEKDAYS = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd']

function buildMonthGrid(year: number, month: number) {
  const first = new Date(year, month, 1)
  const last = new Date(year, month + 1, 0)
  const startPad = (first.getDay() + 6) % 7
  const cells: { date: Date | null; day?: number }[] = []
  for (let i = 0; i < startPad; i++) cells.push({ date: null })
  for (let d = 1; d <= last.getDate(); d++) {
    cells.push({ date: new Date(year, month, d), day: d })
  }
  while (cells.length % 7 !== 0) cells.push({ date: null })
  return cells
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('pl-PL', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function CalendarView() {
  const now = new Date()
  const [cursor, setCursor] = useState({
    year: now.getFullYear(),
    month: now.getMonth(),
  })
  const [selectedKey, setSelectedKey] = useState<string | null>(null)
  const { year, month } = cursor

  const logs = useLiveQuery(
    () => {
      const start = new Date(year, month, 1)
      const end = new Date(year, month + 1, 0, 23, 59, 59, 999)
      return db.doseLogs
        .where('scheduledAt')
        .between(start.toISOString(), end.toISOString(), true, true)
        .toArray()
    },
    [year, month],
  )

  const medications = useLiveQuery(() => db.medications.toArray(), [])
  const medMap = useMemo(() => {
    const map = new Map<string, MedicationEntry>()
    for (const med of medications ?? []) map.set(med.id, med)
    return map
  }, [medications])

  const byDay = useMemo(() => {
    const map = new Map<string, DoseLog[]>()
    for (const log of logs ?? []) {
      const key = toDateKey(new Date(log.scheduledAt))
      const list = map.get(key) ?? []
      list.push(log)
      map.set(key, list)
    }
    return map
  }, [logs])

  const cells = buildMonthGrid(year, month)
  const monthLabel = new Date(year, month, 1).toLocaleDateString('pl-PL', {
    month: 'long',
    year: 'numeric',
  })

  const selectedLogs = selectedKey ? (byDay.get(selectedKey) ?? []) : []
  const selectedPlan = scheduledDoses(selectedLogs)
  const selectedPrn = selectedLogs.filter((l) => l.source === 'prn')

  const shiftMonth = (delta: number) => {
    setCursor((c) => {
      const next = new Date(c.year, c.month + delta, 1)
      return { year: next.getFullYear(), month: next.getMonth() }
    })
    setSelectedKey(null)
  }

  const selectCalendarDay = (key: string, date: Date) => {
    setCursor({ year: date.getFullYear(), month: date.getMonth() })
    setSelectedKey(key)
  }

  const renderLog = (log: DoseLog) => {
    const med = medMap.get(log.medicationId)
    const timingLabels = pl.progress.timing
    const timingText =
      log.source === 'prn'
        ? null
        : timingLabelForLog(log, {
            onTime: timingLabels.onTime,
            early: timingLabels.early,
            late: timingLabels.late,
            unknown: timingLabels.unknown,
            missed: timingLabels.missed,
            planned: pl.doseStatus.planned,
          })
    const delta = formatTimingDeltaMinutes(log)
    return (
      <li
        key={log.id}
        className="flex items-center justify-between gap-2 rounded-xl border border-[var(--color-border)] px-3 py-2 text-sm"
      >
        <span className="min-w-0">
          <span className="font-medium">{med?.name ?? '—'}</span>
          <span className="text-[var(--color-text-muted)]">
            {' '}
            · {formatTime(log.scheduledAt)}
          </span>
          {timingText && (
            <span className="block text-xs text-[var(--color-text-muted)]">
              {timingText}
              {delta && timingText !== timingLabels.missed ? ` (${delta})` : ''}
            </span>
          )}
        </span>
        <span className="shrink-0 text-xs text-[var(--color-text-muted)]">
          {pl.doseStatus[log.status]}
        </span>
      </li>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-xl font-semibold">{pl.calendar.title}</h2>
        <div className="flex gap-2">
          <button
            type="button"
            className="min-h-11 min-w-11 rounded-xl border border-[var(--color-border)]"
            aria-label={pl.calendar.prevMonth}
            onClick={() => shiftMonth(-1)}
          >
            ‹
          </button>
          <button
            type="button"
            className="min-h-11 min-w-11 rounded-xl border border-[var(--color-border)]"
            aria-label={pl.calendar.nextMonth}
            onClick={() => shiftMonth(1)}
          >
            ›
          </button>
        </div>
      </div>
      <p className="text-sm capitalize text-[var(--color-text-muted)]">
        {monthLabel}
      </p>

      <CalendarWeekStrip
        selectedKey={selectedKey}
        onSelectDay={selectCalendarDay}
      />

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-[var(--color-text-muted)]">
        {WEEKDAYS.map((w) => (
          <div key={w}>{w}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((cell, i) => {
          if (!cell.date) {
            return <div key={i} className="aspect-square" />
          }
          const key = toDateKey(cell.date)
          const dayLogs = byDay.get(key) ?? []
          const tone = dayComplianceTone(dayLogs)
          const hasPrn = dayLogs.some((l) => l.source === 'prn')
          const selected = selectedKey === key
          return (
            <button
              key={key}
              type="button"
              className={`relative flex aspect-square items-center justify-center rounded-lg text-sm ${dayComplianceToneClass[tone]} ${
                selected ? 'ring-2 ring-brand' : ''
              }`}
              onClick={() => setSelectedKey(key)}
            >
              {cell.day}
              {hasPrn && (
                <span className="absolute bottom-1 h-1.5 w-1.5 rounded-full bg-brand" />
              )}
            </button>
          )
        })}
      </div>
      <ul className="space-y-1 text-xs text-[var(--color-text-muted)]">
        <li>{pl.calendar.legendFull}</li>
        <li>{pl.calendar.legendPartial}</li>
        <li>{pl.calendar.legendMissed}</li>
        <li>{pl.calendar.legendPlanned}</li>
        <li>{pl.calendar.legendPrn}</li>
      </ul>

      {selectedKey && (
        <section className="space-y-3">
          <h3 className="font-semibold">{selectedKey}</h3>
          {selectedPlan.length === 0 && selectedPrn.length === 0 ? (
            <p className="text-sm text-[var(--color-text-muted)]">
              {pl.calendar.dayEmpty}
            </p>
          ) : (
            <>
              {selectedPlan.length > 0 && (
                <div>
                  <p className="mb-1 text-xs font-medium text-[var(--color-text-muted)]">
                    {pl.calendar.planSection}
                  </p>
                  <ul className="space-y-2">{selectedPlan.map(renderLog)}</ul>
                </div>
              )}
              {selectedPrn.length > 0 && (
                <div>
                  <p className="mb-1 text-xs font-medium text-[var(--color-text-muted)]">
                    {pl.calendar.prnSection}
                  </p>
                  <ul className="space-y-2">{selectedPrn.map(renderLog)}</ul>
                </div>
              )}
            </>
          )}
        </section>
      )}
    </div>
  )
}
