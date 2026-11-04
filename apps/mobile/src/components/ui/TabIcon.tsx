import Svg, { Circle, Path, Rect } from 'react-native-svg'

import { useColorScheme } from '@/components/useColorScheme'
import { themeColors } from '@/src/theme/colors'

export type TabIconId = 'today' | 'calendar' | 'add' | 'progress' | 'history'

const stroke = 1.75

type TabIconProps = {
  id: TabIconId
  focused?: boolean
}

export function TabIcon({ id, focused = false }: TabIconProps) {
  const scheme = useColorScheme() ?? 'light'
  const c = themeColors(scheme)
  const tone = focused ? c.brand : c.textMuted

  if (id === 'add') {
    return (
      <Svg width={28} height={28} viewBox="0 0 28 28">
        <Rect
          x={1}
          y={1}
          width={26}
          height={26}
          rx={9}
          fill={focused ? c.brand : `${c.brand}1F`}
        />
        <Path
          d="M14 8v12M8 14h12"
          stroke={focused ? '#ffffff' : c.brand}
          strokeWidth={2.25}
          strokeLinecap="round"
        />
      </Svg>
    )
  }

  const body = (() => {
    switch (id) {
      case 'today':
        return (
          <>
            <Rect
              x="5"
              y="6"
              width="14"
              height="14"
              rx="3"
              stroke={tone}
              strokeWidth={stroke}
              fill="none"
            />
            <Path
              d="M9 4v3M15 4v3M8 11l2.5 2.5L16 9"
              stroke={tone}
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </>
        )
      case 'calendar':
        return (
          <>
            <Rect
              x="4"
              y="5"
              width="16"
              height="16"
              rx="2.5"
              stroke={tone}
              strokeWidth={stroke}
              fill="none"
            />
            <Path
              d="M4 10h16M8 3v3M16 3v3"
              stroke={tone}
              strokeWidth={stroke}
              strokeLinecap="round"
              fill="none"
            />
            <Circle cx="9" cy="14" r="1" fill={tone} />
            <Circle cx="12" cy="14" r="1" fill={tone} />
            <Circle cx="15" cy="14" r="1" fill={tone} />
          </>
        )
      case 'progress':
        return (
          <>
            <Circle
              cx="12"
              cy="12"
              r="8"
              stroke={tone}
              strokeWidth={stroke}
              fill="none"
            />
            <Path
              d="M12 12V7M12 12l3.5 3.5"
              stroke={tone}
              strokeWidth={stroke}
              strokeLinecap="round"
              fill="none"
            />
          </>
        )
      case 'history':
        return (
          <>
            <Path
              d="M6 4h12M6 8h8M6 12h10M6 16h6"
              stroke={tone}
              strokeWidth={stroke}
              strokeLinecap="round"
              fill="none"
            />
            <Circle
              cx="17"
              cy="17"
              r="5"
              stroke={tone}
              strokeWidth={stroke}
              fill="none"
            />
            <Path
              d="M17 14.5V17l1.5 1.5"
              stroke={tone}
              strokeWidth={stroke}
              strokeLinecap="round"
              fill="none"
            />
          </>
        )
      default:
        return null
    }
  })()

  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      {body}
    </Svg>
  )
}
