import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { appPath } from '@/lib/profil/profilNavigation'
import { useLiveQuery } from 'dexie-react-hooks'
import { DayRing } from '@/components/gamification/DayRing'
import { MedicationCard } from '@/components/medication/MedicationCard'
import { DueReminderPanel } from '@/components/reminders/DueReminderPanel'
import { dayRingProgress, scheduledDoses } from '@/lib/gamification/dayStats'
import { db } from '@/db/database'
import { endOfLocalDay, startOfLocalDay } from '@/lib/dates'
import { updateDoseStatus } from '@/repositories/doseLogRepository'
import { isEntryInDateRange } from '@/lib/schedule/isActiveOnDate'
import { useSettings } from '@/context/SettingsContext'
import { pl } from '@/i18n/pl'
import type { MedicationEntry } from '@/types/medication'

export function TodayView() {
  const { settings } = useSettings()
  const today = useMemo(() => new Date(), [])
  const [skipTarget, setSkipTarget] = useState<string | null>(null)
  const [skipReason, setSkipReason] = useState('')
  const [searchParams] = useSearchParams()
  const focusLog = searchParams.get('focusLog')

  const logs = useLiveQuery(async () => {
    const start = startOfLocalDay(today).toISOString()
    const end = endOfLocalDay(today).toISOString()
    const rows = await db.doseLogs
      .where('scheduledAt')
      .between(start, end, true, true)
      .toArray()
    return rows.sort(
      (a, b) =>
        new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime(),
    )
  }, [today.toDateString()])

  const medications = useLiveQuery(() => db.medications.toArray(), [])

  const medMap = useMemo(() => {
    const m = new Map<string, MedicationEntry>()
    for (const med of medications ?? []) m.set(med.id, med)
    return m
  }, [medications])

  const handleTaken = async (id: string) => {
    await updateDoseStatus(id, 'taken', { takenAt: new Date().toISOString() })
    navigator.vibrate?.(10)
  }

  const confirmSkip = async () => {
    if (!skipTarget) return
    await updateDoseStatus(skipTarget, 'skipped', {
      skipReason: skipReason.trim() || undefined,
    })
    setSkipTarget(null)
    setSkipReason('')
  }

  const entries = (logs ?? []).filter(
    (log) => medMap.has(log.medicationId) && log.source !== 'prn',
  )
  const ring = dayRingProgress(scheduledDoses(entries))
  const asNeededCount = (medications ?? []).filter(
    (med) => med.schedule.type === 'asNeeded' && isEntryInDateRange(today, med),
  ).length
  const hasMedications = (medications?.length ?? 0) > 0

  useEffect(() => {
    if (!focusLog) return
    document.getElementById(`dose-${focusLog}`)?.scrollIntoView({
      block: 'center',
    })
  }, [focusLog, entries.length])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">{pl.today.title}</h2>
        {!settings.notificationsEnabled && ring.total > 0 && (
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            {pl.today.notificationsOff}
          </p>
        )}
        {ring.total > 0 && (
          <div className="mt-4 flex justify-center">
            <DayRing
              size="sm"
              progress={ring.progress}
              taken={ring.taken}
              total={ring.total}
              sublabel={pl.progress.todayCount
                .replace('{taken}', String(ring.taken))
                .replace('{total}', String(ring.total))}
            />
          </div>
        )}
      </div>

      <DueReminderPanel />

      {entries.length === 0 && asNeededCount === 0 ? (
        <p className="rounded-xl border border-dashed border-[var(--color-border)] px-4 py-8 text-center text-sm text-[var(--color-text-muted)]">
          {hasMedications ? pl.today.empty : pl.today.emptyNoMeds}
        </p>
      ) : entries.length === 0 ? null : (
        <ul className="space-y-3">
          {entries.map((log) => {
            const med = medMap.get(log.medicationId)!
            const time = new Date(log.scheduledAt).toLocaleTimeString('pl-PL', {
              hour: '2-digit',
              minute: '2-digit',
            })
            return (
              <li
                key={log.id}
                id={`dose-${log.id}`}
                className={
                  focusLog === log.id
                    ? 'rounded-2xl ring-2 ring-brand ring-offset-2'
                    : undefined
                }
              >
                <MedicationCard
                  medication={med}
                  time={time}
                  takenAt={log.takenAt}
                  status={log.status}
                  doseLogId={log.id}
                  onMarkTaken={handleTaken}
                  onSkip={(id) => setSkipTarget(id)}
                />
              </li>
            )
          })}
        </ul>
      )}

      {asNeededCount > 0 && (
        <Link
          to={appPath('/as-needed')}
          className="flex flex-col gap-1 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-4 py-3 transition-colors hover:border-brand/40"
        >
          <span className="font-semibold text-[var(--color-text)]">
            {pl.today.asNeededLink}
          </span>
          <span className="text-sm text-[var(--color-text-muted)]">
            {pl.today.asNeededLinkHint}
          </span>
          <span className="text-xs font-medium text-brand">
            {asNeededCount}{' '}
            {asNeededCount === 1 ? 'pozycja' : 'pozycje'} →
          </span>
        </Link>
      )}

      {!hasMedications && (
        <Link
          to={appPath('/add')}
          className="flex min-h-12 items-center justify-center rounded-2xl border border-dashed border-brand text-sm font-semibold text-brand"
        >
          {pl.today.addFirst}
        </Link>
      )}

      {skipTarget && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 safe-bottom"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg rounded-2xl bg-[var(--color-surface-elevated)] p-4">
            <h3 className="font-semibold">{pl.today.skipTitle}</h3>
            <label className="mt-3 block text-sm">
              {pl.today.skipReasonLabel}
              <input
                className="mt-1 w-full min-h-11 rounded-xl border border-[var(--color-border)] px-3"
                value={skipReason}
                onChange={(e) => setSkipReason(e.target.value)}
              />
            </label>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                className="min-h-11 rounded-xl border border-[var(--color-border)]"
                onClick={() => {
                  setSkipTarget(null)
                  setSkipReason('')
                }}
              >
                {pl.common.cancel}
              </button>
              <button
                type="button"
                className="min-h-11 rounded-xl bg-brand font-semibold text-white"
                onClick={() => void confirmSkip()}
              >
                {pl.reminder.skip}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
