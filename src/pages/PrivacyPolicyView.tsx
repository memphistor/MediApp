import { Link } from 'react-router-dom'
import { useSettings } from '@/context/SettingsContext'
import { CURRENT_PRIVACY_POLICY_VERSION } from '@/legal/policyVersion'
import { privacyPl } from '@/i18n/privacy-pl'
import { pl } from '@/i18n/pl'

export function PrivacyPolicyView() {
  const { needsPrivacyConsent, settings } = useSettings()
  const backTo = !settings.onboardingCompleted
    ? '/onboarding'
    : needsPrivacyConsent
      ? '/privacy-consent'
      : '/'

  return (
    <div className="mx-auto min-h-dvh max-w-lg px-6 py-8 safe-top safe-bottom">
      <Link to={backTo} className="text-sm font-medium text-brand">
        ← {pl.wizard.back}
      </Link>
      <h1 className="mt-4 text-2xl font-bold">{privacyPl.title}</h1>
      <p className="mt-1 text-sm text-[var(--color-text-muted)]">
        {privacyPl.versionLabel}: {CURRENT_PRIVACY_POLICY_VERSION}
      </p>
      <div className="mt-8 space-y-8">
        {privacyPl.sections.map((section) => (
          <section key={section.id} id={section.id}>
            <h2 className="text-lg font-semibold">{section.title}</h2>
            {section.paragraphs.map((p, i) => (
              <p
                key={i}
                className="mt-2 text-sm leading-relaxed text-[var(--color-text)]"
              >
                {p}
              </p>
            ))}
          </section>
        ))}
      </div>
    </div>
  )
}
