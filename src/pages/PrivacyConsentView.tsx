import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSettings } from '@/context/SettingsContext'
import { pl } from '@/i18n/pl'

export function PrivacyConsentView() {
  const navigate = useNavigate()
  const { settings, ready, acceptPrivacyConsent, needsPrivacyConsent } =
    useSettings()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (!ready) return
    if (!settings.onboardingCompleted) {
      navigate('/onboarding', { replace: true })
      return
    }
    if (!needsPrivacyConsent) {
      navigate('/', { replace: true })
    }
  }, [ready, settings.onboardingCompleted, needsPrivacyConsent, navigate])

  if (!ready || !needsPrivacyConsent) {
    return (
      <div className="flex min-h-dvh items-center justify-center text-[var(--color-text-muted)]">
        Ładowanie…
      </div>
    )
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-lg flex-col justify-between px-6 py-10 safe-top safe-bottom">
      <div>
        <h1 className="text-2xl font-bold">{pl.privacy.consent.title}</h1>
        <ul className="mt-6 list-disc space-y-2 pl-5 text-sm leading-relaxed">
          {pl.privacy.consent.bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
        <label className="mt-6 flex items-start gap-3 text-sm">
          <input
            type="checkbox"
            className="mt-1 h-5 w-5 shrink-0"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
          />
          <span>{pl.privacy.consent.checkbox}</span>
        </label>
        <Link to="/privacy" className="mt-4 inline-block text-sm font-medium text-brand">
          {pl.privacy.consent.readPolicy}
        </Link>
      </div>
      <button
        type="button"
        disabled={!checked}
        className="mt-8 min-h-14 w-full rounded-2xl bg-brand text-lg font-semibold text-white disabled:opacity-50"
        onClick={() => {
          acceptPrivacyConsent()
          navigate('/', { replace: true })
        }}
      >
        {pl.privacy.consent.accept}
      </button>
    </div>
  )
}
