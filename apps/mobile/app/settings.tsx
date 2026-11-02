import { useEffect, useMemo, useState } from 'react'
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native'
import * as Notifications from 'expo-notifications'
import { Link, useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

import type { FontScale, ThemePreference } from '@mediapp/core'

import { useColorScheme } from '@/components/useColorScheme'
import { useSettings } from '@/src/context/SettingsContext'
import { BackupControls } from '@/src/components/settings/BackupControls'
import { pl } from '@/src/i18n/pl'
import { themeColors } from '@/src/theme/colors'

const themes: ThemePreference[] = ['light', 'dark', 'system']
const fonts: FontScale[] = ['normal', 'large']

export default function SettingsScreen() {
  const scheme = useColorScheme()
  const c = themeColors(scheme)
  const router = useRouter()
  const {
    settings,
    setTheme,
    setFontScale,
    setNotificationsEnabled,
    setSnoozeMinutesDefault,
    setPersistentAlarmEnabled,
    resetOnboarding,
    deleteAllData,
  } = useSettings()
  const [snoozeText, setSnoozeText] = useState(
    String(settings.snoozeMinutesDefault),
  )
  const [message, setMessage] = useState<string | null>(null)
  const [osDenied, setOsDenied] = useState(false)

  useEffect(() => {
    void Notifications.getPermissionsAsync().then(({ status }) => {
      setOsDenied(status !== 'granted')
    })
  }, [settings.notificationsEnabled])

  const themeLabels = useMemo(
    () => ({
      light: pl.settings.themeLight,
      dark: pl.settings.themeDark,
      system: pl.settings.themeSystem,
    }),
    [],
  )

  const fontLabels = useMemo(
    () => ({
      normal: pl.settings.fontNormal,
      large: pl.settings.fontLarge,
    }),
    [],
  )

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: c.surface }]}
      edges={['bottom']}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[styles.sectionTitle, { color: c.textMuted }]}>
          {pl.settings.theme}
        </Text>
        <View style={styles.chipRow}>
          {themes.map((t) => (
            <Pressable
              key={t}
              onPress={() => setTheme(t)}
              style={[
                styles.chip,
                {
                  borderColor: settings.theme === t ? c.brand : c.border,
                  backgroundColor:
                    settings.theme === t ? `${c.brand}1A` : c.surfaceElevated,
                },
              ]}
            >
              <Text
                style={{
                  color: settings.theme === t ? c.brand : c.text,
                  fontWeight: '600',
                  fontSize: 14,
                }}
              >
                {themeLabels[t]}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={[styles.sectionTitle, styles.sectionTop, { color: c.textMuted }]}>
          {pl.settings.fontScale}
        </Text>
        <View style={styles.chipRow}>
          {fonts.map((f) => (
            <Pressable
              key={f}
              onPress={() => setFontScale(f)}
              style={[
                styles.chip,
                {
                  borderColor: settings.fontScale === f ? c.brand : c.border,
                  backgroundColor:
                    settings.fontScale === f ? `${c.brand}1A` : c.surfaceElevated,
                },
              ]}
            >
              <Text
                style={{
                  color: settings.fontScale === f ? c.brand : c.text,
                  fontWeight: '600',
                  fontSize: 14,
                }}
              >
                {fontLabels[f]}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={[styles.sectionTitle, styles.sectionTop, { color: c.textMuted }]}>
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
        {osDenied && settings.notificationsEnabled ? (
          <Text style={[styles.warn, { color: '#b45309' }]}>
            {pl.settings.permissionDenied}
          </Text>
        ) : null}

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

        <BackupControls onMessage={setMessage} />

        <Text style={[styles.sectionTitle, styles.sectionTop, { color: c.textMuted }]}>
          {pl.settings.data}
        </Text>
        <Pressable
          style={[styles.deleteBtn, { borderColor: '#fca5a5' }]}
          onPress={() => {
            Alert.alert(pl.settings.deleteAll, pl.settings.deleteConfirm, [
              { text: pl.common.cancel, style: 'cancel' },
              {
                text: pl.settings.deleteAll,
                style: 'destructive',
                onPress: () => {
                  void deleteAllData().then(() => {
                    setMessage(pl.settings.deleted)
                    router.replace('/onboarding')
                  })
                },
              },
            ])
          }}
        >
          <Text style={styles.deleteText}>{pl.settings.deleteAll}</Text>
        </Pressable>

        {message ? (
          <Text style={[styles.message, { color: c.brand }]}>{message}</Text>
        ) : null}

        <Link href="/privacy" asChild>
          <Pressable style={[styles.outlineBtn, { borderColor: c.border }]}>
            <Text style={[styles.outlineText, { color: c.text }]}>
              {pl.settings.dataInfo}
            </Text>
          </Pressable>
        </Link>
        <Pressable
          style={[styles.outlineBtn, { borderColor: c.border }]}
          onPress={() => {
            resetOnboarding()
            router.push('/onboarding')
          }}
        >
          <Text style={[styles.outlineText, { color: c.text }]}>
            {pl.settings.onboarding}
          </Text>
        </Pressable>
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
  sectionTop: { marginTop: 24 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    minHeight: 44,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowTop: { marginTop: 16 },
  rowLabel: { flex: 1, fontSize: 15 },
  hint: { marginTop: 8, fontSize: 13, lineHeight: 18 },
  warn: { marginTop: 8, fontSize: 13, lineHeight: 18 },
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
  deleteBtn: {
    marginTop: 8,
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteText: { color: '#b91c1c', fontWeight: '600', fontSize: 14 },
  message: { marginTop: 8, fontSize: 14 },
  outlineBtn: {
    marginTop: 12,
    minHeight: 44,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineText: { fontSize: 14 },
})
