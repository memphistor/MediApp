import { useRouter, useSegments } from 'expo-router'
import { useEffect, type ReactNode } from 'react'

import { useSettings } from '@/src/context/SettingsContext'

export function OnboardingGate({ children }: { children: ReactNode }) {
  const { settings, ready } = useSettings()
  const router = useRouter()
  const segments = useSegments()

  useEffect(() => {
    if (!ready) return
    if (settings.onboardingCompleted) return
    const onOnboarding = segments[0] === 'onboarding'
    if (!onOnboarding) {
      router.replace('/onboarding')
    }
  }, [ready, settings.onboardingCompleted, segments, router])

  return children
}
