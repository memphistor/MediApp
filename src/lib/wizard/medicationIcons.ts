/** Icon ids stored on medications (SVG in UI; legacy emoji still supported). */
export const MEDICATION_ICON_OPTIONS = [
  'pill-teal',
  'pill-red',
  'pill-blue',
  'pill-white',
  'pill-yellow',
  'pill-purple',
  'pill-orange',
  'capsule-red-white',
  'capsule-purple-white',
  'capsule-green',
  'capsule-yellow-cream',
  'round-pink',
  'syringe',
  'drops',
  'bandage',
  'sachet',
  'thermometer',
  'stethoscope',
] as const

export type MedicationIconId = (typeof MEDICATION_ICON_OPTIONS)[number]

const OPTION_SET = new Set<string>(MEDICATION_ICON_OPTIONS)

export function isMedicationIconOption(icon: string): boolean {
  return OPTION_SET.has(icon)
}

export function medicationIconChoices(current: string): string[] {
  if (!current || isMedicationIconOption(current)) {
    return [...MEDICATION_ICON_OPTIONS]
  }
  return [current, ...MEDICATION_ICON_OPTIONS]
}

export const DEFAULT_MEDICATION_ICON: MedicationIconId = 'pill-teal'

/** Polish labels for picker accessibility / select options. */
export const MEDICATION_ICON_LABELS: Record<MedicationIconId, string> = {
  'pill-teal': 'Tabletka zielona',
  'pill-red': 'Tabletka czerwona',
  'pill-blue': 'Tabletka niebieska',
  'pill-white': 'Tabletka biała',
  'pill-yellow': 'Tabletka żółta',
  'pill-purple': 'Tabletka fioletowa',
  'pill-orange': 'Tabletka pomarańczowa',
  'capsule-red-white': 'Kapsułka czerwono-biała',
  'capsule-purple-white': 'Kapsułka fioletowo-biała',
  'capsule-green': 'Kapsułka zielona',
  'capsule-yellow-cream': 'Kapsułka żółta',
  'round-pink': 'Tabletka różowa',
  syringe: 'Strzykawka',
  drops: 'Krople',
  bandage: 'Plaster',
  sachet: 'Saszetka',
  thermometer: 'Termometr',
  stethoscope: 'Stetoskop',
}

export function medicationIconLabel(icon: string): string {
  if (isMedicationIconOption(icon)) {
    return MEDICATION_ICON_LABELS[icon as MedicationIconId]
  }
  const legacy: Record<string, string> = {
    'capsule-blue-white': 'Kapsułka fioletowo-biała',
    'capsule-gray': 'Kapsułka żółto-kremowa',
  }
  return legacy[icon] ?? icon
}

export function isLegacyEmojiIcon(icon: string): boolean {
  if (isMedicationIconOption(icon)) return false
  if (LEGACY_MEDICATION_ICON_IDS.has(icon)) return false
  return icon.length <= 4 && /\p{Extended_Pictographic}/u.test(icon)
}

/** Older icon ids still rendered as SVG (not shown in picker). */
export const LEGACY_MEDICATION_ICON_IDS = new Set([
  'capsule-blue-white',
  'capsule-gray',
])
