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
  '🍊',
  '😴',
  '⚡',
  '🤕',
  '🍼',
] as const

export function isMedicationIconOption(icon: string): boolean {
  return (MEDICATION_ICON_OPTIONS as readonly string[]).includes(icon)
}

export function medicationIconChoices(current: string): string[] {
  if (!current || isMedicationIconOption(current)) {
    return [...MEDICATION_ICON_OPTIONS]
  }
  return [current, ...MEDICATION_ICON_OPTIONS]
}
