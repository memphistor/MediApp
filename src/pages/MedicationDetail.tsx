import { useNavigate, useParams, Link } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { ScheduleSummary } from '@/components/medication/ScheduleSummary'
import { MedicationStockLine } from '@/components/medication/MedicationStockLine'
import { MedicationStockPanel } from '@/components/medication/MedicationStockPanel'
import { pl } from '@/i18n/pl'
import { getMedicationById, deleteMedication } from '@/repositories/medicationRepository'
import { logAsNeededIntake } from '@/repositories/doseLogRepository'
import { isEntryInDateRange } from '@/lib/schedule/isActiveOnDate'
import { syncAllDoseLogs } from '@/services/syncDoseLogs'

export function MedicationDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const med = useLiveQuery(
    () => (id ? getMedicationById(id) : undefined),
    [id],
  )

  if (med === undefined) {
    return (
      <div className="text-[var(--color-text-muted)]">Ładowanie…</div>
    )
  }

  if (!med) {
    return (
      <div>
        <p>{pl.detail.notFound}</p>
        <Link to="/" className="text-brand">{pl.wizard.back}</Link>
      </div>
    )
  }

  const stomach =
    med.onEmptyStomach === 'yes'
      ? pl.wizard.emptyStomach.yes
      : med.onEmptyStomach === 'no'
        ? pl.wizard.emptyStomach.no
        : pl.wizard.emptyStomach.na

  const canLogPrn =
    med.schedule.type === 'asNeeded' && isEntryInDateRange(new Date(), med)

  const handleLogIntake = async () => {
    await logAsNeededIntake(med.id)
    navigator.vibrate?.(10)
  }

  const handleDelete = async () => {
    if (!window.confirm(pl.detail.deleteConfirm)) return
    await deleteMedication(med.id)
    await syncAllDoseLogs()
    navigate('/', { replace: true })
  }

  return (
    <div className="space-y-4">
      <Link to="/" className="text-sm font-medium text-brand">
        ← {pl.wizard.back}
      </Link>
      <div
        className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-5"
        style={{ borderTopWidth: 4, borderTopColor: med.color }}
      >
        <div className="flex items-center gap-3">
          <span className="text-3xl">{med.icon}</span>
          <div>
            <h2 className="text-xl font-bold">{med.name}</h2>
            <p className="text-sm text-[var(--color-text-muted)]">
              {pl.wizard.kinds[med.kind]} · {pl.wizard.forms[med.form]}
            </p>
          </div>
        </div>
        <dl className="mt-4 space-y-2 text-sm">
          <div>
            <dt className="text-[var(--color-text-muted)]">Dawka</dt>
            <dd className="font-medium">{med.doseText}</dd>
          </div>
          {med.stockRemaining != null && (
            <div>
              <dt className="text-[var(--color-text-muted)]">{pl.stock.replenishTitle}</dt>
              <dd>
                <MedicationStockLine medication={med} />
              </dd>
            </div>
          )}
          <div>
            <dt className="text-[var(--color-text-muted)]">{pl.detail.schedule}</dt>
            <dd>
              <ScheduleSummary schedule={med.schedule} />
              {med.times.length > 0 && (
                <span className="text-[var(--color-text-muted)]">
                  {' '}
                  · {med.times.join(', ')}
                </span>
              )}
            </dd>
          </div>
          {med.purposeLabel && (
            <div>
              <dt className="text-[var(--color-text-muted)]">
                {pl.wizard.fields.purpose}
              </dt>
              <dd className="font-medium">{med.purposeLabel}</dd>
            </div>
          )}
        </dl>
      </div>

      <section>
        <h3 className="font-semibold">{pl.detail.yourNotes}</h3>
        <ul className="mt-2 space-y-2 text-sm">
          <li className="rounded-xl border border-[var(--color-border)] px-3 py-2">
            {pl.wizard.fields.emptyStomach}: <strong>{stomach}</strong>
          </li>
          {med.mealTiming && (
            <li className="rounded-xl border border-[var(--color-border)] px-3 py-2">
              {pl.wizard.fields.meal}:{' '}
              <strong>{pl.wizard.meal[med.mealTiming]}</strong>
            </li>
          )}
          {med.userNote && (
            <li className="rounded-xl border border-[var(--color-border)] px-3 py-2">
              {med.userNote}
            </li>
          )}
        </ul>
      </section>

      <MedicationStockPanel medicationId={med.id} />

      <div className="flex flex-col gap-2">
        <Link
          to={`/medication/${med.id}/edit`}
          className="flex min-h-12 items-center justify-center rounded-xl bg-brand text-sm font-semibold text-white"
        >
          {pl.detail.edit}
        </Link>
        {canLogPrn && (
          <button
            type="button"
            className="min-h-12 w-full rounded-xl border border-brand text-sm font-semibold text-brand"
            onClick={() => void handleLogIntake()}
          >
            {pl.detail.logIntake}
          </button>
        )}
        <button
          type="button"
          className="min-h-12 w-full rounded-xl border border-red-300 text-sm font-semibold text-red-700 dark:border-red-800 dark:text-red-300"
          onClick={() => void handleDelete()}
        >
          {pl.detail.delete}
        </button>
      </div>
    </div>
  )
}
