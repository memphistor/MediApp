import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSettings } from '@/context/SettingsContext'
import { pl } from '@/i18n/pl'

export function OnboardingView() {
  const navigate = useNavigate()
  const { completeOnboarding, settings, ready } = useSettings()

  useEffect(() => {
    if (ready && settings.onboardingCompleted) {
      navigate('/', { replace: true })
    }
  }, [ready, settings.onboardingCompleted, navigate])

  if (!ready) {
    return (
      <div className="flex min-h-dvh items-center justify-center text-[var(--color-text-muted)]">
        Ładowanie…
      </div>
    )
  }

  if (settings.onboardingCompleted) {
    return null
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-lg flex-col justify-between px-6 py-10 safe-top safe-bottom">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text)]">
          {pl.onboarding.title}
        </h1>
        <p className="mt-6 text-base leading-relaxed text-[var(--color-text)]">
          {pl.onboarding.body1}
        </p>
        <p className="mt-4 text-base leading-relaxed text-[var(--color-text-muted)]">
          {pl.onboarding.body2}
        </p>
        <p className="mt-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-4 text-sm leading-relaxed">
          {pl.disclaimer.short}
        </p>
      </div>
      <button
        type="button"
        className="mt-8 min-h-14 w-full rounded-2xl bg-brand text-lg font-semibold text-white"
        onClick={() => {
          completeOnboarding()
          navigate('/', { replace: true })
        }}
      >
        {pl.onboarding.accept}
      </button>
    </div>
  )
}
