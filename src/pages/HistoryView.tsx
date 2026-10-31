import { useMemo, useState, type ReactNode } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { formatLocaleDateTime } from '@/lib/dates'
import { DoseStatusBadge } from '@/components/dose/DoseStatusBadge'
import { doseStatusContextFromLog } from '@/lib/dose/doseStatusDisplay'
import { TakenAtEditor } from '@/components/dose/TakenAtEditor'
import { splitHistoryLogs } from '@/lib/history/historySections'
import { db } from '@/db/database'
import { pl } from '@/i18n/pl'
import type { DoseLog } from '@/types/dose'
import type { MedicationEntry } from '@/types/medication'

function HistoryCollapsibleSection({
  title,
  count,
  defaultOpen,
  children,
}: {
  title: string
  count: number
  defaultOpen: boolean
  children: ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)
  const panelId = useMemo(() => `history-section-${title}`, [title])

  return (
    <section className="overflow-hidden rounded-xl border border-[var(--color-border)]">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-semibold hover:bg-[var(--color-surface-elevated)]"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        <span>{title}</span>
        <span className="flex items-center gap-2 font-normal text-[var(--color-text-muted)]">
          <span className="tabular-nums">{count}</span>
          <span
            className={`inline-block text-xs transition-transform ${open ? 'rotate-180' : ''}`}
            aria-hidden
          >
            ▼
          </span>
        </span>
      </button>
      {open && (
        <div id={panelId} className="border-t border-[var(--color-border)]">
          {children}
        </div>
      )}
    </section>
  )
}

function HistoryLogList({
  logs,
  nameById,
  medications,
  emptyLabel,
}: {
  logs: DoseLog[]
  nameById: Map<string, string>
  medications: MedicationEntry[] | undefined
  emptyLabel: string
}) {
  if (!logs.length) {
    return (
      <p className="px-4 py-3 text-sm text-[var(--color-text-muted)]">{emptyLabel}</p>
    )
  }

  return (
    <ul className="divide-y divide-[var(--color-border)]">
      {logs.map((log) => (
        <li key={log.id} className="px-4 py-3 text-sm">
          <div className="flex justify-between gap-2">
            <span className="font-medium">
              {nameById.get(log.medicationId) ?? '—'}
            </span>
            <DoseStatusBadge
              status={log.status}
              context={doseStatusContextFromLog(
                log,
                medications?.find((m) => m.id === log.medicationId),
              )}
            />
          </div>
          <time className="text-xs text-[var(--color-text-muted)]">
            {pl.history.plannedAt}: {formatLocaleDateTime(log.scheduledAt)}
          </time>
          {log.status === 'taken' && log.takenAt && (
            <TakenAtEditor logId={log.id} takenAt={log.takenAt} showDate />
          )}
          {log.skipReason && (
            <p className="mt-1 text-xs text-[var(--color-text-muted)]">
              {log.skipReason}
            </p>
          )}
        </li>
      ))}
    </ul>
  )
}

export function HistoryView() {
  const logs = useLiveQuery(() => db.doseLogs.toArray(), [])
  const medications = useLiveQuery(() => db.medications.toArray(), [])

  const nameById = useMemo(() => {
    const m = new Map<string, string>()
    for (const med of medications ?? []) m.set(med.id, med.name)
    return m
  }, [medications])

  const { past, planned } = useMemo(
    () => splitHistoryLogs(logs ?? []),
    [logs],
  )

  const total = (logs ?? []).length

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{pl.history.title}</h2>
      {!total ? (
        <p className="text-sm text-[var(--color-text-muted)]">{pl.history.empty}</p>
      ) : (
        <div className="space-y-3">
          <HistoryCollapsibleSection
            title={pl.history.sectionPast}
            count={past.length}
            defaultOpen
          >
            <HistoryLogList
              logs={past}
              nameById={nameById}
              medications={medications}
              emptyLabel={pl.history.sectionEmpty}
            />
          </HistoryCollapsibleSection>
          <HistoryCollapsibleSection
            title={pl.history.sectionPlanned}
            count={planned.length}
            defaultOpen={false}
          >
            <HistoryLogList
              logs={planned}
              nameById={nameById}
              medications={medications}
              emptyLabel={pl.history.sectionEmpty}
            />
          </HistoryCollapsibleSection>
        </div>
      )}
    </div>
  )
}
