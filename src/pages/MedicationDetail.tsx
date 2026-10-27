import { useParams, Link } from 'react-router-dom'
import { DEMO_MEDICATION, DEMO_MEDICATION_2 } from '@/data/demo'
import { ScheduleSummary } from '@/components/medication/ScheduleSummary'
import { pl } from '@/i18n/pl'

const byId: Record<string, typeof DEMO_MEDICATION> = {
  'demo-1': DEMO_MEDICATION,
  'demo-2': DEMO_MEDICATION_2,
}

export function MedicationDetail() {
  const { id } = useParams()
  const med = id ? byId[id] : undefined

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
          {med.mealTiming && med.mealTiming !== 'skipped' && (
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
    </div>
  )
}
