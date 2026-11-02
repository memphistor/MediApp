/** Shared domain types */
export type { DoseLog, DoseStatus } from './types/dose'
export type {
  Badge,
  GamificationState,
} from './types/gamification'
export type {
  DateRange,
  EmptyStomachNote,
  MedicationEntry,
  MedicationForm,
  MedicationKind,
  Schedule,
} from './types/medication'
export type { MedicationNote } from './types/medicationNote'
export type {
  FontScale,
  ThemePreference,
  UserSettings,
} from './types/settings'

export {
  addDays,
  combineDateAndTime,
  daysBetweenCalendar,
  endOfLocalDay,
  isValidTimeHHmm,
  parseDateKey,
  parseTimesInput,
  startOfLocalDay,
  startOfWeekMonday,
  toDateKey,
  weekDayKeys,
} from './lib/dates'
export { createId } from './lib/id'

export {
  buildOccurrencesForMedication,
  doseLogId,
} from './lib/schedule/buildOccurrences'
export {
  isActiveOnDate,
  isMedicationActiveOnDate,
} from './lib/schedule/isActiveOnDate'

export {
  buildMedicationFromWizard,
  firstWizardStepWithErrors,
  medicationToWizardState,
  validateWizard,
  validateWizardStep,
  type WizardErrors,
  type WizardFormState,
} from './lib/wizard/buildMedication'
export {
  DEFAULT_MEDICATION_COLOR,
  MEDICATION_COLOR_OPTIONS,
  isMedicationColorOption,
  medicationColorChoices,
  normalizeMedicationColor,
} from './lib/wizard/medicationColors'
export {
  DEFAULT_MEDICATION_ICON,
  MEDICATION_ICON_OPTIONS,
  isMedicationIconOption,
  medicationIconChoices,
  medicationIconLabel,
  resolveMedicationIconDisplay,
} from './lib/wizard/medicationIcons'

export {
  defaultRemindersEnabled,
  isMedicationRemindersEnabled,
} from './lib/medication/medicationReminders'
export { medicationAccentColor } from './lib/medication/medicationAccent'
export {
  estimateAverageDailyStockUnits,
  formatDailyDosesLeft,
  stockAlertLevel,
  type StockAlertLevel,
} from './lib/medication/stockAlert'
export { isStockTracked, unitsPerIntake } from './lib/medication/stockUnits'

export {
  doseStatusContextFromLog,
  doseStatusPillStyle,
  isAsNeededDoseContext,
  isAsNeededMedication,
  type DoseStatusDisplayContext,
} from './lib/dose/doseStatusDisplay'

export { computeGamification } from './lib/gamification/computeGamification'
export { computeStreak } from './lib/gamification/streak'
export {
  dayComplianceTone,
  groupLogsByDateKey,
  isDayNeutral,
  isFullDay,
  scheduledDoses,
  type DayComplianceTone,
} from './lib/gamification/dayStats'
export { mergeBadges } from './lib/gamification/badges'
export { monthCompletionRate } from './lib/gamification/monthStats'
export {
  periodBounds,
  type ProgressPeriod,
} from './lib/gamification/progressPeriods'
export {
  calendarWeekBounds,
  weekPlanProgress,
} from './lib/gamification/weekProgress'
export {
  classifyDoseTiming,
  onTimeRateAmongTaken,
  timingCountsForLogs,
  timingCountsForRange,
  type DoseTimingClass,
  type DoseTimingCounts,
} from './lib/gamification/doseTiming'
export { logsForMedicationInPeriod } from './lib/gamification/medicationProgress'
export { plantEmojiForStreak } from './lib/gamification/plantStage'

export { dayComplianceToneClass } from './lib/calendar/dayComplianceStyles'
export {
  isPlannedUpcoming,
  splitHistoryLogs,
} from './lib/history/historySections'

export {
  generateProfilId,
  isValidProfilId,
} from './lib/profil/profilValidation'

export {
  SNAPSHOT_VERSION,
  assertSnapshotVersion,
  type AppSnapshot,
} from './snapshot/types'
