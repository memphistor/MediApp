import { useMemo } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/db/database'
import { pl } from '@/i18n/pl'

export function HistoryView() {
  const logs = useLiveQuery(
    () => db.doseLogs.orderBy('scheduledAt').reverse().limit(50).toArray(),
    [],
  )

  const medications = useLiveQuery(() => db.medications.toArray(), [])

  const nameById = useMemo(() => {
    const m = new Map<string, string>()
    for (const med of medications ?? []) m.set(med.id, med.name)
    return m
  }, [medications])

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{pl.history.title}</h2>
      {!logs?.length ? (
        <p className="text-sm text-[var(--color-text-muted)]">{pl.history.empty}</p>
      ) : (
        <ul className="divide-y divide-[var(--color-border)] rounded-xl border border-[var(--color-border)]">
          {logs.map((log) => (
            <li key={log.id} className="px-4 py-3 text-sm">
              <div className="flex justify-between gap-2">
                <span className="font-medium">
                  {nameById.get(log.medicationId) ?? '—'}
                </span>
                <span className="text-[var(--color-text-muted)]">
                  {pl.doseStatus[log.status]}
                </span>
              </div>
              <time className="text-xs text-[var(--color-text-muted)]">
                {new Date(log.scheduledAt).toLocaleString('pl-PL')}
              </time>
              {log.skipReason && (
                <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                  {log.skipReason}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
