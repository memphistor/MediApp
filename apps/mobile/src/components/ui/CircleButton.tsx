import { Pressable, type StyleProp, type ViewStyle } from 'react-native'

import { useColorScheme } from '@/components/useColorScheme'
import { themeColors } from '@/src/theme/colors'
import { cardShadow } from '@/src/theme/tokens'

type CircleButtonProps = {
  onPress: () => void
  accessibilityLabel: string
  children: React.ReactNode
  flat?: boolean
  size?: number
  style?: StyleProp<ViewStyle>
}

export function CircleButton({
  onPress,
  accessibilityLabel,
  children,
  flat = false,
  size = 46,
  style,
}: CircleButtonProps) {
  const scheme = useColorScheme() ?? 'light'
  const c = themeColors(scheme)

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      hitSlop={6}
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: flat ? c.track : c.surfaceElevated,
        },
        flat ? null : cardShadow(scheme),
        style,
      ]}
    >
      {children}
    </Pressable>
  )
}
