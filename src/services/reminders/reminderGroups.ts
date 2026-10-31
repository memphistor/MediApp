import type { DoseLog } from '@/types/dose'
import type { MedicationEntry } from '@/types/medication'
import { isMedicationRemindersEnabled } from '@/lib/medication/medicationReminders'

export interface ReminderGroup {
  groupKey: string
  scheduledAt: string
  logIds: string[]
  lines: string[]
  title: string
  body: string
}

export function buildReminderGroups(
  logs: DoseLog[],
  medications: MedicationEntry[],
  now: Date,
  snoozeUntilByLogId: Record<string, string>,
  persistentAlarmEnabled: boolean,
  repeatAfterMs: number,
): ReminderGroup[] {
  const medById = new Map(medications.map((m) => [m.id, m]))
  const nowMs = now.getTime()

  const due = logs.filter((log) => {
    if (log.status !== 'planned') return false
    if (new Date(log.scheduledAt).getTime() > nowMs) return false
    const med = medById.get(log.medicationId)
    if (med && !isMedicationRemindersEnabled(med)) return false
    const snoozeUntil = snoozeUntilByLogId[log.id]
    if (snoozeUntil && new Date(snoozeUntil).getTime() > nowMs) return false
    if (!log.lastNotifiedAt) return true
    if (!persistentAlarmEnabled) return false
    return nowMs - new Date(log.lastNotifiedAt).getTime() >= repeatAfterMs
  })

  const byTime = new Map<string, DoseLog[]>()
  for (const log of due) {
    const key = log.scheduledAt
    const list = byTime.get(key) ?? []
    list.push(log)
    byTime.set(key, list)
  }

  const groups: ReminderGroup[] = []
  for (const [scheduledAt, groupLogs] of byTime) {
    const lines = groupLogs.map((log) => {
      const med = medById.get(log.medicationId)
      if (!med) return 'Pozycja'
      const stomach =
        med.onEmptyStomach === 'yes' ? 'Na czczo (twoja notatka)' : undefined
      return [med.name, med.doseText, stomach].filter(Boolean).join(' · ')
    })
    const timeLabel = new Date(scheduledAt).toLocaleTimeString('pl-PL', {
      hour: '2-digit',
      minute: '2-digit',
    })
    const title =
      groupLogs.length > 1
        ? `${timeLabel}: ${groupLogs.length} pozycje`
        : lines[0] ?? 'Przypomnienie'
    const body =
      groupLogs.length > 1 ? lines.join('\n') : (lines[0] ?? '')

    groups.push({
      groupKey: scheduledAt,
      scheduledAt,
      logIds: groupLogs.map((l) => l.id),
      lines,
      title,
      body,
    })
  }

  return groups.sort(
    (a, b) =>
      new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime(),
  )
}

export const PERSISTENT_REMINDER_MS = 5 * 60 * 1000
