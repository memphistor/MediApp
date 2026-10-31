import { medicationAccentColor } from '@/lib/medication/medicationAccent'
import { MedicationIconGraphic } from '@/components/medication/MedicationIconGraphic'
import {
  medicationIconChoices,
  medicationIconLabel,
} from '@/lib/wizard/medicationIcons'

type MedicationIconPickerProps = {
  value: string
  accentColor?: string
  onChange: (icon: string) => void
}

export function MedicationIconPicker({
  value,
  accentColor,
  onChange,
}: MedicationIconPickerProps) {
  const choices = medicationIconChoices(value)
  const accent = accentColor ? medicationAccentColor(accentColor) : undefined

  return (
    <div
      className="mt-2 grid grid-cols-4 gap-2 sm:grid-cols-6"
      role="radiogroup"
      aria-label="Ikona pozycji"
    >
      {choices.map((icon) => {
        const selected = value === icon
        return (
          <button
            key={icon}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={medicationIconLabel(icon)}
            className={`flex min-h-12 items-center justify-center rounded-xl border transition-colors ${
              selected
                ? 'border-brand bg-brand/10 ring-2 ring-brand ring-offset-1'
                : 'border-[var(--color-border)] bg-[var(--color-surface-elevated)] hover:border-brand/50'
            }`}
            onClick={() => onChange(icon)}
          >
            <MedicationIconGraphic icon={icon} size={26} accentColor={accent} />
          </button>
        )
      })}
    </div>
  )
}
