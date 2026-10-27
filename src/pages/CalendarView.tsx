import { pl } from '@/i18n/pl'

const WEEKDAYS = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd']
const days = Array.from({ length: 35 }, (_, i) => {
  const d = i + 1
  const full = d % 7 === 3 || d % 11 === 0
  const partial = d % 5 === 0 && !full
  return { day: (d % 31) + 1, full, partial }
})

export function CalendarView() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{pl.calendar.title}</h2>
      <p className="text-sm text-[var(--color-text-muted)]">
        {pl.calendar.placeholder}
      </p>
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-[var(--color-text-muted)]">
        {WEEKDAYS.map((w) => (
          <div key={w}>{w}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((cell, i) => (
          <div
            key={i}
            className={`flex aspect-square items-center justify-center rounded-lg text-sm ${
              cell.full
                ? 'bg-brand/20 font-semibold text-brand'
                : cell.partial
                  ? 'bg-brand/10'
                  : 'bg-[var(--color-surface-elevated)] border border-[var(--color-border)]'
            }`}
          >
            {cell.day}
          </div>
        ))}
      </div>
      <ul className="space-y-1 text-xs text-[var(--color-text-muted)]">
        <li>■ {pl.calendar.legendFull}</li>
        <li>□ {pl.calendar.legendPartial}</li>
      </ul>
    </div>
  )
}
