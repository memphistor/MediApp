export type MedicationKind = 'prescription' | 'otc' | 'supplement' | 'other'

export type MedicationForm =
  | 'tablet'
  | 'capsule'
  | 'drops'
  | 'sachet'
  | 'injection'
  | 'liquid'
  | 'other'

export type EmptyStomachNote = 'yes' | 'no' | 'na'

export type MealTiming = 'before' | 'during' | 'after' | 'skipped'

export type Schedule =
  | { type: 'daily' }
  | { type: 'weekdays'; days: number[] }
  | { type: 'everyNDays'; interval: number }
  | { type: 'weekly'; weekday: number }
  | { type: 'monthly'; dayOfMonth: number }
  | { type: 'cycle'; activeDays: number; breakDays: number }
  | { type: 'asNeeded' }

export interface DateRange {
  start: string
  end?: string
}

export interface MedicationEntry {
  id: string
  name: string
  kind: MedicationKind
  form: MedicationForm
  formOtherLabel?: string
  doseText: string
  onEmptyStomach: EmptyStomachNote
  mealTiming?: MealTiming
  times: string[]
  schedule: Schedule
  dateRange?: DateRange
  purposeLabel?: string
  color: string
  icon: string
  userNote?: string
  /** Remaining units in package when stock tracking is enabled. */
  stockRemaining?: number
  /** Units consumed per intake (default 1). */
  stockUnitsPerIntake?: number
  /** When false, no push/in-app reminder groups for this entry. */
  remindersEnabled?: boolean
  createdAt: string
  updatedAt: string
}
