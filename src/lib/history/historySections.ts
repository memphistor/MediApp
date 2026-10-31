import type { DoseLog } from '@/types/dose'

export function isPlannedUpcoming(log: DoseLog, now = new Date()): boolean {
  return (
    log.status === 'planned' &&
    new Date(log.scheduledAt).getTime() > now.getTime()
  )
}

export function splitHistoryLogs(
  logs: DoseLog[],
  now = new Date(),
): { past: DoseLog[]; planned: DoseLog[] } {
  const past: DoseLog[] = []
  const planned: DoseLog[] = []
  for (const log of logs) {
    if (isPlannedUpcoming(log, now)) planned.push(log)
    else past.push(log)
  }
  past.sort(
    (a, b) =>
      new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime(),
  )
  planned.sort(
    (a, b) =>
      new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime(),
  )
  return { past, planned }
}
