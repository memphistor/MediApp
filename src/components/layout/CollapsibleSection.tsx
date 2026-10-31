import { useId, useState, type ReactNode } from 'react'

type CollapsibleSectionProps = {
  title: string
  count?: number
  defaultOpen?: boolean
  children: ReactNode
}

export function CollapsibleSection({
  title,
  count,
  defaultOpen = false,
  children,
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen)
  const panelId = useId()

  return (
    <section className="overflow-hidden rounded-xl border border-[var(--color-border)]">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-semibold hover:bg-[var(--color-surface-elevated)]"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        <span>{title}</span>
        <span className="flex items-center gap-2 font-normal text-[var(--color-text-muted)]">
          {count !== undefined && (
            <span className="tabular-nums">{count}</span>
          )}
          <span
            className={`inline-block text-xs transition-transform ${open ? 'rotate-180' : ''}`}
            aria-hidden
          >
            ▼
          </span>
        </span>
      </button>
      {open && (
        <div id={panelId} className="border-t border-[var(--color-border)]">
          {children}
        </div>
      )}
    </section>
  )
}
