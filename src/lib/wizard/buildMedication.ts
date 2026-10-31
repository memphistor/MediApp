import { isValidTimeHHmm, parseTimesInput } from '@/lib/dates'
import type {
  EmptyStomachNote,
  MealTiming,
  MedicationEntry,
  MedicationForm,
  MedicationKind,
  Schedule,
} from '@/types/medication'

export interface WizardFormState {
  name: string
  kind: MedicationKind | ''
  form: MedicationForm | ''
  doseText: string
  emptyStomach: EmptyStomachNote | ''
  meal: MealTiming | 'skipped' | ''
  timesRaw: string
  scheduleType: Schedule['type'] | ''
  weekdayDays: number[]
  everyNInterval: number
  weeklyDay: number
  monthlyDay: number
  cycleActive: number
  cycleBreak: number
  dateStart: string
  dateEnd: string
  purpose: string
  note: string
  color: string
  icon: string
}

export type WizardErrors = Partial<Record<string, string>>

export function validateWizard(state: WizardFormState): WizardErrors {
  const errors: WizardErrors = {}
  if (!state.name.trim()) errors.name = 'Podaj nazwę.'
  if (!state.kind) errors.kind = 'Wybierz rodzaj.'
  if (!state.form) errors.form = 'Wybierz formę.'
  if (!state.doseText.trim()) errors.doseText = 'Podaj dawkę (własny opis).'
  if (!state.emptyStomach) errors.emptyStomach = 'Wybierz opcję lub „nie dotyczy”.'
  if (!state.scheduleType) errors.scheduleType = 'Wybierz częstotliwość.'

  const times = parseTimesInput(state.timesRaw)
  if (state.scheduleType !== 'asNeeded') {
    if (times.length === 0) errors.times = 'Podaj co najmniej jedną godzinę (HH:mm).'
    else if (times.some((t) => !isValidTimeHHmm(t))) {
      errors.times = 'Użyj formatu HH:mm, np. 07:30.'
    }
  }

  if (state.scheduleType === 'weekdays' && state.weekdayDays.length === 0) {
    errors.weekdays = 'Zaznacz co najmniej jeden dzień.'
  }
  if (state.scheduleType === 'everyNDays' && state.everyNInterval < 2) {
    errors.everyN = 'Interwał musi być co najmniej 2 dni.'
  }

  return errors
}

const STEP_ERROR_KEYS: Record<number, string[]> = {
  1: ['name', 'kind', 'form'],
  2: ['doseText', 'emptyStomach'],
  3: ['scheduleType', 'times', 'weekdays', 'everyN'],
}

export function validateWizardStep(
  step: number,
  state: WizardFormState,
): WizardErrors {
  if (step >= 4) return {}
  const all = validateWizard(state)
  const keys = STEP_ERROR_KEYS[step] ?? []
  const errors: WizardErrors = {}
  for (const key of keys) {
    if (all[key]) errors[key] = all[key]
  }
  return errors
}

export function firstWizardStepWithErrors(errors: WizardErrors): number | null {
  for (const [step, keys] of Object.entries(STEP_ERROR_KEYS)) {
    if (keys.some((key) => errors[key])) return Number(step)
  }
  return null
}

function buildSchedule(state: WizardFormState): Schedule {
  switch (state.scheduleType) {
    case 'daily':
      return { type: 'daily' }
    case 'weekdays':
      return { type: 'weekdays', days: [...state.weekdayDays].sort() }
    case 'everyNDays':
      return { type: 'everyNDays', interval: state.everyNInterval }
    case 'weekly':
      return { type: 'weekly', weekday: state.weeklyDay }
    case 'monthly':
      return { type: 'monthly', dayOfMonth: state.monthlyDay }
    case 'cycle':
      return {
        type: 'cycle',
        activeDays: state.cycleActive,
        breakDays: state.cycleBreak,
      }
    case 'asNeeded':
      return { type: 'asNeeded' }
    default:
      return { type: 'daily' }
  }
}

export function medicationToWizardState(entry: MedicationEntry): WizardFormState {
  const schedule = entry.schedule
  return {
    name: entry.name,
    kind: entry.kind,
    form: entry.form,
    doseText: entry.doseText,
    emptyStomach: entry.onEmptyStomach,
    meal: entry.mealTiming ?? 'skipped',
    timesRaw: entry.times.join(', '),
    scheduleType: schedule.type,
    weekdayDays: schedule.type === 'weekdays' ? [...schedule.days] : [1, 2, 3, 4, 5],
    everyNInterval: schedule.type === 'everyNDays' ? schedule.interval : 2,
    weeklyDay: schedule.type === 'weekly' ? schedule.weekday : 1,
    monthlyDay: schedule.type === 'monthly' ? schedule.dayOfMonth : 1,
    cycleActive: schedule.type === 'cycle' ? schedule.activeDays : 21,
    cycleBreak: schedule.type === 'cycle' ? schedule.breakDays : 7,
    dateStart: entry.dateRange?.start ?? '',
    dateEnd: entry.dateRange?.end ?? '',
    purpose: entry.purposeLabel ?? '',
    note: entry.userNote ?? '',
    color: entry.color,
    icon: entry.icon,
  }
}

export function buildMedicationFromWizard(
  state: WizardFormState,
  existing?: Pick<MedicationEntry, 'id' | 'createdAt'>,
): MedicationEntry {
  const now = new Date().toISOString()
  const times =
    state.scheduleType === 'asNeeded' ? [] : parseTimesInput(state.timesRaw)

  const dateRange =
    state.dateStart.trim() !== ''
      ? {
          start: state.dateStart,
          end: state.dateEnd.trim() !== '' ? state.dateEnd : undefined,
        }
      : undefined

  return {
    id: existing?.id ?? crypto.randomUUID(),
    name: state.name.trim(),
    kind: state.kind as MedicationKind,
    form: state.form as MedicationForm,
    doseText: state.doseText.trim(),
    onEmptyStomach: state.emptyStomach as EmptyStomachNote,
    mealTiming: state.meal && state.meal !== 'skipped' ? state.meal : undefined,
    times,
    schedule: buildSchedule(state),
    dateRange,
    purposeLabel: state.purpose.trim() || undefined,
    color: state.color,
    icon: state.icon || '💊',
    userNote: state.note.trim() || undefined,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  }
}
