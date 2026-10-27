import { useMemo } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/db/database'
import { toDateKey } from '@/lib/dates'
import { pl } from '@/i18n/pl'

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

export function CalendarView() {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()

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

  const dayStats = useMemo(() => {
    const stats = new Map<string, { taken: number; total: number }>()
    for (const log of logs ?? []) {
      const key = toDateKey(new Date(log.scheduledAt))
      const cur = stats.get(key) ?? { taken: 0, total: 0 }
      cur.total += 1
      if (log.status === 'taken') cur.taken += 1
      stats.set(key, cur)
    }
    return stats
  }, [logs])

  const cells = buildMonthGrid(year, month)
  const monthLabel = now.toLocaleDateString('pl-PL', {
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{pl.calendar.title}</h2>
      <p className="text-sm capitalize text-[var(--color-text-muted)]">
        {monthLabel}
      </p>
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
          const st = dayStats.get(key)
          const full = st && st.total > 0 && st.taken === st.total
          const partial = st && st.total > 0 && st.taken > 0 && st.taken < st.total
          return (
            <div
              key={i}
              className={`flex aspect-square items-center justify-center rounded-lg text-sm ${
                full
                  ? 'bg-brand/20 font-semibold text-brand'
                  : partial
                    ? 'bg-brand/10'
                    : 'border border-[var(--color-border)] bg-[var(--color-surface-elevated)]'
              }`}
            >
              {cell.day}
            </div>
          )
        })}
      </div>
      <ul className="space-y-1 text-xs text-[var(--color-text-muted)]">
        <li>■ {pl.calendar.legendFull}</li>
        <li>□ {pl.calendar.legendPartial}</li>
      </ul>
    </div>
  )
}
