/** Curated icons for the medication wizard (single grapheme each). */
export const MEDICATION_ICON_OPTIONS = [
  '💊',
  '💉',
  '🩹',
  '💧',
  '🧴',
  '🌡️',
  '🩺',
  '⚕️',
  '❤️',
  '🫀',
  '🧠',
  '🦷',
  '👁️',
  '🤧',
  '🌿',
  '😴',
  '⚡',
  '🤕',
  '🍼',
] as const

export type MedicationIconId = (typeof MEDICATION_ICON_OPTIONS)[number]

const OPTION_SET = new Set<string>(MEDICATION_ICON_OPTIONS)

/** Older builds stored SVG icon ids — map to emoji for display. */
export const LEGACY_ICON_ID_TO_EMOJI: Record<string, string> = {
  'pill-teal': '💊',
  'pill-red': '💊',
  'pill-blue': '💊',
  'pill-white': '💊',
  'pill-yellow': '💊',
  'pill-purple': '💊',
  'pill-orange': '💊',
  'round-pink': '💊',
  'capsule-red-white': '💊',
  'capsule-purple-white': '💊',
  'capsule-blue-white': '💊',
  'capsule-green': '💊',
  'capsule-yellow-cream': '💊',
  'capsule-gray': '💊',
  syringe: '💉',
  drops: '💧',
  bandage: '🩹',
  sachet: '🧴',
  thermometer: '🌡️',
  stethoscope: '🩺',
}

export function resolveMedicationIconDisplay(icon: string): string {
  if (OPTION_SET.has(icon)) return icon
  return LEGACY_ICON_ID_TO_EMOJI[icon] ?? icon
}

export function isMedicationIconOption(icon: string): boolean {
  return OPTION_SET.has(icon)
}

export function medicationIconChoices(current: string): string[] {
  const normalized = resolveMedicationIconDisplay(current)
  if (!current || isMedicationIconOption(normalized)) {
    return [...MEDICATION_ICON_OPTIONS]
  }
  return [current, ...MEDICATION_ICON_OPTIONS]
}

export const DEFAULT_MEDICATION_ICON: MedicationIconId = '💊'

export function medicationIconLabel(icon: string): string {
  return resolveMedicationIconDisplay(icon)
}
