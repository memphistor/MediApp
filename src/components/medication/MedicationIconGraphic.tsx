import {
  medicationIconLabel,
  resolveMedicationIconDisplay,
} from '@/lib/wizard/medicationIcons'

type MedicationIconGraphicProps = {
  icon: string
  size?: number
  className?: string
  title?: string
  /** Ignored — emoji icons; kept for call-site compatibility. */
  accentColor?: string
}

export function MedicationIconGraphic({
  icon,
  size = 28,
  className = '',
  title,
}: MedicationIconGraphicProps) {
  const display = resolveMedicationIconDisplay(icon)
  const label = title ?? medicationIconLabel(icon)

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center leading-none ${className}`}
      style={{ fontSize: size * 0.85 }}
      role="img"
      aria-label={label}
    >
      {display}
    </span>
  )
}
