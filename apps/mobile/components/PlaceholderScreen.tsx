import { type ReactNode } from 'react'
import { StyleSheet, Text, View, type ViewStyle } from 'react-native'

import { useColorScheme } from '@/components/useColorScheme'
import { themeColors } from '@/src/theme/colors'

type PlaceholderScreenProps = {
  title: string
  subtitle?: string
  children?: ReactNode
  style?: ViewStyle
}

export function PlaceholderScreen({
  title,
  subtitle = 'W budowie',
  children,
  style,
}: PlaceholderScreenProps) {
  const scheme = useColorScheme() ?? 'light'
  const c = themeColors(scheme)

  return (
    <View style={[styles.root, { backgroundColor: c.surface }, style]}>
      <Text style={[styles.title, { color: c.text }]}>{title}</Text>
      <Text style={[styles.subtitle, { color: c.textMuted }]}>{subtitle}</Text>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 20,
    paddingTop: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 15,
  },
})
