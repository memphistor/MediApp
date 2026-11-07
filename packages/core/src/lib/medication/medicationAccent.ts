import { normalizeMedicationColor } from '@/lib/wizard/medicationColors'

export function medicationAccentColor(color: string | undefined): string {
  return normalizeMedicationColor(color ?? '')
}

/** Background for icon tile / chips (works in modern browsers). */
export function medicationAccentSurface(color: string): string {
  const c = medicationAccentColor(color)
  return `color-mix(in srgb, ${c} 28%, var(--color-surface-elevated))`
}

export function medicationAccentSoftFill(color: string): string {
  const c = medicationAccentColor(color)
  return `color-mix(in srgb, ${c} 18%, transparent)`
}
