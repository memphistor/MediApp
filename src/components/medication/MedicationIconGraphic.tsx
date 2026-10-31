import {
  isLegacyEmojiIcon,
  isMedicationIconOption,
  LEGACY_MEDICATION_ICON_IDS,
  medicationIconLabel,
} from '@/lib/wizard/medicationIcons'

type MedicationIconGraphicProps = {
  icon: string
  size?: number
  className?: string
  title?: string
  /** When set, pill/capsule shapes use this instead of preset palette (medication accent). */
  accentColor?: string
}

function Pill({
  fill,
  stroke = 'rgba(0,0,0,0.15)',
}: {
  fill: string
  stroke?: string
}) {
  return (
    <ellipse cx="16" cy="16" rx="11" ry="7" fill={fill} stroke={stroke} strokeWidth="1" />
  )
}

function Capsule({ left, right }: { left: string; right: string }) {
  return (
    <>
      <path
        d="M8 16a8 8 0 0 1 8-8h0a8 8 0 0 1 0 16H16a8 8 0 0 1-8-8z"
        fill={left}
      />
      <path
        d="M16 8h0a8 8 0 0 1 8 8 8 8 0 0 1-8 8h0a8 8 0 0 1 0-16z"
        fill={right}
      />
      <ellipse
        cx="16"
        cy="16"
        rx="12"
        ry="8"
        fill="none"
        stroke="rgba(0,0,0,0.12)"
        strokeWidth="1"
      />
    </>
  )
}

function isPillOrCapsuleIcon(icon: string): boolean {
  return (
    icon.startsWith('pill-') ||
    icon === 'round-pink' ||
    icon.startsWith('capsule-') ||
    LEGACY_MEDICATION_ICON_IDS.has(icon)
  )
}

function pillFill(icon: string, preset: string, accentColor?: string): string {
  if (accentColor && isPillOrCapsuleIcon(icon)) return accentColor
  return preset
}

function capsuleLeft(icon: string, preset: string, accentColor?: string): string {
  if (accentColor && isPillOrCapsuleIcon(icon)) return accentColor
  return preset
}

function IconSvg({
  icon,
  size,
  accentColor,
}: {
  icon: string
  size: number
  accentColor?: string
}) {
  const body = (() => {
    switch (icon) {
      case 'pill-teal':
        return <Pill fill={pillFill(icon, '#16a34a', accentColor)} />
      case 'pill-red':
        return <Pill fill={pillFill(icon, '#dc2626', accentColor)} />
      case 'pill-blue':
        return <Pill fill={pillFill(icon, '#2563eb', accentColor)} />
      case 'pill-white':
        return (
          <Pill
            fill={pillFill(icon, '#f8fafc', accentColor)}
            stroke={accentColor ? 'rgba(0,0,0,0.2)' : '#64748b'}
          />
        )
      case 'pill-yellow':
        return <Pill fill={pillFill(icon, '#eab308', accentColor)} />
      case 'pill-purple':
        return <Pill fill={pillFill(icon, '#9333ea', accentColor)} />
      case 'pill-orange':
        return <Pill fill={pillFill(icon, '#ea580c', accentColor)} />
      case 'round-pink':
        return <Pill fill={pillFill(icon, '#ec4899', accentColor)} />
      case 'capsule-red-white':
        return (
          <Capsule
            left={capsuleLeft(icon, '#dc2626', accentColor)}
            right="#f8fafc"
          />
        )
      case 'capsule-purple-white':
        return (
          <Capsule
            left={capsuleLeft(icon, '#9333ea', accentColor)}
            right="#f8fafc"
          />
        )
      case 'capsule-blue-white':
        return (
          <Capsule
            left={capsuleLeft(icon, '#9333ea', accentColor)}
            right="#f8fafc"
          />
        )
      case 'capsule-green':
        return (
          <Capsule
            left={capsuleLeft(icon, '#16a34a', accentColor)}
            right="#bbf7d0"
          />
        )
      case 'capsule-yellow-cream':
        return (
          <Capsule
            left={capsuleLeft(icon, '#eab308', accentColor)}
            right="#fef9c3"
          />
        )
      case 'capsule-gray':
        return (
          <Capsule
            left={capsuleLeft(icon, '#eab308', accentColor)}
            right="#fef9c3"
          />
        )
      case 'syringe':
        return (
          <>
            <rect x="6" y="13" width="14" height="6" rx="2" fill="#94a3b8" />
            <rect x="18" y="14" width="8" height="4" rx="1" fill="#64748b" />
            <path d="M6 16H4v-2h2" stroke="#64748b" strokeWidth="2" />
            <line x1="22" y1="16" x2="26" y2="16" stroke="#475569" strokeWidth="2" />
          </>
        )
      case 'drops':
        return (
          <path
            d="M16 6c0 0-7 8-7 12a7 7 0 0 0 14 0c0-4-7-12-7-12z"
            fill={accentColor ?? '#f59e0b'}
            stroke={accentColor ? 'rgba(0,0,0,0.2)' : '#d97706'}
            strokeWidth="1"
          />
        )
      case 'bandage':
        return (
          <>
            <rect
              x="7"
              y="7"
              width="18"
              height="18"
              rx="4"
              fill="#fecaca"
              stroke="#f87171"
              strokeWidth="1"
            />
            <circle cx="12" cy="12" r="1.5" fill="#ef4444" />
            <circle cx="20" cy="12" r="1.5" fill="#ef4444" />
            <circle cx="12" cy="20" r="1.5" fill="#ef4444" />
            <circle cx="20" cy="20" r="1.5" fill="#ef4444" />
          </>
        )
      case 'sachet':
        return (
          <path
            d="M10 8h12l4 6-10 12L6 14l4-6z"
            fill="#e2e8f0"
            stroke="#94a3b8"
            strokeWidth="1"
            strokeLinejoin="round"
          />
        )
      case 'thermometer':
        return (
          <>
            <rect x="14" y="6" width="4" height="16" rx="2" fill="#f1f5f9" stroke="#64748b" />
            <circle cx="16" cy="22" r="4" fill="#ef4444" />
            <rect x="15" y="9" width="2" height="8" fill="#ef4444" />
          </>
        )
      case 'stethoscope':
        return (
          <>
            <path
              d="M10 10a6 6 0 0 1 12 0v5a4 4 0 0 1-8 0"
              fill="none"
              stroke="#475569"
              strokeWidth="2"
            />
            <circle cx="16" cy="22" r="3" fill={accentColor ?? '#16a34a'} />
          </>
        )
      default:
        return <Pill fill={accentColor ?? '#16a34a'} />
    }
  })()

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={size}
      height={size}
      aria-hidden
    >
      {body}
    </svg>
  )
}

export function MedicationIconGraphic({
  icon,
  size = 28,
  className = '',
  title,
  accentColor,
}: MedicationIconGraphicProps) {
  const label = title ?? medicationIconLabel(icon)

  if (isLegacyEmojiIcon(icon)) {
    return (
      <span
        className={`inline-flex items-center justify-center leading-none ${className}`}
        style={{ fontSize: size * 0.85 }}
        role="img"
        aria-label={label}
      >
        {icon}
      </span>
    )
  }

  const id =
    isMedicationIconOption(icon) || LEGACY_MEDICATION_ICON_IDS.has(icon)
      ? icon
      : 'pill-teal'

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center ${className}`}
      role="img"
      aria-label={label}
    >
      <IconSvg icon={id} size={size} accentColor={accentColor} />
    </span>
  )
}
