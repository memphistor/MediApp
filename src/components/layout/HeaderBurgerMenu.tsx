import { useEffect, useId, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { appPath } from '@/lib/profil/profilNavigation'
import { pl } from '@/i18n/pl'

export function HeaderBurgerMenu() {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const menuId = useId()
  const location = useLocation()

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('touchstart', onPointerDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('touchstart', onPointerDown)
    }
  }, [open])

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        className="flex min-h-11 min-w-11 flex-col items-center justify-center gap-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-2.5 text-[var(--color-text)] hover:border-brand/40"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
        aria-label={pl.nav.menuOpen}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="block h-0.5 w-5 rounded-full bg-current" />
        <span className="block h-0.5 w-5 rounded-full bg-current" />
        <span className="block h-0.5 w-5 rounded-full bg-current" />
      </button>
      {open && (
        <div
          id={menuId}
          role="menu"
          className="absolute right-0 top-full z-30 mt-2 min-w-[11rem] rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] py-1 shadow-lg"
        >
          <Link
            role="menuitem"
            to={appPath('/settings')}
            className="flex min-h-11 items-center px-4 text-sm font-medium text-[var(--color-text)] hover:bg-brand/10"
            onClick={() => setOpen(false)}
          >
            {pl.nav.settings}
          </Link>
        </div>
      )}
    </div>
  )
}
