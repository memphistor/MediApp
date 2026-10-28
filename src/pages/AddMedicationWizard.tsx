import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { pl } from '@/i18n/pl'
import type { MedicationKind, MedicationForm, Schedule } from '@/types/medication'
import {
  buildMedicationFromWizard,
  medicationToWizardState,
  validateWizard,
  type WizardFormState,
  type WizardErrors,
} from '@/lib/wizard/buildMedication'
import {
  createMedication,
  getMedicationById,
  updateMedication,
} from '@/repositories/medicationRepository'
import { syncDoseLogsForMedication } from '@/services/syncDoseLogs'

const TOTAL_STEPS = 5
const DAY_LABELS = ['Nd', 'Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So']

const KIND_OPTIONS: MedicationKind[] = [
  'prescription',
  'otc',
  'supplement',
  'other',
]

const FORM_OPTIONS: MedicationForm[] = [
  'tablet',
  'capsule',
  'drops',
  'sachet',
  'injection',
  'liquid',
  'other',
]

const SCHEDULE_OPTIONS: Schedule['type'][] = [
  'daily',
  'weekdays',
  'everyNDays',
  'weekly',
  'monthly',
  'cycle',
  'asNeeded',
]

const initialForm: WizardFormState = {
  name: '',
  kind: '',
  form: '',
  doseText: '',
  emptyStomach: '',
  meal: '',
  timesRaw: '',
  scheduleType: '',
  weekdayDays: [1, 2, 3, 4, 5],
  everyNInterval: 2,
  weeklyDay: 1,
  monthlyDay: 1,
  cycleActive: 21,
  cycleBreak: 7,
  dateStart: '',
  dateEnd: '',
  purpose: '',
  note: '',
  color: '#0f766e',
  icon: '💊',
}

