import { pl } from '@/i18n/pl'

export function DisclaimerBanner({ className = '' }: { className?: string }) {
  return (
    <aside
      className={`rounded-xl border border-amber-200/80 bg-amber-50 px-3 py-2 text-xs leading-snug text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-100 ${className}`}
      role="note"
    >
      <strong className="font-semibold">{pl.disclaimer.title}:</strong>{' '}
      {pl.disclaimer.short}
    </aside>
  )
}
