import { pl } from '@/i18n/pl'

export function ProgressView() {
  const ringProgress = 0.75
  const circumference = 2 * Math.PI * 52
  const offset = circumference * (1 - ringProgress)

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">{pl.progress.title}</h2>
      <p className="text-sm text-[var(--color-text-muted)]">{pl.progress.demo}</p>

      <div className="flex flex-col items-center">
        <p className="mb-2 text-sm font-medium">{pl.progress.dayRing}</p>
        <svg width="120" height="120" viewBox="0 0 120 120" aria-hidden>
          <circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            stroke="var(--color-border)"
            strokeWidth="10"
          />
          <circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            stroke="#0f766e"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 60 60)"
          />
        </svg>
        <p className="mt-2 text-2xl font-bold">3 / 4</p>
        <p className="text-sm text-[var(--color-text-muted)]">
          dziś zapisano 3 z 4 pozycji
        </p>
      </div>

      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-4">
        <p className="font-semibold">{pl.progress.streak}</p>
        <p className="mt-1 text-3xl font-bold text-brand">12 dni</p>
        <p className="mt-2 text-xs text-[var(--color-text-muted)]">
          {pl.progress.shield} 🛡️
        </p>
      </div>

      <div>
        <p className="font-semibold">{pl.progress.badges}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {['Tydzień', 'Miesiąc', '100 dawek'].map((b) => (
            <span
              key={b}
              className="rounded-full bg-brand/15 px-3 py-1 text-sm font-medium text-brand"
            >
              {b}
            </span>
          ))}
        </div>
      </div>

      <p className="text-sm text-[var(--color-text-muted)]">{pl.progress.stats}</p>
    </div>
  )
}
