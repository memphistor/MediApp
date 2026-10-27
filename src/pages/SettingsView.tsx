import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSettings } from '@/context/SettingsContext'
import { pl } from '@/i18n/pl'
import type { FontScale, ThemePreference } from '@/types/settings'

export function SettingsView() {
  const {
    settings,
    setTheme,
    setFontScale,
    resetOnboarding,
    deleteAllData,
  } = useSettings()
  const navigate = useNavigate()
  const [message, setMessage] = useState<string | null>(null)

  const themes: ThemePreference[] = ['light', 'dark', 'system']
  const fonts: FontScale[] = ['normal', 'large']

  const themeLabels: Record<ThemePreference, string> = {
    light: pl.settings.themeLight,
    dark: pl.settings.themeDark,
    system: pl.settings.themeSystem,
  }

  const fontLabels: Record<FontScale, string> = {
    normal: pl.settings.fontNormal,
    large: pl.settings.fontLarge,
  }

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold">{pl.settings.title}</h2>

      <section>
        <h3 className="text-sm font-semibold text-[var(--color-text-muted)]">
          {pl.settings.theme}
        </h3>
        <div className="mt-2 flex flex-wrap gap-2">
          {themes.map((t) => (
            <button
              key={t}
              type="button"
              className={`min-h-11 rounded-xl border px-4 text-sm ${
                settings.theme === t
                  ? 'border-brand bg-brand/10 text-brand'
                  : 'border-[var(--color-border)]'
              }`}
              onClick={() => setTheme(t)}
            >
              {themeLabels[t]}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-sm font-semibold text-[var(--color-text-muted)]">
          {pl.settings.fontScale}
        </h3>
        <div className="mt-2 flex flex-wrap gap-2">
          {fonts.map((f) => (
            <button
              key={f}
              type="button"
              className={`min-h-11 rounded-xl border px-4 text-sm ${
                settings.fontScale === f
                  ? 'border-brand bg-brand/10 text-brand'
                  : 'border-[var(--color-border)]'
              }`}
              onClick={() => setFontScale(f)}
            >
              {fontLabels[f]}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-sm font-semibold text-[var(--color-text-muted)]">
          {pl.settings.data}
        </h3>
        <button
          type="button"
          className="mt-2 min-h-12 w-full rounded-xl border border-red-300 text-sm font-semibold text-red-700 dark:border-red-800 dark:text-red-300"
          onClick={() => {
            if (window.confirm(pl.settings.deleteConfirm)) {
              void deleteAllData().then(() => {
                setMessage(pl.settings.deleted)
                navigate('/onboarding')
              })
            }
          }}
        >
          {pl.settings.deleteAll}
        </button>
        {message && (
          <p className="mt-2 text-sm text-brand" role="status">{message}</p>
        )}
      </section>

      <section className="space-y-2">
        <button
          type="button"
          className="min-h-11 w-full rounded-xl border border-[var(--color-border)] text-sm"
          onClick={() => {
            resetOnboarding()
            navigate('/onboarding')
          }}
        >
          {pl.settings.onboarding}
        </button>
        <p className="text-xs text-[var(--color-text-muted)]">
          {pl.settings.privacy}
        </p>
      </section>
    </div>
  )
}
