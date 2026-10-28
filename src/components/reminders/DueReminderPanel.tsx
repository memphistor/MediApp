import { useLiveQuery } from 'dexie-react-hooks'
import { useSettings } from '@/context/SettingsContext'
import { pl } from '@/i18n/pl'
import {
  applyReminderAction,
  type ReminderAction,
} from '@/services/reminders/reminderActions'
import { getInAppDueGroups } from '@/services/reminders/reminderEngine'
import type { ReminderGroup } from '@/services/reminders/reminderGroups'

export function DueReminderPanel() {
  const { settings, replaceSettings } = useSettings()
  const showInApp =
    !settings.notificationsEnabled ||
    !('Notification' in window) ||
    Notification.permission !== 'granted'

  const groups = useLiveQuery(
    async () => {
      if (!showInApp) return []
      return getInAppDueGroups(settings)
    },
    [settings, showInApp],
    [] as ReminderGroup[],
  )

  const group = groups?.[0]
  if (!group) return null

  const run = (action: ReminderAction) => {
    void applyReminderAction(action, group.logIds, settings).then(replaceSettings)
    if (action === 'taken' || action === 'taken-all') {
      navigator.vibrate?.(10)
    }
  }

  return (
    <section
      className="rounded-2xl border border-brand/40 bg-[var(--color-surface-elevated)] p-4"
      aria-label={pl.reminder.activeTitle}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-brand">
        {pl.reminder.activeTitle}
      </p>
      {group.logIds.length > 1 && (
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          {pl.reminder.groupedCount.replace(
            '{count}',
            String(group.logIds.length),
          )}
        </p>
      )}
      <ul className="mt-2 space-y-1 text-sm font-medium">
        {group.lines.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
      <div className="mt-4 grid grid-cols-3 gap-2">
        <button
          type="button"
          className="min-h-12 rounded-xl bg-brand px-2 text-sm font-semibold text-white"
          onClick={() =>
            run(group.logIds.length > 1 ? 'taken-all' : 'taken')
          }
        >
          {group.logIds.length > 1 ? pl.reminder.takeAll : pl.reminder.taken}
        </button>
        <button
          type="button"
          className="min-h-12 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-2 text-sm font-medium"
          onClick={() => run('snooze')}
        >
          {pl.reminder.snooze}
        </button>
        <button
          type="button"
          className="min-h-12 rounded-xl border border-[var(--color-border)] px-2 text-sm font-medium text-[var(--color-text-muted)]"
          onClick={() => run('skip')}
        >
          {pl.reminder.skip}
        </button>
      </div>
    </section>
  )
}
