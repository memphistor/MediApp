import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { DoseStatusBadge } from '@/components/dose/DoseStatusBadge'
import { MedicationIconBadge } from '@/components/medication/MedicationIconBadge'
import { MedicationStockLine } from '@/components/medication/MedicationStockLine'
import { medicationAccentColor } from '@/lib/medication/medicationAccent'
import { doseStatusContextFromLog } from '@/lib/dose/doseStatusDisplay'
import { appPath } from '@/lib/profil/profilNavigation'
import { db } from '@/db/database'
import {
  getTodayPrnLogForMedication,
  logAsNeededIntake,
  logAsNeededSkip,
} from '@/repositories/doseLogRepository'
import { isEntryInDateRange } from '@/lib/schedule/isActiveOnDate'
import { pl } from '@/i18n/pl'
import type { MedicationEntry } from '@/types/medication'

function AsNeededRow({ med }: { med: MedicationEntry }) {
  const todayLog = useLiveQuery(
    () => getTodayPrnLogForMedication(med.id),
    [med.id],
  )

  const accent = medicationAccentColor(med.color)

  return (
    <li
      className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-4"
      style={{ borderLeftWidth: 6, borderLeftColor: accent }}
    >
      <div className="flex items-start gap-3">
        <MedicationIconBadge icon={med.icon} color={med.color} size={28} />
        <div className="min-w-0 flex-1">
          <Link
            to={appPath(`/medication/${med.id}`)}
            className="font-semibold text-[var(--color-text)]"
          >
            {med.name}
          </Link>
          <p className="text-sm text-[var(--color-text-muted)]">{med.doseText}</p>
          <MedicationStockLine medication={med} compact />
          <div className="mt-2">
            {todayLog ? (
              <DoseStatusBadge
                status={todayLog.status}
                context={doseStatusContextFromLog(todayLog, med)}
              />
            ) : (
              <span className="text-xs text-[var(--color-text-muted)]">
                {pl.asNeeded.noneToday}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          className="min-h-11 rounded-xl bg-brand text-sm font-semibold text-white"
          onClick={() => {
            void logAsNeededIntake(med.id).then(() => navigator.vibrate?.(10))
          }}
        >
          {pl.reminder.taken}
        </button>
        <button
          type="button"
          className="min-h-11 rounded-xl border border-[var(--color-border)] text-sm font-medium"
          onClick={() => {
            void logAsNeededSkip(med.id).then(() => navigator.vibrate?.(10))
          }}
        >
          {pl.asNeeded.skipOk}
        </button>
      </div>
    </li>
  )
}

export function AsNeededView() {
  const today = useMemo(() => new Date(), [])
  const medications = useLiveQuery(() => db.medications.toArray(), [])
  const list = (medications ?? []).filter(
    (med) => med.schedule.type === 'asNeeded' && isEntryInDateRange(today, med),
  )

  return (
    <div className="space-y-4">
      <Link to={appPath('/')} className="text-sm font-medium text-brand">
        ← {pl.wizard.back}
      </Link>
      <h2 className="text-xl font-semibold">{pl.asNeeded.title}</h2>
      <p className="text-sm text-[var(--color-text-muted)]">{pl.asNeeded.intro}</p>
      {!list.length ? (
        <p className="rounded-xl border border-dashed border-[var(--color-border)] px-4 py-8 text-center text-sm text-[var(--color-text-muted)]">
          {pl.asNeeded.empty}
        </p>
      ) : (
        <ul className="space-y-3">
          {list.map((med) => (
            <AsNeededRow key={med.id} med={med} />
          ))}
        </ul>
      )}
    </div>
  )
}
