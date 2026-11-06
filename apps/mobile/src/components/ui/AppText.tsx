import { Text, type TextProps, type TextStyle } from 'react-native'

import { useColorScheme } from '@/components/useColorScheme'
import { themeColors } from '@/src/theme/colors'
import { useTypeScale } from '@/src/theme/useTypeScale'

type Variant = 'title' | 'section' | 'body' | 'secondary' | 'caption' | 'metric'

type AppTextProps = TextProps & {
  variant?: Variant
  tone?: 'default' | 'muted' | 'brand'
}

export function AppText({
  variant = 'body',
  tone = 'default',
  style,
  ...rest
}: AppTextProps) {
  const scheme = useColorScheme() ?? 'light'
  const c = themeColors(scheme)
  const type = useTypeScale()
  const color =
    tone === 'muted' ? c.textMuted : tone === 'brand' ? c.brand : c.text

  return (
    <Text
      style={[type[variant] as TextStyle, { color }, style]}
      {...rest}
    />
  )
}
