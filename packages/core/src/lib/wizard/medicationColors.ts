/** Preset accent colors for medications (hex, lowercase). Kept visually distinct. */
export const MEDICATION_COLOR_OPTIONS = [
  '#f07a6a',
  '#f2a33a',
  '#e5c24a',
  '#2fa66b',
  '#4c8df6',
  '#8b7cf6',
] as const

export const DEFAULT_MEDICATION_COLOR = MEDICATION_COLOR_OPTIONS[3]

export function normalizeMedicationColor(color: string): string {
  const trimmed = color.trim().toLowerCase()
  if (/^#[0-9a-f]{6}$/.test(trimmed)) return trimmed
  return DEFAULT_MEDICATION_COLOR
}

export function isMedicationColorOption(color: string): boolean {
  const normalized = normalizeMedicationColor(color)
  return (MEDICATION_COLOR_OPTIONS as readonly string[]).includes(normalized)
}

export function medicationColorChoices(current: string): string[] {
  void current
  return [...MEDICATION_COLOR_OPTIONS]
}
