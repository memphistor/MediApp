import { useEffect, useMemo, useState } from 'react'
import { Alert, Pressable, Switch, TextInput, View } from 'react-native'
import * as Notifications from 'expo-notifications'
import { useRouter } from 'expo-router'

import type { FontScale, ThemePreference } from '@mediapp/core'

import { useColorScheme } from '@/components/useColorScheme'
import { useSettings } from '@/src/context/SettingsContext'
import { BackupControls } from '@/src/components/settings/BackupControls'
import { AppText } from '@/src/components/ui/AppText'
import { Button } from '@/src/components/ui/Button'
import { ChoiceGroup } from '@/src/components/ui/ChoiceGroup'
import { Screen } from '@/src/components/ui/Screen'
import { pl } from '@/src/i18n/pl'
import { themeColors } from '@/src/theme/colors'
import { radius, space } from '@/src/theme/tokens'
import { useTypeScale } from '@/src/theme/useTypeScale'

const themes: ThemePreference[] = ['light', 'dark', 'system']
const fonts: FontScale[] = ['normal', 'large']

export default function SettingsScreen() {
  const scheme = useColorScheme() ?? 'light'
  const c = themeColors(scheme)
  const type = useTypeScale()
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
  const [snoozeText, setSnoozeText] = useState(String(settings.snoozeMinutesDefault))
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
    <Screen variant="stack">
      <ChoiceGroup
        label={pl.settings.theme}
        value={settings.theme}
        options={themes.map((t) => ({ value: t, label: themeLabels[t] }))}
        onChange={(value) => setTheme(value as ThemePreference)}
      />

      <View style={{ marginTop: space.xl }}>
        <ChoiceGroup
          label={pl.settings.fontScale}
          value={settings.fontScale}
          options={fonts.map((f) => ({ value: f, label: fontLabels[f] }))}
          onChange={(value) => setFontScale(value as FontScale)}
        />
      </View>

      <AppText variant="section" style={{ marginTop: space.xxl }}>
        {pl.settings.notifications}
      </AppText>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.md, marginTop: space.md }}>
        <Switch
          value={settings.notificationsEnabled}
          onValueChange={(v) => {
            void setNotificationsEnabled(v)
          }}
          accessibilityLabel={pl.settings.notificationsEnable}
          trackColor={{ true: c.brand }}
        />
        <AppText variant="secondary" style={{ flex: 1 }}>
          {pl.settings.notificationsEnable}
        </AppText>
      </View>
      <AppText variant="caption" tone="muted" style={{ marginTop: space.sm }}>
        {pl.settings.notificationsHint}
      </AppText>
      <AppText variant="caption" tone="muted" style={{ marginTop: space.sm }}>
        {pl.settings.notificationsPerMed}
      </AppText>
      {osDenied && settings.notificationsEnabled ? (
        <AppText variant="caption" style={{ marginTop: space.sm, color: '#b45309' }}>
          {pl.settings.permissionDenied}
        </AppText>
      ) : null}

      {settings.notificationsEnabled ? (
        <>
          <AppText variant="secondary" style={{ marginTop: space.lg, fontWeight: '500' }}>
            {pl.settings.snoozeMinutes}
          </AppText>
          <TextInput
            style={{
              marginTop: space.sm,
              borderRadius: radius.control,
              paddingHorizontal: space.md,
              paddingVertical: space.sm,
              fontSize: type.body.fontSize,
              minHeight: 48,
              backgroundColor: c.surfaceElevated,
              color: c.text,
            }}
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
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: space.md,
              marginTop: space.lg,
            }}
          >
            <Switch
              value={settings.persistentAlarmEnabled}
              onValueChange={setPersistentAlarmEnabled}
              trackColor={{ true: c.brand }}
            />
            <AppText variant="secondary" style={{ flex: 1 }}>
              {pl.settings.persistentAlarm}
            </AppText>
          </View>
          <AppText variant="caption" tone="muted" style={{ marginTop: space.sm }}>
            {pl.settings.persistentAlarmHint}
          </AppText>
        </>
      ) : null}

      <Pressable
        onPress={() => router.push('/help/notifications')}
        style={{ marginTop: space.lg, minHeight: 44, justifyContent: 'center' }}
      >
        <AppText variant="secondary" tone="brand">
          {pl.settings.notificationLimits}
        </AppText>
      </Pressable>

      <BackupControls onMessage={setMessage} />

      <AppText variant="section" style={{ marginTop: space.xxl }}>
        {pl.settings.data}
      </AppText>
      <Button
        label={pl.settings.deleteAll}
        variant="danger"
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
        style={{ alignSelf: 'stretch', marginTop: space.md }}
      />

      {message ? (
        <AppText variant="secondary" tone="brand" style={{ marginTop: space.sm }}>
          {message}
        </AppText>
      ) : null}

      <Button
        label={pl.settings.dataInfo}
        variant="quiet"
        onPress={() => router.push('/privacy')}
        style={{ alignSelf: 'stretch', marginTop: space.lg }}
      />
      <Button
        label={pl.settings.onboarding}
        variant="text"
        onPress={() => {
          resetOnboarding()
          router.push('/onboarding')
        }}
        style={{ marginTop: space.sm }}
      />
    </Screen>
  )
}
