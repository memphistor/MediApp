import { Pressable, ScrollView, StyleSheet, Text } from 'react-native'
import { Link } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

import { pl } from '@/src/i18n/pl'
import { themeColors } from '@/src/theme/colors'
import { useColorScheme } from '@/components/useColorScheme'

export default function NotificationLimitsScreen() {
  const scheme = useColorScheme() ?? 'light'
  const c = themeColors(scheme)
  const copy = pl.notificationHelp
  const paragraphs = [
    copy.lead,
    copy.tick,
    copy.ios,
    copy.noPermission,
    copy.persistent,
    copy.closed,
  ]

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: c.surface }]}
      edges={['bottom']}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <Link href="/settings" asChild>
          <Pressable style={styles.back}>
            <Text style={[styles.backText, { color: c.brand }]}>
              ← {pl.wizard.back}
            </Text>
          </Pressable>
        </Link>
        <Text style={[styles.title, { color: c.text }]}>{copy.title}</Text>
        {paragraphs.map((text) => (
          <Text key={text} style={[styles.paragraph, { color: c.text }]}>
            {text}
          </Text>
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 16, paddingBottom: 32 },
  back: { minHeight: 44, justifyContent: 'center' },
  backText: { fontSize: 15, fontWeight: '600' },
  title: { fontSize: 22, fontWeight: '600', marginTop: 8 },
  paragraph: { marginTop: 16, fontSize: 14, lineHeight: 21 },
})
