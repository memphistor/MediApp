import { StyleSheet, Text, View } from 'react-native'

import { useColorScheme } from '@/components/useColorScheme'
import { themeColors } from '@/src/theme/colors'

export function WizardSectionTitle({ children }: { children: string }) {
  const scheme = useColorScheme() ?? 'light'
  const c = themeColors(scheme)
  return (
    <View style={[styles.wrap, { borderBottomColor: c.border }]}>
      <Text style={[styles.text, { color: c.textMuted }]}>{children}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    borderBottomWidth: 1,
    paddingBottom: 4,
    marginBottom: 4,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
  },
})
