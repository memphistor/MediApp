import { medicationAccentColor, medicationAccentSurface } from '@/lib/medication/medicationAccent'
import { MedicationIconGraphic } from '@/components/medication/MedicationIconGraphic'

type MedicationIconBadgeProps = {
  icon: string
  color: string | undefined
  size?: number
  className?: string
}

export function MedicationIconBadge({
  icon,
  color,
  size = 30,
  className = '',
}: MedicationIconBadgeProps) {
  const accent = medicationAccentColor(color)
  const box = size + 14

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-xl border-2 ${className}`}
      style={{
        width: box,
        height: box,
        borderColor: accent,
        backgroundColor: medicationAccentSurface(color ?? accent),
      }}
      aria-hidden
    >
      <MedicationIconGraphic icon={icon} size={size} accentColor={accent} />
    </span>
  )
}

export { medicationAccentColor, medicationAccentSoftFill } from '@/lib/medication/medicationAccent'
