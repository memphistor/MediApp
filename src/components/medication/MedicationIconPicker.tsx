import { medicationIconChoices } from '@/lib/wizard/medicationIcons'

type MedicationIconPickerProps = {
  value: string
  onChange: (icon: string) => void
}

export function MedicationIconPicker({
  value,
  onChange,
}: MedicationIconPickerProps) {
  const choices = medicationIconChoices(value)

  return (
    <div
      className="mt-2 grid grid-cols-5 gap-2 sm:grid-cols-6"
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
            className={`flex min-h-12 items-center justify-center rounded-xl border text-2xl transition-colors ${
              selected
                ? 'border-brand bg-brand/10 ring-2 ring-brand ring-offset-1'
                : 'border-[var(--color-border)] bg-[var(--color-surface-elevated)] hover:border-brand/50'
            }`}
            onClick={() => onChange(icon)}
          >
            {icon}
          </button>
        )
      })}
    </div>
  )
}
