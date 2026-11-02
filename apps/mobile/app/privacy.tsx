import { ScrollView, StyleSheet, Text } from 'react-native'

import { useColorScheme } from '@/components/useColorScheme'
import { privacyPl } from '@/src/i18n/privacy-pl'
import { themeColors } from '@/src/theme/colors'

export default function PrivacyScreen() {
  const scheme = useColorScheme() ?? 'light'
  const c = themeColors(scheme)

  return (
    <ScrollView
      style={[styles.root, { backgroundColor: c.surface }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.title, { color: c.text }]}>{privacyPl.title}</Text>
      {privacyPl.sections.map((section) => (
        <Text key={section.id} style={[styles.section, { color: c.text }]}>
          <Text style={styles.sectionTitle}>{section.title}{'\n'}</Text>
          {section.paragraphs.join('\n\n')}
        </Text>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 16 },
  section: { fontSize: 15, lineHeight: 22, marginBottom: 20 },
  sectionTitle: { fontWeight: '600' },
})
