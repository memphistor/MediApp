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
  formatLocaleDateTime,
  formatLocaleTime,
  fromDatetimeLocalValue,
  isValidTimeHHmm,
  parseDateKey,
  parseTimesInput,
  startOfLocalDay,
  startOfWeekMonday,
  toDateKey,
  toDatetimeLocalValue,
  weekDayKeys,
} from './lib/dates'
export { createId } from './lib/id'

export {
  buildOccurrencesForMedication,
  doseLogId,
} from './lib/schedule/buildOccurrences'
export {
  isActiveOnDate,
  isEntryInDateRange,
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
export {
  buildReminderGroups,
  PERSISTENT_REMINDER_MS,
  type ReminderGroup,
} from './lib/reminders/reminderGroups'
export {
  medicationAccentColor,
  medicationAccentSurface,
} from './lib/medication/medicationAccent'
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
  dayRingProgress,
  groupLogsByDateKey,
  isDayNeutral,
  isFullDay,
  scheduledDoses,
  type DayComplianceTone,
} from './lib/gamification/dayStats'
export { BADGE_DEFINITIONS, mergeBadges } from './lib/gamification/badges'
export { monthCompletionRate } from './lib/gamification/monthStats'
export {
  periodBounds,
  PROGRESS_PERIODS,
  type ProgressPeriod,
} from './lib/gamification/progressPeriods'
export {
  calendarWeekBounds,
  weekPlanProgress,
} from './lib/gamification/weekProgress'
export {
  classifyDoseTiming,
  formatTimingDeltaMinutes,
  lastDayTimingRows,
  logsInLocalDateRange,
  onTimeRateAmongTaken,
  takenAdherenceRate,
  timingCountsForLogs,
  timingCountsForRange,
  timingLabelForLog,
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
