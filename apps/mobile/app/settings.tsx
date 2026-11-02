import { useState } from 'react'
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native'
import { Link } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

import { useSettings } from '@/src/context/SettingsContext'
import { pl } from '@/src/i18n/pl'
import { themeColors } from '@/src/theme/colors'
import { useColorScheme } from '@/components/useColorScheme'

export default function SettingsScreen() {
  const scheme = useColorScheme() ?? 'light'
  const c = themeColors(scheme)
  const {
    settings,
    setNotificationsEnabled,
    setSnoozeMinutesDefault,
    setPersistentAlarmEnabled,
  } = useSettings()
  const [snoozeText, setSnoozeText] = useState(
    String(settings.snoozeMinutesDefault),
  )

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: c.surface }]}
      edges={['bottom']}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[styles.sectionTitle, { color: c.textMuted }]}>
          {pl.settings.notifications}
        </Text>

        <View style={styles.row}>
          <Switch
            value={settings.notificationsEnabled}
            onValueChange={(v) => {
              void setNotificationsEnabled(v)
            }}
            accessibilityLabel={pl.settings.notificationsEnable}
          />
          <Text style={[styles.rowLabel, { color: c.text }]}>
            {pl.settings.notificationsEnable}
          </Text>
        </View>
        <Text style={[styles.hint, { color: c.textMuted }]}>
          {pl.settings.notificationsHint}
        </Text>
        <Text style={[styles.hint, { color: c.textMuted }]}>
          {pl.settings.notificationsPerMed}
        </Text>

        {settings.notificationsEnabled && (
          <>
            <Text style={[styles.fieldLabel, { color: c.text }]}>
              {pl.settings.snoozeMinutes}
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: c.border,
                  backgroundColor: c.surfaceElevated,
                  color: c.text,
                },
              ]}
              keyboardType="number-pad"
              value={snoozeText}
              onChangeText={setSnoozeText}
              onEndEditing={() => {
                const n = Number.parseInt(snoozeText, 10)
                if (!Number.isNaN(n)) {
                  setSnoozeMinutesDefault(n)
                  setSnoozeText(String(Math.max(1, Math.min(120, n))))
                } else {
                  setSnoozeText(String(settings.snoozeMinutesDefault))
                }
              }}
            />

            <View style={[styles.row, styles.rowTop]}>
              <Switch
                value={settings.persistentAlarmEnabled}
                onValueChange={setPersistentAlarmEnabled}
              />
              <Text style={[styles.rowLabel, { color: c.text }]}>
                {pl.settings.persistentAlarm}
              </Text>
            </View>
            <Text style={[styles.hint, { color: c.textMuted }]}>
              {pl.settings.persistentAlarmHint}
            </Text>
          </>
        )}

        <Link href="/help/notifications" asChild>
          <Pressable style={styles.link}>
            <Text style={[styles.linkText, { color: c.brand }]}>
              {pl.settings.notificationLimits}
            </Text>
          </Pressable>
        </Link>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 16, paddingBottom: 32 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowTop: { marginTop: 16 },
  rowLabel: { flex: 1, fontSize: 15 },
  hint: { marginTop: 8, fontSize: 13, lineHeight: 18 },
  fieldLabel: { marginTop: 16, fontSize: 14, fontWeight: '500' },
  input: {
    marginTop: 8,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    minHeight: 44,
  },
  link: { marginTop: 20, minHeight: 44, justifyContent: 'center' },
  linkText: { fontSize: 15, fontWeight: '600' },
})
