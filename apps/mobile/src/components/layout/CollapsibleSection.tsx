import { useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import { useColorScheme } from '@/components/useColorScheme'
import { themeColors } from '@/src/theme/colors'

type CollapsibleSectionProps = {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}

export function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
}: CollapsibleSectionProps) {
  const scheme = useColorScheme()
  const c = themeColors(scheme)
  const [open, setOpen] = useState(defaultOpen)

  return (
    <View style={[styles.root, { backgroundColor: c.surfaceElevated }]}>
      <Pressable
        onPress={() => setOpen((v) => !v)}
        style={styles.header}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
      >
        <Text style={[styles.title, { color: c.text }]}>{title}</Text>
        <Text style={{ color: c.textMuted }}>{open ? '▾' : '▸'}</Text>
      </Pressable>
      {open ? <View style={styles.body}>{children}</View> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  root: { borderRadius: 20, overflow: 'hidden' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 44,
  },
  title: { fontSize: 17, fontWeight: '600', flex: 1 },
  body: { paddingHorizontal: 16, paddingBottom: 12 },
})
