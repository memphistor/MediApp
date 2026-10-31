import { useEffect, useMemo, useState } from 'react'
import { formatLocaleDateTime, formatLocaleTime } from '@/lib/dates'
import {
  takenAdherenceRate,
  timingCountsForLogs,
} from '@/lib/gamification/doseTiming'
import { logsForMedicationInPeriod } from '@/lib/gamification/medicationProgress'
import {
  PROGRESS_PERIODS,
  type ProgressPeriod,
} from '@/lib/gamification/progressPeriods'
import type { DoseLog } from '@/types/dose'
import { pl } from '@/i18n/pl'

type MedOption = { id: string; name: string; icon: string }

type MedicationProgressPanelProps = {
  logs: DoseLog[]
  medications: MedOption[]
  referenceDate?: Date
}

function pct(rate: number): number {
  return Math.round(rate * 100)
}

export function MedicationProgressPanel({
  logs,
  medications,
  referenceDate = new Date(),
}: MedicationProgressPanelProps) {
  const [medId, setMedId] = useState('')
  const [period, setPeriod] = useState<ProgressPeriod>('month')

  useEffect(() => {
    if (!medId && medications[0]) setMedId(medications[0].id)
  }, [medications, medId])

  const medLogs = useMemo(() => {
    if (!medId) return []
    return logsForMedicationInPeriod(logs, medId, period, referenceDate)
  }, [logs, medId, period, referenceDate])

  const counts = useMemo(() => timingCountsForLogs(medLogs), [medLogs])

  if (medications.length === 0) {
    return (
      <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-4">
        <h3 className="font-semibold">{pl.progress.perMed.title}</h3>
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">
          {pl.progress.perMed.noMedications}
        </p>
      </section>
    )
  }

  const taken =
    counts.onTime + counts.early + counts.late + counts.unknown
  const due = counts.totalScheduled - counts.planned

  return (
    <section className="space-y-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-4">
      <h3 className="font-semibold">{pl.progress.perMed.title}</h3>
      <p className="text-xs text-[var(--color-text-muted)]">
        {pl.progress.perMed.hint}
      </p>

      <label className="block">
        <span className="text-sm font-medium">{pl.progress.perMed.select}</span>
        <select
          className="mt-1 w-full min-h-11 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm"
          value={medId}
          onChange={(e) => setMedId(e.target.value)}
        >
          {medications.map((m) => (
            <option key={m.id} value={m.id}>
              {m.icon} {m.name}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="text-sm font-medium">{pl.progress.perMed.period}</span>
        <select
          className="mt-1 w-full min-h-11 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm"
          value={period}
          onChange={(e) => setPeriod(e.target.value as ProgressPeriod)}
        >
          {PROGRESS_PERIODS.map((p) => (
            <option key={p} value={p}>
              {pl.progress.periods[p]}
            </option>
          ))}
        </select>
      </label>

      {due > 0 ? (
        <p className="text-sm text-[var(--color-text-muted)]">
          {pl.progress.perMed.summary
            .replace('{taken}', String(taken))
            .replace('{due}', String(due))
            .replace('{pct}', String(pct(takenAdherenceRate(counts))))}
        </p>
      ) : null}

      <div>
        <p className="text-sm font-medium">{pl.progress.perMed.intakeList}</p>
        {medLogs.length === 0 ? (
          <p className="mt-2 text-xs text-[var(--color-text-muted)]">
            {pl.progress.perMed.empty}
          </p>
        ) : (
          <ul className="mt-2 max-h-72 space-y-2 overflow-y-auto">
            {medLogs.map((log) => (
              <li
                key={log.id}
                className="rounded-xl border border-[var(--color-border)] px-3 py-2 text-xs"
              >
                <div className="flex justify-between gap-2">
                  <span className="font-medium">
                    {formatLocaleDateTime(log.scheduledAt)}
                  </span>
                  <span className="shrink-0 text-[var(--color-text-muted)]">
                    {pl.doseStatus[log.status]}
                  </span>
                </div>
                {log.source === 'prn' ? (
                  <p className="mt-0.5 text-[var(--color-text-muted)]">
                    {pl.progress.perMed.prnEntry}
                    {log.takenAt && (
                      <>
                        {' · '}
                        {formatLocaleDateTime(log.takenAt)}
                      </>
                    )}
                  </p>
                ) : (
                  <p className="mt-0.5 text-[var(--color-text-muted)]">
                    {pl.history.plannedAt}: {formatLocaleTime(log.scheduledAt)}
                    {log.status === 'taken' && log.takenAt && (
                      <>
                        {' · '}
                        {pl.history.takenAt}:{' '}
                        {formatLocaleDateTime(log.takenAt)}
                      </>
                    )}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
