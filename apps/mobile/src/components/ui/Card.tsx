import { View, type StyleProp, type ViewStyle } from 'react-native'

import { useColorScheme } from '@/components/useColorScheme'
import { themeColors } from '@/src/theme/colors'
import { cardShadow, radius, space } from '@/src/theme/tokens'

type CardProps = {
  children: React.ReactNode
  style?: StyleProp<ViewStyle>
  padded?: boolean
}

export function Card({ children, style, padded = true }: CardProps) {
  const scheme = useColorScheme() ?? 'light'
  const c = themeColors(scheme)

  return (
    <View
      style={[
        {
          backgroundColor: c.surfaceElevated,
          borderRadius: radius.card,
          padding: padded ? space.xl : 0,
        },
        cardShadow(scheme),
        style,
      ]}
    >
      {children}
    </View>
  )
}
