import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect, type ReactNode } from 'react'
import 'react-native-reanimated'

import { useColorScheme } from '@/components/useColorScheme'
import Colors from '@/constants/Colors'
import { SettingsProvider } from '@/src/context/SettingsContext'
import { StorageProvider } from '@/src/context/StorageContext'
import { useReminderCoordinator } from '@/src/hooks/useReminderCoordinator'
import { pl } from '@/src/i18n/pl'

export { ErrorBoundary } from 'expo-router'

export const unstable_settings = {
  anchor: '(tabs)',
}

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  })

  useEffect(() => {
    if (error) throw error
  }, [error])

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync()
  }, [loaded])

  if (!loaded) return null

  return (
    <StorageProvider>
      <SettingsProvider>
        <ReminderCoordinatorHost>
          <RootStack />
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
  const scheme = useColorScheme() ?? 'light'
  const headerTint = Colors[scheme].tint

  return (
    <Stack
      screenOptions={{
        headerTintColor: headerTint,
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="onboarding"
        options={{ title: pl.onboarding.title, presentation: 'modal' }}
      />
      <Stack.Screen name="privacy" options={{ title: 'Polityka prywatności' }} />
      <Stack.Screen name="settings" options={{ title: pl.settings.title }} />
      <Stack.Screen
        name="help/notifications"
        options={{ title: pl.settings.notifications }}
      />
      <Stack.Screen name="as-needed" options={{ title: pl.asNeeded.title }} />
      <Stack.Screen
        name="progress/analytics"
        options={{ title: pl.progress.analyticsTitle }}
      />
      <Stack.Screen
        name="medication/[id]"
        options={{ title: pl.detail.title }}
      />
      <Stack.Screen
        name="medication/[id]/edit"
        options={{ title: pl.wizard.editTitle }}
      />
    </Stack>
  )
}
