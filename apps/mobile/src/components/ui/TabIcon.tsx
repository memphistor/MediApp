import Svg, { Path, Rect } from 'react-native-svg'

import { useColorScheme } from '@/components/useColorScheme'
import { themeColors } from '@/src/theme/colors'

export type TabIconId = 'today' | 'calendar' | 'add' | 'progress' | 'history'

const stroke = 1.5

type TabIconProps = {
  id: TabIconId
  focused?: boolean
}

export function TabIcon({ id, focused = false }: TabIconProps) {
  const scheme = useColorScheme() ?? 'light'
  const c = themeColors(scheme)
  const tone = focused ? c.brand : '#8A979F'

  if (id === 'add') {
    return null
  }

  const body = (() => {
    switch (id) {
      case 'today':
        return (
          <>
            <Rect
              x="4"
              y="5"
              width="16"
              height="15"
              rx="4.5"
              stroke={tone}
              strokeWidth={stroke}
              fill="none"
            />
            <Path
              d="M8 3.5v3M16 3.5v3M8.8 12.6l2.2 2.2 4.2-4.4"
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
              height="15"
              rx="4.5"
              stroke={tone}
              strokeWidth={stroke}
              fill="none"
            />
            <Path
              d="M4 10h16M8 3.5v3M16 3.5v3"
              stroke={tone}
              strokeWidth={stroke}
              strokeLinecap="round"
              fill="none"
            />
          </>
        )
      case 'progress':
        return (
          <Path
            d="M4 17.5l5-5.5 4 3.2 7-8"
            stroke={tone}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        )
      case 'history':
        return (
          <>
            <Path
              d="M4.2 12a7.8 7.8 0 1 0 2.4-5.6"
              stroke={tone}
              strokeWidth={stroke}
              strokeLinecap="round"
              fill="none"
            />
            <Path
              d="M4.2 4.6v3.9h3.9M12 8v4.4l3 1.8"
              stroke={tone}
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </>
        )
      default:
        return null
    }
  })()

  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      {body}
    </Svg>
  )
}
