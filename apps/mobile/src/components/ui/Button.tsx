import { Pressable, Text, type StyleProp, type ViewStyle } from 'react-native'

import { useColorScheme } from '@/components/useColorScheme'
import { themeColors } from '@/src/theme/colors'
import { buttonShadow, cardShadow, radius } from '@/src/theme/tokens'
import { useTypeScale } from '@/src/theme/useTypeScale'

type ButtonProps = {
  label: string
  onPress: () => void
  variant?: 'primary' | 'quiet' | 'text' | 'danger' | 'warning'
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
    variant === 'primary'
      ? '#ffffff'
      : variant === 'danger'
        ? '#C22E40'
        : variant === 'warning'
          ? '#8A5A0B'
          : variant === 'quiet'
            ? c.text
            : c.brand
  const textButton = variant === 'text' || variant === 'danger' || variant === 'warning'

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        {
          minHeight: textButton ? 46 : 58,
          paddingHorizontal: textButton ? 8 : 22,
          borderRadius: radius.control,
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: variant === 'primary' || variant === 'quiet' ? 'stretch' : 'center',
          backgroundColor,
          opacity: disabled ? 0.45 : pressed ? 0.82 : 1,
        },
        variant === 'primary' ? buttonShadow() : null,
        variant === 'quiet' ? cardShadow(scheme) : null,
        style,
      ]}
    >
      <Text style={[type.button, { color, fontSize: textButton ? 16 : type.button.fontSize }]}>
        {label}
      </Text>
    </Pressable>
  )
}
