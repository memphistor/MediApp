/** Preset accent colors for medications (hex, lowercase). */
export const MEDICATION_COLOR_OPTIONS = [
  '#0f766e',
  '#2563eb',
  '#7c3aed',
  '#db2777',
  '#ea580c',
  '#ca8a04',
] as const

export const DEFAULT_MEDICATION_COLOR = MEDICATION_COLOR_OPTIONS[0]

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
  const normalized = normalizeMedicationColor(current)
  if (isMedicationColorOption(normalized)) {
    return [...MEDICATION_COLOR_OPTIONS]
  }
  return [normalized, ...MEDICATION_COLOR_OPTIONS]
}
