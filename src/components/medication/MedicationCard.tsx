import { Link } from 'react-router-dom'
import { appPath } from '@/lib/profil/profilNavigation'
import { TakenAtEditor } from '@/components/dose/TakenAtEditor'
import {
  MedicationStockLine,
  medicationStockBorderClass,
} from '@/components/medication/MedicationStockLine'
import type { MedicationEntry } from '@/types/medication'
import type { DoseStatus } from '@/types/dose'
import { pl } from '@/i18n/pl'
import { ScheduleSummary } from '@/components/medication/ScheduleSummary'
import {
  MedicationIconBadge,
  medicationAccentColor,
  medicationAccentSoftFill,
} from '@/components/medication/MedicationIconBadge'

interface MedicationCardProps {
  medication: MedicationEntry
  time?: string
  takenAt?: string
  doseLogId?: string
  status?: DoseStatus
  onMarkTaken?: (doseLogId: string) => void
  onSkip?: (doseLogId: string) => void
}

function emptyStomachLabel(value: MedicationEntry['onEmptyStomach']) {
  if (value === 'yes') return 'Na czczo ✔'
  if (value === 'no') return 'Nie na czczo'
  return null
}

export function MedicationCard({
  medication,
  time,
  takenAt,
  status = 'planned',
  doseLogId,
  onMarkTaken,
  onSkip,
}: MedicationCardProps) {
  const stomach = emptyStomachLabel(medication.onEmptyStomach)
  const accent = medicationAccentColor(medication.color)
  const subtitle = [
    medication.doseText,
    stomach ? `(${stomach} — twoja notatka)` : null,
  ]
    .filter(Boolean)
    .join(' · ')

  const canAct =
    doseLogId &&
    onMarkTaken &&
    onSkip &&
    (status === 'planned' || status === 'missed')

  return (
    <article
      className={`rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-4 shadow-sm ${medicationStockBorderClass(medication) ?? ''}`}
      style={{ borderLeftWidth: 6, borderLeftColor: accent }}
    >
      <Link
        to={appPath(`/medication/${medication.id}`)}
        className="block active:opacity-90"
      >
        <div className="flex items-start gap-3">
          <MedicationIconBadge
            icon={medication.icon}
            color={medication.color}
            size={30}
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="truncate font-semibold text-[var(--color-text)]">
                {medication.name}
              </h3>
              {time && (
                <time className="shrink-0 text-sm text-[var(--color-text-muted)]">
                  {time}
                </time>
              )}
            </div>
            <p className="mt-0.5 text-sm text-[var(--color-text-muted)]">
              {subtitle}
            </p>
            <MedicationStockLine medication={medication} compact />
            {status === 'taken' && takenAt && doseLogId && (
              <TakenAtEditor logId={doseLogId} takenAt={takenAt} />
            )}
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span
                className="rounded-full px-2 py-0.5 text-xs font-medium"
                style={{
                  backgroundColor: medicationAccentSoftFill(accent),
                  color: accent,
                }}
              >
                {pl.doseStatus[status]}
              </span>
              <ScheduleSummary schedule={medication.schedule} compact />
            </div>
          </div>
        </div>
      </Link>
      {canAct && (
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            className="min-h-11 rounded-xl bg-brand text-sm font-semibold text-white"
            onClick={() => onMarkTaken(doseLogId)}
          >
            {pl.reminder.taken}
          </button>
          <button
            type="button"
            className="min-h-11 rounded-xl border border-[var(--color-border)] text-sm font-medium"
            onClick={() => onSkip(doseLogId)}
          >
            {pl.reminder.skip}
          </button>
        </div>
      )}
    </article>
  )
}
