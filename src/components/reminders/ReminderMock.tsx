import { pl } from '@/i18n/pl'
import { DEMO_MEDICATION } from '@/data/demo'

export function ReminderMock() {
  const stomach =
    DEMO_MEDICATION.onEmptyStomach === 'yes'
      ? 'Na czczo (twoja notatka)'
      : undefined
  const body = [DEMO_MEDICATION.name, DEMO_MEDICATION.doseText, stomach]
    .filter(Boolean)
    .join(' · ')

  return (
    <section
      className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-4"
      aria-label={pl.reminder.mockTitle}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
        {pl.reminder.mockTitle}
      </p>
      <p className="mt-2 text-sm text-[var(--color-text-muted)]">
        {pl.reminder.grouped}
      </p>
      <p className="mt-1 font-medium text-[var(--color-text)]">{body}</p>
      <div className="mt-4 grid grid-cols-3 gap-2">
        <button
          type="button"
          className="min-h-12 rounded-xl bg-brand px-2 text-sm font-semibold text-white"
        >
          {pl.reminder.taken}
        </button>
        <button
          type="button"
          className="min-h-12 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-2 text-sm font-medium"
        >
          {pl.reminder.snooze}
        </button>
        <button
          type="button"
          className="min-h-12 rounded-xl border border-[var(--color-border)] px-2 text-sm font-medium text-[var(--color-text-muted)]"
        >
          {pl.reminder.skip}
        </button>
      </div>
      <button
        type="button"
        className="mt-2 w-full min-h-11 rounded-xl text-sm font-medium text-brand"
      >
        {pl.reminder.takeAll}
      </button>
    </section>
  )
}
