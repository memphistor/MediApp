import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { pl } from '@/i18n/pl'
import { useDoseLogSync } from '@/hooks/useDoseLogSync'
import { useReminderWatcher } from '@/hooks/useReminderWatcher'

const mainNav = [
  { to: '/', label: pl.nav.today, end: true },
  { to: '/calendar', label: pl.nav.calendar },
  { to: '/add', label: pl.nav.add, accent: true },
  { to: '/progress', label: pl.nav.progress },
  { to: '/settings', label: pl.nav.settings },
] as const

export function AppShell() {
  const { ready } = useDoseLogSync()
  useReminderWatcher()
  const location = useLocation()
  const hideNav = location.pathname === '/add'

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
          <div>
            <h1 className="text-lg font-semibold text-[var(--color-text)]">
              {pl.appName}
            </h1>
            <p className="text-xs text-[var(--color-text-muted)]">
              {pl.appTagline}
            </p>
          </div>
          <NavLink
            to="/history"
            className="min-h-11 min-w-11 rounded-lg px-2 text-sm font-medium text-brand underline-offset-2 hover:underline"
          >
            {pl.history.title}
          </NavLink>
        </div>
      </header>

      <main className="flex-1 px-4 py-4 pb-24">{<Outlet />}</main>

      {!hideNav && (
        <nav
          className="safe-bottom fixed bottom-0 left-0 right-0 z-20 border-t border-[var(--color-border)] bg-[var(--color-surface-elevated)]"
          aria-label="Główna nawigacja"
        >
          <ul className="mx-auto flex max-w-lg justify-around px-1 py-1">
            {mainNav.map((item) => (
              <li key={item.to} className="flex-1">
                <NavLink
                  to={item.to}
                  end={'end' in item ? item.end : false}
                  className={({ isActive }) =>
                    [
                      'flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-xl text-xs font-medium transition-colors',
                      'accent' in item && item.accent
                        ? 'text-brand'
                        : isActive
                          ? 'text-brand'
                          : 'text-[var(--color-text-muted)]',
                    ].join(' ')
                  }
                >
                  <span className="text-base leading-none">
                    {'accent' in item && item.accent ? '＋' : '•'}
                  </span>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  )
}
