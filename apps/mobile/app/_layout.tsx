import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect, type ReactNode } from 'react'
import 'react-native-reanimated'

import { useAppColorScheme } from '@/components/useColorScheme'
import { OnboardingGate } from '@/src/components/layout/OnboardingGate'
import { SettingsProvider } from '@/src/context/SettingsContext'
import { StorageProvider } from '@/src/context/StorageContext'
import { useReminderCoordinator } from '@/src/hooks/useReminderCoordinator'
import { privacyPl } from '@/src/i18n/privacy-pl'
import { pl } from '@/src/i18n/pl'
import { themeColors } from '@/src/theme/colors'

export { ErrorBoundary } from 'expo-router'

export const unstable_settings = {
  anchor: '(tabs)',
}

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync()
  }, [])

  return (
    <StorageProvider>
      <SettingsProvider>
        <ReminderCoordinatorHost>
          <OnboardingGate>
            <RootStack />
          </OnboardingGate>
        </ReminderCoordinatorHost>
      </SettingsProvider>
    </StorageProvider>
  )
}

function ReminderCoordinatorHost({ children }: { children: ReactNode }) {
  useReminderCoordinator()
  return children
}

function RootStack() {
  const scheme = useAppColorScheme()
  const c = themeColors(scheme)

  return (
    <>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerTintColor: c.brand,
          headerTitleStyle: { fontWeight: '600', fontSize: 17 },
          headerShadowVisible: false,
          headerTransparent: false,
          headerStyle: { backgroundColor: c.surface },
          headerBackButtonDisplayMode: 'minimal',
          contentStyle: { backgroundColor: c.surface },
          scrollEdgeEffects: { top: 'hidden', bottom: 'hidden' },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="onboarding"
          options={{ headerShown: false, presentation: 'modal' }}
        />
        <Stack.Screen name="privacy" options={{ title: privacyPl.title }} />
        <Stack.Screen name="settings" options={{ title: pl.settings.title }} />
        <Stack.Screen
          name="help/notifications"
          options={{ title: pl.notificationHelp.title }}
        />
        <Stack.Screen name="as-needed" options={{ headerShown: false }} />
        <Stack.Screen name="medications" options={{ headerShown: false }} />
        <Stack.Screen
          name="progress/analytics"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="medication/[id]"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="medication/[id]/edit"
          options={{ headerShown: false }}
        />
      </Stack>
    </>
  )
}
