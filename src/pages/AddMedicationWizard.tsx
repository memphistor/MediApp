import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { FormSelect, selectClassName } from '@/components/medication/FormSelect'
import { MedicationIconPicker } from '@/components/medication/MedicationIconPicker'
import { MedicationColorPicker } from '@/components/medication/MedicationColorPicker'
import { pl } from '@/i18n/pl'
import type { MedicationKind, MedicationForm, Schedule } from '@/types/medication'
import {
  buildMedicationFromWizard,
  medicationToWizardState,
  mergeWizardFormFromDom,
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
import { DEFAULT_MEDICATION_COLOR } from '@/lib/wizard/medicationColors'

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
  kind: 'otc',
  form: 'tablet',
  doseText: '',
  emptyStomach: 'na',
  meal: '',
  timesRaw: '08:00',
  scheduleType: 'daily',
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
  color: DEFAULT_MEDICATION_COLOR,
  icon: '💊',
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="border-b border-[var(--color-border)] pb-1 text-sm font-semibold text-[var(--color-text-muted)]">
      {children}
    </h3>
  )
}

export function AddMedicationWizard() {
  const navigate = useNavigate()
  const { id: editId } = useParams()
  const existing = useLiveQuery(async () => {
    if (!editId) return null
    return (await getMedicationById(editId)) ?? null
  }, [editId])
  const formRef = useRef<WizardFormState>(initialForm)
  const formElRef = useRef<HTMLFormElement>(null)
  const [form, setForm] = useState<WizardFormState>(initialForm)
  const [errors, setErrors] = useState<WizardErrors>({})
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [hydrated, setHydrated] = useState(!editId)

  useEffect(() => {
    if (editId) return
    formRef.current = { ...initialForm }
    setForm({ ...initialForm })
    setErrors({})
    setSaveError(null)
    setHydrated(true)
  }, [editId])

  useEffect(() => {
    if (!editId || !existing || hydrated) return
    const next = medicationToWizardState(existing)
    formRef.current = next
    setForm(next)
    setHydrated(true)
  }, [editId, existing, hydrated])

  const applyForm = (
    next: WizardFormState,
    clearErrorKeys?: string[],
  ) => {
    formRef.current = next
    setForm(next)
    if (clearErrorKeys?.length) {
      setErrors((prev) => {
        const updated = { ...prev }
        for (const key of clearErrorKeys) {
          delete updated[key]
        }
        return updated
      })
    }
  }

  const patch = (partial: Partial<WizardFormState>) => {
    applyForm({ ...formRef.current, ...partial }, Object.keys(partial))
  }

  const commitFormFromDom = (): WizardFormState => {
    const merged = mergeWizardFormFromDom(formRef.current, formElRef.current)
    formRef.current = merged
    setForm(merged)
    return merged
  }

  const persistMedication = async (current: WizardFormState) => {
    setSaving(true)
    try {
      const prior = editId ? await getMedicationById(editId) : undefined
      const entry = buildMedicationFromWizard(
        current,
        prior ? { id: prior.id, createdAt: prior.createdAt } : undefined,
      )
      if (prior) await updateMedication(entry)
      else await createMedication(entry)
      await syncDoseLogsForMedication(entry.id)
      navigate(prior ? `/medication/${entry.id}` : '/', { replace: true })
    } catch (err) {
      console.error(err)
      setSaveError(pl.wizard.saveFailed)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setSaving(false)
    }
  }

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaveError(null)
    const current = commitFormFromDom()
    const validation = validateWizard(current)
    if (Object.keys(validation).length > 0) {
      setErrors(validation)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    setErrors({})
    void persistMedication(current)
  }

  const toggleWeekday = (day: number) => {
    const current = formRef.current
    const has = current.weekdayDays.includes(day)
    const weekdayDays = has
      ? current.weekdayDays.filter((d) => d !== day)
      : [...current.weekdayDays, day]
    applyForm({ ...current, weekdayDays }, ['weekdays'])
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
      <div className="mb-4">
        <Link
          to={editId ? `/medication/${editId}` : '/'}
          className="inline-flex min-h-11 items-center text-sm font-medium text-brand"
        >
          ← {pl.wizard.back}
        </Link>
      </div>

      <h2 className="text-xl font-semibold">
        {editId ? pl.wizard.editTitle : pl.wizard.title}
      </h2>

      {Object.keys(errors).length > 0 && (
        <div
          className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200"
          role="alert"
        >
          <p>{pl.wizard.fixErrors}</p>
          <ul className="mt-2 list-inside list-disc">
            {Object.values(errors)
              .filter(Boolean)
              .map((message) => (
                <li key={message}>{message}</li>
              ))}
          </ul>
        </div>
      )}

      {saveError && (
        <p
          className="mt-3 rounded-xl border border-red-300 bg-red-100 px-3 py-2 text-sm text-red-900 dark:border-red-800 dark:bg-red-950/60 dark:text-red-100"
          role="alert"
        >
          {saveError}
        </p>
      )}

      <form
        ref={formElRef}
        className="mt-6 space-y-6"
        onSubmit={handleFormSubmit}
        noValidate
      >
        <section className="space-y-3">
          <SectionTitle>{pl.wizard.sections.basic}</SectionTitle>
          <label className="block">
            <span className="text-sm font-medium">{pl.wizard.fields.name}</span>
            <input
              name="name"
              className={`${selectClassName} bg-[var(--color-surface-elevated)]`}
              value={form.name}
              onChange={(e) => patch({ name: e.target.value })}
              onBlur={(e) => patch({ name: e.target.value })}
              autoComplete="off"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-600">{errors.name}</p>
            )}
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <FormSelect
              label={pl.wizard.fields.kind}
              name="kind"
              value={form.kind}
              onChange={(kind) => patch({ kind: kind as MedicationKind })}
              error={errors.kind}
            >
              {KIND_OPTIONS.map((k) => (
                <option key={k} value={k}>
                  {pl.wizard.kinds[k]}
                </option>
              ))}
            </FormSelect>
            <FormSelect
              label={pl.wizard.fields.form}
              name="form"
              value={form.form}
              onChange={(f) => patch({ form: f as MedicationForm })}
              error={errors.form}
            >
              {FORM_OPTIONS.map((f) => (
                <option key={f} value={f}>
                  {pl.wizard.forms[f]}
                </option>
              ))}
            </FormSelect>
          </div>
        </section>

        <section className="space-y-3">
          <SectionTitle>{pl.wizard.sections.intake}</SectionTitle>
          <label className="block">
            <span className="text-sm font-medium">{pl.wizard.fields.dose}</span>
            <input
              name="doseText"
              className={`${selectClassName} bg-[var(--color-surface-elevated)]`}
              value={form.doseText}
              onChange={(e) => patch({ doseText: e.target.value })}
              onBlur={(e) => patch({ doseText: e.target.value })}
            />
            {errors.doseText && (
              <p className="mt-1 text-xs text-red-600">{errors.doseText}</p>
            )}
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <FormSelect
              label={pl.wizard.fields.emptyStomach}
              value={form.emptyStomach}
              onChange={(v) =>
                patch({ emptyStomach: v as WizardFormState['emptyStomach'] })
              }
              error={errors.emptyStomach}
            >
              {(['yes', 'no', 'na'] as const).map((v) => (
                <option key={v} value={v}>
                  {pl.wizard.emptyStomach[v]}
                </option>
              ))}
            </FormSelect>
            <FormSelect
              label={pl.wizard.fields.meal}
              value={form.meal || 'skipped'}
              onChange={(v) => patch({ meal: v as WizardFormState['meal'] })}
            >
              {(['before', 'during', 'after', 'skipped'] as const).map((v) => (
                <option key={v} value={v}>
                  {pl.wizard.meal[v]}
                </option>
              ))}
            </FormSelect>
          </div>
        </section>

        <section className="space-y-3">
          <SectionTitle>{pl.wizard.sections.schedule}</SectionTitle>
          <FormSelect
            label={pl.wizard.fields.schedule}
            value={form.scheduleType}
            onChange={(t) =>
              patch({ scheduleType: t as Schedule['type'] })
            }
            error={errors.scheduleType}
          >
            {SCHEDULE_OPTIONS.map((t) => (
              <option key={t} value={t}>
                {pl.wizard.schedules[t]}
              </option>
            ))}
          </FormSelect>

          {form.scheduleType !== 'asNeeded' && (
            <label className="block">
              <span className="text-sm font-medium">{pl.wizard.fields.times}</span>
              <input
                name="timesRaw"
                className={`${selectClassName} bg-[var(--color-surface-elevated)]`}
                value={form.timesRaw}
                onChange={(e) => patch({ timesRaw: e.target.value })}
                onBlur={(e) => patch({ timesRaw: e.target.value })}
                placeholder="07:30, 20:00"
              />
              {errors.times && (
                <p className="mt-1 text-xs text-red-600">{errors.times}</p>
              )}
            </label>
          )}

          {form.scheduleType === 'weekdays' && (
            <div>
              <p className="text-sm font-medium">{pl.wizard.fields.weekdays}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {DAY_LABELS.map((label, day) => (
                  <button
                    key={day}
                    type="button"
                    className={`min-h-9 min-w-9 rounded-lg border text-xs ${
                      form.weekdayDays.includes(day)
                        ? 'border-brand bg-brand/10 text-brand'
                        : 'border-[var(--color-border)]'
                    }`}
                    onClick={() => toggleWeekday(day)}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {errors.weekdays && (
                <p className="mt-1 text-xs text-red-600">{errors.weekdays}</p>
              )}
            </div>
          )}

          {form.scheduleType === 'everyNDays' && (
            <label className="block text-sm">
              {pl.wizard.fields.everyNDays}
              <input
                type="number"
                min={2}
                name="everyNInterval"
                className={selectClassName}
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
            <FormSelect
              label={pl.wizard.fields.weeklyDay}
              value={String(form.weeklyDay)}
              onChange={(v) => patch({ weeklyDay: Number(v) })}
            >
              {DAY_LABELS.map((label, day) => (
                <option key={day} value={day}>
                  {label}
                </option>
              ))}
            </FormSelect>
          )}

          {form.scheduleType === 'monthly' && (
            <label className="block text-sm">
              {pl.wizard.fields.monthlyDay}
              <input
                type="number"
                min={1}
                max={28}
                name="monthlyDay"
                className={selectClassName}
                value={form.monthlyDay}
                onChange={(e) => patch({ monthlyDay: Number(e.target.value) })}
              />
            </label>
          )}

          {form.scheduleType === 'cycle' && (
            <div className="grid grid-cols-2 gap-3">
              <label className="text-sm">
                {pl.wizard.fields.cycleActive}
                <input
                  type="number"
                  min={1}
                  name="cycleActive"
                  className={selectClassName}
                  value={form.cycleActive}
                  onChange={(e) =>
                    patch({ cycleActive: Number(e.target.value) })
                  }
                />
              </label>
              <label className="text-sm">
                {pl.wizard.fields.cycleBreak}
                <input
                  type="number"
                  min={1}
                  name="cycleBreak"
                  className={selectClassName}
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
                name="dateStart"
                className={selectClassName}
                value={form.dateStart}
                onChange={(e) => patch({ dateStart: e.target.value })}
              />
            </label>
            <label className="text-sm">
              {pl.wizard.fields.dateTo}
              <input
                type="date"
                name="dateEnd"
                className={selectClassName}
                value={form.dateEnd}
                onChange={(e) => patch({ dateEnd: e.target.value })}
              />
            </label>
          </div>
        </section>

        <section className="space-y-3">
          <SectionTitle>{pl.wizard.sections.notes}</SectionTitle>
          <label className="block">
            <span className="text-sm font-medium">{pl.wizard.fields.purpose}</span>
            <input
              name="purpose"
              className={`${selectClassName} bg-[var(--color-surface-elevated)]`}
              value={form.purpose}
              onChange={(e) => patch({ purpose: e.target.value })}
              placeholder="np. tarczyca, odporność"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium">{pl.wizard.fields.note}</span>
            <textarea
              name="note"
              className="mt-1 w-full min-h-20 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3 py-2 text-sm"
              value={form.note}
              onChange={(e) => patch({ note: e.target.value })}
            />
          </label>
        </section>

        <section className="space-y-3">
          <SectionTitle>{pl.wizard.sections.appearance}</SectionTitle>
          <fieldset>
            <legend className="text-sm font-medium">{pl.wizard.fields.color}</legend>
            <MedicationColorPicker
              value={form.color}
              onChange={(color) => patch({ color })}
            />
          </fieldset>
          <fieldset>
            <legend className="text-sm font-medium">{pl.wizard.fields.icon}</legend>
            <MedicationIconPicker
              value={form.icon}
              onChange={(icon) => patch({ icon })}
            />
          </fieldset>
        </section>

        <button
          type="submit"
          disabled={saving}
          className="min-h-12 w-full rounded-xl bg-brand font-semibold text-white disabled:opacity-60"
        >
          {saving ? pl.wizard.saving : pl.wizard.save}
        </button>
      </form>
    </div>
  )
}
