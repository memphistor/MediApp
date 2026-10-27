import { useState } from 'react'
import { Link } from 'react-router-dom'
import { pl } from '@/i18n/pl'
import type { MedicationKind, MedicationForm, Schedule } from '@/types/medication'

const TOTAL_STEPS = 5

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

export function AddMedicationWizard() {
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [kind, setKind] = useState<MedicationKind | ''>('')
  const [form, setForm] = useState<MedicationForm | ''>('')
  const [doseText, setDoseText] = useState('')
  const [emptyStomach, setEmptyStomach] = useState<'yes' | 'no' | 'na' | ''>('')
  const [meal, setMeal] = useState<'before' | 'during' | 'after' | 'skipped' | ''>(
    '',
  )
  const [times, setTimes] = useState('')
  const [scheduleType, setScheduleType] = useState<Schedule['type'] | ''>('')
  const [purpose, setPurpose] = useState('')
  const [note, setNote] = useState('')
  const [color, setColor] = useState('#0f766e')
  const [icon, setIcon] = useState('💊')

  return (
    <div className="pb-8">
      <div className="mb-4 flex items-center justify-between">
        <Link
          to="/"
          className="min-h-11 min-w-11 text-sm font-medium text-brand"
        >
          ← {pl.wizard.back}
        </Link>
        <span className="text-sm text-[var(--color-text-muted)]">
          {pl.wizard.step} {step} {pl.wizard.of} {TOTAL_STEPS}
        </span>
      </div>

      <h2 className="text-xl font-semibold">{pl.wizard.title}</h2>

      <div className="mt-6 space-y-4">
        {step === 1 && (
          <>
            <label className="block">
              <span className="text-sm font-medium">{pl.wizard.fields.name}</span>
              <input
                className="mt-1 w-full min-h-12 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={pl.wizard.notSelected}
                autoComplete="off"
              />
            </label>
            <fieldset>
              <legend className="text-sm font-medium">{pl.wizard.fields.kind}</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {KIND_OPTIONS.map((k) => (
                  <button
                    key={k}
                    type="button"
                    className={`min-h-11 rounded-xl border px-3 text-sm ${
                      kind === k
                        ? 'border-brand bg-brand/10 text-brand'
                        : 'border-[var(--color-border)]'
                    }`}
                    onClick={() => setKind(k)}
                  >
                    {pl.wizard.kinds[k]}
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend className="text-sm font-medium">{pl.wizard.fields.form}</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {FORM_OPTIONS.map((f) => (
                  <button
                    key={f}
                    type="button"
                    className={`min-h-11 rounded-xl border px-3 text-sm ${
                      form === f
                        ? 'border-brand bg-brand/10 text-brand'
                        : 'border-[var(--color-border)]'
                    }`}
                    onClick={() => setForm(f)}
                  >
                    {pl.wizard.forms[f]}
                  </button>
                ))}
              </div>
            </fieldset>
          </>
        )}

        {step === 2 && (
          <>
            <label className="block">
              <span className="text-sm font-medium">{pl.wizard.fields.dose}</span>
              <input
                className="mt-1 w-full min-h-12 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3"
                value={doseText}
                onChange={(e) => setDoseText(e.target.value)}
              />
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
                      emptyStomach === v
                        ? 'border-brand bg-brand/10'
                        : 'border-[var(--color-border)]'
                    }`}
                    onClick={() => setEmptyStomach(v)}
                  >
                    {pl.wizard.emptyStomach[v]}
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend className="text-sm font-medium">{pl.wizard.fields.meal}</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {(['before', 'during', 'after', 'skipped'] as const).map((v) => (
                  <button
                    key={v}
                    type="button"
                    className={`min-h-11 rounded-xl border px-3 text-sm ${
                      meal === v
                        ? 'border-brand bg-brand/10'
                        : 'border-[var(--color-border)]'
                    }`}
                    onClick={() => setMeal(v)}
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
            <label className="block">
              <span className="text-sm font-medium">{pl.wizard.fields.times}</span>
              <input
                className="mt-1 w-full min-h-12 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3"
                value={times}
                onChange={(e) => setTimes(e.target.value)}
                placeholder="07:30, 20:00"
              />
            </label>
            <fieldset>
              <legend className="text-sm font-medium">{pl.wizard.fields.schedule}</legend>
              <div className="mt-2 flex flex-col gap-2">
                {SCHEDULE_OPTIONS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={`min-h-11 rounded-xl border px-3 text-left text-sm ${
                      scheduleType === t
                        ? 'border-brand bg-brand/10'
                        : 'border-[var(--color-border)]'
                    }`}
                    onClick={() => setScheduleType(t)}
                  >
                    {pl.wizard.schedules[t]}
                  </button>
                ))}
              </div>
            </fieldset>
          </>
        )}

        {step === 4 && (
          <>
            <label className="block">
              <span className="text-sm font-medium">{pl.wizard.fields.purpose}</span>
              <input
                className="mt-1 w-full min-h-12 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="np. tarczyca, odporność"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium">{pl.wizard.fields.note}</span>
              <textarea
                className="mt-1 w-full min-h-24 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3 py-2"
                value={note}
                onChange={(e) => setNote(e.target.value)}
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
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
              </label>
              <label className="flex flex-1 flex-col text-sm">
                Ikona (emoji)
                <input
                  className="mt-1 min-h-12 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3 text-2xl"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  maxLength={4}
                />
              </label>
            </div>
            <p className="rounded-xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-3 text-sm text-[var(--color-text-muted)]">
              {pl.wizard.saveHint}
            </p>
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
            disabled
            className="min-h-12 flex-1 rounded-xl bg-brand/50 font-semibold text-white"
            title={pl.wizard.saveHint}
          >
            {pl.wizard.save}
          </button>
        )}
      </div>
    </div>
  )
}
