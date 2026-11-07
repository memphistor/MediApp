import { useRouter } from 'expo-router'
import Svg, { Circle, Path } from 'react-native-svg'

import { useColorScheme } from '@/components/useColorScheme'
import { CircleButton } from '@/src/components/ui/CircleButton'
import { pl } from '@/src/i18n/pl'
import { themeColors } from '@/src/theme/colors'

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

export function SettingsButton() {
  const router = useRouter()
  const c = themeColors(useColorScheme() ?? 'light')
  return (
    <CircleButton
      onPress={() => router.push('/settings')}
      accessibilityLabel={pl.settings.title}
    >
      <SettingsIcon color={c.text} knob={c.surfaceElevated} />
    </CircleButton>
  )
}
