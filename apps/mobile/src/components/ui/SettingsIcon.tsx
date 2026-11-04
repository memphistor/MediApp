import Svg, { Circle, Path } from 'react-native-svg'

type SettingsIconProps = {
  color: string
  knob: string
  size?: number
}

/** Three sliders — reads as settings, not as a sun. */
export function SettingsIcon({ color, knob, size = 22 }: SettingsIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 7h16M4 12h16M4 17h16"
        stroke={color}
        strokeWidth={1.75}
        strokeLinecap="round"
      />
      <Circle cx="9" cy="7" r="2.1" fill={knob} stroke={color} strokeWidth={1.75} />
      <Circle cx="15" cy="12" r="2.1" fill={knob} stroke={color} strokeWidth={1.75} />
      <Circle cx="8" cy="17" r="2.1" fill={knob} stroke={color} strokeWidth={1.75} />
    </Svg>
  )
}
