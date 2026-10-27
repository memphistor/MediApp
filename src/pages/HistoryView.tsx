import { pl } from '@/i18n/pl'
import { DEMO_DOSE_LOGS, DEMO_MEDICATION } from '@/data/demo'

export function HistoryView() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{pl.history.title}</h2>
      <div className="flex gap-2">
        <button
          type="button"
          disabled
          title={pl.history.soon}
          className="min-h-11 flex-1 rounded-xl border border-[var(--color-border)] text-sm font-medium opacity-50"
        >
          {pl.history.exportPdf}
        </button>
        <button
          type="button"
          disabled
          title={pl.history.soon}
          className="min-h-11 flex-1 rounded-xl border border-[var(--color-border)] text-sm font-medium opacity-50"
        >
          {pl.history.exportCsv}
        </button>
      </div>
      <ul className="divide-y divide-[var(--color-border)] rounded-xl border border-[var(--color-border)]">
        {DEMO_DOSE_LOGS.map((log) => (
          <li key={log.id} className="px-4 py-3 text-sm">
            <div className="flex justify-between gap-2">
              <span className="font-medium">{DEMO_MEDICATION.name}</span>
              <span className="text-[var(--color-text-muted)]">
                {pl.doseStatus[log.status]}
              </span>
            </div>
            <time className="text-xs text-[var(--color-text-muted)]">
              {new Date(log.scheduledAt).toLocaleString('pl-PL')}
            </time>
          </li>
        ))}
      </ul>
    </div>
  )
}
