import { Link } from 'react-router-dom'
import { useMemo } from 'react'
import { CollapsibleSection } from '@/components/layout/CollapsibleSection'
import { useLiveQuery } from 'dexie-react-hooks'
import { formatLocaleDateTime } from '@/lib/dates'
import { DoseStatusBadge } from '@/components/dose/DoseStatusBadge'
import { doseStatusContextFromLog } from '@/lib/dose/doseStatusDisplay'
import { TakenAtEditor } from '@/components/dose/TakenAtEditor'
import { splitHistoryLogs } from '@/lib/history/historySections'
import { appPath } from '@/lib/profil/profilNavigation'
import { db } from '@/db/database'
import { pl } from '@/i18n/pl'
import type { DoseLog } from '@/types/dose'
import type { MedicationEntry } from '@/types/medication'

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
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h2 className="text-xl font-semibold">{pl.history.title}</h2>
        <Link
          to={appPath('/progress/analytics')}
          className="text-sm font-medium text-brand"
        >
          {pl.history.analyticsLink}
        </Link>
      </div>
      {!total ? (
        <p className="text-sm text-[var(--color-text-muted)]">{pl.history.empty}</p>
      ) : (
        <div className="space-y-3">
          <CollapsibleSection
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
          </CollapsibleSection>
          <CollapsibleSection
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
          </CollapsibleSection>
        </div>
      )}
    </div>
  )
}
