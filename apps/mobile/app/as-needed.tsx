import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { useColorScheme } from '@/components/useColorScheme'
import { AsNeededRow } from '@/src/components/as-needed/AsNeededRow'
import { useAsNeededMedications } from '@/src/hooks/useProgressData'
import { pl } from '@/src/i18n/pl'
import { themeColors } from '@/src/theme/colors'

export default function AsNeededScreen() {
  const scheme = useColorScheme()
  const c = themeColors(scheme)
  const medications = useAsNeededMedications()

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.surface }]} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[styles.intro, { color: c.textMuted }]}>
          {pl.asNeeded.intro}
        </Text>
        {medications.length === 0 ? (
          <Text style={[styles.empty, { color: c.textMuted }]}>
            {pl.asNeeded.empty}
          </Text>
        ) : (
          medications.map((med) => <AsNeededRow key={med.id} med={med} />)
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 16, paddingBottom: 32 },
  intro: { fontSize: 14, lineHeight: 20, marginBottom: 16 },
  empty: { fontSize: 14, textAlign: 'center', marginTop: 24 },
})
