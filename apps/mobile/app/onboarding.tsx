import { useState } from 'react'
import { Switch, View } from 'react-native'
import { useRouter } from 'expo-router'

import { useSettings } from '@/src/context/SettingsContext'
import { AppText } from '@/src/components/ui/AppText'
import { Button } from '@/src/components/ui/Button'
import { Card } from '@/src/components/ui/Card'
import { Screen } from '@/src/components/ui/Screen'
import { pl } from '@/src/i18n/pl'
import { space } from '@/src/theme/tokens'
import { useColorScheme } from '@/components/useColorScheme'
import { themeColors } from '@/src/theme/colors'

export default function OnboardingScreen() {
  const scheme = useColorScheme() ?? 'light'
  const c = themeColors(scheme)
  const router = useRouter()
  const { completeOnboarding, settings } = useSettings()
  const [understood, setUnderstood] = useState(false)

  if (settings.onboardingCompleted) {
    return null
  }

  return (
    <Screen
      footer={
        <View style={{ paddingHorizontal: space.xl, paddingBottom: space.xl }}>
          <Button
            label={pl.onboarding.accept}
            disabled={!understood}
            onPress={() => {
              completeOnboarding()
              router.replace('/')
            }}
          />
        </View>
      }
    >
      <AppText variant="title">{pl.onboarding.title}</AppText>
      <AppText variant="body" style={{ marginTop: space.xl }}>
        {pl.onboarding.body1}
      </AppText>
      <AppText variant="body" tone="muted" style={{ marginTop: space.lg }}>
        {pl.onboarding.body2}
      </AppText>
      <Card
        style={{
          marginTop: space.xl,
          backgroundColor: scheme === 'dark' ? '#451a1a' : '#fef2f2',
        }}
      >
        <AppText
          variant="secondary"
          style={{ color: scheme === 'dark' ? '#fecaca' : '#7f1d1d' }}
        >
          <AppText
            variant="secondary"
            style={{
              color: scheme === 'dark' ? '#fecaca' : '#7f1d1d',
              fontWeight: '600',
            }}
          >
            {pl.disclaimer.title}:{' '}
          </AppText>
          {pl.disclaimer.short}
        </AppText>
      </Card>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: space.md,
          marginTop: space.lg,
        }}
      >
        <Switch
          value={understood}
          onValueChange={setUnderstood}
          accessibilityLabel={pl.onboarding.disclaimerConfirm}
          trackColor={{ true: c.brand }}
        />
        <AppText variant="secondary" style={{ flex: 1 }}>
          {pl.onboarding.disclaimerConfirm}
        </AppText>
      </View>
    </Screen>
  )
}