export function AddMedicationWizard() {
  const navigate = useNavigate()
  const { id: editId } = useParams()
  const existing = useLiveQuery(async () => {
    if (!editId) return null
    return (await getMedicationById(editId)) ?? null
  }, [editId])
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<WizardFormState>(initialForm)
  const [errors, setErrors] = useState<WizardErrors>({})
  const [saving, setSaving] = useState(false)
  const [hydrated, setHydrated] = useState(!editId)

  useEffect(() => {
    if (!editId || !existing || hydrated) return
    setForm(medicationToWizardState(existing))
    setHydrated(true)
  }, [editId, existing, hydrated])

  const patch = (partial: Partial<WizardFormState>) => {
    setForm((f) => ({ ...f, ...partial }))
  }

  const toggleWeekday = (day: number) => {
    setForm((f) => {
      const has = f.weekdayDays.includes(day)
      const weekdayDays = has
        ? f.weekdayDays.filter((d) => d !== day)
        : [...f.weekdayDays, day]
      return { ...f, weekdayDays }
    })
  }

  const handleSave = async () => {
    const validation = validateWizard(form)
    setErrors(validation)
    if (Object.keys(validation).length > 0) return

    setSaving(true)
    try {
      const entry = buildMedicationFromWizard(
        form,
        existing ? { id: existing.id, createdAt: existing.createdAt } : undefined,
      )
      if (existing) await updateMedication(entry)
      else await createMedication(entry)
      await syncDoseLogsForMedication(entry.id)
      navigate(existing ? `/medication/${entry.id}` : '/', { replace: true })
    } finally {
      setSaving(false)
    }
  }

  if (editId && existing === undefined) {
    return <div className="text-[var(--color-text-muted)]">Ładowanie…</div>
  }

  if (editId && existing === null) {
    return (
      <div>
        <p>{pl.detail.notFound}</p>
        <Link to="/" className="text-brand">{pl.wizard.back}</Link>
      </div>
    )
  }

  if (!hydrated) {
    return <div className="text-[var(--color-text-muted)]">Ładowanie…</div>
  }

  return (
    <div className="pb-8">
      <div className="mb-4 flex items-center justify-between">
        <Link
          to={editId ? `/medication/${editId}` : '/'}
          className="min-h-11 min-w-11 text-sm font-medium text-brand"
        >
          ← {pl.wizard.back}
        </Link>
        <span className="text-sm text-[var(--color-text-muted)]">
          {pl.wizard.step} {step} {pl.wizard.of} {TOTAL_STEPS}
        </span>
      </div>

      <h2 className="text-xl font-semibold">
        {editId ? pl.wizard.editTitle : pl.wizard.title}
      </h2>

      <div className="mt-6 space-y-4">
        {step === 1 && (
          <>
            <label className="block">
              <span className="text-sm font-medium">{pl.wizard.fields.name}</span>
              <input
                className="mt-1 w-full min-h-12 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3"
                value={form.name}
                onChange={(e) => patch({ name: e.target.value })}
                autoComplete="off"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-600">{errors.name}</p>
              )}
            </label>
            <fieldset>
              <legend className="text-sm font-medium">{pl.wizard.fields.kind}</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {KIND_OPTIONS.map((k) => (
                  <button
                    key={k}
                    type="button"
                    className={`min-h-11 rounded-xl border px-3 text-sm ${
                      form.kind === k
                        ? 'border-brand bg-brand/10 text-brand'
                        : 'border-[var(--color-border)]'
                    }`}
                    onClick={() => patch({ kind: k })}
                  >
                    {pl.wizard.kinds[k]}
                  </button>
                ))}
              </div>
              {errors.kind && (
                <p className="mt-1 text-xs text-red-600">{errors.kind}</p>
              )}
            </fieldset>
            <fieldset>
              <legend className="text-sm font-medium">{pl.wizard.fields.form}</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {FORM_OPTIONS.map((f) => (
                  <button
                    key={f}
                    type="button"
                    className={`min-h-11 rounded-xl border px-3 text-sm ${
                      form.form === f
                        ? 'border-brand bg-brand/10 text-brand'
                        : 'border-[var(--color-border)]'
                    }`}
                    onClick={() => patch({ form: f })}
                  >
                    {pl.wizard.forms[f]}
                  </button>
                ))}
              </div>
              {errors.form && (
                <p className="mt-1 text-xs text-red-600">{errors.form}</p>
              )}
            </fieldset>
          </>
        )}

        {step === 2 && (
          <>
            <label className="block">
              <span className="text-sm font-medium">{pl.wizard.fields.dose}</span>
              <input
                className="mt-1 w-full min-h-12 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3"
                value={form.doseText}
                onChange={(e) => patch({ doseText: e.target.value })}
              />
              {errors.doseText && (
                <p className="mt-1 text-xs text-red-600">{errors.doseText}</p>
              )}
            </label>
            <fieldset>
              <legend className="text-sm font-medium">
                {pl.wizard.fields.emptyStomach}
              </legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {(['yes', 'no', 'na'] as const).map((v) => (
                  <button
                    key={v}
                    type="button"
                    className={`min-h-11 rounded-xl border px-3 text-sm ${
                      form.emptyStomach === v
                        ? 'border-brand bg-brand/10'
                        : 'border-[var(--color-border)]'
                    }`}
                    onClick={() => patch({ emptyStomach: v })}
                  >
                    {pl.wizard.emptyStomach[v]}
                  </button>
                ))}
              </div>
              {errors.emptyStomach && (
                <p className="mt-1 text-xs text-red-600">{errors.emptyStomach}</p>
              )}
            </fieldset>
            <fieldset>
              <legend className="text-sm font-medium">{pl.wizard.fields.meal}</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {(['before', 'during', 'after', 'skipped'] as const).map((v) => (
                  <button
                    key={v}
                    type="button"
                    className={`min-h-11 rounded-xl border px-3 text-sm ${
                      form.meal === v
                        ? 'border-brand bg-brand/10'
                        : 'border-[var(--color-border)]'
                    }`}
                    onClick={() => patch({ meal: v })}
                  >
                    {pl.wizard.meal[v]}
                  </button>
                ))}
              </div>
            </fieldset>
          </>
        )}

        {step === 3 && (
          <>
            {form.scheduleType !== 'asNeeded' && (
              <label className="block">
                <span className="text-sm font-medium">{pl.wizard.fields.times}</span>
                <input
                  className="mt-1 w-full min-h-12 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3"
                  value={form.timesRaw}
                  onChange={(e) => patch({ timesRaw: e.target.value })}
                  placeholder="07:30, 20:00"
                />
                {errors.times && (
                  <p className="mt-1 text-xs text-red-600">{errors.times}</p>
                )}
              </label>
            )}
            <fieldset>
              <legend className="text-sm font-medium">{pl.wizard.fields.schedule}</legend>
              <div className="mt-2 flex flex-col gap-2">
                {SCHEDULE_OPTIONS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={`min-h-11 rounded-xl border px-3 text-left text-sm ${
                      form.scheduleType === t
                        ? 'border-brand bg-brand/10'
                        : 'border-[var(--color-border)]'
                    }`}
                    onClick={() => patch({ scheduleType: t })}
                  >
                    {pl.wizard.schedules[t]}
                  </button>
                ))}
              </div>
              {errors.scheduleType && (
                <p className="mt-1 text-xs text-red-600">{errors.scheduleType}</p>
              )}
            </fieldset>

            {form.scheduleType === 'weekdays' && (
              <div className="flex flex-wrap gap-2">
                {DAY_LABELS.map((label, day) => (
                  <button
                    key={day}
                    type="button"
                    className={`min-h-10 min-w-10 rounded-xl border text-sm ${
                      form.weekdayDays.includes(day)
                        ? 'border-brand bg-brand/10'
                        : 'border-[var(--color-border)]'
                    }`}
                    onClick={() => toggleWeekday(day)}
                  >
                    {label}
                  </button>
                ))}
                {errors.weekdays && (
                  <p className="w-full text-xs text-red-600">{errors.weekdays}</p>
                )}
              </div>
            )}

            {form.scheduleType === 'everyNDays' && (
              <label className="block text-sm">
                Co ile dni?
                <input
                  type="number"
                  min={2}
                  className="mt-1 w-full min-h-11 rounded-xl border border-[var(--color-border)] px-3"
                  value={form.everyNInterval}
                  onChange={(e) =>
                    patch({ everyNInterval: Number(e.target.value) })
                  }
                />
                {errors.everyN && (
                  <p className="mt-1 text-xs text-red-600">{errors.everyN}</p>
                )}
              </label>
            )}

            {form.scheduleType === 'weekly' && (
              <div className="flex flex-wrap gap-2">
                {DAY_LABELS.map((label, day) => (
                  <button
                    key={day}
                    type="button"
                    className={`min-h-10 rounded-xl border px-3 text-sm ${
                      form.weeklyDay === day
                        ? 'border-brand bg-brand/10'
                        : 'border-[var(--color-border)]'
                    }`}
                    onClick={() => patch({ weeklyDay: day })}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}

            {form.scheduleType === 'monthly' && (
              <label className="block text-sm">
                Dzień miesiąca
                <input
                  type="number"
                  min={1}
                  max={28}
                  className="mt-1 w-full min-h-11 rounded-xl border border-[var(--color-border)] px-3"
                  value={form.monthlyDay}
                  onChange={(e) => patch({ monthlyDay: Number(e.target.value) })}
                />
              </label>
            )}

            {form.scheduleType === 'cycle' && (
              <div className="grid grid-cols-2 gap-3">
                <label className="text-sm">
                  Dni brania
                  <input
                    type="number"
                    min={1}
                    className="mt-1 w-full min-h-11 rounded-xl border border-[var(--color-border)] px-3"
                    value={form.cycleActive}
                    onChange={(e) =>
                      patch({ cycleActive: Number(e.target.value) })
                    }
                  />
                </label>
                <label className="text-sm">
                  Dni przerwy
                  <input
                    type="number"
                    min={1}
                    className="mt-1 w-full min-h-11 rounded-xl border border-[var(--color-border)] px-3"
                    value={form.cycleBreak}
                    onChange={(e) =>
                      patch({ cycleBreak: Number(e.target.value) })
                    }
                  />
                </label>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <label className="text-sm">
                {pl.wizard.fields.dateFrom}
                <input
                  type="date"
                  className="mt-1 w-full min-h-11 rounded-xl border border-[var(--color-border)] px-3"
                  value={form.dateStart}
                  onChange={(e) => patch({ dateStart: e.target.value })}
                />
              </label>
              <label className="text-sm">
                {pl.wizard.fields.dateTo}
                <input
                  type="date"
                  className="mt-1 w-full min-h-11 rounded-xl border border-[var(--color-border)] px-3"
                  value={form.dateEnd}
                  onChange={(e) => patch({ dateEnd: e.target.value })}
                />
              </label>
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <label className="block">
              <span className="text-sm font-medium">{pl.wizard.fields.purpose}</span>
              <input
                className="mt-1 w-full min-h-12 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3"
                value={form.purpose}
                onChange={(e) => patch({ purpose: e.target.value })}
                placeholder="np. tarczyca, odporność"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium">{pl.wizard.fields.note}</span>
              <textarea
                className="mt-1 w-full min-h-24 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3 py-2"
                value={form.note}
                onChange={(e) => patch({ note: e.target.value })}
              />
            </label>
          </>
        )}

        {step === 5 && (
          <>
            <p className="text-sm font-medium">{pl.wizard.fields.colorIcon}</p>
            <div className="flex gap-4">
              <label className="flex flex-col text-sm">
                Kolor
                <input
                  type="color"
                  className="mt-1 h-12 w-full cursor-pointer rounded-xl border border-[var(--color-border)]"
                  value={form.color}
                  onChange={(e) => patch({ color: e.target.value })}
                />
              </label>
              <label className="flex flex-1 flex-col text-sm">
                Ikona (emoji)
                <input
                  className="mt-1 min-h-12 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3 text-2xl"
                  value={form.icon}
                  onChange={(e) => patch({ icon: e.target.value })}
                  maxLength={4}
                />
              </label>
            </div>
          </>
        )}
      </div>

      <div className="mt-8 flex gap-3">
        {step > 1 && (
          <button
            type="button"
            className="min-h-12 flex-1 rounded-xl border border-[var(--color-border)] font-medium"
            onClick={() => setStep((s) => s - 1)}
          >
            {pl.wizard.back}
          </button>
        )}
        {step < TOTAL_STEPS ? (
          <button
            type="button"
            className="min-h-12 flex-1 rounded-xl bg-brand font-semibold text-white"
            onClick={() => setStep((s) => s + 1)}
          >
            {pl.wizard.next}
          </button>
        ) : (
          <button
            type="button"
            disabled={saving}
            className="min-h-12 flex-1 rounded-xl bg-brand font-semibold text-white disabled:opacity-60"
            onClick={() => void handleSave()}
          >
            {saving ? pl.wizard.saving : pl.wizard.save}
          </button>
        )}
      </div>
    </div>
  )
}
