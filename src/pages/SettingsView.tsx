import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { appPath } from '@/lib/profil/profilNavigation'
import { useSettings } from '@/context/SettingsContext'
import { getActiveProfilId } from '@/db/database'
import {
  buildShareableProfilUrl,
  copyTextToClipboard,
  startProfilLink,
} from '@/lib/profil/profilLink'
import { buildAppUrlWithProfil } from '@/lib/profil/profilId'
import { pl } from '@/i18n/pl'
import type { FontScale, ThemePreference } from '@/types/settings'

export function SettingsView() {
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
  const navigate = useNavigate()
  const [message, setMessage] = useState<string | null>(null)
  const [newProfilSlug, setNewProfilSlug] = useState('testfp')
  const profilId = getActiveProfilId()
  const profilUrl = profilId ? buildAppUrlWithProfil(profilId) : null

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
          {pl.settings.notifications}
        </h3>
        <label className="mt-2 flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            className="h-5 w-5"
            checked={settings.notificationsEnabled}
            onChange={(e) => {
              void setNotificationsEnabled(e.target.checked)
            }}
          />
          {pl.settings.notificationsEnable}
        </label>
        <p className="mt-2 text-xs text-[var(--color-text-muted)]">
          {pl.settings.notificationsHint}
        </p>
        <p className="mt-1 text-xs text-[var(--color-text-muted)]">
          {pl.settings.notificationsPerMed}
        </p>
        {'Notification' in window &&
          Notification.permission === 'denied' &&
          settings.notificationsEnabled && (
            <p className="mt-2 text-xs text-amber-700 dark:text-amber-300">
              {pl.settings.permissionDenied}
            </p>
          )}
        <label className="mt-4 block text-sm">
          {pl.settings.snoozeMinutes}
          <input
            type="number"
            min={1}
            max={120}
            className="mt-1 w-full min-h-11 rounded-xl border border-[var(--color-border)] px-3"
            value={settings.snoozeMinutesDefault}
            onChange={(e) =>
              setSnoozeMinutesDefault(Number(e.target.value))
            }
          />
        </label>
        <Link
          to={appPath('/help/notifications')}
          className="mt-3 inline-flex min-h-11 items-center text-sm font-medium text-brand"
        >
          {pl.settings.notificationLimits}
        </Link>
        <label className="mt-3 flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            className="h-5 w-5"
            checked={settings.persistentAlarmEnabled}
            onChange={(e) => setPersistentAlarmEnabled(e.target.checked)}
          />
          {pl.settings.persistentAlarm}
        </label>
        <p className="mt-1 text-xs text-[var(--color-text-muted)]">
          {pl.settings.persistentAlarmHint}
        </p>
      </section>

      <section>
        <h3 className="text-sm font-semibold text-[var(--color-text-muted)]">
          {pl.settings.profilTitle}
        </h3>
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">
          {pl.settings.profilHint}
        </p>
        {profilId && profilUrl ? (
          <div className="mt-3 space-y-2">
            <p className="text-sm">
              {pl.settings.profilActive}:{' '}
              <code className="rounded bg-[var(--color-surface)] px-1.5 py-0.5 text-xs">
                {profilId}
              </code>
            </p>
            <p className="break-all rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-xs">
              {profilUrl}
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                className="min-h-11 rounded-xl border border-brand bg-brand/10 text-sm font-semibold text-brand"
                onClick={() => {
                  void copyTextToClipboard(profilUrl).then((ok) => {
                    setMessage(
                      ok ? pl.settings.profilCopied : pl.settings.profilCopyFailed,
                    )
                  })
                }}
              >
                {pl.settings.profilCopyLink}
              </button>
              <button
                type="button"
                className="min-h-11 rounded-xl border border-[var(--color-border)] text-sm font-medium"
                onClick={() => {
                  void buildShareableProfilUrl({ includeKopiaInHash: true }).then(
                    ({ url, kopiaOmitted }) => {
                      void copyTextToClipboard(url).then((ok) => {
                        if (kopiaOmitted) {
                          setMessage(pl.settings.profilKopiaTooLarge)
                        } else {
                          setMessage(
                            ok
                              ? pl.settings.profilCopied
                              : pl.settings.profilCopyFailed,
                          )
                        }
                      })
                    },
                  )
                }}
              >
                {pl.settings.profilCopyWithKopia}
              </button>
            </div>
            <p className="text-xs text-[var(--color-text-muted)]">
              {pl.settings.profilKopiaNote}
            </p>
          </div>
        ) : (
          <div className="mt-3 space-y-2">
            <p className="text-sm text-[var(--color-text-muted)]">
              {pl.settings.profilNone}
            </p>
            <label className="block text-sm">
              Końcówka linku (litery, cyfry)
              <input
                className="mt-1 w-full min-h-11 rounded-xl border border-[var(--color-border)] px-3 font-mono text-sm"
                value={newProfilSlug}
                onChange={(e) => setNewProfilSlug(e.target.value)}
                placeholder="testfp"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
              />
            </label>
            <button
              type="button"
              className="min-h-12 w-full rounded-xl bg-brand text-sm font-semibold text-white"
              onClick={() => startProfilLink(newProfilSlug)}
            >
              {pl.settings.profilCreate}
            </button>
          </div>
        )}
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
        <Link
          to="/privacy"
          className="flex min-h-11 w-full items-center justify-center rounded-xl border border-[var(--color-border)] text-sm"
        >
          {pl.settings.dataInfo}
        </Link>
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
      </section>
    </div>
  )
}
