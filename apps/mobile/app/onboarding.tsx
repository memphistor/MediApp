import { useState } from 'react'
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

import { useSettings } from '@/src/context/SettingsContext'
import { pl } from '@/src/i18n/pl'
import { themeColors } from '@/src/theme/colors'
import { useColorScheme } from '@/components/useColorScheme'

export default function OnboardingScreen() {
  const scheme = useColorScheme()
  const c = themeColors(scheme)
  const router = useRouter()
  const { completeOnboarding, settings } = useSettings()
  const [understood, setUnderstood] = useState(false)

  if (settings.onboardingCompleted) {
    return null
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.surface }]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[styles.title, { color: c.text }]}>{pl.onboarding.title}</Text>
        <Text style={[styles.body, { color: c.text }]}>{pl.onboarding.body1}</Text>
        <Text style={[styles.bodyMuted, { color: c.textMuted }]}>
          {pl.onboarding.body2}
        </Text>
        <View
          style={[
            styles.disclaimer,
            {
              borderColor: c.scheme === 'dark' ? '#991b1b' : '#fca5a5',
              backgroundColor: c.scheme === 'dark' ? '#450a0a80' : '#fef2f2',
            },
          ]}
        >
          <Text style={[styles.disclaimerText, { color: c.scheme === 'dark' ? '#fecaca' : '#450a0a' }]}>
            <Text style={styles.disclaimerBold}>{pl.disclaimer.title}: </Text>
            {pl.disclaimer.short}
          </Text>
        </View>
        <View style={styles.checkRow}>
          <Switch
            value={understood}
            onValueChange={setUnderstood}
            accessibilityLabel={pl.onboarding.disclaimerConfirm}
          />
          <Text style={[styles.checkLabel, { color: c.text }]}>
            {pl.onboarding.disclaimerConfirm}
          </Text>
        </View>
        <Pressable
          disabled={!understood}
          onPress={() => {
            completeOnboarding()
            router.replace('/(tabs)/')
          }}
          style={[
            styles.accept,
            {
              backgroundColor: c.brand,
              opacity: understood ? 1 : 0.5,
            },
          ]}
        >
          <Text style={styles.acceptText}>{pl.onboarding.accept}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 24, paddingBottom: 40, flexGrow: 1, justifyContent: 'space-between' },
  title: { fontSize: 24, fontWeight: '700' },
  body: { marginTop: 24, fontSize: 16, lineHeight: 24 },
  bodyMuted: { marginTop: 16, fontSize: 16, lineHeight: 24 },
  disclaimer: {
    marginTop: 24,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
  },
  disclaimerText: { fontSize: 14, lineHeight: 20 },
  disclaimerBold: { fontWeight: '600' },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginTop: 16,
  },
  checkLabel: { flex: 1, fontSize: 14, lineHeight: 20 },
  accept: {
    marginTop: 32,
    minHeight: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptText: { color: '#fff', fontSize: 18, fontWeight: '600' },
})
