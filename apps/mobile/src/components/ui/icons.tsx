import Svg, { Circle, Path, Rect } from 'react-native-svg'

type IconProps = {
  color: string
  size?: number
}

export function CloseIcon({ color, size = 22 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6.5 6.5l11 11M17.5 6.5l-11 11"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
      />
    </Svg>
  )
}

export function BackIcon({ color, size = 22 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M14.5 5.5L8 12l6.5 6.5"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export function ChevronRightIcon({ color, size = 20 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9.5 5.5l6.5 6.5-6.5 6.5"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export function PlusIcon({ color, size = 22 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 5.5v13M5.5 12h13"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </Svg>
  )
}

export function ListIcon({ color, size = 22 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M8 7h11M8 12h11M8 17h11"
        stroke={color}
        strokeWidth={1.7}
        strokeLinecap="round"
      />
      <Path
        d="M4.5 7h.01M4.5 12h.01M4.5 17h.01"
        stroke={color}
        strokeWidth={2.6}
        strokeLinecap="round"
      />
    </Svg>
  )
}

export function MinusIcon({ color, size = 16 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M5.5 12h13" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  )
}

export function BellIcon({ color, size = 22 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6 9.5a6 6 0 1 1 12 0c0 6.5 2.5 7.5 2.5 7.5h-17S6 16 6 9.5z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M10 20a2 2 0 0 0 4 0"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </Svg>
  )
}

export function TrendIcon({ color, size = 20 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 17l5-5.5 4 3.2 7-8"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M4 20.5h16" stroke={color} strokeWidth={1.6} strokeLinecap="round" opacity={0.35} />
    </Svg>
  )
}

export function CheckIcon({ color, size = 16 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5.5 12.5l4.2 4.2 8.8-9.4"
        stroke={color}
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export function MedalIcon({ color, size = 26 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="9" r="5" stroke={color} strokeWidth={1.4} />
      <Path
        d="M9 13.2L8 20.5l4-2.2 4 2.2-1-7.3"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

type FormGlyphProps = IconProps & { name: string }

export function FormGlyph({ name, color, size = 28 }: FormGlyphProps) {
  const common = {
    stroke: color,
    strokeWidth: 1.4,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill: 'none' as const,
  }
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {name === 'tablet' ? (
        <>
          <Circle cx="12" cy="12" r="8" {...common} />
          <Path d="M4.8 12h14.4" {...common} />
        </>
      ) : null}
      {name === 'capsule' ? (
        <>
          <Rect
            x="3"
            y="9"
            width="18"
            height="6"
            rx="3"
            {...common}
            transform="rotate(-45 12 12)"
          />
          <Path d="M9.9 9.9l4.2 4.2" {...common} />
        </>
      ) : null}
      {name === 'drops' ? (
        <Path
          d="M12 3.5c3.2 4 5.5 6.8 5.5 9.7a5.5 5.5 0 0 1-11 0c0-2.9 2.3-5.7 5.5-9.7z"
          {...common}
        />
      ) : null}
      {name === 'sachet' ? (
        <>
          <Rect x="6" y="3.5" width="12" height="17" rx="2.5" {...common} />
          <Path d="M6 7.5h12M9.5 12.5h5M9.5 15.5h3" {...common} />
        </>
      ) : null}
      {name === 'injection' ? (
        <Path
          d="M14.5 4.5l5 5M12.5 6.5l5 5M16.5 8.5L9 16l-2.2.6.6-2.2L14.9 6.9M7 17l-3 3"
          {...common}
        />
      ) : null}
      {name === 'liquid' ? (
        <>
          <Path d="M9.5 3.5h5M10.5 3.5v3M13.5 3.5v3" {...common} />
          <Rect x="6.5" y="6.5" width="11" height="14" rx="3.5" {...common} />
          <Path d="M6.5 12.5h11" {...common} />
        </>
      ) : null}
      {name === 'other' ? (
        <>
          <Circle cx="6" cy="12" r="1.2" fill={color} />
          <Circle cx="12" cy="12" r="1.2" fill={color} />
          <Circle cx="18" cy="12" r="1.2" fill={color} />
        </>
      ) : null}
    </Svg>
  )
}
