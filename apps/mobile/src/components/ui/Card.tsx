import { View, type StyleProp, type ViewStyle } from 'react-native'

import { useColorScheme } from '@/components/useColorScheme'
import { themeColors } from '@/src/theme/colors'
import { radius, space } from '@/src/theme/tokens'

type CardProps = {
  children: React.ReactNode
  style?: StyleProp<ViewStyle>
}

export function Card({ children, style }: CardProps) {
  const scheme = useColorScheme() ?? 'light'
  const c = themeColors(scheme)

  return (
    <View
      style={[
        {
          backgroundColor: c.surfaceElevated,
          borderRadius: radius.card,
          padding: space.lg,
        },
        style,
      ]}
    >
      {children}
    </View>
  )
}
