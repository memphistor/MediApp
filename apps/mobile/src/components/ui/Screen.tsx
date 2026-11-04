import { ScrollView, View, type StyleProp, type ViewStyle } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

import { useColorScheme } from '@/components/useColorScheme'
import { themeColors } from '@/src/theme/colors'
import { space } from '@/src/theme/tokens'

type ScreenProps = {
  variant?: 'tab' | 'stack'
  scroll?: boolean
  children: React.ReactNode
  footer?: React.ReactNode
  contentStyle?: StyleProp<ViewStyle>
}

export function Screen({
  variant = 'tab',
  scroll = true,
  children,
  footer,
  contentStyle,
}: ScreenProps) {
  const scheme = useColorScheme() ?? 'light'
  const c = themeColors(scheme)
  const insets = useSafeAreaInsets()
  const padding = {
    paddingHorizontal: space.xl,
    paddingTop: variant === 'tab' ? space.sm : space.lg,
        paddingBottom: variant === 'tab' ? insets.bottom + 24 : space.xxxl,
  }

  const body = scroll ? (
    <ScrollView
      style={{ flex: 1 }}
      contentInsetAdjustmentBehavior={variant === 'stack' ? 'automatic' : 'never'}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={[padding, contentStyle]}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[{ flex: 1 }, padding, contentStyle]}>{children}</View>
  )

  const frame = (
    <View
      style={{
        flex: 1,
        backgroundColor: c.surface,
      }}
    >
      {body}
      {footer ? (
        <View style={{ paddingBottom: insets.bottom }}>{footer}</View>
      ) : null}
    </View>
  )

  if (variant === 'tab') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: c.surface }} edges={['top']}>
        {frame}
      </SafeAreaView>
    )
  }

  return frame
}
