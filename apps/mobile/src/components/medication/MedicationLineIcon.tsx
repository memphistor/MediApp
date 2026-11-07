import { resolveMedicationIconDisplay } from '@mediapp/core'
import Svg, { Circle, Path, Rect } from 'react-native-svg'

type MedicationLineIconProps = {
  icon: string
  color: string
  size: number
}

const stroke = {
  fill: 'none' as const,
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

function glyph(icon: string, color: string) {
  const common = { ...stroke, stroke: color }
  switch (icon) {
    case '💊':
      return (
        <>
          <Rect x="3" y="9" width="18" height="6" rx="3" {...common} transform="rotate(-45 12 12)" />
          <Path d="M9.9 9.9l4.2 4.2" {...common} />
        </>
      )
    case '💉':
      return <Path d="M14.5 4.5l5 5M12.5 6.5l5 5M16.5 8.5L9 16l-2.2.6.6-2.2L14.9 6.9M7 17l-3 3" {...common} />
    case '🩹':
      return (
        <>
          <Rect x="4" y="8" width="16" height="8" rx="2" {...common} />
          <Path d="M9 12h.01M12 12h.01M15 12h.01" {...common} />
        </>
      )
    case '💧':
    case '🤧':
      return <Path d="M12 3.5c3.2 4 5.5 6.8 5.5 9.7a5.5 5.5 0 0 1-11 0c0-2.9 2.3-5.7 5.5-9.7z" {...common} />
    case '🧴':
    case '🍼':
      return (
        <>
          <Path d="M9.5 3.5h5M10.5 3.5v3M13.5 3.5v3" {...common} />
          <Rect x="6.5" y="6.5" width="11" height="14" rx="3.5" {...common} />
        </>
      )
    case '🌡️':
      return (
        <>
          <Path d="M10 14.3V5.5a2 2 0 0 1 4 0v8.8a4 4 0 1 1-4 0z" {...common} />
          <Path d="M12 9v6" {...common} />
        </>
      )
    case '🩺':
      return (
        <>
          <Path d="M6 4v6a4 4 0 0 0 8 0V4" {...common} />
          <Circle cx="17" cy="15" r="3" {...common} />
          <Path d="M14 15h0" {...common} />
        </>
      )
    case '⚕️':
      return <Path d="M12 3v18M8 7c2 2 6 2 8 0M8 17c2-2 6-2 8 0" {...common} />
    case '❤️':
    case '🫀':
      return <Path d="M12 19.5s-7-4.3-7-9.6A3.9 3.9 0 0 1 12 7.6a3.9 3.9 0 0 1 7 2.3c0 5.3-7 9.6-7 9.6z" {...common} />
    case '🧠':
      return <Path d="M9 6a3 3 0 0 0-3 3c-1.5.4-2 2-1 3.2-.2 1.6 1 2.8 2.4 3.2V18h7v-2.2c1.6-.3 3-1.6 2.8-3.4 1-1.2.4-2.8-1-3.2a3 3 0 0 0-3-3 3 3 0 0 0-4.2 0z" {...common} />
    case '🦷':
      return <Path d="M8 5c-2 1-3 4-2 8 0 3 1 6 2 6s1.5-2 2-4c.4 2 .8 4 2 4s1.6-2 2-4c.5 2 1 4 2 4s2-3 2-6c1-4 0-7-2-8-2-1-4 1-6 1s-4-2-6-1z" {...common} />
    case '👁️':
      return (
        <>
          <Path d="M2.8 12S6.2 6 12 6s9.2 6 9.2 6-3.4 6-9.2 6S2.8 12 2.8 12z" {...common} />
          <Circle cx="12" cy="12" r="2.6" {...common} />
        </>
      )
    case '🌿':
      return (
        <>
          <Path d="M5 19c0-8 5-13.5 14-14.5 0 9-5 14.5-13 14.5z" {...common} />
          <Path d="M5 19l8-8" {...common} />
        </>
      )
    case '😴':
      return <Path d="M19 14.5A7.5 7.5 0 0 1 9.5 5a7.5 7.5 0 1 0 9.5 9.5z" {...common} />
    case '⚡':
      return <Path d="M13 3.5L5.5 13.5h5.8L10.5 20.5l7.5-10h-5.8z" {...common} />
    case '🤕':
      return (
        <>
          <Circle cx="12" cy="12" r="8" {...common} />
          <Path d="M8 12h8M12 9v6" {...common} />
        </>
      )
    default:
      return null
  }
}

export function hasMedicationLineIcon(icon: string): boolean {
  return glyph(resolveMedicationIconDisplay(icon), '#000') != null
}

export function MedicationLineIcon({ icon, color, size }: MedicationLineIconProps) {
  const body = glyph(resolveMedicationIconDisplay(icon), color)
  if (!body) return null
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {body}
    </Svg>
  )
}
