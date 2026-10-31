import { Link, NavLink, Outlet } from 'react-router-dom'
import { AppLogo } from '@/components/brand/AppLogo'
import {
  BottomNavIcon,
  type BottomNavIconId,
} from '@/components/layout/BottomNavIcon'
import { pl } from '@/i18n/pl'
import { appPath } from '@/lib/profil/profilNavigation'
import { useDoseLogSync } from '@/hooks/useDoseLogSync'
import { useProfilBackupLoop } from '@/hooks/useProfilBackupLoop'
import { useReminderWatcher } from '@/hooks/useReminderWatcher'

const mainNav: {
  to: string
  label: string
  icon: BottomNavIconId
  end?: boolean
  accent?: boolean
}[] = [
  { to: '/', label: pl.nav.today, icon: 'today', end: true },
  { to: '/calendar', label: pl.nav.calendar, icon: 'calendar' },
  { to: '/add', label: pl.nav.add, icon: 'add', accent: true },
  { to: '/progress', label: pl.nav.progress, icon: 'progress' },
  { to: '/history', label: pl.nav.history, icon: 'history' },
]

export function AppShell() {
  const { ready } = useDoseLogSync()
  useReminderWatcher()
  useProfilBackupLoop()

  if (!ready) {
    return (
      <div className="flex min-h-dvh items-center justify-center text-[var(--color-text-muted)]">
        Ładowanie…
      </div>
    )
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-lg flex-col bg-[var(--color-surface)]">
      <header className="safe-top sticky top-0 z-10 border-b border-[var(--color-border)] bg-[var(--color-surface-elevated)]/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <AppLogo size="md" decorative />
            <div className="min-w-0">
              <h1 className="text-lg font-semibold text-[var(--color-text)]">
                {pl.appName}
              </h1>
              <p className="text-xs text-[var(--color-text-muted)]">
                {pl.appTagline}
              </p>
            </div>
          </div>
          <Link
            to={appPath('/settings')}
            className="inline-flex min-h-11 items-center rounded-xl px-3 text-sm font-medium text-brand"
          >
            {pl.nav.settings}
          </Link>
        </div>
      </header>

      <main className="flex-1 px-4 py-4 pb-24">{<Outlet />}</main>

      <nav
        className="safe-bottom fixed bottom-0 left-0 right-0 z-20 border-t border-[var(--color-border)]/80 bg-[var(--color-surface-elevated)]/95 backdrop-blur-md"
        aria-label="Główna nawigacja"
      >
        <ul className="mx-auto flex max-w-lg items-stretch justify-around px-2 pb-1 pt-1.5">
          {mainNav.map((item) => (
            <li key={item.to} className="flex min-w-0 flex-1 justify-center">
              <NavLink
                to={appPath(item.to === '/' ? '/' : item.to)}
                end={item.end ?? false}
                className={({ isActive }) =>
                  [
                    'flex min-h-[3.25rem] min-w-[3.25rem] flex-col items-center justify-center gap-0.5 rounded-2xl px-1 py-1 transition-colors',
                    item.accent || isActive
                      ? 'text-brand'
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]',
                  ].join(' ')
                }
              >
                {({ isActive }) => (
                  <>
                    <BottomNavIcon
                      id={item.icon}
                      active={isActive}
                    />
                    <span
                      className={`max-w-full truncate text-[10px] font-medium leading-tight tracking-tight ${
                        isActive ? 'text-brand' : ''
                      }`}
                    >
                      {item.label}
                    </span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
