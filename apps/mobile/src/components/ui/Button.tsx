import { Pressable, Text, type StyleProp, type ViewStyle } from 'react-native'

import { useColorScheme } from '@/components/useColorScheme'
import { themeColors } from '@/src/theme/colors'
import { radius } from '@/src/theme/tokens'
import { useTypeScale } from '@/src/theme/useTypeScale'

type ButtonProps = {
  label: string
  onPress: () => void
  variant?: 'primary' | 'quiet' | 'text' | 'danger'
  disabled?: boolean
  style?: StyleProp<ViewStyle>
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  style,
}: ButtonProps) {
  const scheme = useColorScheme() ?? 'light'
  const c = themeColors(scheme)
  const type = useTypeScale()

  const backgroundColor =
    variant === 'primary'
      ? c.brand
      : variant === 'quiet'
        ? c.surfaceElevated
        : 'transparent'
  const color =
    variant === 'primary' ? '#ffffff' : variant === 'danger' ? '#b91c1c' : c.brand

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        {
          minHeight: variant === 'text' ? 44 : 48,
          paddingHorizontal: variant === 'text' ? 4 : 18,
          borderRadius: radius.control,
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: variant === 'primary' ? 'stretch' : 'center',
          backgroundColor,
          opacity: disabled ? 0.45 : pressed ? 0.82 : 1,
        },
        style,
      ]}
    >
      <Text style={[type.button, { color }]}>{label}</Text>
    </Pressable>
  )
}
