import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppLogo } from '@/components/brand/AppLogo'
import { useSettings } from '@/context/SettingsContext'
import { pl } from '@/i18n/pl'

export function OnboardingView() {
  const navigate = useNavigate()
  const { completeOnboarding, settings, ready } = useSettings()
  const [understood, setUnderstood] = useState(false)

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
        <AppLogo size="lg" className="mb-5" />
        <h1 className="text-2xl font-bold text-[var(--color-text)]">
          {pl.onboarding.title}
        </h1>
        <p className="mt-6 text-base leading-relaxed text-[var(--color-text)]">
          {pl.onboarding.body1}
        </p>
        <p className="mt-4 text-base leading-relaxed text-[var(--color-text-muted)]">
          {pl.onboarding.body2}
        </p>
        <aside
          className="mt-6 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm leading-relaxed text-red-950 dark:border-red-800 dark:bg-red-950/50 dark:text-red-100"
          role="note"
        >
          <strong className="font-semibold">{pl.disclaimer.title}:</strong>{' '}
          {pl.disclaimer.short}
        </aside>
        <label className="mt-4 flex cursor-pointer items-start gap-3 text-sm leading-relaxed">
          <input
            type="checkbox"
            className="mt-1 h-5 w-5 shrink-0 accent-brand"
            checked={understood}
            onChange={(e) => setUnderstood(e.target.checked)}
          />
          <span>{pl.onboarding.disclaimerConfirm}</span>
        </label>
      </div>
      <button
        type="button"
        disabled={!understood}
        className="mt-8 min-h-14 w-full rounded-2xl bg-brand text-lg font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
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
