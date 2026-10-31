import { medicationColorChoices } from '@/lib/wizard/medicationColors'

type MedicationColorPickerProps = {
  value: string
  onChange: (color: string) => void
}

export function MedicationColorPicker({
  value,
  onChange,
}: MedicationColorPickerProps) {
  const choices = medicationColorChoices(value)
  const selected = value.trim().toLowerCase()

  return (
    <div
      className="mt-2 grid grid-cols-3 gap-3 sm:grid-cols-6"
      role="radiogroup"
      aria-label="Kolor pozycji"
    >
      {choices.map((color) => {
        const isSelected = selected === color
        return (
          <button
            key={color}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={`Kolor ${color}`}
            className={`flex min-h-12 items-center justify-center rounded-xl border-2 transition-shadow ${
              isSelected
                ? 'border-[var(--color-text)] ring-2 ring-brand ring-offset-2'
                : 'border-transparent hover:scale-105'
            }`}
            style={{ backgroundColor: color }}
            onClick={() => onChange(color)}
          />
        )
      })}
    </div>
  )
}
